import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with React
// This implementation ensures the marker icon is correctly loaded without needing external asset imports
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export const MapFooter: React.FC = () => {
    const { t } = useTranslation();
    const position: [number, number] = [47.07237, 28.861773];

    return (
        <div className="h-[250px] w-full rounded-xl overflow-hidden shadow-lg border border-white/20 relative z-10">
            <MapContainer
                center={position}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup className="font-sans text-sm">
                        <div className="text-center p-2">
                            <strong className="block text-host-blue font-bold mb-1 text-base">{t('map.school_name')}</strong>
                            <span className="text-gray-600 block text-xs">{t('map.address')}</span>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>

            {/* Overlay to match theme - subtle blue tint on hover or always */}
            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/10 rounded-xl"></div>
        </div>
    );
};
