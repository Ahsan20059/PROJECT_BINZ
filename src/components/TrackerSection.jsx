import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { Plus } from 'lucide-react';

Chart.register(...registerables);

export default function TrackerSection({ entries, setEntries, tickets, updateCoins, coins }) {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [solidWaste, setSolidWaste] = useState('');
  const [eWaste, setEWaste] = useState('');

  const lineRef = useRef(null);
  const pieRef = useRef(null);
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);

  const solid = entries.reduce((sum, e) => sum + e.solid, 0);
  const ewaste = entries.reduce((sum, e) => sum + e.ewaste, 0);
  const co2 = (solid * 0.9 + ewaste * 2.6).toFixed(1);

  useEffect(() => {
    if (!lineRef.current || !pieRef.current) return;

    if (lineChartRef.current) lineChartRef.current.destroy();
    if (pieChartRef.current) pieChartRef.current.destroy();

    const labels = entries.map((e) => e.date);
    const solidData = entries.map((e) => Number((e.solid * 0.9).toFixed(2)));
    const ewasteData = entries.map((e) => Number((e.ewaste * 2.6).toFixed(2)));

    lineChartRef.current = new Chart(lineRef.current, {
      type: 'line',
      data: {
        labels: labels.length ? labels : ['Start'],
        datasets: [
          {
            label: 'Solid Waste CO2',
            data: solidData.length ? solidData : [0],
            borderColor: '#356f38',
            backgroundColor: 'rgba(53,111,56,0.12)',
            tension: 0.35,
            fill: true,
          },
          {
            label: 'E-Waste CO2',
            data: ewasteData.length ? ewasteData : [0],
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
            data: [solid || 1, ewaste || 0],
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
    setEntries(next);
    localStorage.setItem('impactEntries', JSON.stringify(next));
    updateCoins(coins + Math.ceil(entry.solid + entry.ewaste));
    setSolidWaste('');
    setEWaste('');
  }

  return (
    <section id="tracker" className="section padded impact-section">
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
