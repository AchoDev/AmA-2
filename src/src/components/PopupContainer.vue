<template>
    <div id="popup-background" @click="closePopup" :class="open ? 'opened' : ''">
        <div id="popup-container" @click.stop :style="background != undefined ? `background: ${background}` : ''">
            <slot></slot>    
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const open = ref(false)
function closePopup() {
    open.value = false
    emit('onClose')

    setTimeout(() => {
        emit('onCloseEnd')
    }, 250)
}

defineProps({
    background: String,
})

defineExpose({
    openPopup() {
        open.value = true
    },
    closePopup
})

const emit = defineEmits(['onClose', 'onCloseEnd'])

</script>

<style scoped lang="scss">

#popup-background {
    overflow-y: scroll;
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.322);
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 110;

    opacity: 0;
    transition: cubic-bezier(0.165, 0.84, 0.44, 1) 0.2s;

    display: grid;
    place-items: center;

    &.opened {
        pointer-events: all;
        opacity: 1;

        #popup-container {
            transform: scale(1);
        }
    }

    #popup-container {
        transition: cubic-bezier(0.165, 0.84, 0.44, 1) .25s;
        transform: scale(1.1);

        // position:unset;

        // width: 700px;
        // height: 400px;

        // max-width: 90%;

        width: auto;
        height: auto;
        display: inline;

        background: rgb(255, 163, 24);
        border-radius: 10px;
    }
}

</style>