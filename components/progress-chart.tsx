"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DataPoint {
  date: string
  ocena: number
  temat: string | null
}

interface Props {
  data: DataPoint[]
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: "oklch(0.11 0 0)",
      border: "1px solid oklch(1 0 0 / 0.1)",
      borderRadius: "8px",
      padding: "10px 14px",
    }}>
      <p style={{ color: "oklch(0.98 0 0)", fontSize: "13px", fontWeight: 500 }}>
        {payload[0]?.value}%
      </p>
      <p style={{ color: "oklch(0.65 0 0)", fontSize: "11px" }}>{label}</p>
      {payload[0]?.payload?.temat && (
        <p style={{ color: "oklch(0.65 0 0)", fontSize: "11px" }}>{payload[0].payload.temat}</p>
      )}
    </div>
  )
}

export function ProgressChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-white/30 text-sm">Brak ocen do wyświetlenia.</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
        <XAxis
          dataKey="date"
          tick={{ fill: "oklch(0.65 0 0)", fontSize: 11 }}
          axisLine={{ stroke: "oklch(1 0 0 / 0.1)" }}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: "oklch(0.65 0 0)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} cursor={false} />
        <Line
          type="monotone"
          dataKey="ocena"
          stroke="oklch(0.75 0.25 220)"
          strokeWidth={2}
          dot={{ fill: "oklch(0.75 0.25 220)", r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: "oklch(0.85 0.22 180)" }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
