import React, { useEffect, useState } from 'react';
import {
  Award,
  ChevronDown,
  Gift,
  Layers,
  Laptop,
  LogIn,
  LogOut,
  MailCheck,
  Menu,
  MessageCircle,
  Sprout,
} from 'lucide-react';

export default function Header({ coins, onOpenAccount, onSignOut, isSignedIn }) {
  const [navOpen, setNavOpen] = useState(false);
  const [impactOpen, setImpactOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
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
    setImpactOpen(false);
    setServiceOpen(false);
  }

  function handleNavLinkClick() {
    setNavOpen(false);
    setImpactOpen(false);
    setServiceOpen(false);
  }

  function handleImpactToggle(event) {
    event.preventDefault();
    setImpactOpen((prev) => !prev);
    setServiceOpen(false);
  }

  function handleServiceToggle(event) {
    event.preventDefault();
    setServiceOpen((prev) => !prev);
    setImpactOpen(false);
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
        <a className="primary-link donate-link" href="#donate" onClick={handleNavLinkClick}>
          <Gift size={14} aria-hidden="true" /> Donate
        </a>
        <div className={`nav-menu impact-menu${impactOpen ? ' open' : ''}`}>
          <a
            className="primary-link impact-link"
            href="#tracker"
            aria-expanded={impactOpen}
            aria-controls="impact-dropdown"
            onClick={handleImpactToggle}
          >
            Impact <ChevronDown size={15} aria-hidden="true" />
          </a>
          <div className="impact-dropdown" id="impact-dropdown" role="menu">
            <a href="#certifications" role="menuitem" onClick={handleNavLinkClick}>
              <span className="impact-icon"><Award size={15} /></span>
              <span className="impact-item-title">  Certifications</span>
            </a>
            <a href="#services" role="menuitem" onClick={handleNavLinkClick}>
              <span className="impact-icon"><Layers size={15} /></span>
              <span className="impact-item-title">  Other services</span>
            </a>
            <a href="#learn" role="menuitem" onClick={handleNavLinkClick}>
              <span className="impact-icon"><Sprout size={15} /></span> 
              <span className="impact-item-title">  Know more</span>
            </a>
          </div>
        </div>
        <div className={`nav-menu service-menu${serviceOpen ? ' open' : ''}`}>
          <a
            className="primary-link impact-link"
            href="#service"
            aria-expanded={serviceOpen}
            aria-controls="service-dropdown"
            onClick={handleServiceToggle}
          >
            Service <ChevronDown size={15} aria-hidden="true" />
          </a>
          <div className="impact-dropdown service-dropdown" id="service-dropdown" role="menu">
            <a href="#service" role="menuitem" onClick={handleNavLinkClick}>
              <span className="impact-icon"><Layers size={15} /></span>
              <span className="impact-item-title">  Service hub</span>
            </a>
            <a href="#service" role="menuitem" onClick={handleNavLinkClick}>
              <span className="impact-icon"><MailCheck size={15} /></span>
              <span className="impact-item-title">  E-waste ticket</span>
            </a>
            <a href="#ewaste-tracker" role="menuitem" onClick={handleNavLinkClick}>
              <span className="impact-icon"><Laptop size={15} /></span>
              <span className="impact-item-title">  Track e-waste</span>
            </a>
            <a href="#service" role="menuitem" onClick={handleNavLinkClick}>
              <span className="impact-icon"><MessageCircle size={15} /></span>
              <span className="impact-item-title">  Help and FAQ</span>
            </a>
          </div>
        </div>
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
