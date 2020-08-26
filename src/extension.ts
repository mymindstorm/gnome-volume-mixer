/// <reference path="mixerMenu.ts" />

const ExtensionUtils = imports.misc.extensionUtils;
const Extension = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;

// @ts-expect-error 
const MixerMenu = Extension.imports.mixerMenu.MixerMenu;

var volumeMixer: MixerMenu.VolumeMixerPopupMenuClass | null = null;

function enable() {
    log(`enabling ${Extension.metadata.name}`);

    volumeMixer = new MixerMenu.VolumeMixerPopupMenu();
    
    Main.panel.statusArea.aggregateMenu._volume.menu.addMenuItem(volumeMixer);
}

function disable() {
    log(`disabling ${Extension.metadata.name}`);

    // REMINDER: It's required for extensions to clean up after themselves when
    // they are disabled. This is required for approval during review!
    if (volumeMixer !== null) {
        volumeMixer.destroy();
        volumeMixer = null;
    }
}
