import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { LatLngExpression, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

// Niestandardowa ikona dla lokalizacji użytkownika
const userLocationIcon = new Icon({
  iconUrl: "/path/to/your-icon.png", // Wskaż swoją ikonę lokalizacji
  iconSize: [30, 30], // Rozmiar ikony
  iconAnchor: [15, 30], // Punkt kotwiczenia ikony
  popupAnchor: [0, -30], // Punkt, w którym wyświetli się popup
});

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
          <Marker position={location} icon={userLocationIcon}>
            <Popup>Twoja lokalizacja</Popup>
          </Marker>
          {/* Okrąg wokół lokalizacji z lekką przezroczystością */}
          <Circle
            center={location}
            radius={200} // Promień okręgu (możesz dostosować)
            color="blue"
            fillColor="blue"
            fillOpacity={0.2}
          />
        </MapContainer>
      ) : (
        <div>Ładowanie mapy...</div>
      )}
    </div>
  );
};

export default UserLocationMap;
