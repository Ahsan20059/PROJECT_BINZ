import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import {
  CheckCircle2,
  ClipboardCopy,
  FileText,
  Laptop,
  Leaf,
  MapPin,
  Plus,
  Recycle,
  Settings,
} from 'lucide-react';
import { demoImpactEntries, demoImpactStats } from '../data';

Chart.register(...registerables);

const trackedDevice = {
  name: 'Dell Inspiron 15',
  type: 'Laptop (E-waste)',
  id: 'BINZ-48291',
  status: 'Processing',
  statusNote: 'At recycling facility',
  facility: 'Greater Noida, UP',
};

const trackingSteps = [
  { label: 'Picked Up', time: '8 Sep, 10:42 AM', icon: CheckCircle2, state: 'done' },
  { label: 'At Facility', time: '8 Sep, 4:20 PM', icon: CheckCircle2, state: 'done' },
  { label: 'Processing', time: '9 Sep, 10:32 AM', icon: Settings, state: 'active' },
  { label: 'Material Recovery', time: 'Pending', icon: Leaf, state: 'pending' },
  { label: 'Final Disposal', time: 'Pending', icon: Recycle, state: 'pending' },
];

export function EWasteTracker() {
  const [copyStatus, setCopyStatus] = useState('');

  async function handleCopyId() {
    try {
      await navigator.clipboard.writeText(trackedDevice.id);
      setCopyStatus('Tracking ID copied');
    } catch {
      setCopyStatus('Tracking ID ready to copy');
    }
  }

  return (
    <div className="ewaste-tracker">
      <section className="binz-demo-section" aria-labelledby="binz-demo-title">
        <div className="binz-demo-copy">
          <p className="eyebrow">How BinZ works</p>
          <h3 id="binz-demo-title">A quick look at the pickup and recycling journey</h3>
          <p>Watch how a request moves from doorstep collection to careful sorting, recovery and responsible recycling.</p>
        </div>
        <div className="demo-video-frame">
          <video
            className="tracker-video"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-label="BinZ pickup and recycling demonstration"
          >
            <source src="/assets/binz-promotional-video.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      <div className="tracker-page-hero">
        <div className="tracker-hero-copy">
          <p className="eyebrow">Track your e-waste</p>
          <h2>Your e-waste is on its way to a cleaner tomorrow.</h2>
          <p className="tracker-lede">Follow pickup progress, facility status and recycling report details from one clean tracking page.</p>
          <div className="tracker-kicker">
            <span>
              <Leaf size={19} aria-hidden="true" />
              A cleaner Greater Noida, together.
            </span>
          </div>
        </div>

        <article className="device-status-card">
          <div className="device-visual" aria-hidden="true">
            <Laptop size={80} />
          </div>
          <div className="device-copy">
            <h3>{trackedDevice.name}</h3>
            <p>{trackedDevice.type}</p>
            <button type="button" className="tracking-id" onClick={handleCopyId}>
              {trackedDevice.id}
              <ClipboardCopy size={17} aria-hidden="true" />
            </button>
            <span className="sr-only" aria-live="polite">{copyStatus}</span>
          </div>
          <div className="status-pill">
            <Settings size={33} aria-hidden="true" />
            <span>
              <strong>{trackedDevice.status}</strong>
              {trackedDevice.statusNote}
            </span>
          </div>
        </article>
      </div>

      <section className="tracker-journey" aria-labelledby="tracker-journey-title">
        <div className="tracker-section-heading">
          <p className="eyebrow">Current journey</p>
          <h3 id="tracker-journey-title">Five checkpoints from pickup to disposal</h3>
        </div>
        <ol className="tracking-timeline" aria-label="E-waste tracking progress">
          {trackingSteps.map((step) => {
            const Icon = step.icon;
            return (
              <li key={step.label} className={`tracking-step ${step.state}`}>
                <span className="step-marker">
                  <Icon size={28} aria-hidden="true" />
                </span>
                <strong>{step.label}</strong>
                <span>{step.time}</span>
              </li>
            );
          })}
        </ol>
      </section>

      <article className="processing-summary">
        <div className="summary-icon">
          <Settings size={37} aria-hidden="true" />
        </div>
        <div>
          <h3>Your e-waste is being processed</h3>
          <p>Your device is currently being dismantled and sorted at our authorized recycling facility in Greater Noida.</p>
        </div>
        <div className="facility-copy">
          <MapPin size={34} aria-hidden="true" />
          <span>
            <strong>Recycling Facility</strong>
            {trackedDevice.facility}
          </span>
        </div>
      </article>

      <div className="report-action">
        <button type="button" className="button primary report-button" data-report-download>
          <FileText size={22} aria-hidden="true" />
          Download Recycling Report
        </button>
      </div>

      <p className="tracker-footnote">Small actions. Big impact.</p>
    </div>
  );
}

export default function TrackerSection({ entries, setEntries, tickets, updateCoins, coins }) {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [solidWaste, setSolidWaste] = useState('');
  const [eWaste, setEWaste] = useState('');
  const [rewardMessage, setRewardMessage] = useState('');

  const lineRef = useRef(null);
  const pieRef = useRef(null);
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const chartEntries = [...demoImpactEntries, ...entries];

  const solid = entries.reduce((sum, e) => sum + e.solid, 0);
  const ewaste = entries.reduce((sum, e) => sum + e.ewaste, 0);
  const co2 = (demoImpactStats.co2Reduced + solid * 0.9 + ewaste * 2.6).toFixed(1);

  useEffect(() => {
    if (!lineRef.current || !pieRef.current) return;

    if (lineChartRef.current) lineChartRef.current.destroy();
    if (pieChartRef.current) pieChartRef.current.destroy();

    const labels = chartEntries.map((e) => e.date);
    const solidData = chartEntries.map((e) => Number((e.solid * 0.9).toFixed(2)));
    const ewasteData = chartEntries.map((e) => Number((e.ewaste * 2.6).toFixed(2)));

    lineChartRef.current = new Chart(lineRef.current, {
      type: 'line',
      data: {
        labels: labels.length ? labels : ['Start'],
        datasets: [
          {
            label: 'Solid Waste CO2',
            data: solidData,
            borderColor: '#356f38',
            backgroundColor: 'rgba(53,111,56,0.12)',
            tension: 0.35,
            fill: true,
          },
          {
            label: 'E-Waste CO2',
            data: ewasteData,
            borderColor: '#0b7c77',
            backgroundColor: 'rgba(11,124,119,0.12)',
            tension: 0.35,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { boxWidth: 12, color: '#162016' } } },
        scales: { y: { beginAtZero: true, title: { display: true, text: 'kg CO2' } } },
      },
    });

    pieChartRef.current = new Chart(pieRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Solid Waste', 'E-Waste'],
        datasets: [
          {
            data: [solid + demoImpactEntries.reduce((sum, e) => sum + e.solid, 0), ewaste + demoImpactEntries.reduce((sum, e) => sum + e.ewaste, 0)],
            backgroundColor: ['#6f8f4b', '#0b7c77'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '66%',
        plugins: { legend: { position: 'bottom' } },
      },
    });

    return () => {
      lineChartRef.current?.destroy();
      pieChartRef.current?.destroy();
    };
  }, [entries]);

  function handleSubmit(e) {
    e.preventDefault();
    const entry = {
      date,
      solid: Number(solidWaste || 0),
      ewaste: Number(eWaste || 0),
    };
    if (!entry.solid && !entry.ewaste) return;
    const next = [...entries, entry];
    const carbonSaved = entry.solid * 0.9 + entry.ewaste * 2.6;
    const coinsEarned = Math.round(carbonSaved * 10);
    setEntries(next);
    localStorage.setItem('impactEntries', JSON.stringify(next));
    updateCoins(coins + coinsEarned);
    setRewardMessage(`${carbonSaved.toFixed(1)} kg CO₂ saved — ${coinsEarned.toLocaleString()} Z-Coins added.`);
    setSolidWaste('');
    setEWaste('');
  }

  return (
    <section id="tracker" className="section padded impact-section tracker-experience">
      <div className="section-heading align-left">
        <p className="eyebrow">Your environmental contribution</p>
        <h2>Track the CO2 you help reduce</h2>
      </div>
      <form className="impact-form" id="impactForm" onSubmit={handleSubmit}>
        <input
          id="impactDate"
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          id="solidWaste"
          type="number"
          min="0"
          step="0.1"
          placeholder="Solid waste (kg)"
          value={solidWaste}
          onChange={(e) => setSolidWaste(e.target.value)}
        />
        <input
          id="eWaste"
          type="number"
          min="0"
          step="0.1"
          placeholder="E-waste (kg)"
          value={eWaste}
          onChange={(e) => setEWaste(e.target.value)}
        />
        <button className="button primary" type="submit">
          <Plus size={18} /> Add entry
        </button>
      </form>
      <div className="impact-summary">
        Total CO2 emissions reduced: <strong id="co2Total">{co2} kg</strong>
      </div>
      <p className="impact-reward-note">Earn 10 Z-Coins for every kg of CO₂ saved.{rewardMessage && ` ${rewardMessage}`}</p>
      <div className="chart-layout">
        <article className="chart-card">
          <h3>CO2 reduction over time</h3>
          <canvas ref={lineRef} id="lineChart" aria-label="CO2 reduction over time" />
        </article>
        <article className="chart-card">
          <h3>Contribution by waste type</h3>
          <canvas ref={pieRef} id="pieChart" aria-label="Contribution by waste type" />
        </article>
      </div>
    </section>
  );
}
