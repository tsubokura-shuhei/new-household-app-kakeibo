-- 支出テーブル
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  memo TEXT DEFAULT '',
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- カテゴリテーブル
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 貯金目標テーブル
CREATE TABLE saving_targets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_saving_targets_user_id ON saving_targets(user_id);

-- RLS（Row Level Security）の設定
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE saving_targets ENABLE ROW LEVEL SECURITY;

-- ポリシーの作成（一時的に全てのユーザーにアクセスを許可）
CREATE POLICY "Allow all operations for all users" ON expenses FOR ALL USING (true);
CREATE POLICY "Allow all operations for all users" ON categories FOR ALL USING (true);
CREATE POLICY "Allow all operations for all users" ON saving_targets FOR ALL USING (true);

-- デフォルトカテゴリの挿入
INSERT INTO categories (user_id, name, color, is_default, type) VALUES
('temp-user-123', '食費', '#FF6B6B', true, 'expense'),
('temp-user-123', '交通費', '#4ECDC4', true, 'expense'),
('temp-user-123', '光熱費', '#45B7D1', true, 'expense'),
('temp-user-123', '家賃', '#96CEB4', true, 'expense'),
('temp-user-123', '通信費', '#FFEAA7', true, 'expense'),
('temp-user-123', '医療費', '#DDA0DD', true, 'expense'),
('temp-user-123', '教育費', '#98D8C8', true, 'expense'),
('temp-user-123', '娯楽費', '#F7DC6F', true, 'expense'),
('temp-user-123', '給料', '#52C41A', true, 'income'),
('temp-user-123', 'ボーナス', '#1890FF', true, 'income'),
('temp-user-123', '副業', '#722ED1', true, 'income'),
('temp-user-123', 'その他収入', '#FA8C16', true, 'income');