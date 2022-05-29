'use strict';

import { VolumeMixerPrefsPage } from './volumeMixerPrefsPage';

function init() {
}

function fillPreferencesWindow(window) {
    window.add(new VolumeMixerPrefsPage());
}

export default {
    init,
    fillPreferencesWindow
}
