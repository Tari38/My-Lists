import { Router } from "express";
import { check } from "express-validator";

import { getListById, getListsByUserId, createList, updateList, deleteList } from "../controllers/lists-controllers";

const router = Router();

router.get("/:lid", getListById);

router.get("/user/:uid", getListsByUserId);

router.post(
  "/",
  [
    check("title")
      .not()
      .isEmpty(),
    check("description").isLength({ min: 5 })
    ],
  createList
);

router.patch(
  "/:lid",
  [
    check("title")
      .not()
      .isEmpty(),
    check("description").isLength({ min: 5 })
  ],
  updateList
);

router.delete("/:lid", deleteList);

export default router;
