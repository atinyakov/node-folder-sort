const fs = require('fs');
const path = require('path');

const createDir = (distF) => {
    fs.mkdirSync(process.cwd() + distF, {recursive: true}, err => {
        if(err) {
            console.log(err);
        } else {
            console.log('Created folder in', distF);
        }
    })
} 

const distF = '/dist'

// createDir(dist)


// folder analisys

const directoryPath = path.join(__dirname, 'src');

// const filesArr = []
const getFiles = (src, dist) => {
    fs.readdir(src, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        files.forEach(function (file) {
            const isDirectory =  fs.statSync(path.join(src, file)).isDirectory()

            if(!isDirectory) {
                // filesArr.push(file)
                console.log(dist)
                fs.writeFile(path.join(__dirname, dist), file.toString(), err => {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("Copied!")
                    }
                }); 
            } else {
                getFiles(path.join(src, file));
            }
        });
    });
}

getFiles(directoryPath, 'dist');
// console.log(filesArr.sort())

// const sort = (source, dist) => {
//     let oldFile = fs.createReadStream(source);
//     let newFile = fs.createWriteStream(dist);
  
//     oldFile.pipe(newFile);
//     oldFile.on('end', function () {
//       fs.unlinkSync(source);
//     });
//   }

//   sort(directoryPath, dist)