"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMyUserRequest = exports.validateMyRestaurantRequest = void 0;
const express_validator_1 = require("express-validator");
const handleValidationErrors = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  });
exports.validateMyRestaurantRequest = [
  (0, express_validator_1.body)("restaurantName")
    .notEmpty()
    .withMessage("Tên nhà hàng được yêu cầu"),
  (0, express_validator_1.body)("phone")
    .notEmpty()
    .withMessage("Tên thành phố được yêu cầu"),
  (0, express_validator_1.body)("idCard")
    .notEmpty()
    .withMessage("Tên thành phố được yêu cầu"),
  (0, express_validator_1.body)("deliveryPrice")
    .isFloat({ min: 0 })
    .withMessage("Giá giao hàng phải là một số dương"),
  (0, express_validator_1.body)("estimatedDeliveryTime")
    .isInt({ min: 0 })
    .withMessage("Thời gian giao hàng ước tính phải là một số nguyên dương"),
  (0, express_validator_1.body)("cuisines")
    .isArray()
    .withMessage("Danh sách món ăn phải là một mảng")
    .not()
    .isEmpty()
    .withMessage("Danh sách món ăn không thể để trống"),
  (0, express_validator_1.body)("menuItems")
    .isArray()
    .withMessage("Thực đơn phải là một mảng"),
  (0, express_validator_1.body)("menuItems.*.name")
    .notEmpty()
    .withMessage("Các món ăn trong thực đơn đã được yêu cầu"),
  (0, express_validator_1.body)("menuItems.*.price")
    .isFloat({ min: 0 })
    .withMessage(
      "Đơn giá các món ăn trong thực đơn đã được yêu cầu và là một số nguyên dương"
    ),
  handleValidationErrors,
];
exports.validateMyUserRequest = [
  (0, express_validator_1.body)("name")
    .isString()
    .notEmpty()
    .withMessage("Họ tên phải là một chuỗi ký tự"),
  (0, express_validator_1.body)("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("Địa chỉ phải là một chuỗi ký tự"),
  (0, express_validator_1.body)("city")
    .isString()
    .notEmpty()
    .withMessage("tên của Quận/Huyện phải là một chuỗi ký tự"),
  (0, express_validator_1.body)("idCard")
    .isString()
    .notEmpty()
    .withMessage("Tên của Tỉnh/Thành phố phỉa là một chuỗi ký tự"),
  handleValidationErrors,
];
