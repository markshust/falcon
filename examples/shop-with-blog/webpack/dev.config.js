const path = require('path');
const deepAssign = require('deep-assign');

const appPath = path.join(__dirname, '..');
module.exports = deepAssign(require('falcon-core/webpack/dev.config')(appPath), {});
