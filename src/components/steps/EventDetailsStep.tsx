import React, { useState } from 'react';
import { EventMenu } from '@/types/menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getTamilSolarDate } from '@/utils/tamilDate';
import { differenceInCalendarDays } from '@/utils/istDate';

interface EventDetailsStepProps {
  menu: EventMenu;
  onMenuChange: (menu: EventMenu) => void;
  onNext: () => void;
}

export const EventDetailsStep: React.FC<EventDetailsStepProps> = ({ menu, onMenuChange, onNext }) => {
  const [clientName, setClientName] = useState(menu.clientDetails.name);
  const [clientPhone, setClientPhone] = useState(menu.clientDetails.phone);
  const [venueName, setVenueName] = useState(menu.venueDetails.name);
  const [venueAddress, setVenueAddress] = useState(menu.venueDetails.address);
  const [transportCharge, setTransportCharge] = useState(menu.transportCharge ?? 0);
  const [googleMapsUrl, setGoogleMapsUrl] = useState(menu.venueDetails.googleMapsUrl || '');
  const [startDate, setStartDate] = useState(menu.startDate);
  const [endDate, setEndDate] = useState(menu.endDate);
  const tamilDate = getTamilSolarDate(startDate);

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
      tamilDate: tamilDate || undefined,
      transportCharge: Math.max(0, transportCharge),
      startDate,
      endDate,
      numberOfDays,
      updatedAt: new Date(),
    });
    
    onNext();
  };

  const isValid = clientName && clientPhone && venueName && venueAddress && startDate && endDate && endDate >= startDate;

  return (
    <div className="bg-white rounded-xl shadow-xl border-2 border-red-200 overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 p-8 text-white">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <span className="text-4xl">📋</span>
          Event Details | நிகழ்வு விவரங்கள்
        </h2>
        <p className="text-red-100 mt-2">Fill in your event information</p>
      </div>
      
      <div className="p-8 space-y-8 bg-gradient-to-b from-white to-orange-50">
        {/* Client Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-2xl shadow-lg">
              👤
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Client Information</h3>
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
        </div>

        {/* Venue Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-2xl shadow-lg">
              📍
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Venue Information</h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="venueName" className="text-base font-semibold text-gray-700">Venue Name *</Label>
              <Input
                id="venueName"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder="Enter venue name"
                className="h-12 text-base rounded-lg border-2 border-red-200 focus:border-red-600 focus:ring-red-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venueAddress" className="text-base font-semibold text-gray-700">Venue Address *</Label>
              <Textarea
                id="venueAddress"
                value={venueAddress}
                onChange={(e) => setVenueAddress(e.target.value)}
                placeholder="Enter complete venue address"
                rows={3}
                className="text-base rounded-lg border-2 border-red-200 focus:border-red-600 focus:ring-red-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="googleMapsUrl" className="text-base font-semibold text-gray-700">Google Maps URL (Optional)</Label>
              <Input
                id="googleMapsUrl"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="h-12 text-base rounded-lg border-2 border-red-200 focus:border-red-600 focus:ring-red-600"
              />
            </div>
          </div>
        </div>

        {/* Event Dates */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-2xl shadow-lg">
              📅
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Event Duration</h3>
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
                value={tamilDate}
                readOnly
                aria-describedby="tamilDateHelp"
                placeholder="Choose an English event date"
                className="h-12 rounded-lg border-2 border-red-200 focus:border-red-600"
              />
              <p id="tamilDateHelp" className="text-xs text-gray-500" aria-live="polite">
                Calculated from the start date using the Tamil solar calendar (India time).
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
              value={transportCharge}
              onChange={(e) => setTransportCharge(Math.max(0, Number(e.target.value) || 0))}
              className="h-12 rounded-lg border-2 border-red-200 focus:border-red-600"
            />
          </div>
          {startDate && endDate && (
            <div className="p-5 bg-gradient-to-r from-red-100 to-orange-100 rounded-xl border-2 border-red-300 shadow-md">
              <p className="text-base text-red-900 font-bold flex items-center gap-2">
                <span className="text-2xl">⏱️</span>
                Event Duration: <span className="text-xl font-bold">{calculateDays()}</span> day(s)
              </p>
            </div>
          )}
        </div>

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
