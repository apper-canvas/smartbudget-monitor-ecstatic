import { motion } from "framer-motion";
import { formatCurrency, formatPercentage } from "@/utils/formatters";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const BudgetCard = ({ budget, onEdit, onDelete }) => {
const monthlyLimit = budget.monthlyLimit_c || budget.monthlyLimit;
  const spent = budget.spent_c || budget.spent;
  const category = budget.category_c || budget.category;
  const percentage = monthlyLimit > 0 ? (spent / monthlyLimit) * 100 : 0;
  const remaining = monthlyLimit - spent;
  const isOverBudget = spent > monthlyLimit;

  const getCategoryIcon = (category) => {
    const iconMap = {
      "Food & Dining": "UtensilsCrossed",
      "Transportation": "Car",
      "Shopping": "ShoppingBag",
      "Entertainment": "Gamepad2",
      "Bills & Utilities": "Receipt",
      "Healthcare": "Heart",
      "Education": "BookOpen",
      "Travel": "Plane",
    };
    return iconMap[category] || "Circle";
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      "Food & Dining": "text-orange-500 bg-orange-50",
      "Transportation": "text-blue-500 bg-blue-50",
      "Shopping": "text-purple-500 bg-purple-50",
      "Entertainment": "text-pink-500 bg-pink-50",
      "Bills & Utilities": "text-yellow-500 bg-yellow-50",
      "Healthcare": "text-red-500 bg-red-50",
      "Education": "text-indigo-500 bg-indigo-50",
      "Travel": "text-cyan-500 bg-cyan-50",
    };
    return colorMap[category] || "text-gray-500 bg-gray-50";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getCategoryColor(category)}`}>
              <ApperIcon name={getCategoryIcon(category)} className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{category}</h3>
              <p className="text-sm text-gray-500">Monthly Budget</p>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(budget)}
              className="p-2"
            >
              <ApperIcon name="Edit2" className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(budget.Id)}
              className="p-2 text-error-600 hover:bg-error-50"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
<span className="text-gray-600">Spent</span>
            <span className={`font-semibold ${isOverBudget ? "text-error-600" : "text-gray-900"}`}>
              {formatCurrency(spent)}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Budget</span>
            <span className="font-semibold text-gray-900">{formatCurrency(monthlyLimit)}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${
                isOverBudget ? "bg-error-500" : percentage > 80 ? "bg-warning-500" : "bg-success-500"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(percentage, 100)}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>

          <div className="flex justify-between items-center">
            <span className={`text-sm font-medium ${
              isOverBudget ? "text-error-600" : percentage > 80 ? "text-warning-600" : "text-success-600"
            }`}>
{formatPercentage(spent, monthlyLimit)} used
            </span>
            <span className={`text-sm font-semibold ${
              remaining >= 0 ? "text-success-600" : "text-error-600"
            }`}>
              {remaining >= 0 ? formatCurrency(remaining) : `${formatCurrency(Math.abs(remaining))} over`}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default BudgetCard;