import React from 'react';

import './preloader.css';

export default function Preloader() {
  return (
    <div id="loader-wrapper">
      <div id="loader" />
      <div className="loader-section section-left" />
      <div className="loader-section section-right" />
    </div>
  );
}
