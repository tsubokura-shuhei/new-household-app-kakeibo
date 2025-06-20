import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, CalendarClock } from "lucide-react";
import { Expense, Category } from "../types";
import { isHoliday, getHolidayName } from "../utils/holidayData";
import { DayExpensesModal } from "./DayExpensesModal";

interface CalendarProps {
  expenses: Expense[];
  categories: Category[];
  onDateSelect: (date: string) => void;
  onUpdateExpense: (id: string, amount: number) => void;
  onDeleteExpense: (id: string) => void;
}

export function Calendar({
  expenses,
  categories,
  onDateSelect,
  onUpdateExpense,
  onDeleteExpense,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showHolidayTooltip, setShowHolidayTooltip] = useState<number | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 現在の年と月を取得
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // 前の月に移動
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  // 次の月に移動
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // 今日の日付に移動し選択する
  const goToToday = () => {
    const today = new Date();
    // カレンダーの表示を今月に設定
    setCurrentDate(today);

    // 今日の日付を選択
    const todayString = today.toISOString().split("T")[0];
    onDateSelect(todayString);
  };

  // 月名を取得
  const getMonthName = (month: number) => {
    return new Date(0, month).toLocaleString("ja-JP", { month: "long" });
  };

  // カレンダーのデータを生成
  const calendarData = useMemo(() => {
    // 月の最初の日と最後の日を取得
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // 月の最初の日の曜日（0: 日曜, 1: 月曜, ...）
    const firstDayOfWeek = firstDayOfMonth.getDay();

    // カレンダーに表示する日数
    const daysInMonth = lastDayOfMonth.getDate();

    // カレンダーの行数を計算
    const weeksInMonth = Math.ceil((firstDayOfWeek + daysInMonth) / 7);

    // カレンダーの二次元配列を初期化
    const calendar: (number | null)[][] = Array(weeksInMonth)
      .fill(null)
      .map(() => Array(7).fill(null));

    // カレンダーに日付を埋める
    let dayCounter = 1;

    for (let week = 0; week < weeksInMonth; week++) {
      for (let day = 0; day < 7; day++) {
        if ((week === 0 && day < firstDayOfWeek) || dayCounter > daysInMonth) {
          calendar[week][day] = null;
        } else {
          calendar[week][day] = dayCounter++;
        }
      }
    }

    return calendar;
  }, [currentYear, currentMonth]);

  // 特定の日に支出があるかをチェック
  const hasExpenseOnDate = (day: number | null): boolean => {
    if (day === null) return false;

    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    return expenses.some((expense) => expense.date === dateString);
  };

  // 特定の日の支出を取得
  const getExpensesForDate = (dateString: string): Expense[] => {
    return expenses.filter((expense) => expense.date === dateString);
  };

  // 日付をクリックしたときの処理
  const handleDateClick = (day: number | null) => {
    if (day === null) return;

    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;

    // 選択された日付を保存
    setSelectedDate(dateString);

    // モーダルを表示
    setIsModalOpen(true);

    // フィルタリングも実行
    onDateSelect(dateString);
  };

  // 今日の日付
  const today = new Date();
  const isToday = (day: number | null): boolean => {
    return (
      day !== null &&
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  // 日付の色を取得する関数
  const getDateColor = (day: number | null, dayOfWeek: number): string => {
    if (day === null) return "";

    // 祝日は赤色
    if (isHoliday(currentYear, currentMonth, day)) {
      return "text-red-600 dark:text-red-400";
    }

    // 日曜日は赤色
    if (dayOfWeek === 0) {
      return "text-red-600 dark:text-red-400";
    }

    // 土曜日は青色
    if (dayOfWeek === 6) {
      return "text-blue-600 dark:text-blue-400";
    }

    // 平日は標準色
    return "text-gray-700 dark:text-gray-300";
  };

  // 日付セルの背景色を取得する関数
  const getDateBgColor = (day: number | null): string => {
    if (day === null) return "";

    if (isToday(day)) {
      return "bg-primary-100 dark:bg-primary-900";
    }

    return "";
  };

  // 祝日名を表示するツールチップ
  const renderHolidayTooltip = (
    day: number | null,
    index: number
  ): React.ReactNode => {
    if (day === null || !isHoliday(currentYear, currentMonth, day)) return null;

    const holidayName = getHolidayName(currentYear, currentMonth, day);

    if (showHolidayTooltip === index) {
      return (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-white dark:bg-gray-700 shadow-lg rounded-lg p-2 text-xs z-10 whitespace-nowrap">
          {holidayName}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            カレンダー
          </h3>
          <button
            onClick={goToToday}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
            title="今日の日付を表示"
          >
            <CalendarClock className="w-3 h-3" />
            今日
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-gray-700 dark:text-gray-300">
            {getMonthName(currentMonth)} {currentYear}
          </span>
          <button
            onClick={nextMonth}
            className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* 曜日のヘッダー */}
        {["日", "月", "火", "水", "木", "金", "土"].map((day, index) => (
          <div
            key={day}
            className={`text-center py-2 text-sm font-medium ${
              index === 0
                ? "text-red-500"
                : index === 6
                ? "text-blue-500"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {day}
          </div>
        ))}

        {/* カレンダーの日付 */}
        {calendarData.flat().map((day, index) => {
          const dayOfWeek = index % 7;
          const dateColor = getDateColor(day, dayOfWeek);
          const dateBgColor = getDateBgColor(day);
          const isHolidayDate =
            day !== null && isHoliday(currentYear, currentMonth, day);
          const holidayName = isHolidayDate
            ? getHolidayName(currentYear, currentMonth, day as number)
            : null;

          return (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              onMouseEnter={() =>
                isHolidayDate ? setShowHolidayTooltip(index) : null
              }
              onMouseLeave={() => setShowHolidayTooltip(null)}
              className={`
                relative aspect-square flex flex-col items-center justify-center text-sm
                ${
                  day === null
                    ? "cursor-default"
                    : "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                }
                ${dateBgColor}
                ${isHolidayDate ? "font-semibold" : ""}
                rounded-full transition-colors
              `}
              title={holidayName || undefined}
            >
              <span className={dateColor}>{day !== null && day}</span>
              {holidayName && (
                <span className="text-[10px] text-red-500 mt-0.5 leading-none">
                  {holidayName}
                </span>
              )}
              {day !== null && hasExpenseOnDate(day) && (
                <div className="absolute bottom-1 w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
              )}
              {renderHolidayTooltip(day, index)}
            </div>
          );
        })}
      </div>

      {/* 日付の支出詳細モーダル */}
      {selectedDate && (
        <DayExpensesModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          date={selectedDate}
          expenses={getExpensesForDate(selectedDate)}
          categories={categories}
          onUpdateExpense={onUpdateExpense}
          onDeleteExpense={onDeleteExpense}
        />
      )}
    </div>
  );
}
