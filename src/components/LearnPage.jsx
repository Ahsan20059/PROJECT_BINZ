import React from 'react';
import { ArrowLeft, Leaf, RefreshCw, Recycle } from 'lucide-react';

const principles = [
  {
    icon: Leaf,
    title: 'Reduce',
    text: 'Choose only what you need, avoid unnecessary packaging, and make everyday items last longer.',
    action: 'Buy mindfully',
  },
  {
    icon: RefreshCw,
    title: 'Reuse',
    text: 'Give products a second life by repairing, repurposing, donating, or sharing them with others.',
    action: 'Use it again',
  },
  {
    icon: Recycle,
    title: 'Recycle',
    text: 'Sort clean materials correctly so they can become useful resources instead of ending up in landfill.',
    action: 'Sort it right',
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
        <h1 id="learn-title">Reduce. Reuse. Recycle.</h1>
        <p>
          Three simple habits can keep valuable materials in use, reduce waste, and help build a cleaner future.
        </p>
      </section>
      <section className="principles-grid" aria-label="The three recycling principles">
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