<script lang="ts">
  import * as Tone from "tone";
  let currentTempo = 60;
  let playing = false;

  let osc: Tone.Oscillator;

  function handleClick() {
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
  <h1>MiniMet</h1>

  <input type="number" bind:value={currentTempo} size="3" />

  <button on:click={handleClick}>
    {#if playing}
      Pause
    {:else}
      Play
    {/if}
  </button>
</main>

<style>
  input {
    font-size: 2.5rem;
    display: block;
    text-align: center;
    padding: 0.25rem;
    margin-bottom: 1rem;
    width: 10ch;
  }
</style>
