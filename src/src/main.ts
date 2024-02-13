import { createApp } from 'vue'
import App from './App.vue'

declare global {
    interface Window {
        cordova: any;
    }
}

// alert("something")

createApp(App).mount('#app')

// if(window.cordova && window.cordova.onDeviceReady) { 
//     alert("already loaded")
//     createApp(App).mount('#app')
// }

// document.addEventListener('deviceready', () => {
//     alert('deviceready event fired')
//     createApp(App).mount('#app')
// }, false)
