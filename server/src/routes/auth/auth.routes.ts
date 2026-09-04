import { Router } from "express";
import { requireAuth } from "../../middleware/authMiddleware";
import { asyncHandler } from "../../shared/asyncHandler";
import { workerRegister } from "../../controllers/auth/register/workerRegister";
import { cooperativeRegister } from "../../controllers/auth/register/cooperativeRegister";
import { federativeRegister } from "../../controllers/auth/register/federativeRegister";
import { login } from "../../controllers/auth/login.controller";
import { refreshToken } from "../../controllers/auth/refreshToken.controller";
import { logout } from "../../controllers/auth/logout.controller";
import { getProfile } from "../../controllers/auth/getProfile.controller";
import { getCooperatives } from "../../controllers/auth/getCooperatives.controller";
import { getFederations } from "../../controllers/auth/getFederations.controller";
import { userRegister } from "../../controllers/auth/register/userRegister.controller";


const router = Router();

router.post("/register/customer", asyncHandler(userRegister));
router.post("/register/worker", requireAuth, asyncHandler(workerRegister));
router.post("/register/cooperative", requireAuth, asyncHandler(cooperativeRegister));
router.post("/register/federation", requireAuth, asyncHandler(federativeRegister));
router.post("/login", asyncHandler(login));
router.post("/refresh-token", asyncHandler(refreshToken));
router.post("/logout", asyncHandler(logout));
router.get("/me", requireAuth, asyncHandler(getProfile));
router.get("/cooperatives", asyncHandler(getCooperatives));
router.get("/federations", asyncHandler(getFederations));

export default router;
