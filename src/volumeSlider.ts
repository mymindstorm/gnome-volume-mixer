module VolumeSlider {
  // https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/master/js/ui/status/volume.js
  const VolumeStatus = imports.ui.status.volume;

  export var ApplicationStreamSlider = class extends VolumeStatus.StreamSlider {
    constructor(application: String, icon: String) {
        super();
        this._slider.accessible_name = application;
        this._icon.icon_name = icon;
    }
  };
}
