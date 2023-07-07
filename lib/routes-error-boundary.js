import authMiddleware from "../middlewares/authMiddleware.js";

const controllerTryCatchWrapper = (controller) => {
  return async function wrappedController(req, res, next) {
    try {
      return await controller(req, res, next);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
};

export const route = (
  router,
  method,
  routePath,
  controller,
  checkAuth = true
) => {
  if (checkAuth) {
    router[method](
      routePath,
      authMiddleware,
      controllerTryCatchWrapper(controller)
    );
  } else {
    router[method](routePath, controllerTryCatchWrapper(controller));
  }
};
