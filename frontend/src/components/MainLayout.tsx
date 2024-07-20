import React, { useState } from "react";
import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Map from "./map/Map";
import { IconButton, Dialog, DialogContent } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import EarbudsIcon from "@mui/icons-material/Earbuds";
import CloseIcon from "@mui/icons-material/Close";
import QuestSelector from "./map/QuestSelector";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentQuest } from "../redux/questsSlice";
import { RootState } from "../redux/store";
import { updateGeoLocation } from "../redux/photosSlice";
import axios from "axios";
import { API_URL } from "../config";
import useAuth from "../hooks/useAuth";
import LogoutIcon from "@mui/icons-material/Logout";
import MyLocationIcon from "@mui/icons-material/MyLocation";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, _] = useState<{ latitude: number; longitude: number }[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const selectLocationMode = useSelector<RootState, boolean>(
    (state) => state.map.selectLocationMode
  );
  const { isAuthenticated, logout } = useAuth();

  const handleOpenDialog = (dialogType: string) => {
    navigate(`/${dialogType}`);
  };
  const currentQuestId = useSelector<RootState, string>(
    (state) => state.quests.currentQuestId ?? ""
  );

  const setSelectedQuestId = (questId: string) => {
    dispatch(setCurrentQuest(questId));
  };

  const handleLocationSelect = async (latitude: number, longitude: number) => {
    try {
      const photoId = location.state.photoId;
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/photos/${photoId}/geolocation/`,
        { latitude, longitude },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(
        updateGeoLocation({
          photoId: location.state.photoId,
          latitude,
          longitude,
        })
      );
    } catch (error) {
      console.error("Failed to delete photo", error);
    }

    navigate(-1);
  };

  return (
    <div className="relative w-screen h-screen">
      <Map
        route={route}
        selectLocationMode={selectLocationMode}
        onLocationSelect={handleLocationSelect}
      />
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          zIndex: 1000,
        }}
      >
        {isAuthenticated && (
          <>
            <QuestSelector
              selectedQuestId={currentQuestId}
              setSelectedQuestId={setSelectedQuestId}
            />
            <Button
              variant="contained"
              startIcon={<EarbudsIcon sx={{ marginRight: "auto" }} />}
              onClick={() => handleOpenDialog("quest-management")}
            >
              Quests lists
            </Button>
            <Button
              variant="contained"
              startIcon={<MyLocationIcon />}
              onClick={() => handleOpenDialog("auth")}
            >
              My Location
            </Button>
            <Button
              variant="contained"
              // sx={{ justifyContent: "flex-start" }}
              startIcon={<LogoutIcon />}
              onClick={logout}
              color="error"
            >
              Log Out
            </Button>
          </>
        )}
        {!isAuthenticated && (
          <>
            <Button
              variant="contained"
              startIcon={<MyLocationIcon />}
              onClick={() => handleOpenDialog("auth")}
            >
              My Location
            </Button>
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={() => handleOpenDialog("auth")}
            >
              Log In / Sign Up
            </Button>
          </>
        )}
      </div>
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={
          location.pathname !== "/" &&
          !location.pathname.startsWith("/select-location/")
        }
        onClose={() => navigate("/")}
      >
        <DialogContent>{children}</DialogContent>
        <IconButton
          aria-label="close"
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={() => navigate(-1)}
        >
          <CloseIcon />
        </IconButton>
      </Dialog>
    </div>
  );
};

export default MainLayout;
