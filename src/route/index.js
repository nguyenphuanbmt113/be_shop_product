import { errHandler, notFound } from "../middleware/handlerError";
import userRouter from "./userRoute";
import categoryRouter from "./categoryRoute";
import productRouter from "./productRoute";
import paymentRouter from "./paymentRoute";
import webHookRouter from "./webHookRoute";
import ordersRouter from "./ordersRoute";
import ordersUserRouter from "./orders-user-Route";
const initRoutes = (app) => {
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/category", categoryRouter);
  app.use("/api/v1/product", productRouter);
  app.use("/api/v1/payment", paymentRouter);
  app.use("/api/v1/webhook", webHookRouter);
  app.use("/api/v1/orders", ordersRouter);
  app.use("/api/v1/orders-user", ordersUserRouter);
  app.use(notFound);
  app.use(errHandler);
  return app.use("/", (req, res) => {
    res.send("server on...");
  });
};

export default initRoutes;
