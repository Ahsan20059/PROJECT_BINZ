import React from 'react';
// import { defaultLeaders } from '../data';

const medals = ['🥇', '🥈', '🥉'];

export default function LeaderboardSection({ coins, firstName }) {
  const currentName = firstName && firstName !== 'Guest' ? firstName : 'Guest';
  const merged = [ { name: currentName, coins }]
    .sort((a, b) => b.coins - a.coins)
    .slice(0, 4);

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
          {merged.map((user, index) => (
            <div key={user.name + index} className="leader-row">
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
