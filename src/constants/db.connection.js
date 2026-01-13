import { createRequire } from "module";
const require = createRequire(import.meta.url);
const oracledb = require("oracledb");
// oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_PATH });
oracledb.initOracleClient({ libDir: "C:/oracle/instantclient_19_20" });

const mariadb = require("mariadb");

const dbConfig = {
  user: "PSSPAYROLL",
  password: "PSSPAYROLL_OCT2024",
  connectString: "103.125.155.220:1555/AN01P",
};
const dbConfigERP = {
  user: "TIPLAGF",
  password: "TIPLAGF555",
  connectString: "103.125.155.219:1555/AN01P",
};

const jdasDbConfig = {
  user: "tiplav",
  password: "tiplav$",
  host: "203.95.216.155",
  database: "pssjdas",
  port: 3555,
  connectionLimit: 10,
};

let jdasConnectionPool;

export const getJDASConnectionPool = () => {
  if (!jdasConnectionPool) {
    console.log("Creating MariaDB connection pool... ");
    jdasConnectionPool = mariadb.createPool(jdasDbConfig);
  }

  return jdasConnectionPool;
};

export const getJDASConnection = async (res) => {
  let connection;
  try {
    connection = await mariadb.createConnection({
      user: jdasDbConfig.user,
      password: jdasDbConfig.password,
      database: jdasDbConfig.database,
      host: jdasDbConfig.host,
      port: jdasDbConfig.port,
    });
    console.log("✅ MariaDB Connection Successful!");
    return connection;
  } catch (err) {
    return res.json({ statusCode: 1, message: "Database Connection Failed" });
  }
};

export async function getConnection(res) {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: dbConfig.user,
      password: dbConfig.password,
      connectString: dbConfig.connectString,
    });
    console.log("✅ OracleDB Connection Successful!");
    return connection;
  } catch (err) {
    return res.json({ statusCode: 1, message: "Database Connection Failed" });
  }
}
export async function getConnectionERP(res) {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: dbConfigERP.user,
      password: dbConfigERP.password,
      connectString: dbConfigERP.connectString,
    });
    console.log("✅ OracleDB Connection Successful!");
    return connection;
  } catch (err) {
    return res.json({ statusCode: 1, message: "Database Connection Failed" });
  }
}
