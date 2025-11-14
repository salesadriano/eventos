import { useEffect, useState } from "react";
import { EventService } from "../../application/services/EventService";
import type { Event } from "../../domain/entities/Event";
import { createGoogleSheetsConfig } from "../../infrastructure/config/googleSheetsConfig";
import { Container } from "../../infrastructure/di/container";

export const useEventService = () => {
  const [service, setService] = useState<EventService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const config = createGoogleSheetsConfig();
      const eventService = Container.createEventService(config);
      setService(eventService);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to initialize event service")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return { service, loading, error };
};

export const useEvents = () => {
  const {
    service,
    loading: serviceLoading,
    error: serviceError,
  } = useEventService();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!service) return;

    const loadEvents = async () => {
      try {
        setLoading(true);
        const data = await service.getAllEvents();
        setEvents(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load events")
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [service]);

  const createEvent = async (
    data: Omit<Event, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!service) throw new Error("Service not initialized");
    try {
      const newEvent = await service.createEvent(data);
      setEvents((prev) => [...prev, newEvent]);
      return newEvent;
    } catch (error) {
      setError(
        error instanceof Error ? error : new Error("Failed to create event")
      );
      throw error;
    }
  };

  const updateEvent = async (id: string, data: Partial<Event>) => {
    if (!service) throw new Error("Service not initialized");
    try {
      const updatedEvent = await service.updateEvent(id, data);
      setEvents((prev) => prev.map((e) => (e.id === id ? updatedEvent : e)));
      return updatedEvent;
    } catch (error) {
      setError(
        error instanceof Error ? error : new Error("Failed to update event")
      );
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    if (!service) throw new Error("Service not initialized");
    try {
      await service.deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      setError(
        error instanceof Error ? error : new Error("Failed to delete event")
      );
      throw error;
    }
  };

  return {
    events,
    loading: loading || serviceLoading,
    error: error || serviceError,
    createEvent,
    updateEvent,
    deleteEvent,
    refresh: async () => {
      if (!service) {
        throw new Error("Service not initialized");
      }
      try {
        setLoading(true);
        setError(null);
        const data = await service.getAllEvents();
        setEvents(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to refresh events")
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
  };
};
