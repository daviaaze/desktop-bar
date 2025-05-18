import Wireplumber from "gi://AstalWp";
import { bind, State } from "ags/state";
import { For, Gtk } from "ags/gtk4";
import { Slider } from "../components/Slider";

const audio = Wireplumber.get_default()!.audio;
const visible = new State<boolean>(false);

const AudioSlider = () => (
  <Slider
    icon="audio-volume-high-symbolic"
    min={0}
    max={100}
    value={bind(audio.defaultSpeaker, "volume").as(v => v * 100)}
    setValue={(value) => audio.defaultSpeaker.set_volume(value / 100)}
  />
);

export default () => (
  <box cssClasses={["audio-config"]} orientation={Gtk.Orientation.VERTICAL}>
    <button $clicked={() => visible.set(!visible.get())}>
      <AudioSlider />
    </button>
    <Gtk.Revealer revealChild={bind(visible)}>
      <box orientation={Gtk.Orientation.VERTICAL}>
        <For each={bind(audio, "speakers")}>
          {(speaker) => (
            <Gtk.ToggleButton
              active={bind(speaker, "isDefault")}
              $activate={() => {
                speaker.set_is_default(true);
              }}
            >
              <label
                _type="label"
                label={speaker.description}
                wrap
                maxWidthChars={10}
              />
            </Gtk.ToggleButton>
          )}
        </For>
      </box>
    </Gtk.Revealer>
  </box>
);
