import Hyprland from "gi://AstalHyprland";
import App from "ags/gtk4/app";
import { execAsync } from "ags/process";
import { Astal, Gtk } from "ags/gtk4";
import { bind, State } from "ags/state";

import NotificationList from "./notificationList";
import PwrProf from "./powerprofiles";
import DarkMode from "./darkMode";
import Tray from "./tray";
import AudioConfig from "./audioConfig";
import Media from "./media";
import Battery from "./battery";
import Brightness from "lib/brightness";
import { Slider } from "components/Slider";

const hyprland = Hyprland.get_default();

const Lock = () => (
  <button
    cssClasses={["circular"]}
    $clicked={() => {
      execAsync(["bash", "-c", "hyprlock --immediate"]);
    }}
  >
    <image iconName={"system-lock-screen-symbolic"} />
  </button>
);

const Poweroff = () => (
  <button
    cssClasses={["circular", "destructive-action"]}
    $clicked={() => {
      execAsync(["bash", "-c", "systemctl poweroff"]);
    }}
  >
    <image iconName={"system-shutdown-symbolic"} />
  </button>
);

const RotateButton = ({ vertical }: { vertical: State<boolean> }) => (
  <button
    $clicked={() => vertical.set(!vertical.get())}
    cssClasses={["circular"]}
  >
    <image iconName={"object-rotate-right-symbolic"} />
  </button>
);

const brightness = Brightness.get_default();

const BrightnessSlider = () => {
  return (
  <Slider
    icon="display-brightness-symbolic"
    min={0}
    max={100}
    value={bind(brightness, "screen").as(v => v * 100)}
    setValue={(value) => brightness.set({ screen: value / 100 })}
  />
  );
};

export const QuickSettings = (
  vertical: State<boolean>,
  visible: State<{ applauncher: boolean; quicksettings: boolean }>
) => (
  <window
    $={(self) =>
      bind(self, "visible").subscribe((v) => {
        visible.set({
          applauncher: v && vertical.get() ? false : visible.get().applauncher,
          quicksettings: v,
        });
      })
    }
    valign={Gtk.Align.FILL}
    margin={12}
    visible={bind(visible).as((v) => v.quicksettings)}
    application={App}
    name={"quicksettings"}
    cssClasses={["quicksettings", "background"]}
    anchor={bind(vertical).as(
      (vertical) =>
        Astal.WindowAnchor.BOTTOM |
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.RIGHT
    )}
    monitor={bind(hyprland, "focusedMonitor").as((m) => m.id)}
  >
    <box
      cssClasses={["quicksettings-body"]}
      orientation={Gtk.Orientation.VERTICAL}
      spacing={8}
    >
      <box spacing={8}>
        <PwrProf />
        <DarkMode />
      </box>
      <box halign={Gtk.Align.CENTER} spacing={8}>
        <Tray />
        <Lock />
        <RotateButton vertical={vertical} />
        <Poweroff />
      </box>
      <BrightnessSlider />
      <AudioConfig />
      <Battery />
      <Media />
      <NotificationList />
    </box>
  </window>
);

export default QuickSettings;
