import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Modal from "@/components/atoms/Modal";
import GoalCard from "@/components/molecules/GoalCard";
import GoalForm from "@/components/organisms/GoalForm";
import AddMoneyForm from "@/components/organisms/AddMoneyForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { goalService } from "@/services/api/goalService";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await goalService.getAll();
      setGoals(data);
    } catch (err) {
      setError("Failed to load goals");
      console.error("Error loading goals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (goalData) => {
    try {
      const newGoal = await goalService.create(goalData);
      setGoals(prev => [...prev, newGoal].sort((a, b) => new Date(a.deadline) - new Date(b.deadline)));
      setShowForm(false);
      toast.success("Goal created successfully!");
    } catch (error) {
      toast.error("Failed to create goal");
    }
  };

  const handleEditGoal = async (goalData) => {
    try {
      const updatedGoal = await goalService.update(editingGoal.Id, goalData);
      setGoals(prev => prev.map(g => g.Id === editingGoal.Id ? updatedGoal : g)
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline)));
      setEditingGoal(null);
      setShowForm(false);
      toast.success("Goal updated successfully!");
    } catch (error) {
      toast.error("Failed to update goal");
    }
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;
    
    try {
      await goalService.delete(id);
      setGoals(prev => prev.filter(g => g.Id !== id));
      toast.success("Goal deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete goal");
    }
  };

  const handleAddMoney = async (updatedGoal) => {
    try {
      const savedGoal = await goalService.update(updatedGoal.Id, updatedGoal);
      setGoals(prev => prev.map(g => g.Id === updatedGoal.Id ? savedGoal : g));
      setShowAddMoney(false);
      setSelectedGoal(null);
    } catch (error) {
      throw error;
    }
  };

  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const openAddMoneyModal = (goal) => {
    setSelectedGoal(goal);
    setShowAddMoney(true);
  };

  const closeModals = () => {
    setShowForm(false);
    setShowAddMoney(false);
    setEditingGoal(null);
    setSelectedGoal(null);
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadGoals} />;

  // Calculate totals
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Savings Goals</h1>
          <p className="text-gray-600">Track your progress towards financial objectives</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Create Goal
        </Button>
      </div>

      {/* Goals Summary */}
      {goals.length > 0 && (
        <motion.div
          className="bg-white rounded-xl p-6 shadow-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Goals Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{goals.length}</div>
              <div className="text-sm text-gray-600">Total Goals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">{completedGoals}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                ${totalTarget.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Target</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">
                ${totalSaved.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Saved</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <Empty
          icon="Target"
          title="No savings goals yet"
          description="Create your first savings goal to start working towards your financial objectives."
          actionLabel="Create Goal"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, index) => (
            <motion.div
              key={goal.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <GoalCard
                goal={goal}
                onEdit={openEditModal}
                onDelete={handleDeleteGoal}
                onAddMoney={openAddMoneyModal}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Goal Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={closeModals}
        title={editingGoal ? "Edit Goal" : "Create Goal"}
        size="lg"
      >
        <GoalForm
          goal={editingGoal}
          onSubmit={editingGoal ? handleEditGoal : handleCreateGoal}
          onCancel={closeModals}
        />
      </Modal>

      {/* Add Money Modal */}
      <Modal
        isOpen={showAddMoney}
        onClose={closeModals}
        title="Add Money to Goal"
        size="md"
      >
        {selectedGoal && (
          <AddMoneyForm
            goal={selectedGoal}
            onSubmit={handleAddMoney}
            onCancel={closeModals}
          />
        )}
      </Modal>
    </div>
  );
};

export default Goals;