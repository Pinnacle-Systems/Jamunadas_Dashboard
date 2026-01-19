import { Router } from 'express';

import { 
    getTotalSales,getFinYear,getMonthlySales,getQuarterSales,getYearlySales,getTopTenCustomer,getTopTenCustomerMonth,getTopTenCustomerWeek,getTopTenCustomerToday,getTopTenItemYear,getTopTenItemMonth,getTopTenItemWeek,getTopTenItemToday
   } from '../services/jamunasDashboard.service.js';

import {getMonthlySalesTable,getQuarterSalesTable,getYearlySalesTable,getTopTenCustomerSalesYearlyTable,getTopTenCustomerSalesMonthTable,getTopTenItemSalesYearTable,getTopTenItemSalesMonthTable,getTopTenCustomerSalesWeekTable,getTopTenCustomerSalesdailyTable,getTopTenItemSalesWeekTable,getTopTenItemSalesdailyTable} from '../services/jamunasDashboardTable.service.js'

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
router.get('/topTenCustomerYearTable', getTopTenCustomerSalesYearlyTable)
router.get('/topTenCustomerMonthTable', getTopTenCustomerSalesMonthTable)
router.get('/topTenCustomerWeekTable', getTopTenCustomerSalesWeekTable)
router.get('/topTenCustomerDailyTable', getTopTenCustomerSalesdailyTable)
router.get('/topTenItemYearTable', getTopTenItemSalesYearTable)
router.get('/topTenItemMonthTable', getTopTenItemSalesMonthTable)
router.get('/topTenItemWeekTable', getTopTenItemSalesWeekTable)
router.get('/topTenItemDailyTable', getTopTenItemSalesdailyTable)


export default router;