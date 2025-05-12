import { bind } from "ags/state"
import Wireplumber from "gi://AstalWp"
import Brightness from "../lib/brightness"
import { Gtk } from "ags/gtk4"

const brightness = Brightness.get_default()
const audio = Wireplumber.get_default()!.audio

export enum SliderType {
  AUDIO,
  BRIGHTNESS,
}

export const Slider = ({ type }: { type: SliderType }) =>
  <box
    cssClasses={["slider"]}
    spacing={4}
    valign={Gtk.Align.CENTER}
    halign={Gtk.Align.CENTER}>
    <image iconName={type === SliderType.AUDIO ?
      bind(audio.defaultSpeaker, "volume_icon") :
      "display-brightness-symbolic"} />
    <Gtk.ProgressBar
      hexpand
      valign={Gtk.Align.CENTER}
      halign={Gtk.Align.CENTER}
      fraction={type === SliderType.AUDIO ?
        bind(audio.defaultSpeaker, "volume").as(v => v) :
        bind(brightness, "screen").as(v => v)} />
    <label
      cssClasses={["heading"]}
      label={type === SliderType.AUDIO ?
        bind(audio.defaultSpeaker, "volume").as(v =>
          Math.floor(v * 100)
            .toString()
            .concat("%")) :
        bind(brightness, "screen").as(v =>
          Math.floor(v * 100)
            .toString()
            .concat("%"))} />
  </box>