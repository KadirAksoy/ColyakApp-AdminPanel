import React, { useState, useEffect } from "react";
import { Upload, Button, message } from "antd";
import { Barcode, NutritionalValue } from "../../utils/types";
import { API } from "../../services/apiUrls";
import { useTokenReset } from "../../services/loginHandleToToken";
import "../../css/AddBarcodeModal.css";

interface AddBarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newBarcode: Barcode) => void;
}

const AddBarcodeModal: React.FC<AddBarcodeModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState<string>("");
  const [code, setCode] = useState<number>(0);
  const [glutenFree, setGlutenFree] = useState<boolean>(false);
  const [imageId, setImageId] = useState<number | null>(null);
  const [nutritionalValues, setNutritionalValues] = useState<
    NutritionalValue[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const api = useTokenReset();

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setName("");
    setCode(0);
    setGlutenFree(false);
    setImageId(null);
    setNutritionalValues([]);
    setLoading(false);
  };

  const handleAddNutritionalValue = () => {
    setNutritionalValues([
      ...nutritionalValues,
      {
        id: Date.now(),
        type: "",
        unit: 0,
        fatAmount: 0,
        carbohydrateAmount: 0,
        proteinAmount: 0,
        calorieAmount: 0,
      },
    ]);
  };

  const handleRemoveNutritionalValue = (id: number) => {
    setNutritionalValues(nutritionalValues.filter((nv) => nv.id !== id));
  };

  const handleNutritionalValueChange = (
    index: number,
    field: keyof NutritionalValue,
    value: any
  ) => {
    const updatedValues = [...nutritionalValues];
    updatedValues[index] = { ...updatedValues[index], [field]: value };
    setNutritionalValues(updatedValues);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Ekleme işlemi devam ederken tekrar eklemeyi engelle

    setLoading(true);

    if (!imageId) {
      alert("Lütfen bir resim yükleyin.");
      setLoading(false);
      return;
    }

    const newBarcode: Barcode = {
      id: Date.now(),
      name,
      code,
      glutenFree,
      imageId,
      nutritionalValuesList: nutritionalValues,
    };

    try {
      onAdd(newBarcode); // Yeni barkodu parent component'e ilet
      onClose();
    } catch (error) {
      console.error(error);
      alert("Barkod eklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Barkod Ekle</h2>
        <form onSubmit={handleSubmit}>
          <label>
            İsim:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Kod:
            <input
              type="number"
              value={code}
              onChange={(e) => setCode(parseInt(e.target.value))}
            />
          </label>
          <label>
            <span style={{ fontSize: "18px" }}>Glutenli mi ? : </span>
            <input
              type="checkbox"
              checked={glutenFree}
              onChange={(e) => setGlutenFree(e.target.checked)}
            />
          </label>
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
              onChange={(info) => {
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
                  message.error(
                    `${info.file.name} yüklenirken bir hata oluştu.`
                  );
                }
              }}
            >
              <Button type="primary">Fotoğraf Yükle</Button>
            </Upload>
          </label>
          <div className="nutritional-values">
            <h3>Besin Değerleri</h3>
            {nutritionalValues.map((nv, index) => (
              <div key={nv.id} className="nutritional-value">
                <label>
                  Besin Değeri Tipi:
                  <input
                    type="text"
                    value={nv.type}
                    onChange={(e) =>
                      handleNutritionalValueChange(
                        index,
                        "type",
                        e.target.value
                      )
                    }
                  />
                </label>
                <label>
                  Besin Değeri Miktarı:
                  <input
                    type="number"
                    value={nv.unit}
                    onChange={(e) =>
                      handleNutritionalValueChange(
                        index,
                        "unit",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </label>
                <label>
                  Yağ Miktarı:
                  <input
                    type="number"
                    value={nv.fatAmount}
                    onChange={(e) =>
                      handleNutritionalValueChange(
                        index,
                        "fatAmount",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </label>
                <label>
                  Karbonhidrat Miktarı:
                  <input
                    type="number"
                    value={nv.carbohydrateAmount}
                    onChange={(e) =>
                      handleNutritionalValueChange(
                        index,
                        "carbohydrateAmount",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </label>
                <label>
                  Protein Miktarı:
                  <input
                    type="number"
                    value={nv.proteinAmount}
                    onChange={(e) =>
                      handleNutritionalValueChange(
                        index,
                        "proteinAmount",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </label>
                <label>
                  Kalori Miktarı:
                  <input
                    type="number"
                    value={nv.calorieAmount}
                    onChange={(e) =>
                      handleNutritionalValueChange(
                        index,
                        "calorieAmount",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </label>
                <button
                  type="button"
                  onClick={() => handleRemoveNutritionalValue(nv.id)}
                >
                  Sil
                </button>
              </div>
            ))}
            <div className="add-button-container">
              <button type="button" onClick={handleAddNutritionalValue}>
                Besin Değeri Ekle
              </button>
              <button type="submit" disabled={loading}>
                {loading ? "Ekleniyor..." : "Ekle"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBarcodeModal;
