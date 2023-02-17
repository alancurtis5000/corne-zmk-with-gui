import React, { createContext, useState } from "react";
import propTypes from "prop-types";
import {
  createLayerUtil,
  moveLayerUtil,
  deleteLayerUtil,
  updateLayerLabelUtil,
  setBindingActionValueUtil,
  setBindingActionKeyModifiersUtil,
  setSelectedBindingLayerUtil,
} from "./layout.utils";
import { updateLayoutApi } from "../../api/layouts.api";

// can I and should I right test for this?
/* istanbul ignore next */
export const LayoutContext = createContext({
  // state values and actions
  layout: {},
  setLayout: () => {},
  originalLayout: {},
  setLayoutOriginal: () => {},
  selectedLayerIndex: 0,
  setSelectedLayerIndex: () => {},
  hasBeenChanged: false,
  setHasBeenChanged: () => {},
  selectedBindingIndex: 0,
  setSelectedBindingIndex: () => {},
  selectedBindingActionKey: "",
  setSelectedBindingActionKey: () => {},

  // extra actions
  createLayer: () => {},
  moveLayer: () => {},
  deleteLayer: () => {},
  updateLayerLabel: () => {},
  setBindingActionValue: () => {},
  setBindingActionKeyModifiers: () => {},
  setSelectedBindingLayer: () => {},
  saveLayout: () => {},
});

// can I and should I right test for this?
/* istanbul ignore next */
export const LayoutProvider = ({ children }) => {
  // state values and actions
  const [layout, setLayout] = useState({});
  const [layoutOriginal, setLayoutOriginal] = useState({});
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);
  const [hasBeenChanged, setHasBeenChanged] = useState(false);
  const [selectedBindingIndex, setSelectedBindingIndex] = useState(0);
  const [selectedBindingActionKey, setSelectedBindingActionKey] = useState("");

  // extra actions

  const createLayer = () => {
    setLayout(createLayerUtil({ layout }));
    setSelectedLayerIndex(layout.layers.length);
    setHasBeenChanged(true);
  };

  const moveLayer = ({ direction, index }) => {
    setLayout(moveLayerUtil({ layout, direction, index }));
    setHasBeenChanged(true);
    if (direction === "left") {
      if (index !== 0) {
        setSelectedLayerIndex(index - 1);
      }
    } else {
      if (index !== layout.layers.length - 1) {
        setSelectedLayerIndex(index + 1);
      }
    }
  };
  const deleteLayer = async () => {
    const layers = layout.layers;
    // cant delete if only one layer
    if (selectedLayerIndex === 0 && layers.length === 1) return;

    setLayout(deleteLayerUtil({ layout, selectedLayerIndex }));
    setHasBeenChanged(true);
    if (selectedLayerIndex === 0) {
    } else {
      setSelectedLayerIndex(selectedLayerIndex - 1);
    }
  };

  const updateLayerLabel = async ({ input }) => {
    setLayout(updateLayerLabelUtil({ layout, input, selectedLayerIndex }));
  };

  const setBindingActionValue = ({ bindingActionKey, bindingActionValue }) => {
    setLayout(
      setBindingActionValueUtil({
        layout,
        bindingActionKey,
        bindingActionValue,
        selectedLayerIndex,
        selectedBindingIndex,
      })
    );
  };

  const setBindingActionKeyModifiers = ({ modifier }) => {
    setLayout(
      setBindingActionKeyModifiersUtil({
        layout,
        selectedBindingActionKey,
        selectedLayerIndex,
        selectedBindingIndex,
        modifier,
      })
    );
  };

  const setSelectedBindingLayer = ({ index, label }) => {
    setLayout(
      setSelectedBindingLayerUtil({
        layout,
        selectedBindingActionKey,
        selectedLayerIndex,
        selectedBindingIndex,
        index,
        label,
      })
    );
  };

  const saveLayout = () => {
    updateLayoutApi({ layout });
  };

  return (
    <LayoutContext.Provider
      value={{
        // state values and actions
        layout,
        setLayout,
        layoutOriginal,
        setLayoutOriginal,
        selectedLayerIndex,
        setSelectedLayerIndex,
        hasBeenChanged,
        setHasBeenChanged,
        selectedBindingIndex,
        setSelectedBindingIndex,
        selectedBindingActionKey,
        setSelectedBindingActionKey,
        // extra actions
        createLayer,
        moveLayer,
        deleteLayer,
        updateLayerLabel,
        setBindingActionValue,
        setBindingActionKeyModifiers,
        setSelectedBindingLayer,
        saveLayout,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

LayoutProvider.propTypes = {
  children: propTypes.node,
};
