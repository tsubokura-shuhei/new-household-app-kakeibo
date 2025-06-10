import React, { useState, useEffect } from "react";
import { AlertTriangle, Check } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "warning" | "info";
  requireConfirmation?: boolean;
  confirmationText?: string;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "確認",
  cancelLabel = "キャンセル",
  onConfirm,
  onCancel,
  type = "warning",
  requireConfirmation = false,
  confirmationText = "削除に同意します",
}: ConfirmDialogProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  // ダイアログが閉じたときにチェックボックスをリセット
  useEffect(() => {
    if (!isOpen) {
      setIsConfirmed(false);
    }
  }, [isOpen]);

  // 確認ボタンを押したときにチェックボックスをリセットしてから処理を実行
  const handleConfirm = () => {
    setIsConfirmed(false);
    onConfirm();
  };

  if (!isOpen) return null;

  // メッセージを改行で分割
  const messageLines = message.split("\n");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-center gap-3 mb-5">
            {type === "warning" && (
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
            )}
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {title}
            </h3>
          </div>
          <div className="text-gray-600 dark:text-gray-300 mb-8 space-y-2 text-left px-4 max-w-xs mx-auto">
            {messageLines.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>

          {requireConfirmation && (
            <div className="mb-6 flex items-center gap-2 justify-center">
              <button
                type="button"
                onClick={() => setIsConfirmed(!isConfirmed)}
                className={`w-5 h-5 flex items-center justify-center border rounded ${
                  isConfirmed
                    ? "bg-red-500 border-red-500 text-white"
                    : "border-gray-400 dark:border-gray-600"
                }`}
              >
                {isConfirmed && <Check className="w-4 h-4" />}
              </button>
              <label
                className="text-sm text-gray-700 dark:text-gray-300 select-none cursor-pointer"
                onClick={() => setIsConfirmed(!isConfirmed)}
              >
                {confirmationText}
              </label>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={handleConfirm}
              disabled={requireConfirmation && !isConfirmed}
              className={`px-4 py-2 rounded-lg text-white transition-colors ${
                type === "warning"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-primary-500 hover:bg-primary-600"
              } ${
                requireConfirmation && !isConfirmed
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
