import React, { useContext, useState } from "react";
import PropTypes from "prop-types";

import {
  Button,
  TextField,
  DialogContentText,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material/";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { HELD, TAP } from "../../constants/button-modes";
import { LayoutContext } from "../../providers/layout/layout.provider";
import { isEmpty } from "../../utilities/data-parsing";

export const KeyDialogPage1CurrentBindingSettings = (props) => {
  const { onClose, setPage } = props;
  const [isEdit, setIsEdit] = useState(false);
  const {
    selectedBindingIndex,
    selectedLayerIndex,
    layout,
    // changeBindingLabel,
    setSelectedBindingActionKey,
    setBindingActionValue,
  } = useContext(LayoutContext);
  const layers = layout.layers;
  const [localLabel, setLocalLabel] = useState(
    layers[selectedLayerIndex]?.bindings[selectedBindingIndex]?.label || null
  );
  if (!layers[selectedLayerIndex].bindings[selectedBindingIndex]) return;

  const { index, tap, held } =
    layers[selectedLayerIndex]?.bindings[selectedBindingIndex];

  const selectedBinding =
    layers[selectedLayerIndex]?.bindings[selectedBindingIndex];

  const handleSelectBindingKey = (bindingType) => {
    setSelectedBindingActionKey(bindingType);
    console.log({ selectedBinding, key: selectedBinding[bindingType] });
    if (isEmpty(selectedBinding[bindingType])) {
      setPage(3);
    } else {
      setPage(2);
    }
  };

  const handleClearBindingTypeValue = (bindingActionKey) => {
    const bindingActionValue = {};
    setBindingActionValue({ bindingActionKey, bindingActionValue });
  };

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleCancel = () => {
    setIsEdit(false);
    setLocalLabel(localLabel);
  };

  const handleSave = () => {
    const input = localLabel;
    setIsEdit(false);
    // changeBindingLabel({ input });
  };

  const handleOnChange = (e) => {
    const input = e.target.value;
    setLocalLabel(input);
  };

  return (
    <>
      <DialogTitle>
        <div> Key: {index + 1}</div>
        <TextField
          id="binding-label"
          value={localLabel || ""}
          label="Binding Label"
          variant="standard"
          onChange={handleOnChange}
          disabled={!isEdit}
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
      </DialogTitle>
      <DialogContent dividers>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <DialogContentText>When</DialogContentText>{" "}
          <Button onClick={() => handleSelectBindingKey(TAP)}>Tapped</Button>
          <DialogContentText>:</DialogContentText> {tap.label}
          <Button onClick={() => handleClearBindingTypeValue(TAP)}>
            Clear
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <DialogContentText>When</DialogContentText>{" "}
          <Button onClick={() => handleSelectBindingKey(HELD)}>Held</Button>
          <DialogContentText>:</DialogContentText> {held.label}
          <Button onClick={() => handleClearBindingTypeValue(HELD)}>
            Clear
          </Button>
        </div>
      </DialogContent>
    </>
  );
};

KeyDialogPage1CurrentBindingSettings.propTypes = {
  onClose: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
};
