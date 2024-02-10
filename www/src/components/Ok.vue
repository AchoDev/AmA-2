<template>

    <PopupContainer ref="popup">
        <div id="ok-container">
            <h1>{{ notificationRef }}</h1>
            <span>{{ descRef }}</span>

            <div id="ok">
                <button @click="closePopup()">OK</button>
            </div>
        </div>
    </PopupContainer>

</template>

<script setup lang="ts">

import { ref } from 'vue';
import PopupContainer from './PopupContainer.vue';

const notificationRef = ref('')
const descRef = ref('')
const popup = ref()

function closePopup() {
    popup.value.closePopup()
}

defineExpose({
    notify(notification: string, desc: string) {
        notificationRef.value = notification
        descRef.value = desc
        popup.value.openPopup()
    },
})
</script>

<style scoped lang="scss">

#ok-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;

    gap: 20px;

    h1 {
        margin: 0;
    }

    span {
        text-align: center;
        font-size: 13pt;
    }

    button {
        width: 200px;
        height: 50px;
        border-radius: 10px;
        border: none;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
        cursor: pointer;
        margin-top: 20px;
        font-size: 13pt;
    }
}

</style>