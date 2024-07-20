import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L, { Control } from "leaflet";
import "leaflet-routing-machine";
import { API_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import AlertTitle from '@mui/material/AlertTitle';
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

interface Photo {
  _id: string;
  path: string;
  geolocation: {
    latitude: number;
    longitude: number;
  };
}

interface MapProps {
  route: { latitude: number; longitude: number }[];
  userLocation: { lat: number; lng: number } | null;
  selectLocationMode?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
}

const createIcon = (photoPath: string) => {
  const svgIcon = `
    <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="clipCircle">
          <circle cx="30" cy="30" r="28" fill="#FFFFFF" />
        </clipPath>
      </defs>
      <circle cx="30" cy="30" r="30" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
      <image href="${API_URL}/uploads/${photoPath}" x="2" y="2" height="56" width="56" clip-path="url(#clipCircle)" />
    </svg>
  `;
  return L.divIcon({
    html: svgIcon,
    className: "",
    iconSize: [60, 60],
    iconAnchor: [30, 30],
  });
};

const RoutingControl = ({
  route,
}: {
  route: { latitude: number; longitude: number }[];
}) => {
  const map = useMapEvents({});
  const control = useRef<Control | null>(null);

  useEffect(() => {
    if (route.length > 1) {
      if (control.current) {
        map.removeControl(control.current);
      }

      const waypoints = route.map((point) =>
        L.latLng(point.latitude, point.longitude)
      );

      control.current = L.Routing.control({
        waypoints,
        routeWhileDragging: true,
        showAlternatives: false,
        waypointMode: "snap", // Snap the route to roads
        addWaypoints: false,
        fitSelectedRoutes: true,
        show: false,
      }).addTo(map);
      // control.current.hide(); there is some issue with styles, because class to hide control is added
    }
  }, [route, map]);

  // https://gis.stackexchange.com/questions/324016/leaflet-routing-machine-show-option-doesnt-work
  document.getElementsByClassName("leaflet-control-container")[0]?.remove();
  return null;
};

const LocationSelector: React.FC<{
  onLocationSelect: (lat: number, lng: number) => void;
}> = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const Map: React.FC<MapProps> = ({
  route,
  userLocation,
  selectLocationMode,
  onLocationSelect,
}) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [questRoute, setQuestRoute] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const mapRef = useRef<L.Map>(null);
  const navigate = useNavigate();
  const currentQuest = useSelector<RootState>(
    (state) => state.quests.currentQuestId
  );

  useEffect(() => {
    if (currentQuest) {
      const fetchPhotos = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`${API_URL}/photos`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { questId: currentQuest },
          });
          const photosData = response.data;
          if (photosData.length <= 1 || photosData.some((photo: Photo) => !photo.geolocation)){
            setIsErrorVisible(true);
            return;
          } else {
            setIsErrorVisible(false);
          }
          setPhotos(photosData);
          const routeData = photosData.map((photo: Photo) => ({
            latitude: photo.geolocation.latitude,
            longitude: photo.geolocation.longitude,
          }));
          setQuestRoute(routeData);
        } catch (error: any) {
          console.error("Error fetching photos:", error);
          if (error.response && error.response.status === 401) {
            navigate("/login");
          }
        }
      };
      fetchPhotos();
    }
  }, [currentQuest, navigate]);

  useEffect(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.setView([userLocation.lat, userLocation.lng], 13);
    }
  }, [userLocation]);

  return (
    <>
      {isErrorVisible && (
        <Stack>
          <Alert
            variant="filled"
            severity="error"
            sx={{
              marginLeft: '40%',
              position: "absolute",
              marginTop: '20px',
              zIndex: 999999,
            }}
          >
            <AlertTitle>Error</AlertTitle>
            One or more of your photos in the selected quest does not contain
            coordinates.
          </Alert>
        </Stack>
      )}
      <div className="flex flex-col items-center">
        <MapContainer
          center={[50.103333, 14.450027]}
          zoom={13}
          style={{ height: "100vh", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {photos.map((photo) => (
            <Marker
              key={photo._id}
              position={[
                photo.geolocation.latitude,
                photo.geolocation.longitude,
              ]}
              icon={createIcon(photo.path)}
            />
          ))}
          <RoutingControl route={questRoute.length > 0 ? questRoute : route} />
          {selectLocationMode && onLocationSelect && (
            <LocationSelector onLocationSelect={onLocationSelect} />
          )}
        </MapContainer>
      </div>
    </>
  );
};

export default Map;
