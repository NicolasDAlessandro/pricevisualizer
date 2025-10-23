import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Rubro {
  rubro: string;
  total: number;
}

const COLORS = [
  "#00C49F", "#0088FE", "#FFBB28", "#FF8042", "#a855f7",
  "#F87171", "#60A5FA", "#34D399", "#F59E0B", "#6366F1"
];

const CategoryBudget: React.FC<{ rubros: Rubro[] }> = ({ rubros }) => {

  const data = rubros.map((item) => ({
    ...item,
    total: Number(item.total),
  }));

  const total = data.reduce((acc, item) => acc + item.total, 0);

  //  Filtrar rubros que representen más del 1% del total
  const filteredData = data.filter((item) => (item.total / total) * 100 >= 1);

  return (
    <div className="rounded-xl text-center bg-transparent">
      <h3 className="font-semibold text-lg mb-1 text-yellow-400 tracking-wide">
        Presupuestos por rubro
      </h3>

      <div className="-mt-2">
        <ResponsiveContainer
          width="100%"
          height={Math.min(900, 220 + filteredData.length * 28)} 
          className="focus:outline-none"
        >
          <PieChart>
            <Pie
              stroke="#0f172a"
              strokeWidth={2}
              data={filteredData}
              dataKey="total"
              nameKey="rubro"
              outerRadius={110}
              labelLine={(props) => {
                const { points, index } = props;
                const [start, end] = points;
                const dx = end.x - start.x;
                const dy = end.y - start.y;
                const len = Math.sqrt(dx * dx + dy * dy);
                const scale = (len + 70) / len;
                const newEnd = {
                  x: start.x + dx * scale,
                  y: start.y + dy * scale,
                };
                const color = COLORS[index % COLORS.length];
                return (
                  <path
                    d={`M${start.x},${start.y}L${newEnd.x},${newEnd.y}`}
                    stroke={color}
                    strokeWidth={1.8}
                    fill="none"
                  />
                );
              }}
              label={({ name, percent, index, cx, cy, midAngle, outerRadius }: any) => {
                // Mostrar solo si el porcentaje es >= 1%
                if (percent * 100 < 1) return null;

                const RADIAN = Math.PI / 180;
                const radius = outerRadius + 110;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                const color = COLORS[index % COLORS.length];
                return (
                  <text
                    x={x}
                    y={y}
                    fill={color}
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                    style={{
                      fontSize: "11px",
                      fontWeight: 500,
                      textShadow: "0 0 4px rgba(0,0,0,0.6)",
                    }}
                  >
                    {`${name}: ${(percent * 100).toFixed(1)}%`}
                  </text>
                );
              }}
            >
              {filteredData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#f1f5f9",
              }}
              itemStyle={{ color: "#facc15" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryBudget;
