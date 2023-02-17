import { addSpacingToKeyCode } from "../../utilities/data-parsing";
import { generateBindingCode } from "../../utilities/generate-binding-code";

export const generateBlob = (layers) => {
  const defaultConfigTop = `/*
* Copyright (c) 2020 The ZMK Contributors 
* SPDX-License-Identifier: MIT 
*/ 

#include <behaviors.dtsi> 
#include <dt-bindings/zmk/keys.h> 
#include <dt-bindings/zmk/bt.h> \n`;

  const generateConfigFile = () => {
    const defineLayers = [];
    const layerConfigs = [];

    layers.forEach((layer) => {
      const bindingsConfig = [];
      defineLayers.push(`#define ${layer.label} ${layer.index} `);
      layer.bindings.forEach((binding) => {
        let tapBindingCode = undefined;

        tapBindingCode = generateBindingCode(binding);
        tapBindingCode = addSpacingToKeyCode(tapBindingCode);

        if (binding.index === 0) {
          bindingsConfig.push(`     &none            ${tapBindingCode}`);
        } else if (binding.index === 9 || binding.index === 19) {
          bindingsConfig.push(
            ` ${tapBindingCode} &none \n              &none           `
          );
        } else if (binding.index === 29) {
          bindingsConfig.push(
            ` ${tapBindingCode} &none \n                                               `
          );
        } else {
          bindingsConfig.push(` ${tapBindingCode}`);
        }
      });
      layerConfigs.push(`${layer.label}_layer {
            label = "${layer.label}";
            bindings = <
         ${bindingsConfig.join("")}
            >;
          };
            `);
    });

    const layerConfigsToString = layerConfigs.join("\n");
    const defineLayersToString = defineLayers.join("\n");

    return { defineLayersToString, layerConfigsToString };
  };

  const { defineLayersToString, layerConfigsToString } = generateConfigFile();

  const blobContent = [
    `
${defaultConfigTop}
${defineLayersToString}
    
/ {
    behaviors {
        hm: homerow_mods {
            compatible = "zmk,behavior-hold-tap";
            label = "HOMEROW_MODS";
            #binding-cells = <2>;
            tapping-term-ms = <300>;
            quick-tap-ms = <200>;
            flavor = "tap-preferred";
            bindings = <&kp>, <&kp>;
        };
    };
    keymap {
    compatible = "zmk,keymap";\n
    ${layerConfigsToString}
    };
};
    `,
  ];
  return blobContent;
};
