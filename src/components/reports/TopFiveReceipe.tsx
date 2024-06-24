import React, { useEffect, useState } from "react";
import { useTokenReset } from "../../services/loginHandleToToken";
import { API } from "../../services/apiUrls";
import { Modal, Button } from "antd";
import "../../css/TopFiveReceipe.css";
import { NutritionalValue, Receipt, ReceiptItem } from "../../utils/types";

// Tarif maddesi veri yapısı

function TopFiveReceipe() {
  const api = useTokenReset();
  const [topFiveReceipts, setTopFiveReceipts] = useState<Receipt[]>([]); // Toplam alınan tarifler için state
  const [imageUrls, setImageUrls] = useState<string[]>([]); // Resim URL'leri için state
  const [visible, setVisible] = useState<boolean>(false); // Modal görünürlük durumu için state
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null); // Seçilen tarif için state
  const [selectedTab, setSelectedTab] = useState<string>("description"); // Seçilen sekme için state

  // Modal gösterme fonksiyonu
  const showModal = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setVisible(true);
  };

  // Modal gizleme fonksiyonu
  const handleCancel = () => {
    setVisible(false);
  };

  // Verileri alma fonksiyonu
  const getTopFiveReceipts = async () => {
    try {
      const response = await api.get(API.REPORT.GET_TOP_FIVE_RECEIPT);
      setTopFiveReceipts(response.data); // Toplam alınan tarifleri state'e ayarla

      // Tüm resim URL'lerini almak için imageId'leri kullanarak bir döngü yap
      const imageUrlArray = response.data.map(
        (receipt: Receipt) =>
          `${API.BASE_URL}${API.IMAGES.GET}${receipt.imageId}`
      );
      setImageUrls(imageUrlArray);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTopFiveReceipts();
  }, []);

  const renderNutritionalValues = (values: NutritionalValue[]) => {
    return (
      <div>
        {values.map((value, index) => (
          <div key={index} className="nutritional-values">
            <h4>{index + 1}. Besin Değeri </h4>
            <p>
              <div>Porsiyon ({value.type}) </div>
              <div> {value.carbohydrateAmount}g karbonhidrat</div>
              <div> {value.proteinAmount}g protein</div>
              <div> {value.fatAmount}g fat</div>
              <div> {value.calorieAmount} calories</div>
            </p>
          </div>
        ))}
      </div>
    );
  };

  // Sekme değiştirme fonksiyonu
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  return (
    <div>
      <h2>En Çok Kullanılan Tarifler</h2>
      <ul className="app">
        {topFiveReceipts.map((receipt: Receipt, index: number) => (
          <li key={index} className="receipt-card">
            <h3>{receipt.receiptName}</h3>
            {imageUrls[index] && (
              <img
                src={imageUrls[index]}
                alt={receipt.receiptName}
                className="receipt-image"
              />
            )}
            <div className="details-button">
              <Button onClick={() => showModal(receipt)}>Detaylar</Button>
            </div>
          </li>
        ))}
      </ul>
      <Modal
        title={selectedReceipt ? selectedReceipt.receiptName : ""}
        visible={visible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Kapat
          </Button>,
        ]}
      >
        {selectedReceipt && (
          <div>
            <div className="tab-buttons">
              <Button
                type={selectedTab === "description" ? "primary" : "default"}
                onClick={() => handleTabChange("description")}
              >
                Tarif Açıklaması
              </Button>
              <Button
                type={selectedTab === "ingredients" ? "primary" : "default"}
                onClick={() => handleTabChange("ingredients")}
              >
                Tarif Maddeleri
              </Button>
              <Button
                type={selectedTab === "nutrition" ? "primary" : "default"}
                onClick={() => handleTabChange("nutrition")}
              >
                Besin Değerleri
              </Button>
            </div>
            {selectedTab === "description" && (
              <div>
                <p>Oluşturulma Tarihi: {selectedReceipt.createdDate}</p>
                <p>
                  Tarif Detayları: {selectedReceipt.receiptDetails.join(", ")}
                </p>
              </div>
            )}
            {selectedTab === "ingredients" && (
              <div>
                <p>Tarif Maddeleri:</p>
                <ul>
                  {selectedReceipt.receiptItems.map((item: ReceiptItem) => (
                    <li key={item.id}>{item.productName}</li>
                  ))}
                </ul>
              </div>
            )}
            {selectedTab === "nutrition" && (
              <div>
                {renderNutritionalValues(selectedReceipt.nutritionalValuesList)}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default TopFiveReceipe;
