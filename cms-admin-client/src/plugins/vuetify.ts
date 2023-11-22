// plugins/vuetify/vuetify.js
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";

export const vuetify = createVuetify({
  theme: { defaultTheme: "light" },
  icons: {
    defaultSet: "mdi",
    sets: {},
  },
  components: {
  },
});
