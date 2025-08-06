import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Modal from "@/components/atoms/Modal";
import TransactionCard from "@/components/molecules/TransactionCard";
import TransactionForm from "@/components/organisms/TransactionForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { transactionService } from "@/services/api/transactionService";
import { budgetService } from "@/services/api/budgetService";
import { getMonthFromDate } from "@/utils/formatters";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [transactionsData, budgetsData] = await Promise.all([
        transactionService.getAll(),
        budgetService.getAll(),
      ]);
      setTransactions(transactionsData);
      setBudgets(budgetsData);
    } catch (err) {
      setError("Failed to load transactions");
      console.error("Error loading transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateBudgetSpent = async (transaction, isDelete = false) => {
    if (transaction.type !== "expense") return;
    
    const month = getMonthFromDate(transaction.date);
    const budget = budgets.find(b => b.category === transaction.category && b.month === month);
    
    if (budget) {
      const categoryTransactions = transactions.filter(t => 
        t.type === "expense" && 
        t.category === transaction.category && 
        getMonthFromDate(t.date) === month
      );
      
      let newSpent = categoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      if (isDelete) {
        newSpent -= Math.abs(transaction.amount);
      } else {
        // For new transactions, add the amount
        const existingTransaction = categoryTransactions.find(t => t.Id === transaction.Id);
        if (!existingTransaction) {
          newSpent += Math.abs(transaction.amount);
        }
      }
      
      await budgetService.updateSpentAmount(transaction.category, month, newSpent);
      
      // Update local budgets state
      setBudgets(prev => prev.map(b => 
        b.category === transaction.category && b.month === month 
          ? { ...b, spent: newSpent }
          : b
      ));
    }
  };

  const handleAddTransaction = async (transactionData) => {
    try {
      const newTransaction = await transactionService.create(transactionData);
      setTransactions(prev => [newTransaction, ...prev]);
      await updateBudgetSpent(newTransaction);
      setShowForm(false);
      toast.success("Transaction added successfully!");
    } catch (error) {
      toast.error("Failed to add transaction");
    }
  };

  const handleEditTransaction = async (transactionData) => {
    try {
      const updatedTransaction = await transactionService.update(editingTransaction.Id, transactionData);
      setTransactions(prev => prev.map(t => t.Id === editingTransaction.Id ? updatedTransaction : t));
      await updateBudgetSpent(updatedTransaction);
      setEditingTransaction(null);
      setShowForm(false);
      toast.success("Transaction updated successfully!");
    } catch (error) {
      toast.error("Failed to update transaction");
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    
    try {
      const transactionToDelete = transactions.find(t => t.Id === id);
      await transactionService.delete(id);
      setTransactions(prev => prev.filter(t => t.Id !== id));
      if (transactionToDelete) {
        await updateBudgetSpent(transactionToDelete, true);
      }
      toast.success("Transaction deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete transaction");
    }
  };

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filterType === "all") return true;
    return transaction.type === filterType;
  });

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">Manage your income and expenses</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {["all", "income", "expense"].map((type) => (
          <Button
            key={type}
            variant={filterType === type ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilterType(type)}
          >
            {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <Empty
          icon="Receipt"
          title="No transactions found"
          description={filterType === "all" 
            ? "Start by adding your first transaction to track your finances." 
            : `No ${filterType} transactions found. Try changing the filter or add a new transaction.`
          }
          actionLabel="Add Transaction"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <TransactionCard
                transaction={transaction}
                onEdit={openEditModal}
                onDelete={handleDeleteTransaction}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Transaction Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={closeModal}
        title={editingTransaction ? "Edit Transaction" : "Add Transaction"}
        size="lg"
      >
        <TransactionForm
          transaction={editingTransaction}
          onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default Transactions;