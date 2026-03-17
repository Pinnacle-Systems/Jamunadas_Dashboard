import React, { useCallback, useEffect, useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import SolidGauge from "highcharts/modules/solid-gauge";
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
import { useGetTopItemMonthQuery } from "../../../redux/service/jamunasDashboardService.js";
import FinYear from "../../../components/FinYear.js";
import TopMonthTable from "./TableData/TopMonthTable.jsx";
import SpinLoader from "../../../utils/spinLoader.js";

// Initialize Highcharts modules (safe to call multiple times)
if (typeof HighchartsMore === "function") HighchartsMore(Highcharts);
if (typeof SolidGauge === "function") SolidGauge(Highcharts);

const TopMonthSales = ({
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

  const {
    data: response,
    isFetching,
    isLoading,
  } = useGetTopItemMonthQuery(
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

  /* ---------- Single item data ---------- */
  const itemData = useMemo(() => {
    if (!Array.isArray(response?.data) || response.data.length === 0)
      return null;
    const item = response.data[0];
    return {
      itemName: item.itemName,
      value:
        valueType === "value" ? Number(item.totalSales) : Number(item.count),
      salesMonth: item.salesMonth,
      company: item.company,
      salesYear: item.salesYear,
      uom: item.uom,
    };
  }, [response, valueType]);

  /* ---------- Open table handler — defined BEFORE useMemo(options) ---------- */
  const handleOpenTable = useCallback(() => {
    if (!itemData) return;
    setTableParams({
      itemName: itemData.itemName,
      company: itemData.company,
      year: itemData.salesYear,
      month: itemData.salesMonth,
    });
    setShowTable(true);
  }, [itemData]);

  /* ---------- Gauge max ---------- */
  const gaugeMax = useMemo(() => {
    if (!itemData || itemData.value <= 0) return 100;
    const v = itemData.value;
    const magnitude = Math.pow(10, Math.floor(Math.log10(v)));
    return Math.ceil(v / magnitude) * magnitude * 1.25;
  }, [itemData]);

  const gaugePercent = useMemo(() => {
    if (!itemData || gaugeMax === 0) return 0;
    return Math.min((itemData.value / gaugeMax) * 100, 100);
  }, [itemData, gaugeMax]);

  /* ---------- SolidGauge chart options ---------- */
  const options = useMemo(
    () => ({
      chart: {
        type: "solidgauge",
        height: 320,
        backgroundColor: "transparent",
        margin: [0, 0, 0, 0],
        spacing: [10, 10, 10, 10],
      },
      title: { text: null },
      credits: { enabled: false },

      pane: {
        center: ["50%", "75%"],
        size: "130%",
        startAngle: -90,
        endAngle: 90,
        background: [
          {
            backgroundColor: "#e8eaf0",
            innerRadius: "60%",
            outerRadius: "100%",
            shape: "arc",
            borderWidth: 0,
          },
        ],
      },

      tooltip: { enabled: false },

      yAxis: {
        min: 0,
        max: gaugeMax,
        stops: [
          [0.1, "#4fc3f7"],
          [0.5, "#1976d2"],
          [0.9, "#6a1b9a"],
        ],
        lineWidth: 0,
        tickWidth: 0,
        minorTickInterval: null,
        tickAmount: 0,
        labels: { enabled: false },
      },

      plotOptions: {
        solidgauge: {
          innerRadius: "60%",
          cursor: "pointer",
          point: {
            events: {
              click: handleOpenTable, // ✅ now defined before this useMemo
            },
          },
          dataLabels: {
            enabled: true,
            borderWidth: 0,
            useHTML: true,
            y: -44,
            formatter() {
              const val =
                valueType === "value"
                  ? formatINR(this.y)
                  : `${formatQty(this.y)} ${itemData?.uom || ""}`;
              return `
                <div style="text-align:center;">
                  <div style="
                    font-size: 20px;
                    font-weight: 700;
                    color: #1976d2;
                    letter-spacing: -0.5px;
                  ">${val}</div>
                </div>`;
            },
          },
          animation: { duration: 1200 },
          rounded: true,
        },
      },

      series: [
        {
          name: valueType === "value" ? "Sales" : "Quantity",
          data: [itemData ? itemData.value : 0],
        },
      ],
    }),
    [gaugeMax, itemData, valueType, handleOpenTable], // ✅ handleOpenTable in deps
  );

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title={`Top Item sold in ${selectMonths || ""} `}
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        action={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mr: 2 }}>
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
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

        <Box sx={{ width: "100%", maxWidth: 400 }}>
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            immutable={false}
          />
        </Box>

        {/* Item name + meta — also clickable */}
        {itemData && (
          <Box
            sx={{
              mt: -4,
              textAlign: "center",
              px: 2,
              cursor: "pointer",
              "&:hover .item-label": { color: "#1976d2" },
            }}
            onClick={handleOpenTable}
          >
            <Typography
              className="item-label"
              sx={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#333",
                transition: "color 0.2s",
                maxWidth: 320,
                mx: "auto",
                lineHeight: 1.3,
              }}
            >
              {itemData.itemName}
            </Typography>
            <Typography
              sx={{ fontSize: "0.75rem", color: "text.secondary", mt: 0.4 }}
            >
              {itemData.salesMonth} &nbsp;·&nbsp; {itemData.company}
            </Typography>
          </Box>
        )}

        {!itemData && !isLoading && !isFetching && selectMonths && (
          <Typography sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
            No data available for selected filters.
          </Typography>
        )}
        {!selectMonths && !isLoading && !isFetching && (
          <Typography sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
            Please select a month to view data.
          </Typography>
        )}
      </CardContent>

      {showTable && tableParams && (
        <TopMonthTable
          year={tableParams.year}
          month={tableParams.month}
          item={tableParams.itemName}
          company={tableParams.company}
          itemOptions={[itemData?.itemName].filter(Boolean)}
          setSelectedYear={setSelectedYear}
          selectedYear={selectedYear}
          finYrData={finYrData}
          closeTable={() => {
            setShowTable(false);
            setTableParams(null);
            setSelectedYear(yearFilter);
            setSelectedFilterType(filterType);
            setValueType("value")
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

export default TopMonthSales;
