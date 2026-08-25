import React from 'react';
import { MailCheck, LogIn, MessageCircle } from 'lucide-react';

export default function ServiceSection({ onOpenTicket, onOpenAccount, onOpenChat }) {
  return (
    <section id="service" className="section padded service-grid">
      <div className="section-heading align-left">
        <p className="eyebrow">Service hub</p>
        <h2>One place for pickup, tickets and account state</h2>
      </div>
      <article className="service-card">
        <MailCheck size={34} />
        <h3>E-waste ticket</h3>
        <p>Raise a responsible disposal request with a generated ticket ID.</p>
        <button className="button secondary" type="button" onClick={onOpenTicket}>
          Open ticket
        </button>
      </article>
      <article className="service-card">
        <LogIn size={34} />
        <h3>Sign in</h3>
        <p>Store a demo identity and keep the wallet state in localStorage.</p>
        <button className="button secondary" type="button" onClick={onOpenAccount}>
          Open account
        </button>
      </article>
      <article className="service-card">
        <MessageCircle size={34} />
        <h3>Z-Chat</h3>
        <p>Quick answers for booking, contact, e-waste and project details.</p>
        <button className="button secondary" type="button" id="openChatFromCard" onClick={onOpenChat}>
          Open chat
        </button>
      </article>
    </section>
  );
}
