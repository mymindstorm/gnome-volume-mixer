'use strict';

import { AppStreamSlider } from "./appStreamSlider";
import { AudioStreamSlider } from "./audioStreamSlider";

const { Settings, SettingsSchemaSource } = imports.gi.Gio;
const { MixerSinkInput } = imports.gi.Gvc;

// https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/main/js/ui/popupMenu.js
const PopupMenu = imports.ui.popupMenu;
// https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/main/js/ui/status/volume.js
const Volume = imports.ui.status.volume;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

export class VolumeMixerPopupMenu extends PopupMenu.PopupMenuSection {
    constructor() {
        super();
        // Holds all streams by stream id
        // { <stream id>: AudioStreamSlider }
        this._audioStreams = {};
        // Holds streams by stream name
        // { <stream name>: AppStreamSlider }
        this._applicationStreams = {};

        // The PopupSeparatorMenuItem needs something above and below it or it won't display
        this._hiddenItem = new PopupMenu.PopupBaseMenuItem();
        this._hiddenItem.set_height(0)
        this.addMenuItem(this._hiddenItem);

        this.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        this._control = Volume.getMixerControl();
        this._streamAddedEventId = this._control.connect("stream-added", this._streamAdded.bind(this));
        this._streamRemovedEventId = this._control.connect("stream-removed", this._streamRemoved.bind(this));

        let gschema = SettingsSchemaSource.new_from_directory(
            Me.dir.get_child('schemas').get_path(),
            SettingsSchemaSource.get_default(),
            false
        );

        this.settings = new Settings({
            settings_schema: gschema.lookup('net.evermiss.mymindstorm.volume-mixer', true)
        });

        this._settingsChangedId = this.settings.connect('changed', () => this._updateStreams());

        this._updateStreams();
    }

    _streamAdded(control, id) {
        if (id in this._audioStreams) {
            return;
        }

        const stream = control.lookup_stream_id(id);

        if (stream.is_event_stream || !(stream instanceof MixerSinkInput)) {
            return;
        }

        if (this._filterMode === "block") {
            if (this._filteredApps.indexOf(stream.get_name()) !== -1) {
                return;
            }
        } else if (this._filterMode === "allow") {
            if (this._filteredApps.indexOf(stream.get_name()) === -1) {
                return;
            }
        }

        switch (this._groupMode) {
            case "show-all":
                this._audioStreams[id] = new AudioStreamSlider(stream, { showDesc: this._showStreamDesc, showIcon: this._showStreamIcon });
                this.addMenuItem(this._audioStreams[id].item);
                break;

            case "group-streams":
            case "only-apps":
                const name = stream.get_name();
                if (name) {
                    if (!this._applicationStreams[name]) {
                        this._applicationStreams[name] = new AppStreamSlider(name, { });
                    }

                    this._applicationStreams[name].add_stream(stream);
                }
                break;
        }
    }

    _streamRemoved(_control, id) {
        if (id in this._audioStreams) {
            this._audioStreams[id].item.destroy();
            delete this._audioStreams[id];
        }
    }

    _updateStreams() {
        for (const id in this._audioStreams) {
            this._audioStreams[id].item.destroy();
            delete this._audioStreams[id];
        }

        this._filteredApps = this.settings.get_strv("filtered-apps");
        this._filterMode = this.settings.get_string("filter-mode");
        this._groupMode = this.settings.get_string("group-mode");
        this._showStreamDesc = this.settings.get_boolean("show-description");
        this._showStreamIcon = this.settings.get_boolean("show-icon");

        for (const stream of this._control.get_streams()) {
            this._streamAdded(this._control, stream.get_id())
        }
    }

    destroy() {
        this._control.disconnect(this._streamAddedEventId);
        this._control.disconnect(this._streamRemovedEventId);
        this.settings.disconnect(this._settingsChangedId);
        super.destroy();
    }
};
