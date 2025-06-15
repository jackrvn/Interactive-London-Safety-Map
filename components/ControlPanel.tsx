import React, { useState } from 'react';

type ControlPanelProps = {
  cellSize: number;
  onCellSizeChange: (value: number) => void;
  selectedCrimes: Set<string>;
  onCrimeToggle: (crime: string) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
  crimeTypes: string[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  availableMonths: string[];
  isPlaying: boolean;
  onPlayPauseToggle: () => void;
  animationSpeed: number;
  onSpeedChange: (speed: number) => void;
  isVisible: boolean;
  onClose: () => void;
  onOpen: () => void;
};

export function ControlPanel({
  cellSize,
  onCellSizeChange,
  selectedCrimes,
  onCrimeToggle,
  onSelectAll,
  onSelectNone,
  crimeTypes,
  selectedMonth,
  onMonthChange,
  availableMonths,
  isPlaying,
  onPlayPauseToggle,
  animationSpeed,
  onSpeedChange,
  isVisible,
  onClose,
  onOpen
}: ControlPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.replace('.json', '').split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  };

  const monthIndex = availableMonths.indexOf(selectedMonth);

  if (!isVisible) {
    return (
      <button 
        className="control-panel__show-button"
        onClick={onOpen}
      >
        Show Controls
      </button>
    );
  }

  return (
    <div className="control-panel">
      <div className="control-panel__header">
        <button
          onClick={onClose}
          className="control-panel__hide-button"
        >
          Hide Panel
        </button>
      </div>
      
      <div className="control-panel__section">
        <label className="time-control__header">
          Time Period: <span style={{ float: 'right' }}>{formatMonth(selectedMonth)}</span>
          <div className="time-control__slider-container">
            <input
              type="range"
              min={0}
              max={availableMonths.length - 1}
              value={monthIndex}
              onChange={(e) => onMonthChange(availableMonths[Number(e.target.value)])}
              className="time-control__slider"
            />
            <button
              onClick={onPlayPauseToggle}
              className="time-control__button"
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
          </div>
        </label>
        <div className="speed-control">
          <label className="speed-control__label">
            Animation Speed:
          </label>
          <input
            type="number"
            min="1"
            max="6"
            value={animationSpeed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="speed-control__input"
          />
          <span className="speed-control__unit">x</span>
        </div>
      </div>

      <div className="control-panel__section">
        <div 
          className="crime-types__header"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>Crime Types {isExpanded ? '▼' : '▶'}</span>
          <div onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onSelectAll}
              className="crime-types__button"
            >
              Select All
            </button>
            <button
              onClick={onSelectNone}
              className="crime-types__button"
            >
              Clear All
            </button>
          </div>
        </div>
        {isExpanded && (
          <div className="crime-types__list">
            {crimeTypes.map(crime => (
              <label
                key={crime}
                className="crime-types__item"
              >
                <input
                  type="checkbox"
                  checked={selectedCrimes.has(crime)}
                  onChange={() => onCrimeToggle(crime)}
                  className="crime-types__checkbox"
                />
                {crime}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="cell-size__control">
        <label>
          Cell Size: {cellSize}px
          <input
            type="range"
            min="10"
            max="100"
            value={cellSize}
            onChange={(e) => onCellSizeChange(Number(e.target.value))}
            className="cell-size__slider"
          />
        </label>
      </div>
    </div>
  );
}