import { useState, useMemo, useEffect } from "react";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaStepBackward,
  FaStepForward,
  FaSearch,
} from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useGetAverageIncomeTableQuery } from "../../../../redux/service/jamunasDashboardService";
import {
  addInsightsRowTurnOver,
  formatQtyByUOM,
  getExcelQtyFormatByUOM,
} from "../../../../utils/hleper";
import SpinLoader from "../../../../utils/spinLoader";
import moment from "moment";

const formatINR = (val) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    val ?? 0,
  );

const AverageIncomeTable = ({
  year,
  company,
  closeTable,
  finYrData,
  selectedYear,
  setSelectedYear,
  selectedfilterType,
  setSelectedFilterType,
  itemGroupName,
  allItemGroups,
}) => {
  const [netpayRange, setNetpayRange] = useState({ min: 0, max: Infinity });
  const [localCompany, setLocalCompany] = useState(company || "HVM");
  const [search, setSearch] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItemGroup, setSelectedItemGroup] = useState(itemGroupName);
  const recordsPerPage = 34;
  console.log(allItemGroups, "allItemGroups");

  useEffect(() => {
    setLocalCompany(company || "HVM");
  }, [company]);
  useEffect(() => {
    setSelectedItemGroup(itemGroupName || "");
  }, [itemGroupName]);

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetAverageIncomeTableQuery(
    {
      params: {
        companyName: localCompany,
        finYear: selectedYear,
        itemGroupName: selectedItemGroup,
      },
    },
    { skip: !selectedYear || !localCompany || !selectedItemGroup },
  );

  const rawData = useMemo(
    () => (Array.isArray(response?.data) ? response.data : []),
    [response?.data],
  );

  // ✅ Search only on fields that exist in the table
  const filteredData = useMemo(() => {
    return rawData.filter((row) => {
      if (
        search.itemName &&
        !row.itemName?.toLowerCase().includes(search.itemName.toLowerCase())
      )
        return false;
      if (
        search.uom &&
        !row.uom?.toLowerCase().includes(search.uom.toLowerCase())
      )
        return false;

      // ✅ Min / Max filter on totalAmount
      const value = Number(row.totalAmount || 0);
      if (value < netpayRange.min) return false;
      if (netpayRange.max !== Infinity && value > netpayRange.max) return false;

      return true;
    });
  }, [rawData, search, netpayRange]);

  const totalTurnOver = useMemo(() => {
    if (isLoading || isFetching) return 0; // show 0 while fetching
    return filteredData.reduce((sum, r) => sum + Number(r.totalAmount || 0), 0);
  }, [filteredData, isLoading, isFetching]);

  const totalAvg = useMemo(() => {
    if (isLoading || isFetching) return 0; // show 0 while fetching
    return filteredData.reduce((sum, r) => sum + Number(r.weightedAvg || 0), 0);
  }, [filteredData, isLoading, isFetching]);

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const currentRecords = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage,
  );

  const formateDate = (date) =>
    !date ? "" : moment(date).format("DD-MM-YYYY");

  // ✅ Excel columns match exactly what's shown in the table
  const downloadExcel = async () => {
    if (!filteredData.length) {
      alert("No data");
      return;
    }

    const totalRate = filteredData.reduce(
      (sum, r) => sum + Number(r.avgRate || 0),
      0,
    );
    const totalQty = filteredData.reduce(
      (sum, r) => sum + Number(r.totalQty || 0),
      0,
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Average Income Report");

    worksheet.columns = [
      { header: "Item Name", key: "itemName", width: 50 },
      { header: "Total Invoice Qty", key: "totalQty", width: 20 },
      { header: "UOM", key: "uom", width: 15 },
      { header: "Total Rate", key: "avgRate", width: 22 },
      { header: "Total Amount", key: "totalAmount", width: 22 },
      { header: "Total Avg", key: "weightedAvg", width: 22 },
    ];

    /* ── Title ── */
    worksheet.insertRow(1, ["Average Income Report"]);
    worksheet.mergeCells("A1:F1");
    const titleCell = worksheet.getCell("A1");
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getRow(1).height = 30;

    /* ── Insights ── */
    addInsightsRowTurnOver({
      worksheet,
      startRow: 2,
      totalColumns: 3,
      selectedYear: selectedYear,
      localCompany,
      dynamicField: "Item Group",
      dynamicValue: selectedItemGroup,
      disableWeek: true,
    });

    /* ── Header row style ── */
    const headerRow = worksheet.getRow(3);
    headerRow.height = 26;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9D9D9" },
      };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });

    /* ── Data rows ── */
    filteredData.forEach((r) => {
      const row = worksheet.addRow({
        itemName: r.itemName,
        totalQty: Number(r.totalQty || 0),
        uom: r.uom,
        avgRate: Number(r.avgRate || 0),
        totalAmount: Number(r.totalAmount || 0),
        weightedAvg: Number(r.weightedAvg || 0),
      });
      row.getCell("totalQty").numFmt = getExcelQtyFormatByUOM(r.uom);
    });

    /* ── Row alignment ── */
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber <= 3) return;
      row.height = 22;
      ["itemName", "uom"].forEach(
        (k) =>
          (row.getCell(k).alignment = {
            horizontal: "left",
            vertical: "middle",
            indent: 1,
          }),
      );
      ["totalQty", "avgRate", "totalAmount", "weightedAvg"].forEach(
        (k) =>
          (row.getCell(k).alignment = {
            horizontal: "right",
            vertical: "middle",
            indent: 1,
          }),
      );
    });

    /* ── Total row ── */
    const totalRow = worksheet.addRow({
      itemName: "",
      totalQty: "",
      uom: "Total",
      avgRate: totalRate,
      totalAmount: totalTurnOver,
      weightedAvg: totalAvg,
    });
    totalRow.height = 24;
    totalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.border = { top: { style: "thin" } };
      cell.alignment = {
        vertical: "middle",
        horizontal: colNumber === 1 ? "left" : "right",
        indent: 1,
      };
    });

    /* ── Number formats ── */
    worksheet.getColumn("avgRate").numFmt = "₹ #,##,##0.00";
    worksheet.getColumn("totalAmount").numFmt = "₹ #,##,##0.00";
    worksheet.getColumn("weightedAvg").numFmt = "₹ #,##,##0.00";
    worksheet.views = [{ state: "frozen", ySplit: 3 }];

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "Average Income Report.xlsx",
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      <div className="bg-white w-[1370px] h-[630px] p-4 rounded-xl relative">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold uppercase">
            Average Income — <span className="text-blue-600">HVM</span>
          </h2>

          <div className="flex gap-2 items-center">
            <div className="bg-gray-300 rounded-lg shadow-2xl flex gap-x-4 gap-1 p-2">
              <div className="w-24">
                <select
                  value={selectedYear || ""}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-2 py-1 text-xs border-2 rounded-md border-blue-600 transition-all duration-200"
                >
                  <option value="" disabled>
                    Select Year
                  </option>
                  {finYrData?.data?.map((y) => (
                    <option key={y.finYear} value={y.finYear}>
                      {y.finYear}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-24">
                <select
                  value={localCompany}
                  onChange={(e) => {
                    setLocalCompany(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-2 py-1 text-xs border-2 rounded-md border-blue-600 transition-all duration-200"
                >
                  <option value="HVM">HVM</option>
                </select>
              </div>
              <div className="w-72">
                <select
                  value={selectedItemGroup}
                  onChange={(e) => {
                    setSelectedItemGroup(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-2 py-1 text-xs border-2 rounded-md
               border-blue-600 transition-all duration-200"
                >
                  <option>Select Item Group</option>

                  {allItemGroups.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button className="text-red-600" onClick={closeTable}>
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* TOTALS */}
        <p className="text-xs font-semibold text-gray-600 flex gap-x-8">
          <span>Total Amount : {formatINR(totalTurnOver)}</span>
          {/* <span>
            Total Avg :{" "}
            {currentRecords[0]
              ? formatINR(currentRecords[0].groupAvg)
              : formatINR(0)}
          </span>{" "} */}
          <span>Total Avg: {formatINR(totalAvg)}</span>
        </p>

        {/* ✅ SEARCH — only itemName and uom, matching table columns */}
        <div className="flex justify-between items-start mt-2">
          <div className="flex gap-x-4 mb-3">
            {[{ key: "itemName", label: "Item Name" }].map(({ key, label }) => (
              <div key={key} className="relative">
                <input
                  type="text"
                  placeholder={`Search ${label}...`}
                  value={search[key] || ""}
                  onChange={(e) =>
                    setSearch({ ...search, [key]: e.target.value })
                  }
                  className="w-40 h-6 p-1 pl-8 text-gray-900 text-[11px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                />
                <FaSearch className="absolute left-2 top-1.5 text-gray-500 text-sm" />
              </div>
            ))}
          </div>

          {/* ✅ Min/Max filter on totalAmount */}
          <div className="flex gap-x-2">
            <div className="flex items-center text-[12px]">
              <span className="text-gray-500">Min amount:</span>
              <input
                type="text"
                value={netpayRange.min}
                onChange={(e) =>
                  setNetpayRange({
                    ...netpayRange,
                    min: Number(e.target.value),
                  })
                }
                className="w-24 h-6 p-1 border ml-1 border-gray-300 rounded-md text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center text-[12px]">
              <span className="text-gray-500">Max amount:</span>
              <input
                type="text"
                value={netpayRange.max === Infinity ? "" : netpayRange.max}
                onChange={(e) =>
                  setNetpayRange({
                    ...netpayRange,
                    max:
                      e.target.value === "" ? Infinity : Number(e.target.value),
                  })
                }
                className="w-24 h-6 p-1 border ml-1 border-gray-300 rounded-md text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={downloadExcel}
              className="p-0 rounded-full shadow-md hover:brightness-110 transition-all duration-300"
              title="Download Excel"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/732/732220.png"
                alt="Download Excel"
                className="w-7 h-7 rounded-lg"
              />
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="grid gap-4">
          <div
            className="overflow-x-auto h-[450px] border border-gray-300"
            style={{ border: "1px solid gray", borderRadius: "16px" }}
          >
            <table className="w-full border-collapse text-[11px] table-fixed">
              <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                <tr>
                  <th className="border p-1 text-center w-8">S.No</th>
                  <th className="border p-1 text-center w-76">Item Name</th>
                  <th className="border p-1 text-center w-36">
                    Total Invoice Qty
                  </th>
                  <th className="border p-1 text-center w-20">UOM</th>
                  <th className="border p-1 text-center w-24">Total Rate</th>
                  <th className="border p-1 text-center w-36">Total Amount</th>
                  <th className="border p-1 text-center w-32">Total Avg</th>
                  <th className="border p-1 text-center w-auto"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? (
                  <tr>
                    <td colSpan={8} className="text-center">
                      <div className="flex justify-center items-center pointer-events-none">
                        <SpinLoader />
                      </div>
                    </td>
                  </tr>
                ) : currentRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-gray-500">
                      No data found
                    </td>
                  </tr>
                ) : (
                  currentRecords.map((row, index) => {
                    const serialNo =
                      (currentPage - 1) * recordsPerPage + index + 1;
                    return (
                      <tr
                        key={index}
                        className="text-gray-800 bg-white even:bg-gray-100"
                      >
                        <td className="border p-1 text-center">{serialNo}</td>
                        <td className="border p-1 pr-2 text-left">
                          {row.itemName}
                        </td>
                        <td className="border p-1 pr-2 text-right">
                          {formatQtyByUOM(row.totalQty, row.uom)}
                        </td>
                        <td className="border p-1 pl-2 text-left">{row.uom}</td>
                        <td className="border p-1 pr-2 text-right">
                          {formatINR(row.avgRate)}
                        </td>
                        <td className="border p-1 pr-2 text-right text-sky-700">
                          {formatINR(row.totalAmount)}
                        </td>
                        <td className="border p-1 pr-2 text-right text-red-400">
                          {formatINR(row.weightedAvg)}
                        </td>
                        <td className="border p-1 pr-2 text-right text-sky-700"></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        <div
          className="flex justify-end items-center mt-4 space-x-2 text-[11px]"
          style={{ position: "absolute", bottom: "5px", right: "0px" }}
        >
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-md ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-gray-200"}`}
          >
            <FaStepBackward size={16} />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-md ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-gray-200"}`}
          >
            <FaChevronLeft size={16} />
          </button>
          <span className="text-xs font-semibold px-3">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-md ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-gray-200"}`}
          >
            <FaChevronRight size={16} />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-md ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-gray-200"}`}
          >
            <FaStepForward size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AverageIncomeTable;
