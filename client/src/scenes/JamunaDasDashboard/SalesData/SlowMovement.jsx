import React, { useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import {
  useGetSlowMovingItemsQuery,
  useGetSlowMovingItemsByVelocityQuery,
  useGetDeadStockQuery,
} from "../../../redux/service/jamunasDashboardService.js";
import SpinLoader from "../../../utils/spinLoader";
import {
  FaTimes,
  FaSearch,
  FaStepBackward,
  FaStepForward,
  FaChevronLeft,
  FaChevronRight,
  FaSortAmountUp,
  FaSortAmountDown,
} from "react-icons/fa";

/* ── Constants ────────────────────────────────────────────────── */
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
  { label: "301-330", min: 301, max: 330 },
  { label: "331-360", min: 331, max: 360 },
  { label: "361-390", min: 361, max: 390 },
  { label: "391-420", min: 391, max: 420 },
  { label: "421-450", min: 421, max: 450 },
  { label: "451-480", min: 451, max: 480 },
  { label: "481+", min: 481, max: 9999 },
];

const CHART_HEIGHT = 420;
const RECORDS_PER_PAGE = 19;

/* ── Dropdown ─────────────────────────────────────────────────── */
const SlowTypeDropdown = ({ slowType, setSlowType, autoBorder }) => (
  <select
    className={`${
      autoBorder
        ? "border-2 border-blue-600"
        : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    } p-1 w-36 h-6.5 text-gray-900 text-xs rounded-md`}
    value={slowType}
    onChange={(e) => setSlowType(e.target.value)}
  >
    <option value="AGING">Aging</option>
    <option value="DEADSTOCK">Dead Stock</option>
  </select>
);

/* ── Aging color helper ───────────────────────────────────────── */
const agingBadgeStyle = (days) => {
  const d = Number(days);
  if (d <= 60) return { bg: "#e8f5e9", color: "#2e7d32" };
  if (d <= 120) return { bg: "#fff8e1", color: "#f57f17" };
  if (d <= 180) return { bg: "#fff3e0", color: "#e65100" };
  return { bg: "#fce4ec", color: "#b71c1c" };
};

/* ══════════════════════════════════════════════════════════════
   Bucket Modal — styled like the second file's table modal
══════════════════════════════════════════════════════════════ */
const BucketModal = ({ open, onClose, bucket }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc"); // null | "asc" | "desc"

  /* reset page & search whenever bucket changes */
  useEffect(() => {
    setSearch("");
    setCurrentPage(1);
    setSortOrder("asc");
  }, [bucket]);

  const filtered = useMemo(() => {
    if (!bucket?.items) return [];
    const q = search.trim().toLowerCase();
    let result = !q
      ? [...bucket.items]
      : bucket.items.filter((i) => i.itemName.toLowerCase().includes(q));

    if (sortOrder === "asc") {
      result = result.sort((a, b) => a.aging - b.aging);
    } else if (sortOrder === "desc") {
      result = result.sort((a, b) => b.aging - a.aging);
    }

    return result;
  }, [bucket, search, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / RECORDS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const currentRecords = filtered.slice(
    (safePage - 1) * RECORDS_PER_PAGE,
    safePage * RECORDS_PER_PAGE,
  );

  if (!open || !bucket) return null;

  const handleSort = (order) => {
    setSortOrder((prev) => (prev === order ? null : order));
    setCurrentPage(1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      <div className="bg-white w-[1370px] h-[634px] p-4 rounded-xl relative flex flex-col">
        {/* ── HEADER ── */}
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <h2 className="font-bold uppercase text-sm">
              Aging Bucket —{" "}
              <span className="text-blue-600">{bucket.label} days</span>
            </h2>
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {bucket.items.length} item{bucket.items.length !== 1 ? "s" : ""}
            </span>
          </div>
          <button className="text-red-600 hover:text-red-800" onClick={onClose}>
            <FaTimes size={16} />
          </button>
        </div>

        {/* ── SEARCH + SORT ── */}
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search item name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="h-6 p-1 pl-7 text-gray-900 text-[11px] border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm w-52"
            />
            <FaSearch className="absolute left-2 top-1.5 text-gray-400 text-[11px]" />
          </div>

          {/* ── SORT BUTTONS ── */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
              Aging:
            </span>
            <button
              onClick={() => handleSort("asc")}
              title="Sort Ascending (Lowest aging first)"
              className={`flex items-center gap-1 h-6 px-2 text-[10px] font-semibold rounded-md border transition-all
                ${
                  sortOrder === "asc"
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-gray-500 border-gray-300 hover:border-blue-400 hover:text-blue-600"
                }`}
            >
              <FaSortAmountUp size={9} />
              ASC
            </button>
            <button
              onClick={() => handleSort("desc")}
              title="Sort Descending (Highest aging first)"
              className={`flex items-center gap-1 h-6 px-2 text-[10px] font-semibold rounded-md border transition-all
                ${
                  sortOrder === "desc"
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-gray-500 border-gray-300 hover:border-blue-400 hover:text-blue-600"
                }`}
            >
              <FaSortAmountDown size={9} />
              DESC
            </button>
          </div>

          {search && (
            <span className="text-[11px] text-gray-500">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* ── TABLE ── */}
        <div className="flex-1 overflow-hidden">
          <div
            className="overflow-x-auto overflow-y-auto h-full border border-gray-300"
            style={{ borderRadius: "12px" }}
          >
            <table className="w-full border-collapse text-[11px] table-fixed">
              <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                <tr>
                  <th className="border p-1 text-center w-8">S.No</th>
                  <th className="border p-1 text-left w-80">Item Name</th>
                  <th className="border p-1 text-center w-28">
                    Aging (Days)
                    {sortOrder === "asc" && (
                      <FaSortAmountUp className="inline ml-1 text-blue-500" size={9} />
                    )}
                    {sortOrder === "desc" && (
                      <FaSortAmountDown className="inline ml-1 text-blue-500" size={9} />
                    )}
                  </th>
                  <th className="border p-1 text-center w-auto"></th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-400 text-xs">
                      No items found
                    </td>
                  </tr>
                ) : (
                  currentRecords.map((item, idx) => {
                    const { bg, color } = agingBadgeStyle(item.aging);
                    const serialNo = (safePage - 1) * RECORDS_PER_PAGE + idx + 1;
                    return (
                      <tr
                        key={idx}
                        className="text-gray-800 bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors"
                      >
                        <td className="border p-1 text-center text-gray-400">{serialNo}</td>
                        <td className="border p-1 pl-2 text-left font-medium">{item.itemName}</td>
                        <td className="border p-1 text-center">
                          <span
                            style={{ backgroundColor: bg, color }}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          >
                            {item.aging}d
                          </span>
                        </td>
                        <td className="border p-1 text-center text-gray-400"></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── PAGINATION ── */}
        <div className="flex justify-between items-center mt-2 text-[11px]">
          <span className="text-gray-400 text-xs">
            Showing {currentRecords.length} of {filtered.length} item
            {filtered.length !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={safePage === 1}
              className={`p-1.5 rounded-md ${safePage === 1 ? "text-gray-300 cursor-not-allowed" : "text-blue-600 hover:bg-gray-100"}`}
            >
              <FaStepBackward size={13} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={safePage === 1}
              className={`p-1.5 rounded-md ${safePage === 1 ? "text-gray-300 cursor-not-allowed" : "text-blue-600 hover:bg-gray-100"}`}
            >
              <FaChevronLeft size={13} />
            </button>
            <span className="text-xs font-semibold px-2">
              Page {safePage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={safePage === totalPages}
              className={`p-1.5 rounded-md ${safePage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-blue-600 hover:bg-gray-100"}`}
            >
              <FaChevronRight size={13} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={safePage === totalPages}
              className={`p-1.5 rounded-md ${safePage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-blue-600 hover:bg-gray-100"}`}
            >
              <FaStepForward size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Aging Chart ──────────────────────────────────────────────── */
const AgingChart = ({ response, onBarClick }) => {
  const grouped = useMemo(() => {
    if (!Array.isArray(response?.data)) return [];
    return AGING_RANGES.map((range) => {
      const items = response.data.filter(
        (item) =>
          Number(item.aging) >= range.min && Number(item.aging) <= range.max,
      );
      return { ...range, items };
    }).filter((g) => g.items.length > 0);
  }, [response]);

  const categories = useMemo(() => grouped.map((g) => g.label), [grouped]);
  const { barData, lineData, maxBar } = useMemo(() => {
    const barData = grouped.map((g) => g.items.length);
    const lineData = grouped.map((g) =>
      g.items.reduce((sum, i) => sum + Number(i.aging), 0),
    );
    const maxBar = Math.max(...barData, 1);
    return { barData, lineData, maxBar };
  }, [grouped]);

  const option = useMemo(
    () => ({
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
          const more =
            g.items.length > 5
              ? `<br/><span style="color:#14c8d4;font-style:italic">+${g.items.length - 5} more — click to see all</span>`
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
    }),
    [categories, barData, lineData, grouped, maxBar],
  );

  return (
    <ReactECharts
      echarts={echarts}
      option={option}
      notMerge
      lazyUpdate
      style={{ width: "100%", height: CHART_HEIGHT }}
      onEvents={{
        click: (params) => {
          if (params.seriesIndex !== 0) return;
          const g = grouped[params.dataIndex];
          if (g?.items.length) onBarClick(g);
        },
      }}
    />
  );
};

/* ── Low Velocity Horizontal Bar ─────────────────────────────── */
const LowVelocityChart = ({ data, onBarClick }) => {
  const sorted = useMemo(
    () =>
      [...(data || [])]
        .sort((a, b) => Number(a.velocity) - Number(b.velocity))
        .slice(0, 15),
    [data],
  );

  const option = useMemo(() => {
    const names = sorted.map((i) =>
      i.itemName.length > 20 ? i.itemName.slice(0, 19) + "…" : i.itemName,
    );
    const velocities = sorted.map((i) => Number(i.velocity));
    const agings = sorted.map((i) => Number(i.aging));
    return {
      backgroundColor: "#ffffff",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter(params) {
          const idx = params[0]?.dataIndex;
          const item = sorted[idx];
          if (!item) return "";
          return (
            `<b>${item.itemName}</b><br/>` +
            `Velocity: <b>${item.velocity} qty/day</b><br/>` +
            `Aging: <b>${item.aging}d</b><br/>` +
            `Stock: <b>${item.currentStock}</b><br/>` +
            `<span style="color:#1565c0;font-style:italic;font-size:11px">Click for full details</span>`
          );
        },
      },
      legend: {
        data: ["Velocity (qty/day)", "Aging (days)"],
        top: 4,
        right: 8,
        textStyle: { color: "#333", fontSize: 10 },
      },
      grid: { top: 32, bottom: 8, left: 8, right: 55, containLabel: true },
      xAxis: [
        {
          type: "value",
          name: "Velocity (qty/day)",
          nameTextStyle: { color: "#1565c0", fontSize: 10 },
          axisLabel: { color: "#555", fontSize: 9 },
          splitLine: { lineStyle: { type: "dashed", color: "#f0f0f0" } },
          axisLine: { show: false },
        },
        {
          type: "value",
          name: "Aging (d)",
          nameTextStyle: { color: "#e65100", fontSize: 10 },
          axisLabel: { color: "#e65100", fontSize: 9 },
          splitLine: { show: false },
          axisLine: { show: false },
          position: "top",
        },
      ],
      yAxis: {
        type: "category",
        data: names,
        axisLabel: {
          color: "#333",
          fontSize: 10,
          width: 120,
          overflow: "truncate",
        },
        axisLine: { lineStyle: { color: "#ddd" } },
        axisTick: { show: false },
      },
      series: [
        {
          name: "Velocity (qty/day)",
          type: "bar",
          xAxisIndex: 0,
          barWidth: 10,
          cursor: "pointer",
          itemStyle: {
            borderRadius: [0, 5, 5, 0],
            color: (params) => {
              const v = velocities[params.dataIndex];
              if (v === 0) return "#b0bec5";
              if (v < 0.05) return "#0d47a1";
              if (v < 0.15) return "#1565c0";
              if (v < 0.3) return "#1976d2";
              return "#42a5f5";
            },
          },
          label: {
            show: true,
            position: "right",
            color: "#333",
            fontSize: 9,
            formatter: (p) => Number(p.value).toFixed(4),
          },
          data: velocities,
        },
        {
          name: "Aging (days)",
          type: "bar",
          xAxisIndex: 1,
          barWidth: 4,
          barGap: "60%",
          cursor: "pointer",
          itemStyle: {
            borderRadius: [0, 3, 3, 0],
            color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
              { offset: 0, color: "#f5a623" },
              { offset: 1, color: "#e65100" },
            ]),
            opacity: 0.5,
          },
          data: agings,
        },
      ],
    };
  }, [sorted]);

  if (!sorted.length) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: CHART_HEIGHT,
          color: "#aaa",
          fontSize: "0.88rem",
        }}
      >
        No low velocity items found for the selected year.
      </Box>
    );
  }

  return (
    <ReactECharts
      echarts={echarts}
      option={option}
      notMerge
      lazyUpdate
      style={{ width: "100%", height: CHART_HEIGHT }}
      onEvents={{
        click: (params) => {
          const item = sorted[params.dataIndex];
          if (item) onBarClick(item, "VELOCITY");
        },
      }}
    />
  );
};

/* ── Dead Stock — Pill list ───────────────────────────────────── */
const PILL_COLORS = [
  "#993556",
  "#CC3F57",
  "#EA5151",
  "#FF7853",
  "#9A2555",
  "#6B1A3A",
  "#c0391b",
];

const DeadStockChart = ({ data }) => {
  const items = useMemo(
    () =>
      [...(data || [])].sort((a, b) => a.itemName.localeCompare(b.itemName)),
    [data],
  );

  if (!items.length) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: CHART_HEIGHT,
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            backgroundColor: "#fce4ec",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ fontSize: "1.1rem", lineHeight: 1 }}>✓</Typography>
        </Box>
        <Typography sx={{ color: "#aaa", fontSize: "0.88rem" }}>
          No dead stock items for this year
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 1.5, pt: 1, pb: 1 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
          flexWrap: "wrap",
          gap: 0.8,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              backgroundColor: "#b71c1c",
            }}
          />
          <Typography
            sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#b71c1c" }}
          >
            {items.length} dead stock item{items.length !== 1 ? "s" : ""}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: "0.68rem", color: "#bbb" }}>
          Items with no sales this financial year
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          height: CHART_HEIGHT - 56,
          overflowY: "auto",
          overflowX: "hidden",
          alignContent: "flex-start",
          pr: 0.5,
          "&::-webkit-scrollbar": { width: "3px" },
          "&::-webkit-scrollbar-track": { background: "#fce4ec" },
          "&::-webkit-scrollbar-thumb": {
            background: "#CC3F57",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": { background: "#9A2555" },
        }}
      >
        {items.map((item, idx) => {
          const dot = PILL_COLORS[idx % PILL_COLORS.length];
          return (
            <Box
              key={idx}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                backgroundColor: "#fce4ec",
                border: `1px solid ${dot}44`,
                borderRadius: "999px",
                px: 1.2,
                py: 0.4,
                cursor: "default",
                userSelect: "none",
              }}
            >
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  backgroundColor: dot,
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "#6B1A3A",
                  whiteSpace: "nowrap",
                  maxWidth: 200,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.itemName}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
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
  const [selectedYear, setSelectedYear] = useState(yearFilter || "");
  const [selectedfilterType, setSelectedFilterType] = useState(
    filterType || "ALL",
  );
  const [slowType, setSlowType] = useState("AGING");

  const [bucketModalOpen, setBucketModalOpen] = useState(false);
  const [bucketModalData, setBucketModalData] = useState(null);

  useEffect(() => setSelectedYear(yearFilter), [yearFilter]);
  useEffect(() => setSelectedFilterType(filterType), [filterType]);

  const skipBase = !selectedYear || !selectedCompany;

  const {
    data: agingResponse,
    isFetching: agingFetching,
    isLoading: agingLoading,
  } = useGetSlowMovingItemsQuery(
    { params: { selectedYear, selectedCompany, type: selectedfilterType } },
    { skip: skipBase || slowType !== "AGING" },
  );

  const {
    data: velocityResponse,
    isFetching: velFetching,
    isLoading: velLoading,
  } = useGetSlowMovingItemsByVelocityQuery(
    { params: { selectedYear } },
    { skip: !selectedYear || slowType !== "VELOCITY" },
  );

  const {
    data: deadStockResponse,
    isFetching: dsFetching,
    isLoading: dsLoading,
  } = useGetDeadStockQuery(
    { params: { selectedYear } },
    { skip: !selectedYear || slowType !== "DEADSTOCK" },
  );

  const isLoading =
    slowType === "AGING"
      ? agingLoading
      : slowType === "VELOCITY"
        ? velLoading
        : dsLoading;
  const isFetching =
    slowType === "AGING"
      ? agingFetching
      : slowType === "VELOCITY"
        ? velFetching
        : dsFetching;

  return (
    <>
      <Card
        sx={{
          backgroundColor: "#f5f5f5",
          mt: 1,
          ml: 1,
          border: "1px solid #e0e0e0",
        }}
      >
        <CardHeader
          title="Slow Movement Sale"
          titleTypographyProps={{
            sx: { fontSize: ".9rem", fontWeight: 600, color: "#333" },
          }}
          action={
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <SlowTypeDropdown
                slowType={slowType}
                setSlowType={setSlowType}
                autoBorder
              />
            </Box>
          }
          sx={{
            p: 1,
            borderBottom: "1px solid #e0e0e0",
            "& .MuiCardHeader-action": {
              alignSelf: "center",
              marginTop: -1,
              marginRight: 5,
            },
          }}
        />

        <CardContent
          sx={{
            position: "relative",
            minHeight: CHART_HEIGHT,
            width: "100%",
            boxSizing: "border-box",
            p: "8px !important",
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
                backgroundColor: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(2px)",
              }}
            >
              <SpinLoader />
            </div>
          )}

          {slowType === "AGING" && (
            <AgingChart
              response={agingResponse}
              onBarClick={(bucket) => {
                setBucketModalData(bucket);
                setBucketModalOpen(true);
              }}
            />
          )}

          {slowType === "VELOCITY" && (
            <LowVelocityChart
              data={velocityResponse?.data}
              onBarClick={() => {}}
            />
          )}

          {slowType === "DEADSTOCK" && (
            <DeadStockChart data={deadStockResponse?.data} />
          )}
        </CardContent>
      </Card>

      {/* ── Bucket modal — full screen overlay ── */}
      <BucketModal
        open={bucketModalOpen}
        onClose={() => {
          setBucketModalOpen(false);
          setBucketModalData(null);
        }}
        bucket={bucketModalData}
      />
    </>
  );
};

export default SlowMovement;
