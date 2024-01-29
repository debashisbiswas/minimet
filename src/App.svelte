<script lang="ts">
  import * as Tone from "tone";
  import Button from "./lib/Button.svelte";
  import Pause from "./lib/icons/Pause.svelte";
  import Play from "./lib/icons/Play.svelte";

  let playing = false;
  let scheduleId = 0;
  Tone.Transport.bpm.value = 80;

  const player = new Tone.Player("./asrx_down.wav").toDestination();
  async function togglePlaying() {
    await Tone.start();
    Tone.Transport.start();

    if (!playing) {
      scheduleId = Tone.Transport.scheduleRepeat(
        (time) => {
          // Ensure time is passed into this function, or the click timing won't be consistent
          player.start(time);
        },
        "4n",
        Tone.now(),
      );
    } else {
      Tone.Transport.clear(scheduleId);
      scheduleId = 0;
    }

    playing = !playing;
  }

  async function updateTempo(updateFn: (currentTempo: number) => number) {
    Tone.Transport.bpm.value = Math.round(updateFn(Tone.Transport.bpm.value));
  }
</script>

<main>
  <p class="text-5xl mb-4">
    {Math.round(Tone.Transport.bpm.value)}<span
      class="text-lg text-slate-400 ml-2">bpm</span
    >
  </p>

  <div class="mb-2 grid grid-cols-2 gap-3">
    <Button on:click={() => updateTempo((tempo) => tempo - 1)}>-</Button>
    <Button on:click={() => updateTempo((tempo) => tempo + 1)}>+</Button>
    <Button on:click={() => updateTempo((tempo) => tempo - 5)}>-5</Button>
    <Button on:click={() => updateTempo((tempo) => tempo + 5)}>+5</Button>

    <div class="col-span-2">
      <Button on:click={togglePlaying}>
        {#if playing}
          <Pause />
        {:else}
          <Play />
        {/if}
      </Button>
    </div>
  </div>
</main>
