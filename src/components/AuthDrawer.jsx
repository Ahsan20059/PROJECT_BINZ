import React, { useState } from 'react';
import { LogIn, UserPlus, X } from 'lucide-react';

export default function AuthDrawer({ isOpen, onClose, updateCoins, setFirstName }) {
  const [mode, setMode] = useState('login');
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState('Uttar Pradesh');
  const [status, setStatus] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5050';

    try {
      const endpoint = mode === 'login' ? '/login' : '/register';
      const body = mode === 'login'
        ? { email: normalizedEmail, password }
        : {
            firstName: fName.trim(),
            lastName: lName.trim(),
            email: normalizedEmail,
            password,
            state: state.trim(),
          };
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Unable to access the account.');
      }

      const account = result.User || result;
      const accountName = account.firstName || fName.trim();
      setFirstName(accountName);
      setFName(account.firstName || '');
      setLName(account.lastName || '');
      setEmail(account.email || normalizedEmail);
      setState(account.state || state);
      localStorage.setItem('firstName', accountName);
      localStorage.setItem('lastName', account.lastName || lName.trim());
      localStorage.setItem('email', account.email || normalizedEmail);
      localStorage.setItem('state', account.state || state.trim());
      updateCoins(Number(account.coins), { persist: false });
      setStatus(`Welcome, ${accountName}. Your wallet has ${account.coins} Z-Coins.`);
    } catch (error) {
      setStatus(error.message || 'Unable to connect to the account service.');
    }
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
          <h2>{mode === 'login' ? 'Sign in' : 'Create account'}</h2>
        </div>
        <button className="icon-button" type="button" aria-label="Close account" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      <div className="auth-modes" role="tablist" aria-label="Account access mode">
        <button
          className={`button${mode === 'login' ? ' primary' : ''}`}
          type="button"
          role="tab"
          aria-selected={mode === 'login'}
          onClick={() => { setMode('login'); setStatus(''); }}
        >
          <LogIn size={16} /> Sign in
        </button>
        <button
          className={`button${mode === 'register' ? ' primary' : ''}`}
          type="button"
          role="tab"
          aria-selected={mode === 'register'}
          onClick={() => { setMode('register'); setStatus(''); }}
        >
          <UserPlus size={16} /> Register
        </button>
      </div>
      <form id="authForm" className="stacked-form" onSubmit={handleSubmit}>
        {mode === 'register' && <>
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
            required
            value={lName}
            onChange={(e) => setLName(e.target.value)}
          />
        </>}
        <input
          id="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          id="password"
          type="password"
          placeholder="Password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {mode === 'register' && <input
          id="state"
          type="text"
          placeholder="State"
          required
          value={state}
          onChange={(e) => setState(e.target.value)}
        />}
        <button className="button primary full" type="submit">
          {mode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
          {mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
        {status && <p id="authStatus" className="form-status">{status}</p>}
      </form>
    </aside>
  );
}
