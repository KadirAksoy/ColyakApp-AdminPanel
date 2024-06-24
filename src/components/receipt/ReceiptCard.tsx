import React from "react";
import { Receipt } from "../../utils/types"; // Ensure the path is correct
import { API } from "../../services/apiUrls";

interface ReceiptCardProps {
  receipt: Receipt;
  onViewDetails: (id: number) => void;
  onUpdate: (id: number) => void;
  onDelete: (id: number) => void;
}

const ReceiptCard: React.FC<ReceiptCardProps> = ({
  receipt,
  onViewDetails,
  onUpdate,
  onDelete,
}) => {
  return (
    <div className="receipt-card">
      <div className="receipt-actions-container">
        <div
          className="receipt-image"
          style={{
            aspectRatio: 4 / 3,
            backgroundImage: `url(${API.BASE_URL}${API.IMAGES.GET}${receipt.imageId})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <h2>{receipt.receiptName}</h2>
        <div className="receipt-actions">
          <button onClick={() => onViewDetails(receipt.id)}>Detaylar</button>
          <button onClick={() => onUpdate(receipt.id)}>Güncelle</button>
          <button onClick={() => onDelete(receipt.id)}>Sil</button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptCard;
