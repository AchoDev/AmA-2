<template>

<div @click="model = !model" :class="model ? 'open' : ''">
</div>

</template>

<script setup lang="ts">

const model = defineModel<boolean>()

</script>

<style scoped lang="scss">

div {
    width: 70px !important;
    height: 30px !important;
    border-radius: 100px;
    // border: 1px solid black;
    background: #d3d3d3;
    position: relative;

    transition: linear .3s;

    &::after {
        content: '';
        background: black;
        
        $radius: 10px;

        margin: 15px - $radius;

        height: $radius * 2;
        width: $radius * 2;
        border-radius: 100%;

        position: absolute;
        left: 0;

        transition: cubic-bezier(0.23, 1, 0.320, 1) .7s;
    }

    &.open {
        background: #ff960e;
        border: none;
        &::after {
            background: white;
            left: calc(100% - 30px);
        }
    }
}

</style>