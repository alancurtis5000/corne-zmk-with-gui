export const configTemplate = `/*
* Copyright (c) 2020 The ZMK Contributors
*
* SPDX-License-Identifier: MIT
*/

#include <behaviors.dtsi>
#include <dt-bindings/zmk/keys.h>
#include <dt-bindings/zmk/bt.h>

#define DEFAULT_L 0
#define SYMBOLS_L 1
#define ARROWS_L  2
#define NUMBERS_L 3


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
               compatible = "zmk,keymap";


       };
};`