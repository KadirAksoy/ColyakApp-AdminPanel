import React, { useState, useEffect } from "react";
import { Barcode, NutritionalValue } from "../utils/types";
import { API } from "../services/apiUrls";
import { useTokenReset } from "../services/loginHandleToToken";
import BarcodeCard from "../components/barcode/BarcodeCard";
import BarcodeDetailsModal from "../components/barcode/BarcodeDetailsModal";
import DeleteBarcodeModal from "../components/barcode/DeleteBarcodeModal";
import AddBarcodeModal from "../components/barcode/AddBarcodeModal";
import SearchBar from "../components/barcode/SearchBar";
import "../css/BarcodePage.css";
import UpdateBarcodeModal from "../components/barcode/UpdateBarcodeModal ";
const BarcodePage: React.FC = () => {
  const [barcodes, setBarcodes] = useState<Barcode[]>([]);
  const [filteredBarcodes, setFilteredBarcodes] = useState<Barcode[]>([]);
  const [selectedBarcode, setSelectedBarcode] = useState<Barcode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [barcodeToDelete, setBarcodeToDelete] = useState<Barcode | null>(null);
  const [barcodeToUpdate, setBarcodeToUpdate] = useState<Barcode | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const api = useTokenReset();

  const fetchBarcodes = async () => {
    try {
      const response = await api.get(API.BARCODES.GET_ALL);
      console.log(response.data);
      setBarcodes(response.data);
      setFilteredBarcodes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBarcodeById = async (id: string) => {
    try {
      const response = await api.get(API.BARCODES.GET_BY_ID + id);
      console.log(response.data);
      setSelectedBarcode(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBarcodeById = async (id: string) => {
    try {
      await api.delete(API.BARCODES.DELETE + id);
      setBarcodes(barcodes.filter((barcode) => barcode.id !== parseInt(id)));
      setFilteredBarcodes(
        filteredBarcodes.filter((barcode) => barcode.id !== parseInt(id))
      );
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBarcodes();
  }, []);

  useEffect(() => {
    const filtered = barcodes.filter((barcode) =>
      barcode.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredBarcodes(filtered);
  }, [searchValue, barcodes]);

  const handleDetailsClick = (barcode: Barcode) => {
    fetchBarcodeById(barcode.id.toString());
    setIsModalOpen(true);
  };

  const handleDeleteClick = (barcode: Barcode) => {
    setBarcodeToDelete(barcode);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateClick = (barcode: Barcode) => {
    setBarcodeToUpdate(barcode);
    setIsUpdateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBarcode(null);
  };

  const handleConfirmDelete = () => {
    if (barcodeToDelete) {
      deleteBarcodeById(barcodeToDelete.id.toString());
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setBarcodeToDelete(null);
  };

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleUpdateModalClose = () => {
    setIsUpdateModalOpen(false);
  };

  const handleAddBarcode = async (newBarcode: Barcode) => {
    try {
      const response = await api.post(API.BARCODES.POST, newBarcode);
      setBarcodes([...barcodes, response.data]);
      setFilteredBarcodes([...barcodes, response.data]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateBarcode = (updatedBarcode: Barcode) => {
    setBarcodes(
      barcodes.map((barcode) =>
        barcode.id === updatedBarcode.id ? updatedBarcode : barcode
      )
    );
    setFilteredBarcodes(
      filteredBarcodes.map((barcode) =>
        barcode.id === updatedBarcode.id ? updatedBarcode : barcode
      )
    );
    setIsUpdateModalOpen(false);
  };

  return (
    <div className="barcode-page">
      <h1 style={{ textAlign: "center" }}>Barkodlar</h1>
      <div className="header-container">
        <button className="add-barcode-button" onClick={handleAddClick}>
          Barkod Ekle
        </button>
        <SearchBar value={searchValue} onChange={setSearchValue} />
      </div>
      <div className="barcode-list">
        {filteredBarcodes.map((barcode) => (
          <BarcodeCard
            key={barcode.id}
            barcode={barcode}
            onDetailsClick={handleDetailsClick}
            onDeleteClick={handleDeleteClick}
            onUpdateClick={handleUpdateClick}
          />
        ))}
      </div>
      <BarcodeDetailsModal
        isOpen={isModalOpen}
        barcode={selectedBarcode}
        onClose={handleCloseModal}
      />
      <DeleteBarcodeModal
        isOpen={isDeleteModalOpen}
        barcode={barcodeToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <AddBarcodeModal
        isOpen={isAddModalOpen}
        onClose={handleAddModalClose}
        onAdd={handleAddBarcode}
      />
      <UpdateBarcodeModal
        isOpen={isUpdateModalOpen}
        barcode={barcodeToUpdate}
        onClose={handleUpdateModalClose}
        onUpdate={handleUpdateBarcode}
      />
    </div>
  );
};

export default BarcodePage;
