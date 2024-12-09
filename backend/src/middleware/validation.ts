import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const handleValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

export const validateMyRestaurantRequest = [
  body("restaurantName").notEmpty().withMessage("Tên nhà hàng được yêu cầu"),
  body("phone").notEmpty().withMessage("Tên thành phố được yêu cầu"),
  body("idCard").notEmpty().withMessage("Tên thành phố được yêu cầu"),
  body("deliveryPrice")
    .isFloat({ min: 0 })
    .withMessage("Giá giao hàng phải là một số dương"),
  body("estimatedDeliveryTime")
    .isInt({ min: 0 })
    .withMessage("Thời gian giao hàng ước tính phải là một số nguyên dương"),
  body("cuisines")
    .isArray()
    .withMessage("Danh sách món ăn phải là một mảng")
    .not()
    .isEmpty()
    .withMessage("Danh sách món ăn không thể để trống"),
  body("menuItems").isArray().withMessage("Thực đơn phải là một mảng"),
  body("menuItems.*.name")
    .notEmpty()
    .withMessage("Các món ăn trong thực đơn đã được yêu cầu"),
  body("menuItems.*.price")
    .isFloat({ min: 0 })
    .withMessage(
      "Đơn giá các món ăn trong thực đơn đã được yêu cầu và là một số nguyên dương"
    ),
  handleValidationErrors,
];

export const validateMyUserRequest = [
  body("name")
    .isString()
    .notEmpty()
    .withMessage("Họ tên phải là một chuỗi ký tự"),
  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("Địa chỉ phải là một chuỗi ký tự"),
  body("phone")
    .isString()
    .notEmpty()
    .withMessage("tên của Quận/Huyện phải là một chuỗi ký tự"),
  body("idCard")
    .isString()
    .notEmpty()
    .withMessage("Tên của Tỉnh/Thành phố phỉa là một chuỗi ký tự"),
  handleValidationErrors,
];
