# Gnome Application Volume Mixer

<img src="https://extensions.gnome.org/extension-data/screenshots/screenshot_3499.png" height=250 align=right />

Gnome extension that adds volume sliders for every application emitting audio in the system menu.

### Install

[Gnome Extensions](https://extensions.gnome.org/extension/3499/application-volume-mixer/)

#### Building Manually

Required dependencies:

 - https://github.com/sammydre/ts-for-gir (v2.0.0)
 - Fedora packages:
    - gtk3-devel
    - libadwaita-devel
    - gsettings-desktop-schemas-devel
    - json-glib-devel

```bash
npm i
ts-for-gir generate
npm run build
gnome-extensions install dist/volume-mixer.zip
```
