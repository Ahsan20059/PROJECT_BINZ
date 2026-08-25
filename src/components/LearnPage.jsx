import React from 'react';
import { ArrowLeft, Hammer, RefreshCw, Wrench } from 'lucide-react';

const principles = [
  {
    icon: Wrench,
    title: 'Refurbish',
    text: 'Repair and refresh useful electronics so they can perform well for longer instead of becoming waste.',
    action: 'Restore value',
  },
  {
    icon: RefreshCw,
    title: 'Rebuild',
    text: 'Replace worn parts, improve what can be improved, and rebuild devices for a reliable second chapter.',
    action: 'Make it better',
  },
  {
    icon: RefreshCw,
    title: 'Reuse',
    text: 'Pass on working devices, repurpose components, and keep valuable materials in circulation.',
    action: 'Keep it moving',
  },
];

export default function LearnPage() {
  return (
    <main className="learn-page">
      <a className="auth-back-link" href="#home">
        <ArrowLeft size={16} /> Back to BinZ
      </a>
      <section className="learn-hero" aria-labelledby="learn-title">
        <p className="eyebrow">A smaller footprint starts here</p>
        <h1 id="learn-title">Refurbish. Rebuild. Reuse.</h1>
        <p>
          Three practical habits can keep valuable electronics in use, reduce waste, and help build a cleaner future.
        </p>
      </section>
      <section className="principles-grid" aria-label="The three circular technology principles">
        {principles.map(({ icon: Icon, title, text, action }) => (
          <article className="principle-card" key={title}>
            <span className="principle-icon"><Icon size={28} /></span>
            <p className="eyebrow">01 / 0{principles.findIndex((item) => item.title === title) + 1}</p>
            <h2>{title}</h2>
            <p>{text}</p>
            <strong>{action}</strong>
          </article>
        ))}
      </section>
      <section className="learn-next-step">
        <div>
          <p className="eyebrow">Make it a habit</p>
          <h2>Small choices add up.</h2>
        </div>
        <a className="button primary" href="#scrap">Find a better next step</a>
      </section>
    </main>
  );
}