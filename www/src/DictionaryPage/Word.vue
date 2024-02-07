<template>

    <div>

        <div id="word-container" v-show="!editing">
            <span id="main-lang" :style="`width: ${sizes[0]}%`">
                {{ mainLangWord }}
            </span>

            <div class="divider">
                &nbsp;
            </div>
            
            <span id="second-lang" :style="`width: ${sizes[1]}%`">
                {{ secondLangWord }}
            </span>

            <div class="divider">
                &nbsp;
            </div>
    
            <div id="note-container" :style="`width: ${sizes[2]}%`">
                NOTES
            </div>

            <button id="edit-button" @click="editing = true">edit</button>
        </div>

        <div id="edit-word-container" v-show="editing">
            <input type="text" :style="`width: ${sizes[0]}%`">
            <input type="text" :style="`width: ${sizes[1]}%`">
            <div :style="`width: ${sizes[2]}%`">notez</div>
        </div>

        <!-- <center>
            <hr>
        </center> -->

    </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';


const editing = ref(false)

defineProps<{
    mainLangWord: string,
    secondLangWord: string,

    sizes: Array<number>,
}>()

defineEmits(['onWordEdit'])



</script>

<style lang="scss" scoped>

#word-container, #edit-word-container {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    position: relative;

    height: 70px;

    span, div {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 15pt;
        // border-right: 1px solid rgb(255, 219, 143);
    }

    

    #edit-button {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
    }
}

hr {
    margin: 30px 0;
    max-width: 80%;
    border-color: rgba(0, 0, 0, 0.089);
    border-width: 1px;
}

.divider {
    width: 2px;
    background: rgba(0, 0, 0, 0.089);
    height: auto;

    padding-top: 10px;
    padding-bottom: 10px;

    // margin-top: 50%;

    // top: 50%;
}

</style>