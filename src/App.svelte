<script lang="ts">
  import * as Tone from "tone";
  import Button from "./lib/Button.svelte";
  import Pause from "./lib/icons/Pause.svelte";
  import Play from "./lib/icons/Play.svelte";

  let flashDiv: HTMLDivElement;
  let playing = false;
  let scheduleId = 0;
  Tone.Transport.bpm.value = 80;

  async function togglePlaying() {
    await Tone.start();
    Tone.Transport.start();

    if (!playing) {
      scheduleId = Tone.Transport.scheduleRepeat((time) => {
        const noteLength = 0.015;

        const gain = new Tone.Gain(16).toDestination();
        const osc = new Tone.Oscillator(783.99).connect(gain);
        gain.gain.linearRampToValueAtTime(0, time + noteLength);

        osc.start(time);
        osc.stop(time + noteLength);

        flashDiv.classList.add("flash");
        setTimeout(() => {
          flashDiv.classList.remove("flash");
        }, 100);
      }, "4n");
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
  <div class="mb-4 flex justify-center">
    <div class="relative">
      <div
        class="absolute -inset-1 rounded-full bg-teal-300 opacity-0 blur transition ease-out"
        bind:this={flashDiv}
      ></div>
      <div
        class="h-6 w-6 rounded-full transition"
        class:bg-teal-600={playing}
      ></div>
    </div>
  </div>

  <p class="mb-4 text-5xl">
    {Math.round(Tone.Transport.bpm.value)}<span
      class="ml-2 text-lg text-slate-400">bpm</span
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

<style lang="postcss">
  :global(.flash) {
    @apply opacity-100;
  }
</style>
