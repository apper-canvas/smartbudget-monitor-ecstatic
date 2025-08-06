import { motion } from "framer-motion";
import { formatCurrency, formatDate } from "@/utils/formatters";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const TransactionCard = ({ transaction, onEdit, onDelete }) => {
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
      "Salary": "Briefcase",
      "Freelance": "Laptop",
      "Investment": "TrendingUp",
      "Business": "Building",
      "Other Income": "Plus",
      "Other Expense": "Minus",
    };
    return iconMap[category] || "Circle";
  };

  const getCategoryColor = (category, type) => {
    if (type === "income") return "text-success-500 bg-success-50";
    
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
      <Card hover className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
<div className={`w-12 h-12 rounded-full flex items-center justify-center ${getCategoryColor(transaction.category_c || transaction.category, transaction.type_c || transaction.type)}`}>
              <ApperIcon name={getCategoryIcon(transaction.category_c || transaction.category)} className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{transaction.description_c || transaction.Name}</h3>
              <p className="text-sm text-gray-500">{transaction.category_c || transaction.category} • {formatDate(transaction.date_c || transaction.date)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className={`font-semibold ${(transaction.type_c || transaction.type) === "income" ? "text-success-600" : "text-error-600"}`}>
                {(transaction.type_c || transaction.type) === "income" ? "+" : "-"}{formatCurrency(Math.abs(transaction.amount_c || transaction.amount))}
              </p>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(transaction)}
                className="p-2"
              >
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(transaction.Id)}
                className="p-2 text-error-600 hover:bg-error-50"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TransactionCard;