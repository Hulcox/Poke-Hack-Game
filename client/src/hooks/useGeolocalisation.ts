import { useEffect, useState } from "react";

export const useGeolocation = () => {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [status, setStatus] = useState({ loading: false, error: false });

  const getLocalisation = () => {
    setStatus({ loading: true, error: false });

    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => {
        setLocation({ lat: coords.latitude, lon: coords.longitude });
        setStatus({ loading: false, error: false });
      },
      () => setStatus({ loading: false, error: true })
    );
  };

  useEffect(getLocalisation, []);

  return {
    location,
    errorGeoloc: status.error,
    loadingGeoloc: status.loading,
    getLocalisation,
  };
};
