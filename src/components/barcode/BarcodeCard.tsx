import React from "react";
import { Barcode } from "../../utils/types";
import { API } from "../../services/apiUrls";

interface BarcodeCardProps {
  barcode: Barcode;
  onDetailsClick: (barcode: Barcode) => void;
  onDeleteClick: (barcode: Barcode) => void;
  onUpdateClick: (barcode: Barcode) => void;
}

const BarcodeCard: React.FC<BarcodeCardProps> = ({
  barcode,
  onDetailsClick,
  onDeleteClick,
  onUpdateClick,
}) => {
  return (
    <div className="barcode-card">
      <div
        className="barcode-image"
        style={{
          aspectRatio: 4 / 3,
          backgroundImage: `url(${API.BASE_URL}${API.IMAGES.GET}${barcode.imageId})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <h2>{barcode.name}</h2>
      <div className="barcode-actions-container">
        <div className="barcode-actions">
          <button onClick={() => onDetailsClick(barcode)}>Detaylar</button>
          <button onClick={() => onUpdateClick(barcode)}>Güncelle</button>
          <button onClick={() => onDeleteClick(barcode)}>Sil</button>
        </div>
      </div>
    </div>
  );
};

export default BarcodeCard;
