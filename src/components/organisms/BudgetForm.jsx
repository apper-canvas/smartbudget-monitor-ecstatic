import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import { categoryService } from "@/services/api/categoryService";
import { getCurrentMonth } from "@/utils/formatters";

const BudgetForm = ({ budget, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    category: "",
    monthlyLimit: "",
    month: getCurrentMonth(),
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
    if (budget) {
      setFormData({
        category: budget.category,
        monthlyLimit: budget.monthlyLimit.toString(),
        month: budget.month,
      });
    }
  }, [budget]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      // Only show expense categories for budgets
      setCategories(data.filter(cat => cat.type === "expense"));
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    if (!formData.monthlyLimit || isNaN(formData.monthlyLimit) || parseFloat(formData.monthlyLimit) <= 0) {
      newErrors.monthlyLimit = "Please enter a valid budget amount";
    }
    if (!formData.month) {
      newErrors.month = "Please select a month";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const budgetData = {
        category: formData.category,
        monthlyLimit: parseFloat(formData.monthlyLimit),
        month: formData.month,
        spent: budget ? budget.spent : 0,
      };

      await onSubmit(budgetData);
      toast.success(budget ? "Budget updated successfully!" : "Budget created successfully!");
    } catch (error) {
      toast.error("Error saving budget");
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
      <Select
        label="Category"
        value={formData.category}
        onChange={handleChange("category")}
        error={errors.category}
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category.Id} value={category.name}>
            {category.name}
          </option>
        ))}
      </Select>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          type="number"
          label="Monthly Budget"
          placeholder="0.00"
          step="0.01"
          min="0"
          value={formData.monthlyLimit}
          onChange={handleChange("monthlyLimit")}
          error={errors.monthlyLimit}
        />

        <Input
          type="month"
          label="Month"
          value={formData.month}
          onChange={handleChange("month")}
          error={errors.month}
        />
      </div>

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
          {loading ? "Saving..." : (budget ? "Update Budget" : "Create Budget")}
        </Button>
      </div>
    </motion.form>
  );
};

export default BudgetForm;