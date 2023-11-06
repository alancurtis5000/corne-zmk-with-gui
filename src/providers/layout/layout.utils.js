import { Layer } from "../../classes/layer";

export const createLayerUtil = ({ layout }) => {
  const label = `Layer_${layout.layers.length}`;
  const index = layout.layers.length;
  const newLayer = new Layer(label, index);
  const updatedLayout = { ...layout, layers: [...layout.layers, newLayer] };
  return updatedLayout;
};

export const moveLayerUtil = ({ layout, direction, index }) => {
  const layers = layout.layers;

  const updatedLayers = [...layers];
  const sourceLayer = updatedLayers.find((layer) => layer.index === index);
  const targetLayer = updatedLayers.find((layer) => {
    if (direction === "left") {
      return layer.index === index - 1;
    } else {
      return layer.index === index + 1;
    }
  });

  // update all the bindings that involve these layers
  if (targetLayer && sourceLayer) {
    updatedLayers?.forEach((layer) => {
      layer?.bindings?.forEach((binding) => {
        if (binding?.held?.layer?.index === sourceLayer.index) {
          binding.held.layer.index = targetLayer.index;
        } else if (binding?.held?.layer?.index === targetLayer.index) {
          binding.held.layer.index = sourceLayer.index;
        } else if (binding?.tap?.layer?.index === sourceLayer.index) {
          binding.tap.layer.index = targetLayer.index;
        } else if (binding?.tap?.layer?.index === targetLayer.index) {
          binding.tap.layer.index = sourceLayer.index;
        }
      });
    });

    // update the indexes on the layers themselves
    if (direction === "left") {
      sourceLayer.index = sourceLayer.index - 1;
      targetLayer.index = targetLayer.index + 1;
    } else {
      sourceLayer.index = sourceLayer.index + 1;
      targetLayer.index = targetLayer.index - 1;
    }

    // swap the places of each layer
    updatedLayers.splice(sourceLayer.index, 1, sourceLayer);
    updatedLayers.splice(targetLayer.index, 1, targetLayer);

    layout.layers = updatedLayers;

    return { ...layout };
  }

  return { ...layout };
};

export const deleteLayerUtil = ({ layout, selectedLayerIndex }) => {
  const layers = layout.layers;
  const updatedLayers = [...layers];

  // remove all bindings that had this layer as a toggle
  if (selectedLayerIndex) {
    updatedLayers?.forEach((layer) => {
      layer?.bindings?.forEach((binding) => {
        if (binding?.held?.layer?.index === selectedLayerIndex) {
          binding.held = {};
        } else if (binding?.tap?.layer?.index === selectedLayerIndex) {
          binding.tap = {};
        }
      });
    });
  }

  // remove the layer from the array
  updatedLayers.splice(selectedLayerIndex, 1);

  // update new layer indexes
  let mappedLayers = updatedLayers.map((layer, index) => {
    layer.index = index;
    return layer;
  });

  // list of new values for bindings with layers
  let updatedBindingMapping = mappedLayers.map((layer) => {
    return { label: layer.label, index: layer.index };
  });

  // update all the bindings with the current index order
  let remapBindings = mappedLayers.map((layer) => {
    let newBindings = layer?.bindings?.map((binding) => {
      if (binding?.held?.layer?.label) {
        const matchedLayer = updatedBindingMapping.find(
          (x) => x.label === binding.held.layer.label
        );
        if (matchedLayer) {
          binding.held.layer = matchedLayer;
        }
      } else if (binding?.tap?.layer?.label) {
        const matchedLayer = updatedBindingMapping.find(
          (x) => x.label === binding.tap.layer.label
        );
        if (matchedLayer) {
          binding.tap.layer = matchedLayer;
        }
      }
      return binding;
    });
    layer.bindings = [...newBindings];
    return layer;
  });

  layout.layers = [...remapBindings];

  return { ...layout };
};

export const updateLayerLabelUtil = ({ layout, input, selectedLayerIndex }) => {
  const layers = layout.layers;
  const updatedLayer = { ...layers[selectedLayerIndex] };
  updatedLayer.label = input;

  const updatedLayers = [...layers];

  updatedLayers.splice(selectedLayerIndex, 1, updatedLayer);
  layout.layers = updatedLayers;

  return { ...layout };
};

export const setBindingActionValueUtil = ({
  layout,
  bindingActionKey,
  bindingActionValue,
  selectedLayerIndex,
  selectedBindingIndex,
}) => {
  const layers = layout.layers;
  const layer = { ...layers[selectedLayerIndex] };
  const binding = layer.bindings[selectedBindingIndex];
  binding[bindingActionKey] = bindingActionValue;

  return { ...layout };
};

export const setBindingLabelValueUtil = ({
  layout,
  bindingLabelValue,
  selectedLayerIndex,
  selectedBindingIndex,
}) => {
  const layers = layout.layers;
  const layer = { ...layers[selectedLayerIndex] };
  const binding = layer.bindings[selectedBindingIndex];
  binding.label = bindingLabelValue;

  return { ...layout };
};

export const setBindingActionKeyModifiersUtil = ({
  layout,
  selectedBindingActionKey,
  selectedLayerIndex,
  selectedBindingIndex,
  modifier,
}) => {
  const layers = layout.layers;
  const layer = { ...layers[selectedLayerIndex] };

  const modifiers =
    layer.bindings[selectedBindingIndex][selectedBindingActionKey].modifiers;

  const doesAlternateExist = modifiers.findIndex((mod) => {
    const currentModSplit = mod.label.split(" ");
    const modifierSplit = modifier.label.split(" ");
    return (
      currentModSplit[0] !== modifierSplit[0] &&
      currentModSplit[1] === modifierSplit[1]
    );
  });
  if (doesAlternateExist === -1) {
    const doesModifierExist = modifiers.findIndex(
      (mod) => mod.label === modifier.label
    );
    if (doesModifierExist === -1) {
      layer.bindings[selectedBindingIndex][selectedBindingActionKey].modifiers =
        [...modifiers, modifier];
    } else {
      modifiers.splice(doesModifierExist, 1);
      layer.bindings[selectedBindingIndex][selectedBindingActionKey].modifiers =
        [...modifiers];
    }
  } else {
    modifiers.splice(doesAlternateExist, 1);
    layer.bindings[selectedBindingIndex][selectedBindingActionKey].modifiers = [
      ...modifiers,
      modifier,
    ];
  }

  const updateLayout = { ...layout };
  return updateLayout;
};

export const setSelectedBindingLayerUtil = ({
  selectedBindingActionKey,
  index,
  label,
  layout,
  selectedLayerIndex,
  selectedBindingIndex,
}) => {
  const layers = layout.layers;
  const updateLayer = { ...layers[selectedLayerIndex] };
  updateLayer.bindings[selectedBindingIndex][selectedBindingActionKey].layer = {
    index,
    label,
  };

  const updatedLayers = [...layers];
  updatedLayers.splice(selectedLayerIndex, 1, updateLayer);

  const updateLayout = { ...layout, layers: updatedLayers };
  return updateLayout;
};
