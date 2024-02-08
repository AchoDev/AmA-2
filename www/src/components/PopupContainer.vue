<template>
    <div id="popup-background" @click="closePopup" :class="open ? 'opened' : ''">
        <div id="popup-container" @click.stop>
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
}


defineExpose({
    openPopup() {
        open.value = true
    },
    async closePopup(): Promise<void> {
        open.value = false
        console.log('closing')
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("closed!")
                resolve()
            }, 250)
        })
    },
})

const emit = defineEmits(['onClose'])

</script>

<style scoped lang="scss">

#popup-background {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.322);
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 100;

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