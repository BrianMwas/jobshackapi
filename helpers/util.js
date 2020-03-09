const fs = require('fs');

function deleteFolderRecursive(path) {
    if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            console.log("index is " + index);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });

        console.log("After")

        console.log(`Deleting directory "${path}"...`);
        fs.rmdirSync(path);
    }
};

module.exports.deleteDir = deleteFolderRecursive;
