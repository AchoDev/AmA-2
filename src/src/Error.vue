<template>
    <div>
        <center v-if="reloaded">
            <h2 style="color: green">Everything has been reloaded, you can now restart this app</h2>
        </center>
      <center>
        <h1>Error while loading your save file</h1>
        <h2>Your save file is either corrupt or wrong</h2>

        <details>
          <summary>Internal raw storage</summary>
          <p>{{ storage }}</p>
        </details>
        <details>
          <summary>Error code</summary>
          <p>{{ error }}</p>
        </details>

        <h1>What now?</h1>
        <p>Don't worry, just because you see this, doesn't mean you lost everything.</p>
        <br>
        <p>Please contact me at my email address: <a href="mailto:ahmedhdasi89@gmail.com">ahmedhdasi89@gmail.com</a>. Include the error. </p>

        <hr>

        <h1 style="color: red">WARNING</h1>
        <p>Use the below actions <b>ONLY</b> if you know what you're doing, don't mind your file being deleted / made unusable or you're received instructions by me on how to recover your save data.</p>
        <p>These actions <b>CAN AND WILL</b> wipe your save, if you handle them without caution and know-how</p>

        <p>Input raw file data</p>
        <textarea v-model="_newFileText" cols="60" rows="20"></textarea>
        <br>
        <button @click="save(JSON.parse(_newFileText))">Inject</button>

        <br>
        <br>
        <br>
        
        <button @click="save({
          lastOpenDict: -1,
          settings: {
            wordsPerPage: 10,
            wordSize: 20,
            dividerBetweenWords: true,
            darkmode: false
          },
          dictionaries: []
        }).then(() => load())">Purge save</button>
        
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>

      </center>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {save, loadStorage} from './storage'

defineProps<{
    error: string
}>()

const _newFileText = ref("")
const storage = ref()

const reloaded = ref(false)

function load() {
    reloaded.value = true;
}

loadStorage().then((s) => storage.value = s)

</script>

<style scoped>

div {
  user-select: all !important;
}

button {
  width: 300px;
  height: 100px;
}

</style>