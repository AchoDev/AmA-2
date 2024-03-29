<template>
    <div id="root" :class="settings.darkmode ? 'darkmode' : ''">

        <!-- :title="mainLang + ' - ' + secondLang" -->
        <NavBar 
            :title="dictionary.title"
            :settings="settings"
            @openSideBar="openSideBar"
            @changeSettings="changeSettings"
            @import-from-ama="saveAmaData"
        />

        <main>

            <div id="white-flash" :style="`opacity: ${whiteFlashOpacity}`">
                &nbsp;
            </div>

            <div id="main-wrapper">
                <div id="letter-container">
                    <div 
                        v-for="letter in currentAlphabet"
                        :class="selectedLetter === letter ? 'letter-selected' : ''" 
                        @click="selectLetter(letter)"
                    >
                        {{letter}}
                    </div>
                </div>
    
                <div id="page-container">
                    <div id="lang-desc">
                        <div id="lang1">
                            <h1>{{ mainLang }}</h1>
                        </div>
                        <div id="lang2">
                            <h1>{{ secondLang }}</h1>
                        </div>
                        <div id="notes">
                            <h1>Notes</h1>
                        </div>
                    </div>

                    <center>
                        <hr>
                    </center>

                    <Word
                        v-for="(word, i) in getVisibleWords()" 
                        :mainLangWord="word.mainLang" 
                        :secondLangWord="word.secondLang" 
                        :notes="word.notes"
                        :index="i"
                        :sizes="wordSizes"
                        :word-size="settings.wordSize"
                        :divider-visible="settings.dividerBetweenWords"
                        :dark-mode="settings.darkmode"

                        v-show="(i >= settings.wordsPerPage * (currentPage - 1) && i < settings.wordsPerPage * currentPage)"

                        @onWordEdit="onWordEdit"
                        @on-word-delete="deleteWord"
                        @on-note-edit="editNotes"
                    />

                    <center v-if="words.length === 0">
                        <h2>So empty....</h2>
                        <span>Add your first word to start the learning journey</span>
                    </center>

                    <div v-if="words.length !== 0">

                        <center v-if="noLetterWordFound">
                            <h2>No word found starting with the Letter "{{ selectedLetter }}" :(</h2>
                            <span>You can create a word with the + button in the bottom right corner, that starts with {{ selectedLetter }}</span>
                        </center>
                        
                        <center v-else-if="noSearchWordFound">
                            <h2>No word called "{{ searchingFor }}" was found :(</h2>
                            <span>Maybe you mispelled it? Make sure </span>
                        </center>

                        <center v-else-if="noTagWordFound">
                            <h2>No word with the tag "{{ selectedTag }}" :(</h2>
                            <span>You can edit existing words to give them tags or select a tag upon creating a new word</span>
                        </center>

                    </div>                

                    <!-- <center>
                        <DrawingArea width="750px" height="500px"/>
                    </center> -->
                </div>
            </div>

        </main>

        <div id="bottom-bar">

            <div id="tag-indicator" v-show="selectedTag != ''">
                <button @click="selectedTag = ''">X</button>
                <span>Selected tag: <b>{{ selectedTag }}</b></span>
            </div>

            <div id="tag-indicator" v-show="searchingFor != ''">
                <button @click="searchingFor=''">X</button>
                <span>Searching for: "{{ searchingFor }}"</span>
            </div>

            <div id="bottom-left-container">
                <!-- <button>search</button> -->

                <div id="search-bar">
                    <input type="text" placeholder="Search..." v-model="searchingFor">
                </div>

                <button @click="openTagMenu">
                    <img src="../assets/filter.svg" alt="Tag">
                </button>
            </div>

            <div id="page-indicator">
                <button @click="lastPage()">
                    <img src="../assets/arrow.svg" alt="Last page">
                </button>

                <span>Page {{ currentPage }}/{{ totalPages }}</span>

                <button @click="nextPage()">
                    <img src="../assets/arrow.svg" alt="Next page">
                </button>
            </div>

            <button id="add-word-button" @click="createNewWord()">
                <img src="../assets/plus.svg" alt="Create word">
            </button>
        </div>

        <PopupContainer ref="tagSelector" 
            @onClose="editingTags = false"
            :background="settings.darkmode ? '#070707' : undefined"
        >
            <div id="tag-selector-popup" :style="{color: settings.darkmode ? 'white' : 'black'}">
                <div id="tag-top">
                    <h1>Select tag</h1>

                    <div id="editing-suite">
                        <button @click="addNewTag()">
                            <img src="../assets/plus.svg" alt="Add new tag">
                        </button>
                        <button v-show="!editingTags" @click="editingTags = true">
                            <img src="../assets/edit.svg" alt="Edit button">
                        </button>
                        <button v-show="editingTags" @click="editingTags = false">
                            <img src="../assets/save.svg" alt="Save button">
                        </button>
                    </div>
                </div>

                <center v-if="tags.length === 0">
                    <h2>No tags yet!</h2>
                    <p>Create a new tag with the + button</p>
                </center>

                <div id="tag-button-wrapper"  @click="editingTags = false">
                    
                    <div
                        v-for="(tag, id) in tags"
                        :key="id"
                    >
                        <button id="edit" v-show="editingTags" :style="`opacity: ${editingTags ? 1 : 0}`" @click="openTagEditor(tag)" @click.stop>
                            <img src="../assets/edit.svg" alt="Edit">
                        </button>
                        <button id="delete" v-show="editingTags" :style="`opacity: ${editingTags ? 1 : 0}`" @click="deleteTag(tag)" @click.stop>
                            <img src="../assets/trash.svg" alt="Delete">
                        </button>
                        <Wiggly 
                            
                            :wiggle="editingTags"
                        >
                            <button 
                                class="tag-button"
                                :class="!editingTags ? 'tag-button-static' : ''"
                                @click="selectTag(tag)"
                                @click.stop
                            >
                                <span>{{ tag }}</span>
                            </button>
                        </Wiggly>
                    </div>
                </div>
            </div>
        </PopupContainer>

        <PopupContainer ref="tagEditor">
            <div id="edit-tag-popup">
                <h1>Edit tag "{{ currentEditedTag }}"</h1>
                <center>
                    <input type="text" placeholder="New tag name" v-model="currentEditedTagModel">
    
                    <br>
    
                    <button @click="saveTag(currentEditedTag, currentEditedTagModel)">Save</button>
                    <br>
                    <button @click="closeTagEditor">Cancel</button>
                </center>
                
            </div>
        </PopupContainer>

        <PopupContainer ref="wordCreator" :background="settings.darkmode ? '#070707' : undefined">
            <div id="word-creator" :style="{color: settings.darkmode ? 'white' : 'black '}">
                <h1>Create a new word</h1>
                
                {{ mainLang }}
                <input type="text" :placeholder="mainLang + ' word'" v-model="newWordMainLang">
                
                {{ secondLang }}
                <input type="text" :placeholder="secondLang + ' word'" v-model="newWordSecondLang">

                Tag
                <select name="Tag" id="tag-selector" v-model="newWordTag">
                    <option value="">No tag</option>
                    <option v-for="(tag, id) in tags" :key="id" :value="tag">{{ tag }}</option>
                </select>

                Notes (click to draw)
                <div @click="openDrawer()">
                    <DrawingPreview
                        width="700px"
                        height="250px"
                        :paths="newWordNoteDrawing"
                        scale-down="2.5" 
                    />
                </div>
                
                <button @click="saveNewWord">Create</button>
                <button @click="closeWordCreator">Cancel</button>
            
            </div>
        </PopupContainer>

        <PopupContainer ref="drawingPopup" background="transparent">
            <div id="drawing-area-container">
                <DrawingArea 
                    width="700px" 
                    height="250px"
                    :toolbar-fixed="true"
                    v-model="newWordNoteDrawing"
                />
            </div>
        </PopupContainer>

        <YesNo ref="yesNo" />
        <Ok ref="ok" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import Word from './Word.vue';
import PopupContainer from '../components/PopupContainer.vue';
import Wiggly from '../components/Wiggly.vue';
import YesNo from '../components/YesNo.vue';
import Ok from '../components/Ok.vue';
import DrawingPreview from '../components/DrawingPreview.vue';
import DrawingArea from '../components/DrawingArea.vue';
import Path from '../components/path';
import NavBar from './NavBar.vue';

// const fs = require('fs')

// import DrawingArea from '../components/DrawingArea.vue';

import Split from 'split.js'

import alphabets from './alphabets.ts'
import { Dictionary } from '../components/dictionaryType';
import Settings from '../components/settings.ts';

const noTagWordFound = computed(() => {
    return words.value.find(value => value.tag === selectedTag.value) == undefined && selectedTag.value !== ''
})

const noSearchWordFound = computed(() => {
    return words.value.find(value => value.mainLang.toLowerCase().includes(searchingFor.value.toLowerCase())) == undefined && searchingFor.value !== ''
})

const noLetterWordFound = computed(() => {
    return words.value.find(value => value.mainLang.charAt(0).toLowerCase() === selectedLetter.value.toLowerCase()) == undefined && selectedLetter.value !== ''
})

const props = defineProps<{
    settings: Settings,
    dictionary: Dictionary
}>()

const emits = defineEmits(["onSideBarOpen", "changeSettings", "saveWord"])

const currentPage = ref<number>(1)

const totalPages = computed(() => {
    let visibleWords = words.value;
    visibleWords = visibleWords.filter(word => word.tag === selectedTag.value || selectedTag.value === '')
    visibleWords = visibleWords.filter(word => word.mainLang.charAt(0).toLowerCase() === selectedLetter.value.toLowerCase() || selectedLetter.value === '')
    visibleWords = visibleWords.filter(word => word.mainLang.toLowerCase().includes(searchingFor.value.toLowerCase()) || searchingFor.value === '')
    const value = Math.ceil(visibleWords.length / props.settings.wordsPerPage)

    if(value === 0) return 1
    return value
})

function getVisibleWords() {
    let visibleWords = words.value;
    visibleWords = visibleWords.filter(word => word.tag === selectedTag.value || selectedTag.value === '')
    visibleWords = visibleWords.filter(word => word.mainLang.charAt(0).toLowerCase() === selectedLetter.value.toLowerCase() || selectedLetter.value === '')
    visibleWords = visibleWords.filter(word => word.mainLang.toLowerCase().includes(searchingFor.value.toLowerCase()) || searchingFor.value === '')
    return visibleWords
}

function changeSettings(newSettings: Settings) {
    emits('changeSettings', newSettings)
}

const selectedLetter = ref('')
const selectedTag = ref('')
const searchingFor = ref('')

const tagSelector = ref()
const tagEditor = ref()

const currentEditedTag = ref('')
const currentEditedTagModel = ref('')

const newWordMainLang = ref('')
const newWordSecondLang = ref('')
const wordCreator = ref()
const drawingPopup = ref()

const newWordNoteDrawing = ref<Path[]>([])
const newWordTag = ref('')

const whiteFlashOpacity = ref(1)

function openSideBar() {
    emits('onSideBarOpen')
}

function nextPage() {
    if(currentPage.value < totalPages.value) {
        currentPage.value++
    } else {
        currentPage.value = 1
    }
}

function lastPage() {
    if(currentPage.value > 1) {
        currentPage.value--
    } else {
        currentPage.value = totalPages.value
    }

}

function openDrawer() {
    drawingPopup.value.openPopup()
}

function createNewWord() {
    newWordNoteDrawing.value = []
    wordCreator.value.openPopup();
}

function getDict() {
    const value: Dictionary = {
        title: props.dictionary.title,
        pages: props.dictionary.pages,
        mainLang: mainLang.value,
        secondLang: secondLang.value,
        tags: tags.value,
        words: words.value
    }
    return value;
}

function saveAmaData(data: any) {
    words.value = [];

    console.log(data, "data")

    data.tags.forEach((tag: any) => {
        tags.value.push(tag["name"])
    })

    data.words.forEach((word: any) => {
        let tag

        tag = data.tags.find((tag: any) => tag["id"] === word["tag"])

        if(tag) {
            tag = tag["name"]
            if(tag === 'any') tag = ''
        } else {
            tag = ''
        }

        console.log(word['de'], word['ar'])

        let secondLangWord = word["de"] + (word["ar"] != '' ? `, ${word["ar"]}` : '')


        words.value.push({
            mainLang: word["sp"],
            secondLang: secondLangWord,
            notes: [],
            tag: tag
        })
    })

    save()
}

function save() {
    emits('saveWord', getDict())
}

function saveNewWord() {
    words.value.push({
        mainLang: newWordMainLang.value,
        secondLang: newWordSecondLang.value,
        notes: newWordNoteDrawing.value,
        tag: newWordTag.value
    })

    closeWordCreator()
    orderWords()

    save()
}

function closeWordCreator() {
    newWordMainLang.value = ''
    newWordSecondLang.value = ''
    newWordNoteDrawing.value = []
    newWordTag.value = ''

    wordCreator.value.closePopup()
}

const yesNo = ref()
const ok = ref()

function addNewTag() {
    let currentNum = 0
    while(tags.value.find(tag => tag === `New tag ${currentNum}`)) {
        currentNum++
    }
    
    tags.value.push(`New tag ${currentNum}`)

    save()
}

function openTagMenu() {
    tagSelector.value.openPopup()
}

function closeTagEditor() {
    tagEditor.value.closePopup()
}

function openTagEditor(tag: string) {
    currentEditedTag.value = tag
    currentEditedTagModel.value = tag
    tagEditor.value.openPopup()
}

function saveTag(tag: string, newTag: string) {

    if(tags.value.find(tag => tag === newTag)) {
        ok.value.notify(`Tag already "${newTag}" already exists`, 'Please choose a different name')
        return
    }

    if(selectedTag.value === tag) {
        selectedTag.value = newTag
    }
    tags.value[tags.value.indexOf(tag)] = newTag
    words.value.forEach(word => {
        if(word.tag === tag) {
            word.tag = newTag
        }
    })

    save()

    tagEditor.value.closePopup()
}

function selectTag(tag: string) {
    if(editingTags.value) return
    selectedTag.value = tag
    tagSelector.value.closePopup()
}

function deleteTag(tag: string) {
    yesNo.value.ask(`Are you sure you want to delete the tag "${tag}"?`, 'All tagged words will lose their tag').then((answer: boolean) => {
        if(answer) {

            setTimeout(() => {
        
                yesNo.value.ask(`Delete all words belonging to this tag?`, '').then((answer: boolean) => {
                    if(answer) {
                        words.value = words.value.filter(word => word.tag !== tag)
                    } else {
                        words.value.forEach(word => {
                            if(word.tag === tag) {
                                word.tag = ''
                            }
                        })
                    }
                })
                
                if(selectedTag.value === tag) {
                    selectedTag.value = ''
                }
                tags.value.splice(tags.value.indexOf(tag), 1)
                if(tags.value.length === 0) {
                    editingTags.value = false;
                }
                save()
            }, 200)

        }
    })
}

const editingTags = ref(false)


function selectLetter(letter: string) {
    if(selectedLetter.value === letter) {
        selectedLetter.value = ''
        return
    }
    selectedLetter.value = letter
}

const currentAlphabet = ref(alphabets[props.dictionary.mainLang])

const tags = ref(props.dictionary.tags)
const words = ref(props.dictionary.words)
const mainLang = ref(props.dictionary.mainLang)
const secondLang = ref(props.dictionary.secondLang)

watch(totalPages, () => {
    if(currentPage.value > totalPages.value) {
        currentPage.value = 1
    }
})



function onWordEdit(index: number, mainWord: string, secondWord: string) {
    words.value.find((word, i) => {
        if(i === index) {
            word.mainLang = mainWord
            word.secondLang = secondWord
            return true
        }
    })

    orderWords()
    save()
}

function editNotes(_: number, notes: Path[]) {
    drawingPopup.value.openPopup()
    newWordNoteDrawing.value = notes
    save()
}

function deleteWord(index: number) {
    yesNo.value.ask(`Are you sure you want to delete the word "${words.value[index].mainLang}"?`, 'This action cannot be undone').then((answer: boolean) => {
        if(answer) {
            words.value.splice(index, 1)
            save()
        }
    })

}

const wordSizes = ref([33, 33, 33])

function orderWords() {
    words.value = words.value.sort((a, b) => {
        if (a.mainLang < b.mainLang) {
            return -1
        }
        if (a.mainLang > b.mainLang) {
            return 1
        }
        return 0
    })
}

onMounted(() => {

    whiteFlashOpacity.value = 0
    orderWords()  

    Split(['#lang1', '#lang2', '#notes'], {
        sizes: [33, 33, 33],
        gutterSize: 15,
        minSize: 150,
        // cursor: 'col-resize',
        snapOffset: 10,

        onDrag(sizes) {
            wordSizes.value = sizes
        },
    })

    let inputField = document.getElementById("search-bar")

    /*
    * Method 1: Briefly change the opacity.
    * Element might "blink" on focus in some scenarios.
    */
    inputField?.addEventListener("focus", () => {
        if(!inputField) return
        inputField.style.opacity = '0';
        setTimeout(() => {if(inputField) inputField.style.opacity = '1'});
    });
})


</script>

<style scoped lang="scss">

$bar-height: 70px;

#root {
    --background: white;
    --text-color: black;
}

#root main {
    background: linear-gradient(100deg, #ffb25b, #ffb158);
}

#root.darkmode main {
    background: linear-gradient(100deg, rgb(22, 22, 22), rgb(12, 12, 12));
}

#root.darkmode {
    --background: rgb(34, 34, 34);
    --text-color: white;
}

hr {
    width: 90%;
    margin-top: 15px;
    margin-bottom: 30px;
    border-top: 2px solid #ffca67;
    box-shadow: none;
}

#white-flash {
    width: 100%;
    height: 100%;
    transition: ease-in 0.5s;
    background: white;
    pointer-events: none;
    position: fixed;
    top: 0;
    z-index: 1000;
}

main {
    min-height: 100vh;
    width: 100%;
    transition: ease .4s;
    background-position: fixed;

    display: flex;
    justify-content: center;

    #main-wrapper {

        width: 70%;
        height: auto;
        padding-top: 100px;

        display: flex;
        flex-direction: column;

        margin-bottom: 100px;

        #letter-container {
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            height: 50px;
            // background: white;

            div {
                // width: calc(100% - 6px);
                width: 100%;
                margin: 0 1px;
                height: 50px;
                background: var(--background);
                color: var(--text-color);
                font-weight: bold;
                
                display: grid;
                place-items: center;

                border-top-right-radius: 10px;
                border-top-left-radius: 10px;

                transform: translateY(15px);
                transition: ease-out 0.05s;
                user-select: none;

                cursor: pointer;

                // border: 3px solid transparent;

                // &:not(.letter-selected):hover {
                //     transform: translateY(5px)
                // }

                &.letter-selected {
                    background: #ff6600;
                    color: white;
                    transform: translateY(0);
                    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
                }
            }
        }

        #page-container {
            min-height: 90%;
            background: var(--background);
            border-radius: 10px;
            border: 1px solid rgb(235, 175, 120);
            // border: 1px solid #727272;

            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

            z-index: 1;

            color: var(--text-color);

            // margin-bottom: 500px;
            
            #lang-desc {
                display: flex;
                justify-content: space-evenly;
                

                // cursor: col-resize;

                div {
                    width: 100%;
                    text-align: center;
                    // user-select: none;

                    position: relative;

                    display: grid;
                    place-items: center;

                    h1 {
                        font-size: 18pt;
                        font-weight: bold;
                        display: grid;
                        place-items: center;
                        height: 40px;
                        width: 140px;

                        user-select: none;

                    }

                    &:first-child {
                        h1 {
                            background: #ff7c24;
                            border-radius: 10px;
                            color: white;
                        }
                    }

                    &:not(:last-child)::after {
                        content: '';
                        position: absolute;
                        right: -11px;
                        top: 50%;
                        transform: translateY(-50%);
                        width: 2.5px;
                        height: 50%;
                        background: rgba(255, 119, 7, 0.295);
                        border-radius: 100px;

                        z-index: -1;
                    }
                }
            }
        }
    } 
}

#word-creator {
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

#edit-tag-popup {

    padding: 30px;

    h1 {
        font-size: 24pt;
        margin-bottom: 0.5rem;
        padding: 10px;
    }

    span {
        font-size: 16pt;
        margin: 50px;
    }

    input[type="text"] {
        width: 200px;
        height: 30px;
        border: none;
        border-radius: 100px;
        padding: 5px;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        transition: ease .1s;
        margin: 10px;

        &:focus {
            outline: none;
            box-shadow: rgba(0, 0, 0, 0.521) 0px 3px 8px;
        }
    }

    button {
        padding: 1rem;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        width: 120px;
        height: 60px;
        background: #ff7c24;
        color: white;
        font-size: 16pt;

        margin: 5px;
    }

}

#tag-selector-popup {
    
    display: flex;
    flex-direction: column;
    
    #tag-top {
        position: relative;
        display: flex;
        justify-content: center;
        width: auto;


        #editing-suite {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);

            display: flex;
            gap: 10px;

            
            button {
                width: 60px;
                height: 60px;
                background: white;
                border: none;
                border-radius: 100px;
                box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
                transition: ease-out .1s;

                img {
                    width: 70%;
                    height: auto;
                }

                &:active {
                    transform: scale(0.75);
                }
            }

        }
    }

    .tag-button-static {
        cursor: pointer;
        &:hover {
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
            transform: scale(1.05);
        }

        &:active {
            transform: scale(0.95);
        }
    }
    
    #tag-button-wrapper {
        
        display: flex;
        flex-wrap: wrap;
        justify-content: start;
        align-content: start;
        gap: 20px;
        padding: 10px;
    
        width: 1000px;
        // height: 600px;
        height: 400px;
        overflow-y: auto;

        div {
            position: relative;
        }

        #edit, #delete {
            position: absolute;
            z-index: 15;
            top: -10px;

            width: 40px;
            height: 40px;
            transition: ease-out .2s;
            &:hover {
                transform: scale(1.1);
            }

            background: white;
            border: 1px solid rgb(182, 182, 182);
            border-radius: 100px;

            img {
                width: 100%;
                height: auto;
            }
        }

        #edit {
            left: -5px;
        }
        #delete {
            right: -5px;
        }
    
        .tag-button {
            width: 180px;
            height: 100px;
            font-size: 16pt;
            // cursor: pointer;
            background: rgb(255, 255, 255);
            border: none;
            border-radius: 5px;
            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
            transition: cubic-bezier(0.23, 1, 0.320, 1) 0.1s;
        }
}

}

#drawing-area-container {
    position: relative;
    width: 100%;
    height: 450px;
    display: flex;
    align-items: center;
}

#bottom-bar {
    background: var(--background);
    height: $bar-height;
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    padding-bottom: 20px;

    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

    z-index: 10;

    button {
        background: var(--background)
    }

    #bottom-left-container {
        button {
            width: 45px;
            height: 45px;
            margin-left: 5px;
            border: none;
            border-radius: 100px;
            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
            transition: ease-out .1s;

            display: grid;
            place-items: center;

            img {
                width: 80%;
                height: auto;
            }

            &:active {
                transform: scale(0.95);
            }
        }

    }
    div {
        margin-left: 5px;
        display: flex;
        align-items: center;
        gap: 10px;
        
            #search-bar {
                input[type="text"] {
                    width: 200px;
                    height: 30px;
                    border: none;
                    border-radius: 100px;
                    padding: 5px;
                    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
                    transition: ease .1s;
                    background: var(--background);
                    color: var(--text-color);

                    &:focus {
                        outline: none;
                        box-shadow: rgba(0, 0, 0, 0.521) 0px 3px 8px;
                    }
                }
            }
    }

    #add-word-button {
        width: 55px;
        height: 55px;
        margin-right: 5px;
        border: none;
        border-radius: 100px;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        transition: ease-out .1s;

        img {
            width: 70%;
            height: auto;
        }

        &:active {
            transform: scale(0.95);
        }
    }

    #page-indicator {
        display: flex;
        align-items: center;
        gap: 10px;

        font-size: 16pt;

        position: absolute;
        right: 50%;
        transform: translateX(50%);

        color: var(--text-color);

        button {
            width: 45px;
            height: 45px;
            border: none;
            border-radius: 100px;
            
            color: #ff7c24;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
            transition: ease-out .05s;

            img {
                width: 80%;
                height: auto;
                transform: translateX(2px);
            }

            &:first-child {
                img {
                    transform: rotate(180deg) translateX(2px);
                }
                &:active {
                    transform: scale(0.95) translateX(-5px);
                }
            }

            &:active {
                transform: scale(0.95) translateX(5px);
                filter: brightness(1.2)
            }
        }
    }

    #tag-indicator {
        position: absolute;
        left: 10px;
        top: -50px;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        border-radius: 5px;
        min-width: 200px;
        height: 30px;
        padding: 5px;

        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;

        background: var(--background);
        color: var(--text-color);
        
        button {
            color: var(--text-color);
            // main col background
            background: #ff7c24;
            height: 100%;
            border-radius: 5px;
            border: none;
        }
    }
}

</style>