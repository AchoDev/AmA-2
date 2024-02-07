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
                        v-for="word in words" 
                        :mainLangWord="word.mainLang" 
                        :secondLangWord="word.secondLang" 
                        :notes="word.notes"
                        :sizes="wordSizes"

                        v-show="
                            (selectedTag === '' || word.tag == selectedTag) && 
                            (selectedLetter === '' || word.mainLang.charAt(0).toLowerCase() === selectedLetter.toLowerCase())
                            && (searchingFor === '' || word.mainLang.toLowerCase().includes(searchingFor.toLowerCase()))"

                        @onWordEdit="onWordEdit" 
                    />

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

            <button>+ Add word</button>
        </div>

        <PopupContainer ref="tagSelector" @onClose="editingTags = false">
            <div id="tag-selector-popup">
                <div id="tag-top">
                    <h1>select tag</h1>

                    <div id="editing-suite">
                        <button v-show="!editingTags" @click="editingTags = true">edit tags</button>
                        <button v-show="editingTags" @click="editingTags = false">Stop editing</button>
                    </div>
                </div>

                <div id="tag-button-wrapper">
                    
                    <div
                        v-for="(tag, id) in tags"
                        :key="id"
                    >
                        <button id="edit" v-show="editingTags" :style="`opacity: ${editingTags ? 1 : 0}`">e</button>
                        <button id="delete" v-show="editingTags" :style="`opacity: ${editingTags ? 1 : 0}`">d</button>
                        <Wiggly 
                            
                            :wiggle="editingTags"
                        >
                            <button 
                                class="tag-button"
                                :class="!editingTags ? 'tag-button-static' : ''"
                                @click="selectTag(tag)"
                            >
                                <span>{{ tag }}</span>
                            </button>
                        </Wiggly>
                    </div>
                </div>
            </div>
        </PopupContainer>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Word from './Word.vue';
import PopupContainer from '../components/PopupContainer.vue';
import Wiggly from '../components/Wiggly.vue';

// const fs = require('fs')

// import DrawingArea from '../components/DrawingArea.vue';

import Split from 'split.js'

import alphabets from './alphabets.ts'

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

function openTagMenu() {
    tagSelector.value.openPopup()
}

function selectTag(tag: string) {
    if(editingTags.value) return
    selectedTag.value = tag
    tagSelector.value.closePopup()
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



interface Note {
    color: string,
    points: number[][]
}

interface Word {
    mainLang: string,
    secondLang: string,
    notes: Note[],
    tag: string
}

const words = ref([
    {
        id: 94193412949123,
        mainLang: 'hola',
        secondLang: 'hallo',
        notes: <Note[]>[
            {
                color: 'black',
                points: [
                    [10, 10],
                    [20, 10],
                    [40, 40],
                ]
            }
        ],
        tag: 'greetings'
    },
    {
        id: 23442341231243,
        mainLang: 'como estas',
        secondLang: 'wie gehts dir',
        notes: <Note[]>[
            {
                color: 'black',
                points: [
                    [10, 10],
                    [20, 10],
                    [40, 40],
                ]
            }
        ],
        tag: ''
    },

])

const tags = ref({
    10101010: 'greetings',
    1818918188: 'nouns',
    // give me 10 more random ones
    123131231: 'verbs',
    123123123: 'adjectives',
    1231243123: 'adverbs',
    1231123123: 'prepositions',
    1231232123: 'conjunctions',
    1231231223: 'interjections',
    12321253123: 'articles',
    12321235123: 'determiners',
    1231231231: 'pronouns',
    1231231232: 'numbers',
    1231231233: 'quantifiers',
    1231231234: 'demonstratives',
    1231231235: 'possessives',
    1231231236: 'interrogatives',
    1231231237: 'indefinites',
})

function onWordEdit(index: number, mainWord: string, secondWord: string, notes: Note[]) {
    words.value.find((word, i) => {
        if(i === index) {
            word.mainLang = mainWord
            word.secondLang = secondWord
            word.notes = notes
            return true
        }
    })
}

const wordSizes = ref([33, 33, 33])

onMounted(() => {

    words.value = words.value.sort((a, b) => {
        if (a.mainLang < b.mainLang) {
            return -1
        }
        if (a.mainLang > b.mainLang) {
            return 1
        }
        return 0
    })    

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

            width: 30px;
            height: 30px;
            transition: ease-out .2s;
            &:hover {
                transform: scale(1.1);
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