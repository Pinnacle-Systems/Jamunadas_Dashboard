import {

    getJDASConnectionPool,
} from "../constants/db.connection.js";


export async function getFinYear(req, res) {
    const pool = getJDASConnectionPool();

    try {
        const sql = `
SELECT A.FINYR FROM gtfinancialyear A ORDER BY 1    `;

        const result = await pool.query(sql);
        let resp = result?.map((row) => ({
            finYear: row.FINYR,
        }));
        console.log(sql, "Jamunadas finyear query executed");
        console.log(resp, "Jamunadas resp");

        return res.json({ statusCode: 0, data: resp });
    } catch (err) {
        console.error("Error fetching leave availability:", err);
        throw err;
    }
}

export async function getTotalSales(req, res) {
    const pool = getJDASConnectionPool();

    try {
        const result = await pool.query(`
       select d.finyr as salesyear,c.compcode AS company,sum(b.delqty * a.netamt) as totalsales from gtsalesinv a
join gtsalesinvdet b on b.gtsalesinvid = a.gtsalesinvid
join gtcompmast c on c.gtcompmastid =a.compcode 
join gtfinancialyear d on d.gtfinancialyearid =a.finyear 
join hrmfrq e on e.gtfinancialyearid=d.gtfinancialyearid 
where   (a.docdate between e.mstdt and e.mendt)
group by d.finyr, c.compcode
order by salesyear
    `);

        let resp = result.map((sale) => ({
            year: sale.salesyear,
            totalSales: sale.totalsales,
            company: sale.company
        }));
        console.log(result, "getTotalSales output");
        console.log(resp, "resp");

        return res.json({ statusCode: 0, data: resp });
    } catch (err) {
        console.error("Error retrieving data: ", err);
        res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
    }
}
export async function getMonthlySales(req, res) {
    const pool = getJDASConnectionPool();

    try {
        const { selectedCompany, selectedYear } = req.query;

        console.log(selectedCompany, selectedYear, "req.query for getMonthlySales")

        const result = await pool.query(
            `
      SELECT 
        e.payperiod,
        c.compcode,
        SUM(b.delqty * a.netamt) AS totalsales
      FROM gtsalesinv a
      JOIN gtsalesinvdet b ON b.gtsalesinvid = a.gtsalesinvid
      JOIN gtcompmast c ON c.gtcompmastid = a.compcode
      JOIN gtfinancialyear d ON d.gtfinancialyearid = a.finyear
      JOIN hrmfrq e ON e.gtfinancialyearid = d.gtfinancialyearid
     WHERE c.compcode = ?
        AND d.finyr = ?
        AND a.docdate BETWEEN e.mstdt AND e.mendt
      GROUP BY e.mstdt, e.payperiod, c.compcode
      ORDER BY e.mstdt
      `,
            [selectedCompany, selectedYear]   // ✅ positional params

        );

        const resp = result.map((sale) => ({
            payPeriod: sale.payperiod,
            totalSales: sale.totalsales,
            company: sale.compcode,
        }));

        console.log(result, "result for jamunadas getMonthlySales");
        console.log(resp, "resp for jamunadas getMonthlySales");


        return res.json({ statusCode: 0, data: resp });
    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
    }
}
export async function getQuarterSales(req, res) {
    const pool = getJDASConnectionPool();

    try {
        const { selectedCompany, selectedYear } = req.query;

        console.log(selectedCompany, selectedYear, "req.query for getQuarterSales")

        const result = await pool.query(
            `
      select d.finyr,c.compcode,e.perioddesc,e.quarter as salesquarter,e.pstartdate,e.penddate,coalesce(sum(b.delqty * a.netamt), 0) as totalsales
from gtfinancialyeardtl e
join gtfinancialyear d on d.gtfinancialyearid = e.gtfinancialyearid
join gtcompmast c on c.compcode = ?
left join gtsalesinv a on a.finyear = d.gtfinancialyearid and a.compcode = c.gtcompmastid and a.docdate between e.pstartdate and e.penddate
left join gtsalesinvdet b on b.gtsalesinvid = a.gtsalesinvid
where d.finyr = ?
group by d.finyr,c.compcode,e.perioddesc,e.quarter,e.pstartdate,e.penddate
order by e.pstartdate
      `,
            [selectedCompany, selectedYear]   // ✅ positional params

        );

        const resp = result.map((sale) => ({
            finYear: sale.finyr,
            company: sale.compcode,
            quarter: sale.salesquarter,
            totalSales: sale.totalsales,
            order: sale.perioddesc

        }));

        console.log(result, "result for jamunadas getQuarterSales");
        console.log(resp, "resp for jamunadas getQuarterSales");


        return res.json({ statusCode: 0, data: resp });
    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
    }
}
export async function getYearlySales(req, res) {
    const pool = getJDASConnectionPool();

    try {
        const { selectedCompany, year } = req.query;

        console.log(selectedCompany, year, "req.query for getYearlySales")

        const result = await pool.query(
            `
  select d.finyr as salesyear,c.compcode,sum(b.delqty * a.netamt) as totalsales from gtsalesinv a
join gtsalesinvdet b on b.gtsalesinvid = a.gtsalesinvid
join gtcompmast c on c.gtcompmastid =a.compcode 
join gtfinancialyear d on d.gtfinancialyearid =a.finyear 
join hrmfrq e on e.gtfinancialyearid=d.gtfinancialyearid 
   WHERE c.compcode = ?
        AND d.finyr = ? 
AND a.docdate between e.mstdt and e.mendt
group by d.finyr
order by salesyear
      `,
            [selectedCompany, year]   // ✅ positional params

        );

        const resp = result.map((sale) => ({
            salesYear: sale.salesYear,
            company: sale.compcode,
            totalSales: sale.totalsales,

        }));

        console.log(result, "result for jamunadas getYearlySales");
        console.log(resp, "resp for jamunadas getYearlySales");


        return res.json({ statusCode: 0, data: resp });
    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
    }
}

// Style Wise

export async function getTopTenCustomer(req, res) {
    const pool = getJDASConnectionPool();

    try {
        const { selectedCompany, selectedYear } = req.query;

        console.log(selectedCompany, selectedYear, "req.query for getTopTenCustomer")

        const result = await pool.query(
            `
  select d.finyr,e.compcode,ee.compname as customer,sum(b.delqty * a.netamt) as totalsales
from gtsalesinv a
join gtsalesinvdet b on b.gtsalesinvid = a.gtsalesinvid
join gtcompmast e on e.gtcompmastid = a.compcode
join gtcompmast ee on ee.compname=a.customer 
join gtfinancialyear d on d.gtfinancialyearid = a.finyear
join hrmfrq f on f.gtfinancialyearid = d.gtfinancialyearid
 WHERE e.compcode = ? AND d.finyr = ? 
group by d.finyr,ee.compname
order by totalsales desc  
limit 10
      `,
            [selectedCompany, selectedYear]   // ✅ positional params

        );

        const resp = result.map((sale) => ({
            salesYear: sale.finyr,
            company: sale.compcode,
            customer: sale.customer,
            totalSales: sale.totalsales,

        }));

        console.log(result, "result for jamunadas getTopTenCustomer");
        console.log(resp, "resp for jamunadas getTopTenCustomer");


        return res.json({ statusCode: 0, data: resp });
    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
    }
}
export async function getTopTenCustomerMonth(req, res) {
    const pool = getJDASConnectionPool();

    try {
        const { selectedCompany, selectedYear, selectMonths } = req.query;

        console.log(selectedCompany, selectedYear, "req.query for getTopTenCustomerMonth")

        const result = await pool.query(
            `
select f.payperiod,d.finyr,e.compcode,ee.compname as customer,sum(b.delqty * a.netamt) as totalsales
from gtsalesinv a
join gtsalesinvdet b on b.gtsalesinvid = a.gtsalesinvid
join gtcompmast e on e.gtcompmastid = a.compcode
join gtcompmast ee on ee.compname=a.customer 
join gtfinancialyear d on d.gtfinancialyearid = a.finyear
join hrmfrq f on f.gtfinancialyearid = d.gtfinancialyearid
where e.compcode = ? AND d.finyr = ? and (a.docdate between f.mstdt and f.mendt) AND f.payperiod=?
group by d.finyr,ee.compname
order by totalsales desc  
limit 10
      `,
            [selectedCompany, selectedYear, selectMonths]   // ✅ positional params

        );

        const resp = result.map((sale) => ({
            salesYear: sale.payperiod,
            
            company: sale.compcode,
            customer: sale.customer,
            totalSales: sale.totalsales,

        }));

        console.log(result, "result for jamunadas getTopTenCustomerMonth");
        console.log(resp, "resp for jamunadas getTopTenCustomerMonth");


        return res.json({ statusCode: 0, data: resp });
    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
    }
}
export async function getTopTenCustomerWeek(req, res) {
    const pool = getJDASConnectionPool();

    try {
        const { selectedCompany, selectedYear, selectMonths } = req.query;

        console.log(selectedCompany, "req.query for getTopTenCustomerMonth")

        const result = await pool.query(
            `
select d.finyr,e.compcode,ee.compname as customer,sum(b.delqty * a.netamt) as totalsales
from gtsalesinv a
join gtsalesinvdet b on b.gtsalesinvid = a.gtsalesinvid
join gtcompmast e on e.gtcompmastid = a.compcode
join gtcompmast ee on ee.compname=a.customer 
join gtfinancialyear d on d.gtfinancialyearid = a.finyear
where e.compcode = ?
AND a.docdate between DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY) and CURRENT_DATE
group by d.finyr,ee.compname
order by totalsales desc  
limit 10
      `,
            [selectedCompany]   // ✅ positional params

        );

        const resp = result.map((sale) => ({
            salesYear: sale.finyr,
            company: sale.compcode,
            customer: sale.customer,
            totalSales: sale.totalsales,

        }));

        console.log(result, "result for jamunadas getTopTenCustomerWeek");
        console.log(resp, "resp for jamunadas getTopTenCustomerWeek");


        return res.json({ statusCode: 0, data: resp });
    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
    }
}
export async function getTopTenCustomerToday(req, res) {
    const pool = getJDASConnectionPool();

    try {
        const { selectedCompany, selectedYear, selectMonths } = req.query;

        console.log(selectedCompany, "req.query for getTopTenCustomerToday")

        const result = await pool.query(
            `
select d.finyr,e.compcode,ee.compname as customer,sum(b.delqty * a.netamt) as totalsales
from gtsalesinv a
join gtsalesinvdet b on b.gtsalesinvid = a.gtsalesinvid
join gtcompmast e on e.gtcompmastid = a.compcode
join gtcompmast ee on ee.compname=a.customer 
join gtfinancialyear d on d.gtfinancialyearid = a.finyear
where e.compcode = ?
AND a.docdate between CURRENT_DATE and CURRENT_DATE
group by d.finyr,ee.compname
order by totalsales desc  
limit 10

      `,
            [selectedCompany]   // ✅ positional params

        );

        const resp = result.map((sale) => ({
            salesYear: sale.finyr,
            company: sale.compcode,
            customer: sale.customer,
            totalSales: sale.totalsales,

        }));

        console.log(result, "result for jamunadas getTopTenCustomerToday");
        console.log(resp, "resp for jamunadas getTopTenCustomerToday");


        return res.json({ statusCode: 0, data: resp });
    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
    }
}




// Item Wise
export async function getTopTenItemYear(req, res) {
    const pool = getJDASConnectionPool();

    try {
        const { selectedCompany, selectedYear } = req.query;

        console.log(selectedCompany, selectedYear, "req.query for getTopTenItemYear")

        const result = await pool.query(
            `
select d.finyr,e.compcode,c.itemname,sum(b.delqty * a.netamt) as totalsales
from gtsalesinv a
join gtsalesinvdet b on b.gtsalesinvid = a.gtsalesinvid
join gtcompmast e on e.gtcompmastid = a.compcode
join gtfinancialyear d on d.gtfinancialyearid = a.finyear
join hrmfrq f on f.gtfinancialyearid = d.gtfinancialyearid
join gtitemmast c on c.gtitemmastid = b.itemname
where e.compcode = ? and d.finyr = ? AND a.docdate between f.mstdt and f.mendt
group by d.finyr,c.itemname
order by totalsales desc  
limit 10
      `,
            [selectedCompany, selectedYear]   // ✅ positional params

        );

        const resp = result.map((sale) => ({
            salesYear: sale.finyr,
            company: sale.compcode,
            itemName: sale.itemname,
            totalSales: sale.totalsales,

        }));

        console.log(result, "result for jamunadas getTopTenItemYear");
        console.log(resp, "resp for jamunadas getTopTenItemYear");


        return res.json({ statusCode: 0, data: resp });
    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
    }
}
export async function getTopTenItemMonth(req, res) {
    const pool = getJDASConnectionPool();

    try {
        const { selectedCompany, selectedYear, selectMonths } = req.query;

        console.log(selectedCompany, selectedYear, "req.query for getTopTenCustomerMonth")

        const result = await pool.query(
            `
select f.payperiod,d.finyr,e.compcode,c.itemname,sum(b.delqty * a.netamt) as totalsales
from gtsalesinv a
join gtsalesinvdet b on b.gtsalesinvid = a.gtsalesinvid
join gtcompmast e on e.gtcompmastid = a.compcode
join gtcompmast ee on ee.compname=a.customer 
join gtfinancialyear d on d.gtfinancialyearid = a.finyear
join hrmfrq f on f.gtfinancialyearid = d.gtfinancialyearid
join gtitemmast c on c.gtitemmastid = b.itemname
where e.compcode = ? AND d.finyr = ? and (a.docdate between f.mstdt and f.mendt) AND f.payperiod=?
group by d.finyr,c.itemname
order by totalsales desc  
limit 10
      `,
            [selectedCompany, selectedYear, selectMonths]   // ✅ positional params

        );

        const resp = result.map((sale) => ({

            salesYear: sale.finyr,
            salesMonth: sale.payperiod,
            company: sale.compcode,
            itemName: sale.itemname,
            totalSales: sale.totalsales,

        }));

        console.log(result, "result for jamunadas getTopTenCustomerMonth");
        console.log(resp, "resp for jamunadas getTopTenCustomerMonth");


        return res.json({ statusCode: 0, data: resp });
    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
    }
}
export async function getTopTenItemWeek(req, res) {
    const pool = getJDASConnectionPool();

    try {
        const { selectedCompany, selectedYear, selectMonths } = req.query;

        console.log(selectedCompany, "req.query for getTopTenItemWeek")

        const result = await pool.query(
            `
select d.finyr,e.compcode,c.itemname,sum(b.delqty * a.netamt) as totalsales
from gtsalesinv a
join gtsalesinvdet b on b.gtsalesinvid = a.gtsalesinvid
join gtcompmast e on e.gtcompmastid = a.compcode
 join gtfinancialyear d on d.gtfinancialyearid = a.finyear
 join hrmfrq f on f.gtfinancialyearid = d.gtfinancialyearid
join hrwfrq t on t.gtfinancialyearid = d.gtfinancialyearid
join gtitemmast c on c.gtitemmastid = b.itemname
where e.compcode = ?
AND a.docdate between DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY) and CURRENT_DATE
group by d.finyr,c.itemname
order by totalsales desc  
limit 10
      `,
            [selectedCompany]   // ✅ positional params

        );

        const resp = result.map((sale) => ({
            salesYear: sale.finyr,
            company: sale.compcode,
            itemName: sale.itemname,
            totalSales: sale.totalsales,

        }));

        console.log(result, "result for jamunadas getTopTenItemWeek");
        console.log(resp, "resp for jamunadas getTopTenItemWeek");


        return res.json({ statusCode: 0, data: resp });
    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
    }
}
export async function getTopTenItemToday(req, res) {
    const pool = getJDASConnectionPool();

    try {
        const { selectedCompany, selectedYear, selectMonths } = req.query;

        console.log(selectedCompany, "req.query for getTopTenCustomerToday")

        const result = await pool.query(
            `
select d.finyr,e.compcode,c.itemname,sum(b.delqty * a.netamt) as totalsales
from gtsalesinv a
join gtsalesinvdet b on b.gtsalesinvid = a.gtsalesinvid
join gtcompmast e on e.gtcompmastid = a.compcode
join gtfinancialyear d on d.gtfinancialyearid = a.finyear
join hrmfrq f on f.gtfinancialyearid = d.gtfinancialyearid
join hrwfrq t on t.gtfinancialyearid = d.gtfinancialyearid
join gtitemmast c on c.gtitemmastid = b.itemname
where e.compcode = ?
AND a.docdate between CURRENT_DATE and CURRENT_DATE
group by d.finyr,c.itemname
order by totalsales desc  
limit 10

      `,
            [selectedCompany]   // ✅ positional params

        );

        const resp = result.map((sale) => ({
            salesYear: sale.finyr,
            company: sale.compcode,
            itemName: sale.itemname,
            totalSales: sale.totalsales,

        }));

        console.log(result, "result for jamunadas getTopTenCustomerToday");
        console.log(resp, "resp for jamunadas getTopTenCustomerToday");


        return res.json({ statusCode: 0, data: resp });
    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
    }
}