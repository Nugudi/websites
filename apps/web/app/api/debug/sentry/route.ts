class SentryExampleAPIError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "SentryExampleAPIError";
  }
}

export const GET = () => {
  throw new SentryExampleAPIError(
    "This error is raised on the backend called by the example page.",
  );
};
