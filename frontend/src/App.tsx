import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Container, Typography, AppBar, Tabs, Tab } from '@mui/material';
import ViewItems from './pages/ViewItems';
import CreateItem from './pages/CreateItem';

import './styles/global.css';
import UpdateItem from './pages/UpdateItem';
import AddEvent from './pages/AddEvent';

const AppContent = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    if (newValue === 0) navigate('/');
    if (newValue === 1) navigate('/create-item');
    if (newValue === 2) navigate('/update-item');
    if (newValue === 3) navigate('/add-event');
  };

  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom>
        Supply Chain Track & Trace
      </Typography>

      <AppBar position="static" color="default">
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="View Items" value={0} onClick={() => setTabIndex(0)} />
          <Tab label="Create Item" value={1} onClick={() => setTabIndex(1)} />
          <Tab label="Update Item" value={2} onClick={() => setTabIndex(2)} />
          <Tab label="Add Event" value={3} onClick={() => setTabIndex(3)} />
        </Tabs>
      </AppBar>

      <Routes>
        <Route path="/" element={<ViewItems />} />
        <Route path="/create-item" element={<CreateItem />} />
        <Route path="/update-item" element={<UpdateItem />} />
        <Route path="/add-event" element={<AddEvent />} />
      </Routes>
    </Container>
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
