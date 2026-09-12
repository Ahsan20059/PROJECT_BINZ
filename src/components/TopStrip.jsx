import React from 'react';
import { ClipboardCheck, FileText, MapPin } from 'lucide-react';

export default function TopStrip() {
  return (
    <div className="top-strip">
      <p>Live e-waste tracking for Greater Noida | Pickup, facility status and recycling report in one place</p>
      <div className="strip-links" aria-label="Quick tracker links">
        <a href="#tracker-overview" aria-label="Tracker overview"><ClipboardCheck size={15} /></a>
        <a href="#facility-status" aria-label="Facility status"><MapPin size={15} /></a>
        <a href="#recycling-report" aria-label="Recycling report"><FileText size={15} /></a>
      </div>
    </div>
  );
}