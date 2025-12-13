import { NavLink } from 'react-router-dom'; // Assuming you're using react-router-dom for routing

// Import icons from react-icons (install via: npm install react-icons)
// Or replace with your own icons/SVGs
import { 
  FaNewspaper, 
  FaBuildingColumns, 
  FaChartLine,
  FaGlobe, 
  FaBasketball, 
  FaRegStar

} from 'react-icons/fa6';

const BottomNavigation = () => {
  const navItems = [
    { to: '/', label: 'FrontPage', icon: <FaNewspaper size={24} /> },
    { to: '/politics', label: 'Politics', icon: <FaBuildingColumns size={24} /> },
    { to: '/finance', label: 'Finance', icon: <FaChartLine size={24} /> },
    { to: '/world', label: 'World', icon: <FaGlobe size={24} /> },
    { to: '/sports', label: 'Sports', icon: <FaBasketball size={24} /> },
    { to: '/celebs', label: 'Celebs', icon: <FaRegStar size={24} /> },
  ];

  return (
    <div className="fixed-bottom bg-white border-top shadow-sm" style={{ height: '70px' }}>
      <div 
        className="d-flex overflow-x-auto hide-scrollbar"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
        }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `d-flex flex-column flex-grow-1 justify-content-center align-items-center text-decoration-none px-3 py-2 flex-shrink-0 ${
                isActive ? 'text-primary' : 'text-dark'
              }`
            }
            style={{
              minWidth: '80px', // Ensures consistent width per item
              scrollSnapAlign: 'center', // Optional: snaps to center for nicer feel
            }}
            end // For exact match on root '/'
          >
            <div className="mb-1">
              {item.icon}
            </div>
            <small style={{ fontSize: '0.7rem' }}>{item.label}</small>
          </NavLink>
        ))}
      </div>

      {/* Optional: Hide scrollbar visually */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
    </div>
  );
};

export default BottomNavigation;