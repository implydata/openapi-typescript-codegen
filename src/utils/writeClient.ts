import { resolve } from 'path';

import type { Client } from '../client/interfaces/Client';
import type { Indent } from '../Indent';
import { mkdir, rmdir } from './fileSystem';
import { isSubDirectory } from './isSubdirectory';
import type { Templates } from './registerHandlebarTemplates';
import { writeClientCore } from './writeClientCore';
import { writeClientIndex } from './writeClientIndex';
import { writeClientModels } from './writeClientModels';
import { writeClientSchemas } from './writeClientSchemas';
import { writeClientServices } from './writeClientServices';

/**
 * Write our OpenAPI client, using the given templates at the given output
 * @param client Client object with all the models, services, etc.
 * @param templates Templates wrapper with all loaded Handlebars templates
 * @param output The relative location of the output directory
 * @param exportCore Generate core client classes
 * @param exportServices Generate services
 * @param exportModels Generate models
 * @param exportSchemas Generate schemas
 * @param exportSchemas Generate schemas
 * @param indent Indentation options (4, 2 or tab)
 * @param postfix Service name postfix
 */
export const writeClient = async (
    client: Client,
    templates: Templates,
    output: string,
    exportCore: boolean,
    exportServices: boolean,
    exportModels: boolean,
    exportSchemas: boolean,
    indent: Indent,
    postfix: string
): Promise<void> => {
    const outputPath = resolve(process.cwd(), output);
    const outputPathCore = resolve(outputPath, 'core');
    const outputPathModels = resolve(outputPath, 'models');
    const outputPathSchemas = resolve(outputPath, 'schemas');
    const outputPathServices = resolve(outputPath, 'services');

    if (!isSubDirectory(process.cwd(), output)) {
        throw new Error(`Output folder is not a subdirectory of the current working directory`);
    }

    if (exportCore) {
        await rmdir(outputPathCore);
        await mkdir(outputPathCore);
        await writeClientCore(client, templates, outputPathCore, indent);
    }

    if (exportServices) {
        await rmdir(outputPathServices);
        await mkdir(outputPathServices);
        await writeClientServices(client.services, templates, outputPathServices, indent, postfix);
    }

    if (exportSchemas) {
        await rmdir(outputPathSchemas);
        await mkdir(outputPathSchemas);
        await writeClientSchemas(client.models, templates, outputPathSchemas, indent);
    }

    if (exportModels) {
        await rmdir(outputPathModels);
        await mkdir(outputPathModels);
        await writeClientModels(client.models, templates, outputPathModels, indent);
    }

    if (exportCore || exportServices || exportSchemas || exportModels) {
        await mkdir(outputPath);
        await writeClientIndex(
            client,
            templates,
            outputPath,
            exportCore,
            exportServices,
            exportModels,
            exportSchemas,
            postfix
        );
    }
};
