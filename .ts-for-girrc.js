module.exports = {
  environments: ['gjs'],
  modules: ['Gtk-3.0', 'Shell-0.1'],
  prettify: true,
  girDirectories: [
    '/usr/share/gir-1.0',
    '/usr/share/gnome-shell',
    '/usr/lib64/mutter-6'
  ],
  outdir: './@types',
  ignore: []
}
