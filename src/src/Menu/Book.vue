<template>
    <div id="svg-wrapper-wrapper">
        <div id="svg-wrapper">
            <svg :class="open ? 'open' : ''" viewBox="0 0 2000 1000">
                <path id="back-cover" d="M800 100L1300 100L1300 850L800 850L800 100Z" fill="#ffa633" fill-rule="nonzero" opacity="1" stroke="white" stroke-width="5" stroke-linejoin="round">
                    <animate 
                        attributeName="d" 
                        begin="indefinite"
                        dur="1.5s"
                        repeatCount="1" 
                        fill="freeze"
                        to="M800 100L1300 150L1300 900L800 850L800 100Z"
                        keySplines="0.4, 0, 0.2, 1"
                        keyTimes="0; 1"
                        calcMode="spline"
                    />
                </path>

                <path id="bind" d="M750 150L800 100L800 850L750 900" fill="#ffa633" fill-rule="nonzero" opacity="1" stroke="white" stroke-width="5" stroke-linejoin="round"> 
                    <animate 
                        attributeName="d" 
                        begin="indefinite" 
                        dur="1.5s"
                        repeatCount="1"
                        fill="freeze" 
                        to="M750 100L800 100L800 850L750 850"
                        calcMode="spline"
                        keyTimes="0; 1"
                        keySplines="0.4, 0, 0.2, 1"
                        />
                    </path>
                    
                    <path id="right-page" d="M775 125 C1275 125, 1275 125, 1275 125 L1275 875 C 775 875, 775 875, 775 875" fill="white" fill-rule="nonzero" opacity="1" stroke="black" stroke-linecap="round">
                        <animate 
                        attributeName="d" 
                        begin="indefinite" 
                        dur="1.5s" 
                        repeatCount="1" 
                        fill="freeze" 
                        to="M775 125 C800 150, 925 190, 1275 190 L1275 925 C 875 950, 775 875, 775 875"
                        calcMode="spline"
                        keyTimes="0; 1"
                        keySplines="0.4, 0, 0.2, 1"
                    />
                </path>
                
                <!-- <path :style="`visibility: ${secondHalfOpen ? 'hidden' : 'visible'}`" id="left-page" d="M775 125 C1275 125, 1275 125, 1275 125 L1275 875 C 775 875, 775 875, 775 875" fill="white" fill-rule="nonzero" opacity="1" stroke="black" stroke-linejoin="round"/> -->
                
                <path id="front-cover" d="M750 100L1250 100L1250 850L750 850L750 100Z" fill="#ffa633" fill-rule="nonzero" opacity="1" stroke="white" stroke-width="5" stroke-linejoin="round"> 
                    <animate 
                        attributeName="d" 
                        begin="indefinite" 
                        dur="1.5s" 
                        repeatCount="1" 
                        fill="freeze" 
                        to="M750 100L1250 150L1250 900L750 850L750 100Z"
                    />
                </path>
                
                <path id="right-top-pageblock" d="M750 150 C1240 150, 1250 150, 1250 150 L1275 125 C775 125, 775 125, 775 125" :stroke="secondHalfOpen ? 'black' : 'white'" fill="white">
                    <animate 
                        attributeName="d" 
                        begin="indefinite" 
                        dur="1.5s" 
                        repeatCount="1" 
                        fill="freeze" 
                        to="M775 125 C800 150, 925 190, 1275 190 L1290 175 C1000 165, 975 170, 800 125"
                        calcMode="spline"
                        keyTimes="0; 1"
                        keySplines="0.4, 0, 0.2, 1"
                    />
                </path>
                <path id="right-side-pageblock" d="M1275 875 L1275 125 L1250 150 L1250 900 L1275 875" :stroke="secondHalfOpen ? 'black' : 'white'" fill="white">
                    <animate 
                        attributeName="d" 
                        begin="indefinite" 
                        dur="1.5s" 
                        repeatCount="1" 
                        fill="freeze" 
                        to="M1265 885 L1265 150 L1250 165 L1250 900 L1265 885"
                        calcMode="spline"
                        keyTimes="0; 1"
                        keySplines="0.4, 0, 0.2, 1"
                    />
                </path>
                
                <path id="left-top-pageblock" d="M750 150 C1250 150, 1250 150, 1250 150 L1275 125 C775 125, 775 125, 775 125" :stroke="secondHalfOpen ? 'black' : 'white'" fill="white">
                    <animate 
                        attributeName="d" 
                        begin="indefinite" 
                        dur="1.5s" 
                        repeatCount="1" 
                        fill="freeze" 
                        to="M775 125 C800 150, 925 190, 1275 190 L1290 175 C1000 165, 975 170, 800 125"
                        calcMode="spline"
                        keyTimes="0; 1"
                        keySplines="0.4, 0, 0.2, 1"
                    />
                </path>
                <path id="left-side-pageblock" d="M1275 875 L1275 125 L1250 150 L1250 900 L1275 875" :stroke="secondHalfOpen ? 'black' : 'white'" fill="white">
                    <animate 
                        attributeName="d" 
                        begin="indefinite" 
                        dur="1.5s" 
                        repeatCount="1" 
                        fill="freeze" 
                        to="M1265 885 L1265 150 L1250 165 L1250 900 L1265 885"
                        calcMode="spline"
                        keyTimes="0; 1"
                        keySplines="0.4, 0, 0.2, 1"
                    />
                </path>
                
                <path id="left-page-inner" :style="`visibility: ${secondHalfOpen ? 'visible' : 'hidden'}`" d="M775 125 C1275 125, 1275 125, 1275 125 L1275 875 C 775 875, 775 875, 775 875 " fill="white" fill-rule="nonzero" opacity="1" stroke="black" >
                    <animate 
                        attributeName="d" 
                        begin="indefinite" 
                        dur="1.5s" 
                        repeatCount="1" 
                        fill="freeze" 
                        to="M775 125 C800 150, 925 190, 1275 190 L1275 925 C 875 950, 775 875, 775 875"
                        calcMode="spline"
                        keyTimes="0; 1"
                        keySplines="0.4, 0, 0.2, 1"
                    />
                </path> 
                <!-- L775 125 -->
            </svg>

            <div id="lang-description" :class="open ? 'desc-open' : ''" :style="`visibility: ${secondHalfOpen ? 'hidden' : 'visible'}`">
                <div id="content-wrapper">
                    <div>
                        <h1>{{ title }}</h1>
                        <h3>
                            {{mainLang}} - {{secondLang}} 
                        </h3>
                        <h3>{{ wordCount }} words</h3>
                    </div>
                    <div>
                        <img :src="`./flags/${props.mainLang}.png`" :alt="mainLang">
                        <img :src="`./flags/${props.secondLang}.png`" :alt="secondLang">
                    </div>
                </div>
            </div>
            

            <div id="clicker" @click="clicker">
                &nbsp;
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import {ref, watch} from 'vue';


const props = defineProps<{
    mainLang: string,
    secondLang: string,
    title: string,
    pageOpen: boolean,
    wordCount: number
}>()

const emit = defineEmits(['beginOpen', 'completedOpen'])

const open = ref(false)
const secondHalfOpen = ref(false);

function clicker() {
    togglePage()
    if(!open.value) {
    }
}

function togglePage() {
    const duration = 1500;
    if(open.value) {
        // emit('bookClose')
        setTimeout(() => {
            secondHalfOpen.value = false;
        }, 1350);
    } else {
        document.querySelectorAll('path').forEach((path) => {
            path.querySelector('animate')?.beginElement();
        })
        emit('beginOpen')
        setTimeout(() => {
            secondHalfOpen.value = true;
        }, duration / 3);

        setTimeout(() => {
            emit('completedOpen')
        }, duration * 1.3);
    }


    open.value = !open.value;
}



watch(() => props.pageOpen, () => {
    togglePage()
})



</script>

<style scoped lang="scss">

$transition-duration: 1500ms;

#lang-description {
    perspective: 1914px;
    position: absolute;
    
    width: 300px;
    height: 500px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    #content-wrapper{

        width: 100%;
        height: 100%;

        transition: transform cubic-bezier(0.4, 0, 0.2, 1) $transition-duration;
        transform: translateY(-10px) translateZ(0px);
        transform-origin: -25px center;
        div:first-child {
            height: 350px;
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;
            color: white;
            h1 {
                padding-top: 10px;
                font-size: 2.5em;
                margin: 0px 0;
                text-align: center;
            }
            h3 {
                margin: 20px 0;
            }
            span {
                font-size: 2em;
                // margin: 0 10px;
            }
        }
    
        div:last-child {
            display: flex;
            height: 150px;
            justify-content: space-between;
            img {
                width: 60%;
                height: 100%;
                object-fit: fill;
            
                &:first-child {
                    clip-path: polygon(0 0, 100% 0, 65% 100%, 0 100%);
                }
                
                &:last-child {
                    clip-path: polygon(35% 0, 100% 0, 100% 100%, 0 100%);
                    transform: translateX(-35%)
                }
            }
        }
        
    }


    &.desc-open {
        #content-wrapper {
            transform: translateY(-10px) translateX(160px) rotateY(-180deg);
        }
    }
}

#svg-wrapper-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    position: relative;
    pointer-events: none;

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
    pointer-events: all;
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

    pointer-events: none;

    width: auto;
    // transform: scale(0.7);
    // transition: cubic-bezier(0.4, 0, 0.2, 1) 1.5s;

}

svg {
    -webkit-perspective: 2814px;
    perspective: 2814px;
    width: 2000px;
    height: 1000px;
    transform: scale(0.6) ;
    // transition: cubic-bezier(0.4, 0, 0.2, 1) 2.7s;
    transition: cubic-bezier(0.95, 0.05, 0.795, 0.035) 2s;


    path {
        transform-origin: center;
        transition: stroke ease,  transform cubic-bezier(0.755, 0.05, 0.855, 0.06) $transition-duration, d cubic-bezier(0.755, 0.05, 0.855, 0.06) $transition-duration;
    }

    #left-page, #left-page-inner, #right-page, #left-top-pageblock, #left-side-pageblock, #right-top-pageblock, #right-side-pageblock {
        transform-origin: 775px center;
        transform: translateZ(10px);
    }

    #right-side-pageblock, #right-top-pageblock {
        transform: translateX(25px) translateY(-25px);
    }

    #front-cover {
        transform: translateY(50px);
        transform-origin: 750px center;
    }
}

.open {

    transform: scale(1.66) translateY(0px);

    $right-movement: 220px;

    path {
        transition: transform cubic-bezier(0.4, 0, 0.2, 1) $transition-duration, d cubic-bezier(0.4, 0, 0.2, 1) $transition-duration;
    }

    #bind {
        transform: translateX($right-movement);
    }

    #front-cover {
        transform: rotateY(180deg) translateX(-$right-movement);
    }

    #back-cover {
        transform: translateX($right-movement);
    }

    #left-page, #left-page-inner {
        transform: rotateY(180deg) translateX(-$right-movement) translateY(-25px) translateZ(10px);
    }
    
    #right-side-pageblock {
        transform: translateX($right-movement + 25px) translateY(0px) translateZ(10px);
    }
    
    #right-top-pageblock {
        transform: translateX($right-movement) translateY(-25px) translateZ(10px);
    }
    
    #left-side-pageblock {
        transform: rotateY(180deg) translateX(-$right-movement + 25px) translateY(0px) translateZ(10px);
    }
    
    #left-top-pageblock {
        transform: rotateY(180deg) translateX(-$right-movement) translateY(-25px) translateZ(10px);
    }
    
    #right-page {
        transform: translateX($right-movement) translateY(-25px);
    }
}

</style>