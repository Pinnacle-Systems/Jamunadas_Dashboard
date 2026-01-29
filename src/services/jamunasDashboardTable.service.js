import {

    getJDASConnectionPool,
} from "../constants/db.connection.js";

export async function getMonthlySalesTable(req, res) {
    const pool = getJDASConnectionPool();

    try {
        const { companyName, finYear, month } = req.query;

        console.log(companyName, "req.query for getMonthlySalesTable")

        const result = await pool.query(
            `
 
      select e.payperiod,c.compcode,d.finyr,a.docid ,a.docdate,a.salestype,a.customer,g.itemname,h.color ,i.sizename ,b.invqty,round(b.amount/b.invqty,2) rate  ,b.amount ,g.uom    from gtsalesinv a
      JOIN gtsalesinvdet b ON b.gtsalesinvid = a.gtsalesinvid
      JOIN gtcompmast c ON c.gtcompmastid = a.compcode
      JOIN gtfinancialyear d ON d.gtfinancialyearid = a.finyear
      JOIN hrmfrq e ON e.gtfinancialyearid = d.gtfinancialyearid AND a.docdate BETWEEN e.mstdt AND e.mendt
      join gtitemmast g on g.gtitemmastid = b.itemname 
      join gtcolormast h on h.gtcolormastid  = b.color 
      join sizemast i on i.sizemastid = b.sizes 
      where c.compcode = ?
        AND d.finyr = ? AND e.payperiod  = ?
        
     

      `,
            [companyName, finYear, month]   // ✅ positional params

        );

        const resp = result.map((sale) => ({
            month: sale.payperiod,
            company: sale.compcode,
            finYear: sale.finyr,
            docId: sale.docid,
            docDate: sale.docdate,
            salesType: sale.salestype,
            customer: sale.customer,
            itemName: sale.itemname,
            invoiceQty: sale.invqty,
            rate: sale.rate,
            amount: sale.amount,
            uom: sale.uom


        }));

        console.log(result, "result for jamunadas getMonthlySalesTable");
        console.log(resp, "resp for jamunadas getMonthlySalesTable");


        return res.json({ statusCode: 0, data: resp });
    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
    }
}
export async function getQuarterSalesTable(req, res) {
    const pool = getJDASConnectionPool();

    try {
        const { companyName, finYear, quarter } = req.query;

        console.log(companyName, "req.query for getQuarterSalesTable")

        const result = await pool.query(
            `
 
      SELECT
    c.compcode,
    d.finyr,
    e.quarter AS salesquarter,
    a.docid,
    a.docdate,
    a.salestype,
    a.customer,
    g.itemname,
    h.color,
    i.sizename,
    b.invqty,
   round(b.amount/b.invqty,2) rate ,
    b.amount,g.uom 
FROM gtsalesinv a
JOIN gtsalesinvdet b
    ON b.gtsalesinvid = a.gtsalesinvid
JOIN gtcompmast c
    ON c.gtcompmastid = a.compcode
JOIN gtfinancialyear d
    ON d.gtfinancialyearid = a.finyear
JOIN gtfinancialyeardtl e
    ON e.gtfinancialyearid = d.gtfinancialyearid
   AND a.docdate BETWEEN e.pstartdate AND e.penddate
JOIN gtitemmast g
    ON g.gtitemmastid = b.itemname
JOIN gtcolormast h
    ON h.gtcolormastid = b.color
JOIN sizemast i
    ON i.sizemastid = b.sizes
WHERE c.compcode = ?
  AND d.finyr = ? AND e.quarter = ?


      `,
            [companyName, finYear, quarter]   // ✅ positional params

        );

        const resp = result.map((sale) => ({
            qaurter: sale.salesquarter,
            company: sale.compcode,
            finYear: sale.finyr,
            docId: sale.docid,
            docDate: sale.docdate,
            salesType: sale.salestype,
            customer: sale.customer,
            itemName: sale.itemname,
            invoiceQty: sale.invqty,
            rate: sale.rate,
            amount: sale.amount,
            uom: sale.uom



        }));

        console.log(result, "result for jamunadas getQuarterSalesTable");
        console.log(resp, "resp for jamunadas getQuarterSalesTable");


        return res.json({ statusCode: 0, data: resp });
    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
    }
}

export async function getYearlySalesTable(req, res) {
    const pool = getJDASConnectionPool();

    try {
        const { companyName, finYear } = req.query;

        console.log(companyName, "req.query for getYearlySalesTable")

        const result = await pool.query(
            `
 
      select e.payperiod,c.compcode,d.finyr,a.docid ,a.docdate,a.salestype,a.customer,g.itemname,h.color ,i.sizename ,b.invqty,round(b.amount/b.invqty,2) rate  ,b.amount ,g.uom      from gtsalesinv a
      JOIN gtsalesinvdet b ON b.gtsalesinvid = a.gtsalesinvid
      JOIN gtcompmast c ON c.gtcompmastid = a.compcode
      JOIN gtfinancialyear d ON d.gtfinancialyearid = a.finyear
      JOIN hrmfrq e ON e.gtfinancialyearid = d.gtfinancialyearid AND a.docdate BETWEEN e.mstdt AND e.mendt
      join gtitemmast g on g.gtitemmastid = b.itemname 
      join gtcolormast h on h.gtcolormastid  = b.color 
      join sizemast i on i.sizemastid = b.sizes 
      where c.compcode = ?
        AND d.finyr = ?


      `,
            [companyName, finYear]   // ✅ positional params

        );

        const resp = result.map((sale) => ({
            month: sale.payperiod,
            company: sale.compcode,
            finYear: sale.finyr,
            docId: sale.docid,
            docDate: sale.docdate,
            salesType: sale.salestype,
            customer: sale.customer,
            itemName: sale.itemname,
            invoiceQty: sale.invqty,
            rate: sale.rate,
            amount: sale.amount,
            uom: sale.uom



        }));

        console.log(result, "result for jamunadas getYearlySalesTable");
        console.log(resp, "resp for jamunadas getYearlySalesTable");


        return res.json({ statusCode: 0, data: resp });
    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
    }
}


// Customwer Sales

export async function getTopTenCustomerSalesYearlyTable(req, res) {
    const pool = getJDASConnectionPool();

    try {
        const { companyName, finYear, customer } = req.query;

        console.log(companyName, "req.query for getTopTenCustomerSalesYearlyTable")

        const result = await pool.query(
            `
 
      select e.payperiod,c.compcode,d.finyr,a.docid ,a.docdate,a.salestype,a.customer,g.itemname,h.color ,i.sizename ,b.invqty,round(b.amount/b.invqty,2) rate  ,b.amount,g.uom       from gtsalesinv a
      JOIN gtsalesinvdet b ON b.gtsalesinvid = a.gtsalesinvid
      JOIN gtcompmast c ON c.gtcompmastid = a.compcode
      JOIN gtfinancialyear d ON d.gtfinancialyearid = a.finyear
      JOIN hrmfrq e ON e.gtfinancialyearid = d.gtfinancialyearid AND a.docdate BETWEEN e.mstdt AND e.mendt
      join gtitemmast g on g.gtitemmastid = b.itemname 
      join gtcolormast h on h.gtcolormastid  = b.color 
      join sizemast i on i.sizemastid = b.sizes 
      where c.compcode = ?
        AND d.finyr = ? AND a.customer = ?
  

      `,
            [companyName, finYear, customer]   // ✅ positional params

        );

        const resp = result.map((sale) => ({
            month: sale.payperiod,
            company: sale.compcode,
            finYear: sale.finyr,
            docId: sale.docid,
            docDate: sale.docdate,
            salesType: sale.salestype,
            customer: sale.customer,
            itemName: sale.itemname,
            invoiceQty: sale.invqty,
            rate: sale.rate,
            amount: sale.amount,
            uom: sale.uom



        }));

        console.log(result, "result for jamunadas getTopTenCustomerSalesYearlyTable");
        console.log(resp, "resp for jamunadas getTopTenCustomerSalesYearlyTable");


        return res.json({ statusCode: 0, data: resp });
    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
    }
}
export async function getTopTenCustomerSalesMonthTable(req, res) {
    const pool = getJDASConnectionPool();

    try {
        const { companyName, finYear, customer, month } = req.query;

        console.log(companyName, "req.query for getTopTenCustomerSalesMonthTable")

        const result = await pool.query(
            `
 
      select e.payperiod,c.compcode,d.finyr,a.docid ,a.docdate,a.salestype,a.customer,g.itemname,h.color ,i.sizename ,b.invqty,round(b.amount/b.invqty,2) rate  ,b.amount,g.uom       from gtsalesinv a
      JOIN gtsalesinvdet b ON b.gtsalesinvid = a.gtsalesinvid
      JOIN gtcompmast c ON c.gtcompmastid = a.compcode
      JOIN gtfinancialyear d ON d.gtfinancialyearid = a.finyear
      JOIN hrmfrq e ON e.gtfinancialyearid = d.gtfinancialyearid AND a.docdate BETWEEN e.mstdt AND e.mendt
      join gtitemmast g on g.gtitemmastid = b.itemname 
      join gtcolormast h on h.gtcolormastid  = b.color 
      join sizemast i on i.sizemastid = b.sizes 
      where c.compcode = ?
        AND d.finyr = ? AND a.customer = ? AND e.payperiod  = ?
      

      `,
            [companyName, finYear, customer, month]   // ✅ positional params

        );

        const resp = result.map((sale) => ({
            month: sale.payperiod,
            company: sale.compcode,
            finYear: sale.finyr,
            docId: sale.docid,
            docDate: sale.docdate,
            salesType: sale.salestype,
            customer: sale.customer,
            itemName: sale.itemname,
            invoiceQty: sale.invqty,
            rate: sale.rate,
            amount: sale.amount,
            uom: sale.uom



        }));

        console.log(result, "result for jamunadas getTopTenCustomerSalesMonthTable");
        console.log(resp, "resp for jamunadas getTopTenCustomerSalesMonthTable");


        return res.json({ statusCode: 0, data: resp });
    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
    }
}
export async function getTopTenCustomerSalesWeekTable(req, res) {
    const pool = getJDASConnectionPool();

    try {
        const { companyName, customer } = req.query;

        console.log(companyName, "req.query for getTopTenCustomerSalesWeekTable")

        const result = await pool.query(
            `
 
      select e.payperiod,c.compcode,d.finyr,a.docid ,a.docdate,a.salestype,a.customer,g.itemname,h.color ,i.sizename ,b.invqty,round(b.amount/b.invqty,2) rate  ,b.amount ,g.uom      from gtsalesinv a
      JOIN gtsalesinvdet b ON b.gtsalesinvid = a.gtsalesinvid
      JOIN gtcompmast c ON c.gtcompmastid = a.compcode
      JOIN gtfinancialyear d ON d.gtfinancialyearid = a.finyear
      JOIN hrmfrq e ON e.gtfinancialyearid = d.gtfinancialyearid AND a.docdate BETWEEN e.mstdt AND e.mendt
      join gtitemmast g on g.gtitemmastid = b.itemname 
      join gtcolormast h on h.gtcolormastid  = b.color 
      join sizemast i on i.sizemastid = b.sizes 
      where c.compcode = ?  AND a.customer = ?
 

      `,
            [companyName, customer]   // ✅ positional params

        );

        const resp = result.map((sale) => ({
            month: sale.payperiod,
            company: sale.compcode,
            finYear: sale.finyr,
            docId: sale.docid,
            docDate: sale.docdate,
            salesType: sale.salestype,
            customer: sale.customer,
            itemName: sale.itemname,
            invoiceQty: sale.invqty,
            rate: sale.rate,
            amount: sale.amount,
            uom: sale.uom



        }));

        console.log(result, "result for jamunadas getTopTenCustomerSalesWeekTable");
        console.log(resp, "resp for jamunadas getTopTenCustomerSalesWeekTable");


        return res.json({ statusCode: 0, data: resp });
    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
    }
}
export async function getTopTenCustomerSalesdailyTable(req, res) {
    const pool = getJDASConnectionPool();

    try {
        const { companyName, customer } = req.query;

        console.log(companyName, "req.query for getTopTenCustomerSalesdailyTable")

        const result = await pool.query(
            `
 
      select e.payperiod,c.compcode,d.finyr,a.docid ,a.docdate,a.salestype,a.customer,g.itemname,h.color ,i.sizename ,b.invqty,round(b.amount/b.invqty,2) rate  ,b.amount,g.uom       from gtsalesinv a
      JOIN gtsalesinvdet b ON b.gtsalesinvid = a.gtsalesinvid
      JOIN gtcompmast c ON c.gtcompmastid = a.compcode
      JOIN gtfinancialyear d ON d.gtfinancialyearid = a.finyear
      JOIN hrmfrq e ON e.gtfinancialyearid = d.gtfinancialyearid AND a.docdate BETWEEN e.mstdt AND e.mendt
      join gtitemmast g on g.gtitemmastid = b.itemname 
      join gtcolormast h on h.gtcolormastid  = b.color 
      join sizemast i on i.sizemastid = b.sizes 
      where c.compcode = ?  AND a.customer = ?

      `,
            [companyName, customer]   // ✅ positional params

        );

        const resp = result.map((sale) => ({
            month: sale.payperiod,
            company: sale.compcode,
            finYear: sale.finyr,
            docId: sale.docid,
            docDate: sale.docdate,
            salesType: sale.salestype,
            customer: sale.customer,
            itemName: sale.itemname,
            invoiceQty: sale.invqty,
            rate: sale.rate,
            amount: sale.amount,
            uom: sale.uom



        }));

        console.log(result, "result for jamunadas getTopTenCustomerSalesdailyTable");
        console.log(resp, "resp for jamunadas getTopTenCustomerSalesdailyTable");


        return res.json({ statusCode: 0, data: resp });
    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
    }
}



// Item Sales
export async function getTopTenItemSalesYearTable(req, res) {
    const pool = getJDASConnectionPool();

    try {
        const { companyName, finYear, item } = req.query;

        console.log(companyName, "req.query for getTopTenItemSalesYearTable")

        const result = await pool.query(
            `
 
      select e.payperiod,c.compcode,d.finyr,a.docid ,a.docdate,a.salestype,a.customer,g.itemname,h.color ,i.sizename ,b.invqty,round(b.amount/b.invqty,2) rate  ,b.amount ,g.uom      from gtsalesinv a
      JOIN gtsalesinvdet b ON b.gtsalesinvid = a.gtsalesinvid
      JOIN gtcompmast c ON c.gtcompmastid = a.compcode
      JOIN gtfinancialyear d ON d.gtfinancialyearid = a.finyear
      JOIN hrmfrq e ON e.gtfinancialyearid = d.gtfinancialyearid AND a.docdate BETWEEN e.mstdt AND e.mendt
      join gtitemmast g on g.gtitemmastid = b.itemname 
      join gtcolormast h on h.gtcolormastid  = b.color 
      join sizemast i on i.sizemastid = b.sizes 
      where c.compcode = ?
        AND d.finyr = ? AND g.itemname = ? 

      `,
            [companyName, finYear, item]   // ✅ positional params

        );

        const resp = result.map((sale) => ({
            month: sale.payperiod,
            company: sale.compcode,
            finYear: sale.finyr,
            docId: sale.docid,
            docDate: sale.docdate,
            salesType: sale.salestype,
            customer: sale.customer,
            itemName: sale.itemname,
            invoiceQty: sale.invqty,
            rate: sale.rate,
            amount: sale.amount,
            uom: sale.uom



        }));

        console.log(result, "result for jamunadas getTopTenItemSalesYearTable");
        console.log(resp, "resp for jamunadas getTopTenItemSalesYearTable");


        return res.json({ statusCode: 0, data: resp });
    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
    }
}
export async function getTopTenItemSalesMonthTable(req, res) {
    const pool = getJDASConnectionPool();

    try {
        const { companyName, finYear, item, month } = req.query;

        console.log(companyName, "req.query for getTopTenItemSalesMonthTable")

        const result = await pool.query(
            `
 
      select e.payperiod,c.compcode,d.finyr,a.docid ,a.docdate,a.salestype,a.customer,g.itemname,h.color ,i.sizename ,b.invqty,round(b.amount/b.invqty,2) rate  ,b.amount ,g.uom      from gtsalesinv a
      JOIN gtsalesinvdet b ON b.gtsalesinvid = a.gtsalesinvid
      JOIN gtcompmast c ON c.gtcompmastid = a.compcode
      JOIN gtfinancialyear d ON d.gtfinancialyearid = a.finyear
      JOIN hrmfrq e ON e.gtfinancialyearid = d.gtfinancialyearid AND a.docdate BETWEEN e.mstdt AND e.mendt
      join gtitemmast g on g.gtitemmastid = b.itemname 
      join gtcolormast h on h.gtcolormastid  = b.color 
      join sizemast i on i.sizemastid = b.sizes 
      where c.compcode = ?
        AND d.finyr = ? AND g.itemname = ? AND e.payperiod  = ?
      

      `,
            [companyName, finYear, item, month]   // ✅ positional params

        );

        const resp = result.map((sale) => ({
            month: sale.payperiod,
            company: sale.compcode,
            finYear: sale.finyr,
            docId: sale.docid,
            docDate: sale.docdate,
            salesType: sale.salestype,
            customer: sale.customer,
            itemName: sale.itemname,
            invoiceQty: sale.invqty,
            rate: sale.rate,
            amount: sale.amount,
            uom: sale.uom



        }));

        console.log(result, "result for jamunadas getTopTenItemSalesMonthTable");
        console.log(resp, "resp for jamunadas getTopTenItemSalesMonthTable");


        return res.json({ statusCode: 0, data: resp });
    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
    }
}

export async function getTopTenItemSalesWeekTable(req, res) {
    const pool = getJDASConnectionPool();

    try {
        const { companyName, item } = req.query;

        console.log(companyName, "req.query for getTopTenItemSalesWeekTable")

        const result = await pool.query(
            `
 
      select e.payperiod,c.compcode,d.finyr,a.docid ,a.docdate,a.salestype,a.customer,g.itemname,h.color ,i.sizename ,b.invqty,round(b.amount/b.invqty,2) rate  ,b.amount ,g.uom      from gtsalesinv a
      JOIN gtsalesinvdet b ON b.gtsalesinvid = a.gtsalesinvid
      JOIN gtcompmast c ON c.gtcompmastid = a.compcode
      JOIN gtfinancialyear d ON d.gtfinancialyearid = a.finyear
      JOIN hrmfrq e ON e.gtfinancialyearid = d.gtfinancialyearid AND a.docdate BETWEEN e.mstdt AND e.mendt
      join gtitemmast g on g.gtitemmastid = b.itemname 
      join gtcolormast h on h.gtcolormastid  = b.color 
      join sizemast i on i.sizemastid = b.sizes 
      where c.compcode = ? AND g.itemname = ? 
    

      `,
            [companyName, item]   // ✅ positional params

        );

        const resp = result.map((sale) => ({
            month: sale.payperiod,
            company: sale.compcode,
            finYear: sale.finyr,
            docId: sale.docid,
            docDate: sale.docdate,
            salesType: sale.salestype,
            customer: sale.customer,
            itemName: sale.itemname,
            invoiceQty: sale.invqty,
            rate: sale.rate,
            amount: sale.amount,
            uom: sale.uom



        }));

        console.log(result, "result for jamunadas getTopTenItemSalesWeekTable");
        console.log(resp, "resp for jamunadas getTopTenItemSalesWeekTable");


        return res.json({ statusCode: 0, data: resp });
    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
    }
}
export async function getTopTenItemSalesdailyTable(req, res) {
    const pool = getJDASConnectionPool();

    try {
        const { companyName, item } = req.query;

        console.log(companyName, "req.query for getTopTenItemSalesdailyTable")

        const result = await pool.query(
            `
 
      select e.payperiod,c.compcode,d.finyr,a.docid ,a.docdate,a.salestype,a.customer,g.itemname,h.color ,i.sizename ,b.invqty,round(b.amount/b.invqty,2) rate  ,b.amount ,g.uom      from gtsalesinv a
      JOIN gtsalesinvdet b ON b.gtsalesinvid = a.gtsalesinvid
      JOIN gtcompmast c ON c.gtcompmastid = a.compcode
      JOIN gtfinancialyear d ON d.gtfinancialyearid = a.finyear
      JOIN hrmfrq e ON e.gtfinancialyearid = d.gtfinancialyearid AND a.docdate BETWEEN e.mstdt AND e.mendt
      join gtitemmast g on g.gtitemmastid = b.itemname 
      join gtcolormast h on h.gtcolormastid  = b.color 
      join sizemast i on i.sizemastid = b.sizes 
      where c.compcode = ? AND g.itemname = ? 
    

      `,
            [companyName, item]   // ✅ positional params

        );

        const resp = result.map((sale) => ({
            month: sale.payperiod,
            company: sale.compcode,
            finYear: sale.finyr,
            docId: sale.docid,
            docDate: sale.docdate,
            salesType: sale.salestype,
            customer: sale.customer,
            itemName: sale.itemname,
            invoiceQty: sale.invqty,
            rate: sale.rate,
            amount: sale.amount,
            uom: sale.uom



        }));

        console.log(result, "result for jamunadas getTopTenItemSalesdailyTable");
        console.log(resp, "resp for jamunadas getTopTenItemSalesdailyTable");


        return res.json({ statusCode: 0, data: resp });
    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
    }
}