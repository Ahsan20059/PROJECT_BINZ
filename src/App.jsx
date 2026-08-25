import React, { useEffect, useState } from 'react';
import TopStrip from './components/TopStrip';
import Header from './components/Header';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import LearnPage from './components/LearnPage';
import ServicesPage from './components/ServicesPage';
import CertificationsPage from './components/CertificationsPage';
import HeroSection from './components/HeroSection';
import TrustRow from './components/TrustRow';
import StatsBand from './components/StatsBand';
import ScrapSection from './components/ScrapSection';
import EarnSection from './components/EarnSection';
import TrackerSection from './components/TrackerSection';
import LeaderboardSection from './components/LeaderboardSection';
import ServiceSection from './components/ServiceSection';
import AboutBand from './components/AboutBand';
import Footer from './components/Footer';
import ChatFab from './components/ChatFab';
import ChatDrawer from './components/ChatDrawer';
import AuthDrawer from './components/AuthDrawer';
import TicketDrawer from './components/TicketDrawer';
import Scrim from './components/Scrim';

function App() {
  const [coins, setCoins] = useState(() => Number(localStorage.getItem('coins') || 0));
  const [firstName, setFirstName] = useState(() => localStorage.getItem('firstName') || 'Guest');
  const [entries, setEntries] = useState(() => JSON.parse(localStorage.getItem('impactEntries') || '[]'));
  const [tickets, setTickets] = useState(() => Number(localStorage.getItem('tickets') || 0));
  const [openDrawer, setOpenDrawer] = useState(null); // 'chatDrawer' | 'authPanel' | 'ticketPanel' | null
  const [pickupStatus, setPickupStatus] = useState({ msg: '', error: false });
  const [ticketTypePreset, setTicketTypePreset] = useState('');
  const [currentPage, setCurrentPage] = useState(() => window.location.hash);

  useEffect(() => {
    function handleCoinsUpdated(event) {
      const next = Math.max(0, Number(event.detail?.coins));
      if (!Number.isFinite(next)) return;
      setCoins(next);
      localStorage.setItem('coins', String(next));
    }

    function handleStorage(event) {
      if (event.key === 'coins' && event.newValue !== null) {
        handleCoinsUpdated({ detail: { coins: event.newValue } });
      }
    }

    window.addEventListener('coinsUpdated', handleCoinsUpdated);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('coinsUpdated', handleCoinsUpdated);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    function handleHashChange() {
      setCurrentPage(window.location.hash);
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  function updateCoins(value) {
    const next = Math.max(0, Number(value));
    if (!Number.isFinite(next)) return;
    window.dispatchEvent(new CustomEvent('coinsUpdated', { detail: { coins: next } }));
  }

  function handleAuthenticated(account) {
    const accountName = account.firstName || 'Guest';
    setFirstName(accountName);
    localStorage.setItem('firstName', accountName);
    localStorage.setItem('lastName', account.lastName || '');
    localStorage.setItem('email', account.email || '');
    localStorage.setItem('state', account.state || '');
    updateCoins(account.coins);
    window.location.hash = '#home';
  }

  function handleSignOut() {
    ['firstName', 'lastName', 'email', 'state', 'coins'].forEach((key) => localStorage.removeItem(key));
    setFirstName('Guest');
    updateCoins(0);
  }

  function handleOpenDrawer(id) {
    setOpenDrawer(id);
  }

  function handleCloseDrawers() {
    setOpenDrawer(null);
  }

  function handleSellEwaste(itemName) {
    const preset = itemName.includes('Laptop') ? 'Laptop' : itemName.includes('Mobile') ? 'Mobile phone' : 'Battery';
    setTicketTypePreset(preset);
    setOpenDrawer('ticketPanel');
  }

  function handleSellNormal(itemName) {
    window.location.hash = '#home';
    document.getElementById('phoneInput')?.focus();
    setPickupStatus({ msg: `${itemName} selected. Add your phone number to book pickup.`, error: false });
  }

  function handleOpenSignIn() {
    window.location.hash = '#signin';
  }

  function renderStandalonePage(page) {
    return (
      <>
        <TopStrip />
        <Header
          coins={coins}
          onOpenAccount={handleOpenSignIn}
          onSignOut={handleSignOut}
          isSignedIn={firstName !== 'Guest' && Boolean(localStorage.getItem('email'))}
        />
        {page}
      </>
    );
  }

  if (currentPage === '#signin') {
    return renderStandalonePage(<SignInPage onAuthenticated={handleAuthenticated} />);
  }

  if (currentPage === '#signup') {
    return renderStandalonePage(<SignUpPage onAuthenticated={handleAuthenticated} />);
  }

  if (currentPage === '#learn') {
    return renderStandalonePage(<LearnPage />);
  }

  if (currentPage === '#services') {
    return renderStandalonePage(<ServicesPage />);
  }

  if (currentPage === '#certifications') {
    return renderStandalonePage(<CertificationsPage />);
  }

  return (
    <>
      <TopStrip />
      <Header
        coins={coins}
        onOpenAccount={handleOpenSignIn}
        onSignOut={handleSignOut}
        isSignedIn={firstName !== 'Guest' && Boolean(localStorage.getItem('email'))}
      />
      <main>
        <HeroSection
          coins={coins}
          entries={entries}
          tickets={tickets}
          pickupStatus={pickupStatus}
          setPickupStatus={setPickupStatus}
          updateCoins={updateCoins}
        />
        <TrustRow />
        <StatsBand entries={entries} tickets={tickets} />
        <ScrapSection
          onSellEwaste={handleSellEwaste}
          onSellNormal={handleSellNormal}
        />
        <EarnSection coins={coins} updateCoins={updateCoins} />
        <TrackerSection
          entries={entries}
          setEntries={setEntries}
          tickets={tickets}
          updateCoins={updateCoins}
          coins={coins}
        />
        <LeaderboardSection coins={coins} firstName={firstName} />
        <ServiceSection
          onOpenTicket={() => handleOpenDrawer('ticketPanel')}
          onOpenAccount={() => handleOpenDrawer('authPanel')}
          onOpenChat={() => handleOpenDrawer('chatDrawer')}
        />
        <AboutBand />
      </main>
      <Footer />

      <ChatFab onOpen={() => handleOpenDrawer('chatDrawer')} />

      <ChatDrawer
        isOpen={openDrawer === 'chatDrawer'}
        onClose={handleCloseDrawers}
      />
      <AuthDrawer
        isOpen={openDrawer === 'authPanel'}
        onClose={handleCloseDrawers}
        coins={coins}
        updateCoins={updateCoins}
        setFirstName={setFirstName}
      />
      <TicketDrawer
        isOpen={openDrawer === 'ticketPanel'}
        onClose={handleCloseDrawers}
        ticketTypePreset={ticketTypePreset}
        tickets={tickets}
        setTickets={setTickets}
        updateCoins={updateCoins}
        coins={coins}
        setEntries={setEntries}
        entries={entries}
      />
      <Scrim visible={openDrawer !== null} onClick={handleCloseDrawers} />
    </>
  );
}

export default App;