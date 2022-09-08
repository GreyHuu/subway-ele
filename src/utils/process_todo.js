/**
 *  扫描当前系统的全部进程,已数组的形式返回
 */

// import childProcess from "child_process"
// import moment from "moment"
const childProcess = require("child_process")
const moment = require("moment")
const {getItem} = require("@/utils/localStorage")
const execSync = childProcess.execSync

/**
 * 同步的获取全部进程的进程名 进程id
 * @param name
 * @returns {*[]}
 */
const handleGetProcessList = () => {
    let cmd = process.platform === 'win32' ? 'tasklist' : 'ps aux'
    const stdout = execSync(cmd).toString()
    let processesObject = []
    stdout.split('\n').filter((line) => {
        let processMessage = line.trim().split(/\s+/)
        //processMessage[0]进程名称 ，processMessage[1]进程 id
        // console.log(processMessage);
        let len = processMessage.length
        processesObject.push({
            processName: process.platform === 'win32' ? processMessage[0] : processMessage[10],
            processId: processMessage[1]
        })
    })
    // console.log(processesObject);
    return processesObject
}


/**
 * 根据id 获得进程的创建时间
 * @param id
 */
const handleGetProcessCreationDateById = (id) => {
    let flag = process.platform === 'win32'  // true: win    false:  linux
    let cmd = flag ? `wmic process ${id} get CreationDate` : `ps -o lstart -p  ${id}`
    const stdout = execSync(cmd).toString()
    const results = []
    let millTime;
    stdout.split('\n').filter((line) => {
        let processMessage = line.trim().split(/\s+/)
        if (processMessage) results.push(processMessage)
    })
    if (flag) {
        // 获得 形如YYYYMMDDHHmmss的时间
        const timeStr = results[1][0].split(".")[0]
        millTime = moment(timeStr, "YYYYMMDDHHmmss").valueOf()
    } else {
        // console.log(results[1].toString());
        let time = changeTime(results[1])
        // console.log(time);
        millTime = moment(time, "YYYY-MMMM-DD-HH:mm:ss").valueOf()
    }
    return millTime
}

/**
 * 改变时间格式
 * @param linux_date
 * @returns {string}
 */
function changeTime(linux_date) {
    return linux_date[4] + '-' + linux_date[1] + '-' + linux_date[2] + '-' + linux_date[3]
}

/**
 * 运行某个shell脚本
 * @param names
 * @param type
 * @returns {*[]}
 */
const handleStartShell = (names, type) => {
    let flag = []   // 标记每个脚本是否执行成功
    let shellName = type === "start" ? "start.sh" : "kill.sh"
    names.forEach(item => {
        let path = getPathByName(item)
        let cmd = process.platform === 'win32' ? `git ${path + '\\' + shellName}` : `sh ${path + '/' + shellName}`
        console.log("cmd", cmd);
        let stdout;
        try {
            stdout = execSync(cmd).toString()
            flag.push(1)
            console.log(stdout);
        } catch (e) {
            flag.push(0)
            console.log("error", e);
        }
        console.log(flag);
    })
    return flag
}

const getPathByName = (name) => {
    return getItem(name)
}


module.exports = {
    viewProcessesList: handleGetProcessList,
    getProcessMillTimeById: handleGetProcessCreationDateById,
    handleStartShell: handleStartShell
}
