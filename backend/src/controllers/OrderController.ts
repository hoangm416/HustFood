import crypto from "crypto";
import axios from "axios";
import { Request, Response } from "express";
import Order from "../models/order";
import Restaurant from "../models/restaurant";

const MOMO_PARTNER_CODE = process.env.MOMO_PARTNER_CODE!;
const MOMO_ACCESS_KEY = process.env.MOMO_ACCESS_KEY!;
const MOMO_SECRET_KEY = process.env.MOMO_SECRET_KEY!;
const MOMO_ENDPOINT = "https://test-payment.momo.vn/v2/gateway/api/create";

const createMoMoPayment = async (req: Request, res: Response) => {
  try {
    const { cartItems, deliveryDetails, restaurantId } = req.body;

    // Lấy thông tin nhà hàng
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      throw new Error("Không tìm thấy nhà hàng");
    }

    // Tạo đơn hàng mới trong database
    const newOrder = new Order({
      restaurant: restaurant._id,
      user: req.userId,
      status: "pending",
      deliveryDetails,
      cartItems,
      createdAt: new Date(),
    });

    await newOrder.save();

    // Tổng giá trị đơn hàng
    const totalAmount = cartItems.reduce(
      (total: number, item: { quantity: number; price: number; }) => total + item.quantity * item.price,
      restaurant.deliveryPrice
    );

    // Thông tin giao dịch gửi tới MoMo
    const requestId = `${Date.now()}`;
    const orderId = `${newOrder._id}`;
    const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&amount=${totalAmount}&extraData=&ipnUrl=${process.env.BACKEND_URL}/api/momo/webhook&orderId=${orderId}
            &orderInfo=Thanh toan don hang&partnerCode=${MOMO_PARTNER_CODE}&redirectUrl=${process.env.FRONTEND_URL}/order-status&requestId=${requestId}&requestType=captureWallet`;

    const signature = crypto
      .createHmac("sha256", MOMO_SECRET_KEY)
      .update(rawSignature)
      .digest("hex");

    const paymentRequest = {
      partnerCode: MOMO_PARTNER_CODE,
      accessKey: MOMO_ACCESS_KEY,
      requestId,
      amount: totalAmount,
      orderId,
      orderInfo: "Thanh toán đơn hàng",
      redirectUrl: `${process.env.FRONTEND_URL}/order-status`,
      ipnUrl: `${process.env.BACKEND_URL}/api/momo/webhook`,
      extraData: "",
      requestType: "captureWallet",
      signature,
      lang: "vi",
    };

    // Gửi yêu cầu tới MoMo
    const response = await axios.post(MOMO_ENDPOINT, paymentRequest);

    if (response.data.resultCode !== 0) {
      throw new Error(`Lỗi MoMo: ${response.data.message}`);
    }

    // Trả về URL để khách hàng thanh toán
    res.json({ payUrl: response.data.payUrl });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const momoWebhookHandler = async (req: Request, res: Response) => {
  try {
    const {
      orderId,
      resultCode,
      signature,
      amount,
      extraData,
    } = req.body;

    // Kiểm tra chữ ký hợp lệ
    const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&orderId=${orderId}&orderInfo=Thanh toan don hang
        &partnerCode=${MOMO_PARTNER_CODE}&requestId=${req.body.requestId}&responseTime=${req.body.responseTime}&resultCode=${resultCode}&transId=${req.body.transId}`;

    const validSignature = crypto
    .createHmac("sha256", MOMO_SECRET_KEY)
    .update(rawSignature)
    .digest("hex");

    if (signature !== validSignature) {
      res.status(400).json({ message: "Chữ ký không hợp lệ" });
      return;
    }

    if (resultCode === 0) {
        const order = await Order.findById(orderId);
        if (!order) {
          res.status(404).json({ message: "Không thấy đơn hàng" });
          return;
        }

        order.status = "Đã thanh toán";
        await order.save();
    }

    res.status(200).send("Webhook processed");

  } catch (error) {
    console.error(error);
    res.status(500).send("Webhook error");
  }
};  

export default { 
  createMoMoPayment,
  momoWebhookHandler,
};
