import { MixerControl, MixerSink } from "../@types/Gjs/Gvc-1.0";
import { ApplicationStreamSlider } from "./applicationStreamSlider";

const PopupMenu = imports.ui.popupMenu;
// https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/master/js/ui/status/volume.js
const Volume = imports.ui.status.volume;

export class VolumeMixerPopupMenuClass extends PopupMenu.PopupMenuSection {
    constructor() {
        super();
        this._applicationStreams = {};
        // TODO: This only shows if it detects an item above it
        this.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        this._control = Volume.getMixerControl();
        this._control.connect("stream-added", this._streamAdded.bind(this));
        this._control.connect("stream-removed", this._streamRemoved.bind(this));
    }

    _streamAdded(control: MixerControl, id: number) {
        if (id in this._applicationStreams) {
            return;
        }
        
        const stream = control.lookup_stream_id(id);

        if (stream.is_event_stream) {
            return;
        }

        if (!(stream instanceof MixerSink)) {
            return;
        }

        this._applicationStreams[id] = new ApplicationStreamSlider(stream);
        this.addMenuItem(this._applicationStreams[id].item);
    }

    _streamRemoved(control: MixerControl, id: number) {
        if (id in this._applicationStreams) {
            this._applicationStreams[id].destroy();
            delete this._applicationStreams[id];
        }
    }
};

export var VolumeMixerPopupMenu = VolumeMixerPopupMenuClass;
