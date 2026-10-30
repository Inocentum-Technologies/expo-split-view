let createRunOncePlugin;
try {
  createRunOncePlugin = require('@expo/config-plugins').createRunOncePlugin;
} catch {
  createRunOncePlugin = null;
}

const pkg = require('./package.json');

/**
 * Expo Config Plugin for expo-split-view.
 *
 * Configures the host app for split-view layout compatibility:
 * - Enables iPad / tablet support (`ios.supportsTablet: true`) by default.
 *   Without this, iOS locks apps to an iPhone letterbox container where split view never triggers.
 *
 * @param {import('@expo/config-plugins').ExportedConfig} config
 * @param {{ supportsTablet?: boolean }} [props]
 */
function withSplitView(config, props = {}) {
  const supportsTablet = props.supportsTablet !== false;

  if (supportsTablet) {
    if (!config.ios) {
      config.ios = {};
    }
    // Only set if not explicitly configured by the developer
    if (config.ios.supportsTablet === undefined) {
      config.ios.supportsTablet = true;
    }
  }

  return config;
}

module.exports = createRunOncePlugin
  ? createRunOncePlugin(withSplitView, pkg.name, pkg.version)
  : withSplitView;
