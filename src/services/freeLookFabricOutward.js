import { getConnectionERP } from "../constants/db.connection.js";
import oracledb from "oracledb";

export async function getFabric(req, res) {
  let connection;

  try {
    connection = await getConnectionERP();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    const { finyear } = req.query;

    const result = await connection.execute(
      `
      SELECT 'INWARD' CCATEGORY,
             COUNT(*) CNT,
             NVL(SUM(A.TOTQTY), 0) QTY
      FROM DTFABINWENTRY A
      JOIN GTFINANCIALYEAR B
        ON A.FINYR = B.GTFINANCIALYEARID
      WHERE B.FINYR = :FINYEAR

      UNION ALL

      SELECT 'OUTWARD' CCATEGORY,
             COUNT(*) CNT,
             NVL(SUM(A.TOTDCWT), 0) QTY
      FROM dtfdelchal A
      JOIN GTFINANCIALYEAR B
        ON A.FINYR = B.GTFINANCIALYEARID
      WHERE B.FINYR = :FINYEAR
      `,
      { FINYEAR: finyear },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const data = result.rows.map((item) => ({
      category: item.CCATEGORY,
      count: item.CNT,
      qty: item.QTY,
    }));

    return res.json({ statusCode: 0, data });
  } catch (err) {
    console.error("Error retrieving data:", err);

    return res.status(500).json({
      statusCode: 1,
      message: "Database error",
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}

export async function getFabricOutward(req, res) {
  let connection;

  try {
    // 1️⃣ Get DB Connection
    connection = await getConnectionERP();

    if (!connection) {
      return res.status(500).json({
        statusCode: 1,
        message: "Database connection not available",
      });
    }

    const { finyear } = req.query;

    if (!finyear) {
      return res.status(400).json({
        statusCode: 1,
        message: "finyear is required",
      });
    }

    // 2️⃣ Call Stored Procedure
    await connection.execute(`
      BEGIN
	      LOAD_FABRIC_OUTWARD_DATA();
      END;
    `);

    // 3️⃣ Commit (IMPORTANT)
    await connection.commit();

    // 4️⃣ Execute SELECT Query
    const result = await connection.execute(
      `SELECT CCATEGORY,
              COUNT(*) CNT,
              SUM(QTY) QTY
       FROM FABRIC_OUTWARD_DATA
       WHERE FINYR = :FINYEAR
       GROUP BY CCATEGORY`,
      { FINYEAR: finyear },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // 5️⃣ Map Result
    const data = result.rows.map((row) => ({
      category: row.CCATEGORY,
      count: row.CNT,
      qty: row.QTY,
    }));

    // 6️⃣ Send Response
    return res.json({
      statusCode: 0,
      data,
    });
  } catch (err) {
    console.error("Error retrieving data:", err);

    return res.status(500).json({
      statusCode: 1,
      message: "Database error",
      error: err.message,
    });
  } finally {
    // 7️⃣ Close Connection
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}

export async function getFabricOutwardCustomer(req, res) {
  let connection;

  try {
    connection = await getConnectionERP();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    const { finyear, category } = req.query;

    const result = await connection.execute(
      `SELECT CUSTNAME CUSTOMER ,COUNT(*) CNT,SUM(QTY) QTY FROM FABRIC_OUTWARD_DATA
WHERE FINYR = :FINYEAR AND ( :CCATEGORY = 'ALL' OR CCATEGORY = :CCATEGORY )
GROUP BY CUSTNAME`,
      { FINYEAR: finyear, CCATEGORY: category },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const data = result.rows.map((item) => ({
      customer: item.CUSTOMER,
      count: item.CNT,
      qty: item.QTY,
    }));

    return res.json({ statusCode: 0, data });
  } catch (err) {
    console.error("Error retrieving data:", err);

    return res.status(500).json({
      statusCode: 1,
      message: "Database error",
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}

export async function getFabricOutwardCustomerByName(req, res) {
  let connection;

  try {
    connection = await getConnectionERP();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    let { finyear, category, customer } = req.query;
    if (customer === null || customer === "" || customer === undefined) {
      customer = "ALL";
    }
    const result = await connection.execute(
      `SELECT DISTINCT DOCID AS DELNO,
        TO_CHAR(DOCDATE, 'DD/MM/YYYY') AS DELDATE,
                ORDERNO,
                GRNNO,
                CUSTNAME,
                FABNAME,
                PROCESSTYPE,
                ROUTE,
                DIA,
                UNITNAME,
                QTY
FROM FABRIC_OUTWARD_DATA
WHERE FINYR = :FINYR AND 
 ( :CCATEGORY = 'ALL' OR CCATEGORY = :CCATEGORY ) AND
 ( :CUSTNAME = 'ALL' OR CUSTNAME = :CUSTNAME )
ORDER BY 1,2,3,4,5,6,7,8`,
      { FINYR: finyear, CCATEGORY: category, CUSTNAME: customer },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const data = result.rows.map((item) => ({
      delNo: item.DELNO,
      delDate: item.DELDATE,
      orderNo: item.ORDERNO,
      grnNo: item.GRNNO,
      custName: item.CUSTNAME,
      fabName: item.FABNAME,
      process: item.PROCESSTYPE,
      route: item.ROUTE,
      dia: item.DIA,
      uom: item.UNITNAME,
      qty: item.QTY,
    }));

    return res.json({ statusCode: 0, data });
  } catch (err) {
    console.error("Error retrieving data:", err);

    return res.status(500).json({
      statusCode: 1,
      message: "Database error",
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}

export async function getFabOutCust(req, res) {
  let connection;

  try {
    connection = await getConnectionERP();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }
    const { category } = req.query;

    const result = await connection.execute(
      `SELECT DISTINCT CUSTNAME
FROM FABRIC_OUTWARD_DATA
WHERE ( :CCATEGORY = 'ALL' OR CCATEGORY = :CCATEGORY )
ORDER BY CUSTNAME
      `,
      { CCATEGORY: category },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const data = result.rows.map((row) => row.CUSTNAME);

    return res.json({ statusCode: 0, data });
  } catch (err) {
    console.error("Error retrieving data:", err);

    return res.status(500).json({
      statusCode: 1,
      message: "Database error",
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}
