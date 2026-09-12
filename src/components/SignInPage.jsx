import React, { useState } from 'react';
import { ArrowLeft, LogIn } from 'lucide-react';

export default function SignInPage({ onAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('Signing in...');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5050'}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to sign in.');
      onAuthenticated(result);
    } catch (error) {
      setStatus(error.message || 'Unable to connect to the account service.');
    }
  }

  return (
    <main className="auth-page">
      <a className="auth-back-link" href="#home">
        <ArrowLeft size={16} /> Back to BinZ
      </a>
      <section className="auth-card" aria-labelledby="sign-in-title">
        <p className="eyebrow">Welcome back</p>
        <h1 id="sign-in-title">Sign in to BinZ</h1>
        <p className="auth-intro">Continue managing your pickups, rewards, and recycling impact.</p>
        <form className="stacked-form" onSubmit={handleSubmit}>
          <label htmlFor="signInEmail">Email</label>
          <input id="signInEmail" type="email" placeholder="you@example.com" required value={email} onChange={(event) => setEmail(event.target.value)} />
          <label htmlFor="signInPassword">Password</label>
          <input id="signInPassword" type="password" placeholder="Enter your password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          <button className="button primary full" type="submit">
            <LogIn size={18} /> Sign in
          </button>
          {status && <p className="form-status">{status}</p>}
        </form>
        <p className="auth-switch">
          New to BinZ? <a href="#signup">Sign up</a>
        </p>
      </section>
    </main>
  );
}