import { motion } from "framer-motion";
import { formatCurrency, formatDate } from "@/utils/formatters";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const GoalCard = ({ goal, onEdit, onDelete, onAddMoney }) => {
const targetAmount = goal.targetAmount_c || goal.targetAmount;
  const currentAmount = goal.currentAmount_c || goal.currentAmount;
  const percentage = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;
  const remaining = targetAmount - currentAmount;
  const isCompleted = currentAmount >= targetAmount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isCompleted ? "text-success-500 bg-success-50" : "text-primary-500 bg-primary-50"
            }`}>
              <ApperIcon name={isCompleted ? "CheckCircle" : "Target"} className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{goal.Name || goal.name}</h3>
              <p className="text-sm text-gray-500">Due {formatDate(goal.deadline_c || goal.deadline)}</p>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddMoney(goal)}
              className="p-2 text-success-600 hover:bg-success-50"
              title="Add Money"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(goal)}
              className="p-2"
            >
              <ApperIcon name="Edit2" className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(goal.Id)}
              className="p-2 text-error-600 hover:bg-error-50"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
<span className="text-gray-600">Current</span>
            <span className="font-semibold text-gray-900">{formatCurrency(currentAmount)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Target</span>
            <span className="font-semibold text-gray-900">{formatCurrency(targetAmount)}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className={`h-3 rounded-full ${
                isCompleted ? "bg-success-500" : percentage > 75 ? "bg-primary-500" : "bg-primary-400"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(percentage, 100)}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>

          <div className="flex justify-between items-center">
            <span className={`text-sm font-medium ${
              isCompleted ? "text-success-600" : "text-primary-600"
            }`}>
              {percentage.toFixed(1)}% complete
            </span>
            <span className={`text-sm font-semibold ${
              isCompleted ? "text-success-600" : "text-gray-600"
            }`}>
              {isCompleted ? "Goal Reached!" : `${formatCurrency(remaining)} to go`}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default GoalCard;