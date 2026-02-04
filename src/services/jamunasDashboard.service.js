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
       select d.finyr as salesyear,c.compcode AS company,SUM(
        ROUND((a.netamt * ((b.amount / a.gramt) * 100)) / 100, 2)
    ) AS totalsales from gtsalesinv a
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
        const { selectedCompany, selectedYear ,type} = req.query;

        console.log(selectedCompany, selectedYear,type, "req.query for getMonthlySales")

        //     const result = await pool.query(
        //         `
        // SELECT 
        //     e.payperiod,
        //        d.finyr,
        //     c.compcode,
        // SUM(
        //     ROUND((a.netamt * ((b.amount / a.gramt) * 100)) / 100, 2)
        // ) AS totalsales      FROM gtsalesinv a
        //   JOIN gtcompmast c ON c.gtcompmastid = a.compcode
        //   join gtsalesinvdet b on b.gtsalesinvid = a.gtsalesinvid

        //   JOIN gtfinancialyear d ON d.gtfinancialyearid = a.finyear
        //   JOIN hrmfrq e ON e.gtfinancialyearid = d.gtfinancialyearid
        //  WHERE c.compcode = ?
        //     AND d.finyr = ?
        //     AND a.docdate BETWEEN e.mstdt AND e.mendt
        //   GROUP BY e.mstdt, e.payperiod, c.compcode
        //   ORDER BY e.mstdt
        //   `,
        //         [selectedCompany, selectedYear]   // ✅ positional params

        //     );
        const result = await pool.query(
            `
  SELECT 
      e.payperiod,
      d.finyr,
      c.compcode,
      SUM(
          ROUND((a.netamt * ((b.amount / a.gramt) * 100)) / 100, 2)
      ) AS totalsales
  FROM gtsalesinv a
  JOIN gtcompmast c ON c.gtcompmastid = a.compcode
  JOIN gtsalesinvdet b ON b.gtsalesinvid = a.gtsalesinvid
  JOIN gtfinancialyear d ON d.gtfinancialyearid = a.finyear
  JOIN hrmfrq e ON e.gtfinancialyearid = d.gtfinancialyearid
  WHERE c.compcode = ?
    AND d.finyr = ?
    AND a.docdate BETWEEN e.mstdt AND e.mendt
    AND (
          ? = 'ALL'
          OR (
              ? = 'B2B'
              AND a.gstno IS NOT NULL
              AND TRIM(a.gstno) <> ''
          )
          OR (
              ? = 'B2C'
              AND (a.gstno IS NULL OR TRIM(a.gstno) = '')
          )
        )
  GROUP BY e.mstdt, e.payperiod, c.compcode
  ORDER BY e.mstdt
  `,
            [
                selectedCompany,
                selectedYear,
                type, // ALL / B2B / B2C
                type,
                type,
            ]
        );

        const resp = result.map((sale) => ({
            payPeriod: sale.payperiod,
            finYear: sale.finyr,
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
        const { selectedCompany, selectedYear , type} = req.query;

        console.log(selectedCompany, selectedYear, type,"req.query for getQuarterSales")

        const result = await pool.query(
            `
select d.finyr,c.compcode,e.perioddesc,e.quarter as salesquarter,e.pstartdate,e.penddate, SUM(
        ROUND((a.netamt * ((b.amount / a.gramt) * 100)) / 100, 2)
    ) AS  totalsales,
DATE_FORMAT(e.pstartdate, '%M %Y') mon
from gtsalesinv a 
      join gtsalesinvdet b on b.gtsalesinvid = a.gtsalesinvid

join gtfinancialyear d on a.finyear = d.gtfinancialyearid
join gtfinancialyeardtl e on d.gtfinancialyearid = e.gtfinancialyearid and a.docdate between e.pstartdate and e.penddate
join gtcompmast c on a.compcode = c.gtcompmastid 
where c.compcode = ? and   d.finyr = ? 
  AND (
          ? = 'ALL'
          OR (
            ? = 'B2B'
            AND a.gstno IS NOT NULL
            AND TRIM(a.gstno) <> ''
          )
          OR (
            ? = 'B2C'
            AND (a.gstno IS NULL OR TRIM(a.gstno) = '')
          )
        )
group by d.finyr,c.compcode,e.perioddesc,e.quarter,e.pstartdate,e.penddate
order by e.pstartdate
      `,
            [selectedCompany, selectedYear,type, type,type]

        );

        const resp = result.map((sale) => ({
            finYear: sale.finyr,
            month: sale.mon,

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
        const { selectedCompany, year ,type} = req.query;

        console.log(selectedCompany, year, "req.query for getYearlySales")

        const result = await pool.query(
            `
select d.finyr,ee.compcode,SUM(
        ROUND((a.netamt * ((b.amount / a.gramt) * 100)) / 100, 2)
    ) AS totalsales
from gtsalesinv a
join gtcompmast ee on ee.gtcompmastid = a.compcode
      join gtsalesinvdet b on b.gtsalesinvid = a.gtsalesinvid

join gtfinancialyear d on d.gtfinancialyearid = a.finyear
JOIN hrmfrq e ON e.gtfinancialyearid = d.gtfinancialyearid AND a.docdate BETWEEN e.mstdt AND e.mendt
 WHERE ee.compcode = ? AND d.finyr = ?
  AND (
          ? = 'ALL'
          OR (
            ? = 'B2B'
            AND a.gstno IS NOT NULL
            AND TRIM(a.gstno) <> ''
          )
          OR (
            ? = 'B2C'
            AND (a.gstno IS NULL OR TRIM(a.gstno) = '')
          )
        )
group by d.finyr,ee.compcode
order by totalsales desc 
limit 10 


      `,
            [selectedCompany, year,type, type,type]

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
        const { selectedCompany, selectedYear,type } = req.query;

        console.log(selectedCompany, selectedYear, "req.query for getTopTenCustomer")

        const result = await pool.query(
            `

  select d.finyr,e.compcode,a.customer as customer,SUM(
        ROUND((a.netamt * ((b.amount / a.gramt) * 100)) / 100, 2)
    ) AS totalsales
from gtsalesinv a
join gtcompmast e on e.gtcompmastid = a.compcode 
      join gtsalesinvdet b on b.gtsalesinvid = a.gtsalesinvid

join gtfinancialyear d on d.gtfinancialyearid = a.finyear
 WHERE e.compcode = ? AND d.finyr = ? 
  AND (
          ? = 'ALL'
          OR (
            ? = 'B2B'
            AND a.gstno IS NOT NULL
            AND TRIM(a.gstno) <> ''
          )
          OR (
            ? = 'B2C'
            AND (a.gstno IS NULL OR TRIM(a.gstno) = '')
          )
        )
group by d.finyr,a.customer,e.compcode
order by totalsales desc  
limit 10
      `,
            [selectedCompany, selectedYear,type, type,type]   // ✅ positional params

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
        const { selectedCompany, selectedYear, selectMonths,type } = req.query;

        console.log(selectedCompany, selectedYear, "req.query for getTopTenCustomerMonth")

        const result = await pool.query(
            `
select f.payperiod,d.finyr,e.compcode,a.customer,SUM(
        ROUND((a.netamt * ((b.amount / a.gramt) * 100)) / 100, 2)
    ) AS totalsales
from gtsalesinv a
join gtcompmast e on e.gtcompmastid = a.compcode 
      join gtsalesinvdet b on b.gtsalesinvid = a.gtsalesinvid
join gtfinancialyear d on d.gtfinancialyearid = a.finyear
join hrmfrq f on f.gtfinancialyearid = d.gtfinancialyearid and (a.docdate between f.mstdt and f.mendt)
where e.compcode = ? AND d.finyr = ?  AND f.payperiod= ?
  AND (
          ? = 'ALL'
          OR (
            ? = 'B2B'
            AND a.gstno IS NOT NULL
            AND TRIM(a.gstno) <> ''
          )
          OR (
            ? = 'B2C'
            AND (a.gstno IS NULL OR TRIM(a.gstno) = '')
          )
        )
group by f.payperiod,d.finyr,e.compcode,a.customer
order by totalsales desc  
limit 10
      `,
            [selectedCompany, selectedYear, selectMonths,type, type,type]   // ✅ positional params

        );

        const resp = result.map((sale) => ({
            salesYear: sale.payperiod,
            fiYear: sale.finyr,

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
        const { selectedCompany, selectedYear, selectMonths,type } = req.query;

        console.log(selectedCompany, "req.query for getTopTenCustomerMonth")

        const result = await pool.query(
            `
    select d.finyr,e.compcode,a.customer,SUM(
        ROUND((a.netamt * ((b.amount / a.gramt) * 100)) / 100, 2)
    ) AS totalsales
from gtsalesinv a
join gtcompmast e on e.gtcompmastid = a.compcode
      join gtsalesinvdet b on b.gtsalesinvid = a.gtsalesinvid

join gtfinancialyear d on d.gtfinancialyearid = a.finyear
where e.compcode = ?
  AND (
          ? = 'ALL'
          OR (
            ? = 'B2B'
            AND a.gstno IS NOT NULL
            AND TRIM(a.gstno) <> ''
          )
          OR (
            ? = 'B2C'
            AND (a.gstno IS NULL OR TRIM(a.gstno) = '')
          )
        )
AND a.docdate between DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY) and CURRENT_DATE
group by  d.finyr,e.compcode,a.customer
order by totalsales desc  
limit 10

      `,
            [selectedCompany,type, type,type]   // ✅ positional params

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
        const { selectedCompany, selectedYear, selectMonths ,type} = req.query;

        console.log(selectedCompany, "req.query for getTopTenCustomerToday")

        const result = await pool.query(
            `
select d.finyr,e.compcode,a.customer,SUM(
        ROUND((a.netamt * ((b.amount / a.gramt) * 100)) / 100, 2)
    ) AS totalsales
from gtsalesinv a
join gtcompmast e on e.gtcompmastid = a.compcode
      join gtsalesinvdet b on b.gtsalesinvid = a.gtsalesinvid

join gtfinancialyear d on d.gtfinancialyearid = a.finyear
where e.compcode = ?
  AND (
          ? = 'ALL'
          OR (
            ? = 'B2B'
            AND a.gstno IS NOT NULL
            AND TRIM(a.gstno) <> ''
          )
          OR (
            ? = 'B2C'
            AND (a.gstno IS NULL OR TRIM(a.gstno) = '')
          )
        )
AND a.docdate between CURRENT_DATE and CURRENT_DATE
group by d.finyr,e.compcode,a.customer
order by totalsales desc  
limit 10

      `,
            [selectedCompany,type, type,type]   // ✅ positional params

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
        const { selectedCompany, selectedYear ,type} = req.query;

        console.log(selectedCompany, selectedYear, "req.query for getTopTenItemYear")

        const result = await pool.query(
            `
select d.finyr,e.compcode,g.itemname,SUM(round(((a.netamt*((b.amount/a.gramt)*100))/100),2)) as totalsales
from gtsalesinv a
join gtsalesinvdet b on b.gtsalesinvid = a.gtsalesinvid
join gtcompmast e on e.gtcompmastid = a.compcode
join gtfinancialyear d on d.gtfinancialyearid = a.finyear
join dtitemmast g on g.dtitemmastid = b.itemname
where e.compcode = ? and d.finyr = ?
  AND (
          ? = 'ALL'
          OR (
            ? = 'B2B'
            AND a.gstno IS NOT NULL
            AND TRIM(a.gstno) <> ''
          )
          OR (
            ? = 'B2C'
            AND (a.gstno IS NULL OR TRIM(a.gstno) = '')
          )
        )
group by d.finyr,g.itemname,e.compcode
order by totalsales desc  
limit 10

      `,
            [selectedCompany, selectedYear,type, type,type]   // ✅ positional params

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
        const { selectedCompany, selectedYear, selectMonths,type } = req.query;

        console.log(selectedCompany, selectedYear, "req.query for getTopTenCustomerMonth")

        const result = await pool.query(
            `
select a.* from 
(select f.payperiod,d.finyr,e.compcode,g.itemname,sum((round(((a.netamt*((b.amount/a.gramt)*100))/100),2))) as totalsales
from gtsalesinv a
join gtsalesinvdet b on b.gtsalesinvid = a.gtsalesinvid
join gtcompmast e on e.gtcompmastid = a.compcode
join gtfinancialyear d on d.gtfinancialyearid = a.finyear
join hrmfrq f on f.gtfinancialyearid = d.gtfinancialyearid and (a.docdate between f.mstdt and f.mendt)
join dtitemmast g on g.dtitemmastid = b.itemname
where e.compcode = ? AND d.finyr = ?  AND f.payperiod= ?
  AND (
          ? = 'ALL'
          OR (
            ? = 'B2B'
            AND a.gstno IS NOT NULL
            AND TRIM(a.gstno) <> ''
          )
          OR (
            ? = 'B2C'
            AND (a.gstno IS NULL OR TRIM(a.gstno) = '')
          )
        )
group by f.payperiod,d.finyr,e.compcode,g.itemname
) a
order by a.totalsales desc  
limit 10

      `,
            [selectedCompany, selectedYear, selectMonths,type, type,type]   // ✅ positional params

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
        const { selectedCompany, selectedYear, selectMonths,type } = req.query;

        console.log(selectedCompany, "req.query for getTopTenItemWeek")

        const result = await pool.query(
            `

  select d.finyr,e.compcode,g.itemname,sum((round(((a.netamt*((b.amount/a.gramt)*100))/100),2))) as totalsales
from gtsalesinv a
join gtsalesinvdet b on b.gtsalesinvid = a.gtsalesinvid
join gtcompmast e on e.gtcompmastid = a.compcode
 join gtfinancialyear d on d.gtfinancialyearid = a.finyear
join dtitemmast g on g.dtitemmastid = b.itemname
where e.compcode = ?
  AND (
          ? = 'ALL'
          OR (
            ? = 'B2B'
            AND a.gstno IS NOT NULL
            AND TRIM(a.gstno) <> ''
          )
          OR (
            ? = 'B2C'
            AND (a.gstno IS NULL OR TRIM(a.gstno) = '')
          )
        )
AND a.docdate between DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY) and CURRENT_DATE
group by d.finyr,g.itemname,e.compcode
order by totalsales desc  
limit 10
      `,
            [selectedCompany,type, type,type]   // ✅ positional params

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
        const { selectedCompany, selectedYear, selectMonths,type } = req.query;

        console.log(selectedCompany, "req.query for getTopTenCustomerToday")

        const result = await pool.query(
            `

select d.finyr,e.compcode,g.itemname,sum((round(((a.netamt*((b.amount/a.gramt)*100))/100),2))) as totalsales
from gtsalesinv a
join gtsalesinvdet b on b.gtsalesinvid = a.gtsalesinvid
join gtcompmast e on e.gtcompmastid = a.compcode
join gtfinancialyear d on d.gtfinancialyearid = a.finyear
join dtitemmast g on g.dtitemmastid = b.itemname
where e.compcode = ?
 AND (
          ? = 'ALL'
          OR (
            ? = 'B2B'
            AND a.gstno IS NOT NULL
            AND TRIM(a.gstno) <> ''
          )
          OR (
            ? = 'B2C'
            AND (a.gstno IS NULL OR TRIM(a.gstno) = '')
          )
        )
AND a.docdate between CURRENT_DATE and CURRENT_DATE
group by d.finyr,e.compcode,g.itemname
order by totalsales desc  
limit 10

      `,
            [selectedCompany,type, type,type]   // ✅ positional params

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