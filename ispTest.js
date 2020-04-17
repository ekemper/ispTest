const { exec } = require('child_process');
const { spawn } = require('child_process');
const moment = require('moment')
const cron = require('node-cron');
const fs = require('fs');
const axios = require('axios');
 
class IspTest {

    constructor(){
        this.LOCAL_DATA_FILE_NAME = 'local.json'
        this.cmd = 'ls' //'speedtest --json'
        this.state = {}
    }

    async run() {
        if(this.state.runningTest) return
        this.state.runningTest = true
        exec(this.cmd, async (err, stdout, stderr) => {
            if (err) {
                this.handleErr(err)
            } else {
                const stdoutTemp = {"client": {"rating": "0", "loggedin": "0", "isprating": "3.7", "ispdlavg": "0", "ip": "69.51.8.49", "isp": "Arachnitec", "lon": "-107.7533", "ispulavg": "0", "country": "US", "lat": "38.1381"}, "bytes_sent": 1261568, "download": 1758074.8687400834, "timestamp": "2020-04-17T00:24:34.911410Z", "share": null, "bytes_received": 2251312, "ping": 828.592, "upload": 814704.3737296779, "server": {"latency": 828.592, "name": "Delta, CO", "url": "http://speedtest2.elevatefiber.com:8080/speedtest/upload.php", "country": "United States", "lon": "-108.0690", "cc": "US", "host": "speedtest2.elevatefiber.com:8080", "sponsor": "Elevate Fiber", "lat": "38.7422", "id": "18369", "d": 72.58225442790406}}
                stdout = stdoutTemp
                if(stderr) throw new Error(`stderr: ${stderr}`);
                this.saveDataPoint(stdout)
                await this.attemptToPostLocalData()
                this.state.runningTest = false
            }
        });
    };

    saveDataPoint(newDataPoint){
        const existingLocalData = this.getDataFromFile()
        console.log({existingLocalData})
        const updatedLocalData = [...existingLocalData , newDataPoint]
        this.writeToLocalData(updatedLocalData)
    }

    handleErr(error){
        const newErrDataPoint = {
            timestamp: moment(),
            error
        }

        this.saveDataPoint(newErrDataPoint)
    }

    getDataFromFile(){
        try {
            return require(`./${this.LOCAL_DATA_FILE_NAME}`);
        } catch (readError) {
            const fileDoesNotExist = readError.code === 'MODULE_NOT_FOUND'
            if(fileDoesNotExist){
                console.warn('no local data file, writing empty array to ' + this.LOCAL_DATA_FILE_NAME)
                this.writeToLocalData([])
                return []
            } else {
                throw new Error(readError)
            }
        }
    }

    writeToLocalData(updatedLocalData){
        const serialized = JSON.stringify(updatedLocalData)
        try {
            fs.writeFileSync(`./${this.LOCAL_DATA_FILE_NAME}`, serialized)
        } catch (writeError) {
            throw new Error(writeError)
        }
    }

    async attemptToPostLocalData(){
        try{
            const resp = await axios({
                method: 'post',
                url: this.postUrl,
                data: 'this.getDataFromFile()'
              });

            console.log(`Posted Data, ${moment()}: `, {resp})
        } catch (error) {
            throw new Error(error)
        }
    }

}

const ispTest = new IspTest()

ispTest.run()

// cron.schedule('* * * * *', async () => {
//     await ispTest.run
// });


  