'use strict'

import {app, protocol, BrowserWindow, dialog, ipcMain} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS3_DEVTOOLS} from 'electron-devtools-installer'
import {viewProcessesList, getProcessMillTimeById, handleStartShell} from "@/utils/process_todo"
import path from "path";

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: {secure: true, standard: true}}])

async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1000, height: 800,
        webPreferences: {
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            preload: process.env.WEBPACK_DEV_SERVER_URL ? path.join(__dirname, '../src/electron/preload.js') : path.join(__dirname, '/preload.js')
        }
    })
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // console.log(process.env.WEBPACK_DEV_SERVER_URL);
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        // win.webContents.openDevTools()
        createProtocol('app')
        // Load the index.html when not in development
        await win.loadURL('app://./index.html')
    }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', async () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) await createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS3_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }
    // 注册各种监听
    //  打开文件对话框
    ipcMain.handle('dialog:openFile', handleFileOpen)
    // 获取全部进程
    ipcMain.handle('get:getProcessList', handleGetAllProcessList)
    // 根据进程id获得运行时间
    ipcMain.handle('get:getTimeById', (a = null, [processID]) => handleGetProcessDetailByID(processID))
    // 启停模型
    ipcMain.handle('process:start', (a = null, names) => handleStartShellByName(names, "start"))

    ipcMain.handle('process:stop', (a = null, names) => handleStartShellByName(names, "stop"))
    require("@/electron/menu")
    await createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}


/**
 * 处理打开文件操作
 * @returns {Promise<string>}
 */
async function handleFileOpen() {
    const {canceled, filePaths} = await dialog.showOpenDialog()
    if (canceled) {
        return null
    } else {
        return filePaths[0]
    }
}

/**
 * 获得全部的进程列表
 * @returns {Promise<[]>}
 */
async function handleGetAllProcessList() {
    let data = viewProcessesList()
    return data
}

/**
 * 根据进程id获得该进程的信息 -- 运行时间
 * @returns {Promise<[]>}
 */
async function handleGetProcessDetailByID(id) {
    let data = getProcessMillTimeById(id)
    return data
}


async function handleStartShellByName(names, type) {
    let data = handleStartShell(names, type)
    return data
}


// /**
//  * 打开新窗口
//  * @param processId
//  * @returns {Promise<void>}
//  */
// async function handleOpenDetailWindows(processId) {
//     const winURL = process.env.WEBPACK_DEV_SERVER_URL ? process.env.WEBPACK_DEV_SERVER_URL : "'app://./index.html'"
//     //调用 BrowserWindow 打开新窗口
//     let win2 = new BrowserWindow({
//         width: 600, height: 450, webPreferences: {
//             nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
//             contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION, // 导入预加载文件
//             preload: path.join(__dirname, '../src/electron/preload.js')
//         },
//     })
//
//     await win2.loadURL(winURL + "#/detail");
//
//     win2.webContents.openDevTools();
//
//     win2.on('closed', () => {
//         win2 = null;
//     })
//
// }
