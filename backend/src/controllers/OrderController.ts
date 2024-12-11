import axios from "axios";
import { Request, Response } from "express";
import Restaurant, { MenuItemType } from "../models/restaurant";
import Order from "../models/order";

const MOMO_PARTNER_CODE = process.env.MOMO_PARTNER_CODE as string;
const MOMO_ACCESS_KEY = process.env.MOMO_ACCESS_KEY as string;
const MOMO_SECRET_KEY = process.env.MOMO_SECRET_KEY as string;
const MOMO_ENDPOINT = "https://test-payment.momo.vn/v2/gateway/api/create";
const FRONTEND_URL = process.env.FRONTEND_URL as string;

const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("restaurant")
      .populate("user");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Đã xảy ra lỗi" });
  }
};

type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    phone: string;
  };
  restaurantId: string;
};

const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;

    const restaurant = await Restaurant.findById(
      checkoutSessionRequest.restaurantId
    );

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    const newOrder = new Order({
      restaurant: restaurant,
      user: req.userId,
      status: "placed",
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
      createdAt: new Date(),
    });

    const totalAmount = calculateTotalAmount(
      checkoutSessionRequest,
      restaurant.menuItems,
      restaurant.deliveryPrice
    );

    const paymentData = createMomoPaymentData(newOrder._id.toString(), totalAmount);
    const momoResponse = await axios.post(MOMO_ENDPOINT, paymentData);

    if (momoResponse.data.resultCode !== 0) {
      throw new Error("Error creating MoMo payment session");
    }

    await newOrder.save();
    res.json({ url: momoResponse.data.payUrl });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const calculateTotalAmount = (
  checkoutSessionRequest: CheckoutSessionRequest,
  menuItems: MenuItemType[],
  deliveryPrice: number
) => {
  const itemsTotal = checkoutSessionRequest.cartItems.reduce((total, cartItem) => {
    const menuItem = menuItems.find(
      (item) => item._id.toString() === cartItem.menuItemId.toString()
    );

    if (!menuItem) {
      throw new Error(`Menu item not found: ${cartItem.menuItemId}`);
    }

    return total + menuItem.price * parseInt(cartItem.quantity);
  }, 0);

  return itemsTotal + deliveryPrice;
};

const createMomoPaymentData = (orderId: string, amount: number) => {
  const requestId = `${orderId}-${Date.now()}`;
  const orderInfo = `Payment for order ${orderId}`;
  const redirectUrl = `${FRONTEND_URL}/order-status?success=true`;
  const ipnUrl = `${FRONTEND_URL}/momo-webhook`;

  const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}
      &partnerCode=${MOMO_PARTNER_CODE}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=captureWallet`;
  const signature = generateSignature(rawSignature, MOMO_SECRET_KEY);

  return {
    partnerCode: MOMO_PARTNER_CODE,
    accessKey: MOMO_ACCESS_KEY,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    requestType: "captureWallet",
    extraData: "",
    signature,
  };
};

const generateSignature = (rawSignature: string, secretKey: string) => {
  const crypto = require("crypto");
  return crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");
};

const momoWebhookHandler = async (req: Request, res: Response) => {
  try {
    const { orderId, resultCode } = req.body;

    if (resultCode === 0) {
      const order = await Order.findById(orderId);

      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }

      order.status = "Đã thanh toán";
      await order.save();
    }

    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Webhook processing failed" });
  }
};

export default {
  getMyOrders,
  createCheckoutSession,
  momoWebhookHandler,
};