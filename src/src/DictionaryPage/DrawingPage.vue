<template>

<div id="wrapper"
    :class="{'touch-move': allowTouchMove, 'dark': darkMode}"
>
    <div id="container">
        <NavBar
            :settings="settings"
            :page-settings="page.settings ?? {
                gridType: 'none',
            }"
            :title="page.title"
            @openSideBar="openSideBar"
            @change-settings="changeSettings"
            @change-page-settings="changePageSettings"
        />

        <div id="page-container">
            <DrawingArea 
                :width="`${297 / 1.5}mm`"
                :height="`${420 / 1.5}mm`"
                :grid="page.settings"
            
                :drawing-disabled="allowTouchMove"
                :toolbar-fixed="true"
            />
        </div>
    
    </div>
</div>


</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DrawingArea from '../components/DrawingArea.vue';
import { Page } from '../components/dictionaryType';
import Settings from '../components/settings';
import NavBar from './NavBar.vue';


const emit = defineEmits(['openSideBar', 'changeSettings', 'changePageSettings'])

defineProps<{
    settings: Settings
    page: Page
    darkMode: boolean
}>()

function changeSettings(newSettings: Settings) {
    emit('changeSettings', newSettings)
}

function changePageSettings(newSettings: Page['settings']) {
    emit('changePageSettings', newSettings)
}

function openSideBar() {
    emit('openSideBar')
}

const allowTouchMove = ref(true)

onMounted(() => {

    function checkTouchMove(e: PointerEvent) {
        if(e.pointerType !== 'pen') {
            e.preventDefault()
            allowTouchMove.value = true
            // e.stopPropagation()
        } else {
            allowTouchMove.value = false
        }
    }

    document.addEventListener('pointerdown', checkTouchMove)
    document.addEventListener('pointercancel', checkTouchMove)
    document.addEventListener('pointermove', checkTouchMove)

    document.addEventListener('touchend', () => {
        allowTouchMove.value = true
    })
})

</script>

<style scoped lang="scss">

#wrapper {
    height: 100dvh;
    overflow: hidden;
    // touch-action: none;
    background: linear-gradient(130deg, rgb(255, 204, 110), rgb(255, 174, 81));
    background-attachment: fixed;

    &.touch-move {
        overflow: auto;
    }

    &.dark {
        background: linear-gradient(130deg, rgb(45, 45, 45), rgb(34, 34, 34));
    }
}

#container {
    width: 100%;
    height: auto;
    // min-height: 100vh;
    margin-top: 50px;
    padding: 40px 0;
    display: flex;
    justify-content: center;
    // align-items: center;
    overflow: hidden;

}

</style>