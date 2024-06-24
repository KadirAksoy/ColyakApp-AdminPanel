import React, { useState, useEffect } from "react";
import ReceiptCard from "../components/receipt/ReceiptCard"; // Ensure the path is correct
import { API } from "../services/apiUrls";
import { useTokenReset } from "../services/loginHandleToToken";
import { Receipt } from "../utils/types"; // Ensure the path is correct
import "../css/RecieptPage.css";
import SearchBar from "../components/receipt/SearchBar";
import ReceiptDetailsModal from "../components/receipt/ReceiptDetailsModal"; // Ensure the path is correct
import DeleteConfirmationModal from "../components/receipt/DeleteConfirmationModal"; // Ensure the path is correct
import AddReceiptModal from "../components/receipt/AddReceiptModal"; // Ensure the path is correct
import UpdateReceiptModal from "../components/receipt/UpdateReceiptModal"; // Ensure the path is correct

const RecipePage: React.FC = () => {
  const api = useTokenReset();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [receiptToDelete, setReceiptToDelete] = useState<Receipt | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [receiptToUpdate, setReceiptToUpdate] = useState<Receipt | null>(null);

  const getReceipts = async () => {
    try {
      const response = await api.get(API.RECEIPTS.GET_ALL);
      setReceipts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getReceipts();
  }, []);

  const handleViewDetails = (id: number) => {
    const receipt = receipts.find((receipt) => receipt.id === id);
    setSelectedReceipt(receipt || null);
  };

  const handleUpdate = (id: number) => {
    const receipt = receipts.find((receipt) => receipt.id === id);
    setReceiptToUpdate(receipt || null);
  };

  const handleDelete = async () => {
    if (receiptToDelete) {
      try {
        await api.delete(`${API.RECEIPTS.DELETE}${receiptToDelete.id}`);
        setReceipts(
          receipts.filter((receipt) => receipt.id !== receiptToDelete.id)
        );
        setReceiptToDelete(null);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleAddReceipt = async () => {
    setShowAddModal(true);
  };

  const handleReceiptAdded = () => {
    getReceipts();
  };

  const handleReceiptUpdated = () => {
    getReceipts();
  };

  const filteredReceipts = receipts.filter((receipt) =>
    receipt.receiptName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="recipe-page">
      <h1 style={{ textAlign: "center" }}>Tarifler</h1>
      <div className="header-container">
        <button className="add-receipt-button" onClick={handleAddReceipt}>
          Tarif Ekle
        </button>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>
      <div className="receipts-list">
        {filteredReceipts.map((receipt) => (
          <ReceiptCard
            key={receipt.id}
            receipt={receipt}
            onViewDetails={handleViewDetails}
            onUpdate={handleUpdate}
            onDelete={() => setReceiptToDelete(receipt)}
          />
        ))}
      </div>
      {selectedReceipt && (
        <ReceiptDetailsModal
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
      {receiptToDelete && (
        <DeleteConfirmationModal
          receiptName={receiptToDelete.receiptName}
          onDeleteConfirm={handleDelete}
          onClose={() => setReceiptToDelete(null)}
        />
      )}
      {showAddModal && (
        <AddReceiptModal
          onClose={() => setShowAddModal(false)}
          onReceiptAdded={handleReceiptAdded}
        />
      )}
      {receiptToUpdate && (
        <UpdateReceiptModal
          receipt={receiptToUpdate}
          onClose={() => setReceiptToUpdate(null)}
          onReceiptUpdated={handleReceiptUpdated}
        />
      )}
    </div>
  );
};

export default RecipePage;
