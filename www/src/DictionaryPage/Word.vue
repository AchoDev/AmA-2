<template>

    <div>

        <div id="word-container" v-show="!editing">
            <span id="main-lang" :style="`width: ${sizes[0]}%`">
                {{ mainWord }}
            </span>

            <div class="divider">
                &nbsp;
            </div>
            
            <span id="second-lang" :style="`width: ${sizes[1]}%`">
                {{ secondWord }}
            </span>

            <div class="divider">
                &nbsp;
            </div>
            
            <div id="note-container" :style="`width: ${sizes[2]}%`">
                NOTES
            </div>
        </div>
        
        <div id="edit-word-container" v-show="editing">
            <div :style="`width: ${sizes[0]}%`">
                <input type="text" v-model="mainWord">
            </div>
            <div class="divider">
                &nbsp;
            </div>
            
            <div :style="`width: ${sizes[1]}%`">
                <input type="text" v-model="secondWord">
            </div>
            <div class="divider">
                &nbsp;
            </div>

            <div :style="`width: ${sizes[2]}%`">
                <div>notez</div>
            </div>
        </div>

        <button v-show="!editing" id="edit-button" @click="editing = true">edit</button>
        <button v-show="editing" id="edit-button" @click="editing = false">save</button>

        <!-- <center>
            <hr>
        </center> -->

    </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';


const editing = ref(false)

const props = defineProps<{
    mainLangWord: string,
    secondLangWord: string,

    sizes: Array<number>,
}>()

const mainWord = ref(props.mainLangWord)
const secondWord = ref(props.secondLangWord)

defineEmits(['onWordEdit'])



</script>

<style lang="scss" scoped>

div {
    position: relative;
}

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
}

#edit-button {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
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
}

</style>