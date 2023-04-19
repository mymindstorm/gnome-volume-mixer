'use strict';

import { ApplicationStreamSlider } from "./applicationStreamSlider";

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

        this._applicationStreams = {};

        let gschema = SettingsSchemaSource.new_from_directory(
            Me.dir.get_child('schemas').get_path(),
            SettingsSchemaSource.get_default(),
            false
        );

        this.settings = new Settings({
            settings_schema: gschema.lookup('net.evermiss.mymindstorm.volume-mixer', true)
        });

        this._block = null;
        this._blockMenu = null;
        this._dummyStream = null;

        this._control = Volume.getMixerControl();
        this._streamAddedEventId = this._control.connect("stream-added", this._streamAdded.bind(this));
        this._streamRemovedEventId = this._control.connect("stream-removed", this._streamRemoved.bind(this));

        this._settingsChangedId = this.settings.connect('changed', () => this._updateStreams());

        this._updateStreams();
    }

    _addDummyIfNoStreams() {
        if (this._dummyStream) {
            return;
        }

        if (this._getStreamCount() !== 0) {
            return;
        }

        this._dummyStream = new PopupMenu.PopupMenuItem("There are currently no audio streams", {
            activate: false,
            reactive: false
        });
        this._blockMenu.addMenuItem(this._dummyStream);
    }

    _createMenu() {
        if (this._old_menu) {
            this._block = new PopupMenu.PopupMenuSection();
            this._blockMenu = this._block;

            // The PopupSeparatorMenuItem needs something above and below it or it won't display
            this._hiddenItem = new PopupMenu.PopupBaseMenuItem();
            this._hiddenItem.set_height(0)
            this._block.addMenuItem(this._hiddenItem);

            this._block.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        } else {
            this._block = new PopupMenu.PopupSubMenuMenuItem('Volume Mixer', true);
            this._block.icon.icon_name = 'audio-volume-high-symbolic';
            this._blockMenu = this._block.menu;
        }

        this.addMenuItem(this._block);
    }

    _streamAdded(control, id) {
        if (id in this._applicationStreams) {
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

        this._applicationStreams[id] = new ApplicationStreamSlider(stream, { showDesc: this._showStreamDesc, showIcon: this._showStreamIcon });

        if (this._dummyStream) {
            this._dummyStream.destroy();
            this._dummyStream = null;
        }

        this._blockMenu.addMenuItem(this._applicationStreams[id].item);
    }

    _streamRemoved(_control, id) {
        if (id in this._applicationStreams) {
            this._applicationStreams[id].item.destroy();
            delete this._applicationStreams[id];

            if (!this._old_menu) {
                this._addDummyIfNoStreams();
            }
        }
    }

    _updateStreams() {
        for (const id in this._applicationStreams) {
            this._applicationStreams[id].item.destroy();
            this._applicationStreams[id].destroy();
            delete this._applicationStreams[id];
        }

        if (this._block) {
            this._block.destroy();
            this._block = null;
            this._blockMenu = null;
        }

        this._dummyStream = null;

        this._filteredApps = this.settings.get_strv("filtered-apps");
        this._filterMode = this.settings.get_string("filter-mode");
        this._showStreamDesc = this.settings.get_boolean("show-description");
        this._showStreamIcon = this.settings.get_boolean("show-icon");
        this._old_menu = this.settings.get_boolean("old-menu");

        this._createMenu();

        for (const stream of this._control.get_streams()) {
            this._streamAdded(this._control, stream.get_id())
        }

        if (!this._old_menu) {
            this._addDummyIfNoStreams();
        }
    }

    _getStreamCount() {
        return Object.keys(this._applicationStreams).length;
    }

    destroy() {
        this._control.disconnect(this._streamAddedEventId);
        this._control.disconnect(this._streamRemovedEventId);
        this.settings.disconnect(this._settingsChangedId);
        if (this._dummyStream) {
            this._dummyStream.destroy();
        }
        this._block.destroy();
        super.destroy();
    }
};
