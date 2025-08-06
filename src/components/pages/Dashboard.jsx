import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SummaryCard from "@/components/molecules/SummaryCard";
import TransactionCard from "@/components/molecules/TransactionCard";
import ExpenseChart from "@/components/organisms/ExpenseChart";
import TrendChart from "@/components/organisms/TrendChart";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { transactionService } from "@/services/api/transactionService";
import { budgetService } from "@/services/api/budgetService";
import { goalService } from "@/services/api/goalService";
import { calculateSavingsRate, getCurrentMonth, getMonthFromDate } from "@/utils/formatters";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [transactionsData, budgetsData, goalsData] = await Promise.all([
        transactionService.getAll(),
        budgetService.getAll(),
        goalService.getAll(),
      ]);
      setTransactions(transactionsData);
      setBudgets(budgetsData);
      setGoals(goalsData);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  // Calculate current month metrics
  const currentMonth = getCurrentMonth();
  const currentMonthTransactions = transactions.filter(t => getMonthFromDate(t.date) === currentMonth);
  
  const totalIncome = currentMonthTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = Math.abs(currentMonthTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0));
  
  const netIncome = totalIncome - totalExpenses;
  const savingsRate = calculateSavingsRate(totalIncome, totalExpenses);
  
  // Get recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5);
  
  // Calculate total budget usage
  const currentMonthBudgets = budgets.filter(b => b.month === currentMonth);
  const totalBudget = currentMonthBudgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
  const totalBudgetSpent = currentMonthBudgets.reduce((sum, b) => sum + b.spent, 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your financial health</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Income"
          amount={totalIncome}
          icon="TrendingUp"
          color="success"
          index={0}
        />
        <SummaryCard
          title="Total Expenses"
          amount={totalExpenses}
          icon="TrendingDown"
          color="error"
          index={1}
        />
        <SummaryCard
          title="Net Income"
          amount={netIncome}
          icon="DollarSign"
          color={netIncome >= 0 ? "success" : "error"}
          index={2}
        />
        <SummaryCard
          title="Savings Rate"
          amount={savingsRate}
          icon="PiggyBank"
          color="primary"
          index={3}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseChart transactions={transactions} />
        <TrendChart transactions={transactions} />
      </div>

      {/* Recent Transactions */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        
        {recentTransactions.length === 0 ? (
          <Empty
            icon="Receipt"
            title="No transactions yet"
            description="Start by adding your first income or expense transaction."
          />
        ) : (
          <div className="space-y-4">
            {recentTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <TransactionCard
                  transaction={transaction}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Budget & Goals Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Summary */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h3>
          {currentMonthBudgets.length === 0 ? (
            <p className="text-gray-500">No budgets set for this month</p>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Budget</span>
                <span className="font-semibold">${totalBudget.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Spent</span>
                <span className="font-semibold">${totalBudgetSpent.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  className={`h-3 rounded-full ${
                    totalBudgetSpent > totalBudget ? "bg-error-500" : 
                    (totalBudgetSpent / totalBudget) > 0.8 ? "bg-warning-500" : "bg-success-500"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((totalBudgetSpent / totalBudget) * 100, 100)}%` }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className={`font-medium ${
                  totalBudgetSpent > totalBudget ? "text-error-600" : "text-success-600"
                }`}>
                  {((totalBudgetSpent / totalBudget) * 100).toFixed(1)}% used
                </span>
                <span className={`font-semibold ${
                  totalBudget - totalBudgetSpent >= 0 ? "text-success-600" : "text-error-600"
                }`}>
                  ${Math.abs(totalBudget - totalBudgetSpent).toFixed(2)} {totalBudget - totalBudgetSpent >= 0 ? "remaining" : "over"}
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Goals Summary */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Goals</h3>
          {goals.length === 0 ? (
            <p className="text-gray-500">No savings goals set</p>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active Goals</span>
                <span className="font-semibold">{goals.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Target</span>
                <span className="font-semibold">${goals.reduce((sum, g) => sum + g.targetAmount, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Saved</span>
                <span className="font-semibold">${goals.reduce((sum, g) => sum + g.currentAmount, 0).toFixed(2)}</span>
              </div>
              {goals.slice(0, 2).map((goal, index) => (
                <div key={goal.Id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">{goal.name}</span>
                    <span className="text-sm text-gray-600">
                      {((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="h-2 rounded-full bg-primary-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;