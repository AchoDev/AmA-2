<template>

    <div :style="`--wordSize: ${wordSize}pt`">

        <div id="word-container" v-show="!editing" :style="`color: ${darkMode ? 'white' : 'black'}`">
            <span id="main-lang" :style="`width: ${sizes[0]}%`">
                {{ mainLangWord }}
            </span>

            <div class="divider" :class="darkMode ? 'dark' : ''">
                &nbsp;
            </div>
            
            <span id="second-lang" :style="`width: ${sizes[1]}%`">
                {{ secondLangWord }}
            </span>

            <div class="divider" :class="darkMode ? 'dark' : ''">
                &nbsp;
            </div>
            
            <div id="note-container" :style="`width: ${sizes[2]}%`">
                <DrawingPreview width="700px" height="250px" scale-down="3.5" :paths="notes" />
            </div>
        </div>
        
        <div id="edit-word-container" v-show="editing">
            <div :style="`width: ${sizes[0]}%`">
                <input type="text" v-model="mainWord">
            </div>
            <div class="divider" :class="darkMode ? 'dark' : ''">
                &nbsp;
            </div>
            
            <div :style="`width: ${sizes[1]}%`">
                <input type="text" v-model="secondWord">
            </div>
            <div class="divider" :class="darkMode ? 'dark' : ''">
                &nbsp;
            </div>

            <div :style="`width: ${sizes[2]}%`">
                <div></div>
            </div>
        </div>

        <div id="editing-suite" :class="darkMode ? 'dark' : ''">
            <button v-show="!editing" id="edit-button" @click="startEditing()">
                <img src="../assets/edit.svg" alt="Edit">
            </button>
    
            <button v-show="editing" id="edit-button" @click="editNote()">
                <img src="../assets/pen.svg" alt="Edit note">
            </button>
            <button v-show="editing" id="edit-button" @click="deleteWord()">
                <img src="../assets/trash.svg" alt="Delete">
            </button>
            <button v-show="editing" id="edit-button" @click="saveWord()">
                <img src="../assets/save.svg" alt="Save">
            </button>
            <button v-show="editing" id="edit-button" @click="cancelEditing()">
                <img src="../assets/cancel.svg" alt="Cancel">
            </button>
        </div>


        <center v-if="dividerVisible">
            <hr id="horizontal-divider" :class="darkMode ? 'dark' : ''">
        </center>

    </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import DrawingPreview from '../components/DrawingPreview.vue';
import Path from '../components/path';

function startEditing() {
    editing.value = true
    mainWord.value = props.mainLangWord;
    secondWord.value = props.secondLangWord;

    notesEdit.value = props.notes
}

function saveWord() {
    emit('onWordEdit', props.index, mainWord.value, secondWord.value)
    editing.value = false
}

function editNote() {
    emit('onNoteEdit', props.index, props.notes)
}

function deleteWord() {
    editing.value = false
    emit('onWordDelete', props.index)
}

function cancelEditing() {
    editing.value = false
    notesEdit.value = props.notes
}

const editing = ref(false)

const props = defineProps<{
    mainLangWord: string,
    secondLangWord: string,
    notes: Path[]

    index: number,

    sizes: Array<number>,
    wordSize: number
    dividerVisible: boolean,
    darkMode: boolean
}>()

const mainWord = ref(props.mainLangWord)
const secondWord = ref(props.secondLangWord)
const notesEdit = ref(props.notes)

const emit = defineEmits(['onWordEdit', 'onWordDelete', 'onNoteEdit'])

</script>

<style lang="scss" scoped>

div {
    position: relative;
}

div > * {
    font-size: var(--wordSize) !important;
    transition: ease-out .1s;
}

#word-container, #edit-word-container {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    position: relative;

    height: 70px;

    #note-container {
        overflow: hidden;
    }

    span, div {
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 15pt;
        // border-right: 1px solid rgb(255, 219, 143);
    }

    input[type="text"] {
        width: 80%;
        height: 40px;
        border-radius: 100px;
        font-size: 15pt;
        text-align: center;
        box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
        border: none;

        &:focus {
            outline: none;
        }
    }
}

#editing-suite {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);

    display: flex;
    flex-direction: row;
    // width: 100px;
    gap: 15px;

    button {
        width: 50px;
        height: 50px;
        padding: 5px;
        box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
        border: none;
        border-radius: 100px;
        display: grid;
        place-items: center;
        background: white;
    
        img {
            // filter: brightness(0);
            width: 80%;
            height: auto;
        }
    }

    &.dark {
        button {
            background: rgb(31, 31, 31);
            box-shadow: 0px 0px 5px 0px rgba(255, 255, 255, 0.5);
        }
    }
}

hr {
    margin: 30px 0;
    max-width: 80%;
    border-width: 1px;
}

.divider {
    width: 2px;
    background: rgba(0, 0, 0, 0.089);
    height: auto;
    
    padding-top: 10px;
    padding-bottom: 10px;
}

#horizontal-divider {
    margin: 5px 0;
    max-width: 80%;
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0.248);
}

.divider, #horizontal-divider {
    &.dark {
        background: rgba(255, 255, 255, 0.089);
        border-color: rgba(255, 255, 255, 0.089);
    }
}

</style>