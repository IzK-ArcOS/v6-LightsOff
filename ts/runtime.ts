import { AppRuntime } from "$ts/apps/runtime";
import { LightsOffIcon } from "$ts/images/apps";
import { Process } from "$ts/process";
import { createErrorDialog } from "$ts/process/error";
import { UserDataStore } from "$ts/stores/user";
import { Store } from "$ts/writable";
import type { App, AppMutator } from "$types/app";
import { LogLevel } from "$types/console";
import { ReadableStore } from "$types/writable";
import { LightsOffLevels } from "./levels";
import { LightsOffGrid } from "./types";

export class Runtime extends AppRuntime {
  xModifiers = [-1, 0, +1];
  yModifiers = [-1, +1];
  Grid: ReadableStore<LightsOffGrid> = Store([
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
  ]);
  Clicks = Store<number>(0);
  LEVEL = Store<number>(0);
  Levels: LightsOffLevels;

  constructor(app: App, mutator: AppMutator, process: Process) {
    super(app, mutator, process);

    this.Levels = new LightsOffLevels(this);

    this.Grid.subscribe((v) => {
      if (!v) return;

      this.Levels.checkNextLevel();
      this.saveData();
    });
    this.LEVEL.subscribe(() => this.saveData());
    this.Clicks.subscribe(() => this.saveData());

    this.loadData();
  }


  containsLights() {
    this.Log("Checking lights", "containsLights");
    return JSON.stringify(this.Grid.get()).includes("true");
  }

  finish() {
    this.Log("User has won! Finishing...", "finish");

    this.LEVEL.set(0);
    this.Clicks.set(0);
    this.Levels.loadLevel(this.LEVEL.get());

    createErrorDialog(
      {
        title: "You Win!",
        message:
          "You've managed to complete all 8 levels of Lights Off. The game will be reset so you can play it again in the future.",
        buttons: [{ caption: "Play again", action() { }, suggested: true }],
        image: LightsOffIcon,
      },
      this.pid, true
    );
  }

  ToggleLight(x: number, y: number) {
    this.Log(`Toggling ${x}x${y}`, "ToggleLight");

    const grid = this.Grid.get();

    if (!grid[y]) throw new Error(`y doesn't exist ${y}`);
    if (typeof grid[y][x] !== "boolean")
      throw new Error(`x doesn't exist ${y} ${x}`);

    this.Clicks.set(this.Clicks.get() + 1);

    for (let i = 0; i < this.xModifiers.length; i++) {
      const value = grid[y][x + this.xModifiers[i]];

      if (typeof value !== "boolean") continue;

      grid[y][x + this.xModifiers[i]] = !value;
    }

    for (let i = 0; i < this.yModifiers.length; i++) {
      const rowExists = Array.isArray(grid[y + this.yModifiers[i]]);

      if (!rowExists) continue;
      const value = grid[y + this.yModifiers[i]][x];

      if (typeof value !== "boolean") continue;

      grid[y + this.yModifiers[i]][x] = !value;
    }

    this.Grid.set(grid);
  }

  loadData() {
    this.Log("Loading Data from UserData", "loadData");

    const data = UserDataStore.get().appdata[this.app.id];

    if (data) {
      this.Levels.loadLevel(data.level as number);
      this.Grid.set(data.grid as LightsOffGrid);
      this.Clicks.set(data.clicks as number);

      return;
    }

    this.Levels.loadLevel(0);
  }

  saveData() {
    if (this.LEVEL.get() == 0 && !this.containsLights())
      return this.Log("Not saving default state!", "saveData", LogLevel.warn);

    UserDataStore.update((udata) => {
      udata.appdata[this.app.id] = {
        clicks: this.Clicks.get(),
        level: this.LEVEL.get(),
        grid: this.Grid.get(),
      };

      return udata;
    });
  }
}