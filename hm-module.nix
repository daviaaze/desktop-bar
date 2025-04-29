self:
{
  config,
  lib,
  pkgs,
  ...
}:
let
  cfg = config.programs.dvision-dshell;
  pkg = self.packages.${pkgs.system}.default;
in
{
  options.programs.dvision-dshell = {
    enable = lib.mkEnableOption "dvision-dshell";
    hyprland = {
      binds.enable = lib.mkOption {
        type = lib.types.bool;
        default = false;
        example = true;
        description = ''
          Enable default binds to toggle the widgets in hyprland.
        '';
      };
      blur.enable = lib.mkOption {
        type = lib.types.bool;
        default = false;
        example = true;
        description = ''
          Enable layer rules to blur the widget's background in hyprland.
        '';
      };
    };
    systemd.enable = lib.mkOption {
      type = lib.types.bool;
      default = false;
      example = true;
      description = ''
        Enable systemd integration.
      '';
    };
  };
  config = lib.mkIf cfg.enable (
    lib.mkMerge [
      { home.packages = [ pkg ]; }
      (lib.mkIf cfg.systemd.enable {
        systemd.user.services.dvision-dshell = {
          Unit = {
            Description = "";
            # Documentation = "https://github.com/Aylur/ags";
            PartOf = [ "graphical-session.target" ];
            After = [ "graphical-session-pre.target" ];
          };

          Service = {
            ExecStart = "${lib.getExe pkg}";
            Restart = "on-failure";
            KillMode = "mixed";
          };

          Install = {
            WantedBy = [ "graphical-session.target" ];
          };
        };
      })
      (lib.mkIf cfg.hyprland.binds.enable {
        # wayland.windowManager.hyprland.extraConfig = ''
        #   bind=SUPER,Space,exec, dvision-dshell toggle applauncher
        #   bind=SUPER,n,exec, dvision-dshell toggle quicksettings
        #   bind=SUPERSHIFT,n,exec, dvision-dshell toggle infopannel
        # '';
      })
      (lib.mkIf cfg.hyprland.blur.enable {
        wayland.windowManager.hyprland.extraConfig = ''
          layerrule=blur,gtk4-layer-shell
          layerrule=ignorezero,gtk4-layer-shell
        '';
      })
    ]
  );
}