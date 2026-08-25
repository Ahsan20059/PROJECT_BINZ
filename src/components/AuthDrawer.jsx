import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';

export default function AuthDrawer({ isOpen, onClose, coins, updateCoins, setFirstName }) {
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('Uttar Pradesh');
  const [status, setStatus] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const name = fName.trim() || 'Guest';
    setFirstName(name);
    localStorage.setItem('firstName', name);
    localStorage.setItem('lastName', lName.trim());
    localStorage.setItem('email', email.trim().toLowerCase());
    localStorage.setItem('state', state.trim());
    updateCoins(Math.max(coins, 5));
    setStatus(`Welcome, ${name}. Account saved for this demo.`);
  }

  return (
    <aside
      className={`drawer${isOpen ? ' open' : ''}`}
      id="authPanel"
      aria-hidden={!isOpen}
      aria-label="Account panel"
    >
      <div className="drawer-head">
        <div>
          <p className="eyebrow">Account</p>
          <h2>Sign in or register</h2>
        </div>
        <button className="icon-button" type="button" aria-label="Close account" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      <form id="authForm" className="stacked-form" onSubmit={handleSubmit}>
        <input
          id="firstName"
          type="text"
          placeholder="First name"
          required
          value={fName}
          onChange={(e) => setFName(e.target.value)}
        />
        <input
          id="lastName"
          type="text"
          placeholder="Last name"
          value={lName}
          onChange={(e) => setLName(e.target.value)}
        />
        <input
          id="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          id="state"
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
        <button className="button primary full" type="submit">
          <UserPlus size={18} /> Save account
        </button>
        {status && <p id="authStatus" className="form-status">{status}</p>}
      </form>
    </aside>
  );
}
