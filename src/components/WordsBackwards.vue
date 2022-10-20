<template>
  <h1>{{ $t('wordsbackwards.title') }}</h1>
  <p>
    {{ $t('wordsbackwards.instructions_1') }}<br />
    {{ $t('wordsbackwards.instructions_2') }}<br />
    {{ $t('wordsbackwards.instructions_3') }}<br />
    {{ $t('wordsbackwards.instructions_4') }}<br />
  </p>

  <form class="row g-1">
    <div class="col-md-6">
      <label
        for="rounds"
        class="col-form-label"
      >{{ $t('wordsbackwards.rounds') }}</label>

      <input
        id="rounds"
        v-model="rounds"
        type="number"
        class="form-control"
      />
    </div>
    <div class="col-md-6">
      <label
        for="max_characters"
        class="col-form-label"
      >{{ $t('wordsbackwards.max_characters') }}</label>
      <input
        id="max_characters"
        v-model="max_characters"
        type="number"
        min="4"
        class="form-control"
      />
    </div>

    <!--    <div class="col-md-6">-->
    <!--      <label-->
    <!--        for="numbers_per_term"-->
    <!--        class="col-form-label"-->
    <!--      >{{ $t('wordsbackwards.time_per_word') }}</label>-->
    <!--      <input-->
    <!--        id="time_per_word"-->
    <!--        v-model="time_per_word"-->
    <!--        type="number"-->
    <!--        class="form-control"-->
    <!--      />-->
    <!--    </div>-->

    <br />
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
        {{ $t('wordsbackwards.show_remaining') }}
      </label>
    </div>
    <div class="form-check form-switch">
      <input
        id="checkCheckCase"
        v-model="checkCase"
        class="form-check-input"
        type="checkbox"
      />
      <label
        class="form-check-label"
        for="checkCheckCase"
      >
        {{ $t('wordsbackwards.check_case') }}
      </label>
    </div>

    <div class="col-md-4">
      <button
        type="button"
        class="btn w-100"
        :class="startTime===0?'btn-primary':'btn-secondary'"
        :disabled="gameStarting"
        @click="startStop"
      >
        {{ startTime === 0 ? $t('wordsbackwards.start') : $t('wordsbackwards.stop') }}
      </button>
    </div>
  </form>

  <div class="row g-1">
    <div class="text-center">
      <span
        v-if="showRemaining"
        class="remaining-rounds"
      >{{ rounds - currentRound }} {{ $t('wordsbackwards.remaining') }}</span>
    </div>
    <div class="col-1 col-md-3 col-lg-4" />
    <div class="col-10 col-md-6 col-lg-4 game-plane">
      <div
        v-if="startTime !==0"
        ref="terms"
      >
        {{ words[currentRound] }} = <input
          ref="input"
          v-model="solution"
          type="text"
          @keyup.enter="nextRound"
        />
        <button
          type="button"
          class="btn btn-primary w-100"
          @click="nextRound"
        >
          {{ $t('wordsbackwards.next') }}
        </button>
      </div>
      <div v-if="startTime===0">
        {{ $t('ctweber.start_in', { time: startCountdown / 1000 }) }}
      </div>
    </div>
    <div class="col-1 col-md-3 col-lg-4" />
    <div
      id="history"
      class="col-12 text-center"
    >
      <span>{{ $t('wordsbackwards.historical_score') }}:</span><br />
      <span
        v-for="(historical_score, index) in historical_scores.slice().reverse()"
        :key="index"
      >{{ $t('wordsbackwards.score') }}: {{ getScoreFraction(historical_score.score, historical_score.words, historical_score.time) }}<br /></span>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {allwords} from "@/assets/text/wordlist_de";

export default defineComponent({
  data() {
    return {
      score: 0, // current/total correct answers
      historical_scores: [] as { "score": number, "words": number, "time": number }[], // history of scores
      max_characters: 9, // how many characters are word can have at the most
      time_per_word: 1500, // how long to show the word
      rounds: 10, // how many words to show per game
      words: [] as string[],
      solution: "",
      currentRound: 0, // counting how many images have been shown in this game already
      startTime: 0, // time when a game starts
      endTime: 0, // time when a game ends
      startCountdown: 1000, // how many seconds between clicking "Start" and the first image
      gameStarting: false, // during the startCountdown
      showRemaining: true, // if the player wants to see how many more rounds are to be played this game
      checkCase: true, // if the player wants the spell check to be case-sensitive
    };
  },
  computed: {
    elapsedTime(): number {
      return Number((this.endTime - this.startTime)/1000);
    }
  },
  unmounted: function () {
    this.stop();
  },
  methods: {
    getRandomWords(arr: string[]): string[] {
      return [...arr]
          .filter(word => word.length <= this.max_characters)
          .sort(() => 0.5 - Math.random())
          .slice(0, this.rounds);
    },
    nextRound() {
      let actual_solution = [...this.words[this.currentRound]].reverse().join("");

      if(!this.checkCase) {
        actual_solution = actual_solution.toLowerCase();
        this.solution = this.solution.toLowerCase();
      }
      if(actual_solution === this.solution) this.score++;

      if (this.currentRound >= this.rounds-1) {
        this.stop();
      } else {
        this.currentRound++;
        this.solution = "";
        this.focusInput();
      }
    },
    startStop() {
      if (this.startTime === 0) {
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
      this.words = this.getRandomWords(allwords);
      this.solution = "";
      this.startTime = performance.now();
    },
    stop() {
      this.endTime = performance.now();
      this.historical_scores.push({"score": this.score, "words": this.rounds, "time": this.elapsedTime})
      this.startTime = 0;
      this.endTime = 0;
      this.startCountdown = 1000;

    },
    focusInput() {
      this.$nextTick(() => {
        (this.$refs.input as HTMLElement).focus()
      });
    },
    getScoreFraction(score: number, rounds: number, time: number): string {
      return `${score} (${(score / rounds * 100).toFixed(2)}%) in ${time.toFixed(2)}s`;
    }
  }
});
</script>

<style scoped lang="scss">
.game-plane {
  min-height: 210px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
