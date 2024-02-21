
<template>
  <div>
    <SideBar 
      ref="sideBar"
      :mainLang="mainLang"
      :secondLang="secondLang"
    />

    <!-- <Menu @onSideBarOpen="openSideBar"/> -->

    <Dictionary 
      :mainLang="mainLang"
      :secondLang="secondLang"
      @onSideBarOpen="openSideBar"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Dictionary from './DictionaryPage/Dictionary.vue'
import SideBar from './components/SideBar.vue';
// import Menu from './Menu/Menu.vue';

const mainLang = ref('spanish')
const secondLang = ref('german')

const sideBar = ref()

function openSideBar() {
  sideBar.value.openSideMenu()
}

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