const audio = await Service.import('audio')
import {execAsync} from "resource:///com/github/Aylur/ags/utils.js";
import Audio from "resource:///com/github/Aylur/ags/service/audio.js";
import icons from "./icons.js";
import Menu from "./menu.js";

/** @param {string} type */
const sorm = (type) => type === "sink" ? "speaker" : "microphone";
/** @param {string} type */
const sorms = (type) => type === "sink" ? "speakers" : "microphones";
/** @param {string | null} item
 *  @param {string} type */
const iconSubstitute = (item, type) => {
  const microphoneSubstitutes = {
    "audio-headset-analog-usb": "audio-headset-symbolic",
    "audio-headset-bluetooth": "audio-headphones-symbolic",
    "audio-card-analog-usb": "audio-input-microphone-symbolic",
    "audio-card-analog-pci": "audio-input-microphone-symbolic",
    "audio-card-analog": "audio-input-microphone-symbolic",
    "camera-web-analog-usb": "camera-web-symbolic"
  };
  const substitues = {
    "audio-headset-bluetooth": "audio-headphones-symbolic",
    "audio-card-analog-usb": "audio-speakers-symbolic",
    "audio-card-analog-pci": "audio-speakers-symbolic",
    "audio-card-analog": "audio-speakers-symbolic",
    "audio-headset-analog-usb": "audio-headset-symbolic"
  };

  if (type === "sink") {
    return substitues[item] || item;
  }
  return microphoneSubstitutes[item] || item;
};

const TypeIndicator = (type = "sink") => Widget.Button({
  on_clicked: () => execAsync(`pactl set-${type}-mute @DEFAULT_${type.toUpperCase()}@ toggle`),
  child: Widget.Icon()
    .hook(Audio, icon => {
      if (Audio[sorm(type)])
        // @ts-ignore
        icon.icon = iconSubstitute(Audio[sorm(type)].icon_name, type);
    }, sorm(type) + "-changed")
});

const VolumeSlider = (type = "sink") => Widget.Slider({
  hexpand: true,
  draw_value: false,
  // @ts-ignore
  on_change: ({value}) => Audio[sorm(type)].volume = value,
})
  .hook(Audio, slider => {
    if (!Audio[sorm(type)])
      return;

    // @ts-ignore
    slider.sensitive = !Audio[sorm(type)]?.stream.is_muted;
    // @ts-ignore
    slider.value = Audio[sorm(type)].volume;
  }, sorm(type) + "-changed");

const PercentLabel = (type = "sink") => Widget.Label({
  class_name: "audio-volume-label",
})
  .hook(Audio, label => {
    if (Audio[sorm(type)])
      // @ts-ignore
      label.label = `${Math.floor(Audio[sorm(type)].volume * 100)}%`;
  }, sorm(type) + "-changed");

export const Volume = (type = "sink") => Widget.Box({
  class_name: "audio-volume-box",
  children: [
    TypeIndicator(type),
    VolumeSlider(type),
    PercentLabel(type)
  ],
});

const SinkItem = (type) => stream => Widget.Button({
  on_clicked: () => Audio[sorm(type)] = stream,
  child: Widget.Box({
    class_name: "spacing-5",
    children: [
      Widget.Icon({
        icon: iconSubstitute(stream.icon_name, type),
        tooltip_text: stream.icon_name,
      }),
      Widget.Label(stream.description?.split(" ").slice(0, 4).join(" ")),
      Widget.Icon({
        icon: icons.tick,
        hexpand: true,
        hpack: "end",
      }).hook(Audio, icon => {
        icon.visible = Audio[sorm(type)] === stream;
      }),
    ],
  }),
});

const SettingsButton = (tab = 0) => Widget.Button({
  on_clicked: () => Utils.execAsync(`pavucontrol -t ${tab}`)
    .catch(logError),
  child: Widget.Icon(icons.settings),
});

export const SinkSelector = (type = "sink") => Menu({
  title: type + " Selector",
  icon: type === "sink" ? icons.audio.type.headset : icons.audio.mic.unmuted,
  content: Widget.Box({
    class_name: "sink-selector",
    vertical: true,
    children: [
      Widget.Box({vertical: true})
        .hook(Audio, box => {
          box.children = Array.from(Audio[sorms(type)].values()).map(SinkItem(type));
        }, "stream-added")
        .hook(Audio, box => {
          box.children = Array.from(Audio[sorms(type)].values()).map(SinkItem(type));
        }, "stream-removed")
    ],
  }),
  headerChild: SettingsButton(type === "sink" ? 3 : 4),
});

const AudioContent = () => Widget.Box({
  class_name: "spacing-5",
  vertical: true,
  children: [
    Widget.Box({
      vertical: true,
      children: [
        Volume("sink"),
        Volume("source"),
      ]
    })
  ]
});


export default AudioContent;

