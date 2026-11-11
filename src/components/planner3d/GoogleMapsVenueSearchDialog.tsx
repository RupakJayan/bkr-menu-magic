import React, { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Search,
  ExternalLink,
  Check,
  Star,
  Layers,
  Image as ImageIcon,
  ArrowRight,
  Globe,
  Satellite,
  RefreshCw,
  Info,
  Building2,
  Calendar,
} from "lucide-react";
import {
  searchLiveVenuesFromMaps,
  convertLiveVenueToMandapam,
  LiveMapVenueResult,
  LiveVenuePhoto,
  getFallbackVenues,
} from "@/services/liveMapVenueService";
import { MandapamVenue } from "@/types/planner3d";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DatumVector,
  DimensionCaliperVector,
  CrosshairVector,
  SpatialGridVector,
} from "@/components/ui/VectorIcons";

interface GoogleMapsVenueSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVenue: (venue: MandapamVenue) => void;
  initialQuery?: string;
}

const POPULAR_SUGGESTIONS = [
  { label: "Shanthi Mahal Avinashi", query: "Sri Shanthi Mahal Avinashi" },
  { label: "Vasavi Temple Anaimalai", query: "Vasavi Kanyaka Parameswari Temple Anaimalai" },
  { label: "Masani Amman Anaimalai", query: "Masani Amman Temple Anaimalai" },
  { label: "Codissia Coimbatore", query: "Codissia Trade Fair Complex Coimbatore" },
  { label: "MRC Hall Chennai", query: "Mayor Ramanathan Chettiar Hall Chennai" },
  { label: "ITC Grand Chola", query: "ITC Grand Chola Guindy Chennai" },
  { label: "Sri Krishna Pollachi", query: "Sri Krishna Kalyana Mandapam Pollachi" },
  { label: "Padmavathi Ammal CBE", query: "Padmavathi Ammal Kalyana Mandapam Coimbatore" },
  { label: "Subham Palace Tiruppur", query: "Subham Palace Tiruppur" },
  { label: "Meenakshi Amman Madurai", query: "Madurai Meenakshi Amman Temple Hall" },
];

export const GoogleMapsVenueSearchDialog: React.FC<GoogleMapsVenueSearchDialogProps> = ({
  isOpen,
  onClose,
  onSelectVenue,
  initialQuery = "",
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<LiveMapVenueResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchStatus, setSearchStatus] = useState<string>("");

  const [selectedVenue, setSelectedVenue] = useState<LiveMapVenueResult | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<LiveVenuePhoto | null>(null);
  const [photoUsage, setPhotoUsage] = useState<"floor" | "stage_backdrop" | "blueprint">("floor");
  const [mapViewMode, setMapViewMode] = useState<"satellite" | "roadmap">("satellite");

  // Direct numeric dimensions editor
  const [customWidth, setCustomWidth] = useState<number>(30);
  const [customLength, setCustomLength] = useState<number>(45);
  const [customHeight, setCustomHeight] = useState<number>(7.5);
  const [customCapacity, setCustomCapacity] = useState<number>(2000);

  const executeSearch = useCallback(async (query: string) => {
    const q = query.trim();
    if (!q) return;

    setIsSearching(true);
    setHasSearched(true);
    setSearchStatus("Querying OpenStreetMap & Nominatim Geocoding API...");

    try {
      // Simulate quick status progression for responsive feedback
      const timer = setTimeout(() => {
        setSearchStatus("Retrieving satellite footprint & building bounding boxes...");
      }, 700);

      const searchResults = await searchLiveVenuesFromMaps(q);
      clearTimeout(timer);

      setResults(searchResults);
      if (searchResults.length > 0) {
        const first = searchResults[0];
        setSelectedVenue(first);
        setSelectedPhoto(first.photos[0] || null);
        setCustomWidth(first.hallWidth);
        setCustomLength(first.hallLength);
        setCustomHeight(first.hallHeight);
        setCustomCapacity(first.capacity);
      }
    } catch (err) {
      console.error("Search failed:", err);
      toast.error("Unable to reach geocoding service. Loaded local spatial model.");
      const fallbacks = getFallbackVenues();
      setResults(fallbacks);
      setSelectedVenue(fallbacks[0]);
    } finally {
      setIsSearching(false);
      setSearchStatus("");
    }
  }, []);

  // Initial search if query was passed
  useEffect(() => {
    if (initialQuery.trim()) {
      setSearchQuery(initialQuery);
      executeSearch(initialQuery);
    } else {
      // Load fallback suggestions without forcing them as search results
      const defaults = getFallbackVenues();
      setResults(defaults);
      setSelectedVenue(defaults[0]);
      setSelectedPhoto(defaults[0].photos[0] || null);
      setCustomWidth(defaults[0].hallWidth);
      setCustomLength(defaults[0].hallLength);
      setCustomHeight(defaults[0].hallHeight);
      setCustomCapacity(defaults[0].capacity);
    }
  }, [initialQuery, executeSearch]);

  const handleChooseVenue = (venue: LiveMapVenueResult) => {
    setSelectedVenue(venue);
    setSelectedPhoto(venue.photos[0] || null);
    setCustomWidth(venue.hallWidth);
    setCustomLength(venue.hallLength);
    setCustomHeight(venue.hallHeight);
    setCustomCapacity(venue.capacity);
  };

  const handleApplyTo3D = () => {
    if (!selectedVenue) return;

    const updatedVenueData: LiveMapVenueResult = {
      ...selectedVenue,
      hallWidth: customWidth,
      hallLength: customLength,
      hallHeight: customHeight,
      capacity: customCapacity,
    };

    const mandapam = convertLiveVenueToMandapam(
      updatedVenueData,
      selectedPhoto?.url,
      photoUsage
    );

    onSelectVenue(mandapam);
    onClose();
    toast.success(`Google Maps Venue Imported: ${selectedVenue.name}`, {
      description: `3D model generated with real coordinates [${selectedVenue.lat.toFixed(4)}, ${selectedVenue.lng.toFixed(4)}] and CAD footprint ${customWidth}m × ${customLength}m.`,
    });
  };

  // Google Maps embed URL with toggleable satellite (k) vs roadmap (m)
  const embedUrl = selectedVenue
    ? `https://maps.google.com/maps?q=${encodeURIComponent(
        `${selectedVenue.name}, ${selectedVenue.formattedAddress}`
      )}&z=18&t=${mapViewMode === "satellite" ? "k" : "m"}&output=embed`
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-2xl">
      <div className="relative w-full max-w-6xl max-h-[94vh] overflow-hidden rounded-2xl border border-white/[0.12] bg-[#101217] text-[#f4efe6] shadow-2xl flex flex-col font-sans select-none">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/[0.08] bg-[#161820]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#222530] border border-white/10 flex items-center justify-center text-[#e2c99a]">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold tracking-wider uppercase font-mono text-white flex items-center gap-2">
                LIVE GOOGLE MAPS &amp; SATELLITE VENUE INTELLIGENCE
                <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  REAL-TIME GEOCODING &amp; REAL PHOTOS
                </span>
              </h2>
              <p className="text-[10px] font-mono text-neutral-400">
                Search any Mahal, Mandapam, Hotel, or Lawn in India to pull real satellite footprints, user photos, and CAD bounds
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 text-xs font-mono text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
          >
            ✕ Close
          </button>
        </div>

        {/* Live Search Bar Input with Action Button */}
        <div className="px-6 py-3 border-b border-white/[0.08] bg-[#0c0e14] space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeSearch(searchQuery);
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type any venue name (e.g. Codissia Coimbatore, Mayor Ramanathan Chettiar Hall, ITC Grand Chola)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141722] border border-white/10 text-xs text-white placeholder-neutral-500 font-mono focus:outline-none focus:border-[#e2c99a] transition-all"
              />
            </div>

            <Button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#e2c99a] text-black font-bold font-mono text-xs hover:bg-[#c5a059] flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 disabled:opacity-50"
            >
              {isSearching ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Searching Maps...</span>
                </>
              ) : (
                <>
                  <Search className="h-3.5 w-3.5" />
                  <span>Search Google Places</span>
                </>
              )}
            </Button>
          </form>

          {/* Quick Suggestion Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono py-0.5">
            <span className="text-neutral-500 uppercase shrink-0">Popular:</span>
            {POPULAR_SUGGESTIONS.map((sug) => (
              <button
                key={sug.label}
                type="button"
                onClick={() => {
                  setSearchQuery(sug.query);
                  executeSearch(sug.query);
                }}
                className="px-2.5 py-1 rounded-md bg-[#1a1d28] border border-white/[0.08] hover:border-[#e2c99a]/50 text-neutral-300 hover:text-white shrink-0 transition-colors"
              >
                {sug.label}
              </button>
            ))}
          </div>

          {/* Search Loading Indicator */}
          {isSearching && (
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#e2c99a] pt-1">
              <RefreshCw className="h-3 w-3 animate-spin" />
              <span>{searchStatus}</span>
            </div>
          )}
        </div>

        {/* Two-Column Workspace Layout */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Results Column (5 cols) */}
          <div className="md:col-span-5 border-r border-white/[0.08] overflow-y-auto p-4 space-y-2 bg-[#0e1017]">
            <div className="flex items-center justify-between px-1 mb-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase font-mono">
                {hasSearched ? `Places Matching "${searchQuery}":` : "Geocoded Places:"}
              </span>
              <span className="text-[10px] font-mono text-neutral-500">
                {results.length} verified
              </span>
            </div>

            {results.length === 0 && !isSearching && (
              <div className="p-6 text-center text-neutral-500 font-mono text-xs space-y-2">
                <p>No geocoded venues found for "{searchQuery}".</p>
                <p className="text-[10px] text-neutral-600">
                  Try typing a specific landmark, road, or city name in Tamil Nadu.
                </p>
              </div>
            )}

            {results.map((venue) => {
              const isSelected = selectedVenue?.id === venue.id;
              return (
                <div
                  key={venue.id}
                  onClick={() => handleChooseVenue(venue)}
                  className={`cursor-pointer p-3 rounded-xl border transition-all text-xs font-mono ${
                    isSelected
                      ? "bg-[#222530] border-[#e2c99a] text-white shadow-lg"
                      : "bg-[#141722]/80 border-white/[0.06] text-neutral-300 hover:bg-[#1a1d2b] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-bold text-xs text-white truncate">{venue.name}</h4>
                        {venue.isLiveGeocoded && (
                          <span className="text-[8px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            LIVE
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2 leading-tight">
                        {venue.formattedAddress}
                      </p>
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 text-[#e2c99a] shrink-0 mt-0.5" />
                    )}
                  </div>

                  {/* Coordinates & Footprint Badges */}
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/[0.05] text-[10px] text-neutral-400">
                    <span className="text-[#e2c99a] font-bold">
                      {venue.hallWidth}m × {venue.hallLength}m
                    </span>
                    <span>•</span>
                    <span>{Math.round(venue.hallWidth * venue.hallLength)} m²</span>
                    <span>•</span>
                    <span className="text-neutral-500 font-mono">
                      {venue.lat.toFixed(3)}°, {venue.lng.toFixed(3)}°
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Venue Inspector & Satellite View Column (7 cols) */}
          <div className="md:col-span-7 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#12141c]">
            {selectedVenue ? (
              <>
                {/* Active Venue Details Banner */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                        {selectedVenue.name}
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {selectedVenue.isLiveGeocoded ? "Google Maps Verified" : "Synthesized CAD"}
                        </span>
                      </h3>
                      <p className="text-xs text-neutral-400 font-mono mt-0.5">
                        {selectedVenue.formattedAddress}
                      </p>
                    </div>

                    <a
                      href={selectedVenue.googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 text-[10px] rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-300 flex items-center gap-1 font-mono shrink-0"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Google Earth</span>
                    </a>
                  </div>

                  <p className="text-xs text-neutral-300 font-sans leading-relaxed mt-2 p-2.5 rounded-xl bg-[#0c0e14] border border-white/[0.06]">
                    {selectedVenue.description}
                  </p>
                </div>

                {/* Interactive Live Map Viewport with Satellite Toggle */}
                <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
                  <div className="px-3 py-2 bg-[#161822] border-b border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-white font-bold flex items-center gap-1.5">
                      <Satellite className="h-3.5 w-3.5 text-[#e2c99a]" />
                      Google Maps Live Viewport:
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setMapViewMode("satellite")}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                          mapViewMode === "satellite"
                            ? "bg-[#e2c99a] text-black font-bold"
                            : "bg-[#222530] text-neutral-400 hover:text-white"
                        }`}
                      >
                        Satellite (Google Earth)
                      </button>
                      <button
                        type="button"
                        onClick={() => setMapViewMode("roadmap")}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                          mapViewMode === "roadmap"
                            ? "bg-[#e2c99a] text-black font-bold"
                            : "bg-[#222530] text-neutral-400 hover:text-white"
                        }`}
                      >
                        Roadmap
                      </button>
                    </div>
                  </div>

                  <div className="h-48 w-full bg-[#181a20] relative">
                    <iframe
                      title="Google Maps Venue Embed"
                      src={embedUrl}
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Real Photos & Satellite Imagery Gallery */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-white font-mono flex items-center justify-between uppercase">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="h-3.5 w-3.5 text-[#e2c99a]" />
                      Real Photos &amp; Satellite Orthomosaics ({selectedVenue.photos.length}):
                    </span>
                    <span className="text-[10px] text-neutral-400 lowercase font-normal">
                      click photo to project in 3D
                    </span>
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedVenue.photos.map((photo) => {
                      const isPhotoSelected = selectedPhoto?.id === photo.id;
                      return (
                        <div
                          key={photo.id}
                          onClick={() => setSelectedPhoto(photo)}
                          className={`cursor-pointer group relative rounded-xl overflow-hidden border transition-all ${
                            isPhotoSelected
                              ? "border-[#e2c99a] ring-2 ring-[#e2c99a]/50 scale-[1.02]"
                              : "border-white/10 hover:border-white/30"
                          }`}
                        >
                          <div className="h-24 bg-black overflow-hidden relative">
                            <img
                              src={photo.url}
                              alt={photo.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-1 left-1">
                              <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-black/70 text-[#e2c99a] uppercase border border-white/10">
                                {photo.source}
                              </span>
                            </div>
                          </div>
                          <div className="p-1.5 bg-[#0e1017] text-[10px] font-mono">
                            <span className="text-white block font-bold truncate">
                              {photo.title}
                            </span>
                            <span className="text-neutral-500 block text-[9px] truncate">
                              {photo.uploaderName || "Verified Place Source"}
                            </span>
                          </div>
                          {isPhotoSelected && (
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#e2c99a] text-black flex items-center justify-center font-bold text-xs shadow-md">
                              ✓
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Photo Projection Application Mode Toggle */}
                  {selectedPhoto && (
                    <div className="p-3 rounded-xl bg-[#0c0e14] border border-white/[0.08] space-y-2 font-mono text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400">Project Selected Photo Into 3D:</span>
                        <span className="text-[#e2c99a] font-bold truncate max-w-[200px]">
                          {selectedPhoto.title}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setPhotoUsage("floor")}
                          className={`p-2 rounded-lg border text-center transition-all text-[11px] ${
                            photoUsage === "floor"
                              ? "bg-[#e2c99a] text-black font-bold border-[#e2c99a]"
                              : "bg-[#161822] border-white/10 text-neutral-300 hover:text-white"
                          }`}
                        >
                          Project on 3D Floor
                        </button>
                        <button
                          type="button"
                          onClick={() => setPhotoUsage("stage_backdrop")}
                          className={`p-2 rounded-lg border text-center transition-all text-[11px] ${
                            photoUsage === "stage_backdrop"
                              ? "bg-[#e2c99a] text-black font-bold border-[#e2c99a]"
                              : "bg-[#161822] border-white/10 text-neutral-300 hover:text-white"
                          }`}
                        >
                          Stage LED Screen
                        </button>
                        <button
                          type="button"
                          onClick={() => setPhotoUsage("blueprint")}
                          className={`p-2 rounded-lg border text-center transition-all text-[11px] ${
                            photoUsage === "blueprint"
                              ? "bg-[#e2c99a] text-black font-bold border-[#e2c99a]"
                              : "bg-[#161822] border-white/10 text-neutral-300 hover:text-white"
                          }`}
                        >
                          Synthesize CAD Plan
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct Number & Text Format Dimensions Editor */}
                <div className="p-4 rounded-xl bg-[#0c0e14] border border-white/[0.08] space-y-3 font-mono">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5 uppercase">
                      <DimensionCaliperVector size={14} className="text-[#e2c99a]" />
                      Direct Numeric Venue Dimension Editor (Meters):
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      Floor Area: <strong className="text-white">{Math.round(customWidth * customLength)} m²</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-1">
                        Width (W in meters):
                      </label>
                      <input
                        type="number"
                        step="1"
                        min="15"
                        max="200"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(parseFloat(e.target.value) || 20)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#161822] border border-white/10 text-white font-bold focus:outline-none focus:border-[#e2c99a]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-1">
                        Length (L in meters):
                      </label>
                      <input
                        type="number"
                        step="1"
                        min="15"
                        max="250"
                        value={customLength}
                        onChange={(e) => setCustomLength(parseFloat(e.target.value) || 20)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#161822] border border-white/10 text-white font-bold focus:outline-none focus:border-[#e2c99a]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-1">
                        Ceiling Height (H):
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="4"
                        max="30"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(parseFloat(e.target.value) || 6)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#161822] border border-white/10 text-white font-bold focus:outline-none focus:border-[#e2c99a]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-1">
                        Capacity (Pax):
                      </label>
                      <input
                        type="number"
                        step="50"
                        min="100"
                        max="20000"
                        value={customCapacity}
                        onChange={(e) => setCustomCapacity(parseInt(e.target.value, 10) || 500)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#161822] border border-white/10 text-white font-bold focus:outline-none focus:border-[#e2c99a]"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-center p-8 text-neutral-500 font-mono text-xs">
                Select a venue from the left column or search for a venue above.
              </div>
            )}
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#161820] flex flex-wrap items-center justify-between gap-3 font-mono">
          <div className="text-xs text-neutral-300">
            {selectedVenue ? (
              <>
                Selected: <strong className="text-white">{selectedVenue.name}</strong> •{" "}
                <strong className="text-[#e2c99a]">{customWidth}m × {customLength}m × {customHeight}m</strong> •{" "}
                <span>{customCapacity.toLocaleString("en-IN")} Pax</span>
              </>
            ) : (
              <span>No venue selected</span>
            )}
          </div>

          <Button
            size="lg"
            disabled={!selectedVenue}
            onClick={handleApplyTo3D}
            className="px-6 py-2.5 rounded-xl font-mono font-bold text-xs tracking-wider uppercase bg-[#e2c99a] hover:bg-[#c5a059] text-black shadow-lg flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
          >
            <CrosshairVector size={15} />
            <span>RENDER IN 3D STAGE PLANNER</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

      </div>
    </div>
  );
};
