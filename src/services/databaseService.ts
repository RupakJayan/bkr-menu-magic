import { EventPlan, ClientDetails, VenueDetails, EventDates, DayPlan, SessionPlan } from '../types/eventTypes';

export interface DatabaseEvent {
  id: string;
  eventPlan: EventPlan;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'confirmed' | 'completed' | 'cancelled';
  googleDriveId?: string;
}

class DatabaseService {
  private events: DatabaseEvent[] = [];
  private readonly STORAGE_KEY = 'bkr_events';
  private readonly GOOGLE_DRIVE_API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;

  constructor() {
    this.loadEventsFromStorage();
  }

  // Load events from localStorage
  private loadEventsFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.events = JSON.parse(stored).map((event: any) => ({
          ...event,
          createdAt: new Date(event.createdAt),
          updatedAt: new Date(event.updatedAt)
        }));
      }
    } catch (error) {
      console.error('Error loading events from storage:', error);
      this.events = [];
    }
  }

  // Save events to localStorage
  private saveEventsToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.events));
    } catch (error) {
      console.error('Error saving events to storage:', error);
    }
  }

  // Create new event
  async createEvent(eventPlan: EventPlan): Promise<DatabaseEvent> {
    const newEvent: DatabaseEvent = {
      id: this.generateId(),
      eventPlan,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft'
    };

    this.events.push(newEvent);
    this.saveEventsToStorage();
    
    // Sync to Google Drive
    await this.syncToGoogleDrive(newEvent);
    
    return newEvent;
  }

  // Update existing event
  async updateEvent(id: string, eventPlan: EventPlan): Promise<DatabaseEvent | null> {
    const eventIndex = this.events.findIndex(e => e.id === id);
    if (eventIndex === -1) return null;

    this.events[eventIndex] = {
      ...this.events[eventIndex],
      eventPlan,
      updatedAt: new Date()
    };

    this.saveEventsToStorage();
    
    // Sync to Google Drive
    await this.syncToGoogleDrive(this.events[eventIndex]);
    
    return this.events[eventIndex];
  }

  // Get event by ID
  async getEvent(id: string): Promise<DatabaseEvent | null> {
    return this.events.find(e => e.id === id) || null;
  }

  // Get all events
  async getAllEvents(): Promise<DatabaseEvent[]> {
    return [...this.events];
  }

  // Delete event
  async deleteEvent(id: string): Promise<boolean> {
    const eventIndex = this.events.findIndex(e => e.id === id);
    if (eventIndex === -1) return false;

    const event = this.events[eventIndex];
    this.events.splice(eventIndex, 1);
    this.saveEventsToStorage();

    // Remove from Google Drive
    if (event.googleDriveId) {
      await this.removeFromGoogleDrive(event.googleDriveId);
    }

    return true;
  }

  // Update event status
  async updateEventStatus(id: string, status: DatabaseEvent['status']): Promise<DatabaseEvent | null> {
    const event = await this.getEvent(id);
    if (!event) return null;

    return await this.updateEvent(id, event.eventPlan);
  }

  // Check for date conflicts
  async checkDateConflicts(startDate: string, endDate: string, excludeEventId?: string): Promise<boolean> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.events.some(event => {
      if (excludeEventId && event.id === excludeEventId) return false;
      if (event.status === 'cancelled') return false;

      const eventStart = new Date(event.eventPlan.eventDates.startDate);
      const eventEnd = new Date(event.eventPlan.eventDates.endDate);

      return (start <= eventEnd && end >= eventStart);
    });
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Google Drive Integration
  private async syncToGoogleDrive(event: DatabaseEvent): Promise<void> {
    if (!this.GOOGLE_DRIVE_API_KEY) {
      console.warn('Google Drive API key not configured');
      return;
    }

    try {
      // This is a simplified version - in production you'd use the full Google Drive API
      const eventData = {
        id: event.id,
        clientName: event.eventPlan.clientDetails.name,
        venue: event.eventPlan.venueDetails.name,
        startDate: event.eventPlan.eventDates.startDate,
        endDate: event.eventPlan.eventDates.endDate,
        status: event.status,
        createdAt: event.createdAt.toISOString(),
        updatedAt: event.updatedAt.toISOString()
      };

      // Store in Google Drive (simplified)
      console.log('Syncing to Google Drive:', eventData);
      
      // In a real implementation, you'd use the Google Drive API here
      // For now, we'll just log the data
      
    } catch (error) {
      console.error('Error syncing to Google Drive:', error);
    }
  }

  private async removeFromGoogleDrive(driveId: string): Promise<void> {
    if (!this.GOOGLE_DRIVE_API_KEY) return;

    try {
      // Remove from Google Drive (simplified)
      console.log('Removing from Google Drive:', driveId);
      
      // In a real implementation, you'd use the Google Drive API here
      
    } catch (error) {
      console.error('Error removing from Google Drive:', error);
    }
  }

  // Export events to CSV
  async exportToCSV(): Promise<string> {
    const headers = ['ID', 'Client Name', 'Phone', 'Venue', 'Start Date', 'End Date', 'Status', 'Created At'];
    const rows = this.events.map(event => [
      event.id,
      event.eventPlan.clientDetails.name,
      event.eventPlan.clientDetails.phone,
      event.eventPlan.venueDetails.name,
      event.eventPlan.eventDates.startDate,
      event.eventPlan.eventDates.endDate,
      event.status,
      event.createdAt.toISOString()
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  }

  // Get events by date range
  async getEventsByDateRange(startDate: string, endDate: string): Promise<DatabaseEvent[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.events.filter(event => {
      const eventStart = new Date(event.eventPlan.eventDates.startDate);
      const eventEnd = new Date(event.eventPlan.eventDates.endDate);
      return (eventStart <= end && eventEnd >= start);
    });
  }

  // Get events by status
  async getEventsByStatus(status: DatabaseEvent['status']): Promise<DatabaseEvent[]> {
    return this.events.filter(event => event.status === status);
  }

  // Search events
  async searchEvents(query: string): Promise<DatabaseEvent[]> {
    const lowerQuery = query.toLowerCase();
    
    return this.events.filter(event => 
      event.eventPlan.clientDetails.name.toLowerCase().includes(lowerQuery) ||
      event.eventPlan.clientDetails.phone.includes(lowerQuery) ||
      event.eventPlan.venueDetails.name.toLowerCase().includes(lowerQuery) ||
      event.eventPlan.venueDetails.address.toLowerCase().includes(lowerQuery)
    );
  }
}

export const databaseService = new DatabaseService();
export default databaseService;
