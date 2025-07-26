/**
 * @param {import("openapi3-ts/oas31").OpenAPIObject} schema
 * @return {import("openapi3-ts/oas31").OpenAPIObject}
 */
export default (spec) => {
  // Create enum components for response status codes
  if (!spec.components) {
    spec.components = {};
  }
  if (!spec.components.schemas) {
    spec.components.schemas = {};
  }

  // Collect all unique status codes
  const statusCodes = new Set();

  if (spec.paths) {
    Object.values(spec.paths).forEach((pathItem) => {
      Object.values(pathItem).forEach((operation) => {
        if (operation.responses) {
          Object.keys(operation.responses).forEach((status) => {
            statusCodes.add(status);
          });
        }
      });
    });
  }

  // Create enum schema for each status code
  statusCodes.forEach((status) => {
    const enumName = `ResponseStatus_${status}`;
    spec.components.schemas[enumName] = {
      type: "string",
      enum: [status],
      "x-enumNames": [status],
    };
  });

  return spec;
};
