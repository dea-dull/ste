// Dashboard.jsx
import { Paper, Text } from '@mantine/core';
import Sidebar from '../sidebar/Sidebar.jsx';

const Dashboard = () => {
  return (
    <div >
      {/* Sidebar */}
      <Sidebar />



        <Text>
          Welcome to your dashboard! You can add your main content here.
        </Text>
        {/* Add more sections/components here */}

    </div>
  );
};

export default Dashboard;
