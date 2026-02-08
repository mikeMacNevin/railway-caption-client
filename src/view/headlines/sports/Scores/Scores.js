import { useState, useEffect } from 'react';  // Add useEffect
import { Nav } from 'react-bootstrap';
import {
  FaBasketballBall,
  FaFutbol,
  FaFootballBall,
  FaBaseballBall,
  FaTableTennis,
  FaHockeyPuck,
} from 'react-icons/fa';

import SoccerScores from './ScoresWidgets/SoccerScores';
import FootballScores from './ScoresWidgets/FootballScores';
import BaseballScores from './ScoresWidgets/BaseballScores';
import TennisScores from './ScoresWidgets/TennisScores';
import HockeyScores from './ScoresWidgets/HockeyScores';
import BasketballScores from './ScoresWidgets/BasketballScores';

const Scores = () => {
  const [selectedSport, setSelectedSport] = useState('Basketball');

  // Load the widget script once, after mount (when all <div>s are in DOM)
  useEffect(() => {
    if (window._365ScoresWidgetLoaded) return;  // Prevent reloads

    window._365ScoresWidgetLoaded = true;

    const script = document.createElement('script');
    script.src = 'https://widgets.365scores.com/main.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);  // Run only on first mount

  const sports = [
    { name: 'Basketball', icon: <FaBasketballBall /> },
    { name: 'Soccer', icon: <FaFutbol /> },
    { name: 'Football', icon: <FaFootballBall /> },
    { name: 'Baseball', icon: <FaBaseballBall /> },
    { name: 'Tennis', icon: <FaTableTennis /> },
    { name: 'Hockey', icon: <FaHockeyPuck /> },
  ];

  return (
    <div>
      <Nav
        variant="tabs"
        activeKey={selectedSport}
        onSelect={(k) => setSelectedSport(k)}
        className="mb-3"
      >
        {sports.map((sport) => (
          <Nav.Item key={sport.name}>
            <Nav.Link eventKey={sport.name}>
              {sport.icon} {sport.name}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      <div>
        <div style={{ display: selectedSport === 'Basketball' ? 'block' : 'none' }}>
          <BasketballScores />
        </div>
        <div style={{ display: selectedSport === 'Soccer' ? 'block' : 'none' }}>
          <SoccerScores />
        </div>
        <div style={{ display: selectedSport === 'Football' ? 'block' : 'none' }}>
          <FootballScores />
        </div>
        <div style={{ display: selectedSport === 'Baseball' ? 'block' : 'none' }}>
          <BaseballScores />
        </div>
        <div style={{ display: selectedSport === 'Tennis' ? 'block' : 'none' }}>
          <TennisScores />
        </div>
        <div style={{ display: selectedSport === 'Hockey' ? 'block' : 'none' }}>
          <HockeyScores />
        </div>
      </div>
    </div>
  );
};

export default Scores;