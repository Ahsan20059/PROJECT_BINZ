import React, { useCallback, useEffect, useState } from 'react';

const medals = ['🥇', '🥈', '🥉'];

export default function LeaderboardSection() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadLeaderboard = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5050'}/leaderboard`,
      );

      if (!response.ok) throw new Error('Unable to load leaderboard');

      const result = await response.json();
      setEntries(result.leaderboard || []);
      setHasError(false);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaderboard();

    const refreshInterval = window.setInterval(loadLeaderboard, 15000);
    window.addEventListener('focus', loadLeaderboard);

    return () => {
      window.clearInterval(refreshInterval);
      window.removeEventListener('focus', loadLeaderboard);
    };
  }, [loadLeaderboard]);

  return (
    <section id="leaderboard" className="section padded leaderboard-section">
      <div className="section-heading">
        <p className="eyebrow">Uttar Pradesh leaderboard</p>
        <h2>Recycle more. Rise higher.</h2>
      </div>
      <div className="leaderboard">
        <div className="leaderboard-head">
          <span>Rank</span>
          <span>User</span>
          <span>Z-Coins</span>
        </div>
        <div id="leaderboardRows">
          {isLoading && <p className="leaderboard-message">Loading leaderboard...</p>}
          {!isLoading && hasError && (
            <p className="leaderboard-message">Leaderboard is temporarily unavailable.</p>
          )}
          {!isLoading && !hasError && entries.length === 0 && (
            <p className="leaderboard-message">No leaderboard entries yet.</p>
          )}
          {!isLoading && !hasError && entries.map((user, index) => (
            <div key={user._id || user.name + index} className="leader-row">
              <span>
                {index < 3 ? (
                  <span className="rank-medal" aria-label={`Rank ${index + 1}`}>{medals[index]}</span>
                ) : (
                  <span className="rank-plain">{index + 1}.</span>
                )}
              </span>
              <span>{user.name}</span>
              <span>{user.coins}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
