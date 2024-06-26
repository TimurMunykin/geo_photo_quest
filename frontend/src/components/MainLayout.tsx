import React, { useState } from "react";
import { InputLabel, MenuItem, Select } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Map from "./Map";
import "./MainLayout.css";
import { IconButton, Dialog, DialogContent } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import EarbudsIcon from "@mui/icons-material/Earbuds";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import QuestSelector from "./QuestSelector";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentQuest } from "../redux/questsSlice";
import PestControlIcon from '@mui/icons-material/PestControl';
import { RootState } from "../redux/store";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, _] = useState<{ latitude: number; longitude: number }[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const handleOpenDialog = (dialogType: string) => {
    navigate(`/${dialogType}`);
  };
  const currentQuestId = useSelector<RootState, string>((state) => state.quests.currentQuestId ?? "");
  console.log('currentQuestId', currentQuestId);
  const iconButtonStyle = {
    backgroundColor: "white",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const [age, setAge] = React.useState("");

  const handleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setAge(event.target.value);
  };

  const setSelectedQuestId = (questId: string) => {
    dispatch(setCurrentQuest(questId));
  }

  return (
    <div className="relative w-screen h-screen">
      <Map route={route} />
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
        <QuestSelector selectedQuestId={currentQuestId} setSelectedQuestId={setSelectedQuestId} />
        <IconButton
          color="primary"
          aria-label="pin location"
          style={iconButtonStyle}
          onClick={() => handleOpenDialog("quest-management")}
        >
          <EarbudsIcon />
        </IconButton>
        <IconButton
          color="primary"
          aria-label="login"
          style={iconButtonStyle}
          onClick={() => handleOpenDialog("auth")}
        >
          <LoginIcon />
        </IconButton>
        <IconButton
          color="primary"
          aria-label="fact check"
          style={iconButtonStyle}
          onMouseEnter={() => console.log("hover")}
          onClick={() => handleOpenDialog("auth")}
        >
          <FactCheckIcon />
        </IconButton>
        <IconButton
          color="primary"
          aria-label="pin location"
          style={iconButtonStyle}
          onClick={() => handleOpenDialog("debugger-cmp")}
        >
          <PestControlIcon />
        </IconButton>
      </div>
      <Dialog fullWidth={true} maxWidth={'md'} open={location.pathname !== "/"} onClose={() => navigate("/")}>
        <DialogContent>{children}</DialogContent>
      </Dialog>
    </div>
  );
};

export default MainLayout;