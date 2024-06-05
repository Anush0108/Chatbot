export default defineNuxtConfig({
  devtools: { enabled: true }, // Keep for development mode
  runtimeConfig:{
    OPENAI_API_KEY:process.env.OPENAI_API_KEY
  }
 
});
