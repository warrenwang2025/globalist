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
import { useEffect, useState } from "react";

const data = [
  { name: "Jan", total: 2400 },
  { name: "Feb", total: 1398 },
  { name: "Mar", total: 9800 },
  { name: "Apr", total: 3908 },
  { name: "May", total: 4800 },
  { name: "Jun", total: 3800 },
  { name: "Jul", total: 1300 },
  { name: "Aug", total: 1800 },
  { name: "Sep", total: 2300 },
  { name: "Oct", total: 4300 },
  { name: "Nov", total: 3600 },
  { name: "Dec", total: 4300 },
];

export function Overview() {
  const { theme, resolvedTheme } = useTheme();
  const [screenWidth, setScreenWidth] = useState(1200);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    if (typeof window !== "undefined") {
      setScreenWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const isDark =
    theme === "dark" || (theme === "system" && resolvedTheme === "dark");

  const textColor = isDark ? "#000000" : "#ffffff";
  const graphcolor = isDark ? "#ffffff" : "#000000";

  // Responsive settings for X-axis labels
  const getXAxisSettings = () => {
  if (screenWidth <= 480) {
    return { fontSize: 10, interval: 1 }; 
  } else if (screenWidth <= 1024) {
    return { fontSize: 11, interval: 1 }; 
  } else {
    return { fontSize: 12, interval: 0 }; 
  }
  };

  const { fontSize, interval } = getXAxisSettings();

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>

        <XAxis
          dataKey="name"
          stroke={graphcolor}
          fontSize={fontSize}
          interval={interval}
          tickLine={false}
          axisLine={false}
          tick={{ fill: graphcolor }}
        />
        <YAxis
          stroke={graphcolor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
          tick={{ fill: graphcolor }}
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
