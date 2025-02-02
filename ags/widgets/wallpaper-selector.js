const { query } = await Service.import("applications")
import {exec} from "resource:///com/github/Aylur/ags/utils.js";
const WINDOW_NAME = "wallpaper-selector"
const wallpaperDir = "/home/khang/wall"

/** @param {string} wallpaper*/
const AppItem = wallpaper => Widget.Button({
    class_name: "app-item",
    on_clicked: () => {
        App.closeWindow(WINDOW_NAME)
        exec(`image-theme ${wallpaperDir}/${wallpaper}`)
    },
    attribute: { wallpaper },
    child: Widget.Box({
        children: [
            Widget.Box({
                class_name: "img",
                vpack: "start",
                css: `background-image: url('${wallpaperDir}/${wallpaper}');`
            }),
            Widget.Label({
                class_name: "title",
                label: wallpaper,
                xalign: 0,
                vpack: "center",
                truncate: "end",
            }),
        ],
    }),
})

const Applauncher = ({ width = 500, height = 500, spacing = 12 }) => {
    // list of application buttons
    const lsResults = exec(`ls ${wallpaperDir}`)
    const wallpapers = lsResults.split("\n")
    console.log("wallpapers", wallpapers)

    let applications = wallpapers.map(AppItem)

    //let applications = query("").map(AppItem)

    // container holding the buttons
    const list = Widget.Box({
        vertical: true,
        children: applications,
        spacing,
    })

    // repopulate the box, so the most frequent apps are on top of the list
    function repopulate() {
        applications = query("").map(AppItem)
        list.children = applications
    }

    // search entry
    const entry = Widget.Entry({
        hexpand: true,
        css: `margin-bottom: ${spacing}px;`,

        // to launch the first item on Enter
        on_accept: () => {
            // make sure we only consider visible (searched for) applications
	    const results = applications.filter((item) => item.visible);
            if (results[0]) {
                App.toggleWindow(WINDOW_NAME)
                exec(`image-theme ${wallpaperDir}/${results[0]}`)
            }
        },

        // filter out the list
        on_change: ({ text }) => applications.forEach(item => {
            item.visible = item.attribute.wallpaper.match(text ?? "")
        }),
    })

    return Widget.Box({
        vertical: true,
        css: `margin: ${spacing * 2}px;`,
        children: [
            entry,

            // wrap the list in a scrollable
            Widget.Scrollable({
                hscroll: "never",
                css: `min-width: ${width}px;`
                    + `min-height: ${height}px;`,
                child: list,
            }),
        ],
        setup: self => self.hook(App, (_, windowName, visible) => {
            if (windowName !== WINDOW_NAME)
                return

            // when the applauncher shows up
            if (visible) {
                repopulate()
                entry.text = ""
                entry.grab_focus()
            }
        }),
    })
}

// there needs to be only one instance
export const wallpaperSelector = Widget.Window({
    name: WINDOW_NAME,
    setup: self => self.keybind("Escape", () => {
        App.closeWindow(WINDOW_NAME)
    }),
    visible: false,
    keymode: "exclusive",
    child: Applauncher({
        width: 500,
        height: 500,
        spacing: 12,
    }),
})
