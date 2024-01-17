<script lang="ts">
  import { onMount } from "svelte";
  import { Runtime } from "../ts/runtime";
  import { App } from "$types/app";
  import { UserDataStore } from "$ts/stores/user";

  export let app: App;
  export let runtime: Runtime;

  let level = 0;
  let clicks = 0;

  onMount(() => {
    runtime.LEVEL.subscribe((v) => (level = v));
    runtime.Clicks.subscribe((v) => (clicks = v));
  });

  function reset() {
    $UserDataStore.appdata[app.id] = null;

    runtime.loadData();
  }
</script>

<div class="statistics">
  <button class="reset-game" on:click={reset}>Reset</button>
  <div class="right">
    <div class="stat">Level {level + 1}</div>
    <div class="stat">{clicks} Click{clicks == 1 ? "" : "s"}</div>
  </div>
</div>

<style scoped>
  div.statistics {
    border-bottom: var(--accent) 1px solid;
    margin-bottom: 10px;
    padding: 20px;
    display: flex;
    align-items: center;
  }

  button {
    margin: 0;
  }

  div.statistics div.right {
    background-color: var(--button-glass-bg);
    height: 30px;
    margin-left: auto;
    display: flex;
    gap: 10px;
    border: var(--button-glass-bg) 1px solid;
    padding: 0 10px;
    border-radius: 7.5px;
  }

  div.statistics div.right div.stat {
    line-height: 28px;
  }
  div.statistics div.right div.stat + div.stat {
    border-left: var(--button-glass-bg) 1px solid;
    padding-left: 10px;
  }
</style>
