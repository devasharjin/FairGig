import { Router } from "express";
import { asyncHandler } from "../../shared/asyncHandler";
import { getServices } from "../../controllers/common/service/getServices.controller";
import { getCategories } from "../../controllers/common/category/getCategories.controller";


const router = Router();

router.get("/categories", asyncHandler(getCategories));

router.get("/services", asyncHandler(getServices));

export default router;