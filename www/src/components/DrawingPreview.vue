<template>
<div id="container">
    <div id="drawing-container">
        <svg :style="`width: calc(${width} / ${scaleDown}); height: calc(${height} / ${scaleDown})`">
            <path 
                v-for="path in paths" 
                :d="`M ${path.path.map(p => `${p.x / parseFloat(scaleDown)} ${p.y / parseFloat(scaleDown)}`).join(' L ')}`" 
                :stroke="path.color" 
                :stroke-width="path.width / parseFloat(scaleDown)" 
                fill="none"
                stroke-linecap="round" 
            />
        </svg>
    </div>
</div>
</template>

<script setup lang="ts">

import Path from './path.ts';

defineProps<{
    paths: Path[];
    width: string;
    height: string;
    scaleDown: string;
}>()

</script>

<style lang="scss" scoped>

svg {
    background: white;
    border-radius: 10px;
}

#drawer-container {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    z-index: 100;
    pointer-events: none;
}

</style>