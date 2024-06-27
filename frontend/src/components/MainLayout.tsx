import React, { useEffect, useState } from "react";
import {  } from "@mui/material";
import { LocationOn, ZoomIn, ZoomOut, Layers } from "@mui/icons-material";
import { useLocation, useNavigate } from 'react-router-dom';
import Map from './Map';
import "./MainLayout.css";
import { IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, _] = useState<{ latitude: number; longitude: number }[]>([]);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const handleOpenDialog = (dialogType: string) => {
    navigate(`/${dialogType}`);
  };

  const location = useLocation();

  return (<div className="relative w-screen h-screen">
    <Map route={route} />
    <div
      style={{
        position: "absolute",
        bottom: "16px",
        right: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        zIndex: 1000,
      }}
    >
      <IconButton
        color="primary"
        aria-label="pin location"
        style={{ backgroundColor: "white" }}
        onClick={() => handleOpenDialog("quest-management")}
      >
        <LocationOn />
      </IconButton>
      <IconButton
        color="primary"
        aria-label="zoom in"
        style={{ backgroundColor: "white" }}
        onClick={() => handleOpenDialog("auth")}
      >
        <ZoomIn />
      </IconButton>
      <IconButton
        color="primary"
        aria-label="zoom out"
        style={{ backgroundColor: "white" }}
      >
        <ZoomOut />
      </IconButton>
      <IconButton
        color="primary"
        aria-label="layers"
        style={{ backgroundColor: "white" }}
      >
        <Layers />
      </IconButton>
      <Dialog open={location.pathname !== '/'} onClose={() => navigate('/')}>
        {/* <DialogTitle>Login</DialogTitle> */}
        <DialogContent>
          {children}
        </DialogContent>
      </Dialog>

    </div>
  </div>);
};

export default MainLayout;
