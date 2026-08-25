import React, { useState } from 'react';
import {
  Newspaper, Wine, BookOpen, Anchor, HardHat, PackageOpen, Cable, Package,
  WashingMachine, Archive, Laptop, Smartphone, BatteryCharging,
  MailCheck, ShoppingBag,
} from 'lucide-react';
import { scrapItems } from '../data';

// PET bottle custom SVG
function PetBottleIcon() {
  return (
    <svg className="pet-bottle-icon" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M25 4h14v8H25z" />
      <path d="M28 12h8l2 9 8 8v23c0 5-4 8-9 8H27c-5 0-9-3-9-8V29l8-8 2-9z" />
      <path d="M22 36h20" />
      <path d="M23 48h18" />
      <path d="M29 22h6" />
    </svg>
  );
}

const iconMap = {
  Newspaper, Wine, BookOpen, Anchor, HardHat, PackageOpen, Cable, Package,
  WashingMachine, Archive, Laptop, Smartphone, BatteryCharging,
};

function ScrapIcon({ icon }) {
  if (icon === 'pet-bottle') return <PetBottleIcon />;
  const LucideIcon = iconMap[icon];
  return LucideIcon ? <LucideIcon size={42} strokeWidth={1.7} /> : null;
}

function categoryLabel(category) {
  if (category === 'ewaste') return 'E-waste';
  if (category === 'appliance') return 'Quote';
  return 'Live rate';
}

export default function ScrapSection({ onSellEwaste, onSellNormal }) {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? scrapItems : scrapItems.filter((i) => i.category === filter);

  function handleSell(item) {
    if (item.category === 'ewaste') {
      onSellEwaste(item.name);
    } else {
      onSellNormal(item.name);
    }
  }

  return (
    <section id="scrap" className="section padded">
      <div className="section-heading">
        <p className="eyebrow">Sell smarter</p>
        <h2>Shop by scrap category</h2>
        <p>Normal recyclables, appliances and e-waste are grouped for fast quotes and clean pickup handoffs.</p>
      </div>
      <div className="category-tabs" role="tablist" aria-label="Scrap categories">
        {['all', 'normal', 'appliance', 'ewaste'].map((f) => (
          <button
            key={f}
            className={`tab${filter === f ? ' active' : ''}`}
            type="button"
            data-filter={f}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'normal' ? 'Normal recyclables' : f === 'appliance' ? 'Large appliances' : 'E-waste'}
          </button>
        ))}
      </div>
      <div className="scrap-grid" id="scrapGrid">
        {filtered.map((item) => (
          <article key={item.name} className="scrap-card">
            <div className="scrap-card-top">
              <div className="scrap-visual">
                <ScrapIcon icon={item.icon} />
              </div>
              <span>{categoryLabel(item.category)}</span>
            </div>
            <h3>{item.name}</h3>
            <div className="rate"><span>{item.rate}</span></div>
            <p>{item.note}</p>
            <button
              className="button secondary"
              type="button"
              onClick={() => handleSell(item)}
            >
              {item.category === 'ewaste' ? <MailCheck size={18} /> : <ShoppingBag size={18} />}
              {item.category === 'ewaste' ? 'Raise ticket' : 'Sell now'}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
