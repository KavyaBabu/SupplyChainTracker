import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ViewItems from './pages/ViewItems';
import CreateItem from './pages/CreateItem';
import UpdateItem from './pages/UpdateItem';
import AddEvent from './pages/AddEvent';
import './styles/global.css';

const AppContent = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenWidth < 640;
  const isTablet = screenWidth >= 640 && screenWidth < 1024;

  const tabs = [
    { label: "View Items", path: "/", icon: "📋" },
    { label: "Create Item", path: "/create-item", icon: "➕" },
    { label: "Update Item", path: "/update-item", icon: "📝" },
    { label: "Add Event", path: "/add-event", icon: "🔔" }
  ];

  const handleTabChange = (index: number, path: string) => {
    setTabIndex(index);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4 sm:mb-6">
          Supply Chain Track & Trace
        </h3>

        {isMobile ? (
          <div className="w-full px-4 mb-4">
            <select
              className="w-full p-2 bg-white border border-gray-300 rounded-lg shadow-sm"
              value={tabIndex}
              onChange={(e) => handleTabChange(Number(e.target.value), tabs[Number(e.target.value)].path)}
            >
              {tabs.map((tab, index) => (
                <option key={tab.path} value={index}>
                  {tab.icon} {tab.label}
                </option>
              ))}
            </select>
          </div>
        ) : isTablet ? (
          <div className="flex justify-center space-x-2 mb-4">
            {tabs.map((tab, index) => (
              <button
                key={tab.path}
                onClick={() => handleTabChange(index, tab.path)}
                className={`p-3 rounded-lg transition-colors duration-200 ${
                  tabIndex === index
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2 mb-6 tabs-container">
            {tabs.map((tab, index) => (
              <button
                key={tab.path}
                onClick={() => handleTabChange(index, tab.path)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 tab-button ${
                  tabIndex === index
                    ? 'active'
                    : ''
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 overflow-hidden">
          <div className="w-full overflow-x-auto">
            <Routes>
              <Route path="/" element={<ViewItems />} />
              <Route path="/create-item" element={<CreateItem />} />
              <Route path="/update-item" element={<UpdateItem />} />
              <Route path="/add-event" element={<AddEvent />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;