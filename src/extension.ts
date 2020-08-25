const ExtensionUtils = imports.misc.extensionUtils;
const Extension = ExtensionUtils.getCurrentExtension();
const UI = Extension.imports.ui;

function init() {
    log(`initializing ${Extension.metadata.name} version ${Extension.metadata.version}`);
    UI.test();
}

function enable() {
    log(`enabling ${Extension.metadata.name} version ${Extension.metadata.version}`);
}

function disable() {
    log(`disabling ${Extension.metadata.name} version ${Extension.metadata.version}`);
}
