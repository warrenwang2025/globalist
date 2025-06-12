"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "next-themes";

const data = [
  {
    name: "Jan",
    total: 2400,
  },
  {
    name: "Feb",
    total: 1398,
  },
  {
    name: "Mar",
    total: 9800,
  },
  {
    name: "Apr",
    total: 3908,
  },
  {
    name: "May",
    total: 4800,
  },
  {
    name: "Jun",
    total: 3800,
  },
  {
    name: "Jul",
    total: 1300,
  },
  {
    name: "Aug",
    total: 1800,
  },
  {
    name: "Sep",
    total: 2300,
  },
  {
    name: "Oct",
    total: 4300,
  },
  {
    name: "Nov",
    total: 3600,
  },
  {
    name: "Dec",
    total: 4300,
  },
];

export function Overview() {
  const { theme, resolvedTheme } = useTheme();

  // Determine if we're in dark mode
  const isDark =
    theme === "dark" || (theme === "system" && resolvedTheme === "dark");

  // Set text colors based on theme
  const textColor = isDark ? "#000000" : "#ffffff";
  const graphcolor = isDark ? "#ffffff" : "#000000";
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          stroke={graphcolor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke={graphcolor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1f2937" : "#ffffff",
            border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
            borderRadius: "6px",
            color: isDark ? "#ffffff" : "#000000",
          }}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
