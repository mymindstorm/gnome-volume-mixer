import { Label, ListBox, SelectionMode, VBox, ListBoxRow } from "../@types/Gjs/Gtk-3.0";

function init() { };

function buildPrefsWidget() {
  let prefs = new PrefsWidget();
  return prefs.widget;
}

class PrefsWidget {
  widget: VBox;

  private mixerList: ListBox;

  constructor() {
    this.widget = new VBox({
      margin_left: 25,
      margin_right: 25,
      margin_bottom: 10
    });

    this.widget.pack_start(new Label({
      label: "<b>Hide Applications</b>",
      margin: 10,
      xalign: 0
    }), false, false, 0);

    this.mixerList = new ListBox({
      selection_mode: SelectionMode.NONE
    });
    this.widget.add(this.mixerList);
    
    let addButton = new ListBoxRow();
    addButton.add(new Label({ label: "Add app" }));
    this.mixerList.add(addButton);
    this.widget.show_all();
  }
}

export default {
  init,
  buildPrefsWidget
}
