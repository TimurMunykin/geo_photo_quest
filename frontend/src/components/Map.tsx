import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L, { Control } from 'leaflet';
import 'leaflet-routing-machine';
import { API_URL } from '../config';

interface Photo {
  _id: string;
  path: string;
  geolocation: {
    latitude: number;
    longitude: number;
  };
}

interface MapProps {
  questId: string;
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
    className: '',
    iconSize: [60, 60],
    iconAnchor: [30, 30]
  });
};

const RoutingControl = ({ route }: { route: { latitude: number; longitude: number }[] }) => {
  const map = useMap();
  const control = useRef<Control | null>(null);

  useEffect(() => {
    if (route.length > 1) {
      if (control.current) {
        map.removeControl(control.current);
      }

      const waypoints = route.map(point => L.latLng(point.latitude, point.longitude));

      control.current = L.Routing.control({
        waypoints,
        routeWhileDragging: true,
        showAlternatives: false,
        waypointMode: 'snap',
        addWaypoints: false,
        fitSelectedRoutes: true,
        show: false,
      }).addTo(map);
    }
  }, [route, map]);

  document.getElementsByClassName('leaflet-control-container')[0]?.remove();
  return null;
};

const Map: React.FC<MapProps> = ({ questId }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [route, setRoute] = useState<{ latitude: number; longitude: number }[]>([]);

  useEffect(() => {
    if (questId) {
      const fetchPhotos = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${API_URL}/photos`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            params: { questId }
          });
          setPhotos(response.data);
          const route = response.data.map((photo: Photo) => ({
            latitude: photo.geolocation.latitude,
            longitude: photo.geolocation.longitude,
          }));
          setRoute(route);
        } catch (error) {
          console.error('Error fetching photos:', error);
        }
      };
      fetchPhotos();
    }
  }, [questId]);

  return (
    <MapContainer center={[50.103333, 14.450027]} zoom={13} style={{ height: '80vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {photos.map(photo => (
        <Marker
          key={photo._id}
          position={[photo.geolocation.latitude, photo.geolocation.longitude]}
          icon={createIcon(photo.path)}
        />
      ))}
      <RoutingControl route={route} />
    </MapContainer>
  );
};

export default Map;
