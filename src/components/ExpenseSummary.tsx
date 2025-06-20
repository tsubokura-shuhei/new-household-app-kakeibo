import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  TrendingUp,
  Calendar,
  PieChart as PieChartIcon,
  BarChart3,
} from "lucide-react";
import { ExpenseSummary as ExpenseSummaryType, MonthlyData } from "../types";
import { ExpenseFilters, Expense } from "../types";

interface ExpenseSummaryProps {
  categorySummary: ExpenseSummaryType[];
  monthlyData: MonthlyData[];
  totalAmount: number;
  filters: ExpenseFilters;
  expenses: Expense[];
}

export function ExpenseSummary({
  categorySummary,
  monthlyData,
  totalAmount,
  filters,
  expenses,
}: ExpenseSummaryProps) {
  const [activeTab, setActiveTab] = useState<"category" | "monthly" | "weekly">(
    "category"
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ja-JP").format(amount) + "円";
  };

  interface CustomTooltipProps {
    active?: boolean;
    payload?: {
      value: number;
      name?: string;
    }[];
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-800 dark:text-white">{label}</p>
          <p className="text-primary-600 dark:text-primary-400">
            金額: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // 週別グラフ用データ生成
  const showWeekly = Boolean(filters.year && filters.month);
  let weeklyData: { week: string; amount: number; dateRange: string }[] = [];
  if (showWeekly) {
    const year = Number(filters.year);
    const month = Number(filters.month);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const weeks: { start: Date; end: Date }[] = [];
    let currentDate = new Date(firstDay);

    // 週の開始日と終了日を計算
    while (currentDate <= lastDay) {
      const weekStart = new Date(currentDate);
      const weekEnd = new Date(currentDate);
      weekEnd.setDate(weekEnd.getDate() + 6);
      if (weekEnd > lastDay) {
        weekEnd.setTime(lastDay.getTime());
      }
      weeks.push({ start: weekStart, end: weekEnd });
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 7));
    }

    // 各週のデータを集計
    weeklyData = weeks.map((week, index) => {
      const weekExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= week.start && expenseDate <= week.end;
      });

      const total = weekExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      const formatDate = (date: Date) => {
        return `${date.getMonth() + 1}月${date.getDate()}日`;
      };
      const dateRange = `${formatDate(week.start)}〜${formatDate(week.end)}`;

      return {
        week: `${index + 1}週目`,
        amount: total,
        dateRange,
      };
    });
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-500" />
          支出サマリー
        </h3>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">合計支出</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalAmount)}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("category")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "category"
              ? "bg-primary-500 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <PieChartIcon className="w-4 h-4" />
          カテゴリ別
        </button>
        <button
          onClick={() => setActiveTab("monthly")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "monthly"
              ? "bg-primary-500 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          月別
        </button>
        {showWeekly && (
          <button
            onClick={() => setActiveTab("weekly")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "weekly"
                ? "bg-primary-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            週間別
          </button>
        )}
      </div>

      {activeTab === "category" && categorySummary.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 flex flex-col">
            <div className="font-semibold text-gray-800 dark:text-white mb-2">
              カテゴリ別（円グラフ）
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySummary}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={40}
                  paddingAngle={2}
                  dataKey="amount"
                  nameKey="category"
                >
                  {categorySummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), "金額"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="h-80 flex flex-col">
            <div className="font-semibold text-gray-800 dark:text-white mb-2">
              カテゴリ別（棒グラフ）
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categorySummary}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis dataKey="category" stroke="#6B7280" />
                <YAxis
                  stroke="#6B7280"
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount">
                  {categorySummary.map((entry, index) => (
                    <Cell key={`bar-cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {categorySummary.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-gray-800 dark:text-white">
                    {item.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({item.count}件)
                  </span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "monthly" && monthlyData.length > 0 && (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.3}
              />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis
                stroke="#6B7280"
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === "weekly" && showWeekly && weeklyData.length > 0 && (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyData}
              margin={{ top: 32, right: 24, left: 24, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.3}
              />
              <XAxis
                dataKey="week"
                stroke="#6B7280"
                tickLine={false}
                axisLine={false}
                height={48}
                tick={({ x, y, payload, index }) => {
                  const data = weeklyData[index];
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text
                        x={0}
                        y={0}
                        dy={16}
                        textAnchor="middle"
                        fill="#6B7280"
                        fontSize="12"
                      >
                        {payload.value}
                      </text>
                      <text
                        x={0}
                        y={0}
                        dy={32}
                        textAnchor="middle"
                        fill="#9CA3AF"
                        fontSize="10"
                      >
                        {data?.dateRange}
                      </text>
                    </g>
                  );
                }}
              />
              <YAxis
                stroke="#6B7280"
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {((activeTab === "category" && categorySummary.length === 0) ||
        (activeTab === "monthly" && monthlyData.length === 0) ||
        (activeTab === "weekly" && weeklyData.length === 0)) && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>データがありません</p>
        </div>
      )}
    </div>
  );
}
