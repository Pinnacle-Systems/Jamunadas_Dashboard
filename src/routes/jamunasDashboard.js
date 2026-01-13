import { Router } from 'express';

import { 
    getTotalSales,getFinYear,getMonthlySales,getQuarterSales,getYearlySales,getTopTenCustomer,getTopTenCustomerMonth,getTopTenCustomerWeek,getTopTenCustomerToday,getTopTenItemYear,getTopTenItemMonth,getTopTenItemWeek,getTopTenItemToday
   } from '../services/jamunasDashboard.service.js';

import {getMonthlySalesTable,getQuarterSalesTable,getYearlySalesTable} from '../services/jamunasDashboardTable.service.js'

const router = Router();

router.get('/finYear',getFinYear)
router.get('/sales', getTotalSales)
router.get('/monthlysales', getMonthlySales)
router.get('/quartersales', getQuarterSales)
router.get('/yearlysales', getYearlySales)
router.get('/topTenCustomer', getTopTenCustomer)
router.get('/topTenCustomerMonth', getTopTenCustomerMonth)
router.get('/topTenCustomerWeek', getTopTenCustomerWeek)
router.get('/topTenCustomerDaily', getTopTenCustomerToday)
router.get('/topTenItemYear', getTopTenItemYear)
router.get('/topTenItemMonth', getTopTenItemMonth)
router.get('/topTenItemWeek', getTopTenItemWeek)
router.get('/topTenItemDaily', getTopTenItemToday)
router.get('/monthlysalesTable', getMonthlySalesTable)
router.get('/quartersalesTable', getQuarterSalesTable)
router.get('/yearlysalesTable', getYearlySalesTable)


export default router;