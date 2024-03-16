<template>
    <nav :class="settings.darkmode ? 'darkmode' : ''">
        <div>
            <button id="sidebar-button" @click="openSideBar()"> <img src="../assets/sidebar.svg" alt="Sidebar button"> </button>
        </div>
    
        <div id="title">{{title}}</div>
    
        <div id="settings">
            <button id="open-menu-button" @click="settingsOpen = true" @click.stop>
                <img src="../assets/more.svg" alt="Add new page">
            </button>

            <div id="menu" :class="settingsOpen ? 'open' : ''" @click.stop :style="`--navbar-height: ${pageSettings ? '450px' : '400px'}`">

                <center>
                    <h2>Settings</h2>
                </center>

                <hr>

                <div v-show="!pageSettings">
                    <span>Words per page</span>
                    <div class="input-wrapper">
                        <button @click="wordsPerPage--">-</button>
                        <input type="number" v-model="wordsPerPage">
                        <button @click="wordsPerPage++">+</button>
                    </div>
                </div>

                <div v-show="!pageSettings">
                    <span>Word size</span>
                    <div class="input-wrapper">
                        <button @click="wordSize--">-</button>
                        <input type="number" v-model="wordSize">
                        <button @click="wordSize++">+</button>
                    </div>
                </div>

                <div v-show="!pageSettings">
                    <span>Divider between words</span>
                    <Switch v-model="dividerVisible" />
                </div>

                <div v-if="pageSettings" style="width: 80%">
                    <GridPicker v-model="functionalPageSettings" />
                </div>

                <div>
                    <span>Dark mode</span>
                    <Switch v-model="darkMode" />
                </div>

                <hr>

                <button 
                    v-if="!pageSettings" 
                    style="font-size: 14pt;"
                    @click="openImportPopup()"
                >
                    Import from AmA
                </button>

                <!-- <button>
                    Edit name
                </button>
                <button>
                    Change language
                </button>
                <button>
                    Delete dictionary
                </button> -->
            </div>
        </div>


        <PopupContainer ref="importPopup" :background="darkMode ? '#070707' : undefined">
            <div id="import-page" :style="{color: darkMode ? 'white' : 'black'}">
                <center>
                    <h1>Import from AmA</h1>
                    <p>Use this option to import data from the old AmA</p>
                    
                    <small>JSON</small> <br>
                    <textarea v-model="amaImportInput" cols="60" rows="20"></textarea> <br>
                    <button @click="importFromAmA()">Import</button>
                </center>
            </div>
        </PopupContainer>
    </nav>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Switch from '../components/Switch.vue';
import Settings from '../components/settings';
import { PageSettings } from '../components/dictionaryType';
import GridPicker from '../components/GridPicker.vue';
import PopupContainer from '../components/PopupContainer.vue';

const emit = defineEmits(['openSideBar', 'changeSettings', 'changePageSettings', 'importFromAma'])

const props = defineProps<{
    title: string,

    settings: Settings
    pageSettings?: PageSettings
}>()

const functionalPageSettings = ref(props.pageSettings)

watch(functionalPageSettings, (newVal) => {
    emit('changePageSettings', newVal)
})

function openSideBar() {
    emit('openSideBar')
}

const wordsPerPage = ref(props.settings.wordsPerPage)
const wordSize = ref(props.settings?.wordSize)
const dividerVisible = ref(props.settings?.dividerBetweenWords)
const darkMode = ref(props.settings?.darkmode)

watch([wordsPerPage, wordSize, dividerVisible, darkMode], () => {
    const value: Settings = {
        wordsPerPage: wordsPerPage.value,
        wordSize: wordSize.value,
        dividerBetweenWords: dividerVisible.value,
        darkmode: darkMode.value
    }
    emit('changeSettings', value)
})

const amaImportInput = ref('')
const importPopup = ref()

function openImportPopup() {
    importPopup.value.openPopup()
}

function importFromAmA() {
    emit('importFromAma', JSON.parse(amaImportInput.value))
}

const settingsOpen = ref(false)

onMounted(() => {
    document.addEventListener('click', (e) => {
        if(!settingsOpen.value) return

        settingsOpen.value = false

        e.stopImmediatePropagation();
    })  
})

</script>

<style scoped lang="scss">
nav {
    height: 70px;
    background: var(--background);
    position: fixed;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    padding-top: 20px;

    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

    z-index: 10;

    --background: white;
    --text: black;
    
    &.darkmode {
        --background: rgb(39, 39, 39);
        --text: white;
    }

    #sidebar-button, #settings #open-menu-button{
        font-size: 1.7em;
        width: 50px;
        height: 50px;
        margin-left: 10px;
        border: none;
        border-radius: 100%;
        background: var(--background);
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
            transform: scale(0.95);
        }

        img {
            width: 35px;
            height: auto;
        }
    }

    #settings {
        margin-right: 10px;
        position: relative;
        color: var(--text);

        #menu {
            position: absolute;
            top: 0;
            right: 0;

            background: var(--background);
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
            border-radius: 10px;
            padding: 10px;

            width: 0;
            height: 0;

            display: flex;
            flex-direction: column;
            align-items: center;

            hr {
                width: 100%;
            }

            overflow: hidden;
            opacity: 0.8;
            filter: blur(10px);
            
            transition: cubic-bezier(0.23, 1, 0.320, 1) .3s;
            &.open {
                width: 300px;
                height: var(--navbar-height);
                opacity: 1;
                filter: blur(0);
            }

            div {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                gap: 20px;

                // height: 40px;
                width: 100%;
                margin: 5px 0;

                span {
                    font-size: 1.1em;
                    font-weight: bold;
                }

                .input-wrapper {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    gap: 5px;
                    width: auto;

                    button {
                        width: 30px;
                        height: 30px;
                        border-radius: 100px;
                        box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
                        border: none;

                        &:focus {
                            outline: none;
                        }

                        &:last-child {
                            background: var(--background);
                            color: var(--text);
                        }
                    }

                    input[type="number"] {
                        width: 40px;
                        height: 30px;
                        border-radius: 100px;
                        font-size: 1.1em;
                        text-align: center;
                        box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
                        border: none;

                        &:focus {
                            outline: none;
                        }
                    }
                }

                input[type="checkbox"] {
                    width: 30px;
                    height: 30px;
                    border-radius: 100px;
                    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
                    border: none;

                    &:focus {
                        outline: none;
                    }
                }
            }

            button {
                background: var(--background);
                color: var(--text);
                border: none;
                margin: 5px 0;
                height: 50px;
                width: 260px;
                box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
                border-radius: 100px;

                // &:last-child {
                //     background: red;
                //     color: white;
                // }

                transition: ease-out .1s;
                &:active {
                    transform: scale(0.95);
                }
            }
        }
    
    }

    #title {
        font-size: 1em;
        font-weight: bold;
        justify-self: center;
        color: var(--text);
    }
}

</style>