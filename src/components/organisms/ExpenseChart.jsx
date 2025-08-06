import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";

const ExpenseChart = ({ transactions }) => {
  const [chartData, setChartData] = useState({ series: [], labels: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      processChartData();
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [transactions]);

  const processChartData = () => {
    const expenseTransactions = transactions.filter(t => t.type === "expense");
    
    if (expenseTransactions.length === 0) {
      setChartData({ series: [], labels: [] });
      return;
    }

    const categoryTotals = expenseTransactions.reduce((acc, transaction) => {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + Math.abs(transaction.amount);
      return acc;
    }, {});

    const sortedCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8);

    setChartData({
      series: sortedCategories.map(([, value]) => value),
      labels: sortedCategories.map(([category]) => category),
    });
  };

  const chartOptions = {
    chart: {
      type: "pie",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
      fontFamily: "Inter, sans-serif",
    },
    colors: [
      "#2563EB", "#7C3AED", "#DC2626", "#EA580C", 
      "#CA8A04", "#16A34A", "#0891B2", "#C2410C"
    ],
    labels: chartData.labels,
    legend: {
      position: "bottom",
      fontSize: "14px",
      fontWeight: 500,
      markers: {
        width: 12,
        height: 12,
        radius: 6,
      },
    },
    plotOptions: {
      pie: {
        size: 280,
        donut: {
          size: "0%",
        },
        dataLabels: {
          offset: -10,
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(1) + "%";
      },
      style: {
        fontSize: "12px",
        fontWeight: "600",
        colors: ["#ffffff"],
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        color: "#000",
        opacity: 0.45,
      },
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return "$" + value.toFixed(2);
        },
      },
      style: {
        fontSize: "14px",
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          plotOptions: {
            pie: {
              size: 240,
            },
          },
          legend: {
            position: "bottom",
            fontSize: "12px",
          },
        },
      },
    ],
  };

  if (loading) {
    return (
      <Card className="p-6 h-96">
        <Loading />
      </Card>
    );
  }

  if (chartData.series.length === 0) {
    return (
      <Card className="p-6 h-96 flex items-center justify-center">
        <Empty
          icon="PieChart"
          title="No expense data"
          description="Add some expense transactions to see your spending breakdown."
        />
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Expense Breakdown</h3>
        <div className="flex justify-center">
          <Chart
            options={chartOptions}
            series={chartData.series}
            type="pie"
            height={400}
            width="100%"
          />
        </div>
      </Card>
    </motion.div>
  );
};

export default ExpenseChart;