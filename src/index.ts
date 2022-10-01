import { Indent } from './Indent';
import { parse as parseV2 } from './openApi/v2';
import { parse as parseV3 } from './openApi/v3';
import { getOpenApiSpec } from './utils/getOpenApiSpec';
import { getOpenApiVersion, OpenApiVersion } from './utils/getOpenApiVersion';
import { isString } from './utils/isString';
import { postProcessClient } from './utils/postProcessClient';
import { registerHandlebarTemplates } from './utils/registerHandlebarTemplates';
import { writeClient } from './utils/writeClient';

export { Indent } from './Indent';

export type Options = {
    input: string | Record<string, any>;
    output: string;
    exportCore?: boolean;
    exportServices?: boolean;
    exportModels?: boolean;
    exportHooks?: boolean;
    exportSchemas?: boolean;
    indent?: Indent;
    postfix?: string;
    contextName?: string;
    reactQueryImport?: string;
    write?: boolean;
};

/**
 * Generate the OpenAPI client. This method will read the OpenAPI specification and based on the
 * given language it will generate the client, including the typed models, validation schemas,
 * service layer, etc.
 * @param options Options
 * @param options.input The relative location of the OpenAPI spec
 * @param options.output The relative location of the output directory
 * @param options.exportCore Generate core client classes
 * @param options.exportServices Generate services
 * @param options.exportModels Generate models
 * @param options.exportHooks Generate react-query hooks
 * @param options.exportSchemas Generate schemas
 * @param options.indent Indentation options (4, 2 or tab)
 * @param options.postfix Service name postfix
 * @param options.contextName Hook context name (default: 'ServiceContext')
 * @param options.reactQueryImport Import path for react-query (default: '@tanstack/react-query')
 * @param options.write Write the files to disk (true or false)
 */
export const generate = async ({
    input,
    output,
    exportCore = true,
    exportServices = true,
    exportModels = true,
    exportSchemas = false,
    exportHooks = false,
    indent = Indent.SPACE_4,
    postfix = 'Service',
    contextName = 'ServiceContext',
    reactQueryImport = '@tanstack/react-query',
    write = true,
}: Options): Promise<void> => {
    const openApi = isString(input) ? await getOpenApiSpec(input) : input;
    const openApiVersion = getOpenApiVersion(openApi);
    const templates = registerHandlebarTemplates();

    switch (openApiVersion) {
        case OpenApiVersion.V2: {
            const client = parseV2(openApi);
            const clientFinal = postProcessClient(client);
            if (!write) break;
            await writeClient(
                clientFinal,
                templates,
                output,
                exportCore,
                exportServices,
                exportModels,
                exportSchemas,
                exportHooks,
                indent,
                postfix,
                contextName,
                reactQueryImport
            );
            break;
        }

        case OpenApiVersion.V3: {
            const client = parseV3(openApi);
            const clientFinal = postProcessClient(client);
            if (!write) break;
            await writeClient(
                clientFinal,
                templates,
                output,
                exportCore,
                exportServices,
                exportModels,
                exportSchemas,
                exportHooks,
                indent,
                postfix,
                contextName,
                reactQueryImport
            );
            break;
        }
    }
};

export default {
    generate,
};
