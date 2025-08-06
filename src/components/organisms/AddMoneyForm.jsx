import { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const AddMoneyForm = ({ goal, onSubmit, onCancel }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const newCurrentAmount = goal.currentAmount + parseFloat(amount);
      await onSubmit({ ...goal, currentAmount: newCurrentAmount });
      toast.success("Money added to goal successfully!");
    } catch (error) {
      toast.error("Error adding money to goal");
    } finally {
      setLoading(false);
    }
  };

  const remainingAmount = goal.targetAmount - goal.currentAmount;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center py-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{goal.name}</h3>
        <div className="text-sm text-gray-600">
          <p>Current: <span className="font-medium">${goal.currentAmount.toFixed(2)}</span></p>
          <p>Target: <span className="font-medium">${goal.targetAmount.toFixed(2)}</span></p>
          <p>Remaining: <span className="font-medium text-primary-600">${remainingAmount.toFixed(2)}</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="number"
          label="Amount to Add"
          placeholder="0.00"
          step="0.01"
          min="0.01"
          max={remainingAmount.toFixed(2)}
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError("");
          }}
          error={error}
        />

        <div className="flex justify-end space-x-3">
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
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Money"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddMoneyForm;