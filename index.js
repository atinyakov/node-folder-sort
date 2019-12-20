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
  if (fs.existsSync(src)) {
    fs.readdir(src, function(err, files) {
      files.forEach((file, index) => {
      const cursrc = path.join(src, file);
      if (fs.lstatSync(cursrc).isDirectory()) {
        // recurse
        deleteFolderRecursive(cursrc);
      } else {
        // delete file
        fs.unlinkSync(cursrc);
      }
    });
    setImmediate(() => fs.rmdir(src, function(err){
      if (err) {
        console.log(err);
      } 
    }));
  })}
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
