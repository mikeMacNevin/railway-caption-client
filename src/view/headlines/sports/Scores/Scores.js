

import { useState, useEffect} from 'react';
import { Nav } from 'react-bootstrap';
import {
  FaBasketballBall,
  FaFutbol,
  FaFootballBall,
  FaBaseballBall,
  FaTableTennis,
  FaHockeyPuck,
} from 'react-icons/fa';

// Import your sport-specific Scores components
// import BasketballScores from './ScoresWidgets/BasketballScores';
import SoccerScores from './ScoresWidgets/SoccerScores';
import FootballScores from './ScoresWidgets/FootballScores';
import BaseballScores from './ScoresWidgets/BaseballScores';
import TennisScores from './ScoresWidgets/TennisScores';
import HockeyScores from './ScoresWidgets/HockeyScores';
import BasketballScores from './ScoresWidgets/BasketballScores';



const Scores = () => {
  const [selectedSport, setSelectedSport] = useState('Soccer');

  const sports = [
    { name: 'Basketball', icon: <FaBasketballBall /> },
    { name: 'Soccer', icon: <FaFutbol /> },
    { name: 'Football', icon: <FaFootballBall /> },
    { name: 'Baseball', icon: <FaBaseballBall /> },
    { name: 'Tennis', icon: <FaTableTennis /> },
    { name: 'Hockey', icon: <FaHockeyPuck /> },
  ];

  const renderScores = () => {
    switch (selectedSport) {
      case 'Basketball':
        return <BasketballScores/> 
      case 'Soccer':
        return <SoccerScores />;
      case 'Football':
        return <FootballScores />;
      case 'Baseball':
        return <BaseballScores />;
      case 'Tennis':
        return <TennisScores />;
      case 'Hockey':
        return <HockeyScores />;
      default:
        return null;
    }
  };

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
      {renderScores()}
    </div>
  );
};

export default Scores;