import {Router} from "express";
import { getSalesSummary, getTotalSales } from "../services/sales.service.js";

const router = Router();

router.get("/:year", getSalesSummary);
router.get("/", getTotalSales);

export default router;