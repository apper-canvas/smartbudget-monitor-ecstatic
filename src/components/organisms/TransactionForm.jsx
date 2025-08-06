import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import { categoryService } from "@/services/api/categoryService";

const TransactionForm = ({ transaction, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
if (transaction) {
      setFormData({
        type: transaction.type_c || transaction.type,
        amount: Math.abs(transaction.amount_c || transaction.amount).toString(),
        category: transaction.category_c || transaction.category,
        description: transaction.description_c || transaction.Name,
        date: transaction.date_c || transaction.date,
      });
    }
  }, [transaction]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

const filteredCategories = categories.filter(cat => (cat.type_c || cat.type) === formData.type);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Please enter a description";
    }
    if (!formData.date) {
      newErrors.date = "Please select a date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const transactionData = {
        type: formData.type,
        amount: formData.type === "expense" ? -Math.abs(parseFloat(formData.amount)) : Math.abs(parseFloat(formData.amount)),
        category: formData.category,
        description: formData.description,
        date: formData.date,
      };

      await onSubmit(transactionData);
      toast.success(transaction ? "Transaction updated successfully!" : "Transaction added successfully!");
    } catch (error) {
      toast.error("Error saving transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    
    // Reset category when type changes
    if (field === "type" && formData.category) {
      setFormData(prev => ({ ...prev, category: "" }));
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Type"
          value={formData.type}
          onChange={handleChange("type")}
          error={errors.type}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </Select>

        <Input
          type="number"
          label="Amount"
          placeholder="0.00"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={handleChange("amount")}
          error={errors.amount}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Category"
          value={formData.category}
          onChange={handleChange("category")}
          error={errors.category}
        >
          <option value="">Select a category</option>
{filteredCategories.map((category) => (
            <option key={category.Id} value={category.Name || category.name}>
              {category.Name || category.name}
            </option>
          ))}
        </Select>

        <Input
          type="date"
          label="Date"
          value={formData.date}
          onChange={handleChange("date")}
          error={errors.date}
        />
      </div>

      <Input
        label="Description"
        placeholder="Enter transaction description"
        value={formData.description}
        onChange={handleChange("description")}
        error={errors.description}
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
          {loading ? "Saving..." : (transaction ? "Update Transaction" : "Add Transaction")}
        </Button>
      </div>
    </motion.form>
  );
};

export default TransactionForm;