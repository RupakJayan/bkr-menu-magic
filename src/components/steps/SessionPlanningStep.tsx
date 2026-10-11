import React, { useState } from 'react';
import { EventMenu, Session, DayPlan } from '@/types/menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Clock3, Plus, Trash2, Utensils } from 'lucide-react';
import { addDaysToISODate } from '@/utils/istDate';
import { formatISTDate } from '@/utils/istDate';

interface SessionPlanningStepProps {
  menu: EventMenu;
  onMenuChange: (menu: EventMenu) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const SESSION_TYPES = [
  { value: 'breakfast', label: 'Breakfast', defaultTime: '08:00-10:00' },
  { value: 'morning_snacks', label: 'Snacks @11', defaultTime: '11:00-11:30' },
  { value: 'lunch', label: 'Lunch', defaultTime: '12:00-14:00' },
  { value: 'afternoon_snacks', label: 'Snacks @4', defaultTime: '16:00-16:30' },
  { value: 'evening_snacks', label: 'Evening Snacks', defaultTime: '18:00-18:30' },
  { value: 'dinner', label: 'Dinner', defaultTime: '19:00-21:00' },
  { value: 'custom', label: 'Custom', defaultTime: '00:00-00:00' },
];

export const SessionPlanningStep: React.FC<SessionPlanningStepProps> = ({ menu, onMenuChange, onNext, onPrevious }) => {
  const [days, setDays] = useState<DayPlan[]>(menu.days.length > 0 ? menu.days : initializeDays());

  function initializeDays(): DayPlan[] {
    const dayPlans: DayPlan[] = [];
    for (let i = 0; i < menu.numberOfDays; i++) {
      dayPlans.push({
        dayNumber: i + 1,
        date: addDaysToISODate(menu.startDate, i),
        sessions: [],
      });
    }

    return dayPlans;
  }

  const addSession = (dayIndex: number) => {
    const newSession: Session = {
      id: `session_${Date.now()}`,
      name: 'Breakfast',
      type: 'breakfast',
      startTime: '08:00',
      endTime: '10:00',
      headCount: 50,
      ratePerPerson: 0,
      selectedDishes: [],
    };

    const updatedDays = [...days];
    updatedDays[dayIndex].sessions.push(newSession);
    setDays(updatedDays);
  };

  const removeSession = (dayIndex: number, sessionIndex: number) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].sessions.splice(sessionIndex, 1);
    setDays(updatedDays);
  };

  const updateSession = (
    dayIndex: number,
    sessionIndex: number,
    field: keyof Session,
    value: Session[keyof Session],
  ) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].sessions[sessionIndex] = {
      ...updatedDays[dayIndex].sessions[sessionIndex],
      [field]: value,
    };

    // Auto-update name and times when type changes
    if (field === 'type') {
      const sessionType = SESSION_TYPES.find(s => s.value === value);
      if (sessionType) {
        const [start, end] = sessionType.defaultTime.split('-');
        updatedDays[dayIndex].sessions[sessionIndex].name = sessionType.label;
        updatedDays[dayIndex].sessions[sessionIndex].startTime = start;
        updatedDays[dayIndex].sessions[sessionIndex].endTime = end;
      }
    }

    setDays(updatedDays);
  };

  const handleSave = () => {
    onMenuChange({
      ...menu,
      days,
      updatedAt: new Date(),
    });
    onNext();
  };

  const isValid = days.every(day => day.sessions.length > 0);

  return (
    <div className="planner-step-panel bg-white rounded-xl shadow-xl border-2 border-pink-300 overflow-hidden">
      <div className="planner-step-banner bg-gradient-to-r from-pink-600 to-rose-600 p-8 text-white">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Clock3 className="h-7 w-7" aria-hidden="true" />
          Session Planning | அமர்வு திட்டமிடல்
        </h2>
        <p className="text-pink-100 mt-2">Choose the service times, guest counts and rates for each event day.</p>
      </div>

      <div className="planner-step-body p-8 space-y-6 bg-gradient-to-b from-white to-pink-50">
        {days.map((day, dayIndex) => (
          <section key={dayIndex} className="planner-day-card border-2 border-pink-300 rounded-xl overflow-hidden shadow-lg">
            <div className="planner-day-heading bg-gradient-to-r from-orange-500 to-pink-500 p-6 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <CalendarDays className="h-5 w-5" aria-hidden="true" />
                Day {day.dayNumber} - {formatISTDate(day.date, 'en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h3>
              <p className="mt-1 text-sm text-white/80">
                {day.sessions.length} {day.sessions.length === 1 ? 'session' : 'sessions'} planned
              </p>
            </div>
            <div className="p-6 space-y-4 bg-white">
              {day.sessions.map((session, sessionIndex) => (
                <article key={session.id} className="planner-session-card p-5 border-2 border-pink-300 rounded-lg bg-gradient-to-br from-white to-pink-50 shadow-md space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <Utensils className="h-5 w-5" aria-hidden="true" />
                      Session {sessionIndex + 1}
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSession(dayIndex, sessionIndex)}
                      className="hover:bg-red-100 rounded-lg"
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-base font-semibold text-gray-700">Session Type</Label>
                      <Select
                        value={session.type}
                        onValueChange={(value) => updateSession(dayIndex, sessionIndex, 'type', value)}
                      >
                        <SelectTrigger className="h-12 rounded-lg border-2 border-pink-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SESSION_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-semibold text-gray-700">Session Name</Label>
                      <Input
                        value={session.name}
                        onChange={(e) => updateSession(dayIndex, sessionIndex, 'name', e.target.value)}
                        placeholder="Session name"
                        className="h-12 rounded-lg border-2 border-pink-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-semibold text-gray-700">Start Time</Label>
                      <Input
                        type="time"
                        value={session.startTime}
                        onChange={(e) => updateSession(dayIndex, sessionIndex, 'startTime', e.target.value)}
                        className="h-12 rounded-lg border-2 border-pink-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-semibold text-gray-700">End Time</Label>
                      <Input
                        type="time"
                        value={session.endTime}
                        onChange={(e) => updateSession(dayIndex, sessionIndex, 'endTime', e.target.value)}
                        className="h-12 rounded-lg border-2 border-pink-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-semibold text-gray-700">Head Count</Label>
                      <Input
                        type="number"
                        min="1"
                        value={session.headCount}
                        onChange={(e) => updateSession(dayIndex, sessionIndex, 'headCount', parseInt(e.target.value) || 1)}
                        placeholder="Number of people"
                        className="h-12 rounded-lg border-2 border-pink-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-semibold text-gray-700">Rate per Person (₹)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        value={session.ratePerPerson ?? 0}
                        onChange={(e) => updateSession(dayIndex, sessionIndex, 'ratePerPerson', Math.max(0, Number(e.target.value) || 0))}
                        placeholder="Enter quoted rate"
                        className="h-12 rounded-lg border-2 border-pink-300"
                      />
                    </div>
                  </div>
                </article>
              ))}

              <Button
                variant="outline"
                onClick={() => addSession(dayIndex)}
                className="w-full h-14 rounded-lg border-2 border-pink-400 hover:bg-pink-100 text-base font-bold text-pink-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Session to Day {day.dayNumber}
              </Button>
            </div>
          </section>
        ))}

        <div className="flex gap-4 pt-4">
          <Button
            variant="outline"
            onClick={onPrevious}
            className="flex-1 h-14 text-lg font-bold rounded-lg border-2 border-pink-400 hover:bg-pink-50"
          >
            Previous
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValid}
            className="flex-1 h-14 text-lg font-bold rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 disabled:opacity-50 shadow-lg"
          >
            Save & Continue to Menu Selection →
          </Button>
        </div>
      </div>
    </div>
  );
};
