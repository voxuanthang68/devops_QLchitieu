import React, { useState, useEffect } from 'react';
import { getTransactions, addTransaction, getSummary, deleteTransaction } from './api';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalExpenses: 0, totalIncome: 0, balance: 0, count: 0 });
  const [formData, setFormData] = useState({
    title: '', amount: '', type: 'expense', category: 'Ăn uống', date: '', note: ''
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [notification, setNotification] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const categories = ['Ăn uống', 'Di chuyển', 'Mua sắm', 'Giải trí', 'Hóa đơn', 'Giáo dục', 'Sức khỏe', 'Lương', 'Khác'];

  useEffect(() => {
    fetchData();
  }, [period, filterType, startDate, endDate]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Build params cho summary
      let summaryParams = {};
      if (period === 'custom' && startDate) {
        summaryParams = { startDate, endDate: endDate || startDate };
      } else if (period !== 'all') {
        summaryParams = { period };
      }

      // Build params cho danh sách
      let transParams = {};
      if (filterType !== 'all') transParams.type = filterType;
      if (period === 'custom' && startDate) {
        transParams.startDate = startDate;
        transParams.endDate = endDate || startDate;
      }

      const [transRes, summaryRes] = await Promise.all([
        getTransactions(transParams),
        getSummary(summaryParams)
      ]);

      setTransactions(transRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.amount) return;

    try {
      await addTransaction({
        ...formData,
        amount: Number(formData.amount),
        date: formData.date || new Date().toISOString()
      });
      setFormData({ title: '', amount: '', type: 'expense', category: 'Ăn uống', date: '', note: '' });
      showNotification('✅ Đã thêm giao dịch thành công!');
      fetchData();
    } catch (error) {
      showNotification('❌ Lỗi khi thêm giao dịch!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa giao dịch này?')) return;
    try {
      await deleteTransaction(id);
      showNotification('🗑️ Đã xóa giao dịch!');
      fetchData();
    } catch (error) {
      showNotification('❌ Lỗi khi xóa!');
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Ăn uống': '🍜', 'Di chuyển': '🚗', 'Mua sắm': '🛒',
      'Giải trí': '🎮', 'Hóa đơn': '📄', 'Giáo dục': '📚',
      'Sức khỏe': '💊', 'Lương': '💰', 'Khác': '📌'
    };
    return icons[category] || '📌';
  };

  return (
    <div className="app">
      {/* Notification */}
      {notification && <div className="notification">{notification}</div>}

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>💸 Expense Tracker</h1>
          <p className="subtitle">Quản lý chi tiêu thông minh</p>
        </div>
      </header>

      {/* Dashboard Cards */}
      <section className="dashboard">
        <div className="card card-balance">
          <div className="card-icon">💎</div>
          <div className="card-body">
            <span className="card-label">Số dư hiện tại</span>
            <span className={`card-value ${summary.balance >= 0 ? 'positive' : 'negative'}`}>
              {summary.balance?.toLocaleString('vi-VN')} ₫
            </span>
          </div>
        </div>
        <div className="card card-income">
          <div className="card-icon">📈</div>
          <div className="card-body">
            <span className="card-label">Thu nhập</span>
            <span className="card-value positive">+{summary.totalIncome?.toLocaleString('vi-VN')} ₫</span>
          </div>
        </div>
        <div className="card card-expense">
          <div className="card-icon">📉</div>
          <div className="card-body">
            <span className="card-label">Chi tiêu</span>
            <span className="card-value negative">-{summary.totalExpenses?.toLocaleString('vi-VN')} ₫</span>
          </div>
        </div>
        <div className="card card-count">
          <div className="card-icon">📊</div>
          <div className="card-body">
            <span className="card-label">Giao dịch</span>
            <span className="card-value">{summary.count || 0}</span>
          </div>
        </div>
      </section>

      {/* Period Filter - Tính tổng theo thời gian */}
      <section className="filter-bar">
        <h2>📅 Tổng hợp theo thời gian</h2>
        <div className="period-buttons">
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'today', label: 'Hôm nay' },
            { key: 'week', label: '7 ngày' },
            { key: 'month', label: 'Tháng này' },
            { key: 'year', label: 'Năm nay' },
            { key: 'custom', label: '📆 Chọn ngày' }
          ].map(p => (
            <button
              key={p.key}
              className={`period-btn ${period === p.key ? 'active' : ''}`}
              onClick={() => {
                setPeriod(p.key);
                if (p.key !== 'custom') {
                  setStartDate('');
                  setEndDate('');
                }
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Date Range Picker - Hiện khi chọn "Chọn ngày" */}
        {period === 'custom' && (
          <div className="date-range-picker">
            <div className="date-input-group">
              <label htmlFor="filter-start-date">Từ ngày</label>
              <input
                id="filter-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <span className="date-separator">→</span>
            <div className="date-input-group">
              <label htmlFor="filter-end-date">Đến ngày</label>
              <input
                id="filter-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            {startDate && (
              <button
                className="clear-date-btn"
                onClick={() => { setStartDate(''); setEndDate(''); }}
                title="Xóa bộ lọc ngày"
              >
                ✕ Xóa
              </button>
            )}
          </div>
        )}
      </section>

      <div className="main-layout">
        {/* Form thêm giao dịch */}
        <section className="form-section">
          <h2>➕ Thêm giao dịch</h2>
          <form onSubmit={handleSubmit} className="transaction-form" id="add-transaction-form">
            <div className="input-group">
              <label htmlFor="title">Tiêu đề</label>
              <input
                id="title"
                type="text"
                placeholder="Ví dụ: Ăn trưa, Tiền nhà..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label htmlFor="amount">Số tiền (₫)</label>
                <input
                  id="amount"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="type">Loại</label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="expense">💸 Chi tiêu</option>
                  <option value="income">💰 Thu nhập</option>
                </select>
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label htmlFor="category">Danh mục</label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{getCategoryIcon(c)} {c}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="date">Ngày</label>
                <input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="note">Ghi chú</label>
              <input
                id="note"
                type="text"
                placeholder="Ghi chú thêm (tùy chọn)"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              />
            </div>

            <button type="submit" className="submit-btn" id="submit-btn">
              Xác nhận giao dịch
            </button>
          </form>
        </section>

        {/* Danh sách giao dịch */}
        <section className="history-section">
          <div className="history-header">
            <h2>📋 Lịch sử giao dịch</h2>
            <div className="type-filter">
              {[
                { key: 'all', label: 'Tất cả' },
                { key: 'expense', label: 'Chi tiêu' },
                { key: 'income', label: 'Thu nhập' }
              ].map(f => (
                <button
                  key={f.key}
                  className={`filter-btn ${filterType === f.key ? 'active' : ''}`}
                  onClick={() => setFilterType(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="transaction-list" id="transaction-list">
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <p>Chưa có giao dịch nào</p>
                <small>Hãy thêm giao dịch đầu tiên!</small>
              </div>
            ) : (
              (() => {
                let lastDate = null;
                return transactions.map(t => {
                  const currentDate = new Date(t.date).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });
                  const showSeparator = currentDate !== lastDate;
                  lastDate = currentDate;

                  return (
                    <React.Fragment key={t._id}>
                      {showSeparator && <div className="date-divider">{currentDate}</div>}
                      <div className={`transaction-item ${t.type}`} id={`transaction-${t._id}`}>
                        <div className="item-left">
                          <span className="item-icon">{getCategoryIcon(t.category)}</span>
                          <div className="item-info">
                            <strong>{t.title}</strong>
                            <span className="item-meta">
                              {t.category} • {new Date(t.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        <div className="item-right">
                          <span className={`item-amount ${t.type}`}>
                            {t.type === 'expense' ? '-' : '+'}{Number(t.amount).toLocaleString('vi-VN')} ₫
                          </span>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(t._id)}
                            title="Xóa giao dịch"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                });
              })()
            )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>Expense Tracker — DevOps Project © 2026</p>
      </footer>
    </div>
  );
}

export default App;
