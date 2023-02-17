export class BindingAction {
  constructor({ bindingAction, layer }) {
    this.id = bindingAction.id;
    this.code = bindingAction.code;
    this.key_category_id = bindingAction.key_category_id;
    this.label = bindingAction.label;
    this.description = bindingAction.description;
    this.created_at = bindingAction.created_at;
    this.updated_at = bindingAction.updated_at;
    this.deleted = bindingAction.deleted;
    this.modifiable = bindingAction.modifiable;
    this.shifted = bindingAction.shifted;
    this.tap = bindingAction.tap;
    this.hold = bindingAction.hold;
    this.doubleTap = bindingAction.doubleTap;
    this.tapHold = bindingAction.tapHold;
    this.searchLabel = bindingAction.searchLabel;
    this.tag = bindingAction.tag;
    this.glyph = bindingAction.glyph;
    this.jsCode = bindingAction.jsCode;
    this.url = bindingAction.url;
    this.os = bindingAction.os;
    this.geometry = bindingAction.geometry;
    this.params = bindingAction.params;
    this.models = bindingAction.models;
    this.priority = bindingAction.priority;
    this.macro = bindingAction.macro;
    this.shape = bindingAction.shape;
    this.comboPickable = bindingAction.comboPickable;
    this.comboTrigger = bindingAction.comboTrigger;
    this.modifiers = [];
    this.layer =
      bindingAction.key_category_id === 65
        ? {
            index: layer.index,
            label: layer.label,
          }
        : {};
  }
}
