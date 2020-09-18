import { Settings, SettingsBindFlags, SettingsSchemaSource } from "../@types/Gjs/Gio-2.0";
import { Image, Builder, Dialog, Button, ListBox, Entry, Label, ListBoxRow, HBox, ScrolledWindow, Switch } from "../@types/Gjs/Gtk-3.0";

const ExtensionUtils = imports.misc.extensionUtils;

function init() { };

function buildPrefsWidget() {
  let prefs = new PrefsWidget();
  return prefs.widget;
}

class PrefsWidget {
  widget: ScrolledWindow;

  private builder: Builder;
  private settings: Settings;
  
  private ignoreList: ListBox;
  private ignoreListData: string[];

  private diag: Dialog | undefined;

  constructor() {
    // Init gsettings
    let gschema = SettingsSchemaSource.new_from_directory(
      ExtensionUtils.getCurrentExtension().dir.get_child('schemas').get_path(),
      SettingsSchemaSource.get_default(),
      false
    );

    let settings_schema = gschema.lookup('net.evermiss.mymindstorm.volume-mixer', true);
    if (!settings_schema) {
      throw "Settings schema not found!";
    }
    this.settings = new Settings({
      settings_schema
    });
    this.ignoreListData = this.settings.get_strv("ignored-streams");

    // Create UI
    this.builder = Builder.new_from_file(ExtensionUtils.getCurrentExtension().dir.get_child('prefs.glade').get_path());
    this.widget = this.builder.get_object("prefs-box") as ScrolledWindow;
    this.ignoreList = this.builder.get_object("stream-ignore-list") as ListBox;
    this.builder.connect_signals_full((builder, object, signal, handler) => {
      object.connect(signal, (this as any)[handler].bind(this));
    });

    const showDescSwitch = this.builder.get_object("show-desc-switch") as Switch;
    this.settings.bind(
      'show-description',
      showDescSwitch,
      'active',
      SettingsBindFlags.DEFAULT
    );

    // Load ignored into list
    for (const ignored of this.ignoreListData) {
      this.ignoreList.insert(this.buildIgnoreListItem(ignored), 0);
    }

    this.widget.show_all();
  }

  private showAddIgnoreDiag() {
    this.diag = this.builder.get_object("add-ignore-diag") as Dialog;
    this.diag.show_all();
  }

  private hideAddIgnoreDiag() {
    const ignoreAppEntry = this.builder.get_object("ignore-diag-input") as Entry;
    ignoreAppEntry.set_text("");
    this.diag?.hide();
  }

  private addIgnoreStream() {
    const ignoreAppEntry = this.builder.get_object("ignore-diag-input") as Entry;
    if (this.ignoreListData.indexOf(ignoreAppEntry.get_text()) !== -1) {
      this.hideAddIgnoreDiag();
      return;
    }
    this.ignoreListData.push(ignoreAppEntry.get_text());
    this.ignoreList.insert(this.buildIgnoreListItem(ignoreAppEntry.get_text()), 0);
    this.settings.set_strv("ignored-streams", this.ignoreListData);
    this.hideAddIgnoreDiag();
  }

  private deleteIgnoreStream(application: string, listItem: ListBoxRow) {
    this.ignoreListData.splice(this.ignoreListData.indexOf(application), 1);
    listItem.destroy();
    this.settings.set_strv("ignored-streams", this.ignoreListData);
  }

  private buildIgnoreListItem(name: string): ListBoxRow {
    const listRow = new ListBoxRow({ activatable: false });
    const box = new HBox({ 
      margin_start: 10,
      margin_end: 10,
      margin_top: 5,
      margin_bottom: 5
    });

    box.pack_start(new Label({ label: name }), false, true, 0);

    const removeButton = new Button();
    removeButton.add(new Image({ icon_name: "window-close-symbolic" }));
    removeButton.connect("clicked", (button) => this.deleteIgnoreStream(name, listRow));
    box.pack_end(removeButton, false, true, 0);

    listRow.add(box);
    listRow.show_all();
    return listRow;
  }
}

export default {
  init,
  buildPrefsWidget
}
