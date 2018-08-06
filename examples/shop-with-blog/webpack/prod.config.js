const path = require('path');
const deepAssign = require('deep-assign');

const appPath = path.join(__dirname, '..');
module.exports = deepAssign(require('@deity/falcon-core/webpack/prod.config')(appPath), {});
