import { useState } from 'react';
import './BottomNavbar.scss';
import "../../styles/custom-bootstrap.scss";

import { NavLink } from 'react-router-dom';
import { 
  FaNewspaper, FaBuildingColumns, FaChartLine, FaGlobe, FaFootball,  
  FaLaptopCode, FaRegStar, FaFilm, FaGamepad, FaTv, FaChevronUp,
  FaChevronDown, FaVial, FaStethoscope
} from 'react-icons/fa6';

const BottomNavigation = () => {
  const allNavItems = [
    { to: '/',          label: 'Front Page', icon: <FaNewspaper size={24} /> },
    { to: '/politics',  label: 'Politics',  icon: <FaBuildingColumns size={24} /> },
    { to: '/finance',   label: 'Finance',   icon: <FaChartLine size={24} /> },
    { to: '/world',     label: 'World',     icon: <FaGlobe size={24} /> },
    { to: '/sports',    label: 'Sports',    icon: <FaFootball size={24} /> },
    { to: '/tech',      label: 'Tech',      icon: <FaLaptopCode size={24} /> },
    // ──────────────────────────────────────
    // Items that go into the "More" section
    { to: '/celebs',    label: 'Celebrities',    icon: <FaRegStar size={24} /> },
    { to: '/movies',    label: 'Movies',    icon: <FaFilm size={24} /> },
    { to: '/tv',        label: 'TV Shows',        icon: <FaTv size={24} /> },
    { to: '/videogames',label: 'Games', icon: <FaGamepad size={24} /> },
    { to: '/travel',    label: 'Travel',    icon: <FaTv size={24} /> },
    { to: '/health',    label: 'Health',    icon: <FaStethoscope size={24} /> },
    { to: '/science',   label: 'Science',   icon: <FaVial size={24} /> },
  ];

  const MAX_MAIN_ITEMS = 6;     // ← Main bar (6 icons + More)
  const ITEMS_PER_EXTRA_ROW = 7; // ← This is what you want for extra rows

  const mainItems = allNavItems.slice(0, MAX_MAIN_ITEMS);
  const extraItems = allNavItems.slice(MAX_MAIN_ITEMS);

  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded(prev => !prev);

  // Create extra rows with 7 items each
  const extraRows = [];
  for (let i = 0; i < extraItems.length; i += ITEMS_PER_EXTRA_ROW) {
    extraRows.push(extraItems.slice(i, i + ITEMS_PER_EXTRA_ROW));
  }

  return (
    <div
      className="fixed-bottom border-top shadow-sm"
      style={{
        height: expanded ? 'auto' : '80px',
        transition: 'height 0.28s ease-out',
        overflow: 'hidden',
        backgroundColor: 'var(--bs-dark)',
      }}
    >
      <div className="d-flex flex-column">
        {/* Extra rows – now with 7 items per row */}
        {expanded &&
          extraRows.map((row, rowIndex) => (
            <div
              key={`extra-row-${rowIndex}`}
              className="d-flex justify-content-center"
              style={{ height: '80px' }}
            >
              {row.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex-fill d-flex flex-column justify-content-center align-items-center text-decoration-none ${
                      isActive ? 'text-warning' : 'text-light-var'
                    }`
                  }
                  style={{ minWidth: 0 }}
                  end
                  onClick={() => setExpanded(false)}
                >
                  <div className="mb-1 icon-wrapper">{item.icon}</div>
                  <small style={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
                    {item.label}
                  </small>
                </NavLink>
              ))}
            </div>
          ))}

        {/* Main bottom row – 6 items + More */}
        <div className="d-flex justify-content-center" style={{ height: '80px' }}>
          {mainItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex-fill d-flex flex-column justify-content-center align-items-center text-decoration-none  ${
                  isActive ? 'text-warning' : 'text-light-var'
                }`
              }
              style={{ minWidth: 0 }}
              end
            >
              <div className="mb-1 icon-wrapper">{item.icon}</div>
              <small style={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
                {item.label}
              </small>
            </NavLink>
          ))}

          {/* More Button */}
          {extraItems.length > 0 && (
            <div
              className={`flex-fill d-flex flex-column justify-content-center align-items-center text-decoration-none cursor-pointer ps-2 pe-2 ${
                expanded ? 'text-warning' : 'text-light-var'
              }`}
              onClick={toggleExpand}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && toggleExpand()}
              // style={{ minWidth: '68px' }}   // Helps prevent squeezing
            >
              <div className="mb-1 icon-wrapper">
                {expanded ? <FaChevronDown size={24} /> : <FaChevronUp size={24} />}
              </div>
              {/* <small style={{ fontSize: '0.75rem', lineHeight: 1.2 }}>More</small> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;