'use strict';

const { Adw, Gio, Gtk } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;

function  fillPreferencesWindow(window) {
    const settings = ExtensionUtils.getSettings("net.evermiss.mymindstorm.volume-mixer");

    // Create a preferences page and group
    const page = new Adw.PreferencesPage();
    const group = new Adw.PreferencesGroup();
    page.add(group);

    // Create a new preferences row
    const row = new Adw.ActionRow({ title: 'Show Audio Stream Description' });
    group.add(row);

    // Create the switch and bind its value to the `show-description` key
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

    // Add the switch to the row
    row.add_suffix(toggle);
    row.activatable_widget = toggle;

    // Add our page to the window
    window.add(page);
}

function init() { }

export default {
    init,
    fillPreferencesWindow
}
