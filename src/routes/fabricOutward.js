import { Router } from "express";
import { getFabOutCust, getFabricOutward, getFabricOutwardCustomer, getFabricOutwardCustomerByName } from "../services/freeLookFabricOutward.js";

const router = Router();

router.get("/fabOutCust", getFabOutCust);

router.get("/getFabricOutward", getFabricOutward);
router.get("/fabricOutwardCustomer", getFabricOutwardCustomer);
router.get("/fabOutByCusName", getFabricOutwardCustomerByName);

export default router;
