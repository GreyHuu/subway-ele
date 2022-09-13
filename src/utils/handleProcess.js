const {isMainThread, parentPort, workerData} = require('worker_threads');
const childProcess = require("child_process")
const execSync = childProcess.execSync

if (!isMainThread) {
    // try {
        let res = execSync(workerData.shell).toString()
        parentPort.postMessage({
            res
        });
    // } catch (e) {
    //     throw e
    // }
}