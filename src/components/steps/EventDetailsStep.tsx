import React, { useState, useEffect } from 'react';
import { EventMenu } from '@/types/menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getTamilSolarDate } from '@/utils/tamilDate';
import { differenceInCalendarDays } from '@/utils/istDate';
import { CalendarDays, Camera, Clock3, Coffee, MapPin, NotebookPen, Sparkles, UserRound } from 'lucide-react';
import { VenueLocationPicker } from '@/components/venue/VenueLocationPicker';

interface EventDetailsStepProps {
  menu: EventMenu;
  onMenuChange: (menu: EventMenu) => void;
  onNext: () => void;
  onOpenAiLens?: () => void;
}

export const EventDetailsStep: React.FC<EventDetailsStepProps> = ({ menu, onMenuChange, onNext, onOpenAiLens }) => {
  const [clientName, setClientName] = useState(menu.clientDetails.name);
  const [clientPhone, setClientPhone] = useState(menu.clientDetails.phone);
  const [venueName, setVenueName] = useState(menu.venueDetails.name);
  const [venueAddress, setVenueAddress] = useState(menu.venueDetails.address);
  const [customMention, setCustomMention] = useState(menu.customMention || '');
  const [transportCharge, setTransportCharge] = useState<number | string>(menu.transportCharge ? menu.transportCharge : '');
  const [googleMapsUrl, setGoogleMapsUrl] = useState(menu.venueDetails.googleMapsUrl || '');
  const [startDate, setStartDate] = useState(menu.startDate);
  const [endDate, setEndDate] = useState(menu.endDate);

  // Sync internal state if a new blank menu is passed in
  useEffect(() => {
    setClientName(menu.clientDetails.name);
    setClientPhone(menu.clientDetails.phone);
    setVenueName(menu.venueDetails.name);
    setVenueAddress(menu.venueDetails.address);
    setCustomMention(menu.customMention || '');
    setTransportCharge(menu.transportCharge ? menu.transportCharge : '');
    setGoogleMapsUrl(menu.venueDetails.googleMapsUrl || '');
    setStartDate(menu.startDate);
    setEndDate(menu.endDate);
  }, [menu.id]);

  const tamilDateTa = getTamilSolarDate(startDate, "ta");
  const tamilDateEn = getTamilSolarDate(startDate, "en");
  const displayTamilDate = tamilDateTa ? `${tamilDateTa} (${tamilDateEn})` : "";

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    if (endDate < startDate) return 0;
    return differenceInCalendarDays(startDate, endDate) + 1;
  };

  const handleSave = () => {
    const numberOfDays = calculateDays();

    onMenuChange({
      ...menu,
      clientDetails: {
        name: clientName,
        phone: clientPhone,
      },
      venueDetails: {
        name: venueName,
        address: venueAddress,
        googleMapsUrl: googleMapsUrl || undefined,
      },
      customMention: customMention.trim() || undefined,
      tamilDate: tamilDateTa || undefined,
      transportCharge: transportCharge === '' ? 0 : Math.max(0, Number(transportCharge) || 0),
      startDate,
      endDate,
      numberOfDays,
      updatedAt: new Date(),
    });

    onNext();
  };

  const isValid = clientName && clientPhone && venueName && venueAddress && startDate && endDate && endDate >= startDate;

  return (
    <div className="planner-step-panel bg-white rounded-xl shadow-xl border-2 border-red-200 overflow-hidden">
      <div className="planner-step-banner p-8 text-white">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <NotebookPen className="h-7 w-7" aria-hidden="true" />
          Event Details | நிகழ்வு விவரங்கள்
        </h2>
        <p className="text-red-100 mt-2">Start with the people, place and dates. You can review everything before exporting.</p>
      </div>

      <div className="planner-step-body p-8 space-y-8 bg-gradient-to-b from-white to-orange-50">
        {/* AI Lens Quick Scan Callout */}
        {onOpenAiLens && (
          <div className="p-4 rounded-xl border border-line bg-surf shadow-theme-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-acc text-accink flex items-center justify-center shrink-0 shadow-theme-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-ink text-sm flex items-center gap-2">
                  Have a handwritten catering order slip or note?
                  <Badge variant="outline" className="bg-acc/10 text-acc border-acc/30 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full">
                    AI Lens
                  </Badge>
                </p>
                <p className="text-xs text-mute mt-0.5">
                  Snap or upload a photo to convert Tamil or English handwriting into an editable menu with 1 click.
                </p>
              </div>
            </div>
            <Button
              type="button"
              onClick={onOpenAiLens}
              className="bg-acc text-accink hover:opacity-95 font-semibold text-xs h-10 px-4 rounded-btn shadow-theme-sm shrink-0 flex items-center gap-1.5 tp-pressable transition-all"
            >
              <Camera className="h-4 w-4" />
              Scan with AI Lens
            </Button>
          </div>
        )}

        {/* Client Details */}
        <section className="planner-form-section space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="planner-icon-badge w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
              <UserRound aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Client Information</h3>
              <p className="text-sm text-gray-500">Who are we planning this celebration for?</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="clientName" className="text-base font-semibold text-gray-700">Client Name *</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter client name"
                className="h-12 text-base rounded-lg border-2 border-red-200 focus:border-red-600 focus:ring-red-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientPhone" className="text-base font-semibold text-gray-700">Phone Number *</Label>
              <Input
                id="clientPhone"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="Enter phone number"
                className="h-12 text-base rounded-lg border-2 border-red-200 focus:border-red-600 focus:ring-red-600"
              />
            </div>
          </div>
        </section>

        {/* Venue Details */}
        <section className="planner-form-section space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="planner-icon-badge w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
              <MapPin aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Venue Information</h3>
              <p className="text-sm text-gray-500">Add the location and optional map link.</p>
            </div>
          </div>
          <VenueLocationPicker
            venueName={venueName}
            venueAddress={venueAddress}
            googleMapsUrl={googleMapsUrl}
            onVenueNameChange={setVenueName}
            onVenueAddressChange={setVenueAddress}
            onGoogleMapsUrlChange={setGoogleMapsUrl}
          />
        </section>

        {/* Special Service Announcement / Live Counter Custom Mention */}
        <section className="planner-form-section space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="planner-icon-badge w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center shadow-lg text-white">
              <Coffee className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Live Counter & Service Notice (Optional)</h3>
              <p className="text-sm text-gray-500">e.g. Live tea/coffee timings or special counter schedules shown at the top of all menus.</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="customMention" className="text-base font-semibold text-gray-700 flex items-center justify-between">
              <span>Custom Mention / Service Announcement</span>
              <span className="text-xs font-normal text-gray-500">நேரடி கவுண்டர் மற்றும் சிறப்பு அறிவிப்பு</span>
            </Label>
            <Input
              id="customMention"
              value={customMention}
              onChange={(e) => setCustomMention(e.target.value)}
              placeholder="e.g. Live Tea & Filter Coffee counter starts from Day 1 06:00 AM to Day 2 10:00 PM"
              className="h-12 text-base rounded-lg border-2 border-amber-200 focus:border-amber-600 focus:ring-amber-600"
            />
            <p className="text-xs text-gray-500">
              This notice appears prominently at the top of client quotations, Word documents, and the Chef's kitchen preparation sheet.
            </p>
          </div>
        </section>

        {/* Event Dates */}
        <section className="planner-form-section space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="planner-icon-badge w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg">
              <CalendarDays aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Event Duration</h3>
              <p className="text-sm text-gray-500">Tamil date is calculated from your selected start date.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-base font-semibold text-gray-700">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-12 text-base rounded-lg border-2 border-red-200 focus:border-red-600 focus:ring-red-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tamilDate" className="text-base font-semibold text-gray-700">
              Tamil Date & Day (Auto)
              </Label>
              <Input
                id="tamilDate"
                value={displayTamilDate}
                readOnly
                aria-describedby="tamilDateHelp"
                placeholder="Choose an English event date"
                className="h-12 rounded-lg border-2 border-red-200 focus:border-red-600"
              />
              <p id="tamilDateHelp" className="text-xs text-gray-500" aria-live="polite">
                Tamil solar calendar · India time
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-base font-semibold text-gray-700">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="h-12 text-base rounded-lg border-2 border-red-200 focus:border-red-600 focus:ring-red-600"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="transportCharge" className="text-base font-semibold text-gray-700">
              Transport / Other Charges (₹)
            </Label>
            <Input
              id="transportCharge"
              type="number"
              min="0"
              placeholder="0"
              value={transportCharge}
              onChange={(e) => {
                const val = e.target.value;
                setTransportCharge(val === '' ? '' : Math.max(0, Number(val) || 0));
              }}
              className="h-12 rounded-lg border-2 border-red-200 focus:border-red-600"
            />
          </div>
          {startDate && endDate && (
            <div className="planner-duration-summary p-5 bg-gradient-to-r from-red-100 to-orange-100 rounded-xl border-2 border-red-300 shadow-md">
              <p className="text-base text-red-900 font-bold flex items-center gap-2">
                <Clock3 className="h-5 w-5" aria-hidden="true" />
                Event duration <span className="text-xl font-bold">{calculateDays()}</span> day(s)
              </p>
            </div>
          )}
        </section>

        <Button
          onClick={handleSave}
          disabled={!isValid}
          className="w-full h-14 text-lg font-bold rounded-lg bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-50 shadow-lg"
        >
          Save & Continue to Session Planning →
        </Button>
      </div>
    </div>
  );
};
