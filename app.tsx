import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {createRoot} from 'react-dom/client';
import {Map} from 'react-map-gl/maplibre';
import {DeckGL} from '@deck.gl/react';
import {
  ScreenGridLayer,
  ScreenGridLayerPickingInfo,
} from "@deck.gl/aggregation-layers";

import { ControlPanel } from './components/ControlPanel';
import { ColorKey } from './components/ColorKey';
import { DataSource } from './components/DataSource';

import type {Color, MapViewState} from '@deck.gl/core';

const CRIME_TYPES = [
  "Anti-social behaviour",
  "Bicycle theft",
  "Burglary",
  "Criminal damage and arson",
  "Drugs",
  "Possession of weapons",
  "Public order",
  "Robbery",
  "Shoplifting",
  "Theft from the person",
  "Vehicle crime",
  "Violence and sexual offences",
  "Other crime",
  "Other theft",
];

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: -0.128217,
  latitude: 51.508045,
  zoom: 11,
  maxZoom: 16,
  pitch: 0,
  bearing: 0,
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const colorRange: Color[] = [
  [255, 255, 178, 25],
  [254, 217, 118, 85],
  [254, 178, 76, 127],
  [253, 141, 60, 170],
  [240, 59, 32, 212],
  [189, 0, 38, 255]
];

type DataPoint = {
  Longitude: number;
  Latitude: number;
  Crime: string;
  Count: number;
};

function getTooltip({ object }: ScreenGridLayerPickingInfo<DataPoint>) {
  return object && `Count: ${object.value}`;
}

const AVAILABLE_MONTHS = Array.from({ length: 36 }, (_, i) => {
  const date = new Date(2022, 3 + i);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}.json`;
}).filter(month => {
  const [year, monthStr] = month.replace('.json', '').split('-');
  const date = new Date(parseInt(year), parseInt(monthStr) - 1);
  return date <= new Date(2025, 2);
});

const LATEST_MONTH = AVAILABLE_MONTHS[AVAILABLE_MONTHS.length - 1];

export default function App({
  initialCellSize = 20,
  gpuAggregation = true,
  mapStyle = MAP_STYLE
}: {
  initialCellSize?: number;
  gpuAggregation?: boolean;
  aggregation?: 'SUM' | 'MEAN' | 'MIN' | 'MAX';
  mapStyle?: string;
}) {
  const [cellSize, setCellSize] = useState(initialCellSize);
  const [selectedCrimes, setSelectedCrimes] = useState<string[]>(CRIME_TYPES);
  const [loadedData, setLoadedData] = useState<DataPoint[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(LATEST_MONTH);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(3);

  const currentMonthIndex = AVAILABLE_MONTHS.indexOf(selectedMonth);

  useEffect(() => {
    fetch(`/data/${selectedMonth}`)
      .then(response => response.json())
      .then(json => setLoadedData(json));
  }, [selectedMonth]);

  const filteredData = useMemo(() => {
    return loadedData.filter(d => selectedCrimes.includes(d.Crime));
  }, [loadedData, selectedCrimes]);

  const handleCrimeToggle = (crime: string) => {
    setSelectedCrimes(prevSelected => {
      if (prevSelected.includes(crime)) {
        return prevSelected.filter(c => c !== crime);
      } else {
        return [...prevSelected, crime];
      }
    });
  };

  const handlePlayPauseToggle = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const intervalDuration = 2000 / animationSpeed;
    
    const interval = setInterval(() => {
      setSelectedMonth(prevMonth => {
        const currentIndex = AVAILABLE_MONTHS.indexOf(prevMonth);
        const nextIndex = (currentIndex + 1) % AVAILABLE_MONTHS.length;
        return AVAILABLE_MONTHS[nextIndex];
      });
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [isPlaying, animationSpeed]);

  useEffect(() => {
    if (currentMonthIndex === AVAILABLE_MONTHS.length - 1 && isPlaying) {
      setIsPlaying(false);
    }
  }, [currentMonthIndex, isPlaying]);

  const layers = [
    new ScreenGridLayer<DataPoint>({
      id: "grid",
      data: filteredData,
      opacity: 0.8,
      getPosition: (d: DataPoint) => [d.Longitude, d.Latitude],
      getWeight: (d: DataPoint) => d.Count,
      cellSizePixels: cellSize,
      colorRange,
      gpuAggregation,
      pickable: true,
      updateTriggers: {
        getPosition: [selectedCrimes],
        getWeight: [selectedCrimes]
      }
    }),
  ];

  return (
    <>
      <DeckGL
        layers={layers}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        getTooltip={getTooltip}
        pickingRadius={5}
      >
        <Map reuseMaps mapStyle={mapStyle} />
      </DeckGL>
      <ColorKey colorRange={colorRange} />
      <ControlPanel
        cellSize={cellSize}
        onCellSizeChange={setCellSize}
        selectedCrimes={new Set(selectedCrimes)}
        onCrimeToggle={handleCrimeToggle}
        onSelectAll={() => setSelectedCrimes(CRIME_TYPES)}
        onSelectNone={() => setSelectedCrimes([])}
        crimeTypes={CRIME_TYPES}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        availableMonths={AVAILABLE_MONTHS}
        isPlaying={isPlaying}
        onPlayPauseToggle={handlePlayPauseToggle}
        animationSpeed={animationSpeed}
        onSpeedChange={setAnimationSpeed}
      />
      <DataSource />
    </>
  );
}

export function renderToDOM(container: HTMLDivElement) {
  createRoot(container).render(<App />);
}
