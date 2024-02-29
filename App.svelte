<script lang="ts">
  import { App } from "$types/app";
  import Light from "./Components/Light.svelte";
  import Stats from "./Components/Stats.svelte";
  import "./css/main.css";
  import { Runtime } from "./ts/runtime";

  export let app: App;
  export let runtime: Runtime;

  const { Grid, Transitioning } = runtime;
</script>

<Stats {app} {runtime} />
<div class="grid" class:transitioning={$Transitioning}>
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

  div.grid.transitioning {
    opacity: 0 !important;
  }
</style>
