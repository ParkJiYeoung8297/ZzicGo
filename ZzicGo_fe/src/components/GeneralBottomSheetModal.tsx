import React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function GeneralBottomSheetModal({ open, onClose, children }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* 배경 클릭시 닫힘 */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={onClose}
      />

      {/* 바텀시트 */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-lg animate-slideUp">
        {children}
      </div>
    </div>
  );
}
