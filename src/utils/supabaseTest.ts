import { supabase } from "../lib/supabase";

export const testSupabaseConnection = async () => {
  try {
    // カテゴリテーブルからデータを取得してテスト
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .limit(1);

    if (error) {
      console.error("Supabase接続エラー:", error);
      return false;
    }

    console.log("Supabase接続成功:", data);
    return true;
  } catch (error) {
    console.error("Supabase接続テストエラー:", error);
    return false;
  }
};

// アプリケーション起動時に接続テストを実行
export const initializeSupabase = async () => {
  const isConnected = await testSupabaseConnection();
  if (isConnected) {
    console.log("✅ Supabase接続が正常に確立されました");
  } else {
    console.error("❌ Supabase接続に失敗しました");
  }
  return isConnected;
};
