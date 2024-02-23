<template>
    <nav>
        <div>
            <button @click="openSideBar()"> >> </button>
        </div>
    
        <div>{{title}}</div>
    
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
}

</style>