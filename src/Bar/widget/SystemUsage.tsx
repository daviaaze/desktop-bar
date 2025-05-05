import { execAsync } from "ags/process";
import { bind, Binding, Poll, State } from "ags/state";
import { Gdk, Gtk } from "ags/gtk4";
import GTop from "gi://GTop";


const lastCpuTop = new State<GTop.glibtop_cpu>(new GTop.glibtop_cpu())
const INTERVAL = 1000;

const cpu = new Poll<number>(0, INTERVAL, () => {
    const cpuTop = new GTop.glibtop_cpu()
    GTop.glibtop_get_cpu(cpuTop);
    const total = cpuTop.total - lastCpuTop.get().total;
    const user = cpuTop.user - lastCpuTop.get().user;
    const sys = cpuTop.sys - lastCpuTop.get().sys;
    const nice = cpuTop.nice - lastCpuTop.get().nice;
    lastCpuTop.set(cpuTop)
    return (user + sys + nice) / total;
})

const memory = new Poll<number>(0, INTERVAL, () => {
    const memTop = new GTop.glibtop_mem()
    GTop.glibtop_get_mem(memTop);
    return memTop.user / memTop.total;
})

const disk = new Poll<number>(0, INTERVAL, () => {
    const diskTop = new GTop.glibtop_fsusage()
    GTop.glibtop_get_fsusage(diskTop, "/");
    return diskTop.bavail / diskTop.bfree;
})

const temp = new Poll<number>(0, INTERVAL,
    `cat /sys/class/hwmon/hwmon2/temp1_input`,
    out => parseInt(out) / 100000)


const Indicator = ({ value, label, unit }:
    {
        value: Binding<number>,
        label: string,
        unit: string,
    }) => <Gtk.LevelBar
        value={value}>
        <box
            valign={Gtk.Align.CENTER}
            halign={Gtk.Align.CENTER}
            spacing={2}
            css="padding: 2px 5px;"
        >
            <label
                label={label}
                cssClasses={["title"]} />
            <label
                cssClasses={["body"]}
                label={value.as(v =>
                    (v * 100)
                        .toFixed(0)
                        .concat(unit))} />
        </box>
    </Gtk.LevelBar>

export const SystemUsage = () =>
    <button
        cursor={Gdk.Cursor.new_from_name("pointer", null)}
        >
        <box
            spacing={4}>
            <Indicator
                value={bind(cpu)}
                label="CPU"
                unit="%" />
            <Indicator
                value={bind(memory)}
                label="RAM"
                unit="%" />
            <Indicator
                value={bind(temp)}
                label="TEMP"
                unit="°C" />
            {/* <Indicator
        value={bind(disk)}
        label="DISK"
        unit="%" /> */}
        </box>
    </button>

export default SystemUsage