import React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import './Sidebar.css'; // Import the styles

const Sidebar = ({ open, onSelectItem }) => {
  if (!open) return null;

  const handleItemClick = (text) => {
    if (onSelectItem) {
      onSelectItem(text);
    }
  };

  return (
    <Box 
      className="sidebar-container"
      sx={{
        borderRight: "0.01px solid #ffd9009d", // Fix: Apply border properly
        height: "100vh",
        backgroundColor: "rgb(0,0,0)"
      }}
    >
      <List className="sidebar-list" style={{color : "#ffd9009d"}}>
        {["Personal", "Challenges", "MyVaults", "Expenses", "Create", "StatsDashboard"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton 
              className="sidebar-list-item-button"
              onClick={() => handleItemClick(text)}
            >
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon style={{color: "#ffd9009d"}}/> : <MailIcon style={{color: "#ffd9009d"}}/>}
              </ListItemIcon>
              <ListItemText primary={text} sx={{ fontSize: "1rem" }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider style={{backgroundColor: "#ffd9009d"}}/>
      <List className="sidebar-list" style={{color : "#ffd9009d"}}>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton className="sidebar-list-item-button">
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon style={{color: "#ffd9009d"}}/> : <MailIcon style={{color: "#ffd9009d"}}/>}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
