import { useEffect, useState } from "react";
import type { Event } from "../../domain/entities/Event";
import { apiClient } from "../../infrastructure/api/apiClient";

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get<Event[]>("/events/all");
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
  }, []);

  const createEvent = async (
    data: Omit<Event, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newEvent = await apiClient.post<Event>("/events", data);
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
    try {
      const updatedEvent = await apiClient.patch<Event>(`/events/${id}`, data);
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
    try {
      await apiClient.delete(`/events/${id}`);
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
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    refresh: async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.get<Event[]>("/events/all");
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
