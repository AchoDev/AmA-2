<template>
    <div>
        
        <nav>
            <div>
                <button @click="sideMenuOpened = true"> >> </button>
            </div>

            <div>{{mainLang}} - {{secondLang}}</div>

            <div>
                <button>...</button>
            </div>
        </nav>

        <div id="side-bar" :class="sideMenuOpened ? 'opened' : ''">
            <div>
                ama logo
                <button @click="sideMenuOpened = false"> &lt;&lt; </button>
            </div>

            <button> &lt;- Menu </button>

            <hr>

            <h4>Your dictionaries</h4>

            <div>
                <button>spanish - german</button>
            </div>

            <hr>

            <h4>Your pages</h4>

            <div>
                <button>page 1</button>
            </div>
        </div>

        <main>
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
                        v-for="(word, i) in words" 
                        :mainLangWord="word.mainLang" 
                        :secondLangWord="word.secondLang" 
                        :notes="word.notes"
                        :index="i"
                        :sizes="wordSizes"

                        v-show="
                            (selectedTag === '' || word.tag == selectedTag) && 
                            (selectedLetter === '' || word.mainLang.charAt(0).toLowerCase() === selectedLetter.toLowerCase())
                            && (searchingFor === '' || word.mainLang.toLowerCase().includes(searchingFor.toLowerCase()))"

                        @onWordEdit="onWordEdit" 
                    />

                    <center v-if="words.length === 0">
                        <h2>So empty....</h2>
                        <span>Add your first word to start the learning journey</span>
                    </center>

                    <div v-if="words.length !== 0">
                        <center v-if="noTagWordFound && !noSearchWordFound">
                            <h2>No word with the tag "{{ selectedTag }}" :(</h2>
                            <span>You can edit existing words to give them tags or select a tag upon creating a new word</span>
                        </center>
                        
                        <center v-if="noSearchWordFound && !noTagWordFound">
                            <h2>No word called "{{ searchingFor }}" was found :(</h2>
                            <span>Maybe you mispelled it? Make sure </span>
                        </center>

                        <center v-if="noSearchWordFound && noTagWordFound">
                            <h2>No word with the Tag "{{ selectedTag }}" OR with the name "{{ searchingFor }}"</h2>
                            <span>You are searching in an empty tag for something? That's... terrifying...</span>
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

            <div>
                <!-- <button>search</button> -->

                <div id="search-bar">
                    <input type="text" placeholder="Search..." v-model="searchingFor">
                </div>

                <button @click="openTagMenu">tags</button>
            </div>

            <div id="page-indicator">
                <button> &vartriangleleft; </button>

                <span>Page {{ currentPage }}/{{ totalPages }}</span>

                <button> &vartriangleright; </button>
            </div>

            <button id="add-word-button" @click="createNewWord()">
                <img src="../assets/plus.svg" alt="Create word">
            </button>
        </div>

        <PopupContainer ref="tagSelector" @onClose="editingTags = false">
            <div id="tag-selector-popup">
                <div id="tag-top">
                    <h1>Select tag</h1>

                    <div id="editing-suite">
                        <button @click="addNewTag()">
                            <img src="../assets/plus.svg" alt="Add new tag">
                        </button>
                        <button v-show="!editingTags" @click="editingTags = true">
                            <img src="../assets/edit.svg" alt="Edit button">
                        </button>
                        <button v-show="editingTags" @click="editingTags = false">Stop editing</button>
                    </div>
                </div>

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

        <PopupContainer ref="wordCreator">
            <div id="word-creator">
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

        <PopupContainer ref="drawingPopup">
            <DrawingArea 
                width="700px" 
                height="250px"
                v-model="newWordNoteDrawing"
            />
        </PopupContainer>

        <YesNo ref="yesNo" />
        <Ok ref="ok" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import Word from './Word.vue';
import PopupContainer from '../components/PopupContainer.vue';
import Wiggly from '../components/Wiggly.vue';
import YesNo from '../components/YesNo.vue';
import Ok from '../components/Ok.vue';
import DrawingPreview from '../components/DrawingPreview.vue';
import DrawingArea from '../components/DrawingArea.vue';
import Path from '../components/path';

// const fs = require('fs')

// import DrawingArea from '../components/DrawingArea.vue';

import Split from 'split.js'

import alphabets from './alphabets.ts'

const noTagWordFound = computed(() => {
    return words.value.find(value => value.tag === selectedTag.value) == undefined && selectedTag.value !== ''
})

const noSearchWordFound = computed(() => {
    return words.value.find(value => value.mainLang.toLowerCase().includes(searchingFor.value.toLowerCase())) == undefined && searchingFor.value !== ''
})


const props = defineProps<{
    mainLang: string,
    secondLang: string
}>()

const currentPage = ref<number>(1)
const totalPages = ref<number>(1)

const selectedLetter = ref('')
const selectedTag = ref('')
const searchingFor = ref('')

const sideMenuOpened = ref(false)

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

function openDrawer() {
    drawingPopup.value.openPopup()
}

function createNewWord() {
    wordCreator.value.openPopup();
}

function saveNewWord() {
    words.value.push({
        id: Math.random(),
        mainLang: newWordMainLang.value,
        secondLang: newWordSecondLang.value,
        notes: newWordNoteDrawing.value,
        tag: newWordTag.value
    })

    closeWordCreator()
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
    
                tags.value.splice(tags.value.indexOf(tag), 1)
                console.log(tags.value)
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

const currentAlphabet = ref(alphabets[props.mainLang])




interface Word {
    mainLang: string,
    secondLang: string,
    notes: Path[],
    tag: string
}

const words = ref([
    {
        id: 94193412949123,
        mainLang: 'mi nombre es BEERLINER',
        secondLang: 'ich bin ein berliner',
        notes: <Path[]>[],
        tag: 'greetings'
    },
    {
        id: 123,
        mainLang: 'como estas',
        secondLang: 'wie gehts dir',
        notes: <Path[]>[],
        tag: ''
    },
    {
        id: 23442341231243,
        mainLang: 'mi nombre es',
        secondLang: 'mein name ist',
        notes: <Path[]>[],
        tag: ''
    },

])

const tags = ref([
    'greetings',
    'nouns',
    'verbs',
    'adjectives',
    'adverbs',
    'prepositions',
    'conjunctions',
    'interjections',
    'articles',
    'determiners',
    'pronouns',
    'numbers',
    'quantifiers',
    'demonstratives',
    'possessives',
    'interrogatives',
    'indefinites',
])

function onWordEdit(index: number, mainWord: string, secondWord: string) {
    words.value.find((word, i) => {
        if(i === index) {
            word.mainLang = mainWord
            word.secondLang = secondWord
            return true
        }
    })

    orderWords()
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
})


</script>

<style scoped lang="scss">

$bar-height: 70px;

hr {
    width: 90%;
    margin-top: 15px;
    margin-bottom: 30px;
    border-top: 2px solid #ffca67;
    box-shadow: none;
}

#side-bar {
    display: flex;
    flex-direction: column;
    background: linear-gradient(10deg, rgb(255, 185, 80), rgb(255, 161, 72));
    height: 100%;
    width: 300px;
    position: fixed;
    left: -300px;
    z-index: 11;
    transition: cubic-bezier(0.23, 1, 0.320, 1) .3s;

    border-right: 1px solid black;

    &.opened {
        left: 0;
    }
}

nav {
    height: $bar-height;
    background: white;
    position: fixed;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

    z-index: 10;
}

main {
    min-height: 100vh;
    width: 100%;
    background: linear-gradient(100deg, #ffb25b, #ffb158);
    background-position: fixed;

    display: flex;
    justify-content: center;

    #main-wrapper {

        width: 70%;
        height: auto;
        padding-top: 100px;

        display: flex;
        flex-direction: column;

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
                background: white;
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
            background: white;
            border-radius: 10px;
            border: 1px solid rgb(235, 175, 120);
            // border: 1px solid #727272;

            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

            z-index: 1;
            
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

#bottom-bar {
    background: white;
    height: $bar-height;
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

    z-index: 10;

    div {
        margin-left: 5px;
        display: flex;
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
            transform: scale(0.95);
        }
    }

    #page-indicator {
        display: flex;
        gap: 10px;

        position: absolute;
        right: 50%;
        transform: translateX(50%);
    }

    #tag-indicator {
        position: absolute;
        left: 10px;
        top: -50px;
        background: white;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        border-radius: 5px;
        min-width: 200px;
        height: 30px;
        padding: 5px;

        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
    }
}

</style>