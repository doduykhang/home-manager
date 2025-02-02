const mpris = await Service.import("mpris")
const players = mpris.bind("players")
import {execAsync} from "resource:///com/github/Aylur/ags/utils.js";
import Gtk from "gi://Gtk?version=3.0";

const FALLBACK_ICON = "audio-x-generic-symbolic"
const PLAY_ICON = "media-playback-start-symbolic"
const PAUSE_ICON = "media-playback-pause-symbolic"
const PREV_ICON = "media-skip-backward-symbolic"
const NEXT_ICON = "media-skip-forward-symbolic"

async function blurCoverArtCss(player, default_color) {

  const coverPath = player.cover_path;

  /** @param {string} bg
  *   @param {string} color
  */
  const genCss = (bg, color) =>
    `background-image: radial-gradient(
      circle at right,
      rgba(0, 0, 0, 0),
      ${color} 14.5rem), ${bg};
    background-position: right, right;
    background-size: auto 15rem;
    transition: all 0.7s ease;
    background-repeat: no-repeat;`;

  if(coverPath) {
    const color = await execAsync(`bash -c "convert ${coverPath} -alpha off -crop 5%x100%0+0+0 -colors 1 -unique-colors txt: | head -n2 | tail -n1 | cut -f4 -d' '"`);
    return genCss(`url('${coverPath}')`, color);
  }
  return genCss(`-gtk-icontheme('${player.entry}')`, default_color);
}

/** @param {number} length */
    function lengthStr(length) {
        const min = Math.floor(length / 60)
        const sec = Math.floor(length % 60)
        const sec0 = sec < 10 ? "0" : ""
        return `${min}:${sec0}${sec}`
    }

/** @param {import('types/service/mpris').MprisPlayer} player */
    function Player(player) {
        if (player.name === 'chromium') {

            const img = Widget.Box({
                class_name: "img",
                vpack: "start",
                css: player.bind("cover_path").transform(p => {
                    return `background-image: url('${p}');`
                }),
            })

            const title = Widget.Label({
                class_name: "title",
                wrap: true,
                maxWidthChars: 15,
                truncate: "end",
                hexpand: true,
                label: player.bind("track_title"),
            })

            const artist = Widget.Label({
                class_name: "artist",
                wrap: true,
                hpack: "start",
                label: player.bind("track_artists").transform(a => a.join(", ")),
            })

            const positionSlider = Widget.Slider({
                class_name: "position",
                draw_value: false,
                on_change: ({ value }) => player.position = value * player.length,
                visible: player.bind("length").as(l => l > 0),
                setup: self => {
                    function update() {
                        const value = player.position / player.length
                        self.value = value > 0 ? value : 0
                    }
                    self.hook(player, update)
                    self.hook(player, update, "position")
                    self.poll(1000, update)
                },
            })

            const positionLabel = Widget.Label({
                class_name: "position",
                hpack: "start",
                setup: self => {
                    const update = (_, time) => {
                        self.label = lengthStr(time || player.position)
                        self.visible = player.length > 0
                    }

                    self.hook(player, update, "position")
                    self.poll(1000, update)
                },
            })

            const lengthLabel = Widget.Label({
                class_name: "length",
                hpack: "end",
                visible: player.bind("length").transform(l => l > 0),
                label: player.bind("length").transform(lengthStr),
            })

            const icon = Widget.Icon({
                class_name: "icon",
                hexpand: true,
                hpack: "end",
                vpack: "start",
                tooltip_text: player.identity || "",
                icon: player.bind("entry").transform(entry => {
                    const name = `${entry}-symbolic`
                    return Utils.lookUpIcon(name) ? name : FALLBACK_ICON
                }),
            })

            const playPause = Widget.Button({
                class_name: "play-pause",
                on_clicked: () => player.playPause(),
                visible: player.bind("can_play"),
                child: Widget.Icon({
                    icon: player.bind("play_back_status").transform(s => {
                        switch (s) {
                            case "Playing": return PAUSE_ICON
                            case "Paused":
                            case "Stopped": return PLAY_ICON
                        }
                    }),
                }),
            })

            const prev = Widget.Button({
                on_clicked: () => player.previous(),
                visible: player.bind("can_go_prev"),
                child: Widget.Icon(PREV_ICON),
            })

            const next = Widget.Button({
                on_clicked: () => player.next(),
                visible: player.bind("can_go_next"),
                child: Widget.Icon(NEXT_ICON),
            })

            return Widget.Box(
                { class_name: "player", margin: 4 },
                img,
                Widget.Box(
                    {
                        vertical: true,
                        hexpand: true,
                    },
                    Widget.Box([
                        title,
                        icon,
                    ]),
                    artist,
                    Widget.Box({
                        margin_top: 10
                    }),
                    positionSlider,
                    Widget.CenterBox({
                        margin_top: 15,
                        start_widget: positionLabel,
                        center_widget: Widget.Box([
                            prev,
                            playPause,
                            next,
                        ]),
                        end_widget: lengthLabel,
                    }),
                ),
            ).hook(player, async (self) => {
                const color = self.get_style_context().get_background_color(Gtk.StateFlags.NORMAL).to_string();
                self.css = await blurCoverArtCss(player, color);
            }, "notify::cover-path");


        } else {
            return Widget.Box()
        }
    }

export function Media() {
    return Widget.Box({
        vertical: true,
        class_name: "media-player",
        visible: players.as(p => p.length > 0),
        children: players.as(p => p.map(Player)),
    })
}
