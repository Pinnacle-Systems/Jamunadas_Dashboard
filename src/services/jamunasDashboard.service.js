import { getJDASConnectionPool } from "../constants/db.connection.js";

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
      company: sale.company,
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
    const { selectedCompany, selectedYear, type } = req.query;

    console.log(
      selectedCompany,
      selectedYear,
      type,
      "req.query for getMonthlySales",
    );

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
      ],
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
    const { selectedCompany, selectedYear, type } = req.query;

    console.log(
      selectedCompany,
      selectedYear,
      type,
      "req.query for getQuarterSales",
    );

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
      [selectedCompany, selectedYear, type, type, type],
    );

    const resp = result.map((sale) => ({
      finYear: sale.finyr,
      month: sale.mon,

      company: sale.compcode,
      quarter: sale.salesquarter,
      totalSales: sale.totalsales,
      order: sale.perioddesc,
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
    const { selectedCompany, year, type } = req.query;

    console.log(selectedCompany, year, "req.query for getYearlySales");

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
      [selectedCompany, year, type, type, type],
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
    const { selectedCompany, selectedYear, type } = req.query;

    console.log(
      selectedCompany,
      selectedYear,
      "req.query for getTopTenCustomer",
    );

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
      [selectedCompany, selectedYear, type, type, type], // ✅ positional params
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
    const { selectedCompany, selectedYear, selectMonths, type } = req.query;

    console.log(
      selectedCompany,
      selectedYear,
      "req.query for getTopTenCustomerMonth",
    );

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
      [selectedCompany, selectedYear, selectMonths, type, type, type], // ✅ positional params
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
    const { selectedCompany, selectedYear, selectMonths, type } = req.query;

    console.log(selectedCompany, "req.query for getTopTenCustomerMonth");

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
      [selectedCompany, type, type, type], // ✅ positional params
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
    const { selectedCompany, selectedYear, selectMonths, type } = req.query;

    console.log(selectedCompany, "req.query for getTopTenCustomerToday");

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
      [selectedCompany, type, type, type], // ✅ positional params
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
    const { selectedCompany, selectedYear, type } = req.query;

    console.log(
      selectedCompany,
      selectedYear,
      "req.query for getTopTenItemYear",
    );

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
      [selectedCompany, selectedYear, type, type, type], // ✅ positional params
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
    const { selectedCompany, selectedYear, selectMonths, type } = req.query;

    console.log(
      selectedCompany,
      selectedYear,
      "req.query for getTopTenItemMonth",
    );

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
      [selectedCompany, selectedYear, selectMonths, type, type, type], // ✅ positional params
    );

    const resp = result.map((sale) => ({
      salesYear: sale.finyr,
      salesMonth: sale.payperiod,
      company: sale.compcode,
      itemName: sale.itemname,
      totalSales: sale.totalsales,
    }));

    console.log(result, "result for jamunadas getTopTenItemMonth");
    console.log(resp, "resp for jamunadas getTopTenItemMonth");

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
  }
}
export async function getTopTenItemWeek(req, res) {
  const pool = getJDASConnectionPool();

  try {
    const { selectedCompany, selectedYear, selectMonths, type } = req.query;

    console.log(selectedCompany, "req.query for getTopTenItemWeek");

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
      [selectedCompany, type, type, type], // ✅ positional params
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
    const { selectedCompany, selectedYear, selectMonths, type } = req.query;

    console.log(selectedCompany, "req.query for getTopTenCustomerToday");

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
      [selectedCompany, type, type, type], // ✅ positional params
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

export async function getTopItemMonth(req, res) {
  const pool = getJDASConnectionPool();

  try {
    const { selectedCompany, selectedYear, selectMonths, type, valueType } =
      req.query;

    console.log(
      selectedCompany,
      selectedYear,
      "req.query for getTopTenCustomerMonth",
    );

    const result = await pool.query(
      `
select a.* from 
(select f.payperiod,d.finyr,e.compcode,g.itemname,sum((round(((a.netamt*((b.amount/a.gramt)*100))/100),2))) as totalsales,
case when ? ='quantity' then sum(b.delqty) else sum(a.netamt) end cnt,
g2.unitname
from gtsalesinv a
join gtsalesinvdet b on b.gtsalesinvid = a.gtsalesinvid
join gtcompmast e on e.gtcompmastid = a.compcode
join gtfinancialyear d on d.gtfinancialyearid = a.finyear
join gtunitmast g2 on g2.gtunitmastid =b.uom
join hrmfrq f on f.gtfinancialyearid = d.gtfinancialyearid and (a.docdate between f.mstdt and f.mendt)
join dtitemmast g on g.dtitemmastid = b.itemname
where e.compcode = ? AND d.finyr = ?  AND f.payperiod= ? 
  AND (? = 'quantity' OR ? = 'value')
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
ORDER BY
    CASE
        WHEN ? = 'value' THEN a.totalsales
        WHEN ? = 'quantity' THEN a.cnt
   END DESC
limit 1

      `,
      [
        valueType,
        selectedCompany,
        selectedYear,
        selectMonths,
        valueType, // (?='quantity')
        valueType,
        type,
        type,
        type,
        valueType,
        valueType,
      ], // ✅ positional params
    );

    const resp = result.map((sale) => ({
      salesYear: sale.finyr,
      salesMonth: sale.payperiod,
      company: sale.compcode,
      itemName: sale.itemname,
      totalSales: sale.totalsales,
      count: sale.cnt,
      uom: sale.unitname,
    }));

    console.log(result, "result for jamunadas getTopTenCustomerMonth");
    console.log(resp, "resp for jamunadas getTopTenCustomerMonth");

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
  }
}

export async function getTopItemsWeek(req, res) {
  const pool = getJDASConnectionPool();

  try {
    const { selectedCompany, selectedYear, selectMonths, type, valueType } =
      req.query;

    console.log(selectedCompany, selectedYear, "req.query for getTopItemsWeek");

    const result = await pool.query(
      `
SELECT *
FROM
(
SELECT
    CONCAT('WEEK ', DENSE_RANK() OVER (ORDER BY weekstartdate)) AS week,
    weekstartdate,
    weekenddate,
    finyr,
    compcode,
    itemname,
    totalsales,
    payperiod,
    cnt,
    ROW_NUMBER() OVER (
        PARTITION BY weekstartdate
        ORDER BY totalsales DESC
    ) AS rn
FROM (
  SELECT
    DATE_ADD(DATE_FORMAT(a.docdate,'%Y-%m-01'),
             INTERVAL FLOOR((DAY(a.docdate)-1)/7)*7 DAY) AS weekstartdate,

    DATE_FORMAT(
  LEAST(
    LAST_DAY(a.docdate),
    DATE_ADD(
      DATE_ADD(DATE_FORMAT(a.docdate,'%Y-%m-01'),
      INTERVAL FLOOR((DAY(a.docdate)-1)/7)*7 DAY),
      INTERVAL 6 DAY
    )
  ),
'%Y-%m-%d') AS weekenddate,

    d.finyr,
    f.payperiod,
    e.compcode,
    g.itemname,

    SUM(ROUND(((a.netamt*((b.amount/a.gramt)*100))/100),2)) AS totalsales,
    g2.unitname,
CASE
      WHEN ? = 'quantity' THEN SUM(b.delqty)
      ELSE SUM(a.netamt)
    END AS cnt,
   ROW_NUMBER() OVER (
           PARTITION BY FLOOR((DAY(a.docdate)-1)/7)
            ORDER BY
                CASE
                    WHEN ? = 'quantity' THEN SUM(b.delqty)
                    ELSE SUM(ROUND(((a.netamt*((b.amount/a.gramt)*100))/100),2))
                END DESC
        ) AS rn
    

  FROM gtsalesinv a
  JOIN gtsalesinvdet b ON b.gtsalesinvid = a.gtsalesinvid
  JOIN gtcompmast e ON e.gtcompmastid = a.compcode
  JOIN gtfinancialyear d ON d.gtfinancialyearid = a.finyear
  JOIN gtunitmast g2 ON g2.gtunitmastid = b.uom
  JOIN hrmfrq f 
    ON f.gtfinancialyearid = d.gtfinancialyearid
    AND f.payperiod = ?
  JOIN dtitemmast g ON g.dtitemmastid = b.itemname

  WHERE e.compcode = ?
    AND a.docdate BETWEEN f.mstdt AND f.mendt
    AND (
      ? = 'ALL'
      OR (? = 'B2B' AND a.gstno IS NOT NULL AND TRIM(a.gstno) <> '')
      OR (? = 'B2C' AND (a.gstno IS NULL OR TRIM(a.gstno) = ''))
    )

GROUP BY
    FLOOR((DAY(a.docdate)-1)/7),
    weekstartdate,
    weekenddate,
    d.finyr,
     f.payperiod,
    e.compcode,
    g.itemname
) Y
) X
WHERE rn = 1
ORDER BY weekstartdate;
`,
      [
        valueType, // CASE WHEN ? = 'quantity'
        valueType, // CASE WHEN ? = 'quantity'
        selectMonths, // f.payperiod
        selectedCompany, // compcode

        type, // ? = 'ALL'
        type, // ? = 'B2B'
        type, // ? = 'B2C'
      ],
    );

    const resp = result.map((sale) => ({
      weekName: sale.week?.toString(), // ✅ FIX HERE
      weekStartDate: sale.weekstartdate,
      weekEndDate: sale.weekenddate,
      salesYear: sale.finyr,
      salesMonth: sale.payperiod,
      company: sale.compcode,
      itemName: sale.itemname,
      totalSales: sale.totalsales,
      count: sale.cnt,
      uom: sale.unitname,
    }));

    console.log(result, "result for jamunadas getTopItemsWeek");
    console.log(resp, "resp for jamunadas getTopItemsWeek");

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
  }
}

export async function getSlowMovement(req, res) {
  const pool = getJDASConnectionPool();

  try {
    const { selectedCompany, selectedYear } = req.query;

    console.log(selectedCompany, "req.query for getSlowMovement");

    const result = await pool.query(
      `SELECT 
  a.docdate,
  a.finyear,
    a.itemname, 
    SUM(a.qty) AS current_stock, 
    
    MAX(CASE WHEN a.qty < 0 THEN a.docdate END) AS last_sale_date,

    -- fallback to last movement if no sale
    DATEDIFF(
        CURDATE(), 
        COALESCE(
            MAX(CASE WHEN a.qty < 0 THEN a.docdate END),
            MAX(a.docdate)
        )
    ) AS ageing
FROM dtstorestkmast a
WHERE a.transtype = 'Sales Invoice'
GROUP BY a.itemname
HAVING 
    current_stock > 0
    
   

      `,
      [selectedYear], // ✅ positional params
    );

    const resp = result.map((sale) => ({
      docDate: sale.docdate,
      salesYear: sale.finyear,
      aging: sale.ageing,
      itemName: sale.itemname,
    }));

    console.log(result, "result for jamunadas getSlowMovement");
    console.log(resp, "resp for jamunadas getSlowMovement");

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ statusCode: 1, error: "Internal Server Error" });
  }
}

export async function getLowVelocityItems(req, res) {
  const pool = getJDASConnectionPool();

  try {
    const { selectedYear } = req.query;

    if (!selectedYear) {
      return res
        .status(400)
        .json({ statusCode: 1, error: "selectedYear is required" });
    }

    // e.g. selectedYear = "25-26"  →  yearStart = "2025-04-01", yearEnd = "2026-03-31"
    const yearPrefix = "20" + selectedYear.split("-")[0]; // "2025"
    const nextYearPrefix = "20" + selectedYear.split("-")[1]; // "2026"
    const yearStart = `${yearPrefix}-04-01`;
    const yearEnd = `${nextYearPrefix}-03-31`;

    // Number of days in financial year window (used as denominator for velocity)
    // DATEDIFF(yearEnd, yearStart) = 364 days for a normal year
    const query = `
      SELECT
          a.itemname,
 
          /* current stock on hand */
          SUM(a.qty)                                          AS current_stock,
 
          /* movement dates */
          MAX(a.docdate)                                      AS last_movement_date,
          MAX(CASE WHEN a.qty < 0 THEN a.docdate END)        AS last_sale_date,
 
          /* ageing: days since last sale or last movement */
          DATEDIFF(
            CURDATE(),
            COALESCE(
              MAX(CASE WHEN a.qty < 0 THEN a.docdate END),
              MAX(a.docdate)
            )
          )                                                   AS ageing,
 
          /* total qty sold in the financial year */
          SUM(CASE WHEN a.qty < 0 THEN ABS(a.qty) ELSE 0 END) AS total_qty_sold,
 
          /* number of active days = DATEDIFF between first and last movement */
          NULLIF(DATEDIFF(MAX(a.created_on), MIN(a.created_on)), 0) AS active_days,
 
          /* velocity = total sales / number of days in year window */
          SUM(CASE WHEN a.qty < 0 THEN ABS(a.qty) ELSE 0 END) /
          NULLIF(
            DATEDIFF(?, ?),   -- yearEnd, yearStart  (fixed year window)
            0
          )                                                   AS velocity,
 
          /* days to clear remaining stock at current velocity */
          CASE
            WHEN SUM(CASE WHEN a.qty < 0 THEN ABS(a.qty) ELSE 0 END) = 0
            THEN NULL
            ELSE
              SUM(a.qty) /
              NULLIF(
                SUM(CASE WHEN a.qty < 0 THEN ABS(a.qty) ELSE 0 END) /
                NULLIF(DATEDIFF(?, ?), 0),
                0
              )
          END                                                 AS daysToClear
 
      FROM dtstorestkmast a
 
      WHERE a.created_on >= ?
        AND a.created_on <= ?
 
      GROUP BY a.itemname
 
     HAVING current_stock > 0
   AND total_qty_sold > 0
   AND velocity IS NOT NULL
   AND velocity < 0.5
 
      ORDER BY velocity ASC, ageing DESC
 
      LIMIT 100;
    `;

    // params order matches the ? placeholders above
    const params = [
      yearEnd,
      yearStart, // DATEDIFF for velocity denominator
      yearEnd,
      yearStart, // DATEDIFF for daysToClear denominator
      yearStart,
      yearEnd, // WHERE created_on range
    ];

    const result = await pool.query(query, params);

    const resp = result.map((row) => ({
      itemName: row.itemname,
      currentStock: Number(row.current_stock) || 0,
      aging: Number(row.ageing) || 0,
      lastSaleDate: row.last_sale_date ?? null,
      lastMovementDate: row.last_movement_date ?? null,
      totalQtySold: Number(row.total_qty_sold) || 0,
      activeDays: Number(row.active_days) || 0,
      velocity: row.velocity
        ? Number(row.velocity).toFixed(4) // 4dp for precision
        : "0.0000",
      daysToClear: row.daysToClear ? Number(row.daysToClear).toFixed(2) : null,
      deadStockFlag: null, // always null here — these are low velocity, not dead
    }));

    console.log("getLowVelocityItems resp:", resp.length, "items");

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving low velocity items:", err);
    return res
      .status(500)
      .json({ statusCode: 1, error: "Internal Server Error" });
  }
}

export async function getDeadStockItems(req, res) {
  const pool = getJDASConnectionPool();

  try {
    const { selectedYear } = req.query;

    if (!selectedYear) {
      return res
        .status(400)
        .json({ statusCode: 1, error: "selectedYear is required" });
    }

   

    const query = `
      SELECT
    a.docdate,
    a.itemname,
    a.qty,
    DATEDIFF(SYSDATE(), a.docdate) AS ageing,
    a.finyear
FROM dtstorestkmast a
JOIN gtfinancialyear d
    ON d.finyr = a.finyear
WHERE d.finyr = ?
  AND a.transtype = 'Purchase Inward'
  AND (a.itemname, a.docdate) IN (
        SELECT
            itemname,
            MAX(docdate)
        FROM dtstorestkmast
        WHERE finyear = ?
          AND transtype = 'Purchase Inward'
        GROUP BY itemname
    )
  AND a.itemname NOT IN (
        SELECT itemname
        FROM dtstorestkmast
        WHERE finyear = ?
          AND transtype = 'Sales Invoice'
    )
AND DATEDIFF(SYSDATE(), a.docdate) > 90
ORDER BY a.itemname;
    `;

    const result = await pool.query(query, [selectedYear,selectedYear,selectedYear]);

    const resp = result.map((row) => ({
      itemName: row.itemname,
      // currentStock: Number(row.current_stock) || 0,
      // aging: Number(row.ageing) || 0,
      // lastSaleDate: row.last_sale_date ?? null,
      // lastMovementDate: row.last_movement_date ?? null,
      // totalQtySold: 0,
      // activeDays: 0,
      // velocity: "0.0000",
      // daysToClear: null,
      // deadStockFlag: "Dead Stock",
    }));

    console.log("getDeadStockItems resp:", resp.length, "items");

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving dead stock items:", err);
    return res
      .status(500)
      .json({ statusCode: 1, error: "Internal Server Error" });
  }
}
