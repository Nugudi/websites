/**
 * @param {import("./openapi.json")} spec
 * @return {import("openapi3-ts/oas31").OpenAPIObject}
 */
export default (spec) => {
  if (
    !spec ||
    !spec.paths ||
    !spec.paths["/api/v1/auth/email/send-code"] ||
    !spec.paths["/api/v1/auth/email/send-code"].post
  ) {
    return spec;
  }

  spec.paths["/api/v1/auth/email/send-code"].post.responses = {
    200: {
      description: "이메일 인증 코드 전송 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
      },
    },
  };

  return spec;
};
