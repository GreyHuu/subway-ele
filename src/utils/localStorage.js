const storage = require('electron-localstorage');
const {app} = require('electron')
const path = require('path')
const dataPath = path.join(app.getPath('userData'), 'data.json')
const currentPath = require('os').homedir()
let a
// const path = require("path")
// console.log(path.join(__filename, '../assets/file.json'));
// storage.setStoragePath(path.join(__filename, '../assets/file.json'));
storage.setStoragePath(dataPath);

storage.setItem("defaultPath", currentPath)
storage.getItem("persondtc") ? a = '' : storage.setItem("persondtc", currentPath)
storage.getItem("truckdtc") ? a = '' : storage.setItem("truckdtc", currentPath)
storage.getItem("retrodtc") ? a = '' : storage.setItem("retrodtc", currentPath)
storage.getItem("falldtc") ? a = '' : storage.setItem("falldtc", currentPath)

// console.log(storage.getStoragePath());
const getItem = (key) => storage.getItem(key)
const setItem = (key, value) => storage.setItem(key, value)

const getAllValueList = () => {
    const allValue = storage.getAll()
    const valueList = []
    for (let key in allValue) {
        valueList.push(allValue[key])
    }
    // console.log(valueList);
    return valueList
}
const getAllKeyList = () => {
    const allValue = storage.getAll()
    const valueList = []
    for (let key in allValue) {
        valueList.push(key)
    }
    // console.log(valueList);
    return valueList
}


module.exports = {
    getItem,
    setItem,
    getAllValueList,
    getAllKeyList
}
