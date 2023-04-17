'use strict';

const { BoxLayout, Label } = imports.gi.St;

// https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/main/js/ui/status/volume.js
const Volume = imports.ui.status.volume;

export class ApplicationStreamSlider extends Volume.StreamSlider {
    constructor(stream, opts) {
        super(Volume.getMixerControl());

        this.stream = stream;

        if (opts.showIcon) {
            this._icon.icon_name = stream.get_icon_name();
        }

        let name = stream.get_name();
        let description = stream.get_description();

        if (name || description) {
            this._vbox = new BoxLayout()
            this._vbox.vertical = true;

            this._label = new Label();
            this._label.text = name && opts.showDesc ? `${name} - ${description}` : (name || description);
            this._vbox.add(this._label);

            this.item.remove_child(this._slider);
            this._vbox.add(this._slider);
            this._slider.set_height(32);

            this.item.actor.add(this._vbox);
        }
    }
    
    destroy() {
        this._disconnectStream(this._stream);
        this._stream = null;
    }
};
