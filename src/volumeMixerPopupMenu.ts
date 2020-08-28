import { MixerControl, MixerSinkInput, MixerStream } from "../@types/Gjs/Gvc-1.0";
import { ApplicationStreamSlider } from "./applicationStreamSlider";

// https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/master/js/ui/popupMenu.js
const PopupMenu = imports.ui.popupMenu;
// https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/master/js/ui/status/volume.js
const Volume = imports.ui.status.volume;

export class VolumeMixerPopupMenuClass extends PopupMenu.PopupMenuSection {
    constructor() {
        super();
        this._applicationStreams = {};
        
        // The PopupSeparatorMenuItem needs something above and below it or it won't display
        this._hiddenItem = new PopupMenu.PopupBaseMenuItem();
        this._hiddenItem.set_height(0)
        this.addMenuItem(this._hiddenItem);

        this.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        this._control = Volume.getMixerControl();
        this._control.connect("stream-added", this._streamAdded.bind(this));
        this._control.connect("stream-removed", this._streamRemoved.bind(this));

        for (const stream of this._control.get_streams()) {
            this._streamAdded(this._control, stream.get_id())
        }
    }

    _streamAdded(control: MixerControl, id: number) {
        if (id in this._applicationStreams) {
            return;
        }
        
        const stream = control.lookup_stream_id(id);

        if (stream.is_event_stream) {
            return;
        }

        if (!(stream instanceof MixerSinkInput)) {
            return;
        }

        this._applicationStreams[id] = new ApplicationStreamSlider(stream);
        this.addMenuItem(this._applicationStreams[id].item);
    }

    _streamRemoved(_control: MixerControl, id: number) {
        if (id in this._applicationStreams) {
            this._applicationStreams[id].item.destroy();
            delete this._applicationStreams[id];
        }
    }
};

export var VolumeMixerPopupMenu = VolumeMixerPopupMenuClass;
