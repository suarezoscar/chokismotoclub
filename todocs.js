const fs = require("fs");
const path = require("path");

const sourceDir = path.join(__dirname, "dist", "chokismotoclub", "browser");
const destDir = path.join(__dirname, "docs");
const cnameFilePath = path.join(destDir, "CNAME");
const cnameContent = "stg.chokismotoclub.es";

function copyFile(src, dest) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(src);
    const writeStream = fs.createWriteStream(dest);

    readStream.on("error", reject);
    writeStream.on("error", reject);
    writeStream.on("finish", resolve);

    readStream.pipe(writeStream);
  });
}

function copyDirectory(src, dest) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dest, { recursive: true }, (err) => {
      if (err) return reject(err);

      fs.readdir(src, { withFileTypes: true }, (err, entries) => {
        if (err) return reject(err);

        Promise.all(
          entries.map((entry) => {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            return entry.isDirectory()
              ? copyDirectory(srcPath, destPath)
              : copyFile(srcPath, destPath);
          })
        )
          .then(resolve)
          .catch(reject);
      });
    });
  });
}

function removeDirectory(dir) {
  return new Promise((resolve, reject) => {
    fs.rm(dir, { recursive: true, force: true }, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function createCnameFile(filePath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

async function moveFiles() {
  try {
    await removeDirectory(destDir);
    await copyDirectory(sourceDir, destDir);
    await createCnameFile(cnameFilePath, cnameContent);
    console.log("Archivos movidos y CNAME creado exitosamente!");
  } catch (err) {
    console.error("Error al mover los archivos o crear el CNAME:", err);
  }
}

moveFiles();
