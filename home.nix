{ config, pkgs, inputs, ... }:

let
  kulala = pkgs.vimUtils.buildVimPlugin {
    name = "kulala";
    src = pkgs.fetchFromGitHub {
      owner = "mistweaverco";
      repo = "kulala.nvim";
      rev = "v5.2.1"; # Replace with the specific commit or tag
      sha256 = "1vh3v5j7avqsmd259w4nga77sq4zs157lmjih0jvq9ghs893cc4i"; # Replace with the correct hash
    };
  };
in 
{
  home.username = "khang";
  home.homeDirectory = "/home/khang";

  home.stateVersion = "24.11"; # Please read the comment before changing.

  home.packages = with pkgs; [
   waybar
   git
   vscode
   go
   python312
   python312Packages.venvShellHook
   python312Packages.django
   pgadmin4-desktopmode
   vim 
   lf
   sassc
   ripgrep
   nodejs_20
   chromium
   ags
   kubectl
   bruno
   redisinsight
   lens
   grim
   slurp
   ngrok
   (google-cloud-sdk.withExtraComponents [google-cloud-sdk.components.gke-gcloud-auth-plugin])
   wl-clipboard
   swww
   lazygit
   nest-cli
   doctl
   google-chrome
   blueman
   pavucontrol
   htop
   gopls
   dig
   gnumake42
   go-migrate
   protobuf
   protoc-gen-go
   protoc-gen-go-grpc
   yarn
   rclone
   mongodb-compass
   insomnia
   terraform
   usbutils
   ibus
   ibus-engines.bamboo
   flutter
   jdk11
   android-tools
   android-studio
   air
   k6
   qmk
   unzip
   pulsemixer
   firebase-tools
   inputs.zen-browser.packages."${system}".default
  ];


  wayland.windowManager.hyprland.extraConfig = ''
  '';

  home.file.".config/ibus/config".text = ''
    [engine]
    default=VietnameseBamboo
    [preload]
    engines=VietnameseBamboo
  '';

  # wayland.windowManager.hyprland.settings = {
  #   "$mod" = "SUPER";
  #
  #   exec-once = [
  #    "waybar"
  #    "swww init"
  #   ];
  #
  #   general = {
  #    border_size = "2";
  #   };
  #
  #   decoration = {
  #    inactive_opacity = "0.900000";
  #    active_opacity = "0.900000";
  #    rounding = "10";
  #   };
  #
  #   input = {
  #    kb_options = "caps:swapescape";
  #   };
  #
  #   monitor = ",highres,auto,1";
  #
  #   bind =
  #     [
  #       "$mod, RETURN, exec, kitty --single-instance"
  #       "$mod, C, killactive"
  #       "$mod, O, exec, wofi --show drun"
  #       "$mod, TAB, fullscreen, 1"
  #       "SUPER_SHIFT, Q, exit"
  #       "$mod, P, exec, grim -g \"\${slurp}\" - | wl-copy"
  #     ]
  #     ++ (
  #       # workspaces
  #       # binds $mod + [shift +] {1..9} to [move to] workspace {1..9}
  #       builtins.concatLists (builtins.genList (i:
  #           let ws = i + 1;
  #           in [
  #             "$mod, code:1${toString i}, workspace, ${toString ws}"
  #             "$mod SHIFT, code:1${toString i}, movetoworkspace, ${toString ws}"
  #           ]
  #         )
  #         9)
  #     );
  # };

  home.file = {
    ".config/hypr/hyprland.conf".text = ''

   exec-once=ags
    exec-once=swww-daemon && swww img ~/.config/home-manager/flatppuccin_4k_macchiato.png
    exec-once = ibus-daemon -drx

$mod=SUPER

general {
  border_size=2
}

decoration {
  inactive_opacity=0.900000
  active_opacity=0.900000
  rounding=10
}

input {
  kb_options=caps:swapescape
}

workspace = special:temp, on-created-empty:kitty oo

bind=$mod, RETURN, exec, kitty --single-instance
bind=$mod, C, killactive
bind=$mod, O, exec, wofi --show drun
bind=$mod, W, exec, bash /home/khang/bin/wofi-image
bind=$mod, TAB, fullscreen, 1
bind=SUPER_SHIFT, Q, exit
bind=$mod, P, exec, grim -g "$(slurp)" - | wl-copy

bind=$mod,M,submap,music

# will start a submap called "resize"
submap=music

# sets repeatable binds for resizing the active window
binde=,right,resizeactive,10 0
binde=,left,resizeactive,-10 0
binde=,up,resizeactive,0 -10
binde=,down,resizeactive,0 10
bind=, P, exec, playerctl play-pause
bind=, P, submap, reset 

# use reset to go back to the global submap
bind=,escape,submap,reset 

# will reset the submap, which will return to the global submap
submap=reset

bind=$mod, h, movefocus, l
bind=$mod, l, movefocus, r
bind=$mod, k, movefocus, u
bind=$mod, j, movefocus, d
bind=$mod, 1, workspace, 1
bind=$mod, 2, workspace, 2
bind=$mod, 3, workspace, 3
bind=$mod, 4, workspace, 4
bind=$mod, 5, workspace, 5
bind=$mod, 6, workspace, 6
bind=$mod, 7, workspace, 7
bind=$mod, 8, workspace, 8
bind=$mod, 9, workspace, 9
bind=$mod, 0, workspace, 10
bind=$mod SHIFT, 1, movetoworkspace, 1
bind=$mod SHIFT, 2, movetoworkspace, 2
bind=$mod SHIFT, 3, movetoworkspace, 3
bind=$mod SHIFT, 4, movetoworkspace, 4
bind=$mod SHIFT, 5, movetoworkspace, 5
bind=$mod SHIFT, 6, movetoworkspace, 6
bind=$mod SHIFT, 7, movetoworkspace, 7
bind=$mod SHIFT, 8, movetoworkspace, 8
bind=$mod SHIFT, 9, movetoworkspace, 9
bind=$mod SHIFT, 0, movetoworkspace, 10
bind=SUPER_SHIFT, S, movetoworkspace, temp
bind=SUPER, S, togglespecialworkspace, temp
monitor=,highres,auto,1
    '';
  };

  home.sessionVariables = {
    EDITOR = "nvim";
    GTK_IM_MODULE = "ibus";
    QT_IM_MODULE = "ibus";
    XMODIFIERS = "@im=ibus";
    IBUS_ENABLE_SYNC_MODE = "1";
  };

  # Let Home Manager install and manage itself.
  programs.home-manager.enable = true;

  nixpkgs.config.allowUnfree = true;

  #neovim
  programs.neovim = {
	enable = true;
	viAlias = true;
	vimAlias = true;
	vimdiffAlias = true;

	plugins = with pkgs.vimPlugins; [
		#theming
		gruvbox
		base16-nvim

		neo-tree-nvim
		nvim-web-devicons

		#lsp
		nvim-lspconfig
		mason-nvim
		mason-lspconfig-nvim

		#code completion
		nvim-cmp
		cmp-nvim-lsp

		#telescope
		telescope-nvim
		plenary-nvim

        avante-nvim
        kulala-nvim

        luasnip

        copilot-lua

		(nvim-treesitter.withPlugins (p: [
			p.tree-sitter-nix
			p.tree-sitter-vim
			p.tree-sitter-bash
			p.tree-sitter-lua
			p.tree-sitter-python
			p.tree-sitter-json
			p.tree-sitter-vue
            p.tree-sitter-javascript
		]))

		lazygit-nvim
		leap-nvim

		catppuccin-nvim 

        vim-tmux-navigator
        kulala
	];

	extraLuaConfig = ''
		${builtins.readFile ./nvim/options.lua}
		${builtins.readFile ./nvim/plugins/cpm.lua}
		${builtins.readFile ./nvim/plugins/colorschema.lua}
		${builtins.readFile ./nvim/plugins/keymaps.lua}
		${builtins.readFile ./nvim/plugins/leap.lua}
		${builtins.readFile ./nvim/plugins/telescope.lua}
		${builtins.readFile ./nvim/plugins/treesitter.lua}
		${builtins.readFile ./nvim/plugins/neo-tree.lua}
		${builtins.readFile ./nvim/plugins/lsp.lua}
		${builtins.readFile ./nvim/plugins/avante.lua}
		${builtins.readFile ./nvim/plugins/kulala.lua}
		${builtins.readFile ./nvim/plugins/copilot.lua}
	'';
  };

  #tmux
  programs.tmux = {
    enable = true;
    shell = "${pkgs.zsh}/bin/zsh";
    baseIndex = 1;
    prefix = "C-a";
    keyMode = "vi";
    extraConfig = ''
        set -g default-terminal "tmux-256color"
        set -ag terminal-overrides ",xterm-256color:RGB"

        bind h select-pane -L
        bind j select-pane -D
        bind k select-pane -U
        bind l select-pane -R

        bind y split-window -v \; resize-pane -D 10

        unbind [
        bind g copy-mode 
    '';

    plugins = with pkgs; [
        {
            plugin = tmuxPlugins.vim-tmux-navigator;
        }
        {
            plugin = tmuxPlugins.dracula;
            extraConfig = ''
                set -g @dracula-show-powerine true
            '';
        }
    ];
  };

  #zsh
  programs.zsh = {
    enable = true;
    autosuggestion = {
        enable = true;
    };
    enableCompletion = true;
    syntaxHighlighting = {
        enable = true;
    };
    shellAliases = {
        ll = "ls -l";
        ".." = "cd ..";
        "cd" = "z";
    };
    initExtra = ''
      export ANDROID_HOME=${pkgs.android-tools}/share/android-sdk
      export ANDROID_SDK_ROOT=${pkgs.android-tools}/share/android-sdk
      export JAVA_HOME=${pkgs.jdk11}
    '';
  };


  programs.kitty = {
    enable = true; 
    settings = {
        shell = "zsh";
        window_padding_width = "4";
        background = "#1e1e2e";
        foreground = "#cdd6f4";
        selection_background = "#cdd6f4";
        selection_foreground = "#1e1e2e";
        url_color = "#585b70";
        cursor = "#cdd6f4";
        active_border_color = "#45475a";
        inactive_border_color = "#181825";
        active_tab_background = "#1e1e2e";
        active_tab_foreground = "#cdd6f4";
        inactive_tab_background = "#181825";
        inactive_tab_foreground = "#585b70";
        tab_bar_background = "#181825";
        wayland_titlebar_color = "#1e1e2e";
        macos_titlebar_color = "#1e1e2e";

        color0 = "#1e1e2e";
        color1 = "#f38ba8";
        color2 = "#a6e3a1";
        color3 = "#f9e2af";
        color4 = "#89b4fa";
        color5 = "#cba6f7";
        color6 = "#94e2d5";
        color7 = "#cdd6f4";

        color8 = "#45475a";
        color9 = "#fab387";
        color10 = "#181825";
        color11 = "#313244";
        color12 = "#585b70";
        color13 = "#f5e0dc";
    };

    font = {
        size = 10;
        name = "FiraCode Nerd Font";
    };
  };

  programs.starship = {
    enable = true;
    enableZshIntegration = true;
  };

  #wofi
  programs.wofi = {
    enable = true;
    settings = {
        allow_images = true;
        allow_markup = true;
        content_halign = "fill";
        filter_rate = 100;
        gtk_dark = true;
        halign = "fill";
        height = 350;
        image_size = 40;
        insensitive = true;
        location = "center";
        no_actions = true;
        orientation = "vertical";
        prompt = "Search...";
        show = "drun";
        width = 600;
    };

    style = ''
        /* Start flavours */
/*
*
* Base16 Catppuccin Mocha
* Author: https://github.com/catppuccin/catppuccin
*
*/

@define-color base00 #1e1e2e;
@define-color base01 #181825;
@define-color base02 #313244;
@define-color base03 #45475a;
@define-color base04 #585b70;
@define-color base05 #cdd6f4;
@define-color base06 #f5e0dc;
@define-color base07 #b4befe;
@define-color base08 #f38ba8;
@define-color base09 #fab387;
@define-color base0A #f9e2af;
@define-color base0B #a6e3a1;
@define-color base0C #94e2d5;
@define-color base0D #89b4fa;
@define-color base0E #cba6f7;
@define-color base0F #f2cdcd;
/* End flavours */

window {
    margin: 0px;
    border: 5px solid @base00;
    background-color: @base00;
    border-radius: 15px;
}

#input {
    padding: 4px;
    margin: 4px;
    padding-left: 20px;
    border: none;
    color: #cdd6f4;
    font-weight: bold;
    background-color: @base00;
    background: ;
    outline: none;
    border-radius: 15px;
    margin: 10px;
    margin-bottom: 2px;
}
#input:focus {
    margin-bottom: 0px;
}

#inner-box {
    margin: 4px;
    border: 10px solid #1e1e2e;
    color: #cdd6f4;
    font-weight: bold;
    border-color: @base00;
    background-color: @base00;
    border-radius: 15px;
}

#outer-box {
    margin: 0px;
    border: none;
    border-radius: 15px;
    border-color: @base00;
    background-color: base00;
}

#scroll {
    margin-top: 5px;
    border: none;
    border-radius: 15px;
    margin-bottom: 5px;
    /* background: rgb(255,255,255); */
}

#img:selected {
    background-color: @base02;
    border-radius: 15px;
}

#text:selected {
    color: @base0D;
    margin: 0px 0px;
    border: none;
    border-radius: 15px;
    background-color: @base02;
    color: @base05;
}

#entry {
    margin: 0px 0px;
    border: none;
    border-radius: 15px;
    background-color: transparent;
}

#entry:selected {
    margin: 0px 0px;
    border: none;
    border-radius: 15px;
    background-color: @base02;
    color: @base05;
}
    '';
  };

  # programs.ags = {
  #   enable = true;
  # };

  home.file."ags" = {
    source = ./ags;
    recursive = true;
    target = ".config/ags";
  };

  #zoxide
  programs.zoxide = {
    enable = true;
    enableZshIntegration = true;
  };

  #firefox
  #programs.firefox = {
  #  enable = true;
  #  profiles.khang = {
  #      extensions = with inputs.firefox-addons.packages."x86_64-linux"; [
  #          bitwarden
  #          ublock-origin
  #          darkreader
  #          vimium
  #      ];
  #  };
  #};
}
