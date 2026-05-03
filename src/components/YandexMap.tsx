import { useEffect, useRef, useState } from "react";
import { MapPin, Phone, Clock, Copy, Navigation } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    ymaps: any;
  }
}

interface YandexMapProps {
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  workHours: string;
}

export default function YandexMap({
  latitude,
  longitude,
  address,
  phone,
  workHours,
}: YandexMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.ymaps) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src =
          "https://api-maps.yandex.ru/2.1/?lang=ru_RU&load=package.full";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Yandex Maps"));
        document.head.appendChild(script);
      });
    };

    const initMap = async () => {
      try {
        await loadScript();
        await new Promise<void>((resolve) => {
          if (window.ymaps?.ready) {
            window.ymaps.ready(resolve);
          } else {
            const check = setInterval(() => {
              if (window.ymaps?.ready) {
                clearInterval(check);
                window.ymaps.ready(resolve);
              }
            }, 100);
          }
        });

        if (!mapRef.current || mapInstanceRef.current) return;

        const map = new window.ymaps.Map(mapRef.current, {
          center: [latitude, longitude],
          zoom: 15,
          controls: ["zoomControl", "fullscreenControl"],
        });

        map.options.set("suppressMapOpenBlock", true);

        const placemark = new window.ymaps.Placemark(
          [latitude, longitude],
          {
            balloonContent: `<div style="padding:8px;font-family:Inter,sans-serif">
              <strong style="color:#00bfa5">ГБУЗ "РОД" ПАО</strong><br/>
              <span style="color:#666">${address}</span><br/>
              <span style="color:#666">${phone}</span>
            </div>`,
          },
          {
            preset: "islands#circleDotIcon",
            iconColor: "#00bfa5",
          }
        );

        map.geoObjects.add(placemark);
        mapInstanceRef.current = map;
      } catch (err) {
        console.error("Map init error:", err);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, address, phone]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNavigate = () => {
    const url = `https://yandex.ru/maps/?rtext=~${latitude},${longitude}&rtt=auto`;
    window.open(url, "_blank");
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />

      {/* Floating info card */}
      <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md border border-[#e5e5e5] rounded-lg p-4 z-10 shadow-lg">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[#212121] font-semibold text-sm">
              ГБУЗ &quot;РОД&quot;, ПАО
            </h3>
            <p className="text-[#888] text-xs mt-0.5">{address}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-[#666]">
            <Phone className="w-3.5 h-3.5 text-[#00bfa5]" />
            <span>{phone}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#666]">
            <Clock className="w-3.5 h-3.5 text-[#00bfa5]" />
            <span>{workHours}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleNavigate}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md bg-gradient-accent text-white text-xs font-semibold hover:shadow-md transition-shadow"
          >
            <Navigation className="w-3.5 h-3.5" />
            Проложить маршрут
          </button>
          <button
            onClick={handleCopyAddress}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-md bg-[#f5f5f5] border border-[#e5e5e5] text-[#212121] text-xs hover:border-[#00bfa5] transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? "Скопировано" : "Копировать"}
          </button>
        </div>
      </div>
    </div>
  );
}
