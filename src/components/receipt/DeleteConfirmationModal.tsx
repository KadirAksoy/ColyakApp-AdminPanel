import React from "react";

interface DeleteConfirmationModalProps {
  receiptName: string;
  onDeleteConfirm: () => void;
  onClose: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  receiptName,
  onDeleteConfirm,
  onClose,
}) => {
  return (
    <div className="modal">
      <div className="modal-content" style={{ height: "180px" }}>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Tarifi Sil</h2>
        <p>"{receiptName}" adlı tarifi silmek istediğinize emin misiniz?</p>
        <div className="modal-buttons">
          <button onClick={onDeleteConfirm}>Evet</button>
          <button onClick={onClose}>Hayır</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
