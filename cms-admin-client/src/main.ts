import { createApp } from "vue";
import "./styles/index.scss";
import App from "./App.vue";
import router from "./router";
import { vuetify } from "@/plugins/vuetify";
import { vuetifyProTipTap } from "@/plugins/tiptap";
import pinia from "@/store";
import { usePermissionsDirective } from "@/directives/permission";
import "unfonts.css";

//init app
const app = createApp(App);
app.use(vuetify);
app.use(vuetifyProTipTap);
app.use(pinia);
app.use(router);

//directives
usePermissionsDirective(app);

//global error handler
app.config.errorHandler = (err, instance, info) => {
  // Handle the error globally
  console.error("Global error:", err);
  console.log("Vue instance:", instance);
  console.log("Error info:", info);

  // Add code for UI notifications, reporting or other error handling logic
};
app.mount("#app");
