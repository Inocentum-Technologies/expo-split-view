const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// 1. Watch parent module source
config.watchFolders = [workspaceRoot];

// 2. Resolve modules exclusively from example/node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
];

// 3. Block parent node_modules to prevent dual-package collision
config.resolver.blockList = [
  new RegExp(`^${path.resolve(workspaceRoot, 'node_modules')}\\/.*$`),
];

module.exports = config;
