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

interface Products {
  product: string;
  total: number;
}

const ProductBudget: React.FC<{products: Products[]}> = ({products}) => {
   
    return (<>
            <div className="rounded-xl p-6 text-center">
                <h3 className="font-semibold text-lg mb-2 text-green-400">
                  Productos más presupuestados
                </h3>
                <ResponsiveContainer width="100%" height={300} className="focus:outline-none">
                  <BarChart data={products}>
                    <XAxis dataKey="producto" tick={false} />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#e5e7eb" }}/>
                    <Legend />
                    <Bar dataKey="total" fill="#0088FE"   fillOpacity={1}
                         style={{ color: "#0088FE" }} name="Cantidad" barSize={40} activeBar={false}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
    </>)}

export default ProductBudget;