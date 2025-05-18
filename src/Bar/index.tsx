import app from "ags/gtk4/app";
import Astal from "gi://Astal?version=4.0";
import { Clock, Mpris, Tray, System, AudioOutput, Battery, Workspaces, SystemUsage } from './widget'
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
            <centerbox cssClasses={["bar-centerbox"]}>
                <box _type="start" cssClasses={["spacing-4"]}>
                    <SystemUsage />
                    <Mpris />
                    <Workspaces monitor={monitor} />
                </box>
                <box _type="center" cssClasses={["spacing-4"]}>
                    <Clock />
                </box>
                <box _type="end" cssClasses={["spacing-4"]}>
                    <Tray />
                    <System vertical={false} />
                </box>
            </centerbox>
        </window>
    );
}

export default () => {
    const bars = new Map<number, Astal.Window>()
    const hyprland = AstalHyprland.get_default()
  
    // initialize
    for (const monitor of hyprland.get_monitors()) {
      bars.set(monitor.id, Bar(monitor) as Astal.Window)
    }
  
    hyprland.connect("monitor-added", (_, monitor) => {
      bars.set(monitor.id, Bar(monitor) as Astal.Window)
    })
  
    hyprland.connect("monitor-removed", (_, id) => {
      bars.get(id)?.close()
      bars.delete(id)
    })
}