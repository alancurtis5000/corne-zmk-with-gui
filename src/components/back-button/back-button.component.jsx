import React from "react";
import PropTypes from "prop-types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";

export const BackButton = ({ onClick }) => {
  return (
    <Button onClick={onClick} startIcon={<ArrowBackIcon />}>
      Back
    </Button>
  );
};

BackButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
