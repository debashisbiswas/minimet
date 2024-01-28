<script lang="ts">
  import * as Tone from "tone";
  import Button from "./lib/Button.svelte";

  let currentTempo = 60;
  let playing = false;

  let osc: Tone.Oscillator;

  function togglePlaying() {
    if (!osc) {
      osc = new Tone.Oscillator().toDestination();
    }

    if (!playing) {
      // repeated event every 8th note
      Tone.Transport.scheduleRepeat((time) => {
        // use the callback time to schedule events
        osc.start(time).stop(time + 0.1);
      }, "4n");
      // transport must be started before it starts invoking events
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
    }

    playing = !playing;
  }

  $: Tone.Transport.bpm.value = currentTempo;
</script>

<main>
  <p class="text-5xl mb-4">
    {currentTempo}<span class="text-lg text-slate-400 ml-2">bpm</span>
  </p>

  <div class="mb-2">
    <Button on:click={() => (currentTempo -= 5)}>-5</Button>
    <Button on:click={() => currentTempo--}>-</Button>
    <Button on:click={() => currentTempo++}>+</Button>
    <Button on:click={() => (currentTempo += 5)}>+5</Button>
  </div>

  <Button on:click={togglePlaying}>
    {#if playing}
      Pause
    {:else}
      Play
    {/if}
  </Button>
</main>
