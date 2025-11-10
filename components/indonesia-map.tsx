"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Data koordinat provinsi Indonesia
const provinsiCoordinates: Record<string, [number, number]> = {
  'Aceh': [4.695135, 96.749397],
  'Sumatera Utara': [2.1153547, 99.5450974],
  'Sumatera Barat': [-0.7399397, 100.8000051],
  'Riau': [0.2933469, 101.7068294],
  'Kepulauan Riau': [0.9142691, 104.4426316],
  'Jambi': [-1.4851831, 103.6170891],
  'Sumatera Selatan': [-3.3194374, 103.9145314],
  'Bangka Belitung': [-2.7410513, 106.4405872],
  'Bengkulu': [-3.5778471, 102.3463875],
  'Lampung': [-4.5585849, 105.4068079],
  'DKI Jakarta': [-6.1753942, 106.827183],
  'Jawa Barat': [-6.9147444, 107.6098297],
  'Jawa Tengah': [-7.150975, 110.1402594],
  'DI Yogyakarta': [-7.8753849, 110.4262088],
  'Jawa Timur': [-7.5360639, 112.2384017],
  'Banten': [-6.4058172, 106.0640179],
  'Bali': [-8.4095178, 115.188916],
  'Nusa Tenggara Barat': [-8.6529334, 117.3616476],
  'Nusa Tenggara Timur': [-8.6573819, 121.0793705],
  'Kalimantan Barat': [-0.2787808, 111.4752851],
  'Kalimantan Tengah': [-1.6814878, 113.3823545],
  'Kalimantan Selatan': [-3.0926415, 115.2837585],
  'Kalimantan Timur': [1.6406296, 116.419389],
  'Kalimantan Utara': [3.0730929, 116.0413889],
  'Sulawesi Utara': [0.6246932, 123.9750018],
  'Sulawesi Tengah': [-1.4300254, 121.4456179],
  'Sulawesi Selatan': [-3.6687994, 119.9740534],
  'Sulawesi Tenggara': [-4.14491, 122.174605],
  'Gorontalo': [0.6999372, 122.4467238],
  'Sulawesi Barat': [-2.8441371, 119.2320784],
  'Maluku': [-3.2384616, 130.1452734],
  'Maluku Utara': [1.5709993, 127.8087693],
  'Papua': [-4.269928, 138.0803529],
  'Papua Barat': [-1.3361154, 133.1747162],
  'Papua Selatan': [-4.9894, 140.7713],
  'Papua Tengah': [-3.4, 136.9],
  'Papua Pegunungan': [-4.0814, 138.9543],
  'Papua Barat Daya': [-1.6885, 132.2821]
};

// Nama provinsi alternatif untuk pencocokan yang lebih fleksibel
const provinsiAliases: Record<string, string> = {
  'DKI Jakarta': 'Jakarta',
  'DI Yogyakarta': 'Yogyakarta',
  'Kepulauan Bangka Belitung': 'Bangka Belitung',
  'Kepulauan Riau': 'Kepri'
};

interface IndonesiaMapProps {
  provinsiStats: Record<string, number>;
  className?: string;
}

// Custom icon creator based on count
const createNumberIcon = (count: number, maxCount: number) => {
  // Calculate relative size based on count
  const minSize = 25;
  const maxSize = 50;
  const size = Math.max(minSize, Math.min(maxSize, (count / maxCount) * maxSize));
  
  // Color intensity based on count
  const intensity = Math.min(1, count / maxCount);
  const red = Math.floor(255 * intensity);
  const blue = Math.floor(255 * (1 - intensity));
  
  return L.divIcon({
    className: 'custom-number-icon',
    html: `
      <div style="
        background: rgba(${red}, 100, ${blue}, 0.8);
        border: 2px solid white;
        border-radius: 50%;
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: ${Math.max(10, size / 3)}px;
        color: white;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.7);
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        ${count}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Component to fit map bounds
function MapBounds({ markers }: { markers: Array<{ position: [number, number] }> }) {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      const group = L.featureGroup(
        markers.map(marker => L.marker(marker.position))
      );
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [map, markers]);

  return null;
}

export function IndonesiaMap({ provinsiStats, className = "" }: IndonesiaMapProps) {
  const [isClient, setIsClient] = React.useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={`h-96 bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  // Find matching provinces and create markers
  const markers = [];
  const maxCount = Math.max(...Object.values(provinsiStats));

  for (const [provinsiName, count] of Object.entries(provinsiStats)) {
    // Try to find coordinates for this province
    let coordinates = provinsiCoordinates[provinsiName];
    
    // If not found, try aliases
    if (!coordinates) {
      const alias = Object.keys(provinsiAliases).find(key => 
        provinsiAliases[key].toLowerCase() === provinsiName.toLowerCase()
      );
      if (alias) {
        coordinates = provinsiCoordinates[alias];
      }
    }
    
    // If still not found, try partial matching
    if (!coordinates) {
      const matchingKey = Object.keys(provinsiCoordinates).find(key =>
        key.toLowerCase().includes(provinsiName.toLowerCase()) ||
        provinsiName.toLowerCase().includes(key.toLowerCase())
      );
      if (matchingKey) {
        coordinates = provinsiCoordinates[matchingKey];
      }
    }

    if (coordinates && count > 0) {
      markers.push({
        position: coordinates,
        provinsi: provinsiName,
        count: count
      });
    }
  }

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={[-2.5, 118]} // Center of Indonesia
        zoom={5}
        className="h-96 w-full rounded-lg"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            icon={createNumberIcon(marker.count, maxCount)}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold">{marker.provinsi}</h3>
                <p className="text-sm text-gray-600">
                  {marker.count} konsultasi
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        <MapBounds markers={markers} />
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg border z-[1000]">
        <h4 className="text-sm font-semibold mb-2">Jumlah Konsultasi</h4>
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 mr-1"></div>
            <span>Rendah</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-1"></div>
            <span>Tinggi</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Ukuran lingkaran = jumlah konsultasi
        </div>
      </div>
    </div>
  );
}
