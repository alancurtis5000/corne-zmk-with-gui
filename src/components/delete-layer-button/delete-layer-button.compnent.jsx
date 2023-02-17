import React, { useContext, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { LayoutContext } from "../../providers/layout/layout.provider";

export const DeleteLayerButton = (props) => {
  const { deleteLayer, layout, selectedLayerIndex } = useContext(LayoutContext);
  const { layers } = layout;
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteLayer = () => {
    deleteLayer();
    handleClose();
  };

  return (
    <div>
      <div className="delete-button">
        <IconButton color="default" onClick={handleClickOpen}>
          <DeleteIcon sx={{ pointerEvents: "none" }} />
        </IconButton>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Delete layer ${layers[selectedLayerIndex].label}`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this layer ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDeleteLayer} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
