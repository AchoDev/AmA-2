
<template>
  <div>
    <SideBar 
      ref="sideBar"
      :mainLang="currentOpenDictionary?.mainLang ?? ''"
      :secondLang="currentOpenDictionary?.secondLang ?? ''"
      :pages="currentOpenDictionary?.pages.map(p => p.title) ?? []"

      @create-new-page="createPage()"
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

    <PopupContainer ref="newPagePopup"> 
      <div id="new-page">
        <h1>New page</h1>
  
        Title
        <input type="text" />

        Grid

        <div id="grid-type-picker">
          <label>
            <input type="radio" name="gridType" value="none">
            None
          </label>

          <label>
            <input type="radio" name="gridType" value="checkered">
            Checkered
          </label>
          
          <label>
            <input type="radio" name="gridType" value="lined">
            Lined
          </label>
        </div>

        Size

        <div id="checkered-size">
          <label>
            <input type="radio" name="checkeredSize" value="small">
            Small
          </label>

          <label>
            <input type="radio" name="checkeredSize" value="medium">
            Medium
          </label>
          
          <label>
            <input type="radio" name="checkeredSize" value="large">
            Large
          </label>
        </div>

        <div id="lined-size">
          <label>
            <input type="radio" name="linedSize" value="small">
            Small
          </label>

          <label>
            <input type="radio" name="linedSize" value="medium">
            Medium
          </label>
          
          <label>
            <input type="radio" name="linedSize" value="large">
            Large
          </label>
        </div>

        <button>Cancel</button>

        <button>Save</button>

      </div>
    </PopupContainer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Dictionary from './DictionaryPage/Dictionary.vue'
import SideBar from './components/SideBar.vue';
import Menu from './Menu/Menu.vue';
import DrawingPage from './DictionaryPage/DrawingPage.vue';
import PopupContainer from './components/PopupContainer.vue';
import type { Dictionary as DictionaryType } from './components/dictionaryType.ts';

const currentOpenDictionary = ref<DictionaryType | undefined>(undefined);
const currentPage = ref('dictionary');

const sideBar = ref()
const newPagePopup = ref()

function openSideBar() {
  sideBar.value.openSideMenu()
}

function openDictionary(dictionary: DictionaryType) {
  currentOpenDictionary.value = dictionary
  currentPage.value = 'dictionary'
}

function createPage() {
  if (currentOpenDictionary.value) {
    newPagePopup.value.openPopup()
  }
}

</script>

<style lang="scss">

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

#new-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 15px;
  gap: 10px;

  input[type="text"] {
    width: 300px;
    height: 50px;
    border: none;
    border-radius: 100px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    transition: ease .1s;

    &:focus {
        outline: none;
        box-shadow: rgba(0, 0, 0, 0.521) 0px 3px 8px;
    }
  }

  select {
    width: 200px;
    height: 50px;
    border-radius: 100px;
    border: none;

    &:focus {
        outline: none;
    }
  }

  button {
    width: 200px;
    height: 50px;
    background: white;
    border: none;
    border-radius: 100px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }
}

</style>