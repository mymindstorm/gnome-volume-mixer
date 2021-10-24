module.exports = {
    "environments": [
        "gjs"
    ],
    "modules": [
        "Gtk-3.0",
        "St-1.0",
        "Gvc-1.0"
    ],
    "prettify": true,
    "girDirectories": [
        "/usr/share/gir-1.0",
        "/usr/share/gnome-shell",
        "/usr/lib64/mutter-"
    ],
    "outdir": "./@types",
    "ignore": [
        "Gtk-4.0"
    ]
}