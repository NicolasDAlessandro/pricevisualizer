import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


interface Payments {
  payment: string;
  total: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a855f7"];

const PaymentBudget: React.FC<{payments: Payments[]}> = ({payments}) => {
    return (<>
              {/* --- Gráfico: formas de pago más usadas --- */}
              <div className="rounded-xl p-6 text-center">
                <h3 className="font-semibold text-lg mb-2 text-blue-400">
                  Formas de pago más usadas
                </h3>
                <ResponsiveContainer width="100%" height={Math.min(1000, 200 + payments.length * 30)} className="focus:outline-none">
                  <PieChart>
                    <Pie
                      stroke="#111827"
                      strokeWidth={3}
                      data={payments.map((item: any) => ({
                        ...item,
                        total: Number(item.total),
                      }))}
                      dataKey="total"
                      nameKey="forma_pago"
                      outerRadius={120}
                      //  Línea personalizada con color del sector
                      labelLine={(props) => {
                        const { points, index } = props;
                        const [start, end] = points;
        
                        // Dirección y línea
                        const dx = end.x - start.x;
                        const dy = end.y - start.y;
                        const len = Math.sqrt(dx * dx + dy * dy);
                        const scale = (len + 20) / len; // más largo
                        const newEnd = {
                          x: start.x + dx * scale,
                          y: start.y + dy * scale,
                        };
        
                        // Mismo color del sector
                        const color = COLORS[index % COLORS.length];
        
                        return (
                          <path
                            d={`M${start.x},${start.y}L${newEnd.x},${newEnd.y}`}
                            stroke={color}
                            strokeWidth={2}
                            fill="none"
                          />
                        );
                      }}
                      //  Etiqueta y color del sector
                      label={({ name, percent, index, cx, cy, midAngle, outerRadius }: any) => {
                        const RADIAN = Math.PI / 180;
                        const radius = outerRadius + 50; // distancia del texto
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
                            fontSize={12}
                            fontWeight="500"
                          >
                            {`${name} (${(percent * 100).toFixed(0)}%)`}
                          </text>
                        );
                      }}
                    >
                      {payments.map((_: any, index: number) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
        
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "none",
                        color: "#e5e7eb",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
    </>)
}
export default PaymentBudget;