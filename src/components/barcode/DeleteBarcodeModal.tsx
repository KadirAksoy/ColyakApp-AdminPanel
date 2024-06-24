import React from "react";
import { Barcode } from "../../utils/types";

interface DeleteBarcodeModalProps {
  isOpen: boolean;
  barcode: Barcode | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteBarcodeModal: React.FC<DeleteBarcodeModalProps> = ({
  isOpen,
  barcode,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !barcode) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content" style={{ height: "150px" }}>
        <span className="close" onClick={onCancel}>
          &times;
        </span>
        <h2>Barkodu silmek istediğinize emin misiniz?</h2>
        <div className="modal-actions">
          <button onClick={onConfirm}>Evet</button>
          <button onClick={onCancel}>Hayır</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBarcodeModal;
