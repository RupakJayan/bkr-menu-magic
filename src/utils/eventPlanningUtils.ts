import { EventPlan, DayPlan, SessionPlan, SessionType, CuisineType } from '../types/eventTypes';

export const sessionTypes: SessionType[] = [
  {
    id: 'breakfast',
    name: 'Breakfast',
    name_ta: 'காலை உணவு',
    icon: '🌅',
    defaultStartTime: '07:00',
    defaultEndTime: '10:00',
    defaultHeadCount: 50
  },
  {
    id: 'morning-snack',
    name: 'Morning Snack',
    name_ta: 'காலை சிற்றுண்டி',
    icon: '☕',
    defaultStartTime: '10:30',
    defaultEndTime: '11:30',
    defaultHeadCount: 50
  },
  {
    id: 'lunch',
    name: 'Lunch',
    name_ta: 'மதிய உணவு',
    icon: '🍽️',
    defaultStartTime: '12:00',
    defaultEndTime: '15:00',
    defaultHeadCount: 50
  },
  {
    id: 'afternoon-snack',
    name: 'Afternoon Snack',
    name_ta: 'மதிய சிற்றுண்டி',
    icon: '🍵',
    defaultStartTime: '15:30',
    defaultEndTime: '16:30',
    defaultHeadCount: 50
  },
  {
    id: 'evening-snack',
    name: 'Evening Snack',
    name_ta: 'மாலை சிற்றுண்டி',
    icon: '☕',
    defaultStartTime: '17:00',
    defaultEndTime: '18:00',
    defaultHeadCount: 50
  },
  {
    id: 'dinner',
    name: 'Dinner',
    name_ta: 'இரவு உணவு',
    icon: '🌙',
    defaultStartTime: '19:00',
    defaultEndTime: '22:00',
    defaultHeadCount: 50
  },
  {
    id: 'packing',
    name: 'Packing Food',
    name_ta: 'பேக்கிங் உணவு',
    icon: '📦',
    defaultStartTime: '06:00',
    defaultEndTime: '23:00',
    defaultHeadCount: 50
  }
];

export const cuisineTypes: CuisineType[] = [
  {
    id: 'south-indian',
    name: 'South Indian',
    name_ta: 'தென்னிந்திய',
    icon: '🍛'
  },
  {
    id: 'north-indian',
    name: 'North Indian',
    name_ta: 'வடஇந்திய',
    icon: '🥘'
  },
  {
    id: 'chettinad',
    name: 'Chettinad',
    name_ta: 'செட்டிநாடு',
    icon: '🌶️'
  },
  {
    id: 'continental',
    name: 'Continental',
    name_ta: 'கண்டிநென்டல்',
    icon: '🍝'
  },
  {
    id: 'chinese',
    name: 'Chinese',
    name_ta: 'சீன',
    icon: '🥢'
  },
  {
    id: 'other',
    name: 'Other',
    name_ta: 'மற்றவை',
    icon: '🍽️'
  }
];

export const calculateNumberOfDays = (startDate: string, endDate: string): number => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays + 1; // Include both start and end dates
};

export const generateDefaultDayPlan = (date: string, dayNumber: number): DayPlan => {
  const sessions: SessionPlan[] = sessionTypes.map(sessionType => ({
    id: `${dayNumber}-${sessionType.id}`,
    sessionName: sessionType.name,
    sessionNameTa: sessionType.name_ta,
    sessionType: sessionType.id as any,
    timeRange: {
      startTime: sessionType.defaultStartTime,
      endTime: sessionType.defaultEndTime
    },
    headCount: sessionType.defaultHeadCount,
    items: [],
    notes: ''
  }));

  return {
    date,
    dayNumber,
    sessions
  };
};

export const createNewEventPlan = (): EventPlan => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const newPlan = {
    clientDetails: {
      name: '',
      phone: '',
      email: '',
      address: ''
    },
    venueDetails: {
      name: '',
      address: '',
      coordinates: undefined,
      googleMapsUrl: ''
    },
    eventDates: {
      startDate: today.toISOString().split('T')[0],
      endDate: tomorrow.toISOString().split('T')[0],
      numberOfDays: 1
    },
    eventDetails: {
      eventName: '',
      eventType: '',
      eventDate: today.toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      expectedGuests: 0,
      venue: '',
      description: '',
      specialRequirements: ''
    },
    days: [],
    totalHeadCount: 0,
    totalSessions: 0,
    status: 'draft' as const
  };
  
  return newPlan;
};

export const calculateTotalHeadCount = (days: DayPlan[]): number => {
  return days.reduce((total, day) => {
    return total + day.sessions.reduce((dayTotal, session) => dayTotal + session.headCount, 0);
  }, 0);
};

export const calculateTotalSessions = (days: DayPlan[]): number => {
  return days.reduce((total, day) => total + day.sessions.length, 0);
};

export const hasTimeOverlap = (day: DayPlan, sessionIndex: number): boolean => {
  const currentSession = day.sessions[sessionIndex];
  
  for (let i = 0; i < day.sessions.length; i++) {
    if (i === sessionIndex) continue;
    
    const otherSession = day.sessions[i];
    const currentStart = new Date(`2000-01-01T${currentSession.timeRange.startTime}`);
    const currentEnd = new Date(`2000-01-01T${currentSession.timeRange.endTime}`);
    const otherStart = new Date(`2000-01-01T${otherSession.timeRange.startTime}`);
    const otherEnd = new Date(`2000-01-01T${otherSession.timeRange.endTime}`);
    
    if (currentStart < otherEnd && currentEnd > otherStart) {
      return true;
    }
  }
  
  return false;
};

export const validateEventPlan = (eventPlan: EventPlan): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate client details
  if (!eventPlan.clientDetails.name.trim()) {
    errors.push('Client name is required');
  }
  if (!eventPlan.clientDetails.phone.trim()) {
    errors.push('Client phone number is required');
  }

  // Validate venue details
  if (!eventPlan.venueDetails.name.trim()) {
    errors.push('Venue name is required');
  }
  if (!eventPlan.venueDetails.address.trim()) {
    errors.push('Venue address is required');
  }

  // Validate dates
  if (!eventPlan.eventDates.startDate) {
    errors.push('Start date is required');
  }
  if (!eventPlan.eventDates.endDate) {
    errors.push('End date is required');
  }
  if (eventPlan.eventDates.numberOfDays <= 0) {
    errors.push('Event must be at least 1 day');
  }

  // Validate sessions
  eventPlan.days.forEach((day, dayIndex) => {
    day.sessions.forEach((session, sessionIndex) => {
      if (session.headCount <= 0) {
        errors.push(`Day ${day.dayNumber}, ${session.sessionName}: Head count must be greater than 0`);
      }
      
      if (hasTimeOverlap(day, sessionIndex)) {
        errors.push(`Day ${day.dayNumber}, ${session.sessionName}: Time overlap detected`);
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const generateSessionId = (dayNumber: number, sessionType: string): string => {
  return `${dayNumber}-${sessionType}-${Date.now()}`;
};

export const addCustomSession = (day: DayPlan, sessionName: string, sessionNameTa: string, startTime: string, endTime: string, headCount: number): DayPlan => {
  const newSession: SessionPlan = {
    id: generateSessionId(day.dayNumber, 'custom'),
    sessionName,
    sessionNameTa,
    sessionType: 'custom',
    timeRange: { startTime, endTime },
    headCount,
    items: [],
    notes: ''
  };

  return {
    ...day,
    sessions: [...day.sessions, newSession]
  };
};

export const removeSession = (day: DayPlan, sessionId: string): DayPlan => {
  return {
    ...day,
    sessions: day.sessions.filter(session => session.id !== sessionId)
  };
};
