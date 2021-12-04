<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      data: Array.from({ length: 100 }, (_, i) => `src/assets/logo.png?t=${i}`),
    };
  },
  methods: {
    onChange() {
      this.data = Array.from(
        { length: 50 },
        (_, i) => `src/assets/demo.jpg?t=${i}`
      );
    },
  },
});
</script>
<template>
  <img alt="Vue logo" v-lazy="item" v-for="item in data" :key="item" />
  <button class="btn" @click="onChange">change</button>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.btn {
  position: fixed;
  right: 10px;
  top: 10px;
}
img {
  width: 400px;
  height: 400px;
}
</style>
