<template>

    <div id="menu">

        
        
        <div id="top-bar" :class="bookOpen ? 'open-navbar' : ''">
            {{ currentScrollItem }}
            <div>
                <img src="../assets/logo.svg" alt="Logo">
                <h1>Your dictionary</h1>
            </div>
            
        </div>

        <div id="book-wrapper" 
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

import { computed, onMounted, ref } from 'vue';
import Book from './Book.vue';
import {Dictionary, Page} from '../components/dictionaryType.ts'
import Path from '../components/path';

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

let domBookWrapper: HTMLElement | null = null;


// TODO domBookWrapper always null for some reason
const currentScrollItem = computed(() => {
    if(domBookWrapper === null) {
        domBookWrapper = document.getElementById('book-wrapper');
    }
    if(domBookWrapper === null) return 0;
    // return Math.round((domBookWrapper.scrollLeft / domBookWrapper.clientWidth) * dictionaries.value.length);
    return domBookWrapper.scrollLeft
})

onMounted(() => {
    domBookWrapper = document.getElementById('book-wrapper');
    console.log(domBookWrapper);
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

    .book {
        scroll-snap-align: center;
    }
}



</style>