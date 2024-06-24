import React, { useState } from "react";
import { ReceiptItem, NutritionalValue, Receipt } from "../../utils/types"; // Import interfaces
import { API } from "../../services/apiUrls";
import { useTokenReset } from "../../services/loginHandleToToken";
import "../../css/AddReceiptModal.css";
import { Upload, Button, message } from "antd";
import { UploadChangeParam } from "antd/lib/upload";

interface AddReceiptModalProps {
  onClose: () => void;
  onReceiptAdded: () => void;
}

const AddReceiptModal: React.FC<AddReceiptModalProps> = ({
  onClose,
  onReceiptAdded,
}) => {
  const api = useTokenReset();
  const [receiptName, setReceiptName] = useState<string>("");
  const [receiptDetails, setReceiptDetails] = useState<string[]>([""]);
  const [receiptItems, setReceiptItems] = useState<ReceiptItem[]>([
    { id: 0, productName: "", unit: 0, type: "" },
  ]);
  const [nutritionalValuesList, setNutritionalValuesList] = useState<
    NutritionalValue[]
  >([
    {
      id: 0,
      type: "",
      unit: 0,
      fatAmount: 0,
      carbohydrateAmount: 0,
      proteinAmount: 0,
      calorieAmount: 0,
    },
  ]);
  const [imageId, setImageId] = useState<number | null>(null);

  const [activeSection, setActiveSection] = useState<
    "details" | "items" | "nutrition"
  >("details");

  const handleAddReceipt = async () => {
    const newReceipt: Receipt = {
      id: 0, // assuming this will be assigned on server side
      receiptName,
      receiptDetails,
      receiptItems,
      nutritionalValuesList,
      imageId: imageId || 0,
      deleted: false,
      createdDate: "",
    };

    try {
      await api.post(API.RECEIPTS.POST, newReceipt);
      onReceiptAdded(); // Callback after receipt is added
      onClose(); // Close modal
    } catch (error) {
      console.error(error);
      message.error("Tarif eklenirken bir hata oluştu.");
    }
  };

  const handleAddDetail = () => setReceiptDetails([...receiptDetails, ""]);
  const handleRemoveDetail = (index: number) =>
    setReceiptDetails(receiptDetails.filter((_, i) => i !== index));

  const handleAddItem = () =>
    setReceiptItems([
      ...receiptItems,
      { id: 0, productName: "", unit: 0, type: "" },
    ]);
  const handleRemoveItem = (index: number) =>
    setReceiptItems(receiptItems.filter((_, i) => i !== index));

  const handleAddNutritionalValue = () =>
    setNutritionalValuesList([
      ...nutritionalValuesList,
      {
        id: 0,
        type: "",
        unit: 0,
        fatAmount: 0,
        carbohydrateAmount: 0,
        proteinAmount: 0,
        calorieAmount: 0,
      },
    ]);
  const handleRemoveNutritionalValue = (index: number) =>
    setNutritionalValuesList(
      nutritionalValuesList.filter((_, i) => i !== index)
    );

  const handleImageUploadChange = (info: UploadChangeParam) => {
    if (info.file.status === "done") {
      const response = info.file.response;
      console.log(response);
      if (response) {
        setImageId(response);
        message.success(`${info.file.name} başarıyla yüklendi.`);
      } else {
        message.error("Resim yüklenirken bir hata oluştu.");
      }
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} yüklenirken bir hata oluştu.`);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Tarif Ekle</h2>
        <div className="modal-body">
          <label>
            Tarif Adı:
            <input
              type="text"
              value={receiptName}
              onChange={(e) => setReceiptName(e.target.value)}
            />
          </label>
          <div>
            <div className="button-container-fixed">
              <button className="add-button" onClick={handleAddReceipt}>
                Tarifi Ekle
              </button>
            </div>
            {/* Image Upload Section */}
            <div className="image-upload-container">
              <label>
                Resim Yükle:
                <Upload
                  maxCount={1}
                  listType="picture"
                  defaultFileList={
                    imageId
                      ? [
                          {
                            uid: "-1",
                            name: "image.png",
                            status: "done",
                            url: `${API.BASE_URL}${API.IMAGES.GET}${imageId}`,
                          },
                        ]
                      : []
                  }
                  action={`${API.BASE_URL}${API.IMAGES.POST}`}
                  onChange={handleImageUploadChange}
                >
                  <Button type="primary">Fotoğraf Yükle</Button>
                </Upload>
              </label>
            </div>
            {/* End of Image Upload Section */}
          </div>

          <div className="button-container">
            <button
              className="add-button"
              onClick={() => setActiveSection("details")}
            >
              Detay Ekle
            </button>
            <button
              className="add-button"
              onClick={() => setActiveSection("items")}
            >
              Malzeme Ekle
            </button>
            <button
              className="add-button"
              onClick={() => setActiveSection("nutrition")}
            >
              Besin Değeri Ekle
            </button>
          </div>

          {activeSection === "details" && (
            <div>
              <h3>Tarif Detayları</h3>
              {receiptDetails.map((detail, index) => (
                <div key={index} style={{ marginBottom: "5px" }}>
                  <input
                    type="text"
                    value={detail}
                    onChange={(e) => {
                      const newDetails = [...receiptDetails];
                      newDetails[index] = e.target.value;
                      setReceiptDetails(newDetails);
                    }}
                  />
                  <button onClick={() => handleRemoveDetail(index)}>Sil</button>
                </div>
              ))}
              <button onClick={handleAddDetail}>Detay Ekle</button>
            </div>
          )}

          {activeSection === "items" && (
            <div>
              <h3>Tarif Malzemeleri</h3>
              {receiptItems.map((item, index) => (
                <div key={index} className="item-container">
                  <input
                    type="text"
                    placeholder="Ürün Adı"
                    value={item.productName}
                    onChange={(e) => {
                      const newItems = [...receiptItems];
                      newItems[index].productName = e.target.value;
                      setReceiptItems(newItems);
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Birim"
                    value={item.unit}
                    onChange={(e) => {
                      const newItems = [...receiptItems];
                      newItems[index].unit = parseFloat(e.target.value);
                      setReceiptItems(newItems);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Tip"
                    value={item.type}
                    onChange={(e) => {
                      const newItems = [...receiptItems];
                      newItems[index].type = e.target.value;
                      setReceiptItems(newItems);
                    }}
                  />
                  <button onClick={() => handleRemoveItem(index)}>Sil</button>
                </div>
              ))}
              <button onClick={handleAddItem}>Malzeme Ekle</button>
            </div>
          )}

          {activeSection === "nutrition" && (
            <div>
              <h3>Besin Değerleri</h3>
              <div
                className="nutritional-container"
                style={{ justifyContent: "center" }}
              >
                {nutritionalValuesList.map((value, index) => (
                  <div key={index}>
                    <div>Tip : </div>
                    <input
                      type="text"
                      placeholder="Tip"
                      value={value.type}
                      onChange={(e) => {
                        const newValues = [...nutritionalValuesList];
                        newValues[index].type = e.target.value;
                        setNutritionalValuesList(newValues);
                      }}
                    />
                    <div>Birim : </div>
                    <input
                      type="number"
                      placeholder="Birim"
                      value={value.unit}
                      onChange={(e) => {
                        const newValues = [...nutritionalValuesList];
                        newValues[index].unit = parseFloat(e.target.value);
                        setNutritionalValuesList(newValues);
                      }}
                    />
                    <div> Yağ Miktarı : </div>
                    <input
                      type="number"
                      placeholder="Yağ Miktarı"
                      value={value.fatAmount}
                      onChange={(e) => {
                        const newValues = [...nutritionalValuesList];
                        newValues[index].fatAmount = parseFloat(e.target.value);
                        setNutritionalValuesList(newValues);
                      }}
                    />
                    <div> Karbonhidrat Miktarı :</div>
                    <input
                      type="number"
                      placeholder="Karbonhidrat Miktarı"
                      value={value.carbohydrateAmount}
                      onChange={(e) => {
                        const newValues = [...nutritionalValuesList];
                        newValues[index].carbohydrateAmount = parseFloat(
                          e.target.value
                        );
                        setNutritionalValuesList(newValues);
                      }}
                    />
                    <div>Protein Miktarı :</div>
                    <input
                      type="number"
                      placeholder="Protein Miktarı"
                      value={value.proteinAmount}
                      onChange={(e) => {
                        const newValues = [...nutritionalValuesList];
                        newValues[index].proteinAmount = parseFloat(
                          e.target.value
                        );
                        setNutritionalValuesList(newValues);
                      }}
                    />
                    <div>Kalori Miktarı :</div>
                    <input
                      type="number"
                      placeholder="Kalori Miktarı"
                      value={value.calorieAmount}
                      onChange={(e) => {
                        const newValues = [...nutritionalValuesList];
                        newValues[index].calorieAmount = parseFloat(
                          e.target.value
                        );
                        setNutritionalValuesList(newValues);
                      }}
                    />
                    <div></div>
                    <button onClick={() => handleRemoveNutritionalValue(index)}>
                      Sil
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ height: "5px" }}></div>
              <button onClick={handleAddNutritionalValue}>
                Besin Değeri Ekle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddReceiptModal;
