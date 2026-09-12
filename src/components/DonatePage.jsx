import React, { useState } from 'react';
import { ArrowLeft, Check, Gift, HeartHandshake, MapPin, Recycle, Send } from 'lucide-react';

const donationTypes = ['Electronics', 'Furniture', 'Books', 'Clothing', 'Other'];

export default function DonatePage() {
  const [status, setStatus] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setStatus('Thank you. Your donation request is ready. Our team will call you within one business day to arrange pickup.');
  }

  return (
    <main className="donate-page">
      <a className="auth-back-link" href="#home"><ArrowLeft size={16} /> Back to BinZ</a>
      <section className="donate-hero" aria-labelledby="donate-title">
        <div className="donate-intro">
          <p className="eyebrow">Give more. Waste less.</p>
          <h1 id="donate-title">Pass it on with purpose.</h1>
          <p className="donate-lede">Donate the second-hand things you no longer need. We help useful products find a new home, fund local causes, or reach responsible recyclers.</p>
          <div className="donate-highlights" aria-label="Donation benefits">
            <span><HeartHandshake size={18} /> Help a neighbour</span>
            <span><Recycle size={18} /> Keep items in use</span>
          </div>
        </div>
        <div className="donate-hero-art" aria-hidden="true">
          <div className="donate-art-icon"><Gift size={58} strokeWidth={1.4} /></div>
          <span>One item can start a chain of good.</span>
          <div className="donate-art-line"><span /><span /><span /></div>
        </div>
      </section>
      <section className="donate-layout" aria-label="Donation request">
        <div className="donate-guide">
          <p className="eyebrow">How it works</p>
          <h2>Make room for something meaningful.</h2>
          <div className="donate-step"><span>01</span><div><h3>Tell us about it</h3><p>Share a few details so we can choose the best next home.</p></div></div>
          <div className="donate-step"><span>02</span><div><h3>We arrange pickup</h3><p>Our team confirms a convenient time and collects it from you.</p></div></div>
          <div className="donate-step"><span>03</span><div><h3>See the difference</h3><p>We keep you updated on where your contribution goes.</p></div></div>
        </div>
        <form className="donate-form" onSubmit={handleSubmit}>
          <div className="donate-form-heading"><div className="donate-form-icon"><MapPin size={20} /></div><div><p className="eyebrow">Start a donation</p><h2>What would you like to give?</h2></div></div>
          <label htmlFor="donationType">Item type</label>
          <select id="donationType" required defaultValue=""><option value="" disabled>Select a category</option>{donationTypes.map((type) => <option key={type}>{type}</option>)}</select>
          <label htmlFor="donationDescription">Tell us about the item</label>
          <textarea id="donationDescription" rows="3" placeholder="For example: gently used study table, good condition" required />
          <div className="donate-form-row"><div><label htmlFor="donorName">Your name</label><input id="donorName" type="text" placeholder="Your name" required /></div><div><label htmlFor="donorPhone">Phone number</label><input id="donorPhone" type="tel" placeholder="10-digit number" required /></div></div>
          <label htmlFor="donorAddress">Pickup address</label>
          <input id="donorAddress" type="text" placeholder="Area, city and pincode" required />
          <button className="button primary full" type="submit"><Send size={18} /> Request donation pickup</button>
          <p className="form-status donate-status" aria-live="polite">{status}</p>
        </form>
      </section>
      <p className="donate-note"><Check size={16} /> We accept usable goods and responsibly recycle items that have reached the end of their life.</p>
    </main>
  );
}