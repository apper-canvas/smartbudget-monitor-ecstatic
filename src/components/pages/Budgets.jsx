import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { transactionService } from "@/services/api/transactionService";
import { budgetService } from "@/services/api/budgetService";
import ApperIcon from "@/components/ApperIcon";
import BudgetCard from "@/components/molecules/BudgetCard";
import BudgetForm from "@/components/organisms/BudgetForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Modal from "@/components/atoms/Modal";
import { getCurrentMonth, getMonthFromDate } from "@/utils/formatters";

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    updateBudgetSpentAmounts();
  }, [transactions, selectedMonth]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [budgetsData, transactionsData] = await Promise.all([
        budgetService.getAll(),
        transactionService.getAll(),
      ]);
      setBudgets(budgetsData);
      setTransactions(transactionsData);
    } catch (err) {
      setError("Failed to load budgets");
      console.error("Error loading budgets:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateBudgetSpentAmounts = async () => {
    if (budgets.length === 0 || transactions.length === 0) return;

const monthBudgets = budgets.filter(b => (b.month_c || b.month) === selectedMonth);
    
    for (const budget of monthBudgets) {
      const categoryExpenses = transactions.filter(t =>
        (t.type_c || t.type) === "expense" &&
        (t.category_c || t.category) === (budget.category_c || budget.category) &&
        getMonthFromDate(t.date_c || t.date) === selectedMonth
      );
      
      const totalSpent = categoryExpenses.reduce((sum, t) => sum + Math.abs(t.amount_c || t.amount), 0);
      
      if (totalSpent !== (budget.spent_c || budget.spent)) {
        try {
          await budgetService.updateSpentAmount(
            budget.category_c || budget.category, 
            selectedMonth, 
            totalSpent
          );
          setBudgets(prev => prev.map(b =>
            b.Id === budget.Id ? { ...b, spent_c: totalSpent, spent: totalSpent } : b
          ));
        } catch (error) {
          console.error("Error updating budget spent amount:", error);
        }
      }
    }
  };

  const handleCreateBudget = async (budgetData) => {
    try {
      const newBudget = await budgetService.create(budgetData);
      setBudgets(prev => [...prev, newBudget]);
      setShowForm(false);
      toast.success("Budget created successfully!");
    } catch (error) {
      toast.error("Failed to create budget");
    }
  };

  const handleEditBudget = async (budgetData) => {
    try {
      const updatedBudget = await budgetService.update(editingBudget.Id, budgetData);
      setBudgets(prev => prev.map(b => b.Id === editingBudget.Id ? updatedBudget : b));
      setEditingBudget(null);
      setShowForm(false);
      toast.success("Budget updated successfully!");
    } catch (error) {
      toast.error("Failed to update budget");
    }
  };

  const handleDeleteBudget = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;
    
    try {
      await budgetService.delete(id);
      setBudgets(prev => prev.filter(b => b.Id !== id));
      toast.success("Budget deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete budget");
    }
  };

  const openEditModal = (budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false);
    setEditingBudget(null);
  };

const filteredBudgets = budgets.filter(budget => (budget.month_c || budget.month) === selectedMonth);

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
          <p className="text-gray-600">Set and track your monthly spending limits</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Create Budget
        </Button>
      </div>

      {/* Month Selector */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Select Month:</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          {Array.from({ length: 12 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - 6 + i);
            const monthValue = date.toISOString().slice(0, 7);
            const monthLabel = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
            return (
              <option key={monthValue} value={monthValue}>
                {monthLabel}
              </option>
            );
          })}
        </select>
      </div>

      {/* Budget Summary */}
      {filteredBudgets.length > 0 && (
        <motion.div
          className="bg-white rounded-xl p-6 shadow-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Summary</h3>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                ${filteredBudgets.reduce((sum, b) => sum + (b.monthlyLimit_c || b.monthlyLimit), 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Budget</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-error-600">
                ${filteredBudgets.reduce((sum, b) => sum + (b.spent_c || b.spent), 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                filteredBudgets.reduce((sum, b) => sum + ((b.monthlyLimit_c || b.monthlyLimit) - (b.spent_c || b.spent)), 0) >= 0
                  ? "text-success-600"
                  : "text-error-600"
              }`}>
                ${filteredBudgets.reduce((sum, b) => sum + ((b.monthlyLimit_c || b.monthlyLimit) - (b.spent_c || b.spent)), 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Budgets Grid */}
      {filteredBudgets.length === 0 ? (
        <Empty
          icon="PieChart"
          title="No budgets for this month"
          description="Create your first budget to start tracking your spending limits."
          actionLabel="Create Budget"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBudgets.map((budget, index) => (
            <motion.div
              key={budget.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <BudgetCard
                budget={budget}
                onEdit={openEditModal}
                onDelete={handleDeleteBudget}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Budget Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={closeModal}
        title={editingBudget ? "Edit Budget" : "Create Budget"}
        size="lg"
      >
        <BudgetForm
          budget={editingBudget}
          onSubmit={editingBudget ? handleEditBudget : handleCreateBudget}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default Budgets;