<template>

<div id="container">

    <NavBar
        :settings="settings"
        :page-settings="page.settings"
        :title="page.title"
        @openSideBar="openSideBar"
        @change-settings="changeSettings"
        @change-page-settings="changePageSettings"
    />

    <DrawingArea 
        width="297mm"
        height="420mm"
        :grid="page.settings"

        :toolbar-fixed="true"
    />
</div>


</template>

<script setup lang="ts">
import DrawingArea from '../components/DrawingArea.vue';
import { Page } from '../components/dictionaryType';
import Settings from '../components/settings';
import NavBar from './NavBar.vue';


const emit = defineEmits(['openSideBar', 'changeSettings', 'changePageSettings'])

defineProps<{
    settings: Settings
    page: Page
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

</script>

<style scoped lang="scss">

#container {
    width: 100%;
    height: calc(100vh - 130px);
    // min-height: 100vh;
    margin-top: 50px;
    padding: 40px 0;
    display: flex;
    justify-content: center;
    // align-items: center;
    background: linear-gradient(130deg, rgb(255, 204, 110), rgb(255, 174, 81));
    overflow: hidden;
}

</style>