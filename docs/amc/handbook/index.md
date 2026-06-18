---
sidebar_position: 999
---

import Link from '@docusaurus/Link';

import core_kit_banner from './banners/core-kit-chapter-banner.png';
import breadboard_banner from './banners/breadboard-chapter-banner.png';
import measurements_banner from './banners/measurements-chapter-banner.png';
import power_banner from './banners/power-chapter-banner.png';
import sensors_banner from './banners/sensors-chapter-banner.png';
import disambiguations_banner from './banners/disambiguations-chapter-banner.png';
import microcontrollers_banner from './banners/microcontrollers-chapter-banner.png';
import programming_banner from './banners/programming-chapter-banner.png';
import outputs_banner from './banners/outputs-chapter-banner.png';

# The AMC Mini-Handbook

## Chapters

<div className="chapterGrid">

  <Link className="chapterCard" to="/amc/core-kit">
    <img className="chapterCardImage" src={core_kit_banner} alt="" draggable="false" />
    <div className="chapterCardOverlay">
      <span className="chapterNumber">Chapter 1</span>
      <h2>AMC Core Kit</h2>
    </div>
  </Link>

  <Link className="chapterCard" to="/amc/handbook/breadboard">
    <img className="chapterCardImage" src={breadboard_banner} alt="" draggable="false" />
    <div className="chapterCardOverlay">
      <span className="chapterNumber">Chapter 2</span>
      <h2>Breadboard and Schematics</h2>
    </div>
  </Link>

  <Link className="chapterCard" to="/amc/handbook/measurements">
    <img className="chapterCardImage" src={measurements_banner} alt="" draggable="false" />
    <div className="chapterCardOverlay">
      <span className="chapterNumber">Chapter 3</span>
      <h2>Measurements and Multimeter</h2>
    </div>
  </Link>

  <Link className="chapterCard" to="/amc/handbook/power">
    <img className="chapterCardImage" src={power_banner} alt="" draggable="false" />
    <div className="chapterCardOverlay">
      <span className="chapterNumber">Chapter 4</span>
      <h2>Power and Regulators</h2>
    </div>
  </Link>

  <Link className="chapterCard" to="/amc/handbook/sensors">
    <img className="chapterCardImage" src={sensors_banner} alt="" draggable="false" />
    <div className="chapterCardOverlay">
      <span className="chapterNumber">Chapter 5</span>
      <h2>Sensors and Signals</h2>
    </div>
  </Link>

  <Link className="chapterCard" to="/amc/handbook/disambiguations">
    <img className="chapterCardImage" src={disambiguations_banner} alt="" draggable="false" />
    <div className="chapterCardOverlay">
      <span className="chapterNumber">Chapter 6</span>
      <h2>Disambiguations</h2>
    </div>
  </Link>

  <Link className="chapterCard" to="/amc/handbook/microcontrollers">
    <img className="chapterCardImage" src={microcontrollers_banner} alt="" draggable="false" />
    <div className="chapterCardOverlay">
      <span className="chapterNumber">Chapter 7</span>
      <h2>Microcontrollers</h2>
    </div>
  </Link>

  <Link className="chapterCard" to="/amc/handbook/programming">
    <img className="chapterCardImage" src={programming_banner} alt="" draggable="false" />
    <div className="chapterCardOverlay">
      <span className="chapterNumber">Chapter 8</span>
      <h2>Introduction to Programming Microcontrollers</h2>
    </div>
  </Link>

  <Link className="chapterCard" to="/amc/handbook/outputs">
    <img className="chapterCardImage" src={outputs_banner} alt="" draggable="false" />
    <div className="chapterCardOverlay">
      <span className="chapterNumber">Chapter 9</span>
      <h2>Output Devices</h2>
    </div>
  </Link>

</div>

<style>{`
:root {
  --chapter-card-text-color: #111;
  --chapter-card-text-shadow: rgba(255, 255, 255, 0.9);
}

[data-theme='dark'] {
  --chapter-card-text-color: #fff;
  --chapter-card-text-shadow: rgba(0, 0, 0, 0.95);
}

.chapterGrid {
  display: grid;
  gap: 1.5rem;
  margin-top: 2rem;
}

.chapterCard {
  position: relative;
  display: block;
  border-radius: 18px;
  overflow: hidden;
  text-decoration: none;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.18);
  transition: transform 160ms ease, box-shadow 160ms ease;
  cursor: pointer;
}

.chapterCard:hover {
  transform: translateY(-3px);
  text-decoration: none;
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.24);
}

.chapterCardImage {
  display: block;
  width: 100%;
  height: auto;

  /* Important: image itself is not clickable,
     but the parent card link still is. */
  pointer-events: none;
  user-select: none;
}

.chapterCardOverlay {
  position: absolute;
  inset: 0 auto 0 0;
  width: 50%;
  padding: 2rem;

  display: flex;
  flex-direction: column;
  justify-content: center;

  background: none;

  color: var(--chapter-card-text-color);
  text-shadow:
    0 1px 2px var(--chapter-card-text-shadow),
    0 2px 8px var(--chapter-card-text-shadow),
    0 4px 18px var(--chapter-card-text-shadow);
}

.chapterCardOverlay h2 {
  margin: 0.35rem 0 0;
  color: var(--chapter-card-text-color);
  font-size: clamp(1.4rem, 3vw, 2rem);
  line-height: 1.1;
}

.chapterNumber {
  color: var(--chapter-card-text-color);
  font-size: clamp(0.7rem, 1.6vw, 0.85rem);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.9;
}

.chapterCard,
.chapterCard:hover,
.chapterCard:focus {
  color: inherit;
  text-decoration: none;
}

.chapterCard:focus-visible {
  outline: 3px solid var(--ifm-color-primary);
  outline-offset: 4px;
}

.chapterCardOverlay h2,
.chapterNumber {
  -webkit-text-stroke: 0.25px var(--chapter-card-text-shadow);
}

@media (max-width: 900px) {
  .chapterGrid {
    gap: 1.25rem;
  }

  .chapterCardOverlay {
    width: 55%;
    padding: 1.5rem;
  }

  .chapterCardOverlay h2 {
    font-size: clamp(1.35rem, 4vw, 2rem);
  }

  .chapterNumber {
    font-size: clamp(0.7rem, 2vw, 0.85rem);
  }
}

@media (max-width: 700px) {
  .chapterGrid {
    gap: 1rem;
  }

  .chapterCardOverlay {
    width: 62%;
    padding: 1.2rem;
  }

  .chapterCardOverlay h2 {
    font-size: clamp(1.05rem, 5vw, 1.55rem);
    line-height: 1.05;
  }

  .chapterNumber {
    font-size: 0.68rem;
    letter-spacing: 0.06em;
  }
}

@media (max-width: 480px) {
  .chapterCard {
    border-radius: 14px;
  }

  .chapterCardOverlay {
    width: 68%;
    padding: 0.9rem;
  }

  .chapterCardOverlay h2 {
    font-size: clamp(0.85rem, 5.8vw, 1.2rem);
    line-height: 1.05;
  }

  .chapterNumber {
    font-size: 0.6rem;
    letter-spacing: 0.045em;
  }
}

@media (max-width: 360px) {
  .chapterCard {
    border-radius: 12px;
  }

  .chapterCardOverlay {
    width: 72%;
    padding: 0.7rem;
  }

  .chapterCardOverlay h2 {
    font-size: 0.82rem;
  }

  .chapterNumber {
    font-size: 0.55rem;
  }
}
`}</style>
