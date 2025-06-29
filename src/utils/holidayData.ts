// 2023年と2024年の日本の祝日データ
// 実際のプロダクションでは、より完全なデータや祝日計算ライブラリを使用することをお勧めします

// 2023年・2024年の祝日データは不要なので削除

interface Holiday {
  month: number;
  day: number;
  name: string;
}

// 2026年の祝日データ
const holidays2026: Holiday[] = [
  { month: 1, day: 1, name: "元日" },
  { month: 1, day: 12, name: "成人の日" },
  { month: 2, day: 11, name: "建国記念の日" },
  { month: 2, day: 23, name: "天皇誕生日" },
  { month: 3, day: 20, name: "春分の日" },
  { month: 4, day: 29, name: "昭和の日" },
  { month: 5, day: 3, name: "憲法記念日" },
  { month: 5, day: 4, name: "みどりの日" },
  { month: 5, day: 5, name: "こどもの日" },
  { month: 5, day: 6, name: "こどもの日 振替休日" },
  { month: 7, day: 20, name: "海の日" },
  { month: 8, day: 11, name: "山の日" },
  { month: 9, day: 21, name: "敬老の日" },
  { month: 9, day: 23, name: "秋分の日" },
  { month: 10, day: 12, name: "スポーツの日" },
  { month: 11, day: 3, name: "文化の日" },
  { month: 11, day: 23, name: "勤労感謝の日" },
];

// 2027年の祝日データ
const holidays2027: Holiday[] = [
  { month: 1, day: 1, name: "元日" },
  { month: 1, day: 11, name: "成人の日" },
  { month: 2, day: 11, name: "建国記念の日" },
  { month: 2, day: 23, name: "天皇誕生日" },
  { month: 3, day: 21, name: "春分の日" },
  { month: 4, day: 29, name: "昭和の日" },
  { month: 5, day: 3, name: "憲法記念日" },
  { month: 5, day: 4, name: "みどりの日" },
  { month: 5, day: 5, name: "こどもの日" },
  { month: 7, day: 19, name: "海の日" },
  { month: 8, day: 11, name: "山の日" },
  { month: 9, day: 20, name: "敬老の日" },
  { month: 9, day: 23, name: "秋分の日" },
  { month: 10, day: 11, name: "スポーツの日" },
  { month: 11, day: 3, name: "文化の日" },
  { month: 11, day: 23, name: "勤労感謝の日" },
];

// 2025年の祝日データ
const holidays2025: Holiday[] = [
  { month: 1, day: 1, name: "元日" },
  { month: 1, day: 13, name: "成人の日" },
  { month: 2, day: 11, name: "建国記念の日" },
  { month: 2, day: 23, name: "天皇誕生日" },
  { month: 3, day: 21, name: "春分の日" },
  { month: 4, day: 29, name: "昭和の日" },
  { month: 5, day: 3, name: "憲法記念日" },
  { month: 5, day: 4, name: "みどりの日" },
  { month: 5, day: 5, name: "こどもの日" },
  { month: 5, day: 6, name: "こどもの日 振替休日" },
  { month: 7, day: 21, name: "海の日" },
  { month: 8, day: 11, name: "山の日" },
  { month: 9, day: 15, name: "敬老の日" },
  { month: 9, day: 23, name: "秋分の日" },
  { month: 10, day: 13, name: "スポーツの日" },
  { month: 11, day: 3, name: "文化の日" },
  { month: 11, day: 23, name: "勤労感謝の日" },
];

// 年と月から該当する祝日を取得する関数
export function getHolidaysForMonth(
  year: number,
  month: number
): { [day: number]: string } {
  const holidaysMap: { [day: number]: string } = {};

  // 年に応じて祝日データを選択
  const holidaysForYear =
    year === 2025
      ? holidays2025
      : year === 2026
      ? holidays2026
      : year === 2027
      ? holidays2027
      : [];

  // 指定された月の祝日を抽出
  holidaysForYear
    .filter((holiday) => holiday.month === month + 1)
    .forEach((holiday) => {
      holidaysMap[holiday.day] = holiday.name;
    });

  return holidaysMap;
}

// 指定された日が祝日かどうかをチェックする関数
export function isHoliday(year: number, month: number, day: number): boolean {
  const holidays = getHolidaysForMonth(year, month);
  return !!holidays[day];
}

// 祝日の名前を取得する関数
export function getHolidayName(
  year: number,
  month: number,
  day: number
): string | null {
  const holidays = getHolidaysForMonth(year, month);
  return holidays[day] || null;
}
