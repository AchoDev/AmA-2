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
                v-model="paths"

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
import { onMounted, onUnmounted, ref, watch } from 'vue';
import DrawingArea from '../components/DrawingArea.vue';
import { Page } from '../components/dictionaryType';
import Settings from '../components/settings';
import NavBar from './NavBar.vue';
import Path from '../components/path';


const emit = defineEmits(['openSideBar', 'changeSettings', 'changePageSettings', 'savePath'])


const props = defineProps<{
    settings: Settings
    page: Page
    darkMode: boolean
}>()

const paths = ref<Path[]>()
const title = ref()

watch(() => [paths.value?.length, props.page], (_) => {

    console.log(props.page.title, title.value, "THIS IS THE TITLE")

    console.log(paths.value, props.page.content, "THIS IS THE PATHS")
    
    if(props.page.title !== title.value) {
        title.value = props.page.title
        paths.value = props.page.content
        // console.log("new page")
        return
    }
    // console.log(paths.value, "THIS IS THE PATHS")
    emit('savePath', paths.value)
})

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

function checkTouchMove(e: PointerEvent) {
    if(e.pointerType !== 'pen') {
        allowTouchMove.value = true
    } else {
        allowTouchMove.value = false
    }
}

onMounted(() => {
    document.addEventListener('pointerdown', checkTouchMove)
    document.addEventListener('pointercancel', checkTouchMove)
    document.addEventListener('pointermove', checkTouchMove)

    document.addEventListener('touchend', () => {
        allowTouchMove.value = true
    })
    paths.value = props.page.content
})

onUnmounted(() => {
    document.removeEventListener('pointerdown', checkTouchMove)
    document.removeEventListener('pointercancel', checkTouchMove)
    document.removeEventListener('pointermove', checkTouchMove)
    document.removeEventListener('touchend', () => {
        allowTouchMove.value = true
    })

    title.value = ''
    console.log("unmount")
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