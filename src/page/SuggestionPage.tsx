import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../services/apiUrls";
import { Suggestion } from "../utils/types";
import { useTokenReset } from "../services/loginHandleToToken";
import "../css/SuggestionPage.css";
import SuggestionCard from "../components/suggestions/SuggestionCard";

const SuggestionPage: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const api = useTokenReset();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await api.get(
          `${API.BASE_URL}${API.SUGGESTIONS.GET_ALL}`
        );
        setSuggestions(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    fetchSuggestions();
  }, []);

  // Silme işlemini gerçekleştirir ve ardından güncellenmiş öneri listesini ayarlar
  const handleDeleteSuggestion = async (id: number) => {
    try {
      await api.delete(`${API.BASE_URL}${API.SUGGESTIONS.DELETE}${id}`);
      setSuggestions((prevSuggestions) =>
        prevSuggestions.filter((suggestion) => suggestion.suggestionId !== id)
      );
    } catch (error) {
      console.error("Error deleting suggestion:", error);
    }
  };

  return (
    <div className="suggestion-page">
      {suggestions.map((suggestion) => (
        <SuggestionCard
          key={suggestion.suggestionId}
          suggestion={suggestion}
          onDelete={handleDeleteSuggestion} // Silme işlevselliğini tanımlar
        />
      ))}
    </div>
  );
};

export default SuggestionPage;
