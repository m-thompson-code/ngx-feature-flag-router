const nxPreset = require('@nrwl/jest/preset').default;

module.exports = {
    ...nxPreset,
    maxWorkers: 1,
    collectCoverage: true,
    coverageReporters: [
        'html', 'json-summary',
    ]
};
