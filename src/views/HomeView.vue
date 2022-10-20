<template>
  <div class="about">
    <h1>This is an about page</h1>
    <HelloWorld msg="Test" />
  </div>
</template>

<script>
import HelloWorld from "@/components/HomePage.vue";
export default {
  components: {HelloWorld}
}
</script>