import { supabase } from "../lib/supabase";
import { Expense, Category, SavingTarget } from "../types";

// 仮のユーザーID（後で認証機能を追加する際に変更）
const TEMP_USER_ID = "temp-user-123";

// 支出データの操作
export const supabaseHelpers = {
  // 支出データの取得
  async getExpenses(): Promise<Expense[]> {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", TEMP_USER_ID)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching expenses:", error);
      return [];
    }

    return (
      data?.map((expense) => ({
        id: expense.id,
        date: expense.date,
        category: expense.category,
        amount: expense.amount,
        memo: expense.memo,
        type: expense.type,
        createdAt: new Date(expense.created_at),
      })) || []
    );
  },

  // 支出データの追加
  async addExpense(
    expenseData: Omit<Expense, "id" | "createdAt">
  ): Promise<Expense | null> {
    const { data, error } = await supabase
      .from("expenses")
      .insert({
        user_id: TEMP_USER_ID,
        date: expenseData.date,
        category: expenseData.category,
        amount: expenseData.amount,
        memo: expenseData.memo,
        type: expenseData.type,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding expense:", error);
      return null;
    }

    return {
      id: data.id,
      date: data.date,
      category: data.category,
      amount: data.amount,
      memo: data.memo,
      type: data.type,
      createdAt: new Date(data.created_at),
    };
  },

  // 支出データの削除
  async deleteExpense(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id)
      .eq("user_id", TEMP_USER_ID);

    if (error) {
      console.error("Error deleting expense:", error);
      return false;
    }

    return true;
  },

  // 支出データの更新
  async updateExpense(id: string, amount: number): Promise<boolean> {
    const { error } = await supabase
      .from("expenses")
      .update({
        amount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", TEMP_USER_ID);

    if (error) {
      console.error("Error updating expense:", error);
      return false;
    }

    return true;
  },

  // カテゴリデータの取得
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", TEMP_USER_ID)
      .order("name");

    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }

    return (
      data?.map((category) => ({
        id: category.id,
        name: category.name,
        color: category.color,
        isDefault: category.is_default,
        type: category.type,
      })) || []
    );
  },

  // カテゴリデータの追加
  async addCategory(
    categoryData: Omit<Category, "id">
  ): Promise<Category | null> {
    const { data, error } = await supabase
      .from("categories")
      .insert({
        user_id: TEMP_USER_ID,
        name: categoryData.name,
        color: categoryData.color,
        is_default: categoryData.isDefault,
        type: categoryData.type,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding category:", error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      color: data.color,
      isDefault: data.is_default,
      type: data.type,
    };
  },

  // カテゴリデータの削除
  async deleteCategory(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .eq("user_id", TEMP_USER_ID);

    if (error) {
      console.error("Error deleting category:", error);
      return false;
    }

    return true;
  },

  // カテゴリデータの更新
  async updateCategory(
    id: string,
    updatedData: Partial<Omit<Category, "id">>
  ): Promise<boolean> {
    const updateData: {
      name?: string;
      color?: string;
      is_default?: boolean;
      type?: "income" | "expense";
    } = {};

    if (updatedData.name !== undefined) updateData.name = updatedData.name;
    if (updatedData.color !== undefined) updateData.color = updatedData.color;
    if (updatedData.isDefault !== undefined)
      updateData.is_default = updatedData.isDefault;
    if (updatedData.type !== undefined) updateData.type = updatedData.type;

    const { error } = await supabase
      .from("categories")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", TEMP_USER_ID);

    if (error) {
      console.error("Error updating category:", error);
      return false;
    }

    return true;
  },

  // 貯金目標データの取得
  async getSavingTargets(): Promise<SavingTarget[]> {
    const { data, error } = await supabase
      .from("saving_targets")
      .select("*")
      .eq("user_id", TEMP_USER_ID);

    if (error) {
      console.error("Error fetching saving targets:", error);
      return [];
    }

    return (
      data?.map((target) => ({
        category: target.category,
        amount: target.amount,
      })) || []
    );
  },

  // 貯金目標データの追加
  async addSavingTarget(target: SavingTarget): Promise<boolean> {
    const { error } = await supabase.from("saving_targets").insert({
      user_id: TEMP_USER_ID,
      category: target.category,
      amount: target.amount,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error adding saving target:", error);
      return false;
    }

    return true;
  },

  // 貯金目標データの削除
  async deleteSavingTarget(category: string): Promise<boolean> {
    const { error } = await supabase
      .from("saving_targets")
      .delete()
      .eq("category", category)
      .eq("user_id", TEMP_USER_ID);

    if (error) {
      console.error("Error deleting saving target:", error);
      return false;
    }

    return true;
  },

  // 全データ削除（支出、カテゴリ、貯金目標）
  async clearAllData(): Promise<boolean> {
    try {
      // 支出データを削除
      const { error: expensesError } = await supabase
        .from("expenses")
        .delete()
        .eq("user_id", TEMP_USER_ID);

      if (expensesError) {
        console.error("Error deleting expenses:", expensesError);
        return false;
      }

      // カテゴリデータを削除（デフォルトカテゴリ以外）
      const { error: categoriesError } = await supabase
        .from("categories")
        .delete()
        .eq("user_id", TEMP_USER_ID)
        .eq("is_default", false);

      if (categoriesError) {
        console.error("Error deleting categories:", categoriesError);
        return false;
      }

      // 貯金目標データを削除
      const { error: savingTargetsError } = await supabase
        .from("saving_targets")
        .delete()
        .eq("user_id", TEMP_USER_ID);

      if (savingTargetsError) {
        console.error("Error deleting saving targets:", savingTargetsError);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error clearing all data:", error);
      return false;
    }
  },
};
