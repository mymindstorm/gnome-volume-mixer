import { MixerSink } from "../@types/Gjs/Gvc-1.0";

// https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/master/js/ui/status/volume.js
const VolumeStatus = imports.ui.status.volume;

export var ApplicationStreamSlider = class extends VolumeStatus.StreamSlider {
  constructor(stream: MixerSink) {
    super();

    log(stream.get_name());
    log(stream.get_application_id());
    log(stream.get_description());
    // log(control.get_state());
    // log(control.get_sink_inputs()[0].get_name());

    this._slider.accessible_name = stream.get_name();
    this._icon.icon_name = stream.get_icon_name();
  }
};
