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
            <div v-for="letter in currentAlphabet">
                {{letter}}
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
import { ref } from 'vue';  

import alphabets from './alphabets.ts'

const props = defineProps<{
    mainLang: string,
    secondLang: string
}>()

const currentPage = ref(1)
const totalPages = ref(1)

const currentAlphabet = ref(alphabets[props.mainLang])

</script>

<style scoped lang="scss">

$bar-height: 70px;

nav {
    height: $bar-height;
    background: white;
    position: fixed;
    top: 0;
    display: flex;
    justify-content: space-between;
    width: 100%;
}

main {
    min-height: 100vh;
    width: 100%;
    background: linear-gradient(180deg, #ff8800, #ffcf76);
}

#bottom-bar {
    background: white;
    height: $bar-height;
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    width: 100%;
}

</style>