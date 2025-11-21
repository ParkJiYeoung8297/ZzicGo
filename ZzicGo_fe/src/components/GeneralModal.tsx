import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function GenericModal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      {/* 모달 박스 */}
      <div className="bg-white rounded-2xl p-6 w-80 shadow-lg animate-fadeIn">
        {children}

        {/* 닫기 영역 (바깥 클릭 닫기) */}
        <div
          className="absolute inset-0 -z-10"
          onClick={onClose}
        />
      </div>
    </div>
  );
}
