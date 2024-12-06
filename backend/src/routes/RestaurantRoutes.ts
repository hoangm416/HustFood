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
      .withMessage("Tên thành phố phải là một chuỗi ký tự"),
    RestaurantController.searchRestaurant
  );

export default router;