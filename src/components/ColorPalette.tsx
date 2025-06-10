import React from "react";

interface ColorPaletteProps {
  onColorSelect: (color: string) => void;
  currentColor: string;
  onClose: () => void;
}

export function ColorPalette({
  onColorSelect,
  currentColor,
  onClose,
}: ColorPaletteProps) {
  // パレットの色設定 - 9x9のグリッド
  const colorRows = [
    // 赤系グラデーション
    [
      "#7F0000",
      "#B71C1C",
      "#D32F2F",
      "#F44336",
      "#E57373",
      "#EF9A9A",
      "#FFCDD2",
      "#FFEBEE",
      "#FFEBEE",
    ],
    // ピンク系グラデーション
    [
      "#880E4F",
      "#C2185B",
      "#E91E63",
      "#EC407A",
      "#F06292",
      "#F48FB1",
      "#F8BBD0",
      "#FCE4EC",
      "#FCE4EC",
    ],
    // 紫系グラデーション
    [
      "#4A148C",
      "#7B1FA2",
      "#9C27B0",
      "#AB47BC",
      "#BA68C8",
      "#CE93D8",
      "#E1BEE7",
      "#F3E5F5",
      "#F3E5F5",
    ],
    // 濃い紫系グラデーション
    [
      "#311B92",
      "#4527A0",
      "#512DA8",
      "#5E35B1",
      "#7E57C2",
      "#9575CD",
      "#B39DDB",
      "#D1C4E9",
      "#EDE7F6",
    ],
    // 青系グラデーション
    [
      "#0D47A1",
      "#1565C0",
      "#1976D2",
      "#1E88E5",
      "#42A5F5",
      "#64B5F6",
      "#90CAF9",
      "#BBDEFB",
      "#E3F2FD",
    ],
    // 水色系グラデーション
    [
      "#006064",
      "#00838F",
      "#0097A7",
      "#00ACC1",
      "#26C6DA",
      "#4DD0E1",
      "#80DEEA",
      "#B2EBF2",
      "#E0F7FA",
    ],
    // 緑系グラデーション
    [
      "#1B5E20",
      "#2E7D32",
      "#388E3C",
      "#43A047",
      "#66BB6A",
      "#81C784",
      "#A5D6A7",
      "#C8E6C9",
      "#E8F5E9",
    ],
    // 黄緑系グラデーション
    [
      "#827717",
      "#9E9D24",
      "#AFB42B",
      "#C0CA33",
      "#D4E157",
      "#DCE775",
      "#E6EE9C",
      "#F0F4C3",
      "#F9FBE7",
    ],
    // 黄色系グラデーション
    [
      "#F57F17",
      "#F9A825",
      "#FBC02D",
      "#FDD835",
      "#FFEE58",
      "#FFF176",
      "#FFF59D",
      "#FFF9C4",
      "#FFFDE7",
    ],
    // オレンジ系グラデーション
    [
      "#BF360C",
      "#E64A19",
      "#F4511E",
      "#FF5722",
      "#FF8A65",
      "#FFAB91",
      "#FFCCBC",
      "#FBE9E7",
      "#FBE9E7",
    ],
  ];

  // グレースケール
  const grayscaleColors = [
    "#000000",
    "#424242",
    "#616161",
    "#757575",
    "#9E9E9E",
    "#BDBDBD",
    "#E0E0E0",
    "#EEEEEE",
    "#FFFFFF",
  ];

  // クリック外部で閉じるための背景オーバーレイ
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 max-w-md w-full">
        <div className="mb-3 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            色を選択
          </h3>
          <div
            className="w-8 h-8 rounded-md border-2 border-gray-300"
            style={{ backgroundColor: currentColor }}
          ></div>
        </div>

        <div className="grid grid-cols-9 gap-1 mb-3">
          {colorRows.map((row, rowIndex) => (
            <React.Fragment key={`row-${rowIndex}`}>
              {row.map((color, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-8 h-8 rounded-md transition-all hover:scale-110 ${
                    color === currentColor
                      ? "ring-2 ring-gray-800 dark:ring-white ring-offset-2"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => onColorSelect(color)}
                  title={color}
                ></button>
              ))}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-9 gap-1 mb-4">
          {grayscaleColors.map((color, index) => (
            <button
              key={`gray-${index}`}
              className={`w-8 h-8 rounded-md transition-all hover:scale-110 ${
                color === currentColor
                  ? "ring-2 ring-gray-800 dark:ring-white ring-offset-2"
                  : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onColorSelect(color)}
              title={color}
            ></button>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
