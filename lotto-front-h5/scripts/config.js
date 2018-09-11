const path = require('path');

const ROOT_DIR = path.join(__dirname, '../');
const SOURCE_DIR = path.join(ROOT_DIR, 'src');
const PROJECTS_DIR = path.join(ROOT_DIR, 'projects');

module.exports = {
  port: 8080,
  host: '0.0.0.0',
  ROOT_DIR: ROOT_DIR,
  SOURCE_DIR: SOURCE_DIR,
  PROJECTS_DIR: PROJECTS_DIR,
  ENV_PRODUCTION: 'production',
  ENV_DEVELOPMENT: 'development',
  ENV_SIT: 'sit',
  ENV_UAT: 'uat',
  ENV_PREVIEW: 'preview'
};
