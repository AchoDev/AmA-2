<template>

    <div id="menu">

        
        <div id="top-bar">
            <div>
                <img src="../assets/logo.svg" alt="Logo">
                <h1>Your dictionary</h1>
            </div>
            <button @click="togglePage">toggle</button>
        </div>

        <svg :class="open ? 'open' : ''">
            <path id="back-cover" d="M800 100L1300 100L1300 850L800 850L800 100Z" fill="#ffa633" fill-rule="nonzero" opacity="1" stroke="black"/>
            <path id="bind" d="M750 100L800 100L800 850L750 850" fill="#ffa633" fill-rule="nonzero" opacity="1" stroke="black"/>
            <path id="right-page" d="M775 125 C1275 125, 1275 125, 1275 125 L1275 875 C 775 875, 775 875, 775 875" fill="white" fill-rule="nonzero" opacity="1" stroke="black"/>
            <path :style="`visibility: ${secondHalfOpen ? 'hidden' : 'visible'}`" id="left-page" d="M775 125 C1275 125, 1275 125, 1275 125 L1275 875 C 775 875, 775 875, 775 875" fill="white" fill-rule="nonzero" opacity="1" stroke="black"/>
            <path id="front-cover" d="M750 100L1250 100L1250 850L750 850L750 100Z" fill="#ffa633" fill-rule="nonzero" opacity="1" stroke="black"/>
            <path :style="`visibility: ${secondHalfOpen ? 'visible' : 'hidden'}`" id="left-page-inner" d="M775 125 C1275 125, 1275 125, 1275 125 L1275 875 C 775 875, 775 875, 775 875" fill="white" fill-rule="nonzero" opacity="1" stroke="black"/>
        </svg>
    </div>

</template>

<script setup lang="ts">

import {ref} from 'vue';

const open = ref(false);

const secondHalfOpen = ref(false);

function togglePage() {
    

    if(open.value) {
        setTimeout(() => {
            secondHalfOpen.value = false;
            console.log("HALF CLOSED")
        }, 500);
    } else {
        setTimeout(() => {
            secondHalfOpen.value = true;
            console.log("HALF open")
        }, 500);
    }


    open.value = !open.value;
}   

</script>

<style scoped lang="scss">

#menu {
    display: flex;
    justify-content: center;
    min-height: 100vh;
    max-height: 100vh;

    max-width: 100vw;
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

    div {
        display: flex;
        align-items: center;

        img {
            height: 80px;
            margin-right: 10px;
        }
    }
}

svg {
    -webkit-perspective: 2814px;
    width: 2000px;
    height: 1000px;
    transform: scale(0.7);
    transition: cubic-bezier(0.4, 0, 0.2, 1) 1.5s;
    
    path {
        transform-origin: center;
        transition: transform cubic-bezier(0.4, 0, 0.2, 1) 1.5s, d cubic-bezier(0.4, 0, 0.2, 1) 1.5s;
    }

    #left-page, #left-page-inner, #right-page {
        transform-origin: 775px center;
        transform: translateZ(10px);
        // -webkit-perspective: 4000px;
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

    transform: scale(0.9);

    $right-movement: -90px;

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
        d: path('M775 125 C800 150, 925 190, 1275 190 L1275 925 C 875 950, 775 875, 775 875')
    }

    
    #right-page {
        transform: translateX($right-movement) translateY(-25px);
        d: path('M775 125 C800 150, 925 190, 1275 190 L1275 925 C 875 950, 775 875, 775 875')
    }
}

</style>