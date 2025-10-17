import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
interface Sellers {
  seller: string;
  total: number;
}

const SellerBudget: React.FC<{ sellers: Sellers[] }> = ({ sellers }) => {
  return (<>
          <div className="rounded-xl p-6 text-center">
            <h3 className="font-semibold text-lg mb-2 text-pink-400">
              Presupuestos por vendedor
            </h3>
            <ResponsiveContainer width="100%" height={300} className="focus:outline-none">
              <BarChart data={sellers}>
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip  contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#e5e7eb" }}/>
                <Legend />
                <Bar dataKey="total" fill="#00C49F" name="Presupuestos" barSize={40} activeBar={false}
                     fillOpacity={1} style={{ color: "#0088FE" }}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
  </>);
} 
export default SellerBudget;