
<template>
  <div>
    <SideBar 
      ref="sideBar"
      :mainLang="currentOpenDictionary?.mainLang ?? ''"
      :secondLang="currentOpenDictionary?.secondLang ?? ''"
      @open-page="(e) => currentPage = e"
      @exit-to-menu="(e) => openDictionary(e)"
    />

    <Menu 
      v-if="!currentOpenDictionary"
      @onSideBarOpen="openSideBar"
      @open-book="(e) => openDictionary(e)"
    />

    <Dictionary
      v-if="currentOpenDictionary && currentPage === 'dictionary'"
      :dictionary="currentOpenDictionary"
      @onSideBarOpen="openSideBar()"
    />

    <DrawingPage 
      v-if="currentOpenDictionary && currentPage === 'drawing1'"


      @open-side-bar="openSideBar()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Dictionary from './DictionaryPage/Dictionary.vue'
import SideBar from './components/SideBar.vue';
import Menu from './Menu/Menu.vue';
import DrawingPage from './DictionaryPage/DrawingPage.vue';
import type { Dictionary as DictionaryType } from './components/dictionaryType.ts';

const currentOpenDictionary = ref<DictionaryType | undefined>(undefined);
const currentPage = ref('dictionary');

const sideBar = ref()

function openSideBar() {
  sideBar.value.openSideMenu()
}

function openDictionary(dictionary: DictionaryType) {
  currentOpenDictionary.value = dictionary
  currentPage.value = 'dictionary'
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