
<template>

    <div class="wiggle" :style="`transform: rotate(${currentRotation}deg) scale(${wiggle ? 0.9 : 1}); transition-duration: ${currentDuration}s`">
        <slot/>
    </div>

</template>

<script setup lang="ts">
import { ref, watch } from 'vue';


function getRandom(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

const currentRotation = ref(0);
const currentDuration = ref(0);

let interval: NodeJS.Timeout;
let timeout: NodeJS.Timeout;

const props = defineProps({
    wiggle: Boolean
})


function startWiggle() {
    let wiggleRoom = getRandom(-4, 4);

    while(wiggleRoom < 2) {
        wiggleRoom = getRandom(-4, 4);
    }

    currentDuration.value = getRandom(0.1, 0.11);

    currentRotation.value = wiggleRoom;



    timeout = setTimeout(() => {currentRotation.value = -wiggleRoom}, currentDuration.value * 1000)
    // setTimeout(() => {currentRotation.value = }, currentDuration.value * 1000)

    interval = setInterval(() => {
        currentRotation.value = wiggleRoom;

        timeout = setTimeout(() => {currentRotation.value = -wiggleRoom}, currentDuration.value * 1000)

    }, currentDuration.value * 2000)
}


watch(() => props.wiggle, (newVal) => {
    if (newVal) {
        startWiggle();
    } else {
        clearTimeout(timeout);
        clearTimeout(interval);
        currentRotation.value = 0;
    }
})

defineExpose({
    startWiggle
})

</script>

<style lang="scss">

.wiggle {
    transition: ease-out;
}

</style>