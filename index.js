const fs = require("fs");
const path = require("path");

const createDir = dest => {
  fs.mkdirSync(path.join(__dirname, dest), { recursive: true }, err => {
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
      const isDirectory = fs.statSync(path.join(src, `${file}`)).isDirectory();

      if (!isDirectory) {
        if (!fs.existsSync(`${dest}/${file.toString()[0]}`)) {
          createDir(`${dest}/${file.toString()[0]}`);
        }
        fs.writeFile(
          path.join(__dirname, "dist", file.toString()[0], file.toString()),
          file,
          err => {
            if (err) {
              console.log(err);
            } else {
              console.log("Copied!");
            }
          }
        );
      } else {
        getFiles(path.join(src, `${file}`), dest);
      }
    });
  });
};

const deleteFolderRecursive = function(src) {
  if (fs.existsSync(src)) {
    fs.readdirSync(src).forEach((file, index) => {
      const cursrc = path.join(src, file);
      if (fs.lstatSync(cursrc).isDirectory()) {
        // recurse
        deleteFolderRecursive(cursrc);
      } else {
        // delete file
        fs.unlinkSync(cursrc);
      }
    });
    fs.rmdirSync(src);
  }
};

const sort = (src, dist, deletsrc = false) => {
  const directoryPath = path.join(__dirname, src);

  createDir(dist);
  getFiles(directoryPath, dist);

  if (deletsrc) {
    deleteFolderRecursive(src);
  }
};

sort("src", "dist");
