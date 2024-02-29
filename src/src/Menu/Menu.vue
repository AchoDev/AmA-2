<template>

    <div id="menu">

        <PopupContainer 
            ref="newDictPopup"
            background="white"
        >
            <div id="new-dict">
                <div id="language-selector">
                    <h1>Choose the language <span class="highlight">You</span> want to learn</h1>
                    
                    <div>
                        <button></button>
                    </div>

                    <button @click="creationStep++">Next</button>
                </div>
            </div>
        </PopupContainer>
        
        <div id="top-bar" :class="bookOpen ? 'open-navbar' : ''">
            {{ currentScrollItem }}
            <div>
                <img src="../assets/logo.svg" alt="Logo">
                <h1>Your dictionar{{ dictionaries.length > 1 ? 'ies' : 'y' }}</h1>
            </div>
            
        </div>

        <div id="move-buttons">
            <button @click="moveLeft()">Left</button>
            <button @click="moveRight()">Right</button>
        </div>

        <div id="new-dict-button">
            <button @click="createNew()">
                <img src="../assets/plus.svg" alt="New"> New dictionary
            </button>
        </div>

        <div 
            id="book-wrapper"
            ref="domBookWrapper"
            :style="bookOpen ? 'overflow: hidden' : 'overflow: scroll'"
        >
            <Book 
                v-for="dictionary, i in dictionaries"
                :key="i"
                :main-lang="dictionary.mainLang"
                :second-lang="dictionary.secondLang"
                :word-count="dictionary.words.length"
                :page-open="false"
                class="book"

                @begin-open="bookOpen = true"
                @completed-open="openBook(dictionary)"
            />
        </div>
        
        
    </div>

</template>

<script setup lang="ts">

import { onMounted, ref } from 'vue';
import Book from './Book.vue';
import {Dictionary, Page} from '../components/dictionaryType.ts'
import Path from '../components/path';
import PopupContainer from '../components/PopupContainer.vue';

const emit = defineEmits(['openBook']);
const bookOpen = ref(false);

function openBook(dictionary: Dictionary) {
    emit('openBook', dictionary);
}

const dictionaries = ref<Dictionary[]>([
    {   
        pages: <Page[]>[],
        title: 'Spanish - German',
        tags: [
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
        ],
        mainLang: 'spanish',
        secondLang: 'german',
        words: [
            {
                mainLang: 'mi nombre es BEERLINER',
                secondLang: 'ich bin ein berliner',
                notes: <Path[]>[],
                tag: 'greetings'
            },
            {
                mainLang: 'como estas',
                secondLang: 'wie gehts dir',
                notes: <Path[]>[],
                tag: ''
            },
            {
                mainLang: 'mi nombre es',
                secondLang: 'mein name ist',
                notes: <Path[]>[],
                tag: ''
            },
            {
                mainLang: 'mi nombre es BEERLINER',
                secondLang: 'ich bin ein berliner',
                notes: <Path[]>[],
                tag: 'greetings'
            },
            {
                mainLang: 'como estas',
                secondLang: 'wie gehts dir',
                notes: <Path[]>[],
                tag: ''
            },
            {
                mainLang: 'mi nombre es',
                secondLang: 'mein name ist',
                notes: <Path[]>[],
                tag: ''
            },
            {
                mainLang: 'mi nombre es BEERLINER',
                secondLang: 'ich bin ein berliner',
                notes: <Path[]>[],
                tag: 'greetings'
            },
            {
                mainLang: 'como estas',
                secondLang: 'wie gehts dir',
                notes: <Path[]>[],
                tag: ''
            },
            {
                mainLang: 'mi nombre es',
                secondLang: 'mein name ist',
                notes: <Path[]>[],
                tag: ''
            },
            {
                mainLang: 'mi nombre es BEERLINER',
                secondLang: 'ich bin ein berliner',
                notes: <Path[]>[],
                tag: 'greetings'
            },
            {
                mainLang: 'como estas',
                secondLang: 'wie gehts dir',
                notes: <Path[]>[],
                tag: ''
            },
            {
                mainLang: 'mi nombre es',
                secondLang: 'mein name ist',
                notes: <Path[]>[],
                tag: ''
            },
            {
                mainLang: 'mi nombre es BEERLINER',
                secondLang: 'ich bin ein berliner',
                notes: <Path[]>[],
                tag: 'greetings'
            },
            {
                mainLang: 'como estas',
                secondLang: 'wie gehts dir',
                notes: <Path[]>[],
                tag: ''
            },
            {
                mainLang: 'mi nombre es',
                secondLang: 'mein name ist',
                notes: <Path[]>[],
                tag: ''
            },
            {
                mainLang: 'mi nombre es BEERLINER',
                secondLang: 'ich bin ein berliner',
                notes: <Path[]>[],
                tag: 'greetings'
            },
            {
                mainLang: 'como estas',
                secondLang: 'wie gehts dir',
                notes: <Path[]>[],
                tag: ''
            },
            {
                mainLang: 'mi nombre es',
                secondLang: 'mein name ist',
                notes: <Path[]>[],
                tag: ''
            },
        ]
    },
    
])

dictionaries.value[1] = dictionaries.value[0];
dictionaries.value[2] = dictionaries.value[0];
dictionaries.value[3] = dictionaries.value[0];

const domBookWrapper = ref<HTMLElement>();
const currentScrollItem = ref(0)

const newDictPopup = ref<typeof PopupContainer>();
const creationStep = ref(0)

function createNew() {
    newDictPopup.value?.openPopup();
}

function moveRight() {
    domBookWrapper.value?.scrollTo({left: domBookWrapper.value.clientWidth * (currentScrollItem.value + 1), behavior: 'smooth'});
}

function moveLeft() {
    domBookWrapper.value?.scrollTo({left: domBookWrapper.value.clientWidth * (currentScrollItem.value - 1), behavior: 'smooth'});
}

onMounted(() => {
    // console.log(domBookWrapper.value!.clientWidth);

    domBookWrapper.value!.addEventListener('scroll', () => {
        currentScrollItem.value = Math.round(domBookWrapper.value!.scrollLeft / domBookWrapper.value!.clientWidth);
    })
})

</script>

<style scoped lang="scss">


#menu {
    display: flex;
    justify-content: center;
    min-height: 100vh;
    max-height: 100vh;
    overflow: hidden;
    max-width: 100vw;

    background: linear-gradient(
        90deg,
        rgb(255, 178, 35),
        rgb(255, 174, 81),
    );
}

#top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // padding: 0 20px;
    height: 100px;
    background-color: #f5f5f5;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;

    transition: cubic-bezier(0.47, 0, 0.745, 0.715) .7s;

    div {
        display: flex;
        align-items: center;

        img {
            height: 80px;
            margin-right: 10px;
        }
    }

    &.open-navbar {
        top: -100px;
    }
}

#move-buttons {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    pointer-events: none;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    button {
        pointer-events: all;
    }
}

#new-dict-button {
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 10;

    button {
        width: 200px;
        height: 50px;
        background: white;
        border: none;
        border-radius: 100px;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        padding: 5px;
        font-size: 14pt;


        img {
            height: 100%;
        }
    }

}

#new-dict {
    width: 90vw;
    height: 90vh;

    display: grid;
    place-items: center;

    div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        height: 95%;
        width: 95%;
    }

    .highlight {
        color: white;
        background: #ffae00;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        padding: 5px;
        border-radius: 5px;
    }

    h1 {
        font-size: 32pt;
        letter-spacing: -2px;
        margin-bottom: 20px;
    }
}

#book-wrapper {
    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: row;
    width: 100%;

    position: relative;
    overflow: scroll;
    scroll-snap-type: x mandatory;

    overflow-y: hidden;
    scroll-behavior: smooth;

    .book {
        scroll-snap-align: center;
    }
}



</style>