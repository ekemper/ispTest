const { exec } = require('child_process');

class IspTest {
  constructor() {
    this.run()
  }

  run() {
    // exec('speedtest', (err, stdout, stderr) => {
    //   if (err) {
    //     //some err occurred
    //     console.error(err)
    //   } else {
    //   // the *entire* stdout and stderr (buffered)
    //   console.log(`stdout: ${stdout}`);
    //   console.log(`stderr: ${stderr}`);
    //   }
    // });
    const { spawn } = require('child_process');
    const child = spawn('speedtest-cli', );
    // if you want text chunks
    child.stdout.setEncoding('utf8');

    child.stdout.on('data', chunk => {
      // data from the standard output is here as buffers
      console.log(chunk)
    });

    // since these are streams, you can pipe them elsewhere
    //child.stderr.pipe(dest);
    child.on('close', code => {
      console.log(`child process exited with code ${code}`);
    });
  };

}

new IspTest()