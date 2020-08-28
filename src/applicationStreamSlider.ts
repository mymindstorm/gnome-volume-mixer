import { MixerSinkInput } from "../@types/Gjs/Gvc-1.0";

// https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/master/js/ui/status/volume.js
const VolumeStatus = imports.ui.status.volume;

export var ApplicationStreamSlider = class extends VolumeStatus.StreamSlider {
  constructor(stream: MixerSinkInput) {
    super();

    this._slider.accessible_name = stream.get_name();
    this._icon.icon_name = stream.get_icon_name();
  }
};
