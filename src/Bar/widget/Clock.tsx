import { Poll } from "ags/state";
import GLib from "gi://GLib?version=2.0";
import Gtk from "gi://Gtk?version=4.0";

export function Clock({ format = "%H:%M %d/%m/%y" }) {
  const time = new Poll("", 1000, () => {
    return GLib.DateTime.new_now_local().format(format)!;
  });

  return (
    <menubutton>
      <label $destroy={() => time.destroy()} label={time()} />
      <popover>
        <Gtk.Calendar />
      </popover>
    </menubutton>
  );
}
