import { useUserSubscription } from "@/hooks/useUserSubscription";
import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function ClientDashboard() {
  const { data: userSubs } = useUserSubscription();
  const [showChart, setShowChart] = useState(true);

  const invoices = userSubs?.subscription.flatMap((sub) => sub.invoices) || [];

  const chartData = invoices.map((inv) => {
    return {
      date: new Date(inv.createdAt).toLocaleDateString(),
      amount: inv.amount,
      status: inv.paid ? "Paid" : "Pending",
    };
  });
  const renderSummaryItem = (title: string, count: number) => {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-x; font-semibold mb-2">{title}</h2>
        <p className="text-3xl font-bold text-green-600">
          {status === "pending" ? "Loading..." : count}
        </p>
      </div>
    );
  };
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {renderSummaryItem(
          "Active Subscription",
          userSubs?.subscription.filter((s) => s.status === "ACTIVE").length ||
            0
        )}
        {renderSummaryItem("Total Invoices", invoices.length)}
        {renderSummaryItem(
          "Total Spent",
          +invoices.reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)
        )}
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden mb-8">
        <h2 className="text-2xl font-bold p-6 border-b">Invoices</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((i) => (
                <tr key={i.id} className="hover:bg-gray50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    ${i.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        i.paid
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {i.paid ? "Paid" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {new Date(i.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold ">Pro Plan Invoices Chart</h2>
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
              onClick={() => setShowChart(!showChart)}
            >
              {showChart ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div>
          {showChart && status === "success" && (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3 "></CartesianGrid>
                <XAxis dataKey="date"></XAxis>
                <YAxis></YAxis>
                <Tooltip></Tooltip>
                <Legend></Legend>
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#8884d8"
                  name="Amount ($)"
                ></Line>
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
