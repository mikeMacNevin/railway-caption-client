import { NavLink } from 'react-router-dom';
import { 
  FaNewspaper, 
  FaBuildingColumns, 
  FaChartLine,
  FaGlobe, 
  FaFootball,  
  FaRegStar, 
  FaLaptopCode
} from 'react-icons/fa6';

const BottomNavigation = () => {
  const navItems = [
    { to: '/', label: 'FrontPage', icon: <FaNewspaper size={24} /> },
    { to: '/politics', label: 'Politics', icon: <FaBuildingColumns size={24} /> },
    { to: '/finance', label: 'Finance', icon: <FaChartLine size={24} /> },
    { to: '/world', label: 'World', icon: <FaGlobe size={24} /> },
    { to: '/sports', label: 'Sports', icon: <FaFootball  size={24} /> },
    { to: '/tech', label: 'Tech', icon: <FaLaptopCode size={24} /> },
    { to: '/celebs', label: 'Celebs', icon: <FaRegStar size={24} /> }

  ];

  return (
    <div className="fixed-bottom bg-white border-top shadow-sm" style={{ height: '80px'}}>
      <div className="d-flex justify-content-center h-100">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) =>
              `flex-fill d-flex flex-column justify-content-center align-items-center text-decoration-none ${
                isActive ? 'text-primary' : 'text-dark'
              }`
            }
            style={{ minWidth: 0 }} // Allows flex items to shrink properly
            end
          >
            <div className="mb-1">
              {item.icon}
            </div>
            <small style={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
              {item.label}
            </small>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;