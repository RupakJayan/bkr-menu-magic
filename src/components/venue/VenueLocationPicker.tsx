import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, Search } from "lucide-react";

interface VenueLocationPickerProps {
  venueName: string;
  venueAddress: string;
  googleMapsUrl: string;
  onVenueNameChange: (val: string) => void;
  onVenueAddressChange: (val: string) => void;
  onGoogleMapsUrlChange: (val: string) => void;
}

export const VenueLocationPicker: React.FC<VenueLocationPickerProps> = ({
  venueName,
  venueAddress,
  googleMapsUrl,
  onVenueNameChange,
  onVenueAddressChange,
  onGoogleMapsUrlChange,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);

  useEffect(() => {
    if (!apiKey) return;

    if (window.google?.maps?.places) {
      setMapsLoaded(true);
      return;
    }

    const scriptId = "google-maps-script";
    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapsLoaded(true);
    document.head.appendChild(script);
  }, [apiKey]);

  useEffect(() => {
    if (!mapsLoaded || !autocompleteInputRef.current || !window.google?.maps?.places) {
      return;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteInputRef.current,
      {
        fields: ["name", "formatted_address", "url", "geometry"],
      },
    );

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place) return;

      if (place.name) onVenueNameChange(place.name);
      if (place.formatted_address) onVenueAddressChange(place.formatted_address);

      const generatedUrl =
        place.url ||
        (place.name
          ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${place.name} ${place.formatted_address || ""}`.trim(),
            )}`
          : "");

      if (generatedUrl) onGoogleMapsUrlChange(generatedUrl);
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [mapsLoaded, onVenueAddressChange, onVenueNameChange, onGoogleMapsUrlChange]);

  const openMapsSearch = () => {
    const query = `${venueName} ${venueAddress}`.trim() || "Anaimalai Tamil Nadu";
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, "_blank");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="venueName" className="text-base font-semibold text-gray-700">
            Venue / Hall Name *
          </Label>
          {apiKey && (
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Google Places enabled
            </span>
          )}
        </div>
        <div className="relative">
          <Input
            id="venueName"
            ref={autocompleteInputRef}
            value={venueName}
            onChange={(e) => onVenueNameChange(e.target.value)}
            placeholder={
              apiKey
                ? "Search wedding hall, mandapam, or venue..."
                : "e.g., Sri Krishna Kalyana Mandapam, Anaimalai"
            }
            className="h-12 text-base rounded-lg border-2 border-red-200 focus:border-red-600 focus:ring-red-600 pr-10"
          />
          <button
            type="button"
            onClick={openMapsSearch}
            className="absolute right-2.5 top-2.5 p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Search this venue on Google Maps"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="venueAddress" className="text-base font-semibold text-gray-700">
          Venue Address *
        </Label>
        <Textarea
          id="venueAddress"
          value={venueAddress}
          onChange={(e) => onVenueAddressChange(e.target.value)}
          placeholder="Enter complete venue address with street and town"
          rows={3}
          className="text-base rounded-lg border-2 border-red-200 focus:border-red-600 focus:ring-red-600"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="googleMapsUrl" className="text-base font-semibold text-gray-700">
            Google Maps Link
          </Label>
          <button
            type="button"
            onClick={openMapsSearch}
            className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
          >
            Find on Google Maps <ExternalLink className="h-3 w-3" />
          </button>
        </div>
        <div className="flex gap-2">
          <Input
            id="googleMapsUrl"
            value={googleMapsUrl}
            onChange={(e) => onGoogleMapsUrlChange(e.target.value)}
            placeholder="https://maps.google.com/?q=..."
            className="h-12 text-base rounded-lg border-2 border-red-200 focus:border-red-600 focus:ring-red-600 flex-1"
          />
          {googleMapsUrl && (
            <Button
              type="button"
              variant="outline"
              onClick={() => window.open(googleMapsUrl, "_blank")}
              className="h-12 border-2 border-red-200 hover:bg-red-50 text-red-700 px-3"
              title="Open directions link"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-500">
          This Google Maps link will be embedded as a clickable directions link in the customer's PDF and Word menu.
        </p>
      </div>
    </div>
  );
};
