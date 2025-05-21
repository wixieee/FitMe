import React, { useState } from "react";
import "./search.css";

function UniversalSearchSection({ 
  filters = [], 
  onSearch, 
  typeOptions = [], 
  placeholder = "Пошук...", 
  showTypeFilter = true 
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [range, setRange] = useState(() => {
    const initial = {};
    filters.forEach(({ key, defaultRange = [0, 100] }) => {
      initial[key] = [...defaultRange];
    });
    return initial;
  });

  const handleRangeChange = (key, index, value) => {
    const newRange = { ...range };
    newRange[key][index] = Number(value);
    setRange(newRange);
  };

  const handleSubmit = () => {
    onSearch?.({
      searchTerm,
      selectedType,
      range
    });
  };

  return (
    <section className="recipe-search-section">
      <div className="search-row">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="search-btn" onClick={handleSubmit}>Пошук</button>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="filter-btn"
        >
          <i className="bx bx-filter-alt"></i>
        </button>
      </div>

      {showFilters && (
        <div className="filter-options">
          {showTypeFilter && (
            <div className="slider-group">
              <label>Тип:</label>
              <div className="range-inputs">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="">-- Виберіть --</option>
                  {typeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {filters.map(({ label, key, unit }) => (
            <div className="slider-group" key={key}>
              <label>
                {label}: {range[key][0]} - {range[key][1]} {unit || ""}
              </label>
              <div className="range-inputs">
                <input
                  type="number"
                  value={range[key][0]}
                  onChange={(e) => handleRangeChange(key, 0, e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  value={range[key][1]}
                  onChange={(e) => handleRangeChange(key, 1, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default UniversalSearchSection;
