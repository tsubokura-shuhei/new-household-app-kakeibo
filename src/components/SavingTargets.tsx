import React, { useState, useEffect } from "react";
import { Category } from "../types";
import {
  CreditCard,
  DollarSign,
  Plus,
  Trash2,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface SavingTarget {
  category: string;
  amount: number;
}

// 入力用のSavingTarget（amount が string 型）
interface SavingTargetInput {
  category: string;
  amount: string;
}

interface SavingTargetsProps {
  categories: Category[];
  expenses: {
    id: string;
    date: string;
    category: string;
    amount: number;
    memo: string;
    createdAt: Date;
  }[];
  savingTargets: SavingTarget[];
  onAddSavingTarget: (target: SavingTarget) => void;
  onDeleteSavingTarget: (category: string) => void;
}

export function SavingTargets({
  categories,
  expenses,
  savingTargets,
  onAddSavingTarget,
  onDeleteSavingTarget,
}: SavingTargetsProps) {
  const [newTarget, setNewTarget] = useState<SavingTargetInput>({
    category: "",
    amount: "",
  });

  // アドバイス詳細の表示状態
  const [showAdviceDetails, setShowAdviceDetails] = useState(false);

  // 現在の年月を取得
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth()は0始まりなので+1する

  // 今月の支出を取得
  const getCurrentMonthExpenses = () => {
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getFullYear() === currentYear &&
        expenseDate.getMonth() + 1 === currentMonth
      );
    });
  };

  // カテゴリごとの今月の支出金額を計算
  const getCategoryExpense = (categoryName: string): number => {
    const thisMonthExpenses = getCurrentMonthExpenses();
    return thisMonthExpenses
      .filter((expense) => expense.category === categoryName)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  // 新しい目標の追加処理
  const handleAddTarget = () => {
    if (!newTarget.category || !newTarget.amount) return;

    const amount = parseFloat(newTarget.amount);
    if (isNaN(amount) || amount <= 0) return;

    // すでに同じカテゴリの目標が存在するかチェック
    const existingTargetIndex = savingTargets.findIndex(
      (target) => target.category === newTarget.category
    );

    if (existingTargetIndex !== -1) {
      return;
    }

    onAddSavingTarget({
      category: newTarget.category,
      amount: amount,
    });

    // フォームをリセット
    setNewTarget({
      category: "",
      amount: "",
    });
  };

  // 金額入力の処理（半角変換）
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 全角数字を半角に変換
    const halfWidthValue = e.target.value.replace(/[０-９]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    });
    // 数字と小数点のみ許可
    const numericValue = halfWidthValue.replace(/[^0-9.]/g, "");
    setNewTarget((prev) => ({ ...prev, amount: numericValue }));
  };

  // 金額のフォーマット
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ja-JP").format(amount) + "円";
  };

  // カテゴリーの色を取得
  const getCategoryColor = (categoryName: string): string => {
    const category = categories.find((cat) => cat.name === categoryName);
    return category ? category.color : "#9CA3AF"; // デフォルト色
  };

  // 目標と現在の支出を比較して状態を判断
  const getStatusInfo = (
    categoryName: string,
    targetAmount: number
  ): {
    message: string;
    color: string;
  } => {
    const currentAmount = getCategoryExpense(categoryName);
    if (currentAmount > targetAmount) {
      return {
        message: "節約をしてください",
        color: "text-red-500",
      };
    } else if (currentAmount > targetAmount / 2) {
      return {
        message: "そろそろ節約が必要です",
        color: "text-orange-500",
      };
    } else {
      return {
        message: "まだ節約は大丈夫です",
        color: "text-green-500",
      };
    }
  };

  // アドバイスメッセージを取得する関数
  const getAdviceMessage = (): { message: string; color: string } => {
    // 各状態のカウント
    let goodCount = 0;
    let warningCount = 0;
    let dangerCount = 0;

    // 各カテゴリの状態をカウント
    savingTargets.forEach((target) => {
      const statusInfo = getStatusInfo(target.category, target.amount);

      if (statusInfo.message === "まだ節約は大丈夫です") {
        goodCount++;
      } else if (statusInfo.message === "そろそろ節約が必要です") {
        warningCount++;
      } else if (statusInfo.message === "節約をしてください") {
        dangerCount++;
      }
    });

    // カテゴリの総数
    const totalCategories = savingTargets.length;

    if (totalCategories === 0) {
      return {
        message: "目標を設定して節約を始めましょう！",
        color: "text-blue-500",
      };
    }

    // 危険状態が1つでもある場合
    if (dangerCount > 0) {
      if (dangerCount >= (totalCategories * 2) / 3) {
        return {
          message: "これは節約が必要ですね！",
          color: "text-red-500",
        };
      }
    }

    // 警告状態が2/3以上
    if (warningCount >= (totalCategories * 2) / 3) {
      return {
        message: "そろそろ節約した方がいいですよ..",
        color: "text-orange-500",
      };
    }

    // 良好状態が2/3以上かつ危険状態が0
    if (goodCount >= (totalCategories * 2) / 3 && dangerCount === 0) {
      return {
        message: "よく頑張っていますね！その調子で節約しましょう！",
        color: "text-green-500",
      };
    }

    // デフォルトメッセージ
    return {
      message: "節約を続けましょう！",
      color: "text-blue-500",
    };
  };

  // アニメーション用のuseEffect（直接スタイルに計算を適用するため、状態は不要になりました）
  useEffect(() => {
    savingTargets.forEach((target) => {
      const currentAmount = getCategoryExpense(target.category);
      const availableAmount = target.amount - currentAmount;
      const percentage = Math.min(100, (currentAmount / target.amount) * 100);

      // デバッグ用
      console.log(
        `カテゴリ: ${target.category}, 目標: ${target.amount}, 支出: ${currentAmount}, 使用可能: ${availableAmount}, パーセント: ${percentage}%`
      );
    });
  }, [savingTargets, expenses]);

  return (
    <div className="space-y-6">
      {/* アドバイスエリア */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary-500" />
          アドバイス
        </h2>

        {savingTargets.length > 0 ? (
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-center">
              <p className={`text-xl font-bold ${getAdviceMessage().color}`}>
                {getAdviceMessage().message}
              </p>
            </div>

            {/* アドバイス詳細を表示するボタン */}
            {savingTargets.some((target) => {
              const statusInfo = getStatusInfo(target.category, target.amount);
              return (
                statusInfo.message === "そろそろ節約が必要です" ||
                statusInfo.message === "節約をしてください"
              );
            }) && (
              <div className="flex justify-center mt-3">
                <button
                  onClick={() => setShowAdviceDetails(!showAdviceDetails)}
                  className="flex items-center gap-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                >
                  {showAdviceDetails ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      アドバイスを隠す
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      アドバイスを表示する
                    </>
                  )}
                </button>
              </div>
            )}

            {/* 要注意カテゴリの詳細アドバイス */}
            {showAdviceDetails && (
              <div className="space-y-2 mt-2 transition-all">
                {savingTargets.map((target) => {
                  const statusInfo = getStatusInfo(
                    target.category,
                    target.amount
                  );

                  // 警告または危険状態のカテゴリのみ表示
                  if (
                    statusInfo.message === "そろそろ節約が必要です" ||
                    statusInfo.message === "節約をしてください"
                  ) {
                    return (
                      <div
                        key={`advice-${target.category}`}
                        className="px-4 py-2 rounded-lg border-l-4 bg-gray-50 dark:bg-gray-700"
                      >
                        {statusInfo.message === "そろそろ節約が必要です" ? (
                          <p className="text-orange-500 font-medium">
                            {target.category}をそろそろ節約した方がいいですね
                          </p>
                        ) : (
                          <p className="text-red-500 font-medium">
                            {target.category}
                            は利用できる金額を超えているため節約してくださいね！
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            <p>目標を設定すると、アドバイスが表示されます</p>
          </div>
        )}
      </div>

      {/* 節約目標エリア */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary-500" />
          今月の節約目標の金額
        </h2>

        {/* 新しい目標の追加フォーム */}
        <div className="mb-6">
          <div className="grid grid-cols-1 gap-3">
            <div className="md:grid md:grid-cols-3 md:gap-3 space-y-3 md:space-y-0">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 md:hidden">
                  カテゴリ
                </label>
                <select
                  value={newTarget.category}
                  onChange={(e) =>
                    setNewTarget((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                >
                  <option value="">カテゴリを選択</option>
                  {categories
                    .filter(
                      (category) =>
                        category.type === "expense" &&
                        !savingTargets.some(
                          (target) => target.category === category.name
                        )
                    )
                    .map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 md:hidden">
                  目標金額
                </label>
                <div className="flex">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={newTarget.amount}
                    onChange={handleAmountChange}
                    placeholder="目標金額"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  />
                  <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-r-lg">
                    円
                  </span>
                </div>
              </div>
              <div>
                <div className="h-0 md:h-auto md:mb-0 mb-1 invisible md:visible">
                  <span className="text-xs">&nbsp;</span>
                </div>
                <button
                  onClick={handleAddTarget}
                  disabled={!newTarget.category || !newTarget.amount}
                  className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  目標を追加
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 設定済みの目標リスト */}
        {savingTargets.length > 0 ? (
          <div className="space-y-3">
            {/* デスクトップ表示用のヘッダー（スマホでは非表示） */}
            <div className="hidden md:grid md:grid-cols-12 gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <div className="col-span-3">カテゴリ</div>
              <div className="col-span-2">状態</div>
              <div className="col-span-2">目標金額</div>
              <div className="col-span-2">今月の支出</div>
              <div className="col-span-2">使用できる金額</div>
              <div className="col-span-1 text-right">操作</div>
            </div>

            {savingTargets.map((target) => {
              const statusInfo = getStatusInfo(target.category, target.amount);
              const currentAmount = getCategoryExpense(target.category);
              const availableAmount = target.amount - currentAmount;
              const availableAmountColor =
                availableAmount >= 0 ? "text-green-500" : "text-red-500";

              return (
                <div
                  key={target.category}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden"
                >
                  {/* デスクトップ表示 */}
                  <div className="hidden md:grid md:grid-cols-12 gap-2 px-3 py-3 items-center">
                    <div className="col-span-3 flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: getCategoryColor(target.category),
                        }}
                      />
                      <span className="font-medium text-gray-800 dark:text-white">
                        {target.category}
                      </span>
                    </div>
                    <div
                      className={`col-span-2 ${statusInfo.color} text-lg font-medium`}
                    >
                      {statusInfo.message}
                    </div>
                    <div className="col-span-2 font-semibold text-gray-700 dark:text-gray-300">
                      {formatCurrency(target.amount)}
                    </div>
                    <div className="col-span-2 text-gray-600 dark:text-gray-400">
                      {formatCurrency(currentAmount)}
                    </div>
                    <div
                      className={`col-span-2 font-semibold ${availableAmountColor} text-lg`}
                    >
                      {formatCurrency(availableAmount)}
                    </div>
                    <div className="col-span-1 text-right">
                      <button
                        onClick={() => onDeleteSavingTarget(target.category)}
                        className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-colors"
                        title="削除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 横棒グラフ（デスクトップ表示） */}
                  <div className="hidden md:block px-3 pb-3">
                    <div className="h-5 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-1000 ease-in-out"
                        style={{
                          width: `${(currentAmount / target.amount) * 100}%`,
                          backgroundColor:
                            statusInfo.color === "text-green-500"
                              ? "#22c55e"
                              : statusInfo.color === "text-orange-500"
                              ? "#f97316"
                              : statusInfo.color === "text-red-500"
                              ? "#ef4444"
                              : "#3b82f6",
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>0円</span>
                      <span className="absolute left-1/2 transform -translate-x-1/2">
                        {formatCurrency(target.amount / 2)}
                      </span>
                      <span>{formatCurrency(target.amount)}</span>
                    </div>
                  </div>

                  {/* スマホ表示 */}
                  <div className="md:hidden p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: getCategoryColor(target.category),
                          }}
                        />
                        <span className="font-semibold text-gray-800 dark:text-white text-lg">
                          {target.category}
                        </span>
                      </div>
                      <button
                        onClick={() => onDeleteSavingTarget(target.category)}
                        className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-colors"
                        title="削除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-600">
                        <span className="text-gray-600 dark:text-gray-400">
                          状態
                        </span>
                        <span
                          className={`font-medium ${statusInfo.color} text-lg`}
                        >
                          {statusInfo.message}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-600">
                        <span className="text-gray-600 dark:text-gray-400">
                          目標金額
                        </span>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          {formatCurrency(target.amount)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-600">
                        <span className="text-gray-600 dark:text-gray-400">
                          今月の支出
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {formatCurrency(currentAmount)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-600">
                        <span className="text-gray-600 dark:text-gray-400">
                          使用できる金額
                        </span>
                        <span
                          className={`font-semibold ${availableAmountColor} text-lg`}
                        >
                          {formatCurrency(availableAmount)}
                        </span>
                      </div>

                      {/* 横棒グラフ（スマホ表示） */}
                      <div className="pt-2">
                        <div className="h-5 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-1000 ease-in-out"
                            style={{
                              width: `${
                                (currentAmount / target.amount) * 100
                              }%`,
                              backgroundColor:
                                statusInfo.color === "text-green-500"
                                  ? "#22c55e"
                                  : statusInfo.color === "text-orange-500"
                                  ? "#f97316"
                                  : statusInfo.color === "text-red-500"
                                  ? "#ef4444"
                                  : "#3b82f6",
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>0円</span>
                          <span className="absolute left-1/2 transform -translate-x-1/2">
                            {formatCurrency(target.amount / 2)}
                          </span>
                          <span>{formatCurrency(target.amount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>節約目標がまだ設定されていません</p>
            <p className="text-sm">
              カテゴリと目標金額を入力して追加してください
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
