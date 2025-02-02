const battery = await Service.import('battery')

const percent = battery.bind('percent').as(p => `${p}%`)

export const batteryText = Widget.Label({
    label: percent
})

export const batteryProgress = Widget.CircularProgress({
    child: Widget.Icon({
        icon: battery.bind('icon_name')
    }),
    visible: battery.bind('available'),
    value: battery.bind('percent').as(p => p > 0 ? p / 100 : 0),
    class_name: battery.bind('charging').as(ch => ch ? 'charging' : ''),
})
