import React, { useState } from 'react';
import { Video, Sparkles, Database, UploadCloud, Coins } from 'lucide-react';

export default function EarnSection({ coins, updateCoins }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [fileLabel, setFileLabel] = useState('Choose cleanup video');
  const [uploadStatus, setUploadStatus] = useState('Coins rewarded: 0 Z-Coins');

  function handleSubmit(e) {
    e.preventDefault();
    const reward = Math.floor(Math.random() * 6) + 5;
    setUploadStatus('Processing cleanup proof...');
    setTimeout(() => {
      updateCoins(coins + reward);
      setUploadStatus(`Coins rewarded: ${reward} Z-Coins`);
    }, 1500);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    setFileLabel(file ? file.name : 'Choose cleanup video');
  }

  return (
    <section id="earn" className="promo-panel">
      <div>
        <p className="eyebrow">Good for your wallet. Good for the planet.</p>
        <h2>Upload cleanup proof and earn Z-Coins</h2>
        <p>
          For the prototype, video verification is simulated in the browser. In the full stack,
          this connects to the detector and reward API described in the README.
        </p>
        <div className="mini-points">
          <span><Video size={19} /> Video proof</span>
          <span><Sparkles size={19} /> Instant reward state</span>
          <span><Database size={19} /> API-ready flow</span>
        </div>
      </div>
      <form id="uploadForm" className="upload-card" onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Your name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          name="email"
          type="email"
          placeholder="Email for reward"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="file-drop" htmlFor="videoInput">
          <UploadCloud size={30} />
          <span id="fileLabel">{fileLabel}</span>
          <input
            id="videoInput"
            name="video"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
          />
        </label>
        <button className="button primary full" type="submit">
          <Coins size={18} /> Upload video
        </button>
        <p id="uploadStatus" className="form-status" aria-live="polite">
          {uploadStatus}
        </p>
      </form>
    </section>
  );
}
