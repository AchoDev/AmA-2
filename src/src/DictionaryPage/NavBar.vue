<template>
    <nav>
        <div>
            <button id="sidebar-button" @click="openSideBar()"> <img src="../assets/sidebar.svg" alt="Sidebar button"> </button>
        </div>
    
        <div id="title">{{title}}</div>
    
        <div id="settings">
            <button id="open-menu-button" @click="settingsOpen = true" @click.stop>
                <img src="../assets/more.svg" alt="Add new page">
            </button>

            <div id="menu" :class="settingsOpen ? 'open' : ''" @click.stop>

                <center>
                    <h2>Settings</h2>
                </center>

                <hr>

                <div>
                    <span>Words per page</span>
                    <input type="number" v-model="wordsPerPage">
                </div>

                <div>
                    <span>Word size</span>
                    <input type="number" v-model="wordSize">
                </div>

                <div>
                    <span>Divider between words</span>
                    <input type="checkbox" v-model="dividerVisible">
                </div>

                <div>
                    <span>Dark mode</span>
                    <input type="checkbox" v-model="dividerVisible">
                </div>

                <hr>

                <button>
                    Edit name
                </button>
                <button>
                    Change language
                </button>
                <button>
                    Delete dictionary
                </button>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';


const emit = defineEmits(['openSideBar'])

defineProps<{
    title: string,
}>()

function openSideBar() {
    emit('openSideBar')
}

const wordsPerPage = ref(45)
const wordSize = ref(15)
const dividerVisible = ref(false)

const settingsOpen = ref(false)

onMounted(() => {
    document.addEventListener('click', (_) => {
        settingsOpen.value = false
    })
})

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

    #sidebar-button, #settings #open-menu-button{
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

        #menu {
            position: absolute;
            top: 0;
            right: 0;

            background: white;
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
            opacity: 0.5;
            filter: blur(30px);
            
            transition: cubic-bezier(0.075, 0.82, 0.165, 1) .4s;
            &.open {
                width: 300px;
                height: 500px;
                opacity: 1;
                filter: blur(0);
            }

            div {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                gap: 20px;

                height: 40px;
                width: 100%;
                margin: 5px 0;

                span {
                    font-size: 1.1em;
                    font-weight: bold;
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
                background: white;
                border: none;
                margin: 5px 0;
                height: 50px;
                width: 260px;
                box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
                border-radius: 100px;

                &:last-child {
                    background: red;
                    color: white;
                }

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
    }
}

</style>