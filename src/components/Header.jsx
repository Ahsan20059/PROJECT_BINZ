import React, { useState } from 'react';
import { Menu, UserRound } from 'lucide-react';

export default function Header({ coins, onOpenAccount }) {
  const [navOpen, setNavOpen] = useState(false);

  function handleNavToggle() {
    setNavOpen((prev) => !prev);
  }

  function handleNavLinkClick() {
    setNavOpen(false);
  }

  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="BinZ home">
        <span className="logo-shell">
          <img src="/assets/binz-logo-final.png" alt="BinZ" />
        </span>
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={navOpen}
        aria-controls="primary-nav"
        onClick={handleNavToggle}
      >
        <Menu size={22} />
      </button>
      <nav
        id="primary-nav"
        className={`primary-nav${navOpen ? ' open' : ''}`}
        aria-label="Primary navigation"
      >
        <a href="#home" onClick={handleNavLinkClick}>Home</a>
        <a href="#scrap" onClick={handleNavLinkClick}>Scrap</a>
        <a href="#earn" onClick={handleNavLinkClick}>Earn Coins</a>
        <a href="#tracker" onClick={handleNavLinkClick}>Impact</a>
        <a href="#service" onClick={handleNavLinkClick}>Service</a>
      </nav>
      <div className="wallet">
        <span id="coinBalance">{coins}</span>
        <span>Z-Coins</span>
      </div>
      <button
        className="icon-button"
        id="accountButton"
        type="button"
        aria-label="Open account panel"
        onClick={onOpenAccount}
      >
        <UserRound size={22} />
      </button>
    </header>
  );
}
