<template>
    <div>
        
        <nav>
            <div>
                <span>ama img</span>
                <button> >> </button>
            </div>

            <div>{{mainLang}} - {{secondLang}}</div>

            <div>
                <button>...</button>
            </div>
        </nav>

        <main>
            <div id="main-wrapper">
                <div id="letter-container">
                    <div v-for="letter in currentAlphabet">
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

                        @onWordEdit="onWordEdit" 
                    />

                    <!-- <center>
                        <DrawingArea width="750px" height="500px"/>
                    </center> -->
                </div>
            </div>

        </main>

        <div id="bottom-bar">
            <button>search</button>

            <div>
                <button> &vartriangleleft; </button>

                <span>Page {{ currentPage }}/{{ totalPages }}</span>

                <button> &vartriangleright; </button>
            </div>

            <button>+ Add word</button>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Word from './Word.vue';
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

const currentAlphabet = ref(alphabets[props.mainLang])

interface Note {
    color: string,
    points: number[][]
}

const words = ref([
    {
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
        ]
    },
    {
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
        ]
    },

])

function onWordEdit(index: number, mainWord: string, secondWord: string, notes: Note[]) {
    words.value[index].mainLang = mainWord
    words.value[index].secondLang = secondWord
    words.value[index].notes = notes
}



const wordSizes = ref([33, 33, 33])

onMounted(() => {

    // console.log(mainLangHTMLElement)

    

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
    margin-bottom: 40px; 
    border-color: #ffd7bc;
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
    background: linear-gradient(180deg, #ff7c24, #ffb45f);

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
                width: 100%;
                margin: 0 1px;
                height: 50px;
                background: white;
                
                display: grid;
                place-items: center;

                border-top-right-radius: 10px;
                border-top-left-radius: 10px;

                transform: translateY(15px);
                transition: ease-out 0.05s;
                user-select: none;
                &:hover {
                    transform: translateY(5px)
                }
            }
        }

        #page-container {
            min-height: 90%;
            background: white;
            border-radius: 10px;
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
                        font-weight: normal;
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
}

</style>