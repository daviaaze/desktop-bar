import app from "ags/gtk4/app";
import Astal from "gi://Astal?version=4.0";
import { Clock, Mpris, Tray, Wireless, AudioOutput, Battery, Workspaces } from './widget'
import AstalHyprland from "gi://AstalHyprland?version=0.1";


function Bar(monitor: AstalHyprland.Monitor) {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

    return (
        <window
            visible
            name="bar"
            monitor={monitor.id}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            anchor={TOP | LEFT | RIGHT}
            application={app}
        >
            <centerbox>
                <box _type="start">
                    <Clock />
                    <Mpris />
                    <Workspaces monitor={monitor} />
                </box>
                <box _type="end">
                    <Tray />
                    <Wireless />
                    <AudioOutput />
                    <Battery />
                </box>
            </centerbox>
        </window>
    );
}

export default () => {
    const bars = new Map<AstalHyprland.Monitor, Astal.Window>()
    const hyprland = AstalHyprland.get_default()
  
    // initialize
    for (const monitor of hyprland.get_monitors()) {
      bars.set(monitor, Bar(monitor) as Astal.Window)
    }
  
    hyprland.connect("monitor-added", (_, monitor) => {
      bars.set(monitor, Bar(monitor) as Astal.Window)
    })
  
    hyprland.connect("monitor-removed", (_, id) => {
      bars.get(hyprland.get_monitor(id))?.close()
      bars.delete(hyprland.get_monitor(id))
    })
}