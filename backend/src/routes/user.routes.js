import { Router } from "express";
import {
  deleteUser,
  getUsers,
  signup,
  updateUser,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/signup").post(signup);
router.route("/getUsers").get(getUsers);
router.route("/updateUser/:id").put(updateUser);
router.route("/deleteUser/:id").delete(deleteUser);

export default router;
