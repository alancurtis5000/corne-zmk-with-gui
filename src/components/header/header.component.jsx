import React, { useContext } from "react";
import "./header.styles.scss";
import { Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { BackButton } from "../back-button/back-button.component";
import { LayoutContext } from "../../providers/layout/layout.provider";
export const Header = () => {
  const {
    setLayout,
    setLayoutOriginal,
    setSelectedLayerIndex,
    setHasBeenChanged,
    setSelectedBindingIndex,
    setSelectedBindingActionKey,
  } = useContext(LayoutContext);

  const location = useLocation();
  const navigate = useNavigate();

  const headerStyles = {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: "20px",
  };

  const backStyles = {
    position: "absolute",
    top: "30px",
    left: "10px",
  };
  const handleBack = () => {
    navigate(`/`);
    setLayout({});
    setLayoutOriginal({});
    setSelectedLayerIndex(0);
    setHasBeenChanged(false);
    setSelectedBindingIndex(0);
    setSelectedBindingActionKey("");
  };
  const renderSubLabel = () => {
    if (location.pathname === "/") {
      return <Typography variant="h5">Layouts</Typography>;
    } else {
      return (
        <>
          <div style={backStyles}>
            <BackButton onClick={handleBack} />
          </div>
          <Typography variant="h5">Layout</Typography>
        </>
      );
    }
  };

  return (
    <div className="header" style={headerStyles}>
      <Typography variant="h4">Keyboard Configurator</Typography>
      <div style={{ display: "flex" }}>{renderSubLabel()}</div>
    </div>
  );
};
