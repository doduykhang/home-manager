const notifications = await Service.import("notifications")
import {timeout} from "resource:///com/github/Aylur/ags/utils.js";

/** @param {import('resource:///com/github/Aylur/ags/service/notifications.js').Notification} n */
    function NotificationIcon({ app_entry, app_icon, image }) {
        if (image) {
            return Widget.Box({
                css: `background-image: url("${app_icon}");`
                + "background-size: contain;"
                + "background-repeat: no-repeat;"
                + "background-position: center;",
            })
        }

        let icon = "dialog-information-symbolic"
        if (Utils.lookUpIcon(app_icon))
            icon = app_icon

        if (app_entry && Utils.lookUpIcon(app_entry))
            icon = app_entry

        return Widget.Box({
            child: Widget.Icon(icon),
        })
    }

/** @param {import('resource:///com/github/Aylur/ags/service/notifications.js').Notification} notification */
function NotificationReveal(notification) {
    const widget = Notification(notification);
    const transition = 500;

    const inner = Widget.Revealer({
        transition: "slide_left",
        transition_duration: transition,
        child: widget,
    })

    const outer = Widget.Revealer({
        transition: "slide_down",
        transition_duration: transition,
        child: inner,
    })

    const box = Widget.Box({
        attribute: { 
            id: notification.id,
            dismiss: () => {
                inner.reveal_child = false
                timeout(transition / 5, () => {
                    outer.reveal_child = false
                    timeout(transition / 5, () => {
                        box.destroy()
                    })
                })
            },
        },
        child: outer,
    })

    Utils.idle(() => {
        outer.reveal_child = true
        timeout(transition / 5, () => {
            inner.reveal_child = true
        })
    })

    return box

}

/** @param {import('resource:///com/github/Aylur/ags/service/notifications.js').Notification} n */
    function Notification(n) {
        const icon = Widget.Box({
            vpack: "start",
            class_name: "icon",
            child: NotificationIcon(n),
        })

        const title = Widget.Label({
            class_name: "title",
            xalign: 0,
            justification: "left",
            hexpand: true,
            maxWidthChars: 24,
            truncate: "end",
            wrap: true,
            useMarkup: true,
        })
        .on("realize", self => {
            self.set_markup(n.summary.trim())
        })

        const body = Widget.Label({
            justification: 'left',
            class_name: "body",
            truncate: 'end',
            xalign: 0,
            maxWidthChars: 24,
            wrap: true,
            useMarkup: true,
        })
        .on("realize", self => {
            self.set_markup(n.body.trim())
        })

        return Widget.EventBox(
            {
                attribute: { id: n.id },
                on_primary_click: n.dismiss,
            },
            Widget.Box(
                {
                    class_name: `notification ${n.urgency}`,
                    vertical: true,
                },
                Widget.Box([
                    icon,
                    Widget.Box(
                        { vertical: true },
                        title,
                        body
                    ),
                ]),
            ),
        )
    }

export function NotificationPopups(monitor = 0) {
    const list = Widget.Box({
        vertical: true,
        children: notifications.popups.map(NotificationReveal),
    })

    function onNotified(_, /** @type {number} */ id) {
        const n = notifications.getNotification(id)
        if (n)
            list.children = [NotificationReveal(n), ...list.children]
    }

    function onDismissed(_, /** @type {number} */ id) {
        list.children.find(n => n.attribute.id === id)?.attribute.dismiss()
    }

    list.hook(notifications, onNotified, "notified")
        .hook(notifications, onDismissed, "dismissed")

    return Widget.Window({
        monitor,
        name: `notifications${monitor}`,
        class_name: "notification-popups",
        anchor: ["top", "right"],
        child: Widget.Box({
            spacing: 8,
            homogeneous: false,
            css: "min-width: 2px; min-height: 2px;",
            class_name: "notifications",
            vertical: true,
            child: list,
        }),
    })
}
