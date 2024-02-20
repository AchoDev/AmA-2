<template>

    <div id="menu">

        
        
        <div id="top-bar" :class="bookOpen ? 'open-navbar' : ''">
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
                :words="dictionary.words"
                :page-open="false"
                class="book"

                @book-open="bookOpen = true"
                @book-close="bookOpen = false"
            />
        </div>
        
        
    </div>

</template>

<script setup lang="ts">

import { ref } from 'vue';
import Book from './Book.vue';

const bookOpen = ref(false);

const dictionaries = ref([
    {
        mainLang: 'spanish',
        secondLang: 'german',
        words: [
            {
                main: 'hola',
                second: 'hallo'
            },
            {
                main: 'adios',
                second: 'tschüss'
            },
            {
                main: 'casa',
                second: 'haus'
            }
        ]
    },
    {
        mainLang: 'spanish',
        secondLang: 'german',
        words: [1, 2, 3]
    },
    {
        mainLang: 'spanish',
        secondLang: 'german',
        words: [1, 2, 3]
    },
    {
        mainLang: 'spanish',
        secondLang: 'german',
        words: [1, 2, 3]
    },
    {
        mainLang: 'spanish',
        secondLang: 'german',
        words: [1, 2, 3]
    },
])

</script>

<style scoped lang="scss">

#aaaa {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 100;
}

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