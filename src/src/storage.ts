import { Dictionary } from "./components/dictionaryType";
import Settings from "./components/settings";

declare let cordova: any;

export function loadStorage(): Promise<string> {
    console.log("LOADING STORAGE")

    if(typeof cordova === 'undefined') {
        return Promise.resolve("")
    }

    return new Promise((resolve, reject) => {
        window.resolveLocalFileSystemURL(cordova.file.syncedDataDirectory, (fs: any) => {
            console.log("resolved local file system")
            fs.getFile("amaStorage.json", { create: true, exclusive: false }, (entry: any) => {
                console.log("GOT FILE!!")
                entry.file((file: Blob) => {
                    let reader = new FileReader();
                    reader.onloadend = function() {
                        console.log(this.result);
                        resolve(this.result as string);
                    }
                    reader.readAsText(file);
                }, (e: any) => {
                    console.log("Error reading file: ", e);
                    reject(e)
                })
            }, (e: any) => {
                console.log("Error getting file: ", e);
                reject(e)
            })
        }, (e: any) => {
            console.log("Error resolving local file system: ", e);
            reject(e)
        })
        
    });
}

export function save(Data: {
    lastOpenDict: number;
    settings: Settings;
    dictionaries: Dictionary[];
}): Promise<void> {

    if(typeof cordova === 'undefined') {
        return Promise.resolve();
    }

    return new Promise((resolve, _) => {
        window.resolveLocalFileSystemURL(cordova.file.syncedDataDirectory, (fs: any) => {
            fs.getFile("amaStorage.json", { create: true, exclusive: false }, (entry: any) => {
                entry.createWriter((writer: any) => {
                    writer.onwriteend = () => {
                        console.log("Successful file write...");
                        resolve()
                    }
                    writer.write(JSON.stringify(Data));
                })
            })
        })
    })
}