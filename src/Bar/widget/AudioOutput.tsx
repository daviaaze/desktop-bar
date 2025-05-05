import { With } from "ags/gtk4";
import { bind } from "ags/state";
import AstalWp from "gi://AstalWp?version=0.1";
import Gtk from "gi://Gtk?version=4.0";

export function AudioOutput() {
  const wp = AstalWp.get_default();

  if (!wp) {
    return <></>;
  }


  return (
    <menubutton>
      <box spacing={4}>
        <image cssClasses={["warning"]} iconName="screen-shared-symbolic" visible={bind(wp.video, "recorders").as(r => r.length > 0)} />
        <image iconName={bind(wp.defaultSpeaker, "volume_icon")} />
        <image cssClasses={bind(wp.audio, "recorders").as(s => s.length > 0 ? ["warning"] : [])} iconName={bind(wp.defaultMicrophone, "volume_icon")} />
      </box>
      <popover>
        <box orientation={Gtk.Orientation.VERTICAL}>
          <label label="Speaker" />
          <slider
            widthRequest={260}
            $changeValue={({ value }) => wp.defaultSpeaker.set_volume(value)}
            value={bind(wp.defaultSpeaker, "volume")} />
          <box orientation={Gtk.Orientation.VERTICAL}>
            <With value={bind(wp.audio, "speakers")}>
              {(speakers) => (
                <Gtk.DropDown
                  $={(self) => bind(self, "selected").subscribe(s => {
                    wp.audio.speakers[s].isDefault = true;
                  })}
                  _constructor={() => Gtk.DropDown.new_from_strings(speakers.map(s => s.description))} />
              )}
            </With>
          </box>
          <label label="Microphone" />
          <slider
            widthRequest={240}
            $changeValue={({ value }) => wp.defaultMicrophone.set_volume(value)}
            value={bind(wp.defaultMicrophone, "volume")} />
          <box orientation={Gtk.Orientation.VERTICAL}>
            <With value={bind(wp.audio, "microphones")}>
              {(microphones) => (
                <Gtk.DropDown
                  $={(self) => bind(self, "selected").subscribe(s => {
                    wp.audio.microphones[s].isDefault = true;
                  })}
                  _constructor={() => Gtk.DropDown.new_from_strings(microphones.map(s => s.description))} />
              )}
            </With>
          </box>
        </box>
      </popover>
    </menubutton>
  );
}
