import React from "react";
import { Barcode } from "../../utils/types";

interface BarcodeDetailsModalProps {
  isOpen: boolean;
  barcode: Barcode | null;
  onClose: () => void;
}

const BarcodeDetailsModal: React.FC<BarcodeDetailsModalProps> = ({ isOpen, barcode, onClose }) => {
  if (!isOpen || !barcode) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>{barcode.name}</h2>
        <p>Kod: {barcode.code}</p>
        <p>Glutenli mi ? : {barcode.glutenFree ? "Evet" : "Hayır"}</p>
        <h3>Besin Değerleri</h3>
        {barcode.nutritionalValuesList && barcode.nutritionalValuesList.length > 0 ? (
          <div className="nutritional-values">
            {barcode.nutritionalValuesList.map((value, index) => (
              <div
                key={index}
                className="nutritional-value"
                style={{ textAlign: "center" }}
              >
                <div>Tip: {value.type}</div>
                <div>Birim: {value.unit}</div>
                <div>Yağ: {value.fatAmount}</div>
                <div>Karbonhidrat: {value.carbohydrateAmount}</div>
                <div>Protein: {value.proteinAmount}</div>
                <div>Kalori: {value.calorieAmount}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>Besin değerleri yok.</p>
        )}
      </div>
    </div>
  );
};

export default BarcodeDetailsModal;