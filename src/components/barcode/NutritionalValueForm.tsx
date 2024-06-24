import React from "react";

interface NutritionalValueFormProps {
  index: number;
  nutritionalValue: any;
  onChange: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
}

const NutritionalValueForm: React.FC<NutritionalValueFormProps> = ({
  index,
  nutritionalValue,
  onChange,
  onRemove,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onChange(index, e.target.name, e.target.value);
  };

  const handleRemove = () => {
    onRemove(index);
  };

  return (
    <div>
      <label>
        Tip:
        <input
          type="text"
          name={`type_${index}`}
          value={nutritionalValue.type}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Birim:
        <input
          type="text"
          name={`unit_${index}`}
          value={nutritionalValue.unit}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Yağ:
        <input
          type="number"
          name={`fatAmount_${index}`}
          value={nutritionalValue.fatAmount}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Karbonhidrat:
        <input
          type="number"
          name={`carbohydrateAmount_${index}`}
          value={nutritionalValue.carbohydrateAmount}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Protein:
        <input
          type="number"
          name={`proteinAmount_${index}`}
          value={nutritionalValue.proteinAmount}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Kalori:
        <input
          type="number"
          name={`calorieAmount_${index}`}
          value={nutritionalValue.calorieAmount}
          onChange={handleChange}
          required
        />
      </label>
      <button type="button" onClick={handleRemove}>
        Sil
      </button>
    </div>
  );
};

export default NutritionalValueForm;
