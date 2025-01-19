// Enhanced View with Better Design and Fixed Container Size
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ViewItems from './pages/ViewItems';
import CreateItem from './pages/CreateItem';
import UpdateItem from './pages/UpdateItem';
import AddEvent from './pages/AddEvent';
import './styles/global.css';

const AppContent = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 fixed-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h3 className="text-4xl font-bold text-center text-gray-800 mb-8 font-sans">
          Supply Chain Track & Trace
        </h3>

        <div className="bg-white rounded-xl shadow-lg p-4 mb-8 tabs-container">
          {tabs.map((tab, index) => (
            <button
              key={tab.path}
              onClick={() => handleTabChange(index, tab.path)}
              className={`
                tab-button
                ${tabIndex === index ? 'active' : ''}
              `}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <Routes>
            <Route path="/" element={<ViewItems />} />
            <Route path="/create-item" element={<CreateItem />} />
            <Route path="/update-item" element={<UpdateItem />} />
            <Route path="/add-event" element={<AddEvent />} />
          </Routes>
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
