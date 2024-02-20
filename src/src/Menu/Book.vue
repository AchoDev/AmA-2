<template>
    <div id="svg-wrapper-wrapper">
        <div id="svg-wrapper">
            <svg :class="open ? 'open' : ''">
                <path id="back-cover" d="M800 100L1300 100L1300 850L800 850L800 100Z" fill="#ffa633" fill-rule="nonzero" opacity="1" stroke="white" stroke-width="5" stroke-linejoin="round" />
                <path id="bind" d="M750 100L800 100L800 850L750 850" fill="#ffa633" fill-rule="nonzero" opacity="1" stroke="white" stroke-width="5" stroke-linejoin="round"/>
                
                <path id="right-page" d="M775 125 C1275 125, 1275 125, 1275 125 L1275 875 C 775 875, 775 875, 775 875" fill="white" fill-rule="nonzero" opacity="1" stroke="black" stroke-linecap="round"/>
                
                <path :style="`visibility: ${secondHalfOpen ? 'hidden' : 'visible'}`" id="left-page" d="M775 125 C1275 125, 1275 125, 1275 125 L1275 875 C 775 875, 775 875, 775 875 L775 125" fill="white" fill-rule="nonzero" opacity="1" stroke="black" stroke-linejoin="round"/>
                
                <path id="front-cover" d="M750 100L1250 100L1250 850L750 850L750 100Z" fill="#ffa633" fill-rule="nonzero" opacity="1" stroke="white" stroke-width="5" stroke-linejoin="round"/>
                
                <path id="right-top-pageblock" d="M750 150 C1240 150, 1250 150, 1250 150 L1275 125 C775 125, 775 125, 775 125" :stroke="secondHalfOpen ? 'black' : 'white'" fill="white"/>
                <path id="right-side-pageblock" d="M1275 875 L1275 125 L1250 150 L1250 900 L1275 875" :stroke="secondHalfOpen ? 'black' : 'white'" fill="white"/>
                
                <path id="middle-page" v-show="open" :class="middlePageOpen ? 'middle-open' : ''" d="M775 125 C1275 125, 1275 125, 1275 125 L1275 875 C 775 875, 775 875, 775 875" fill="white" fill-rule="nonzero" opacity="1" stroke="black" stroke-linecap="round"/>
                <path id="left-top-pageblock" d="M750 150 C1250 150, 1250 150, 1250 150 L1275 125 C775 125, 775 125, 775 125" :stroke="secondHalfOpen ? 'black' : 'white'" fill="white"/>
                <path id="left-side-pageblock" d="M1275 875 L1275 125 L1250 150 L1250 900 L1275 875" :stroke="secondHalfOpen ? 'black' : 'white'" fill="white"/>
                
                <path id="left-page-inner" :style="`visibility: ${secondHalfOpen ? 'visible' : 'hidden'}`" d="M775 125 C1275 125, 1275 125, 1275 125 L1275 875 C 775 875, 775 875, 775 875 L775 125" fill="white" fill-rule="nonzero" opacity="1" stroke="black" />
                
                <path id="middle-page-inner" :class="middlePageOpen ? 'middle-open' : ''" :style="`visibility: ${middlePageHalfOpen && open ? 'visible' : 'hidden'}`" d="M775 125 C1275 125, 1275 125, 1275 125 L1275 875 C 775 875, 775 875, 775 875 L775 125" fill="white" fill-rule="nonzero" opacity="1" stroke="black" />
            </svg>
            

            <div id="clicker" @click="clicker">
                &nbsp;
            </div>
        </div>

        <button id="right-button" @click="toggleMiddlePage">
            <img src="../assets/arrow.svg" alt="Go to pages">
        </button>
    </div>
</template>

<script setup lang="ts">

import {ref, watch} from 'vue';

const props = defineProps<{
    mainLang: string,
    secondLang: string,
    pageOpen: boolean
}>()

const open = ref(false)
const secondHalfOpen = ref(false);


const middlePageOpen = ref(false);
const middlePageHalfOpen = ref(false);

function clicker() {
    togglePage()
    if(!open.value) {
    }
}

function togglePage() {
    const duration = 1500;
    if(open.value) {
        emit('bookClose')
        middlePageOpen.value = false;
        setTimeout(() => {
            middlePageHalfOpen.value = false;
            secondHalfOpen.value = false;
            console.log("HALF CLOSED")
        }, 1350);
    } else {
        emit('bookOpen')
        setTimeout(() => {
            secondHalfOpen.value = true;
            console.log("HALF open")
        }, duration / 3);
    }


    open.value = !open.value;
}

function toggleMiddlePage() {
    const duration = 1500;
    if(middlePageHalfOpen.value) {
        middlePageOpen.value = false;
        setTimeout(() => {
            middlePageHalfOpen.value = false;
            console.log("MIDDLE HALF CLOSED")
        }, 1350);
    } else {
        middlePageOpen.value = true;
        setTimeout(() => {
            middlePageHalfOpen.value = true;
            console.log("MIDDLE HALF open")
        }, duration / 3);
    }
}

watch(() => props.pageOpen, () => {
    togglePage()
})

const emit = defineEmits(['bookOpen', 'bookClose'])

</script>

<style scoped lang="scss">

#right-button {
    position: absolute;
    right: 20px;
    height: 70%;
    cursor: pointer;
    width: 80px;

    z-index: 10;

    img {
        width: 100%;
        height: 100%;
    }

    transition: ease-out .1s;

    &:active {
        transform: scale(0.95) translateX(5px);
    }
}

#svg-wrapper-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    position: relative;

}

#clicker {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 500px;
    cursor: pointer;
    z-index: 5;
    // background-color: red;


    -webkit-tap-highlight-color: transparent;
    
}

#svg-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    // height: 100%;
    // width: 100%;
    // overflow: hidden;
    position: relative;

    width: auto;
    // transform: scale(0.7);
    // transition: cubic-bezier(0.4, 0, 0.2, 1) 1.5s;

}

$transition-duration: 1500ms;

svg {
    -webkit-perspective: 2814px;
    width: 2000px;
    height: 1000px;
    transform: scale(0.6) ;
    transition: cubic-bezier(0.4, 0, 0.2, 1) 1.7s;


    path {
        transform-origin: center;
        // transform: translateX(calc(100% - 50px));
        
        transition: stroke ease,  transform cubic-bezier(0.755, 0.05, 0.855, 0.06) $transition-duration, d cubic-bezier(0.755, 0.05, 0.855, 0.06) $transition-duration;
        // transition: cubic-bezier(0.55, 0.085, 0.68, 0.53) $transition-duration, d cubic-bezier(0.55, 0.085, 0.68, 0.53) $transition-duration;
    }

    #left-page, #left-page-inner, #right-page, #middle-page, #middle-page-inner, #left-top-pageblock, #left-side-pageblock, #right-top-pageblock, #right-side-pageblock {
        transform-origin: 775px center;
        transform: translateZ(10px);
        // -webkit-perspective: 4000px;
    }

    // #left-top-pageblock {
    //     d: path('M775 125 C800 150, 925 190, 1275 190 L1290 175 C1000 165, 975 170, 800 125')
    // }

    #right-side-pageblock, #right-top-pageblock {
        transform: translateX(25px) translateY(-25px);
    }

    #front-cover {
        transform: translateY(50px);
        transform-origin: 750px center;
    }
    #bind {
        d: path('M750 150L800 100L800 850L750 900')
    }
}

.open {

    transform: scale(0.9) translateY(0px);

    $right-movement: 220px;

    path {
        transition: transform cubic-bezier(0.4, 0, 0.2, 1) $transition-duration, d cubic-bezier(0.4, 0, 0.2, 1) $transition-duration;
    }

    #front-cover {
        transform: rotateY(180deg) translateX(-$right-movement);
        d: path('M750 100L1250 150L1250 900L750 850L750 100Z');

        // M750 100L1250 100L1250 850L750 850L750 100Z
    }

    #back-cover {
        transform: translateX($right-movement);
        d: path('M800 100L1300 150L1300 900L800 850L800 100Z')
    }


    #bind {
        transform: translateX($right-movement);
        d: path('M750 100L800 100L800 850L750 850')
    }

    #left-page, #left-page-inner {
        transform: rotateY(180deg) translateX(-$right-movement) translateY(-25px) translateZ(10px);
        d: path('M775 125 C800 150, 925 190, 1275 190 L1275 925 C 875 950, 775 875, 775 875 L775 125')
    }

    
    #right-side-pageblock {
        d: path("M1265 885 L1265 150 L1250 165 L1250 900 L1265 885");
        transform: translateX($right-movement + 25px) translateY(0px) translateZ(10px);
    }
    
    #right-top-pageblock {
        d: path("M775 125 C800 150, 925 190, 1275 190 L1290 175 C1000 165, 975 170, 800 125");
        transform: translateX($right-movement) translateY(-25px) translateZ(10px);
    }
    
    #left-side-pageblock {
        d: path("M1265 885 L1265 150 L1250 165 L1250 900 L1265 885");
        transform: rotateY(180deg) translateX(-$right-movement + 25px) translateY(0px) translateZ(10px);
    }
    
    #left-top-pageblock {
        d: path("M775 125 C800 150, 925 190, 1275 190 L1290 175 C1000 165, 975 170, 800 125");
        transform: rotateY(180deg) translateX(-$right-movement) translateY(-25px) translateZ(10px);
    }
    
    
    #right-page, #middle-page, #middle-page-inner{
        transform: translateX($right-movement) translateY(-25px);
        d: path('M775 125 C800 150, 925 190, 1275 190 L1275 925 C 875 950, 775 875, 775 875')
    }

    .middle-open {
        transform: rotateY(180deg) translateX(-$right-movement) translateY(-25px) translateZ(10px) !important;
    }
}

</style>