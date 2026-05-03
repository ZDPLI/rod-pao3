import Header from "@/components/Header";
import LeftPanel from "@/components/LeftPanel";
import MicroscopeShader from "@/components/MicroscopeShader";
import YandexMap from "@/components/YandexMap";
import SchemaMarkup from "@/components/SchemaMarkup";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { fallbackSettings } from "@/lib/fallbackData";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { data: apiSettings } = trpc.settings.list.useQuery();
  const { user } = useAuth();
  const [showMap, setShowMap] = useState(true);

  const settingsList = apiSettings ?? Object.entries(fallbackSettings).map(([key, value]) => ({ key, value, id: 0, createdAt: new Date(), updatedAt: new Date() }));

  const settings = Object.fromEntries(
    settingsList.map((s) => [s.key, s.value ?? ""])
  );

  const address = settings.address || fallbackSettings.address;
  const phone = settings.phone || fallbackSettings.phone;
  const workHours = settings.workHours || fallbackSettings.workHours;
  const latitude = parseFloat(settings.latitude || fallbackSettings.latitude);
  const longitude = parseFloat(settings.longitude || fallbackSettings.longitude);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "m" && !e.ctrlKey && !e.metaKey) {
        setShowMap((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="h-screen w-screen bg-white overflow-hidden" role="application" itemScope itemType="https://schema.org/WebPage">
      <SchemaMarkup type="services" />
      <Header
        phone={phone}
        workHours={workHours}
        address={address}
        isAdmin={user?.role === "admin"}
      />

      <div className="flex h-full pt-[60px]">
        {/* Left panel - 25% (~480px) */}
        <div className="w-[480px] h-full flex-shrink-0 overflow-hidden">
          <LeftPanel />
        </div>

        {/* Right panel - 75% */}
        <div className="flex-1 relative overflow-hidden bg-[#e5e5e5]">
          <MicroscopeShader />

          {showMap && (
            <div className="absolute inset-0 z-[1]">
              <YandexMap
                latitude={latitude}
                longitude={longitude}
                address={address}
                phone={phone}
                workHours={workHours}
              />
            </div>
          )}

          <button
            onClick={() => setShowMap(!showMap)}
            className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-md bg-white/90 backdrop-blur-md border border-[#e5e5e5] text-xs text-[#666] hover:text-[#00bfa5] hover:border-[#00bfa5]/30 transition-all shadow-sm"
          >
            {showMap ? "Микроскоп (M)" : "Карта (M)"}
          </button>
        </div>
      </div>
    </div>
  );
}
