const hyprland = await Service.import('hyprland')

const ws = Variable([
    {"id": 1, "label": ""},
    {"id": 2, "label": ""},
    {"id": 3, "label": ""},
    {"id": 4, "label": ""},
    {"id": 5, "label": ""},
    {"id": 6, "label": ""},
    {"id": 7, "label": ""},
    {"id": 8, "label": ""},
    {"id": 9, "label": ""},
    {"id": 10, "label": ""}
])

function Workspaces() {
    const activeId = hyprland.active.workspace.bind("id")
    const workspaces = ws.bind()
        .as(ws => ws.map(({ id, label }) => Widget.Button({
            on_clicked: () => hyprland.messageAsync(`dispatch workspace ${id}`),
            child: Widget.Label(
                {
                    label: activeId.as(i => `${i === id ? "": ""}`)
                }
            ),
        })))

    //const img = Widget.Box({
    //    marginTop: 8,
    //    marginLeft: 8,
    //    class_name: "img",
    //    vpack: "start",
    //    css: `background-image: url('/home/khang/.config/ags/asset/vbs_icon.png');`,
    //})

    const img = Widget.Label({
        label: "󱄅",
        class_name: "icon",
        marginStart: 10,
        marginEnd: 10,
    })

    return Widget.Box({
        class_name: "workspaces",
        children: [
            Widget.Box({
                marginStart: 10,
                children: [
                    img,
                    Widget.Box({
                        marginEnd: 10,
                        children: workspaces
                    })
                ],
                class_name: "workspaces-inner"
            })
        ],
    })
}

export { Workspaces }
