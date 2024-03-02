import { createApp } from 'vue'
import App from './App.vue'

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


document.addEventListener('deviceready', () => {
    console.log("DEVICE READY")
    load()
}, false)

function load() {
    createApp(App).mount('#app')
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory + 'dictionary.json', gotFile, fail);
}

function fail(e: any) {
    alert("FileSystem Error");
    console.log(e);
}

function gotFile(fileEntry: any) {
    fileEntry.file(function(file: any) { 

        let reader = new FileReader();
        
        reader.onloadend = function() {
            console.log(this.result);
        }

        reader.readAsText(file);
    })
}
