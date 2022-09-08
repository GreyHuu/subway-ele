const {contextBridge, ipcRenderer} = require('electron')
// import {contextBridge, ipcRenderer} from "electron"

/**
 * 向渲染进程暴露接口
 */
contextBridge.exposeInMainWorld('electronAPI', {
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    getProcessList: () => ipcRenderer.invoke("get:getProcessList"),
    getTimeById: (processID) => ipcRenderer.invoke("get:getTimeById", [processID]),
    // openDetailWindow: (processId) => ipcRenderer.invoke("open:openDetailWindow", [processId]),
    processStart: (names) => ipcRenderer.invoke("process:start", names),
    processStop: (names) => ipcRenderer.invoke("process:stop", names),
})
