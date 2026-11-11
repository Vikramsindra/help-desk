import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import EmptyState from "../common/EmptyState";

export default function StatsChart({
  data = [],
  dataKey = "count",
  title = "Ticket activity",
}) {
  if (!data.length)
    return (
      <EmptyState
        title="No chart data"
        description="Statistics will appear when ticket data is available."
      />
    );
  return (
    <section
      className="rounded-lg border border-line bg-white p-4 sm:p-5"
      aria-label={title}
    >
      <h2 className="mb-4 text-sm font-semibold text-ink">{title}</h2>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 4, left: -20 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--line)"
              strokeDasharray="3 4"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 11 }}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 11 }}
            />
            <Tooltip cursor={{ fill: "var(--mist)" }} />
            <Bar
              dataKey={dataKey}
              fill="var(--brand)"
              radius={[4, 4, 0, 0]}
              maxBarSize={42}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
