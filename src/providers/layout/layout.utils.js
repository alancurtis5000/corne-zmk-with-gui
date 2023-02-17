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

  if (targetLayer && sourceLayer) {
    if (direction === "left") {
      sourceLayer.index = sourceLayer.index - 1;
      targetLayer.index = targetLayer.index + 1;
    } else {
      sourceLayer.index = sourceLayer.index + 1;
      targetLayer.index = targetLayer.index - 1;
    }

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
  updatedLayers.splice(selectedLayerIndex, 1);
  updatedLayers.forEach((layer, index) => (layer.index = index));
  layout.layers = updatedLayers;

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

  // dont worry about none here allow for empty objects for value
  // if (isEmpty(bindingActionValue)) {
  //   binding[bindingActionKey] = keys.find((key) => key.id === 5002);
  // } else {
  //   binding[bindingActionKey] = bindingActionValue;
  // }
  // if (bindingActionValue.key_category_id === 65) {
  //   console.log("binding layer toggle", { bindingActionValue });
  //   // todo handle layer key category
  //   // const index = 0;
  //   // const label = layers[0].label;
  //   // binding[bindingActionKey].layer = { index, label };
  // }

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
