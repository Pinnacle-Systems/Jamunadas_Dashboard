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
 
      select e.payperiod,c.compcode,d.finyr,a.docid ,a.docdate,a.salestype,a.customer,g.itemname,h.color ,i.sizename ,b.invqty,round(b.amount/b.invqty,2) rate  ,b.amount      from gtsalesinv a
      JOIN gtsalesinvdet b ON b.gtsalesinvid = a.gtsalesinvid
      JOIN gtcompmast c ON c.gtcompmastid = a.compcode
      JOIN gtfinancialyear d ON d.gtfinancialyearid = a.finyear
      JOIN hrmfrq e ON e.gtfinancialyearid = d.gtfinancialyearid AND a.docdate BETWEEN e.mstdt AND e.mendt
      join gtitemmast g on g.gtitemmastid = b.itemname 
      join gtcolormast h on h.gtcolormastid  = b.color 
      join sizemast i on i.sizemastid = b.sizes 
      where c.compcode = ?
        AND d.finyr = ? AND e.payperiod  = ?
      order by 4,5,6,7,8

      `,
            [companyName, finYear, month]   // ✅ positional params

        );

        const resp = result.map((sale) => ({
            month:sale.payperiod,
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
    b.amount
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
ORDER BY
    e.quarter,
    a.docdate,
    a.docid;

      `,
            [companyName, finYear, quarter]   // ✅ positional params

        );

        const resp = result.map((sale) => ({
            qaurter:sale.salesquarter,
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
        const { companyName, finYear} = req.query;

        console.log(companyName, "req.query for getYearlySalesTable")

        const result = await pool.query(
            `
 
      select e.payperiod,c.compcode,d.finyr,a.docid ,a.docdate,a.salestype,a.customer,g.itemname,h.color ,i.sizename ,b.invqty,round(b.amount/b.invqty,2) rate  ,b.amount      from gtsalesinv a
      JOIN gtsalesinvdet b ON b.gtsalesinvid = a.gtsalesinvid
      JOIN gtcompmast c ON c.gtcompmastid = a.compcode
      JOIN gtfinancialyear d ON d.gtfinancialyearid = a.finyear
      JOIN hrmfrq e ON e.gtfinancialyearid = d.gtfinancialyearid AND a.docdate BETWEEN e.mstdt AND e.mendt
      join gtitemmast g on g.gtitemmastid = b.itemname 
      join gtcolormast h on h.gtcolormastid  = b.color 
      join sizemast i on i.sizemastid = b.sizes 
      where c.compcode = ?
        AND d.finyr = ?
      order by d.finyr,a.docid ,a.docdate

      `,
            [companyName, finYear]   // ✅ positional params

        );

        const resp = result.map((sale) => ({
            month:sale.payperiod,
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


        }));

        console.log(result, "result for jamunadas getYearlySalesTable");
        console.log(resp, "resp for jamunadas getYearlySalesTable");


        return res.json({ statusCode: 0, data: resp });
    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
    }
}