
<template>
  <div>
    <SideBar 
      ref="sideBar"
      :mainLang="currentOpenDictionary?.mainLang ?? ''"
      :secondLang="currentOpenDictionary?.secondLang ?? ''"
      :pages="currentOpenDictionary?.pages.map(p => p.title) ?? []"
      :darkMode="settings?.darkmode ?? false"

      @create-new-page="createPage()"
      @open-page="(e) => currentPage = e"
      @exit-to-menu="(e) => openDictionary(e)"
    />

    <div v-if="settings != undefined && dictionaries != undefined">
      <Menu 
        v-if="!currentOpenDictionary"
        :dictionaries="dictionaries!"
        :dark-mode="settings?.darkmode ?? false"
        @onSideBarOpen="openSideBar"
        @open-book="(e) => openDictionary(e)"
        @create-dictionary="saveNewDictionary"
      />
  
      <Dictionary
        v-if="currentOpenDictionary && currentPage === 'dictionary'"
        :dictionary="currentOpenDictionary"
        :settings="settings"
        @onSideBarOpen="openSideBar()"
        @change-settings="changeSettings"
        @save-word="saveDictionary"
      />
        
      <DrawingPage
        v-if="currentOpenDictionary && currentOpenDictionary.pages.find(p => p.title === currentPage)"
        :settings="settings"
        :grid="currentOpenDictionary.pages.find(p => p.title === currentPage)?.settings"
        :page="(currentOpenPage as Page)"
        :darkMode="settings?.darkmode ?? false"
        @open-side-bar="openSideBar()"
        @change-settings="changeSettings"
        @change-page-settings="changePageSettings"
      />
    </div>


    <PopupContainer ref="newPagePopup" :background="settings?.darkmode ? '#070707' : undefined">
      <div id="new-page" :style="{color: settings?.darkmode ? 'white' : 'black'}">
        <h1>New page</h1>
  
        Title
        <input type="text" v-model="currentPageTitle"/>

        Grid

        <div style="width: 300px">
          <GridPicker v-model="selectedGrid" />
        </div>

        <button @click="cancelPageCreation()">Cancel</button>

        <button @click="saveNewPage()">Save</button>

      </div>
    </PopupContainer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Dictionary from './DictionaryPage/Dictionary.vue'
import SideBar from './components/SideBar.vue';
import GridPicker from './components/GridPicker.vue';
import Menu from './Menu/Menu.vue';
import DrawingPage from './DictionaryPage/DrawingPage.vue';
import PopupContainer from './components/PopupContainer.vue';
import { type Dictionary as DictionaryType, Page, GridType, Word } from './components/dictionaryType.ts';

// import raw from './settings.json'
import { loadStorage, save } from './storage.ts';

import Settings from './components/settings.ts';

const settings = ref<Settings>()
const dictionaries = ref<DictionaryType[]>();

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

function changeSettings(newSettings: Settings) {
  settings.value = newSettings
}

function changePageSettings(newSettings: Page['settings']) {
  if (currentOpenDictionary.value) {
    const page = currentOpenDictionary.value.pages.find(p => p.title === currentPage.value)
    if (page) {
      page.settings = newSettings
    }
  }
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
  selectedGrid.value = {
    gridSize: 1,
    gridType: GridType.none
  }
}

function getRandomPageName() {
  const names = [
    'Extraordinary Page',
    'New Page',
    'Page of Wonders',
    'Page of Dreams',
    'Dream Page',
    'Untitled',
    'Unknown Endavour',
    'New Beginnings',
    'Page of Hope',
    'Very new Page',
    'Page of Pages',
    'This is it',
    'Wow, a new page',
    'My new page',
    'Your new page',
    'Our new page',
    'The new page',
    'Super Page',
    'Page of Vought',
    'Page of the Seven',
    'Missing exception',
    'Page of Lugunica',
    'Page of Kararagi',
    'Page of the Clover Kingdom',
    'Page of me',
    'MY Page',
    'Dont touch this page',
    "Heisenberg's Page",
    "Slippin Jimmy's Page",
    'Page of the Blue Sky',
    '404 Not found',
    'The last page',
    'The first page',
    'Learners Page',
    'Page of the Wise',
  ]

  return names[Math.floor(Math.random() * names.length)]
}

function saveNewPage() {
  if (currentOpenDictionary.value) {
    currentOpenDictionary.value.pages.push({
      title: currentPageTitle.value === '' ? getRandomPageName() + ' ' + (currentOpenDictionary.value.pages.length + 1) : currentPageTitle.value,
      settings: selectedGrid.value,
      content: []
    })
  }

  newPagePopup.value.closePopup()
  currentPageTitle.value = ''
  selectedGrid.value = {
    gridSize: 1,
    gridType: GridType.none
  }
}

const selectedGrid = ref()
const currentPageTitle = ref('')

document.addEventListener('gesturestart', (event) => { event.preventDefault(); }, false);

function saveNewDictionary(d: DictionaryType) {
  dictionaries.value!.push(d)
  save({
    lastOpenDict: dictionaries.value!.indexOf(currentOpenDictionary.value!),
    settings: settings.value!,
    dictionaries: dictionaries.value!,
  })
}

function saveDictionary(d: DictionaryType) {
  const index = dictionaries.value!.indexOf(currentOpenDictionary.value!)
  dictionaries.value![index] = d

  save({
    lastOpenDict: index,
    settings: settings.value!,
    dictionaries: dictionaries.value!,
  })
}

onMounted(async () => {
  const raw = await loadStorage()

  if(raw == null || raw === "") {
    dictionaries.value = []
    settings.value = {
      wordsPerPage: 10,
      wordSize: 20,
      dividerBetweenWords: true,
      darkmode: false
    }
    save({
      lastOpenDict: -1,
      settings: settings.value,
      dictionaries: dictionaries.value,
    })
    return
  }

  const storage = JSON.parse(raw)

  dictionaries.value = storage.dictionaries
  settings.value = storage.settings
})

</script>

<style lang="scss">

// @import url('https://fonts.googleapis.com/css2?family=Maven+Pro&display=swap');

@font-face {
  font-family: 'Maven Pro';
  src: url('./MavenPro-Regular.woff') format('woff');
}

html {
  min-height: 100dvh;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  overscroll-behavior: none;


  &.no-scroll {
    overflow: hidden;
  }
}

body > * {
  font-family: Maven Pro, sans-serif !important;
  overscroll-behavior: none;

  user-select: none;
  -webkit-user-select: none;
  /* font-family: 'Times New Roman', Times, serif; */
}

button {
  font-family: Maven Pro, sans-serif !important;
  color: black;
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