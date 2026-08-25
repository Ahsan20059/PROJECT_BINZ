import React from 'react';
import { ArrowLeft, Check, FileCheck, LockKeyhole, ShieldCheck } from 'lucide-react';

export default function CertificationsPage() {
  const recipient = localStorage.getItem('firstName') || 'BinZ customer';

  return (
    <main className="certifications-page">
      <a className="auth-back-link" href="#home">
        <ArrowLeft size={16} /> Back to BinZ
      </a>
      <section className="certificate-intro" aria-labelledby="certifications-title">
        <p className="eyebrow">Responsible electronics recycling</p>
        <h1 id="certifications-title">Your data deserves a clean goodbye.</h1>
        <p>Every eligible device is securely cleared before it moves on. Once the process is complete, you receive a digital certificate as proof.</p>
      </section>

      <section className="certificate" aria-labelledby="certificate-title">
        <div className="certificate-mark"><ShieldCheck size={34} /></div>
        <p className="certificate-kicker">BinZ verified document</p>
        <h2 id="certificate-title">Certificate of secure data erasure</h2>
        <p className="certificate-copy">This certifies that the device submitted by</p>
        <p className="certificate-recipient">{recipient}</p>
        <p className="certificate-copy">will be processed through BinZ's verified data-erasure workflow before responsible recycling or refurbishment.</p>
        <div className="certificate-details">
          <span><strong>Status</strong><b><Check size={14} /> Protected</b></span>
          <span><strong>Verification</strong><b>BINZ-DATA-CLEAR</b></span>
          <span><strong>Issued</strong><b>{new Date().toLocaleDateString('en-IN')}</b></span>
        </div>
      </section>

      <section className="data-safety" aria-labelledby="data-safety-title">
        <div className="data-safety-heading">
          <p className="eyebrow">How it works</p>
          <h2 id="data-safety-title">No human intervention required.</h2>
          <p>Our secure workflow handles the device data automatically, so your personal files are not opened, copied, or reviewed by a person.</p>
        </div>
        <div className="data-steps">
          <article><span>01</span><LockKeyhole size={22} /><h3>Device isolated</h3><p>Your device is logged and placed into a protected processing workflow.</p></article>
          <article><span>02</span><FileCheck size={22} /><h3>Data erased</h3><p>An automated process clears user accounts, files, and stored information.</p></article>
          <article><span>03</span><ShieldCheck size={22} /><h3>Certificate issued</h3><p>Completion is recorded and your digital certificate becomes available.</p></article>
        </div>
      </section>
    </main>
  );
}