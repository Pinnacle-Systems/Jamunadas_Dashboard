import React, { useCallback, useEffect, useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Card,
  CardHeader,
  CardContent,
  useTheme,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  Typography,
} from "@mui/material";
import { useGetTopItemWeekQuery } from "../../../redux/service/jamunasDashboardService.js";
import FinYear from "../../../components/FinYear.js";
import TopTenItemMonthWiseTable from "./TableData/TopTenItemrMonthTable.jsx";
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

  /* ---------- Chart data — one bar per week ---------- */
  const chartData = useMemo(() => {
    if (!Array.isArray(response?.data) || response.data.length === 0) return [];
    return response.data.map((item, index) => ({
      // Support both "Week 1" label from API or fallback
      name: item.weekLabel ?? item.week ?? `Week ${index + 1}`,
      y: valueType === "value" ? Number(item.totalSales) : Number(item.count),
      itemName: item.itemName,
      salesMonth: item.salesMonth,
      company: item.company,
      salesYear: item.salesYear,
      uom: item.uom,

      // Gradient blue shades per bar
    }));
  }, [response, valueType]);

  /* ---------- Open table handler ---------- */
  const handleOpenTable = useCallback((point) => {
    setTableParams({
      itemName: point.itemName,
      company: point.company,
      year: point.salesYear,
      month: point.salesMonth,
    });
    setShowTable(true);
  }, []);

  /* ---------- Chart options ---------- */
  const options = useMemo(
    () => ({
      chart: {
        type: "column",
        height: 380,
        backgroundColor: "#ffffff",
        style: { fontFamily: "inherit" },
      },

      title: { text: null },
      credits: { enabled: false },

      xAxis: {
        categories: chartData.map((d) => d.name),
        title: { text: "Week", style: { fontSize: "12px" } },
        labels: { style: { fontSize: "12px", fontWeight: "600" } },
        lineColor: "#e0e0e0",
        tickColor: "#e0e0e0",
      },

      yAxis: {
        min: 0,
        title: {
          text: valueType === "value" ? "Sales Value (₹)" : "Quantity",
          style: { fontSize: "12px" },
        },
        gridLineColor: "#f0f0f0",
        labels: { enabled: false },
      },

      tooltip: {
        useHTML: true,
        formatter() {
          return `
          <div style="padding:4px 8px;">
            <div style="font-weight:700; font-size:13px; margin-bottom:4px;">${this.point.name}</div>
            ${
              this.point.itemName
                ? `<div style="font-size:11px; color:#666; margin-bottom:2px;">${this.point.itemName}</div>`
                : ""
            }
            <div style="font-size:13px; color:#1976d2; font-weight:600;">
              ${formatLabel(this.y)}
            </div>
          </div>`;
        },
        backgroundColor: "#fff",
        borderColor: "#e0e0e0",
        borderRadius: 8,
        shadow: true,
      },

      plotOptions: {
        column: {
          cursor: "pointer",
          borderRadius: 6,
          borderWidth: 0,
          groupPadding: 0.15,
          pointPadding: 0.1,
          dataLabels: {
            enabled: true,
            useHTML: true,
            formatter() {
              const uom = this.point.options.uom || "";

              return `
    <span style="font-size:10px; font-weight:700; color:#333;">
      ${
        valueType === "quantity"
          ? `${formatQty(this.y)} ${uom}`
          : formatINR(this.y)
      }
    </span>
  `;
            },
            style: { textOutline: "none" },
          },
          states: {
            hover: {
              brightness: 0.1,
            },
          },
          point: {
            events: {
              click() {
                handleOpenTable(this);
              },
            },
          },
        },
      },

      series: [
        {
          name: valueType === "value" ? "Sales" : "Quantity",
          data: chartData,
          showInLegend: false,
          colorByPoint: true, // ✅ MAGIC LINE
        },
      ],

      legend: { enabled: false },
    }),
    [chartData, valueType, handleOpenTable],
  );

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title={`Week-wise Top Item in ${selectMonths || ""}`}
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        action={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mr: 2 }}>
            {/* Value / Quantity radio */}
            <FormControl component="fieldset">
              <RadioGroup
                row
                value={valueType}
                onChange={(e) => setValueType(e.target.value)}
                sx={{ gap: 0.5 }}
              >
                <FormControlLabel
                  value="value"
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: "#1976d2",
                        "&.Mui-checked": { color: "#1976d2" },
                        p: 0.5,
                      }}
                    />
                  }
                  label="Value"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontSize: "0.78rem",
                      fontWeight: valueType === "value" ? 600 : 400,
                      color:
                        valueType === "value" ? "#1976d2" : "text.secondary",
                    },
                    mr: 1.5,
                  }}
                />
                <FormControlLabel
                  value="quantity"
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: "#1976d2",
                        "&.Mui-checked": { color: "#1976d2" },
                        p: 0.5,
                      }}
                    />
                  }
                  label="Quantity"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontSize: "0.78rem",
                      fontWeight: valueType === "quantity" ? 600 : 400,
                      color:
                        valueType === "quantity" ? "#1976d2" : "text.secondary",
                    },
                    mr: 0,
                  }}
                />
              </RadioGroup>
            </FormControl>

            {/* Month dropdown */}
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
          "& .MuiCardHeader-action": {
            alignSelf: "center",
            marginTop: -1,
          },
        }}
      />

      <CardContent
        sx={{
          position: "relative",
          minHeight: 420,
          // backgroundColor: "#ffffff",
          pt: 2,
        }}
      >
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
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
            }}
          >
            <SpinLoader />
          </div>
        )}

        {/* Column chart */}
        {/* {chartData.length > 0 && ( */}
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          immutable={false}
        />
        {/* )} */}

        {/* Empty / prompt states */}
        {chartData.length === 0 &&
          !isLoading &&
          !isFetching &&
          selectMonths && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 380,
              }}
            >
              <Typography sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
                No data available for selected filters.
              </Typography>
            </Box>
          )}
        {!selectMonths && !isLoading && !isFetching && (
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
        )}
      </CardContent>

      {showTable && tableParams && (
        <TopTenItemMonthWiseTable
          year={tableParams.year}
          month={tableParams.month}
          item={tableParams.itemName}
          company={tableParams.company}
          itemOptions={[
            ...new Set(chartData.map((d) => d.itemName).filter(Boolean)),
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
        />
      )}
    </Card>
  );
};

export default TopWeekSales;
