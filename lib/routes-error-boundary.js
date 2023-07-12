import authMiddleware from "../middlewares/authMiddleware.js";

const functionTryCatchWrapper = (controller) => {
  return async function wrappedController(req, res, next) {
    try {
      return await controller(req, res, next);
    } catch (e) {
      if (e?.statusCode) {
        return res.status(e.statusCode).json({ message: e.message, ...e.body });
      }
      return res.status(500).json({ message: e.message });
    }
  };
};

export const route = (
  router,
  method,
  routePath,
  callbacks,
  checkAuth = true
) => {
  const fnCallbacks = Array.isArray(callbacks)
    ? callbacks.map((cb) => functionTryCatchWrapper(cb))
    : functionTryCatchWrapper(callbacks);

  if (checkAuth) {
    router[method](routePath, [authMiddleware, fnCallbacks]);
  } else {
    router[method](routePath, fnCallbacks);
  }
};
