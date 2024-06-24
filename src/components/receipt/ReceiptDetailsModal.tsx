import React, { useState } from "react";
import { Receipt } from "../../utils/types"; // Ensure this path is correct

interface ReceiptDetailsModalProps {
  receipt: Receipt | null;
  onClose: () => void;
}

const ReceiptDetailsModal: React.FC<ReceiptDetailsModalProps> = ({
  receipt,
  onClose,
}) => {
  const [selectedSection, setSelectedSection] = useState<
    "detay" | "adımlar" | "besin değerleri"
  >("detay");

  if (!receipt) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>{receipt.receiptName}</h2>
        <div className="modal-buttons">
          <button onClick={() => setSelectedSection("detay")}>Detaylar</button>
          <button onClick={() => setSelectedSection("adımlar")}>
            Malzemeler
          </button>
          <button onClick={() => setSelectedSection("besin değerleri")}>
            Besin Değerleri
          </button>
        </div>
        <div className="modal-body">
          {selectedSection === "detay" && (
            <div>
              <h3>Detay</h3>
              <p>
                Oluşturulma Tarihi:{" "}
                {new Date(receipt.createdDate).toLocaleString()}
              </p>
              <ul>
                {receipt.receiptDetails.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          )}
          {selectedSection === "adımlar" && (
            <div>
              <h3>Malzemeler</h3>
              <ul>
                {receipt.receiptItems.map((item) => (
                  <li key={item.id}>
                    {item.productName} - {item.unit} {item.type}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {selectedSection === "besin değerleri" && (
            <div>
              <h3>Besin Değerleri</h3>
              <ul className="nutrition-list">
                {receipt.nutritionalValuesList.map((nutrition) => (
                  <li key={nutrition.id} className="nutrition-item">
                    <div>Tip: {nutrition.type}</div>
                    <div>Miktar: {nutrition.unit} g</div>
                    <div>Karbonhidrat: {nutrition.carbohydrateAmount}g</div>
                    <div>Protein: {nutrition.proteinAmount}g</div>
                    <div>Yağ: {nutrition.fatAmount}g</div>
                    <div>Kalori: {nutrition.calorieAmount}kcal</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptDetailsModal;
