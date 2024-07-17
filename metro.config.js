const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.resolverMainFields.unshift('react-native');

module.exports = config;