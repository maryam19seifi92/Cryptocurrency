// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  plugins: [{ src: "~/plugins/vue3-apexcharts", mode: "client" }],

  modules: [
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          Inter: "200..700",
        },
      },
    ],
  ],
});
