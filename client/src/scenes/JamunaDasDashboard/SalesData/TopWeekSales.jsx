import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import {
  Card,
  CardHeader,
  CardContent,
  useTheme,
  Box,
  Typography,
} from "@mui/material";

import { useGetTopItemWeekQuery } from "../../../redux/service/jamunasDashboardService.js";
import FinYear from "../../../components/FinYear.js";
import TopWeekTable from "./TableData/TopWeek";
import SpinLoader from "../../../utils/spinLoader.js";

const TopWeekSales = ({
  yearFilter,
  setYearFilter,
  selectedCompany,
  finYrData,
  filterType,
  setFilterType,
}) => {
  const theme = useTheme();

  const [selectMonths, setSelectMonths] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [tableParams, setTableParams] = useState(null);
  const [selectedYear, setSelectedYear] = useState(yearFilter || "");
  const [selectedfilterType, setSelectedFilterType] = useState(
    filterType || "ALL",
  );
  const [valueType, setValueType] = useState("value");

  useEffect(() => {
    setSelectedYear(yearFilter);
  }, [yearFilter]);

  useEffect(() => {
    setSelectedFilterType(filterType);
  }, [filterType]);

  /* ---------- Formatters ---------- */
  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatQty = (value) =>
    Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatLabel = (value) =>
    valueType === "value" ? formatINR(value) : formatQty(value);

  /* ---------- API ---------- */
  const {
    data: response,
    isFetching,
    isLoading,
  } = useGetTopItemWeekQuery(
    {
      params: {
        selectedYear,
        selectedCompany,
        selectMonths,
        type: selectedfilterType,
        valueType,
      },
    },
    { skip: !selectedYear || !selectedCompany || !selectMonths },
  );

  /* ---------- Chart Data ---------- */
  const chartData = useMemo(() => {
    if (!Array.isArray(response?.data)) return [];

    return response.data.map((item, index) => ({
      name: `Week ${index + 1}`,
      y: valueType === "value" ? Number(item.totalSales) : Number(item.count),

      itemName: item.itemName,
      salesMonth: item.salesMonth || item.month, // ✅ FIXED
      company: item.company,
      salesYear: item.salesYear,
      uom: item.uom,
      weekStartDate: item.weekStartDate,
      weekEndDate: item.weekEndDate,
      weekName: item.weekName,
    }));
  }, [response, valueType]);

  /* ---------- Open Table ---------- */
  const handleOpenTable = useCallback((point) => {
    setTableParams({
      itemName: point.itemName,
      company: point.company,
      year: point.salesYear,
      month: point.salesMonth,
      // ✅ SAME KEYS
      weekStart: point.weekStartDate,
      weekEnd: point.weekEndDate,
      weekName: point.weekName,
    });
    setShowTable(true);
  }, []);

  /* ---------- ECharts Rose Options ---------- */
  const options = useMemo(
    () => ({
      tooltip: {
        trigger: "item",
        formatter: (params) => `
        <div>
          <b>${params.name}</b><br/>
          ${params.data.itemName || ""}<br/>
          <span style="color:#1976d2;font-weight:600;">
            ${formatLabel(params.value)}
          </span>
        </div>
      `,
      },

      legend: {
        bottom: 0,
        textStyle: { fontSize: 11 },
      },

      series: [
        {
          name: "Weekly Sales",
          type: "pie",
          radius: ["20%", "70%"],
          center: ["50%", "45%"],
          roseType: "radius", // 🌹 Rose chart

          itemStyle: {
            borderRadius: 6,
          },

          label: {
            show: true,
            fontSize: 13,
            fontWeight: "bold",
            formatter: (params) =>
              `${params.name}\n${formatLabel(params.value)}`,
          },

          data: chartData
            .sort((a, b) => a.y - b.y) // better visual
            .map((d) => ({
              value: d.y,
              name: d.name,
              itemName: d.itemName,
              month: d.salesMonth,
              company: d.company,
              year: d.salesYear,
              weekStartDate: d.weekStartDate,
              weekEndDate: d.weekEndDate,
              weekName: d.weekName, // ✅ ADD THIS
            })),
        },
      ],
    }),
    [chartData, valueType],
  );

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title={`Week wise Top Item sold in ${selectMonths || ""}`}
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        action={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mr: 2 }}>
            <Box sx={{ width: 150 }}>
              <FinYear
                selectedYear={selectedYear}
                selectmonths={selectMonths}
                setSelectmonths={setSelectMonths}
                autoBorder={true}
              />
            </Box>
          </Box>
        }
        sx={{
          p: 1,
          borderBottom: `2px solid ${theme.palette.divider}`,
        }}
      />

      <CardContent sx={{ position: "relative", minHeight: 420 }}>
        {(isLoading || isFetching) && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
              backgroundColor: "rgba(255,255,255,0.6)",
            }}
          >
            <SpinLoader />
          </div>
        )}

        {/* 🌹 Rose Chart */}
        <ReactECharts
          option={options}
          style={{ height: 380 }}
          onEvents={{
            click: (params) => {
              handleOpenTable({
                itemName: params.data.itemName,
                company: params.data.company,
                salesYear: params.data.year,
                salesMonth: params.data.month,
                // ✅ CORRECT KEYS
                weekStartDate: params.data.weekStartDate,
                weekEndDate: params.data.weekEndDate,
                weekName: params.data.weekName,
              });
            },
          }}
        />

        {/* Empty states */}


        {/* {!selectMonths && !isLoading && !isFetching && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 380,
            }}
          >
            <Typography sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
              Please select a month to view week-wise data.
            </Typography>
          </Box>
        )} */}
      </CardContent>

      {/* TABLE */}
      {showTable && tableParams && (
        <TopWeekTable
          year={tableParams.year}
          month={tableParams.month}
          item={tableParams.itemName}
          company={tableParams.company}
          selectedWeekStartDate={tableParams.weekStart}
          selectedWeekEnddate={tableParams.weekEnd}
          selectedWeekName={tableParams.weekName}
          chartData={chartData}
          weekOptions={[
            ...new Map(
              chartData
                .sort(
                  (a, b) =>
                    new Date(a.weekStartDate) - new Date(b.weekStartDate),
                )
                .map((d) => [
                  d.weekName,
                  {
                    weekName: d.weekName,
                    weekStartDate: d.weekStartDate,
                    weekEndDate: d.weekEndDate,
                  },
                ]),
            ).values(),
          ]}
          setSelectedYear={setSelectedYear}
          selectedYear={selectedYear}
          finYrData={finYrData}
          closeTable={() => {
            setShowTable(false);
            setTableParams(null);
            setSelectedYear(yearFilter);
            setSelectedFilterType(filterType);
          }}
          selectMonths={selectMonths}
          setSelectMonths={setSelectMonths}
          selectedfilterType={selectedfilterType}
          setSelectedFilterType={setSelectedFilterType}
          valueType={valueType}
          setValueType={setValueType}
        />
      )}
    </Card>
  );
};

export default TopWeekSales;
