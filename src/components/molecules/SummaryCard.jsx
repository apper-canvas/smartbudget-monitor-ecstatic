import { motion } from "framer-motion";
import { formatCurrency } from "@/utils/formatters";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const SummaryCard = ({ 
  title, 
  amount, 
  icon, 
  color = "primary", 
  trend,
  trendValue,
  index = 0 
}) => {
  const colorStyles = {
    primary: "text-primary-500 bg-primary-50",
    success: "text-success-500 bg-success-50",
    error: "text-error-500 bg-error-50",
    warning: "text-warning-500 bg-warning-50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card hover className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <motion.p 
              className="text-2xl font-bold text-gray-900"
              key={amount}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {formatCurrency(amount)}
            </motion.p>
            {trend && (
              <div className={`flex items-center mt-2 text-sm ${trend === "up" ? "text-success-600" : "text-error-600"}`}>
                <ApperIcon 
                  name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                  className="w-4 h-4 mr-1" 
                />
                {trendValue}
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorStyles[color]}`}>
            <ApperIcon name={icon} className="w-6 h-6" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default SummaryCard;