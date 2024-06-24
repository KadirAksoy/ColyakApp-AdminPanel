// SuggestionCard.js

import React, { useState } from "react";
import { Suggestion } from "../../utils/types";
import { API } from "../../services/apiUrls";
import { useTokenReset } from "../../services/loginHandleToToken";

interface SuggestionCardProps {
  suggestion: Suggestion;
  onDelete: (id: number) => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  suggestion,
  onDelete,
}) => {
  const api = useTokenReset();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDelete = async () => {
    try {
      await api.delete(
        `${API.BASE_URL}${API.SUGGESTIONS.DELETE}${suggestion.suggestionId}`
      );
      onDelete(suggestion.suggestionId);
    } catch (error) {
      console.error("Error deleting suggestion:", error);
    }
  };

  return (
    <div className="suggestion-card">
      {showConfirmation && (
        <div className="confirmation-dialog">
          <p>Silmek istediğinizden emin misiniz?</p>
          <button onClick={handleDelete}>Evet</button>
          <button onClick={() => setShowConfirmation(false)}>Hayır</button>
        </div>
      )}
      <button
        className="delete-button"
        onClick={() => setShowConfirmation(true)}
      >
        Sil
      </button>
      <h3>{suggestion.suggestion}</h3>
      <p>
        <strong>Kullanıcı: </strong> {suggestion.userName}
      </p>
      <p>
        <strong>Tarih:</strong>{" "}
        {new Date(suggestion.createdDate).toLocaleString()}
      </p>
    </div>
  );
};

export default SuggestionCard;
