const path = require("path");

// process.main.filename refers to the entry point file of our app
// path.dirname() gets the directory path of the given file
// This will return the directory of the main entry point
module.exports = path.dirname(require.main.filename);
