import React, { useEffect, useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Card,
  CardHeader,
  CardContent,
  useTheme,
  Box,
  IconButton,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useGetAverageIncomeQuery } from "../../../redux/service/jamunasDashboardService.js";
import AverageIncomeTable from "./TableData/AverageIncome.jsx";
import SpinLoader from "../../../utils/spinLoader";

const AverageIncome = ({
  yearFilter,
  selectedCompany,
  finYrData,
  filterType,
  setFilterType,
}) => {
  const theme = useTheme();
  const [showTable, setShowTable] = useState(false);
  const [tableParams, setTableParams] = useState(null);
  const [selectedYear, setSelectedYear] = useState(yearFilter || "");
  const [selectedfilterType, setSelectedFilterType] = useState(
    filterType || "ALL",
  );
  const [page, setPage] = useState(1);
  const LIMIT = 25;

  useEffect(() => {
    setSelectedYear(yearFilter);
  }, [yearFilter]);
  useEffect(() => {
    setSelectedFilterType(filterType);
  }, [filterType]);
  useEffect(() => {
    setPage(1);
  }, [selectedYear, selectedCompany, selectedfilterType]);

  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatCompact = (v) => {
    if (v >= 1e7) return `₹${(v / 1e7).toFixed(2)}Cr`;
    if (v >= 1e5) return `₹${(v / 1e5).toFixed(2)}L`;
    if (v >= 1e3) return `₹${(v / 1e3).toFixed(2)}K`;
    return `₹${Number(v).toFixed(2)}`;
  };

  const {
    data: response,
    isFetching,
    isLoading,
  } = useGetAverageIncomeQuery(
    {
      params: {
        selectedYear,
        selectedCompany,
        type: selectedfilterType,
        page,
        limit: LIMIT,
      },
    },
    { skip: !selectedYear || !selectedCompany },
  );

  const pagination = response?.pagination || {};
  const totalPages = pagination.totalPages || 1;
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  // ✅ Each bar has its own gradient stop pair (top → bottom)
  const BAR_THEMES = [
    { top: "#00f5c4", bottom: "#00a884" }, // teal
    { top: "#38b6ff", bottom: "#0077cc" }, // sky blue
    { top: "#b57bee", bottom: "#7b2fbe" }, // purple
    { top: "#ff7eb3", bottom: "#d63384" }, // pink
    { top: "#ffc75f", bottom: "#e07b00" }, // amber
    { top: "#ff6b6b", bottom: "#c0392b" }, // red
    { top: "#6ee7b7", bottom: "#059669" }, // emerald
    { top: "#93c5fd", bottom: "#2563eb" }, // indigo
    { top: "#fda4af", bottom: "#e11d48" }, // rose
    { top: "#86efac", bottom: "#16a34a" }, // green
  ];

  const chartData = useMemo(() => {
    if (!Array.isArray(response?.data)) return [];
    return response.data
      .filter((item) => Number(item.avg) > 0)
      .map((item, index) => {
        const t = BAR_THEMES[index % BAR_THEMES.length];
        return {
          name: item.itemGroup,
          y: Number(item.avg),
          itemGroup: item.itemGroup,
          // ✅ per-point gradient fill
          color: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, t.top],
              [1, t.bottom],
            ],
          },
          // ✅ glow shadow via borderColor trick
          borderColor: t.top,
        };
      });
  }, [response]);

  const allItemGroups = useMemo(() => {
    if (!Array.isArray(response?.data)) return [];
    const groups = [...new Set(response.data.map((r) => r.itemGroup))];
    return groups;
  }, [response?.data]);
  const categories = chartData.map((d) => d.name);

  const options = useMemo(
    () => ({
      chart: {
        type: "column",
        height: 400,
        backgroundColor: "transparent",
        style: { fontFamily: "inherit" },
        marginLeft: 50,
        marginRight: 50,
        // ✅ drop shadow on whole chart plot area for glow feel
        plotShadow: false,
      },

      title: { text: "" },
      credits: { enabled: false },
      legend: { enabled: false },

      xAxis: {
        categories,
        labels: {
          rotation: -40,
          style: { fontSize: "12px", color: "black" },
        },
        lineColor: "#e0e0e0",
        tickColor: "transparent",
        gridLineWidth: 0,
      },

      yAxis: {
        min: 0,
        title: { text: "" },
        gridLineColor: "rgba(0,0,0,0.06)",
        gridLineDashStyle: "Dash",
        labels: {
          style: { fontSize: "10px", color: "#888" },
          formatter() {
            return formatCompact(this.value);
          },
        },
      },

      tooltip: {
        useHTML: true,
        backgroundColor: "#fff",
        borderWidth: 0,
        borderRadius: 10,
        shadow: {
          color: "rgba(0,0,0,0.12)",
          offsetX: 0,
          offsetY: 4,
          opacity: 1,
          width: 16,
        },
        style: { padding: "0" },
        formatter() {
          const t = BAR_THEMES[this.point.index % BAR_THEMES.length];
          return `
          <div style="
            padding: 10px 14px;
            border-left: 4px solid ${t.top};
            border-radius: 8px;
            min-width: 160px;
          ">
            <div style="font-size:11px; color:#888; margin-bottom:4px;">${this.point.itemGroup}</div>
            <div style="font-size:14px; font-weight:700; color:#222;">
              ${formatINR(this.y)}
            </div>
          </div>
        `;
        },
      },

      plotOptions: {
        column: {
          borderRadius: 8, // ✅ rounded tops
          borderWidth: 0,
          pointPadding: 0.12,
          groupPadding: 0.1,
          cursor: "pointer",

          // ✅ glow effect via shadow on each bar
          shadow: {
            color: "rgba(0,180,255,0.18)",
            offsetX: 0,
            offsetY: 6,
            opacity: 1,
            width: 10,
          },

          dataLabels: {
            enabled: true,
            formatter() {
              return formatCompact(this.y);
            },
            style: {
              fontSize: "9px",
              fontWeight: "bold",
              color: "#555",
              textOutline: "none",
            },
            y: -4, // ✅ float label just above bar
          },

          states: {
            hover: {
              brightness: 0.08,
            },
          },

          point: {
            events: {
              click() {
                setTableParams({
                  itemGroup: this.itemGroup, // e.g. "CARPET"
                  company: selectedCompany, // e.g. "HVM"
                  year: selectedYear,
                });
                setShowTable(true);
              },
            },
          },
        },
      },

      series: [
        {
          name: "Avg Sales",
          data: chartData,
          colorByPoint: true,
        },
      ],
    }),
    [chartData, categories],
  );

  const arrowBtnSx = (visible, side) => ({
    display: visible ? "flex" : "none",
    position: "absolute",
    [side]: 2,
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(255,255,255,0.92)",
    boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
    color: "#1976d2",
    zIndex: 5,
    width: 28,
    height: 28,
    "&:hover": { backgroundColor: "#e3f2fd" },
    "&.Mui-disabled": { display: "none" },
  });

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title={`Average Income Item Group Wise on   ${selectedYear} Sales`}
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      />

      <CardContent sx={{ position: "relative", height: 430, px: 1, pt: 1 }}>
        {(isLoading || isFetching) && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
              backgroundColor: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
              borderRadius: "16px",
            }}
          >
            <SpinLoader />
          </div>
        )}

        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          immutable={false} // ✅ allows color re-render on page change
        />

        {/* Left arrow */}
        <IconButton
          size="small"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={!hasPrev || isFetching}
          sx={arrowBtnSx(hasPrev, "left")}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
        </IconButton>

        {/* Right arrow */}
        <IconButton
          size="small"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={!hasNext || isFetching}
          sx={arrowBtnSx(hasNext, "right")}
        >
          <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </CardContent>

      {showTable && tableParams && (
        <AverageIncomeTable
          itemGroupName={tableParams.itemGroup} // ✅ mapped to itemGroupName
          allItemGroups={allItemGroups}
          company={tableParams.company}
          year={tableParams.year}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          finYrData={finYrData}
          selectedfilterType={selectedfilterType}
          setSelectedFilterType={setSelectedFilterType}
          closeTable={() => {
            setShowTable(false);
            setTableParams(null);
            setSelectedYear(yearFilter);
            setSelectedFilterType(filterType);
          }}
        />
      )}
    </Card>
  );
};

export default AverageIncome;
