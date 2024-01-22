<script lang="ts">
  import { onMount } from "svelte";
  import { Runtime } from "./ts/runtime";
  import { App } from "$types/app";
  import { LightsOffGrid } from "./ts/types";
  import Stats from "./Components/Stats.svelte";
  import Light from "./Components/Light.svelte";
  import "./css/main.css";

  export let app: App;
  export let runtime: Runtime;

  const { Grid } = runtime;
</script>

<Stats {app} {runtime} />
<div class="grid">
  {#each $Grid as row, y}
    {#each row as light, x}
      <Light {light} {x} {y} {runtime} />
    {/each}
  {/each}
</div>

<style scoped>
  div.grid {
    display: grid;
    grid-template-columns: repeat(5, 80px);
    grid-template-rows: repeat(5, 80px);
    grid-gap: 5px;
    margin: 10px;
  }
</style>
