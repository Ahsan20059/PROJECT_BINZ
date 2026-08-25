import React, { useState } from 'react';
import { ArrowLeft, UserPlus } from 'lucide-react';

export default function SignUpPage({ onAuthenticated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('Creating your account...');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5050'}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: name.trim(),
          lastName: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          state: 'Uttar Pradesh',
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to create account.');
      onAuthenticated(result.User || result);
    } catch (error) {
      setStatus(error.message || 'Unable to connect to the account service.');
    }
  }

  return (
    <main className="auth-page">
      <a className="auth-back-link" href="#home">
        <ArrowLeft size={16} /> Back to BinZ
      </a>
      <section className="auth-card" aria-labelledby="sign-up-title">
        <p className="eyebrow">Join BinZ</p>
        <h1 id="sign-up-title">Create your account</h1>
        <p className="auth-intro">Start managing your pickups, rewards, and recycling impact.</p>
        <form className="stacked-form" onSubmit={handleSubmit}>
          <label htmlFor="signUpName">Name</label>
          <input id="signUpName" type="text" placeholder="Your name" required value={name} onChange={(event) => setName(event.target.value)} />
          <label htmlFor="signUpEmail">Email</label>
          <input id="signUpEmail" type="email" placeholder="you@example.com" required value={email} onChange={(event) => setEmail(event.target.value)} />
          <label htmlFor="signUpPassword">Password</label>
          <input id="signUpPassword" type="password" placeholder="Create a password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} />
          <button className="button primary full" type="submit">
            <UserPlus size={18} /> Sign up
          </button>
          {status && <p className="form-status">{status}</p>}
        </form>
        <p className="auth-switch">
          Already have an account? <a href="#signin">Sign in</a>
        </p>
      </section>
    </main>
  );
}