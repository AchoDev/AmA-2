<template>

<div id="container">

    <NavBar 
        :title="page.title"
        @openSideBar="openSideBar"
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
import NavBar from './NavBar.vue';


const emit = defineEmits(['openSideBar'])

defineProps<{
    page: Page
}>()

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