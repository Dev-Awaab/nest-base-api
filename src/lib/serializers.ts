export const errorSerializer = (error: Error) => {
  if (!error) return error;
  return {
    type: error.name,
    message: error.message,
    stack: error.stack,
    ...(error['code'] && { code: error['code'] }),
    ...(error['status'] && { status: error['status'] }),
  };
};

export const requestSerializer = (req: any) => {
  if (!req) return req;
  return {
    method: req.method,
    url: req.url,
    headers: req.headers,
  };
};
