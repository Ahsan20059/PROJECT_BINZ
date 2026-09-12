import React, { useEffect, useState } from 'react';
import { ClipboardCheck, FileText, LogIn, LogOut, MapPin, Menu, Route } from 'lucide-react';

export default function Header({ coins, onOpenAccount, onSignOut, isSignedIn }) {
  const [navOpen, setNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 24);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleNavToggle() {
    setNavOpen((prev) => !prev);
  }

  function handleNavLinkClick() {
    setNavOpen(false);
  }

  return (
    <header className={`site-header${isScrolled ? ' scrolled' : ''}`}>
      <a className="brand" href="#tracker-overview" aria-label="BinZ tracker overview">
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
        aria-label="Tracker navigation"
      >
        <a className="primary-link" href="#how-it-works" onClick={handleNavLinkClick}>
          <Route size={14} aria-hidden="true" /> How it works
        </a>
        <a className="primary-link" href="#tracker-overview" onClick={handleNavLinkClick}>
          <ClipboardCheck size={14} aria-hidden="true" /> Overview
        </a>
        <a className="primary-link" href="#tracker-journey" onClick={handleNavLinkClick}>
          <Route size={14} aria-hidden="true" /> Journey
        </a>
        <a className="primary-link" href="#facility-status" onClick={handleNavLinkClick}>
          <MapPin size={14} aria-hidden="true" /> Facility
        </a>
        <a className="primary-link report-nav-link" href="#recycling-report" onClick={handleNavLinkClick}>
          <FileText size={14} aria-hidden="true" /> Report
        </a>
      </nav>
      <div className="wallet">
        <span id="coinBalance">{coins}</span>
        <span>Z-Coins</span>
      </div>
      <button
        className="icon-button"
        id="accountButton"
        type="button"
        aria-label={isSignedIn ? 'Sign out' : 'Sign in'}
        onClick={isSignedIn ? onSignOut : onOpenAccount}
      >
        {isSignedIn ? <LogOut size={18} /> : <LogIn size={18} />}
        <span>{isSignedIn ? 'Sign out' : 'Sign in'}</span>
      </button>
    </header>
  );
}