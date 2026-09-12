import React from 'react';

export default function Footer() {
  return (
    <footer id="contact" className="site-footer">
      <div className="footer-brand">
        <a className="brand brand-invert" href="#home">
          <span className="logo-shell">
            <img src="/assets/binz-logo-final.png" alt="BinZ" />
          </span>
        </a>
        <p>Address: Greater Noida</p>
        <p>+91 9696202329<br />binz@services.id</p>
      </div>
      <div>
        <h3>Company</h3>
        <a href="#about">About</a>
        <a href="#service">Careers</a>
        <a href="#service">Mobile</a>
      </div>
      <div>
        <h3>Contact</h3>
        <a href="#service">Help/FAQ</a>
        <a href="#leaderboard">Press</a>
        <a href="#scrap">Affiliates</a>
      </div>
      <form className="newsletter">
        <h3>Community updates</h3>
        <div>
          <input type="email" placeholder="Email address" aria-label="Email address" />
          <button type="submit" className="button primary">Subscribe</button>
        </div>
      </form>
    </footer>
  );
}