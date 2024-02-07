
<template>
  <div>
    <Dictionary 
    
      mainLang="spanish"
      secondLang="german"
    />
  </div>
</template>

<script setup lang="ts">
import Dictionary from './DictionaryPage/Dictionary.vue'

</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Maven+Pro&display=swap');

html {
  min-height: 100vh;
}

body > * {
  font-family: Maven Pro, sans-serif !important;
  /* font-family: 'Times New Roman', Times, serif; */
}

button {
  font-family: Maven Pro, sans-serif !important;
}

body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

</style>