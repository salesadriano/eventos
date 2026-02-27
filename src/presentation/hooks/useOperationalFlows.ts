import { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient } from "../../infrastructure/api/apiClient";

interface Inscription {
  id: string;
  eventId: string;
  userId: string;
  activityId?: string;
  status: "pending" | "confirmed" | "cancelled";
}

interface Presence {
  id: string;
  eventId: string;
  userId: string;
  activityId?: string;
  presentAt: string;
}

export const useOperationalFlows = () => {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [presences, setPresences] = useState<Presence[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [inscriptionsData, presencesData] = await Promise.all([
        apiClient.get<Inscription[]>("/inscriptions/all"),
        apiClient.get<Presence[]>("/presences/all"),
      ]);

      setInscriptions(inscriptionsData);
      setPresences(presencesData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createInscription = useCallback(
    async (payload: {
      eventId: string;
      userId: string;
      activityId?: string;
      status?: "pending" | "confirmed" | "cancelled";
    }) => {
      const created = await apiClient.post<Inscription>("/inscriptions", payload);
      setInscriptions((current) => [...current, created]);
      return created;
    },
    []
  );

  const createPresence = useCallback(
    async (payload: { eventId: string; userId: string; activityId?: string }) => {
      const created = await apiClient.post<Presence>("/presences", payload);
      setPresences((current) => [...current, created]);
      return created;
    },
    []
  );

  const eligibleCertificates = useMemo(() => {
    const confirmedInscriptions = inscriptions.filter(
      (inscription) => inscription.status !== "cancelled"
    );

    return confirmedInscriptions.filter((inscription) => {
      return presences.some(
        (presence) =>
          presence.eventId === inscription.eventId &&
          presence.userId === inscription.userId &&
          ((inscription.activityId || "")
            ? (presence.activityId || "") === (inscription.activityId || "")
            : true)
      );
    });
  }, [inscriptions, presences]);

  return {
    loading,
    inscriptions,
    presences,
    eligibleCertificates,
    createInscription,
    createPresence,
    refresh,
  };
};
