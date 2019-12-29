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

const allfiles = []

const getFiles = async (src, dest) => {
  const files = await readdir(src);
  
  files.forEach(async function(file) {
    let isDirectory;
      const stats = await stat(src, file);

      isDirectory = stats.isDirectory();

      if (!isDirectory) {
        if (!fs.existsSync(`${dest}/${file.toString()[0]}`)) {
          createDir(`${dest}/${file.toString()[0].toUpperCase()}`);
        }

        allfiles.push(copyFiles(file))
        

      } else {
        getFiles(path.join(src, `${file}`), dest);
      }
  });
};

const readdir = src => {
  return new Promise((resolve, reject) => {
    fs.readdir(src, function(err, files) {
      if (err) {
        return console.log("Unable to scan directory: " + err);
      } else resolve(files);
    });
  });
};

const copyFiles = (file) => {
  return new Promise(resolve => {
    fs.writeFile(
      path.join(__dirname, "dist", file.toString()[0], file.toString()),
      file,
      err => {
        if (err) {
          console.log(err);
        }
      }
    );

    resolve()
  })
}

const stat = (src, file) => {
  return new Promise((resolve, reject) => {
    fs.stat(path.join(src, `${file}`), function(err, stats) {
      if (err) {
        console.log(err);
      }
      else resolve (stats)
    })
  })
};

const deleteFolderRecursive = function(src) {
  //   console.log(src);
  if (fs.existsSync(src)) {
    fs.readdir(src, (err, files) => {
      files.forEach((file, index) => {
        const cursrc = path.join(src, file);
        let isDirectory;
        fs.lstat(cursrc, (err, stats) => {
          isDirectory = stats.isDirectory();

          if (!isDirectory) {
            fs.unlink(cursrc, err => {
              if (err) throw err;
            });
          }
          if (isDirectory) {
            fs.readdir(cursrc, (err, files) => {
              // console.log(cursrc, isDirectory, files, files.length);
              if (files.length) {
                deleteFolderRecursive(cursrc);
              } else {
                fs.rmdir(file, err => {
                  if (err) throw err;
                });
              }
            });
          }
        });
      });
    });
  }
};

const sort = (src, dist, deletsrc = false) => {
  return new Promise(resolve => {
    const directoryPath = path.join(__dirname, src);

    createDir(dist);
    getFiles(directoryPath, dist);

    Promise.all(allfiles).then(() => {
      console.log('copied')
    })
    process.on("exit", () => {
      if (deletsrc) {
        deleteFolderRecursive(path.join(__dirname, src));
      }

      resolve();
    });
  });
};

sort("src", "dist", false).then(function() {
  console.log(`‘Success’`);
});

module.exports = sort;
