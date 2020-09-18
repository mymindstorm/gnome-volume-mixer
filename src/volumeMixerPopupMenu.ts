import { Settings, SettingsSchema, SettingsSchemaSource } from "../@types/Gjs/Gio-2.0";
import { MixerControl, MixerSinkInput } from "../@types/Gjs/Gvc-1.0";
import { ApplicationStreamSlider } from "./applicationStreamSlider";

// https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/master/js/ui/popupMenu.js
const PopupMenu = imports.ui.popupMenu;
// https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/master/js/ui/status/volume.js
const Volume = imports.ui.status.volume;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

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

        let gschema = SettingsSchemaSource.new_from_directory(
            Me.dir.get_child('schemas').get_path(),
            SettingsSchemaSource.get_default(),
            false
        );

        this.settings = new Settings({
            settings_schema: gschema.lookup('net.evermiss.mymindstorm.volume-mixer', true) as SettingsSchema
        });

        this.settings.connect('changed::ignored-streams', () => this._updateStreams());
        this.settings.connect('changed::show-description', () => this._updateStreams());

        this._updateStreams();
    }

    _streamAdded(control: MixerControl, id: number) {
        if (id in this._applicationStreams) {
            return;
        }
        
        const stream = control.lookup_stream_id(id);

        if (stream.is_event_stream ||
            !(stream instanceof MixerSinkInput) ||
            this._ignoredStreams.indexOf(stream.get_name()) !== -1) {
            return;
        }

        this._applicationStreams[id] = new ApplicationStreamSlider(stream, this._showStreamDesc);
        this.addMenuItem(this._applicationStreams[id].item);
    }

    _streamRemoved(_control: MixerControl, id: number) {
        if (id in this._applicationStreams) {
            this._applicationStreams[id].item.destroy();
            delete this._applicationStreams[id];
        }
    }

    _updateStreams() {
        for (const id in this._applicationStreams) {
            this._applicationStreams[id].item.destroy();
            delete this._applicationStreams[id];
        }

        this._ignoredStreams = this.settings.get_strv("ignored-streams");
        this._showStreamDesc = this.settings.get_boolean("show-description");

        for (const stream of this._control.get_streams()) {
            this._streamAdded(this._control, stream.get_id())
        }
    }
};

export var VolumeMixerPopupMenu = VolumeMixerPopupMenuClass;
