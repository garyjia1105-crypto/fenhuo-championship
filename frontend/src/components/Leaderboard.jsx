import React, { useState, useEffect } from 'react';
import Countdown from './Countdown';
import apiClient from '../api/client';
import { isCompetitionOver } from '../utils/competition';
import './Leaderboard.css';

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [competitionOver, setCompetitionOver] = useState(isCompetitionOver());

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      // #region agent log
      console.log('[DEBUG] Leaderboard: Starting to fetch players');
      // #endregion
      const response = await apiClient.get('/players');
      // #region agent log
      console.log('[DEBUG] Leaderboard: Fetch successful', response.data);
      // #endregion
      if (response.data.success) {
        setPlayers(response.data.players);
        setError(null);
      }
    } catch (err) {
      // #region agent log
      console.error('[DEBUG] Leaderboard: Fetch failed', {
        message: err.message,
        response: err.response,
        code: err.code,
        config: err.config
      });
      // #endregion
      setError('加载排行榜失败，请稍后重试');
      console.error('Error fetching players:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
    // 每30秒刷新一次排行榜
    const interval = setInterval(fetchPlayers, 30000);
    
    // 每秒钟检查比赛是否结束
    const checkCompetitionStatus = setInterval(() => {
      setCompetitionOver(isCompetitionOver());
    }, 1000);
    
    return () => {
      clearInterval(interval);
      clearInterval(checkCompetitionStatus);
    };
  }, []);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('zh-CN').format(num);
  };

  // 分离有分数和没有分数的选手
  const playersWithScore = players.filter(p => p.totalScore > 0);
  const playersWithoutScore = players.filter(p => p.totalScore === 0);

  return (
    <div className="leaderboard-container">
      <header className="leaderboard-header">
        <h1>烽火冠军赛排行榜</h1>
        <Countdown />
      </header>

      <main className="leaderboard-main">
        {loading && players.length === 0 ? (
          <div className="loading">加载中...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : players.length === 0 ? (
          <div className="empty">暂无选手数据</div>
        ) : (
          <div className="leaderboard-table">
            <table>
              <thead>
                <tr>
                  <th className="rank-col">排名</th>
                  <th className="name-col">选手姓名</th>
                  <th className="score-col">{competitionOver ? '总分' : '分数'}</th>
                </tr>
              </thead>
              <tbody>
                {/* 显示有分数的选手（带排名） */}
                {playersWithScore.map((player, index) => (
                  <tr key={player._id} className={index < 3 ? `rank-${index + 1}` : ''}>
                    <td className="rank-cell">
                      {index === 0 && <span className="medal">🥇</span>}
                      {index === 1 && <span className="medal">🥈</span>}
                      {index === 2 && <span className="medal">🥉</span>}
                      {index >= 3 && <span className="rank-number">{index + 1}</span>}
                    </td>
                    <td className="name-cell">{player.name}</td>
                    <td className="score-cell">
                      {competitionOver ? (
                        formatNumber(player.totalScore)
                      ) : (
                        <span className="score-pending">2月8日公布</span>
                      )}
                    </td>
                  </tr>
                ))}
                {/* 显示没有分数的选手（显示"暂未完成比赛"） */}
                {playersWithoutScore.map((player) => (
                  <tr key={player._id} className="no-score-row">
                    <td className="rank-cell">
                      <span className="no-score-text">暂未完成比赛</span>
                    </td>
                    <td className="name-cell">{player.name}</td>
                    <td className="score-cell">
                      {competitionOver ? (
                        formatNumber(player.totalScore)
                      ) : (
                        <span className="score-pending">2月8日公布</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer className="leaderboard-footer">
        <a href="/admin/login" className="admin-link">主办方登录</a>
      </footer>
    </div>
  );
};

export default Leaderboard;
