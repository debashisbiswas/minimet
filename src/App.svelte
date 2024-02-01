<script lang="ts">
  import { fade } from "svelte/transition";
  import * as Tone from "tone";
  import Button from "./lib/Button.svelte";
  import Pause from "./lib/icons/Pause.svelte";
  import Play from "./lib/icons/Play.svelte";

  const flashTime = 100;
  let playing = false;
  let flash = false;
  Tone.Transport.bpm.value = 80;

  const noteLength = 0.01;
  const tickPromise = Tone.Offline(() => {
    const time = Tone.now();
    const gain = new Tone.Gain(16).toDestination();
    const osc = new Tone.Oscillator(783.99).connect(gain);

    gain.gain.linearRampToValueAtTime(0, time + noteLength);

    osc.start(time).stop(time + noteLength * 2);
  }, noteLength);

  async function togglePlaying() {
    await Tone.start();

    if (!playing) {
      const player = new Tone.Player(await tickPromise).toDestination();

      Tone.Transport.scheduleRepeat((time) => {
        player.start(time);

        Tone.Draw.schedule(function () {
          flash = true;
        }, time);

        Tone.Draw.schedule(
          function () {
            flash = false;
          },
          time + flashTime / 1000,
        );
      }, "4n");
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
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
      {#if flash}
        <div
          out:fade={{ duration: flashTime }}
          class="absolute -inset-1 rounded-full bg-teal-300 blur"
        ></div>
      {/if}
      <div
        class="h-6 w-6 rounded-full transition"
        class:bg-teal-900={!playing}
        class:bg-teal-500={playing}
      ></div>
    </div>
  </div>

  <p class="mb-4 text-6xl">
    {Math.round(Tone.Transport.bpm.value)}<span
      class="ml-2 text-xl text-slate-400">bpm</span
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
