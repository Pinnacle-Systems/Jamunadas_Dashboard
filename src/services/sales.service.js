import { getJDASConnectionPool } from "../constants/db.connection.js";
import { MONTHLY } from "../constants/defaultQueryValues.js";

export const getSalesSummary = async (req, res) => {
  const pool = getJDASConnectionPool();

  const MONTHLY_QUERY = `
    select month(a.docdate) as month_no, monthname(a.docdate) as month_name,
    sum(b.delqty * b.porate) as total_sales
    from gtsalesinv a
    join gtsalesinvdet b on b.gtsalesinvid = a.gtsalesinvid
    where year(a.docdate) = ?
    group by month(a.docdate), monthname(a.docdate)
    order by month(a.docdate)
  `;

  try {
    const { year } = req.params;
    const { view = MONTHLY } = req.query;

    let resp = [];

    switch (view) {
      case MONTHLY:
      default:
        const result = await pool.query(MONTHLY_QUERY, [year]);

        resp = result.map((sale) => ({
          monthNo: sale.month_no,
          monthName: sale.month_name,
          totalSales: sale.total_sales,
        }));
        break;
    }

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTotalSales = async (req, res) => {
  const pool = getJDASConnectionPool();

  try {
    const result = await pool.query(`
        select year(sales.docdate) as sales_year, sum(sales_details.delqty * sales_details.porate) as total_sales 
        from gtsalesinv sales 
        join gtsalesinvdet sales_details on sales_details.gtsalesinvid = sales.gtsalesinvid
        group by sales_year 
        order by sales_year
    `);

    let resp = result.map((sale) => ({
      year: sale.sales_year,
      totalSales: sale.total_sales,
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
