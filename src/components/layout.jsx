// src/components/Layout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import {
  AppBar, Box, CssBaseline, Drawer, IconButton, List, ListItem,
  ListItemIcon, ListItemText, Toolbar, Typography, Menu, MenuItem, Avatar, Divider, ListItemButton
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard as DashboardIcon, People as PeopleIcon,
  Event as EventIcon, Logout as LogoutIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Tutors', icon: <PeopleIcon />, path: '/tutors' },
  { text: 'Bookings', icon: <EventIcon />, path: '/bookings' },
];

const Layout = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const drawer = (
    <div>
      <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
        <Typography variant="h6" noWrap component="div" color="primary">
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path || (location.pathname === '/' && item.path === '/dashboard')}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;
  const pageTitle = menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard';

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.06)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {pageTitle}
          </Typography>
          <div>
            <IconButton onClick={handleMenu} sx={{ p: 0 }}>
              <Avatar alt="Admin" src="/placeholder-avatar.jpg" />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{ mt: '45px' }}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MMuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* --- INI ADALAH BAGIAN UTAMA YANG MEMPERBAIKINYA --- */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 3 }, // Padding keliling
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: 'background.default',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center' // <--- !!!!!!! INI MEMAKSA KONTEN KE TENGAH !!!!!!!
        }}
      >
        <Toolbar /> {/* Spacer untuk AppBar */}
        
        {/* Pembungkus konten ini sekarang akan dipusatkan oleh 'alignItems' di atas */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '1400px', // Atur lebar maksimum
            flexGrow: 1
          }}
        >
          <Outlet /> {/* <== Dashboard.jsx, Tutors.jsx, dll akan dirender di sini */}
        </Box>
        
      </Box>
      {/* --- AKHIR DARI BAGIAN PERBAIKAN --- */}
      
    </Box>
  );
};

export default Layout;