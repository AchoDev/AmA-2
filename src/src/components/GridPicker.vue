<template>
    <div id="container">

        <div id="grid-picker">
            <label>
            <input type="radio" name="gridType" value="checkeredLarge" v-model="selectedGrid">
            <div class="grid-img">
                <img src="../assets/grid/checkerlarge.svg" alt="Checkered large">
            </div>
            </label>
            
            <label>
            <input type="radio" name="gridType" value="checkeredMedium" v-model="selectedGrid">
            <div class="grid-img">
                <img src="../assets/grid/checkermedium.svg" alt="Checkered medium">
            </div>
            </label>
            <label>
            <input type="radio" name="gridType" value="checkeredSmall" v-model="selectedGrid">
            <div class="grid-img">
                <img src="../assets/grid/checkermedium.svg" alt="Checkered small">
            </div>
            </label>
            
            <label>
            <input type="radio" name="gridType" value="linedLarge" v-model="selectedGrid">
            <div class="grid-img">
                <img src="../assets/grid/linedlarge.svg" alt="Lined large">
            </div>
            </label>
            
            <label>
            <input type="radio" name="gridType" value="linedMedium" v-model="selectedGrid">
            <div class="grid-img">
                <img src="../assets/grid/linedmedium.svg" alt="Lined medium">
            </div>
            
            </label>
            
            <label>
            <input type="radio" name="gridType" value="linedSmall" v-model="selectedGrid">
            <div class="grid-img">
                <img src="../assets/grid/linedsmall.svg" alt="Lined small">
            </div>
            </label>
        </div>
    
        <button id="no-grid" @click="selectedGrid = ''">No grid</button>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { GridType } from './dictionaryType';

const selectedGrid = ref('')

const modelValue = defineModel<{
    gridSize: number;
    gridType: GridType;
}>()


watch(selectedGrid, (newVal) => {
  modelValue.value = grids[newVal]
})


const smallSize = 1
const mediumSize = 1.5
const largeSize = 2

const grids: {[key: string]: {gridSize: number, gridType: GridType}} = {
  '': {
    gridSize: smallSize,
    gridType: GridType.none
  },
  'checkeredLarge': {
    gridSize: largeSize,
    gridType: GridType.checkered
  },
  'checkeredMedium': {
    gridSize: mediumSize,
    gridType: GridType.checkered
  },
  'checkeredSmall': {
    gridSize: smallSize,
    gridType: GridType.checkered
  },
  'linedLarge': {
    gridSize: largeSize,
    gridType: GridType.lined
  },
  'linedMedium': {
    gridSize: mediumSize,
    gridType: GridType.lined
  },
  'linedSmall': {
    gridSize: smallSize,
    gridType: GridType.lined
  }
}

</script>

<style scoped lang="scss">

#container {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    height: auto !important;
}

#no-grid {
    width: 95%;
    margin: 10px;
    height: 40px;
    font-size: 14pt;
    margin-bottom: 20px;
}

#grid-picker {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin: 0 10px;

    width: 100%;
    height: auto;

    input[type="radio"] {
        appearance: none;

        &:checked + div{
        background: rgb(255, 180, 75);
            img {
                filter: invert(1)
            }
        }
    }

    label {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;

        .grid-img {
            border-radius: 10px;
            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
            transition: ease .1s;

            background: white;
            cursor: pointer;

            img {
                width: 100%;
                height: 100%;
            }
        }
    }
}
  

</style>