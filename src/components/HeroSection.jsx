import React, { useState } from 'react';
import { CalendarCheck, MapPin } from 'lucide-react';

function computeImpact(entries) {
  const solid = entries.reduce((sum, e) => sum + e.solid, 0);
  const ewaste = entries.reduce((sum, e) => sum + e.ewaste, 0);
  const co2 = solid * 0.9 + ewaste * 2.6;
  return co2;
}

export default function HeroSection({ entries, updateCoins, coins, pickupStatus, setPickupStatus }) {
  const [phone, setPhone] = useState('');
  const co2 = computeImpact(entries);

  function handleSubmit(e) {
    e.preventDefault();
    const val = phone.trim();
    if (!/^[6-9]\d{9}$/.test(val)) {
      setPickupStatus({ msg: 'Enter a valid Indian 10-digit mobile number.', error: true });
      return;
    }
    localStorage.setItem('phoneNumber', val);
    updateCoins(coins + 2);
    setPickupStatus({ msg: 'Pickup booked. Demo wallet awarded +2 Z-Coins.', error: false });
  }

  return (
    <section id="home" className="hero section-band">
      <div className="hero-copy">
        <p className="eyebrow">Put your trash back to work</p>
        <h1>Clean neighborhoods. Fair scrap prices. Rewards you can feel.</h1>
        <p className="hero-text">
          BinZ helps homes, hostels and campuses schedule scrap pickups, track their carbon impact,
          raise e-waste tickets and earn Z-Coins for verified recycling habits.
        </p>
        <form className="booking-card" id="pickupForm" onSubmit={handleSubmit}>
          <label htmlFor="phoneInput">Book a pickup</label>
          <div className="phone-row">
            <span>+91</span>
            <input
              id="phoneInput"
              name="phone"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit mobile"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button className="button primary" type="submit">
              <CalendarCheck size={18} /> Book
            </button>
          </div>
          {pickupStatus.msg && (
            <p
              id="pickupStatus"
              className="form-status"
              aria-live="polite"
              style={{ color: pickupStatus.error ? '#b33b27' : '#174e2a' }}
            >
              {pickupStatus.msg}
            </p>
          )}
        </form>
      </div>
      <div className="hero-visual" aria-label="Recycling collection preview">
        <img src="/assets/binz-hero-recycling.png" alt="Sorted recyclable materials ready for collection" />
        <div className="hero-card hero-card-top">
          <MapPin size={20} />
          <span>Greater Noida route live</span>
        </div>
        <div className="hero-card hero-card-bottom">
          <strong id="heroImpact">{co2.toFixed(1)} kg</strong>
          <span>CO2 reduced by your entries</span>
        </div>
      </div>
    </section>
  );
}
