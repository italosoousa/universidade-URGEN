import React from 'react';
import { Box, styled, Container } from '@mui/material'; // Import Container and styled
import Header from './Header';
import Sidebar from './Sidebar';

// Define the DrawerHeader to push content below the AppBar
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  const handleSidebarOpen = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Header onMenuClick={handleSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: (theme) => theme.palette.background.default, // Use theme background color
          minHeight: '100vh',
          // Original main styles:
          // width: 100%; max-width: 1200px; margin: 0 auto; padding: 24px 16px 32px;
          // Responsive padding for smaller screens
        }}
      >
        <DrawerHeader /> {/* Add DrawerHeader to push content below the AppBar */}
        <Container maxWidth="lg" sx={{ // Use Container for max-width and margin auto
          py: { xs: 2, md: 3 }, // Responsive vertical padding: 16px (xs) / 24px (md)
          px: { xs: 2, md: 2 }, // Responsive horizontal padding: 16px (xs) / 16px (md)
          pt: 0, // No top padding for container itself, it's handled by DrawerHeader
          pb: { xs: 3, md: 4 }, // Responsive bottom padding: 24px (xs) / 32px (md)
        }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;