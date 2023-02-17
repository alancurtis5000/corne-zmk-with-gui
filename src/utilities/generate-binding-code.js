// keypress values would only be on tap
const isKeyPressNoMods = ({ tap, held }) => {
  if (held.label) return; // is held modifier
  if (tap.code === "to") return; // is toggle layer
  if (tap?.code?.includes("BT_")) return; // is bluetooth
  if (tap?.modifiers?.length > 0) return; // has mods
  return `&kp ${tap.code}`;
};
// keypress values would only be on tap
const isKeyPressWithMods = ({ tap, held }) => {
  if (held.label) return;
  if (tap.code === "to") return;
  if (tap?.code?.includes("BT_")) return;
  if (tap?.modifiers?.length < 1) return;
  return `&kp ${addModsToCode(tap.code, tap.modifiers)}`;
};

const isHoldModifierBasic = ({ tap, held }) => {
  if (!held.label) return; // needs held label
  if (tap.code === "to") return; // is toggle layer
  if (tap?.code?.includes("BT_")) return; // is bluetooth
  if (tap?.modifiers?.length > 0) return; // tap has mods
  if (held.modifiers.length > 0) return; // held has mods
  if (held.code === "lt") return; // is held layer toggle keycode
  if (held.code === "mo") return; // is held layer toggle keycode
  return `&hm ${held.code} ${tap.code}`;
};

const isHoldModifierTapMods = ({ tap, held }) => {
  if (!held.label) return; // needs held label
  if (tap.code === "to") return; // is toggle layer
  if (tap?.code?.includes("BT_")) return; // is bluetooth
  if (tap?.modifiers?.length < 0) return; // needs tap has mods
  if (held.modifiers.length > 0) return; // held has mods
  if (held.code === "lt") return; // is held layer toggle keycode
  if (held.code === "mo") return; // is held layer toggle keycode
  return `&hm ${held.code} ${addModsToCode(tap.code, tap.modifiers)}`;
};

const isHoldModifierHeldMods = ({ tap, held }) => {
  if (!held.label) return; // needs held label
  if (tap.code === "to") return; // is toggle layer
  if (tap?.code?.includes("BT_")) return; // is bluetooth
  if (tap?.modifiers?.length > 0) return; // tap has mods
  if (held.modifiers.length < 0) return; //  needs held has mods
  if (held.code === "lt") return; // is held layer toggle keycode
  if (held.code === "mo") return; // is held layer toggle keycode
  return `&hm ${addModsToCode(held.code, held.modifiers)} ${tap.code}`;
};

const isHoldModifierTapAndHeldMods = ({ tap, held }) => {
  if (!held.label) return; // needs held label
  if (tap.code === "to") return; // is toggle layer
  if (tap?.code?.includes("BT_")) return; // is bluetooth
  if (tap?.modifiers?.length < 0) return; // needs tap has mods
  if (held.modifiers.length < 0) return; //  needs held has mods
  if (held.code === "lt") return; // is held layer toggle keycode
  if (held.code === "mo") return; // is held layer toggle keycode
  return `&hm ${addModsToCode(held.code, held.modifiers)} ${addModsToCode(
    tap.code,
    tap.modifiers
  )}`;
};

const isBluetooth = ({ tap }) => {
  if (tap?.code?.includes("BT_")) {
    return `&bt ${tap.code}`;
  }
};

const calculateLayerSwitchType = ({ tap, held }) => {
  if (held.code === "to") {
    if (!tap.label) {
      return `&mo ${held.layer.label}`;
    }
    return `&lt ${held.layer.label} ${tap.code}`;
  }
  if (tap.code === "to") {
    return `&to ${tap.layer.label}`;
  }
};

const addModsToCode = (code, modifiers) => {
  let codeWithmodifiers = code;
  modifiers.forEach((modifier, index) => {
    codeWithmodifiers = `${modifier.modCode}(${codeWithmodifiers})`;
  });
  return codeWithmodifiers;
};

export const generateBindingCode = (binding) => {
  let code = null;

  // if neither tap or held means none is keycode
  if (!binding.tap.label && !binding.held.label) {
    return `&none`;
  }
  if (!code) {
    code = calculateLayerSwitchType(binding);
  }
  if (!code) {
    code = isKeyPressNoMods(binding);
  }
  if (!code) {
    code = isKeyPressWithMods(binding);
  }
  if (!code) {
    code = isHoldModifierBasic(binding);
  }
  if (!code) {
    code = isHoldModifierTapMods(binding);
  }
  if (!code) {
    code = isHoldModifierHeldMods(binding);
  }
  if (!code) {
    code = isHoldModifierTapAndHeldMods(binding);
  }
  if (!code) {
    code = isBluetooth(binding);
  }

  return code;
};
