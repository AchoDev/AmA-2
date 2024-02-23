<template>

<div id="container">
    <button @click="openSideBar()" id="sidebar-button">>></button>
    <DrawingArea 
        width="297mm"
        height="420mm"

        :toolbar-fixed="true"
    />
</div>


</template>

<script setup lang="ts">
import DrawingArea from '../components/DrawingArea.vue';

const emit = defineEmits(['openSideBar'])

function openSideBar() {
    emit('openSideBar')
}

</script>

<style scoped lang="scss">

#container {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    padding: 40px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: orange;
    // overflow: hidden;
}

#sidebar-button {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    background: white;
    border: none;
    padding: 10px;
    font-size: 20px;
    cursor: pointer;
}

</style>