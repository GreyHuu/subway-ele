const {Menu} = require('electron')//引入electron
const {getAllValueList, getAllKeyList, setItem} = require("@/utils/localStorage")
const dialog = require('electron').dialog;
let pathList = getAllValueList();
let keyList = getAllKeyList();
const template = [
    {
        label: '刷新',
        submenu: [{
            label: "刷新",
            role: "reload"
        }, {
            label: "强制刷新",
            role: "forcereload"
        }],
    },
    {
        label: '路径修改',
        submenu: [
            {
                label: '行人检测',
                click: () => handleShDirectory(1)
            },
            {
                label: '杂物检测',
                click: () => handleShDirectory(2)
            },
            {
                type: 'separator'
            },
            {
                label: '行人逆行检测',
                click: () => handleShDirectory(3)
            },
            {
                label: '行人摔倒检测',
                click: () => handleShDirectory(4)
            },
        ]
    }
]

/**
 * 修改不同的路径
 * @param index
 * @returns {Promise<void>}
 */
async function handleShDirectory(index) {
    let currentPath = pathList[index] ? pathList[index] : pathList[0]
    const data = await dialog.showOpenDialog(null, {
        defaultPath: currentPath,
        properties: ['openDirectory']
    })
    if (!data.canceled) {
        // console.log(keyList,index);
        // console.log(keyList[index]);
        setItem(keyList[index], data.filePaths[0])
        pathList = getAllValueList()
    }
     pathList = getAllValueList();
     keyList = getAllKeyList();
}

const m = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(m)
