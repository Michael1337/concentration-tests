<template>
  <div class="locale-changer d-flex">
    <select
      v-model="$i18n.locale"
      class="form-select bg-dark text-white"
    >
      <option
        v-for="locale in $i18n.availableLocales"
        :key="`locale-${locale}`"
        :value="locale"
      >
        {{ locale }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "LocaleChanger"
}
</script>