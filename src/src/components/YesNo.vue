
<template>

<PopupContainer ref="popup" @on-close="open = false"> 

    <center>
        <h1>{{ question }}</h1>
    
        <span>{{ desc }}</span>
    </center>

    <br>

    <div id="answer">
        <button @click="answer = true">Yes</button>
        <button @click="answer = false">No</button>
    </div>
</PopupContainer>

</template>

<script setup lang="ts">

import { ref } from 'vue';
import PopupContainer from './PopupContainer.vue';

const answer = ref<undefined | boolean>(undefined)

const open = ref(false)

const popup = ref()

const question = ref('Are you sure?');
const desc = ref('This action cannot be undone.');

defineExpose({
    async ask(q: string = 'Are you sure?', d: string = 'This action cannot be undone'): Promise<boolean> {
        question.value = q
        desc.value = d
        answer.value = undefined
        open.value = true

        popup.value.openPopup()

        return new Promise((resolve) => {

            const checkAnswer = async () => {
                if(answer.value != undefined || !open.value) {
                    console.log('resolved')
                    this.closePopup().then(() => {
                        resolve(answer.value || false)
                    })

                    console.log('closed')
                } else {
                    setTimeout(checkAnswer, 50)
                }
            }
            
            checkAnswer()
            // const interval = setInterval(async () => {
            //     if(answer.value != undefined || !open.value) {
            //         resolve(answer.value || false)
            //         console.log('resolved')
            //         await this.closePopup()

            //         console.log('closed')
            //         clearInterval(interval)
            //     }
            // }, 50)
        })
    },
    async closePopup() {
        open.value = false
        popup.value.closePopup()
    },
})

</script>

<style scoped lang="scss">

h1 {
    font-size: 24pt;
    margin-bottom: 0.5rem;
    padding: 10px;
}

span {
    font-size: 16pt;
    margin: 50px;
}

#answer {
    display: flex;
    gap: 1rem;
    justify-content: center;

    button {
        padding: 1rem;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        width: 120px;
        height: 60px;
        font-size: 16pt;
    }

    padding: 10px;
}

</style>