import { MixerSinkInput } from "../@types/Gjs/Gvc-1.0";
import { BoxLayout, Label } from "../@types/Gjs/St-1.0";

// https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/master/js/ui/status/volume.js
const Volume = imports.ui.status.volume;

export var ApplicationStreamSlider = class extends Volume.StreamSlider {
  constructor(stream: MixerSinkInput, showDesc: boolean) {
    super(Volume.getMixerControl());

    this.stream = stream;
    this._icon.icon_name = stream.get_icon_name();

    let name = stream.get_name();
    let description = stream.get_description();

    if (name || description) {
      this._vbox = new BoxLayout()
      this._vbox.vertical = true;

      this._label = new Label();
      this._label.text = name && showDesc ? `${name} - ${description}` : (name || description);
      this._vbox.add(this._label);

      this.item.remove_child(this._slider);
      this._vbox.add(this._slider);
      this._slider.set_height(32);

      this.item.actor.add(this._vbox);
    }
  }
};
