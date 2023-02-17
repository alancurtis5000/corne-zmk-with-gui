import React, { useContext } from "react";
import SaveIcon from "@mui/icons-material/Save";
import Button from "@mui/material/Button";
import "./bottom-actions.styles.scss";
import { DownloadButton } from "../download-button/download-button";
import { LayoutContext } from "../../providers/layout/layout.provider";
import { useLocation } from "react-router-dom";

export const BottomActions = () => {
  const { saveLayout } = useContext(LayoutContext);
  const location = useLocation();

  const handleSave = () => {
    saveLayout();
  };

  return (
    <div className="bottom-actions">
      {location.pathname !== "/" && (
        <>
          <Button onClick={handleSave} startIcon={<SaveIcon />}>
            Save
          </Button>
          <DownloadButton />
        </>
      )}
    </div>
  );
};
