import React, { useContext } from "react";
import { IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { LayoutContext } from "../../providers/layout/layout.provider";
import { saveAs } from "file-saver";
import { generateBlob } from "./blob-content";

export const DownloadButton = () => {
  const {
    layout: { layers },
  } = useContext(LayoutContext);

  const handleDownload = () => {
    var blob = new Blob(generateBlob(layers), {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, "corne.keymap");
  };

  return (
    <div>
      <div className="delete-button">
        <IconButton color="default" onClick={handleDownload}>
          <DownloadIcon sx={{ pointerEvents: "none" }} />
        </IconButton>
      </div>
    </div>
  );
};
