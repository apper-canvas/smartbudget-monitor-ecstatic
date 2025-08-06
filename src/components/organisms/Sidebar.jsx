import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = () => {
  const navigation = [
    { name: "Dashboard", to: "/", icon: "LayoutDashboard" },
    { name: "Transactions", to: "/transactions", icon: "Receipt" },
    { name: "Budgets", to: "/budgets", icon: "PieChart" },
    { name: "Goals", to: "/goals", icon: "Target" },
    { name: "Charts", to: "/charts", icon: "BarChart3" },
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-30">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-8 border-b border-gray-200">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
            <ApperIcon name="DollarSign" className="w-6 h-6 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-bold text-gray-900">SmartBudget</h1>
            <p className="text-sm text-gray-500">Personal Finance</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary-50 text-primary-700 border-r-2 border-primary-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <ApperIcon 
                      name={item.icon} 
                      className={cn(
                        "w-5 h-5 mr-3",
                        isActive ? "text-primary-600" : "text-gray-400"
                      )} 
                    />
                    {item.name}
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg p-4 text-white">
            <div className="flex items-center">
              <ApperIcon name="Lightbulb" className="w-8 h-8 text-white/80" />
              <div className="ml-3">
                <h3 className="text-sm font-semibold">Pro Tip</h3>
                <p className="text-xs text-white/80">Set realistic budgets to stay on track!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;