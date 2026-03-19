import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import {
  Card, CardHeader, CardContent, useTheme, Box,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useGetSlowMovingItemsQuery } from "../../../redux/service/jamunasDashboardService.js";
import TopTenItemMonthWiseTable from "./TableData/TopTenItemrMonthTable.jsx";
import SpinLoader from "../../../utils/spinLoader";

const AGING_RANGES = [
  { label: "0–30", min: 0, max: 30 },
  { label: "31–60", min: 31, max: 60 },
  { label: "61–90", min: 61, max: 90 },
  { label: "91–120", min: 91, max: 120 },
  { label: "121–150", min: 121, max: 150 },
  { label: "151–180", min: 151, max: 180 },
  { label: "181–210", min: 181, max: 210 },
  { label: "211–240", min: 211, max: 240 },
  { label: "241–270", min: 241, max: 270 },
  { label: "271–300", min: 271, max: 300 },
  { label: "301+", min: 301, max: 99999 },
];

const SlowTypeDropdown = ({ slowType, setSlowType, autoBorder }) => (
  <select
    className={`${autoBorder
      ? "border-2 border-blue-600"
      : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      } p-1 w-32 h-6.5 text-gray-900 text-xs rounded-md`}
    value={slowType}
    onChange={(e) => setSlowType(e.target.value)}
  >
    <option value="">Select Type</option>
    <option value="AGING">Aging</option>
    <option value="VELOCITY">Velocity</option>
    <option value="DEADSTOCK">Dead Stock</option>
  </select>
);

/* ── Aging bucket items modal ─────────────────────────────────── */
const BucketModal = ({ open, onClose, bucket }) => {
  if (!bucket) return null;

  // colour the aging badge based on severity
  const agingColor = (days) => {
    const d = Number(days);
    if (d <= 60) return { bg: "#e8f5e9", color: "#2e7d32" };
    if (d <= 120) return { bg: "#fff8e1", color: "#f57f17" };
    if (d <= 180) return { bg: "#fff3e0", color: "#e65100" };
    return { bg: "#fce4ec", color: "#b71c1c" };
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
        },
      }}
    >
      {/* ── header ── */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg,#14c8d4 0%,#43eec6 100%)",
          color: "#fff",
          py: 1.5,
          px: 2.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
            Aging Bucket: {bucket.label} days
          </Typography>
          <Chip
            label={`${bucket.items.length} item${bucket.items.length !== 1 ? "s" : ""}`}
            size="small"
            sx={{
              backgroundColor: "rgba(255,255,255,0.25)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.72rem",
            }}
          />
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "#fff" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* ── body ── */}
      <DialogContent sx={{ p: 0 }}>
        <TableContainer component={Paper} elevation={0}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {["#", "Item Name", "Aging (Days)"].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      backgroundColor: "#f5f5f5",
                      color: "#333",
                      borderBottom: "2px solid #e0e0e0",
                      py: 1,
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {bucket.items.map((item, idx) => {
                const { bg, color } = agingColor(item.aging);
                return (
                  <TableRow
                    key={idx}
                    sx={{
                      "&:nth-of-type(even)": { backgroundColor: "#fafafa" },
                      "&:hover": { backgroundColor: "#e8fdfb" },
                    }}
                  >
                    <TableCell sx={{ fontSize: "0.75rem", color: "#999", width: 40 }}>
                      {idx + 1}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.8rem", fontWeight: 500, color: "#222" }}>
                      {item.itemName}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${item.aging}d`}
                        size="small"
                        sx={{
                          backgroundColor: bg,
                          color,
                          fontWeight: 700,
                          fontSize: "0.72rem",
                          height: 22,
                        }}
                      />
                    </TableCell>
                    {/* <TableCell sx={{ fontSize: "0.78rem", color: "#555" }}>
                      {item.company ?? "—"}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.78rem", color: "#555" }}>
                      {item.salesYear ?? "—"}
                    </TableCell> */}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      {/* ── footer ── */}
      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: "1px solid #eee" }}>
        <Typography variant="caption" sx={{ flex: 1, color: "#999" }}>
          Showing all {bucket.items.length} item{bucket.items.length !== 1 ? "s" : ""} in the {bucket.label}-day range
        </Typography>
        <Button
          onClick={onClose}
          variant="contained"
          size="small"
          sx={{
            background: "linear-gradient(135deg,#14c8d4,#43eec6)",
            color: "#fff",
            fontWeight: 600,
            borderRadius: "8px",
            textTransform: "none",
            boxShadow: "none",
            "&:hover": { opacity: 0.88, boxShadow: "none" },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/* ── Main component ───────────────────────────────────────────── */
const SlowMovement = ({
  yearFilter,
  selectedCompany,
  finYrData,
  filterType,
  setFilterType,
}) => {
  const theme = useTheme();
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  const [selectMonths, setSelectMonths] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [tableParams, setTableParams] = useState(null);
  const [selectedYear, setSelectedYear] = useState(yearFilter || "");
  const [selectedfilterType, setSelectedFilterType] = useState(filterType || "ALL");
  const [slowType, setSlowType] = useState("AGING");

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalBucket, setModalBucket] = useState(null);

  useEffect(() => { setSelectedYear(yearFilter); }, [yearFilter]);
  useEffect(() => { setSelectedFilterType(filterType); }, [filterType]);

  const { data: response, isFetching, isLoading } = useGetSlowMovingItemsQuery(
    { params: { selectedYear, selectedCompany, selectMonths, type: selectedfilterType } },
    { skip: !selectedYear || !selectedCompany }
  );

  const itemOptions = useMemo(() => {
    if (!Array.isArray(response?.data)) return [];
    return [...new Set(response.data.map((i) => i.itemName))];
  }, [response]);

  const grouped = useMemo(() => {
    if (!Array.isArray(response?.data)) return [];
    return AGING_RANGES.map((range) => {
      const items = response.data.filter(
        (item) => Number(item.aging) >= range.min && Number(item.aging) <= range.max
      );
      return { ...range, items };
    }).filter((g) => g.items.length > 0);
  }, [response]);

  const categories = useMemo(() => grouped.map((g) => g.label), [grouped]);

  const { barData, lineData, maxBar } = useMemo(() => {
    const barData = grouped.map((g) => g.items.length);
    const lineData = grouped.map((g) =>
      g.items.reduce((sum, i) => sum + Number(i.aging), 0)
    );
    const maxBar = Math.max(...barData, 1);
    return { barData, lineData, maxBar };
  }, [grouped]);

  const option = useMemo(() => ({
    backgroundColor: "#ffffff",
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter(params) {
        const idx = params[0]?.dataIndex;
        const g = grouped[idx];
        if (!g) return "";
        const lines = g.items
          .slice(0, 5)
          .map((i) => `• ${i.itemName} (${i.aging}d)`)
          .join("<br/>");
        const more = g.items.length > 5
          ? `<br/><span style="color:#14c8d4;font-style:italic;cursor:pointer">+${g.items.length - 5} more — click bar to see all</span>`
          : "";
        return `<b>${g.label} days</b><br/>${lines}${more}`;
      },
    },
    legend: {
      data: ["Item Count", "Aging Sum"],
      textStyle: { color: "#333" },
      top: 8,
    },
    xAxis: {
      data: categories,
      axisLine: { lineStyle: { color: "#999" } },
      axisLabel: { color: "#333", fontSize: 11 },
    },
    yAxis: [
      {
        name: "Items",
        nameTextStyle: { color: "#333", fontSize: 11 },
        splitLine: { show: false },
        axisLine: { lineStyle: { color: "#999" } },
        axisLabel: { color: "#333" },
      },
      {
        name: "Aging (days)",
        nameTextStyle: { color: "#f5a623", fontSize: 11 },
        splitLine: { show: false },
        axisLine: { lineStyle: { color: "#f5a623" } },
        axisLabel: { color: "#f5a623" },
        position: "right",
      },
    ],
    series: [
      {
        name: "Item Count",
        type: "bar",
        barWidth: 10,
        yAxisIndex: 0,
        itemStyle: {
          borderRadius: 5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#14c8d4" },
            { offset: 1, color: "#43eec6" },
          ]),
        },
        // show pointer cursor so users know it's clickable
        cursor: "pointer",
        data: barData,
        z: 2,
      },
      {
        name: "Item Count",
        type: "bar",
        barGap: "-100%",
        barWidth: 10,
        yAxisIndex: 0,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(20,200,212,0.5)" },
            { offset: 0.2, color: "rgba(20,200,212,0.2)" },
            { offset: 1, color: "rgba(20,200,212,0)" },
          ]),
        },
        z: -12,
        silent: true,
        tooltip: { show: false },
        data: barData.map(() => maxBar),
      },
      {
        name: "Item Count",
        type: "pictorialBar",
        symbol: "rect",
        itemStyle: { color: "#ffffff" },
        symbolRepeat: true,
        symbolSize: [12, 4],
        symbolMargin: 1,
        z: -10,
        yAxisIndex: 0,
        silent: true,
        tooltip: { show: false },
        data: barData.map(() => maxBar),
      },
      {
        name: "Aging Sum",
        type: "line",
        smooth: true,
        showAllSymbol: true,
        symbol: "emptyCircle",
        symbolSize: 15,
        yAxisIndex: 1,
        lineStyle: { color: "#f5a623", width: 2 },
        itemStyle: { color: "#f5a623" },
        data: lineData,
        z: 3,
      },
    ],
    grid: { top: 60, bottom: 40, left: 55, right: 65 },
  }), [categories, barData, lineData, grouped, maxBar]);

  // Click on the solid bar (seriesIndex 0) → open modal with all items in that bucket
  const onChartClick = (params) => {
    if (params.seriesIndex !== 0) return;
    const g = grouped[params.dataIndex];
    if (!g || g.items.length === 0) return;
    setModalBucket(g);
    setModalOpen(true);
  };

  return (
    <>
      <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1, border: "1px solid #e0e0e0" }}>
        <CardHeader
          title="Slow Movement Sale"
          titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600, color: "#333" } }}
          action={
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <SlowTypeDropdown slowType={slowType} setSlowType={setSlowType} autoBorder />
            </Box>
          }
          sx={{
            p: 1,
            borderBottom: "1px solid #e0e0e0",
            "& .MuiCardHeader-action": { alignSelf: "center", marginTop: -1, marginRight: 5 },
          }}
        />

        <CardContent
          ref={containerRef}
          sx={{
            position: "relative",
            minHeight: 420,
            width: "100%",
            boxSizing: "border-box",
            p: "8px !important",
          }}
        >
          {(isLoading || isFetching) && (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", justifyContent: "center", alignItems: "center",
              zIndex: 10,
              backgroundColor: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(2px)",
            }}>
              <SpinLoader />
            </div>
          )}

          <ReactECharts
            ref={chartRef}
            echarts={echarts}
            option={option}
            notMerge
            lazyUpdate
            style={{ width: "100%", height: 420 }}
            onEvents={{ click: onChartClick }}
          />
        </CardContent>
      </Card>

      {/* ── Bucket detail modal ── */}
      <BucketModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setModalBucket(null); }}
        bucket={modalBucket}
      />
    </>
  );
};

export default SlowMovement;
