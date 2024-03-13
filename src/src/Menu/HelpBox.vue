<template>
    <div id="help">
            <h1>Welcome to AmA!</h1>
            <p>Click the button below to create your first dictionary</p>
            <button @click="createNew()">Create new dictionary</button>
        </div>
</template>

<script setup lang="ts">

const emits = defineEmits(['createNew'])

function createNew() {
    emits('createNew')
}

</script>

<style lang="scss">

#help {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    z-index: 100;

    button {
        width: 300px;
        height: 50px;
        background: white;
        border: none;
        border-radius: 100px;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        font-size: 18pt;
        transition: ease .1s;

        &:active {
            transform: scale(0.95);
        }
    }
}

</style>