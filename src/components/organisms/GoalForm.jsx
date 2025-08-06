import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const GoalForm = ({ goal, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name,
        targetAmount: goal.targetAmount.toString(),
        currentAmount: goal.currentAmount.toString(),
        deadline: goal.deadline,
      });
    }
  }, [goal]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter a goal name";
    }
    if (!formData.targetAmount || isNaN(formData.targetAmount) || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = "Please enter a valid target amount";
    }
    if (!formData.currentAmount || isNaN(formData.currentAmount) || parseFloat(formData.currentAmount) < 0) {
      newErrors.currentAmount = "Please enter a valid current amount";
    }
    if (!formData.deadline) {
      newErrors.deadline = "Please select a deadline";
    }

    const today = new Date().toISOString().split("T")[0];
    if (formData.deadline && formData.deadline <= today) {
      newErrors.deadline = "Deadline must be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const goalData = {
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount),
        deadline: formData.deadline,
      };

      await onSubmit(goalData);
      toast.success(goal ? "Goal updated successfully!" : "Goal created successfully!");
    } catch (error) {
      toast.error("Error saving goal");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Input
        label="Goal Name"
        placeholder="e.g., Emergency Fund, Vacation"
        value={formData.name}
        onChange={handleChange("name")}
        error={errors.name}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          type="number"
          label="Target Amount"
          placeholder="0.00"
          step="0.01"
          min="0"
          value={formData.targetAmount}
          onChange={handleChange("targetAmount")}
          error={errors.targetAmount}
        />

        <Input
          type="number"
          label="Current Amount"
          placeholder="0.00"
          step="0.01"
          min="0"
          value={formData.currentAmount}
          onChange={handleChange("currentAmount")}
          error={errors.currentAmount}
        />
      </div>

      <Input
        type="date"
        label="Deadline"
        value={formData.deadline}
        onChange={handleChange("deadline")}
        error={errors.deadline}
        min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
        >
          {loading ? "Saving..." : (goal ? "Update Goal" : "Create Goal")}
        </Button>
      </div>
    </motion.form>
  );
};

export default GoalForm;