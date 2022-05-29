'use strict';

const { Adw, Gio, Gtk, GObject } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;

export const VolumeMixerPrefsPage = GObject.registerClass({
    GTypeName: 'VolumeMixerPrefsPage',
}, class VolumeMixerPrefsPage extends Adw.PreferencesPage {
    constructor() {
        super();

        const settings = ExtensionUtils.getSettings("net.evermiss.mymindstorm.volume-mixer");

        // Group for general settings
        const group = new Adw.PreferencesGroup();
        this.add(group);

        // show-description
        const row = new Adw.ActionRow({ title: 'Show Audio Stream Description' });
        group.add(row);

        const toggle = new Gtk.Switch({
            active: settings.get_boolean('show-description'),
            valign: Gtk.Align.CENTER,
        });
        settings.bind(
            'show-description',
            toggle,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        row.add_suffix(toggle);
        row.activatable_widget = toggle;
    }
});
