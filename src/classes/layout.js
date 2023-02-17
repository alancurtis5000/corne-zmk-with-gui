import { Layer } from "./layer";

const layer = new Layer("base", 0);
export class Layout {
  constructor({ label, createdAt, modifiedAt }) {
    this.modifiedAt = modifiedAt;
    this.createdAt = createdAt;
    this.id = null;
    this.label = label;
    this.layers = [layer];
  }
}
