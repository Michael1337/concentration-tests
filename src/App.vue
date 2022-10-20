<template>
  <header>
    <div class="wrapper">
      <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container-fluid">
          <a
            class="navbar-brand"
            href="#"
          >{{ $t("general.navbar.name") }}</a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon" />
          </button>
          <div
            id="navbarNav"
            class="collapse navbar-collapse"
          >
            <ul class="navbar-nav me-auto">
              <li
                v-for="route in allRoutes"
                :key="route.path"
                class="nav-item"
              >
                <RouterLink
                  class="nav-link"
                  :class="{'active':currentRoute===route.path}"
                  :aria-current="(currentRoute===route.path)?'page':null"
                  :to="route.path"
                >
                  {{ $t(`general.navbar['${route.key}']`) }}
                </RouterLink>
              </li>
            </ul>

            <LocaleChanger />
          </div>
        </div>
      </nav>
    </div>
  </header>
  <RouterView class="container-fluid" />
</template>

<script setup lang="ts">
import {computed, reactive} from 'vue';
import {useRoute} from "vue-router";
import LocaleChanger from "@/components/LocaleChanger.vue";

const allRoutes: { path: string, key: string }[] = reactive([
  {"path": "/", "key": "home"},
  {"path": "/ctweber", "key": "ctweber"},
  {"path": "/simplemaths", "key": "simplemaths"},
  {"path": "/wordsbackwards", "key": "wordsbackwards"},
]);
const currentRoute = computed(() => useRoute().path)

</script>

<style scoped>
body {
  background-color: gray;
  color: white;
}
</style>
