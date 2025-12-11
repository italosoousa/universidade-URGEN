import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import {
  Home,
  People,
  School,
  Work,
  BarChart,
  ExitToApp,
} from "@mui/icons-material";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const drawerWidth = 240;

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, role, logout } = useAuth();

  const dashboardPath =
    role !== null ? `/${role.toLowerCase()}-dashboard` : "/";

  const menuItems = [
    { text: "Início", icon: <Home />, path: dashboardPath },
    { text: "Funcionários", icon: <People />, path: "/funcionarios" },
    { text: "Departamentos", icon: <Work />, path: "/departamentos" },
    { text: "Cargos", icon: <School />, path: "/cargos" },
    { text: "Relatórios", icon: <BarChart />, path: "/relatorios" },
  ];

  const drawer = (
    <div>
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h6" noWrap>
          {/* TROCA 'username' PELO CAMPO CERTO DO SEU USER */}
          {user?.username ?? "Usuário"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {role ?? "Sem papel"}
        </Typography>
      </Box>

      <Divider />

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={onClose}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={logout}>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Sair" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
