const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================
app.use(cors()); // Cho phép tất cả các nguồn truy cập (CORS)
app.use(express.json());
app.use(morgan('dev'));

// Middleware để kiểm tra request đến (Debug)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// ==================== HEALTHCHECK ====================
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date(),
        database: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED'
    });
});

// ==================== MODEL ====================
const transactionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['expense', 'income'], default: 'expense' },
    category: { type: String, default: 'Chung' },
    date: { type: Date, default: Date.now },
    note: { type: String, default: '' }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// ==================== API ROUTES ====================

// 1. THÊM khoản chi tiêu / thu nhập
app.post('/api/transactions', async (req, res) => {
    try {
        const { title, amount, type, category, date, note } = req.body;

        if (!title || !amount) {
            return res.status(400).json({ message: 'Tiêu đề và số tiền là bắt buộc' });
        }

        const newTransaction = new Transaction({ title, amount, type, category, date, note });
        await newTransaction.save();
        console.log(`✅ Đã thêm giao dịch: ${title} - ${amount}`);
        res.status(201).json(newTransaction);
    } catch (error) {
        console.error('❌ Lỗi khi thêm giao dịch:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// 2. XEM danh sách chi tiêu (có hỗ trợ lọc theo ngày)
app.get('/api/transactions', async (req, res) => {
    try {
        const { startDate, endDate, type } = req.query;
        let filter = {};

        // Lọc theo khoảng thời gian
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate + 'T23:59:59.999Z');
        }

        // Lọc theo loại (expense/income)
        if (type && (type === 'expense' || type === 'income')) {
            filter.type = type;
        }

        const transactions = await Transaction.find(filter).sort({ date: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        console.error('❌ Lỗi khi lấy danh sách:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// 3. TÍNH TỔNG chi tiêu theo thời gian
app.get('/api/transactions/summary', async (req, res) => {
    try {
        const { startDate, endDate, period } = req.query;
        let matchStage = {};

        // Lọc theo khoảng ngày tùy chọn
        if (startDate || endDate) {
            matchStage.date = {};
            if (startDate) matchStage.date.$gte = new Date(startDate);
            if (endDate) matchStage.date.$lte = new Date(endDate + 'T23:59:59.999Z');
        }

        // Lọc nhanh theo period: today, week, month, year
        if (period) {
            const now = new Date();
            let from;
            switch (period) {
                case 'today':
                    from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case 'week':
                    from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'month':
                    from = new Date(now.getFullYear(), now.getMonth(), 1);
                    break;
                case 'year':
                    from = new Date(now.getFullYear(), 0, 1);
                    break;
                default:
                    from = null;
            }
            if (from) {
                matchStage.date = { $gte: from, $lte: now };
            }
        }

        const pipeline = [];
        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        pipeline.push({
            $group: {
                _id: null,
                totalExpenses: {
                    $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
                },
                totalIncome: {
                    $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
                },
                count: { $sum: 1 }
            }
        });

        const summary = await Transaction.aggregate(pipeline);
        const result = summary.length > 0 ? summary[0] : { totalExpenses: 0, totalIncome: 0, count: 0 };

        res.status(200).json({
            totalExpenses: result.totalExpenses,
            totalIncome: result.totalIncome,
            balance: result.totalIncome - result.totalExpenses,
            count: result.count,
            period: period || 'all'
        });
    } catch (error) {
        console.error('❌ Lỗi khi tính tổng:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// 4. XÓA giao dịch
app.delete('/api/transactions/:id', async (req, res) => {
    try {
        const deleted = await Transaction.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Không tìm thấy giao dịch' });
        }
        console.log(`🗑️ Đã xóa giao dịch: ${deleted.title}`);
        res.status(200).json({ message: 'Đã xóa thành công' });
    } catch (error) {
        console.error('❌ Lỗi khi xóa:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// ==================== DATABASE ====================
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Đã kết nối MongoDB'))
    .catch(err => console.error('❌ Không thể kết nối MongoDB', err));

// ==================== START SERVER ====================
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại port ${PORT}`);
});
