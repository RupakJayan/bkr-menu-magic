import React, { useState, useMemo } from "react";
import {
  MapPin,
  Search,
  ExternalLink,
  Check,
  Star,
  Layers,
  Image as ImageIcon,
  Maximize2,
  Sliders,
  Sparkles,
  ArrowRight,
  Compass,
} from "lucide-react";
import {
  GoogleMapsVenueData,
  searchGoogleMapsVenues,
  convertGoogleMapsVenueToMandapam,
  VenueUploadedPhoto,
} from "@/services/googleMapsVenueService";
import { MandapamVenue } from "@/types/planner3d";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DatumVector, DimensionCaliperVector, CrosshairVector } from "@/components/ui/VectorIcons";

interface GoogleMapsVenueSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVenue: (venue: MandapamVenue) => void;
}

export const GoogleMapsVenueSearchDialog: React.FC<GoogleMapsVenueSearchDialogProps> = ({
  isOpen,
  onClose,
  onSelectVenue,
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState("");
  const results = useMemo(() => searchGoogleMapsVenues(searchQuery), [searchQuery]);

  const [selectedVenue, setSelectedVenue] = useState<GoogleMapsVenueData>(results[0]);
  const [selectedPhoto, setSelectedPhoto] = useState<VenueUploadedPhoto | null>(
    results[0]?.uploadedPhotos[0] || null
  );
  const [photoUsage, setPhotoUsage] = useState<"floor" | "stage_backdrop" | "blueprint">("floor");

  // Editable dimensions state
  const [customWidth, setCustomWidth] = useState<number>(results[0]?.hallWidth || 28);
  const [customLength, setCustomLength] = useState<number>(results[0]?.hallLength || 42);
  const [customHeight, setCustomHeight] = useState<number>(results[0]?.hallHeight || 7.5);

  const handleChooseVenue = (venue: GoogleMapsVenueData) => {
    setSelectedVenue(venue);
    setSelectedPhoto(venue.uploadedPhotos[0] || null);
    setCustomWidth(venue.hallWidth);
    setCustomLength(venue.hallLength);
    setCustomHeight(venue.hallHeight);
  };

  const handleApplyTo3D = () => {
    const updatedVenueData: GoogleMapsVenueData = {
      ...selectedVenue,
      hallWidth: customWidth,
      hallLength: customLength,
      hallHeight: customHeight,
    };

    const mandapam = convertGoogleMapsVenueToMandapam(
      updatedVenueData,
      selectedPhoto?.url,
      photoUsage
    );

    onSelectVenue(mandapam);
    onClose();
    toast.success(`Google Maps Venue Imported: ${selectedVenue.name}`, {
      description: `3D model generated with dimensions ${customWidth}m × ${customLength}m and selected venue photo.`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-2xl">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111318] text-[#f4efe6] shadow-2xl flex flex-col font-sans select-none">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/[0.08] bg-[#161820]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#222530] border border-white/10 flex items-center justify-center text-[#e2c99a]">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold tracking-wider uppercase font-mono text-white flex items-center gap-2">
                GOOGLE MAPS &amp; SATELLITE VENUE INTELLIGENCE
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  REAL PHOTOS &amp; CAD DIMENSIONS
                </span>
              </h2>
              <p className="text-[10px] font-mono text-neutral-400">
                Search any Mahal or Mandapam to fetch real photos &amp; dimensions from Google Maps
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-mono text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            × Close
          </button>
        </div>

        {/* Search Bar Input */}
        <div className="px-6 py-3 border-b border-white/[0.08] bg-[#0c0e14] flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any Mahal, Mandapam, Convention Center (e.g. Mayor Ramanathan, Codissia, ITC Chola, Sri Krishna)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#141722] border border-white/10 text-xs text-white placeholder-neutral-500 font-mono focus:outline-none focus:border-[#e2c99a]"
            />
          </div>
          <span className="text-[10px] font-mono text-neutral-400 shrink-0 hidden sm:inline">
            Found {results.length} Locations
          </span>
        </div>

        {/* Two-Column Workspace Layout */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Results Column (5 cols) */}
          <div className="md:col-span-5 border-r border-white/[0.08] overflow-y-auto p-4 space-y-2 bg-[#0e1017]">
            <span className="text-[10px] font-bold text-neutral-400 uppercase font-mono block px-1 mb-1">
              Google Maps Verified Locations:
            </span>

            {results.map((venue) => {
              const isSelected = selectedVenue.id === venue.id;
              return (
                <div
                  key={venue.id}
                  onClick={() => handleChooseVenue(venue)}
                  className={`cursor-pointer p-3 rounded-xl border transition-all text-xs font-mono ${
                    isSelected
                      ? "bg-[#222530] border-[#e2c99a] text-white shadow-md"
                      : "bg-[#141722]/80 border-white/[0.06] text-neutral-300 hover:bg-[#1a1d2b] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-xs text-white">{venue.name}</h4>
                      <p className="text-[10px] text-neutral-400 mt-0.5">{venue.address}</p>
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 text-[#e2c99a] shrink-0 mt-0.5" />
                    )}
                  </div>

                  {/* Rating & Capacity Badges */}
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-neutral-400">
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Star className="h-3 w-3 fill-amber-400" />
                      {venue.rating} ({venue.reviewCount})
                    </span>
                    <span>•</span>
                    <span className="text-[#e2c99a] font-bold">
                      {venue.hallWidth}m × {venue.hallLength}m
                    </span>
                    <span>•</span>
                    <span>{venue.capacity.toLocaleString("en-IN")} Pax</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Venue Inspector & Photo Gallery Column (7 cols) */}
          <div className="md:col-span-7 overflow-y-auto p-5 space-y-5 bg-[#12141c]">
            
            {/* Active Venue Details Banner */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    {selectedVenue.name}
                    {selectedVenue.verifiedOwner && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Verified Google Place
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">
                    {selectedVenue.address}
                  </p>
                </div>

                <a
                  href={selectedVenue.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 text-[10px] rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-300 flex items-center gap-1 font-mono shrink-0"
                >
                  <ExternalLink className="h-3 w-3" />
                  Maps
                </a>
              </div>

              <p className="text-xs text-neutral-300 font-sans leading-relaxed mt-2 p-2.5 rounded-xl bg-[#0c0e14] border border-white/[0.06]">
                {selectedVenue.description}
              </p>
            </div>

            {/* User-Uploaded Real Photos Gallery */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5 uppercase">
                <ImageIcon className="h-3.5 w-3.5 text-[#e2c99a]" />
                User-Uploaded Photos ({selectedVenue.uploadedPhotos.length} Available):
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {selectedVenue.uploadedPhotos.map((photo) => {
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
                      <div className="h-24 bg-black overflow-hidden">
                        <img
                          src={photo.url}
                          alt={photo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-1.5 bg-[#0e1017] text-[10px] font-mono">
                        <span className="text-white block font-bold truncate">
                          {photo.title}
                        </span>
                        <span className="text-neutral-500 block text-[9px] truncate">
                          By: {photo.uploaderName}
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

              {/* Photo Projection Usage Mode Toggle */}
              {selectedPhoto && (
                <div className="p-3 rounded-xl bg-[#0c0e14] border border-white/[0.08] space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Selected Photo Application in 3D:</span>
                    <span className="text-[#e2c99a] font-bold">{selectedPhoto.title}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
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
                      onClick={() => setPhotoUsage("stage_backdrop")}
                      className={`p-2 rounded-lg border text-center transition-all text-[11px] ${
                        photoUsage === "stage_backdrop"
                          ? "bg-[#e2c99a] text-black font-bold border-[#e2c99a]"
                          : "bg-[#161822] border-white/10 text-neutral-300 hover:text-white"
                      }`}
                    >
                      Stage Backdrop Screen
                    </button>
                    <button
                      onClick={() => setPhotoUsage("blueprint")}
                      className={`p-2 rounded-lg border text-center transition-all text-[11px] ${
                        photoUsage === "blueprint"
                          ? "bg-[#e2c99a] text-black font-bold border-[#e2c99a]"
                          : "bg-[#161822] border-white/10 text-neutral-300 hover:text-white"
                      }`}
                    >
                      Synthesized CAD Plan
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
                  Direct Numeric Dimensions Editor (Meters):
                </span>
                <span className="text-[10px] text-neutral-400">
                  Floor Area: {Math.round(customWidth * customLength)} m²
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-1">
                    Width (W in meters):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="15"
                    max="150"
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
                    step="0.5"
                    min="15"
                    max="150"
                    value={customLength}
                    onChange={(e) => setCustomLength(parseFloat(e.target.value) || 20)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#161822] border border-white/10 text-white font-bold focus:outline-none focus:border-[#e2c99a]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 block mb-1">
                    Ceiling Height (H in meters):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="4"
                    max="25"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(parseFloat(e.target.value) || 6)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#161822] border border-white/10 text-white font-bold focus:outline-none focus:border-[#e2c99a]"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#161820] flex items-center justify-between font-mono">
          <div className="text-xs text-neutral-300">
            Selected: <strong className="text-white">{selectedVenue.name}</strong> •{" "}
            <strong className="text-[#e2c99a]">{customWidth}m × {customLength}m × {customHeight}m</strong>
          </div>

          <Button
            size="lg"
            onClick={handleApplyTo3D}
            className="px-6 py-2.5 rounded-xl font-mono font-bold text-xs tracking-wider uppercase bg-[#e2c99a] hover:bg-[#c5a059] text-black shadow-lg flex items-center gap-2 transition-transform active:scale-95"
          >
            <CrosshairVector size={15} />
            <span>RENDER GOOGLE MAPS VENUE IN 3D</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

      </div>
    </div>
  );
};
