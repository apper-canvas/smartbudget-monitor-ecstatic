import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { motion } from "framer-motion";
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from "date-fns";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";

const TrendChart = ({ transactions }) => {
  const [chartData, setChartData] = useState({ series: [], categories: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      processChartData();
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [transactions]);

  const processChartData = () => {
    if (transactions.length === 0) {
      setChartData({ series: [], categories: [] });
      return;
    }

    // Get last 6 months including current month
    const now = new Date();
    const startDate = startOfMonth(subMonths(now, 5));
    const endDate = endOfMonth(now);
    
    const months = eachMonthOfInterval({ start: startDate, end: endDate });
    
    const monthlyData = months.map(month => {
      const monthKey = format(month, "yyyy-MM");
      const monthTransactions = transactions.filter(transaction => {
        const transactionMonth = format(parseISO(transaction.date), "yyyy-MM");
        return transactionMonth === monthKey;
      });

      const income = monthTransactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = Math.abs(monthTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0));

      return {
        month: format(month, "MMM yyyy"),
        income,
        expenses,
      };
    });

    setChartData({
      series: [
        {
          name: "Income",
          data: monthlyData.map(d => d.income),
          color: "#10B981",
        },
        {
          name: "Expenses",
          data: monthlyData.map(d => d.expenses),
          color: "#EF4444",
        },
      ],
      categories: monthlyData.map(d => d.month),
    });
  };

  const chartOptions = {
    chart: {
      type: "line",
      height: 400,
      fontFamily: "Inter, sans-serif",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    colors: ["#10B981", "#EF4444"],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: 500,
          colors: "#6B7280",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return "$" + value.toFixed(0);
        },
        style: {
          fontSize: "12px",
          fontWeight: 500,
          colors: "#6B7280",
        },
      },
    },
    grid: {
      borderColor: "#F3F4F6",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "14px",
      fontWeight: 500,
      markers: {
        width: 12,
        height: 12,
        radius: 6,
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
          chart: {
            height: 300,
          },
          legend: {
            position: "bottom",
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

  if (chartData.series.length === 0 || chartData.series.every(s => s.data.every(d => d === 0))) {
    return (
      <Card className="p-6 h-96 flex items-center justify-center">
        <Empty
          icon="TrendingUp"
          title="No trend data"
          description="Add some transactions to see your income and expense trends."
        />
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Income vs Expenses Trend</h3>
        <Chart
          options={chartOptions}
          series={chartData.series}
          type="line"
          height={400}
        />
      </Card>
    </motion.div>
  );
};

export default TrendChart;