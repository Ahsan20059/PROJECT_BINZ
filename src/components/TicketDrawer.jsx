import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';

export default function TicketDrawer({
  isOpen, onClose, ticketTypePreset,
  tickets, setTickets, updateCoins, coins, setEntries, entries,
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [ticketType, setTicketType] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (ticketTypePreset) setTicketType(ticketTypePreset);
  }, [ticketTypePreset]);

  function handleSubmit(e) {
    e.preventDefault();
    const id = `EW-${Math.floor(100000 + Math.random() * 900000)}`;
    const next = tickets + 1;
    setTickets(next);
    localStorage.setItem('tickets', String(next));
    updateCoins(coins + 3);
    setStatus(`Ticket ${id} submitted. Demo wallet awarded +3 Z-Coins.`);
  }

  return (
    <aside
      className={`drawer${isOpen ? ' open' : ''}`}
      id="ticketPanel"
      aria-hidden={!isOpen}
      aria-label="E-waste ticket panel"
    >
      <div className="drawer-head">
        <div>
          <p className="eyebrow">E-waste care</p>
          <h2>Raise a ticket</h2>
        </div>
        <button className="icon-button" type="button" aria-label="Close ticket" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      <form id="ticketForm" className="stacked-form" onSubmit={handleSubmit}>
        <input
          id="ticketName"
          type="text"
          placeholder="Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          id="ticketEmail"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select
          id="ticketType"
          required
          value={ticketType}
          onChange={(e) => setTicketType(e.target.value)}
        >
          <option value="">Select e-waste type</option>
          <option>Mobile phone</option>
          <option>Laptop</option>
          <option>Battery</option>
          <option>Appliance</option>
          <option>Other</option>
        </select>
        <textarea
          id="ticketDescription"
          rows={4}
          placeholder="Short description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="button primary full" type="submit">
          <Send size={18} /> Submit ticket
        </button>
        {status && <p id="ticketStatus" className="form-status">{status}</p>}
      </form>
    </aside>
  );
}
