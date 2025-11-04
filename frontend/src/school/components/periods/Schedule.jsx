import React, { useState } from 'react';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import FixedSchedule from './FixedSchedule';
import TodaySchedule from './TodaySchedule';

const Schedule = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Paper sx={{ borderRadius: '15px', overflow: 'hidden' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            bgcolor: '#f5f5f5',
            '& .MuiTab-root': {
              fontSize: '1rem',
              fontWeight: 'bold',
              py: 2,
            },
          }}
        >
          <Tab label="Fixed Weekly Schedule" />
          <Tab label="Today's Schedule" />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 2 }}>
        {tabValue === 0 && <FixedSchedule />}
        {tabValue === 1 && <TodaySchedule />}
      </Box>
    </Container>
  );
};

export default Schedule;
