<template>
  <h1>{{ $t('simplemaths.title') }}</h1>
  <p>
    {{ $t('simplemaths.instructions_1') }}<br />
    {{ $t('simplemaths.instructions_2') }}<br />
    {{ $t('simplemaths.instructions_3') }}<br />
    {{ $t('simplemaths.instructions_4') }}<br />
  </p>

  <form class="row g-1">
    <div class="col-md-6">
      <label
        for="rounds"
        class="col-form-label"
      >{{ $t('simplemaths.rounds') }}</label>

      <input
        id="rounds"
        v-model="rounds"
        type="number"
        class="form-control"
      />
    </div>
    <div class="col-md-6">
      <label
        for="terms_per_round"
        class="col-form-label"
      >{{ $t('simplemaths.terms_per_round') }}</label>
      <input
        id="terms_per_round"
        v-model="terms_per_round"
        type="number"
        class="form-control"
      />
    </div>
    <span>{{ $t('simplemaths.total_terms', {terms: totalTerms}) }}</span>

    <div class="col-md-6">
      <label
        for="numbers_per_term"
        class="col-form-label"
      >{{ $t('simplemaths.numbers_per_term') }}</label>
      <input
        id="numbers_per_term"
        v-model="numbers_per_term"
        type="number"
        class="form-control"
      />
    </div>
    <div class="col-md-6">
      <label
        for="highest_number"
        class="col-form-label"
      >{{ $t('simplemaths.highest_number') }}</label>
      <input
        id="highest_number"
        v-model="highest_number"
        type="number"
        class="form-control"
      />
    </div>

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
        {{ $t('simplemaths.show_remaining') }}
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
        {{ startTime === 0 ? $t('simplemaths.start') : $t('simplemaths.stop') }}
      </button>
    </div>
  </form>

  <div class="row g-1">
    <div class="text-center">
      <span
        v-if="showRemaining"
        class="remaining-rounds"
      >{{ rounds - currentRound }} {{ $t('simplemaths.remaining') }}</span>
    </div>
    <div class="col-1 col-md-3 col-lg-4" />
    <div class="col-10 col-md-6 col-lg-4 game-plane">
      <div
        v-if="startTime !==0"
        ref="terms"
      >
        <div
          v-for="(term, index) in all_terms[currentRound-1]"
          :key="index"
        >
          {{ term.join(" + ") }} = <input
            :ref="'input_'+index"
            v-model="solutions[currentRound-1][index]"
            type="number"
          />
        </div>
        <button
          type="button"
          class="btn btn-primary w-100"
          @click="nextRound"
        >
          {{ $t('simplemaths.next') }}
        </button>
      </div>
      <div v-if="startTime===0">
        {{ $t('simplemaths.start_in', { time: startCountdown / 1000 }) }}
      </div>
    </div>
    <div class="col-1 col-md-3 col-lg-4" />
    <div
      id="history"
      class="col-12 text-center"
    >
      <span>{{ $t('simplemaths.historical_score') }}:</span><br />
      <span
        v-for="(historical_score, index) in historical_scores.slice().reverse()"
        :key="index"
      >{{ $t('simplemaths.score') }}: {{ getScoreFraction(historical_score.score, historical_score.terms, historical_score.time) }}<br /></span>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  data() {
    return {
      score: 0, // current/total correct answers
      historical_scores: [] as { "score": number, "terms": number, "time": number }[], // history of scores
      highest_number: 9,
      numbers_per_term: 6, // how many numbers are to be calculated per term
      terms_per_round: 5, // how many terms are shown at the same time
      rounds: 3, // how many sets of terms are done in one game
      all_terms: [] as number[][][], // rounds having terms having numbers
      solutions: [] as number[][],
      currentRound: 0, // counting how many images have been shown in this game already
      startTime: 0, // time when a game starts
      endTime: 0, // time when a game ends
      startCountdown: 1000, // how many seconds between clicking "Start" and the first iamge
      gameStarting: false, // during the startCountdown
      showRemaining: true, // if the player wants to see how many more rounds are to be played this game
    };
  },
  computed: {
    totalTerms(): number {
      return Number(this.rounds * this.terms_per_round);
    },
    elapsedTime(): number {
      return Number((this.endTime - this.startTime)/1000);
    }
  },
  unmounted: function () {
    this.stop();
  },
  methods: {
    generateTerm(): number[] {
      let term: number[] = [];
      for (let i = 0; i < this.numbers_per_term; i++) {
        term.push(Math.floor(Math.random()*this.highest_number)+1);
      }
      return term;
    },
    generateRound():number[][] {
      let round: number[][] = [];
      for (let i = 0; i < this.terms_per_round; i++) {
        round.push(this.generateTerm())
      }
      return round;
    },
    nextRound() {
      if (this.currentRound >= this.rounds) {
        this.stop();
      } else {
        this.currentRound++;
        this.focusTopInput();
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
      this.all_terms = [];
      this.solutions = [];
      this.startTime = performance.now();
      for (let i = 0; i < this.rounds; i++) {
        this.all_terms.push(this.generateRound())
        this.solutions.push([])
      }
      this.nextRound();
    },
    stop() {
      this.endTime = performance.now();
      this.checkSolutions();
      this.historical_scores.push({"score": this.score, "terms": this.totalTerms, "time": this.elapsedTime})
      this.startTime = 0;
      this.endTime = 0;
      this.startCountdown = 1000;

    },
    focusTopInput() {
      this.$nextTick(() => {
        const allInputs = (this.$refs.terms as HTMLElement)?.children?.item(0) || null;
        if(allInputs != null) {
          (allInputs.getElementsByTagName("input")[0] as HTMLElement).focus()
        }
      });
    },
    checkSolutions() {
      this.all_terms.forEach((round, r_index) => {
        round.forEach((term, t_index) => {
          const actual = term.reduce(
              (previousValue, currentValue) => previousValue + currentValue,
              0
          );
          if(this.solutions[r_index][t_index] === actual) this.score++;
        })
      })
    },
    getScoreFraction(score: number, terms: number, time: number): string {
      return `${score} (${(score / terms * 100).toFixed(2)}%) in ${time.toFixed(2)}s`;
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
