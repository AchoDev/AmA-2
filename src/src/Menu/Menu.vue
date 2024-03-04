<template>

    <div id="menu">

        <PopupContainer 
            ref="newDictPopup"
            background="white"

            @on-close-end="resetCreation()"
        >
            <div id="new-dict">
                <Transition name="slide">
                    <div id="language-selector" v-if="creationStep === 0">
                        <h1>Choose the language <span class="highlight">You</span> want to learn</h1>
                        
                        <div>
                            <button 
                                v-for="language in Object.keys(alphabets)"
                                @click="selectLanguage(language)"
                            >
                                <img :src="`./cultures/${language}.png`" alt="">
                                <span>{{ language }}</span>
                            </button>
                        </div>
                    </div>
                    <div id="language-selector" v-else-if="creationStep === 1">
                        <h1>Choose the language you are <span class="highlight">familiar</span> with</h1>
                        
                        <div>
                            <button 
                                v-for="language in Object.keys(alphabets)"
                                @click="selectSecondLanguage(language)"
                            >
                                <img :src="`./cultures/${language}.png`" alt="">
                                <span>{{ language }}</span>
                            </button>
                        </div>
                    </div>
                    
                    <div id="name-selector" 
                        v-else-if="creationStep === 2"
                        :class="newBookOpen ? 'visible' : ''"
                    >

                        <Book 
                            :main-lang="selectedLang"
                            :second-lang="secondSelectedLang"
                            :word-count="0"
                            :page-open="false"
                            :title="newDictName"
                            class="book"

                            @begin-open="beginOpen()"
                            @completed-open="createBook()"
                        />

                        <h2>Title for <span class="highlight">your new</span> dicionary</h2>
                        <div>
                            <input type="text" v-model="newDictName">
                            <button @click="selectRandomName()">
                                <img src="../assets/dice.svg" alt="Random name">
                            </button>
                        </div>
    
                        <br>
    
                        <h2></h2>
                    </div>
                </Transition>

            </div>
        </PopupContainer>
        
        <div id="top-bar" :class="bookOpen ? 'open-navbar' : ''">
            <div>
                <img src="../assets/logo.svg" alt="Logo">
                <h1>Your dictionar{{ dictionaries.length > 1 ? 'ies' : 'y' }}</h1>
            </div>
            
        </div>

        <div id="move-buttons">
            <button :class="currentScrollItem <= 0 ? 'hidden' : ''" @click="moveLeft()">
                <img src="../assets/arrow.svg" alt="Left">
            </button>
            <button :class="currentScrollItem >= dictionaries.length - 1 ? 'hidden' : ''" @click="moveRight()">
                <img src="../assets/arrow.svg" alt="Right">
            </button>
        </div>

        <div id="new-dict-button" :class="bookOpen ? 'open' : ''">
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
                :title="dictionary.title"
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
import PopupContainer from '../components/PopupContainer.vue';
import alphabets from '../DictionaryPage/alphabets';

import raw from '../dictionaries.json';

const dictionaries = ref<Dictionary[]>(raw);

console.log(dictionaries.value)

const emit = defineEmits(['openBook']);
const bookOpen = ref(false);

function openBook(dictionary: Dictionary) {
    emit('openBook', dictionary);
}



const domBookWrapper = ref<HTMLElement>();
const currentScrollItem = ref(0)

// New dictionary

const newDictPopup = ref<typeof PopupContainer>();
const creationStep = ref(0)
const selectedLang = ref('')
const secondSelectedLang = ref('')
const newDictName = ref('')

const newBookOpen = ref(false);

function selectRandomName() {

    const names = [
        'Learning journey',
        'My new book',
        'Vocabulary book',
        'Book of words',
        'Dictionary',
        'My dictionary',
        'My words',
        'Me VS ' + selectedLang.value,
        'I love ' + selectedLang.value,
        'My ' + selectedLang.value + ' words',
        'My ' + selectedLang.value + ' dictionary',
        'Orange book',
        'Book of the UA',
        selectedLang.value + ' words',
        selectedLang.value + ' - ' + secondSelectedLang.value,
        'Book of Lugunica',
        'Book of the Clover Kingdom',
        'My book, for me',
        'My book, for you',
        'My book, for us',
        'Fluency test',
        'My fluency test',
        'My next language',
        'My next language book',
        'I love AmA',
    ]

    newDictName.value = names[Math.floor(Math.random() * names.length)];

    return newDictName.value;
}

function selectLanguage(lang: string) {
    selectedLang.value = lang;
    creationStep.value = 1;
}

function selectSecondLanguage(lang: string) {
    secondSelectedLang.value = lang
    newDictName.value = selectRandomName();
    creationStep.value = 2;
}

function createNew() {
    newDictPopup.value?.openPopup();
}

function beginOpen() {
    newBookOpen.value = true
}

function resetCreation() {
    creationStep.value = 0;
    selectedLang.value = '';
    secondSelectedLang.value = '';
    newDictName.value = '';
    newBookOpen.value = false;
}

function createBook() {
    dictionaries.value.push({
        pages: <Page[]>[],
        title: newDictName.value,
        tags: [],
        mainLang: selectedLang.value,
        secondLang: secondSelectedLang.value,
        words: []
    })

    resetCreation();
    openBook(dictionaries.value[dictionaries.value.length - 1]);
}

// new dictionary end

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
        margin: 20px;
        border: none;
        width: 100px;
        height: 100px;
        border-radius: 100px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        transition: ease .2s;

        &.hidden {
            opacity: 0;
        }

        &:first-child img {
            transform: rotate(180deg);
        }

        display: grid;
        place-items: center;

        img {
            width: 60%;
            height: 60%;
        }

        &:active {
            filter: brightness(1.3);
            transform: translateX(20px);
        }
        
        &:first-child:active {
            transform: translateX(-20px);
        }
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

        transition: ease .2s;
        &:active {
            transform: scale(0.9);
        }
    }

    transition: cubic-bezier(0.47, 0, 0.745, 0.715) .7s;
    &.open {
        bottom: -100px;
    }
}

#new-dict {
    width: 90vw;
    height: 90vh;

    display: grid;
    place-items: center;

    transition: ease-in-out .2s;

    overflow-x: hidden;
    
    div {

        grid-column: 1;
        grid-row: 1;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        height: 100%;
        width: 100%;
        

        $move-amount: 500px;
        transition: ease-in .3s;
        &.slide-enter-active {
            transform: translateX($move-amount);
            opacity: 0;
        }
        
        &.slide-enter-to {
            transform: translateX(0);
            opacity: 1;
            transition: ease-out .3s;
            transition-delay: .3s;
        }

        &.slide-leave-active {
            transform: translateX(0px);
            opacity: 0;
        }
        
        &.slide-leave-to {
            transform: translateX(-$move-amount);
        }
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

    #language-selector {
        overflow: hidden;
        height: 100%;
        width: 80%;

        div {
            padding: 20px 30px;
            width: auto;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-column-gap: 30px;
            grid-row-gap: 30px;
            height: 100%;
            // width: 80%;
            overflow-y: scroll;


            button {
                width: 100%;
                height: 100%;
                background: transparent;
                border: none;
                padding: 0;
                margin: 0;
                border-radius: 30px;
                // overflow: hidden;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 30px;
                }

                transition: ease .2s;
                &:active {
                    transform: scale(0.9)
                    
                }
            }

        }
    }

    #name-selector {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: end;
        height: 100%;
        width: 80%;

        input[type="text"] {
            width: 40%;
            height: 50px;
            border: none;
            border-radius: 10px;
            padding: 10px;
            text-align: center;
            font-size: 20pt;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            font-family: Maven Pro, sans-serif !important;

            &:focus {
                outline: none;
            }
        }

        &:before {
            content: '';
            width: 320px;
            transform: translateX(20px);
            height: 500px;
            top: 160px;
            
            // box-shadow: 0 0 100px rgba(0, 0, 0, 0.507);
            z-index: -1;
            position: absolute;
            background: rgba(0, 0, 0, 0.342);
            filter: blur(30px);

            transition: width cubic-bezier(0.4, 0, 0.2, 1) 1s, filter ease-in 1.3s, background ease-in 1.3s;
            transition-delay: .3s;
            // transition-delay: 1s;
        }

        &.visible:before {
            width: 600px;
            filter: blur(100px);
            background: rgba(0, 0, 0, 0.185);
        }

        div {
            flex-direction: row;
            height: auto;
            justify-content: center;
            gap: 10px;

            button {
                width: 60px;
                height: 60px;
                border: none;
                background: orange;
                border-radius: 100px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

                img {
                    width: 100%;
                    height: 100%;
                    
                }

                transition: ease-out .1s;
                &:active {
                    transform: scale(0.9);
                }
            }
        }


        .book {
            position: absolute;
            top: -100px;
        }
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