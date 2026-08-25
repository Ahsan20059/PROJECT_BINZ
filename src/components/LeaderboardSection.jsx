import React, { useEffect, useState } from 'react';

const medals = ['🥇', '🥈', '🥉'];

export default function LeaderboardSection() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5050'}/leaderboard`)
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load leaderboard');
        return response.json();
      })
      .then((result) => setEntries(result.leaderboard || []))
      .catch(() => setEntries([]));
  }, []);

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
          {entries.map((user, index) => (
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
