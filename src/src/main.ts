import { createApp } from 'vue'
// @ts-ignore
import App from './App.vue'
import Error from './Error.vue'

declare global {
    interface Window {
        cordova: any;
        resolveLocalFileSystemURL: any;
    }
}

declare let cordova: any;

// alert("something")

// createApp(App).mount('#app')

// if(window.cordova && window.cordova.onDeviceReady) { 
//     alert("already loaded")
//     createApp(App).mount('#app')
// }

const env = process.env.NODE_ENV || 'development';

if(env === 'development') {
    console.log("DEVELOPMENT")
    load()
}



document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('deviceready', () => {
        console.log("DEVICE rrrrREADY")
        load()
    }, false)
}, false);

function load() {
    try {
        createApp(App).mount('#app')
    } catch(e) {
        createApp(Error, {error: e}).mount('#error')
    }
    if(typeof cordova == 'undefined') return;
}