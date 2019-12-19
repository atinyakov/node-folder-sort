const fs = require("fs");
const path = require("path");

const createDir = dest => {
  fs.mkdir(path.join(__dirname, dest), { recursive: true }, err => {
    if (err) {
      console.log(err);
    } else {
      console.log("Created folder in", dest);
    }
  });
};

const getFiles = (src, dest) => {
  fs.readdir(src, function(err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }

    files.forEach(function(file) {
      let isDirectory;
      fs.stat(path.join(src, `${file}`), function(err, stats) {
        isDirectory = stats.isDirectory();

        if (!isDirectory) {
          if (!fs.existsSync(`${dest}/${file.toString()[0]}`)) {
            createDir(`${dest}/${file.toString()[0].toUpperCase()}`);
          }
          fs.writeFile(
            path.join(__dirname, "dist", file.toString()[0], file.toString()),
            file,
            err => {
              if (err) {
                console.log(err);
              }
            }
          );
        } else {
          getFiles(path.join(src, `${file}`), dest);
        }
      });
    });
  });
};

const deleteFolderRecursive = function(src) {
//   console.log(src);
  if (fs.existsSync(src)) {
    fs.readdir(src, (err, files) => {
        if(files) {
            console.log(files)
        }
      files.forEach((file, index) => {
        const cursrc = path.join(src, file);
        let isDirectory;
        fs.lstat(cursrc, (err, stats) => {
          isDirectory = stats.isDirectory();
            console.log(isDirectory);
          if (!isDirectory) {
            // console.log(cursrc.length)

            fs.unlink(cursrc, err => {
              if (err) throw err;
            });
          }
          if (isDirectory){
            fs.readdir(cursrc, (err, files) => {
              console.log(cursrc, isDirectory, files, files.length);
              if (files.length) {
                deleteFolderRecursive(cursrc);
              } else {
                fs.rmdir(file, err => {
                    if (err) throw err;
                });
              }
            })
            // });
            // delete file
            // fs.rmdir(path.join(src), err => {
            //   if (err) throw err;
            // });
            //   }
          }
        });
      });
    //   fs.rmdir(src, err => {
    //     if (err) throw err;
    //   });
    });
//   }
    // fs.rmdir(path.join(src), err => {
    //   if (err) throw err;
    // });
  }
};

const sort = (src, dist, deletsrc = false) => {
  const directoryPath = path.join(__dirname, src);

  createDir(dist);
  getFiles(directoryPath, dist);

  if (deletsrc) {
    deleteFolderRecursive(path.join(__dirname, src));
  }
};

module.exports = sort;
