import { useState } from 'react';
import './BottomNavbar.scss';
import "../../styles/custom-bootstrap.scss";

import { NavLink } from 'react-router-dom';
import { 
  FaNewspaper, 
  FaBuildingColumns, 
  FaChartLine,
  FaGlobe, 
  FaFootball,  
  FaLaptopCode,
  FaRegStar,
  FaFilm,           // good candidate for Movies
  FaGamepad,        // good for Video Games
  FaTv,
  FaChevronUp,
  FaChevronDown
} from 'react-icons/fa6';

const BottomNavigation = () => {
  const allNavItems = [
    { to: '/',          label: 'FrontPage', icon: <FaNewspaper size={24} /> },
    { to: '/politics',  label: 'Politics',  icon: <FaBuildingColumns size={24} /> },
    { to: '/finance',   label: 'Finance',   icon: <FaChartLine size={24} /> },
    { to: '/world',     label: 'World',     icon: <FaGlobe size={24} /> },
    { to: '/sports',    label: 'Sports',    icon: <FaFootball size={24} /> },
    { to: '/tech',      label: 'Tech',      icon: <FaLaptopCode size={24} /> },
    // ──────────────────────────────────────
    // Items that go into the "More" section
    { to: '/celebs',    label: 'Celebs',    icon: <FaRegStar size={24} /> },
    { to: '/movies',    label: 'Movies',    icon: <FaFilm size={24} /> },
    { to: '/videogames', label: 'Video Games', icon: <FaGamepad size={24} /> },
    { to: '/tv',        label: 'TV',        icon: <FaTv size={24} /> },
    // You can keep adding more here...
  ];

  const MAX_MAIN_ITEMS = 6;

  const mainItems = allNavItems.slice(0, MAX_MAIN_ITEMS);
  const extraItems = allNavItems.slice(MAX_MAIN_ITEMS);

  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded(prev => !prev);

  const extraRows = [];
  for (let i = 0; i < extraItems.length; i += MAX_MAIN_ITEMS) {
    extraRows.push(extraItems.slice(i, i + MAX_MAIN_ITEMS));
  }

  return (
    <div
      className="fixed-bottom border-top shadow-sm"
      style={{
        height: expanded ? 'auto' : '80px',
        transition: 'height 0.28s ease-out',
        overflow: 'hidden',
        backgroundColor: 'var(--bs-dark)', // or keep your $primary
      }}
    >
      <div className="d-flex flex-column">
        {/* Extra rows – same structure as main row */}
        {expanded &&
          extraRows.map((row, rowIndex) => (
            <div
              key={`extra-row-${rowIndex}`}
              className="d-flex justify-content-center"
              style={{ height: '80px' }}           // ← fixed height like main bar
            >
              {row.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex-fill d-flex flex-column justify-content-center align-items-center text-decoration-none ${
                      isActive ? 'text-warning' : 'text-light'
                    }`
                  }
                  style={{ minWidth: 0 }}
                  end
                  onClick={() => setExpanded(false)}
                >
                  <div className="mb-1">{item.icon}</div>
                  <small style={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
                    {item.label}
                  </small>
                </NavLink>
              ))}
            </div>
          ))}

        {/* Main bottom row – now identical structure */}
        <div className="d-flex justify-content-center" style={{ height: '80px' }}>
          {mainItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex-fill d-flex flex-column justify-content-center align-items-center text-decoration-none ${
                  isActive ? 'text-warning' : 'text-light'
                }`
              }
              style={{ minWidth: 0 }}
              end
            >
              <div className="mb-1">{item.icon}</div>
              <small style={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
                {item.label}
              </small>
            </NavLink>
          ))}

          {extraItems.length > 0 && (
            <div
              className={`flex-fill d-flex flex-column justify-content-center align-items-center text-decoration-none cursor-pointer ${
                expanded ? 'text-warning' : 'text-light'
              }`}
              onClick={toggleExpand}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && toggleExpand()}
            >
              <div className="mb-1">
                {expanded ? <FaChevronDown size={24} /> : <FaChevronUp size={24} />}
              </div>
              <small style={{ fontSize: '0.75rem', lineHeight: 1.2 }}>More</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;