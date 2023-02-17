import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { LayerPanel } from "../layer-panel/layer-panel.component";
import { useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { LayoutContext } from "../../providers/layout/layout.provider";
import { isEmpty } from "../../utilities/data-parsing";

function a11yProps(index) {
  return {
    id: `layer-tab-${index}`,
    "aria-controls": `layer-tabpanel-${index}`,
  };
}
export const LayerTabs = () => {
  const { layout, createLayer, setSelectedLayerIndex, selectedLayerIndex } =
    useContext(LayoutContext);

  const handleChange = (event, layerIndex) => {
    if (layerIndex === layout?.layers.length) {
      createLayer();
    } else {
      setSelectedLayerIndex(layerIndex);
    }
  };

  if (isEmpty(layout)) return null;
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={selectedLayerIndex}
          onChange={handleChange}
          aria-label="layer tabs"
        >
          {layout?.layers?.map((layer) => {
            return (
              <Tab
                label={layer.label}
                key={layer.index}
                {...a11yProps(layer.index)}
              />
            );
          })}
          <Tab
            label={"New"}
            icon={<AddIcon />}
            iconPosition="start"
            key={-1}
            {...a11yProps(-1)}
          />
        </Tabs>
      </Box>
      {layout?.layers?.map((layer) => {
        return (
          <LayerPanel key={layer.label} index={layer.index} layer={layer} />
        );
      })}
    </Box>
  );
};
