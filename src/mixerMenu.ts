// @ts-expect-error
module MixerMenu {
    const GObject = imports.gi.GObject;

    const PopupMenu = imports.ui.popupMenu;

    const Config = imports.misc.config;
    const SHELL_MINOR = parseInt(Config.PACKAGE_VERSION.split('.')[1]);

    const ExtensionUtils = imports.misc.extensionUtils;
    const Extension = ExtensionUtils.getCurrentExtension();
    const VolumeSlider = Extension.imports.volumeSlider.VolumeSlider;

    export class VolumeMixerPopupMenuClass extends PopupMenu.PopupMenuSection {
        constructor() {
            super();

            this._output = new VolumeSlider.ApplicationStreamSlider("firefox", "firefox");
            this.addMenuItem(this._output.item);
        
            this.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        }
    };
    
    export var VolumeMixerPopupMenu = VolumeMixerPopupMenuClass;
}
