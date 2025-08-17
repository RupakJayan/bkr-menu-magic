import { EventPlan } from '../data/eventPlanningData';

export interface Booking {
  id: string;
  eventPlan: EventPlan;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  totalAmount?: number;
  paymentStatus?: 'pending' | 'partial' | 'completed';
}

class EventService {
  private bookings: Booking[] = [];
  private nextId = 1;

  constructor() {
    // Load existing bookings from localStorage
    this.loadBookings();
  }

  private loadBookings() {
    try {
      const stored = localStorage.getItem('bkr_event_bookings');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.bookings = parsed.map((booking: any) => ({
          ...booking,
          createdAt: new Date(booking.createdAt),
          updatedAt: new Date(booking.updatedAt),
          eventPlan: {
            ...booking.eventPlan,
            createdAt: new Date(booking.eventPlan.createdAt),
            updatedAt: new Date(booking.eventPlan.updatedAt)
          }
        }));
        this.nextId = Math.max(...this.bookings.map(b => parseInt(b.id))) + 1;
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      this.bookings = [];
    }
  }

  private saveBookings() {
    try {
      localStorage.setItem('bkr_event_bookings', JSON.stringify(this.bookings));
    } catch (error) {
      console.error('Error saving bookings:', error);
    }
  }

  // Create a new booking
  async createBooking(eventPlan: EventPlan): Promise<Booking> {
    const booking: Booking = {
      id: this.nextId.toString(),
      eventPlan: {
        ...eventPlan,
        id: `event_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      paymentStatus: 'pending'
    };

    this.bookings.push(booking);
    this.nextId++;
    this.saveBookings();
    return booking;
  }

  // Get all bookings
  async getBookings(): Promise<Booking[]> {
    return [...this.bookings];
  }

  // Get booking by ID
  async getBookingById(id: string): Promise<Booking | null> {
    return this.bookings.find(booking => booking.id === id) || null;
  }

  // Update booking status
  async updateBookingStatus(id: string, status: Booking['status']): Promise<Booking | null> {
    const booking = this.bookings.find(b => b.id === id);
    if (booking) {
      booking.status = status;
      booking.updatedAt = new Date();
      this.saveBookings();
      return booking;
    }
    return null;
  }

  // Update payment status
  async updatePaymentStatus(id: string, paymentStatus: Booking['paymentStatus']): Promise<Booking | null> {
    const booking = this.bookings.find(b => b.id === id);
    if (booking) {
      booking.paymentStatus = paymentStatus;
      booking.updatedAt = new Date();
      this.saveBookings();
      return booking;
    }
    return null;
  }

  // Update entire booking
  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | null> {
    const booking = this.bookings.find(b => b.id === id);
    if (booking) {
      Object.assign(booking, updates);
      booking.updatedAt = new Date();
      this.saveBookings();
      return booking;
    }
    return null;
  }

  // Delete booking
  async deleteBooking(id: string): Promise<boolean> {
    const index = this.bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      this.bookings.splice(index, 1);
      this.saveBookings();
      return true;
    }
    return false;
  }

  // Get bookings by status
  async getBookingsByStatus(status: Booking['status']): Promise<Booking[]> {
    return this.bookings.filter(booking => booking.status === status);
  }

  // Get bookings by date range
  async getBookingsByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    return this.bookings.filter(booking => {
      const eventStart = new Date(booking.eventPlan.eventDates.startDate);
      const eventEnd = new Date(booking.eventPlan.eventDates.endDate);
      return eventStart >= startDate && eventEnd <= endDate;
    });
  }

  // Search bookings
  async searchBookings(query: string): Promise<Booking[]> {
    const lowerQuery = query.toLowerCase();
    return this.bookings.filter(booking => 
      booking.eventPlan.clientDetails.name.toLowerCase().includes(lowerQuery) ||
      booking.eventPlan.clientDetails.phone.includes(query) ||
      booking.eventPlan.clientDetails.email?.toLowerCase().includes(lowerQuery) ||
      booking.eventPlan.venueDetails.name.toLowerCase().includes(lowerQuery) ||
      booking.eventPlan.venueDetails.address.toLowerCase().includes(lowerQuery)
    );
  }

  // Get dashboard statistics
  async getDashboardStats() {
    const total = this.bookings.length;
    const pending = this.bookings.filter(b => b.status === 'pending').length;
    const confirmed = this.bookings.filter(b => b.status === 'confirmed').length;
    const completed = this.bookings.filter(b => b.status === 'completed').length;
    const cancelled = this.bookings.filter(b => b.status === 'cancelled').length;

    const totalHeadCount = this.bookings.reduce((sum, booking) => {
      return sum + booking.eventPlan.days.reduce((daySum, day) => {
        return daySum + day.sessions.reduce((sessionSum, session) => {
          return sessionSum + session.headCount;
        }, 0);
      }, 0);
    }, 0);

    const totalRevenue = this.bookings
      .filter(b => b.paymentStatus === 'completed')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    return {
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      totalHeadCount,
      totalRevenue,
      averageHeadCount: total > 0 ? Math.round(totalHeadCount / total) : 0
    };
  }

  // Export bookings to JSON
  async exportBookings(): Promise<string> {
    return JSON.stringify(this.bookings, null, 2);
  }

  // Import bookings from JSON
  async importBookings(jsonData: string): Promise<boolean> {
    try {
      const imported = JSON.parse(jsonData);
      if (Array.isArray(imported)) {
        this.bookings = imported.map((booking: any) => ({
          ...booking,
          createdAt: new Date(booking.createdAt),
          updatedAt: new Date(booking.updatedAt),
          eventPlan: {
            ...booking.eventPlan,
            createdAt: new Date(booking.eventPlan.createdAt),
            updatedAt: new Date(booking.eventPlan.updatedAt)
          }
        }));
        this.nextId = Math.max(...this.bookings.map(b => parseInt(b.id))) + 1;
        this.saveBookings();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing bookings:', error);
      return false;
    }
  }
}

export const eventService = new EventService();
export default eventService;
