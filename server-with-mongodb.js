import { createApp } from "./index.js";
import { AuthModel } from "./src/models/mongodb/authMongodb.js";
import { OrderModel } from "./src/models/mongodb/orderMongodb.js";

createApp({ orderModel: OrderModel, authModel: AuthModel });
