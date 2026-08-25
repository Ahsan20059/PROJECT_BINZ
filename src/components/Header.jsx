import React, { useEffect, useState } from 'react';
import { ChevronDown, LogIn, LogOut, Menu } from 'lucide-react';

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
        <a className="primary-link" href="#home" onClick={handleNavLinkClick}>Home</a>
        <a className="primary-link" href="#scrap" onClick={handleNavLinkClick}>Scrap</a>
        <a className="primary-link" href="#earn" onClick={handleNavLinkClick}>Earn Coins</a>
        <div className="impact-menu">
          <a className="primary-link impact-link" href="#tracker" onClick={handleNavLinkClick}>
            Impact <ChevronDown size={15} aria-hidden="true" />
          </a>
          <div className="impact-dropdown" role="menu">
            <a href="#certifications" role="menuitem" onClick={handleNavLinkClick}>Certifications</a>
            <a href="#services" role="menuitem" onClick={handleNavLinkClick}>Other services</a>
            <a href="#learn" role="menuitem" onClick={handleNavLinkClick}>Know more</a>
          </div>
        </div>
        <a className="primary-link" href="#service" onClick={handleNavLinkClick}>Service</a>
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