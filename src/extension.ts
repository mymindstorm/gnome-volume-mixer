import { VolumeMixerPopupMenu, VolumeMixerPopupMenuClass } from "./volumeMixerPopupMenu";

const Main = imports.ui.main;

var volumeMixer: VolumeMixerPopupMenuClass | null = null;

function enable() {
    volumeMixer = new VolumeMixerPopupMenu();
    
    Main.panel.statusArea.aggregateMenu._volume.menu.addMenuItem(volumeMixer);
}

function disable() {
    // REMINDER: It's required for extensions to clean up after themselves when
    // they are disabled. This is required for approval during review!
    if (volumeMixer !== null) {
        volumeMixer.destroy();
        volumeMixer = null;
    }
}

export default function() {
    return {
        enable,
        disable
    }
}
