
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
      v-if="currentOpenDictionary && currentOpenDictionary.pages.find(p => p.title === currentPage)"
      :grid="currentOpenDictionary.pages.find(p => p.title === currentPage)?.settings"
      :page="(currentOpenPage as Page)"
      @open-side-bar="openSideBar()"
    />

    <PopupContainer ref="newPagePopup">
      <div id="new-page">
        <h1>New page</h1>
  
        Title
        <input type="text" v-model="currentPageTitle"/>

        Grid

        <div id="grid-picker">
          <label>
            <input type="radio" name="gridType" value="checkeredLarge" v-model="selectedGrid">
            <div class="grid-img">
              <img src="./assets/grid/checkerlarge.svg" alt="Checkered large">
            </div>
          </label>
          
          <label>
            <input type="radio" name="gridType" value="checkeredMedium" v-model="selectedGrid">
            <div class="grid-img">
              <img src="./assets/grid/checkermedium.svg" alt="Checkered medium">
            </div>
          </label>
          <label>
            <input type="radio" name="gridType" value="checkeredSmall" v-model="selectedGrid">
            <div class="grid-img">
              <img src="./assets/grid/checkermedium.svg" alt="Checkered small">
            </div>
          </label>
          
          <label>
            <input type="radio" name="gridType" value="linedLarge" v-model="selectedGrid">
            <div class="grid-img">
              <img src="./assets/grid/linedlarge.svg" alt="Lined large">
            </div>
          </label>
          
          <label>
            <input type="radio" name="gridType" value="linedMedium" v-model="selectedGrid">
            <div class="grid-img">
              <img src="./assets/grid/linedmedium.svg" alt="Lined medium">
            </div>
          
          </label>
          
          <label>
            <input type="radio" name="gridType" value="linedSmall" v-model="selectedGrid">
            <div class="grid-img">
              <img src="./assets/grid/linedsmall.svg" alt="Lined small">
            </div>
          </label>
        </div>

        <button id="no-grid" @click="selectedGrid = ''">No grid</button>

        <button @click="cancelPageCreation()">Cancel</button>

        <button @click="saveNewPage()">Save</button>

      </div>
    </PopupContainer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Dictionary from './DictionaryPage/Dictionary.vue'
import SideBar from './components/SideBar.vue';
import Menu from './Menu/Menu.vue';
import DrawingPage from './DictionaryPage/DrawingPage.vue';
import PopupContainer from './components/PopupContainer.vue';
import { GridType, type Dictionary as DictionaryType, Page } from './components/dictionaryType.ts';

const currentOpenDictionary = ref<DictionaryType | undefined>(undefined);
const currentPage = ref('dictionary');

const sideBar = ref()
const newPagePopup = ref()

const currentOpenPage = computed(() => {
  if (currentOpenDictionary.value) {
    return currentOpenDictionary.value.pages.find(p => p.title === currentPage.value)
  }
  return undefined
})

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

function cancelPageCreation() {
  newPagePopup.value.closePopup()
  currentPageTitle.value = ''
  selectedGrid.value = ''
}

function saveNewPage() {
  if (currentOpenDictionary.value) {
    currentOpenDictionary.value.pages.push({
      title: currentPageTitle.value,
      settings: grids[selectedGrid.value],
      content: []
    })
  }

  newPagePopup.value.closePopup()
  currentPageTitle.value = ''
  selectedGrid.value = ''
}

const selectedGrid = ref('')
const currentPageTitle = ref('')

const smallSize = 1
const mediumSize = 1.5
const largeSize = 2

const grids: {[key: string]: {gridSize: number, gridType: GridType}} = {
  '': {
    gridSize: smallSize,
    gridType: GridType.none
  },
  'checkeredLarge': {
    gridSize: largeSize,
    gridType: GridType.checkered
  },
  'checkeredMedium': {
    gridSize: mediumSize,
    gridType: GridType.checkered
  },
  'checkeredSmall': {
    gridSize: smallSize,
    gridType: GridType.checkered
  },
  'linedLarge': {
    gridSize: largeSize,
    gridType: GridType.lined
  },
  'linedMedium': {
    gridSize: mediumSize,
    gridType: GridType.lined
  },
  'linedSmall': {
    gridSize: smallSize,
    gridType: GridType.lined
  }

}

</script>

<style lang="scss">

@import url('https://fonts.googleapis.com/css2?family=Maven+Pro&display=swap');

html {
  min-height: 100vh;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
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

  #no-grid {
    width: 100%;
    margin: 10px;
    height: 40px;
    font-size: 14pt;
    margin-bottom: 20px;
  }

  #grid-picker {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
    margin: 0 10px;

    width: 320px;

    input[type="radio"] {
      appearance: none;

      &:checked + div{
        background: rgb(255, 180, 75);
        img {
          filter: invert(1)
        }
      }
    }

    label {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;

      .grid-img {
        width: 100px;
        height: 100px;
        border-radius: 10px;
        // background: white;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        transition: ease .1s;


        background: white;
        cursor: pointer;
      }
    }
  }
}

</style>