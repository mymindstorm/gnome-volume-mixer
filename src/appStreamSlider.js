'use strict';

const { BoxLayout, Label } = imports.gi.St;
const { MixerStream } = imports.gi.Gvc;

// https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/main/js/ui/status/volume.js
const Volume = imports.ui.status.volume;

export class AppStreamSlider extends Volume.StreamSlider {
    constructor(name, opts) {
        super(Volume.getMixerControl())

        this.stream = new MixerStream({
            name: `${name} - Application Volume Mixer Control Stream`
        });

        // Add label for name
        this._vbox = new BoxLayout()
        this._vbox.vertical = true;

        this._label = new Label();
        this._label.text = name;
        this._vbox.add(this._label);

        this.item.remove_child(this._slider);
        this._vbox.add(this._slider);
        this._slider.set_height(32);

        this.item.actor.add(this._vbox);
    }
}
