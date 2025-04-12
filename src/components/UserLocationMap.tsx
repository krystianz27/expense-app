import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, Icon } from "leaflet"; // Importujemy Icon z Leaflet
import "leaflet/dist/leaflet.css";

const UserLocationMap: React.FC = () => {
  const [location, setLocation] = useState<LatLngExpression | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation([latitude, longitude]);
        },
        (err) => {
          setError("Nie udało się pobrać lokalizacji");
        },
      );
    } else {
      setError("Geolokalizacja jest niedostępna w Twojej przeglądarce");
    }
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  // Tworzymy niestandardową ikonę pinezki
  const userLocationIcon = new Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png", // Standardowa ikona pinezki
    iconSize: [25, 41], // Rozmiar ikony
    iconAnchor: [12, 41], // Punkt kotwiczenia ikony (gdzie "stoi" marker)
    popupAnchor: [0, -41], // Punkt wyświetlania popupa
  });

  return (
    <div style={{ height: "600px", width: "100%" }}>
      {location ? (
        <MapContainer
          center={location}
          zoom={13}
          style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Użycie standardowej ikony pinezki jako ikona markera */}
          <Marker position={location} icon={userLocationIcon}>
            <Popup>Twoja lokalizacja</Popup>
          </Marker>
          {/* Okrąg wokół lokalizacji z lekką przezroczystością */}
          {/* <Circle
            center={location}
            radius={200} // Promień okręgu
            color="blue"
            fillColor="blue"
            fillOpacity={0.2}
          /> */}
        </MapContainer>
      ) : (
        <div>Ładowanie mapy...</div>
      )}
    </div>
  );
};

export default UserLocationMap;
