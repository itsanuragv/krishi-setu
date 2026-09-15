import { authHandlers } from "./auth";
import { productHandlers } from "./products";
import { matchingHandlers } from "./matching";
import { orderHandlers } from "./orders";
import { paymentHandlers } from "./payments";
import { deliveryHandlers } from "./delivery";
import { disputeHandlers } from "./disputes";
import { adminHandlers } from "./admin";
import { ratingHandlers } from "./ratings";

export const handlers = [
  ...authHandlers,
  ...productHandlers,
  ...matchingHandlers,
  ...orderHandlers,
  ...paymentHandlers,
  ...deliveryHandlers,
  ...disputeHandlers,
  ...adminHandlers,
  ...ratingHandlers,
];
