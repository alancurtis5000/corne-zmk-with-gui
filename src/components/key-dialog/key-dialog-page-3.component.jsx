import React, { useContext } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PropTypes from "prop-types";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import "./key-dialog-page-3.styles.scss";
import { BackButton } from "../back-button/back-button.component";
import { keys } from "../../constants/keys";
import { Button } from "@mui/material";
import { categories } from "../../constants/categories";
import { HELD, TAP } from "../../constants/button-modes";
import { LayoutContext } from "../../providers/layout/layout.provider";
import { BindingAction } from "../../classes/binding-action";

export const KeyDialogPage3 = (props) => {
  const { setPage } = props;
  const {
    selectedBindingIndex,
    selectedLayerIndex,
    setBindingActionValue,
    layout,
    selectedBindingActionKey,
  } = useContext(LayoutContext);
  const layers = layout.layers;
  const { index } = layers[selectedLayerIndex].bindings[selectedBindingIndex];

  const back = () => {
    if ([selectedBindingActionKey].label) {
      setPage(1);
    } else {
      setPage(2);
    }
  };

  const handleOnClick = ({ newBindingTappedValue }) => {
    const { index, label } = layers[0];
    const bindingActionValue = new BindingAction({
      bindingAction: newBindingTappedValue,
      layer: { index, label },
    });
    setBindingActionValue({
      bindingActionKey: selectedBindingActionKey,
      bindingActionValue,
    });

    setPage(2);
  };

  const OptionButton = ({ option }) => {
    return (
      <Button
        variant="outlined"
        onClick={() => handleOnClick({ newBindingTappedValue: option })}
      >
        {option.label}
      </Button>
    );
  };
  const sections = categories.map((category, index) => {
    const options = keys.filter((key) => key.key_category_id === category.id);
    options.sort((a, b) => a.label.localeCompare(b.label));

    return (
      <Accordion key={category.id} defaultExpanded={index === 0}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`${category.label}-content`}
          id={`${category.label}-header`}
        >
          <Typography>{`${category.label}`}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {options.map((option) => {
            if (selectedBindingActionKey === TAP && option.tap) {
              return <OptionButton key={option.id} option={option} />;
            }
            if (selectedBindingActionKey === HELD && option.hold) {
              return <OptionButton key={option.id} option={option} />;
            }
            return null;
          })}
        </AccordionDetails>
      </Accordion>
    );
  });

  return (
    <div className="key-dialog-page-3">
      <DialogTitle>{`Key: ${
        index + 1
      } (Edit ${selectedBindingActionKey} ) `}</DialogTitle>
      <DialogContent dividers>
        <div className="content">
          <div>
            <BackButton onClick={back} />
          </div>
          <div className="key-options">{sections}</div>
        </div>
      </DialogContent>
    </div>
  );
};

KeyDialogPage3.propTypes = {
  setPage: PropTypes.func.isRequired,
};
