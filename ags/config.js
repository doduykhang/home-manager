import { Workspaces } from "./widgets/workspaces.js"
import { batteryText } from "./widgets/battery.js"
import { time } from "./widgets/time.js"
import { Media } from "./widgets/media/media.js"
import CavaWidget from "./widgets/cava.js"
import { exec } from "resource:///com/github/Aylur/ags/utils.js";
import { NotificationPopups } from "./widgets/notification.js"
const mpris = await Service.import("mpris")
const players = mpris.bind("players")

const CurrentTrackBox = () => {
    const Mapper = (player) => {
       console.log(player, "player")
       if(player.name === "chromium") {
            const title = Widget.Label({
                class_name: "title",
                hexpand: true,
                label: player.bind("track_title"),
            })
           return title
       }
       return Widget.Label("")
    }

    const innerBox = Widget.Box({
        children: players.as(players => players.map(Mapper))
    })

    const box = Widget.Box({
        class_name: "track-title-wrapper",
        children: [
            Widget.Label({
                class_name: "track-title-icon",
                label: "󰫔"
            }),
            innerBox
        ]
    })

    return box
}

export const showRightBar = Variable(false);

export const toggleRightBar = () => {
    showRightBar.setValue(!showRightBar.value)
}

globalThis.toggleRightBar = toggleRightBar;

const box = (icon, innerBox, className) => Widget.Box({
    class_name: className,
    children: [
        Widget.Label({
            class_name: "icon",
            label: icon
        }),
        innerBox
    ]
})

const endWidgets = Widget.Box({
    hpack: "end",
    spacing: 8,
    children: [
        box(" ", Widget.Label({label: time.bind()}), "time-wrapper"),
        box("󰠠 ", batteryText, "battery-wrapper")
    ]
})

const Bar = (/** @type {number} */ monitor) => Widget.Window({
    monitor,
    name: `bar${monitor}`,
    anchor: ['top', 'left', 'right'],
    exclusivity: 'exclusive',
    class_name: 'bar',
    margins: [4, 4, 0, 4],
    child: Widget.CenterBox({
        start_widget: Workspaces(),
        class_name: "wrapper",
        center_widget: CurrentTrackBox(),
        end_widget: endWidgets
    }),
})

const RightBarAnimated = () => {
    const transitionDuration = 500

    const rightBar = RightBarContent()

    const revealer = Widget.Revealer({
        transition: "slide_left",
        transition_duration: transitionDuration,
        revealChild: showRightBar.bind(),
        child: rightBar
    })
    const box = Widget.Box({
        class_name: "rightbar-animated",
        children: [
            revealer
        ],
        vexpand: true,
        hexpand: true,
        vertical: true
    })

    return box
}

const RightBarContent = () => {
    return Widget.Box({
        margin: 10,
        class_name: "wrapper",
        vertical: true,
        children: [
            Widget.Box({
                margin_top: 8
            }),
            Media(),
            Widget.Box({
                vexpand: true
            }),
            CavaWidget({
                bars: 20,
                barHeight: 100,
                align: "end",
                vertical: false,
                smooth: true,
            })
        ]
    })
}

const RightBar = (/** @type {number} */ monitor) => Widget.Window({
    monitor,
    name: `vertical-bar`,
    class_name: 'vertical-bar',
    anchor: ['right', 'top', 'bottom'],
    exclusivity: 'normal',
    keymode: showRightBar.bind().as(show => show ? "exclusive" : "none"),
    margins: [4, 4, 4, 4],
    setup: self => self.keybind("Escape", () => {
        self.keymode = "none"
        toggleRightBar()
    }),
    child: RightBarAnimated()
})

const scss = `${App.configDir}/style/style.scss`

// target css file
const css = `/tmp/my-style.css`

// make sure sassc is installed on your system
exec(`sassc ${scss} ${css}`)

console.log(`${App.configDir}/style`)

Utils.monitorFile(
    // directory that contains the scss files
    `${App.configDir}/style`,

    // reload function
    function() {
        // main scss file
        const scss = `${App.configDir}/style/style.scss`

        // target css file
        const css = `/tmp/my-style.css`

        // compile, reset, apply
        Utils.exec(`sassc ${scss} ${css}`)
        App.resetCss()
        App.applyCss(css)
    },
)

App.config({
    style: css,
    windows: [
        Bar(0), 
        RightBar(),
        NotificationPopups(),
    ],
})
