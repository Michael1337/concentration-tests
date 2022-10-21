<template>
  <h1>{{ $t('ctweber.title') }}</h1>
  <p>
    {{ $t('ctweber.instructions_1') }}<br />
    {{ $t('ctweber.instructions_2') }}<br />
    {{ $t('ctweber.instructions_3') }}<br />
    {{ $t('ctweber.instructions_4') }}<br />
    {{ $t('ctweber.instructions_5') }}<br />
  </p>

  <form class="row g-1">
    <div class="col-md-4">
      <label
        for="inputRounds"
        class="col-form-label"
      >{{ $t('ctweber.rounds') }}</label>

      <input
        id="inputRounds"
        v-model="rounds"
        type="number"
        class="form-control"
      />
    </div>
    <div class="col-md-8">
      <label
        for="inputTime"
        class="col-form-label"
      >{{ $t('ctweber.time_between_rounds') }}</label>
      <input
        id="inputTime"
        v-model="timeBetweenRounds"
        type="number"
        step="10"
        class="form-control"
      />
    </div>
    <span>{{ $t('ctweber.total_time', {seconds: totalTime}) }}</span>


    <br />
    <div class="form-check form-switch">
      <input
        id="checkShowImages"
        v-model="showImages"
        class="form-check-input"
        type="checkbox"
      />
      <label
        class="form-check-label"
        for="checkShowImages"
      >
        {{ $t('ctweber.show_images') }}
      </label>
    </div>
    <div class="form-check form-switch">
      <input
        id="checkPlaySound"
        v-model="playSound"
        class="form-check-input"
        type="checkbox"
      />
      <label
        class="form-check-label"
        for="checkPlaySound"
      >
        {{ $t('ctweber.play_audio') }}
      </label>
    </div>
    <div class="form-check form-switch">
      <input
        id="checkShowRemaining"
        v-model="showRemaining"
        class="form-check-input"
        type="checkbox"
      />
      <label
        class="form-check-label"
        for="checkShowRemaining"
      >
        {{ $t('ctweber.show_remaining') }}
      </label>
    </div>

    <div class="col-md-4">
      <button
        type="button"
        class="btn w-100"
        :class="interval===0?'btn-primary':'btn-secondary'"
        :disabled="gameStarting"
        @click="startStop"
      >
        {{ interval === 0 ? $t('ctweber.start') : $t('ctweber.stop') }}
      </button>
    </div>
  </form>

  <div class="row g-1">
    <div class="text-center">
      <span>{{ $t('ctweber.score') }}: {{ getScoreFraction(score, rounds) }}</span><br />
      <span
        v-if="showRemaining"
        class="remaining-rounds"
      >{{ rounds - currentRound }} {{ $t('ctweber.remaining') }}</span>
    </div>
    <div class="col-1 col-md-3 col-lg-4 icon-col icon-col--left">
      1
      <img
        v-if="showImages"
        src="../assets/img/ctweber/1/p1.gif"
        :alt="$t('ctweber.symbol')"
      />
      <img
        v-if="showImages"
        src="../assets/img/ctweber/1/p2.gif"
        :alt="$t('ctweber.symbol')"
      />
      <img
        v-if="showImages"
        src="../assets/img/ctweber/1/p3.gif"
        :alt="$t('ctweber.symbol')"
      />
      <img
        v-if="showImages"
        src="../assets/img/ctweber/1/p4.gif"
        :alt="$t('ctweber.symbol')"
      />
      <img
        v-if="showImages"
        src="../assets/img/ctweber/1/p5.gif"
        :alt="$t('ctweber.symbol')"
      />
    </div>
    <div class="col-10 col-md-6 col-lg-4 icon-main game-plane">
      <img
        v-if="!currentVoted && interval!==0"
        :src="current_image_url"
        :alt="$t('ctweber.current_symbol')"
      />
      <div v-if="interval===0">
        {{ $t('ctweber.start_in', {time: startCountdown / 1000}) }}
      </div>
    </div>
    <div class="col-1 col-md-3 col-lg-4 icon-col icon-col--right">
      0
      <img
        v-if="showImages"
        src="../assets/img/ctweber/0/p1.gif"
        :alt="$t('ctweber.symbol')"
      />
      <img
        v-if="showImages"
        src="../assets/img/ctweber/0/p2.gif"
        :alt="$t('ctweber.symbol')"
      />
      <img
        v-if="showImages"
        src="../assets/img/ctweber/0/p3.gif"
        :alt="$t('ctweber.symbol')"
      />
      <img
        v-if="showImages"
        src="../assets/img/ctweber/0/p4.gif"
        :alt="$t('ctweber.symbol')"
      />
      <img
        v-if="showImages"
        src="../assets/img/ctweber/0/p5.gif"
        :alt="$t('ctweber.symbol')"
      />
    </div>
    <div
      id="history"
      class="col-12 text-center"
    >
      <span>{{ $t('ctweber.historical_score') }}:</span><br />
      <span
        v-for="(historical_score, index) in historical_scores.slice().reverse()"
        :key="index"
      >{{ $t('ctweber.score') }}: {{ getScoreFraction(historical_score.score, historical_score.rounds) }}<br /></span>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  data() {
    return {
      score: 0, // current/total correct answers
      rounds: 150, // how many images are shown for one game
      timeBetweenRounds: 750, // milliseconds before a new image is shown
      historical_scores: [] as { "score": number, "rounds": number }[], // history of scores
      currentRound: 0, // counting how many images have been shown in this game already
      currentSide: -1, // 0 or 1
      currentImage: -1, // 1 through 5
      currentVoted: false, // if the player has already made a guess
      interval: 0, // the setInterval to generate new images during a game
      startCountdown: 3000, // how many seconds between clicking "Start" and the first iamge
      gameStarting: false, // during the startCountdown
      showImages: true, // if the player wants to see all images at the side of the game plane
      playSound: true, // if the player wants to get audio feedback
      showRemaining: true, // if the player wants to see how many more rounds are to be played this game
      correctSound: new Audio(new URL('/src/assets/sound/ctweber/correct.ogg', import.meta.url).href),
      incorrectSound: new Audio(new URL('/src/assets/sound/ctweber/incorrect.ogg', import.meta.url).href),
    };
  },
  computed: {
    totalTime(): number {
      return Number(this.rounds * this.timeBetweenRounds) / 1000;
    },
    current_image_url(): string {
      return new URL(`/src/assets/img/ctweber/${this.currentSide}/p${this.currentImage}.gif`, import.meta.url).href;
    }
  },
  unmounted: function () {
    this.stop();
  },
  methods: {
    handleKeyEvent(event: { key: any; }) {
      const key = Number(event.key);
      if (this.currentVoted || (key !== 1 && key !== 0)) return;

      this.currentVoted = true;
      const correct = this.isCorrectKeyPressed(key);
      if (correct) this.score++;

      if (this.playSound) {

        // const correctSound = new Audio('@/assets/sound/ctweber/correct.ogg');
        // const incorrectSound = new Audio('@/assets/sound/ctweber/incorrect.ogg');
        correct ? this.correctSound.play() : this.incorrectSound.play();
      }
    },
    isCorrectKeyPressed(key: number): boolean {
      return key === this.currentSide;
    },
    nextRound() {
      this.currentVoted = false;
      this.currentSide = Math.round(Math.random());
      this.currentImage = Math.floor(Math.random() * 5) + 1;
      if (this.currentRound >= this.rounds) {
        this.stop();
      } else {
        this.currentRound++;
      }
    },
    startStop() {
      if (this.interval === 0) {
        this.countdownToStart();
      } else {
        this.stop();
      }
    },
    countdownToStart() {
      this.gameStarting = true;
      const startCountdownTimer = setInterval(() => {
        if (this.startCountdown <= 0) {
          clearInterval(startCountdownTimer);
          this.gameStarting = false;
          this.start();
        }
        this.startCountdown -= 100;
      }, 100);
    },
    start() {
      this.currentRound = 0;
      this.score = 0;
      window.addEventListener('keydown', this.handleKeyEvent);
      this.nextRound();
      this.interval = setInterval(this.nextRound, this.timeBetweenRounds);
    },
    stop() {
      window.removeEventListener('keydown', this.handleKeyEvent);
      clearInterval(this.interval);
      this.interval = 0;
      this.startCountdown = 3000;
      this.currentSide = -1;
      this.currentImage = -1;
      this.historical_scores.push({"score": this.score, "rounds": this.rounds})

    },
    getScoreFraction(score: number, rounds: number): string {
      return `${score} (${(score / rounds * 100).toFixed(2)}%)`;
    }
  }
});
</script>

<style scoped lang="scss">
.game-plane {
  min-height: 210px;
}

.icon-col {
  > img {
    display: block;
  }

  &--left {
    text-align: right;

    > img {
      margin-left: auto;
    }
  }

  &--right {
    text-align: left;

    > img {
      margin-right: auto;
    }
  }
}

.icon-main {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
