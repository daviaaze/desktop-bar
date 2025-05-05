import { bind } from "ags/state";
import AstalBattery from "gi://AstalBattery?version=0.1";
import AstalPowerProfiles from "gi://AstalPowerProfiles?version=0.1";
import Gtk from "gi://Gtk?version=4.0";

export function Battery() {
  const battery = AstalBattery.get_default();
  const powerprofiles = AstalPowerProfiles.get_default();

  const percent = bind(battery, "percentage").as(
    (p) => `${Math.floor(p * 100)}%`
  );

  const activeProfile = bind(powerprofiles, "active_profile");

  const setProfile = (profile: string) => {
    powerprofiles.set_active_profile(profile);
  };

  return (
    <menubutton visible={bind(battery, "isPresent")}>
      <box>
        <image iconName={bind(battery, "iconName")} />
        <label label={percent} />
      </box>
      <popover>
        <box orientation={Gtk.Orientation.VERTICAL}>
          {powerprofiles.get_profiles().map(({ profile }) => (
            <button
              $clicked={() => setProfile(profile)}
              cssClasses={activeProfile.as((p) => [
                p === profile ? "active" : "",
              ])}
            >
              <label label={profile} xalign={0} />
            </button>
          ))}
        </box>
      </popover>
    </menubutton>
  );
}
