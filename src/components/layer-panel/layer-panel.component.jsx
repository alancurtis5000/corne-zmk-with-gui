import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import "./layer-panel.styles.scss";
import { KeyButton } from "../key-button/key-button.component";
import { IconButton, TextField, Typography } from "@mui/material";
import { useContext } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { DeleteLayerButton } from "../delete-layer-button/delete-layer-button.compnent";
import { LayoutContext } from "../../providers/layout/layout.provider";

export const LayerPanel = (props) => {
  const { children, index, layer, ...other } = props;
  const { updateLayerLabel, moveLayer, selectedLayerIndex } =
    useContext(LayoutContext);
  const [isEdit, setIsEdit] = useState(false);
  const [label, setLabel] = useState(layer.label);
  const [error, setError] = useState(false);

  const gridLeft = () => {
    return (
      <div className="grid-left">
        {layer.bindings.map((key, index) => {
          const button = <KeyButton key={key.index} keyData={key} />;
          if (
            index < 5 ||
            (index > 9 && index < 15) ||
            (index > 19 && index < 25) ||
            (index > 29 && index < 33)
          ) {
            return button;
          }
          return null;
        })}
      </div>
    );
  };

  const gridRight = () => {
    return (
      <div className="grid-right">
        {layer.bindings.map((key, index) => {
          const button = <KeyButton key={key.index} keyData={key} />;
          if (
            (index > 4 && index < 10) ||
            (index > 14 && index < 20) ||
            (index > 24 && index < 30) ||
            index > 32
          ) {
            return button;
          }
          return null;
        })}
      </div>
    );
  };

  const handleOnChange = (e) => {
    const input = e.target.value;
    setLabel(input);
  };

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleCancel = () => {
    setIsEdit(false);
    setError(false);
    setLabel(layer.label);
  };

  const handleSave = () => {
    const input = label;
    if (!label) {
      setError(true);
    } else {
      updateLayerLabel({ input });
      setError(false);
      setIsEdit(false);
    }
  };

  const handleMoveLayer = (e) => {
    const direction = e.target.value;
    moveLayer({ direction, index });
  };

  return (
    <div
      className="layer-panel"
      role="tabpanel"
      hidden={selectedLayerIndex !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {selectedLayerIndex === index && (
        <Box sx={{ p: 3 }}>
          <div className="layer-actions">
            <div className="move-buttons">
              <IconButton
                color="default"
                onClick={handleMoveLayer}
                value="left"
                className="move-button"
              >
                <ArrowCircleLeftIcon sx={{ pointerEvents: "none" }} />
              </IconButton>
              <Typography>Move Layer</Typography>
              <IconButton
                color="default"
                onClick={handleMoveLayer}
                value="right"
                className="move-button"
              >
                <ArrowCircleRightIcon sx={{ pointerEvents: "none" }} />
              </IconButton>
            </div>
            <div className="label">
              <TextField
                id="layer-label"
                value={label}
                label="Layer Name"
                variant="standard"
                onChange={handleOnChange}
                disabled={!isEdit}
                required
                helperText={error ? "Label required." : " "}
                error={error}
              />
              {isEdit ? (
                <>
                  <IconButton color="primary" onClick={handleSave}>
                    <SaveIcon />
                  </IconButton>
                  <IconButton color="warning" onClick={handleCancel}>
                    <CancelIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton
                    className="edit-button"
                    color="default"
                    onClick={handleEdit}
                  >
                    <EditIcon />
                  </IconButton>
                </>
              )}
            </div>
            <div className="delete-button">
              <DeleteLayerButton />
            </div>
          </div>

          <div className="full-keyboard">
            {gridLeft()}
            {gridRight()}
          </div>
        </Box>
      )}
    </div>
  );
};

LayerPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
};
