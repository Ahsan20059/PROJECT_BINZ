import React, { useState } from 'react';
import { CalendarCheck, MapPin } from 'lucide-react';
import { demoImpactStats } from '../data';

const BOOKING_COOLDOWN = 60 * 1000;

function computeImpact(entries) {
  const solid = entries.reduce((sum, entry) => sum + entry.solid, 0);
  const ewaste = entries.reduce((sum, entry) => sum + entry.ewaste, 0);

  return solid * 0.9 + ewaste * 2.6;
}

export default function HeroSection({
  entries,
  updateCoins,
  coins,
  pickupStatus,
  setPickupStatus,
}) {
  const [phone, setPhone] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const co2 = demoImpactStats.co2Reduced + computeImpact(entries);
  const today = new Date().toISOString().split('T')[0];

  function handleSubmit(event) {
    event.preventDefault();

    const number = phone.replace(/\D/g, '');

    if (!/^[6-9]\d{9}$/.test(number)) {
      setPickupStatus({
        msg: 'Enter a valid Indian 10-digit mobile number.',
        error: true,
      });
      return;
    }

    setPhone(number);
    setPickupStatus({ msg: '', error: false });
    setShowCalendar(true);
  }

  function confirmBooking(event) {
    event.preventDefault();

    const rateLimitKey = `pickupBookingRate:${phone}`;
    const lastBooking = Number(localStorage.getItem(rateLimitKey) || 0);
    const elapsedTime = Date.now() - lastBooking;
    const remainingTime = BOOKING_COOLDOWN - elapsedTime;

    if (remainingTime > 0) {
      const seconds = Math.ceil(remainingTime / 1000);

      setPickupStatus({
        msg: `Please wait ${seconds} seconds before booking again.`,
        error: true,
      });
      return;
    }

    setIsBooking(true);

    const booking = {
      phone: `+91${phone}`,
      date,
      slot,
    };

    localStorage.setItem('pickupBooking', JSON.stringify(booking));
    localStorage.setItem(rateLimitKey, String(Date.now()));

    updateCoins(coins + 2);
    setShowCalendar(false);
    setIsBooking(false);
    setPickupStatus({
      msg: 'Pickup booked successfully. +2 Z-Coins awarded.',
      error: false,
    });
  }

  return (
    <section id="home" className="hero section-band">
      <div className="hero-copy">
        <p className="eyebrow">Put your trash back to work</p>

        <h1>
          Clean neighborhoods. Fair{' '}
          <span className="highlight">scrap</span> prices.
        </h1>

        <p className="hero-text">
          BinZ helps homes, hostels and campuses schedule scrap pickups, track
          their carbon impact, raise e-waste tickets and earn Z-Coins.
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
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value.replace(/\D/g, ''))
              }
              required
            />

            <button className="button primary" type="submit">
              <CalendarCheck size={18} />
              Book
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

      {showCalendar && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="calendarTitle"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'grid',
            placeItems: 'center',
            padding: '20px',
            background: 'rgba(0, 0, 0, 0.55)',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: 'min(100%, 380px)',
              padding: '24px',
              background: '#fff',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
          >
            <button
              type="button"
              onClick={() => setShowCalendar(false)}
              aria-label="Close calendar"
              style={{
                position: 'absolute',
                top: '8px',
                right: '12px',
                border: 0,
                background: 'transparent',
                fontSize: '28px',
                cursor: 'pointer',
              }}
            >
              ×
            </button>

            <h3 id="calendarTitle">Choose pickup slot</h3>

            <form
              onSubmit={confirmBooking}
              style={{ display: 'grid', gap: '12px' }}
            >
              <label htmlFor="pickupDate">Pickup date</label>

              <input
                id="pickupDate"
                type="date"
                min={today}
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />

              <label htmlFor="pickupSlot">Time slot</label>

              <select
                id="pickupSlot"
                value={slot}
                onChange={(event) => setSlot(event.target.value)}
                required
              >
                <option value="">Select a time slot</option>
                <option>9:00 AM - 11:00 AM</option>
                <option>11:00 AM - 1:00 PM</option>
                <option>2:00 PM - 4:00 PM</option>
                <option>4:00 PM - 6:00 PM</option>
              </select>

              <button
                className="button primary"
                type="submit"
                disabled={isBooking}
              >
                {isBooking ? 'Booking...' : 'Confirm pickup'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="hero-visual" aria-label="Recycling collection preview">
        <img
          src="/public/binz-hero-recycling.png"
          alt="Sorted recyclable materials ready for collection"
        />

        <div className="hero-card hero-card-top">
          <MapPin size={20} />
          <span>Greater Noida route live</span>
        </div>

        <div className="hero-card hero-card-bottom">
          <strong>{co2.toFixed(1)} kg</strong>
          <span>CO2 reduced by your entries</span>
        </div>
      </div>
    </section>
  );
}