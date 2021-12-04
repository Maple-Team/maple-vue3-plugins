import { createApp } from "vue";
import App from "./App.vue";
import LazyPlugin from "./plugins/lazy-plugin";
// import LazyPlugin from "vue3-lazy";
createApp(App).use(LazyPlugin, {}).mount("#app");
