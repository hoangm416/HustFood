import express from "express";
import { param } from "express-validator";
import RestaurantController from "../controllers/RestaurantController";

const router = express.Router();

router.get(
    "/search/:city",
    param("city")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Tên thành phố phải là một chuỗi ký tự hợp lệ"),
    RestaurantController.searchRestaurant
  );

  router.get(
    "/:restaurantId",
    param("restaurantId")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Tên nhà hàng phỉa là một chuỗi ký tự hợp lệ"),
    RestaurantController.getRestaurant
  );
export default router;