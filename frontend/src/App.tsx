import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Typography, AppBar, Tabs, Tab } from '@mui/material';
import ViewItems from './pages/ViewItems';
import './styles/global.css';

const App = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Router>
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
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
