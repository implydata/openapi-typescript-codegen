#!/usr/bin/env node

'use strict';

const path = require('path');
const { program } = require('commander');
const pkg = require('../package.json');

const params = program
    .name('openapi')
    .usage('[options]')
    .version(pkg.version)
    .requiredOption('-i, --input <value>', 'OpenAPI specification, can be a path, url or string content (required)')
    .requiredOption('-o, --output <value>', 'Output directory (required)')
    .option('--exportCore <value>', 'Write core files to disk', true)
    .option('--exportClients <value>', 'Write clients to disk', true)
    .option('--exportModels <value>', 'Write models to disk', true)
    .option('--exportOperations <value>', 'Write operation request/response types to disk', false)
    .option('--exportSchemas <value>', 'Write schemas to disk', false)
    .option('--indent <value>', 'Indentation options [4, 2, tabs]', '4')
    .option('--postfix <value>', 'Service name postfix', 'Service')
    .parse(process.argv)
    .opts();

const OpenAPI = require(path.resolve(__dirname, '../dist/index.js'));

if (OpenAPI) {
    OpenAPI.generate({
        input: params.input,
        output: params.output,
        exportCore: JSON.parse(params.exportCore) === true,
        exportClients: JSON.parse(params.exportClients) === true,
        exportModels: JSON.parse(params.exportModels) === true,
        exportOperations: JSON.parse(params.exportOperations) === true,
        exportSchemas: JSON.parse(params.exportSchemas) === true,
        indent: params.indent,
        postfix: params.postfix,
    })
        .then(() => {
            process.exit(0);
        })
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}
