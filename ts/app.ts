import { SafeMode } from "$state/Desktop/ts/store";
import { LightsOffIcon } from "$ts/images/apps";
import { HelpArticles } from "$ts/stores/articles";
import { App } from "$types/app";
import AppSvelte from "../App.svelte";
import { Runtime } from "./runtime";

export const LightsOff: App = {
  metadata: {
    name: "Lights Off",
    description: "Turn off all the lights!",
    version: "1.0.0",
    author: "Tim Horton, ported to ArcOS by IzKuipers",
    icon: LightsOffIcon,
    appGroup: "entertainment",
  },
  runtime: Runtime,
  content: AppSvelte,
  id: "LightsOff",
  size: { w: 442, h: NaN },
  pos: { x: 80, y: 80 },
  minSize: { w: 442, h: NaN },
  maxSize: { w: 442, h: NaN },
  state: {
    minimized: false,
    maximized: false,
    headless: false,
    fullscreen: false,
    resizable: false,
  },
  controls: {
    minimize: true,
    maximize: false,
    close: true,
  },
  glass: true,
  singleInstance: true,
  loadCondition: () => !SafeMode.get(),
  helpArticle: HelpArticles.lightsOff,
};
