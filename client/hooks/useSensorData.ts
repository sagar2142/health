import { useEffect, useState } from 'react';

export function useSensorData(enabled: boolean) {
  const [data, setData] = useState<{
    temp: number | null;
    stressLevel: number | null;
    heartRate: number | null;
    spo2: number | null;
    lastSource?: string;
    prediction: string | null; // Ensure prediction is always present
    alert: string | null;      // Ensure alert is always present
  }>({
    temp: null,
    stressLevel: null,
    heartRate: null,
    spo2: null,
    prediction: null,
    alert: null,
  });

  const [serverConnected, setServerConnected] = useState<boolean>(false);

  // Fetch sensor data from server
  const fetchData = async () => {
    if (!enabled) return;
    try {
      let res = await fetch('http://10.155.97.162:3000/api/sensor');
      if (!res.ok) throw new Error('Server not reachable');
      const json = await res.json();
      setData(prev => ({
        ...prev,
        temp: json.temp ?? null,
        stressLevel: json.stressLevel ?? null,
        heartRate: json.heartRate ?? null,
        spo2: json.spo2 ?? null,
        prediction: json.prediction ?? null,
        alert: json.alert ?? null,
      }));
      setServerConnected(true);
    } catch (err) {
      setServerConnected(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [enabled]);

  return { ...data, serverConnected, refresh: fetchData };
}
