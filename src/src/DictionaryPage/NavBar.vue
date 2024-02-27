<template>
    <nav>
        <div>
            <button id="sidebar-button" @click="openSideBar()"> >> </button>
        </div>
    
        <div id="title">{{title}}</div>
    
        <div>
            <button>...</button>
        </div>
    </nav>
</template>

<script setup lang="ts">

const emit = defineEmits(['openSideBar'])

defineProps<{
    title: string,
}>()

function openSideBar() {
    emit('openSideBar')
}

</script>

<style scoped lang="scss">
nav {
    height: 70px;
    background: white;
    position: fixed;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

    z-index: 10;

    #sidebar-button {
        font-size: 1.7em;
        width: 50px;
        height: 50px;
        margin-left: 10px;
        border: none;
        border-radius: 100%;
        background: rgb(255, 255, 255);
        color: orange;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        // letter-spacing: -5px;
        font-weight: bold;

        transition: ease-out .1s;

        &:active {
            transform: translateX(10px);
        }
    }

    #title {
        font-size: 1em;
        font-weight: bold;
        justify-self: center;
    }
}

</style>