import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import './AdminPanel.css';

const AdminPanel = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // 添加选手表单状态
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    extractionValue: '',
    redValue: '',
    kills: '',
  });

  // 编辑状态
  const [editingPlayer, setEditingPlayer] = useState(null);

  const fetchPlayers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/players');
      if (response.data.success) {
        setPlayers(response.data.players);
        setError('');
      }
    } catch (err) {
      setError('加载选手列表失败');
      console.error('Error fetching players:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const response = await apiClient.get('/auth/check');
      if (response.data.authenticated) {
        setIsAuthenticated(true);
        fetchPlayers();
      } else {
        navigate('/admin/login');
      }
    } catch (err) {
      navigate('/admin/login');
    }
  }, [navigate, fetchPlayers]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/players', formData);
      if (response.data.success) {
        setFormData({ name: '', extractionValue: 0, redValue: 0, kills: 0 });
        setShowAddForm(false);
        fetchPlayers();
      }
    } catch (err) {
      alert(err.response?.data?.message || '添加选手失败');
    }
  };

  const handleUpdatePlayer = async (e) => {
    e.preventDefault();
    try {
      // 将空字符串转换为0
      const dataToSend = {
        name: formData.name,
        extractionValue: formData.extractionValue === '' ? 0 : parseFloat(formData.extractionValue) || 0,
        redValue: formData.redValue === '' ? 0 : parseFloat(formData.redValue) || 0,
        kills: formData.kills === '' ? 0 : parseFloat(formData.kills) || 0,
      };
      const response = await apiClient.patch(`/players/${editingPlayer._id}`, dataToSend);
      if (response.data.success) {
        setEditingPlayer(null);
        setFormData({ name: '', extractionValue: '', redValue: '', kills: '' });
        fetchPlayers();
      }
    } catch (err) {
      alert(err.response?.data?.message || '更新选手失败');
    }
  };

  const handleDeletePlayer = async (id) => {
    if (!window.confirm('确定要删除这位选手吗？')) {
      return;
    }

    try {
      const response = await apiClient.delete(`/players/${id}`);
      if (response.data.success) {
        fetchPlayers();
      }
    } catch (err) {
      alert('删除选手失败');
    }
  };

  const handleEditClick = (player) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      extractionValue: player.extractionValue || '',
      redValue: player.redValue || '',
      kills: player.kills || '',
    });
    setShowAddForm(false);
  };

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // 清除 token
      localStorage.removeItem('authToken');
      navigate('/admin/login');
    }
  };

  const calculateScore = (extractionValue, redValue, kills) => {
    return extractionValue - redValue + kills * 250000;
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('zh-CN').format(num);
  };

  if (!isAuthenticated) {
    return <div className="loading">验证中...</div>;
  }

  return (
    <div className="admin-panel-container">
      <header className="admin-header">
        <h1>主办方管理面板</h1>
        <div className="admin-actions">
          <button onClick={() => { setShowAddForm(true); setEditingPlayer(null); setFormData({ name: '', extractionValue: '', redValue: '', kills: '' }); }} className="btn btn-primary">
            添加选手
          </button>
          <button onClick={handleLogout} className="btn btn-secondary">
            登出
          </button>
        </div>
      </header>

      <main className="admin-main">
        {error && <div className="error-message">{error}</div>}

        {(showAddForm || editingPlayer) && (
          <div className="form-card">
            <h2>{editingPlayer ? '编辑选手' : '添加新选手'}</h2>
            <form onSubmit={editingPlayer ? handleUpdatePlayer : handleAddPlayer}>
              <div className="form-row">
                <div className="form-group">
                  <label>选手姓名 *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>撤离价值</label>
                  <input
                    type="number"
                    value={formData.extractionValue}
                    onChange={(e) => setFormData({ ...formData, extractionValue: e.target.value })}
                    min="0"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>大红价值</label>
                  <input
                    type="number"
                    value={formData.redValue}
                    onChange={(e) => setFormData({ ...formData, redValue: e.target.value })}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>人头数</label>
                  <input
                    type="number"
                    value={formData.kills}
                    onChange={(e) => setFormData({ ...formData, kills: e.target.value })}
                    min="0"
                  />
                </div>
              </div>
              <div className="form-preview">
                <strong>预估总分：</strong> {formatNumber(calculateScore(
                  formData.extractionValue === '' ? 0 : parseFloat(formData.extractionValue) || 0,
                  formData.redValue === '' ? 0 : parseFloat(formData.redValue) || 0,
                  formData.kills === '' ? 0 : parseFloat(formData.kills) || 0
                ))}
                <span className="formula">（撤离价值 - 大红价值 + 人头数 × 250,000）</span>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingPlayer ? '保存修改' : '添加选手'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingPlayer(null);
                    setFormData({ name: '', extractionValue: '', redValue: '', kills: '' });
                  }}
                  className="btn btn-cancel"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="players-table-card">
          <h2>选手列表</h2>
          {loading ? (
            <div className="loading">加载中...</div>
          ) : players.length === 0 ? (
            <div className="empty">暂无选手数据</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>排名</th>
                  <th>姓名</th>
                  <th>撤离价值</th>
                  <th>大红价值</th>
                  <th>人头数</th>
                  <th>总分</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <tr key={player._id}>
                    <td>{index + 1}</td>
                    <td>{player.name}</td>
                    <td>{formatNumber(player.extractionValue)}</td>
                    <td>{formatNumber(player.redValue)}</td>
                    <td>{player.kills}</td>
                    <td className="score-cell">{formatNumber(player.totalScore)}</td>
                    <td className="actions-cell">
                      <button onClick={() => handleEditClick(player)} className="btn-edit">编辑</button>
                      <button onClick={() => handleDeletePlayer(player._id)} className="btn-delete">删除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <footer className="admin-footer">
        <a href="/">查看排行榜</a>
      </footer>
    </div>
  );
};

export default AdminPanel;
