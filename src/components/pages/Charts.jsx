import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ExpenseChart from "@/components/organisms/ExpenseChart";
import TrendChart from "@/components/organisms/TrendChart";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { transactionService } from "@/services/api/transactionService";

const Charts = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (err) {
      setError("Failed to load chart data");
      console.error("Error loading transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTransactions} />;

  if (transactions.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Charts & Analytics</h1>
          <p className="text-gray-600">Visualize your financial data with interactive charts</p>
        </div>
        <Empty
          icon="BarChart3"
          title="No data to display"
          description="Add some transactions to see your financial analytics and charts."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">Charts & Analytics</h1>
        <p className="text-gray-600">Visualize your financial data with interactive charts</p>
      </motion.div>

      {/* Charts Grid */}
      <div className="space-y-8">
        {/* Expense Breakdown Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ExpenseChart transactions={transactions} />
        </motion.div>

        {/* Income vs Expenses Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TrendChart transactions={transactions} />
        </motion.div>
      </div>

      {/* Chart Insights */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Expense Analysis</h4>
            <p>The pie chart shows your spending breakdown by category, helping you identify where most of your money goes each month.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Trend Analysis</h4>
            <p>The line chart displays your income and expenses over time, revealing patterns and trends in your financial behavior.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Charts;