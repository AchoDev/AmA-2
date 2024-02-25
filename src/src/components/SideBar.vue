<template>
    <div id="side-bar" :class="sideMenuOpened ? 'opened' : ''">
            <div id="top-section">
                <div>
                    <img src="../assets/logo.svg" alt="Logo">
                    <button @click="sideMenuOpened = false"> &lt;&lt; </button>
                </div>

                <!-- <hr> -->
    
                <button @click="exitToMenu()"> Exit to Menu </button>
            </div>

            <br>
            <hr>

            <h3>Your dictionary</h3>
            <button id="dict" @click="openPage('dictionary')">
                {{ mainLang }} - {{ secondLang }}
            </button>
            <br>
            <br>
            <hr>


            <h3>Your pages</h3>

            <div id="page-buttons">
                <button 
                    v-for="page in pages"
                    @click="openPage(page)"
                >
                    {{page}}
                </button>


                <button id="new-page-button" @click="createPage()">
                    New page
                </button>
            </div>


        </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const sideMenuOpened = ref(false)

const emit = defineEmits(['exitToMenu', 'openPage', 'createNewPage'])

function exitToMenu() {
    sideMenuOpened.value = false
    emit('exitToMenu')
}

function openPage(page: string) {
    sideMenuOpened.value = false
    emit('openPage', page)
}

function createPage() {
    emit('createNewPage')
}

defineProps<{
    mainLang: string,
    secondLang: string,
    pages: string[],
}>()

defineExpose({
    openSideMenu() {
        sideMenuOpened.value = true
    },
    closeSideMenu() {
        sideMenuOpened.value = false
    }
})

</script>

<style scoped lang="scss">
#side-bar {
    display: flex;
    align-items: center;
    flex-direction: column;
    background: linear-gradient(10deg, rgb(255, 185, 80), rgb(255, 161, 72));
    height: 100%;
    width: 300px;
    position: fixed;
    left: -300px;
    z-index: 101;
    transition: cubic-bezier(0.23, 1, 0.320, 1) .3s;
    top: 0;
    border-right: 1px solid black;

    &.opened {
        left: 0;
    }
}

#dict {
    width: 90%;
    height: 100px;
    margin-top: 20px;
    border: none;
    border-radius: 20px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    background: white;
    font-size: 20pt;
}

hr {
    width: 80%;
    border-color: rgb(175, 114, 64);
    // border-color: white;
    // margin: 20px 0;
    // border-color: black;
}

h3 {
    text-align: left;
    width: 85%;
    margin-bottom: 0;
    // margin-top: 50px;
}

#page-buttons {
    width: 85%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 10px;

    button {
        width: 100%;
        height: 40px;
        border-radius: 100px;
        border: none;
        background: rgb(255, 255, 255);
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
        font-size: 17pt;
        margin-top: 10px;
        cursor: pointer;
    }

    #new-page-button {
        background: linear-gradient(150deg, rgb(255, 167, 35), #ffb663);
        font-size: 19pt;
        font-weight: bold;
        color: white;
        transition: ease-out .1s;

        &:active {
            transform: scale(0.95)
        }
    }
	
}

#top-section {
    background: white;
    display: flex;
    flex-direction: column;
    padding: 10px;
    width: calc(100% - 20px);
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    gap: 20px;

    div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        // padding: 10px;

        img {
            width: 100px;
            height: auto;
        }

        button {
            width: 50px;
            height: 50px;
            border: none;
            // background: none;
            font-size: 20pt;
            cursor: pointer;
        }
    }

   

    button {
        width: 100%;
        height: 50px;
        border-radius: 100px;
        border: none;
        background: rgb(255, 178, 76);
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
        font-size: 20pt;
        color: white;
        display: grid;
        place-items: center;
        cursor: pointer;
    }
}

</style>