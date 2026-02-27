import { useEffect, useMemo, useState } from "react";

type Speaker = {
  id: string;
  name: string;
  email: string;
  bio: string;
};

type RepositoryConfig = {
  provider: "local" | "drive" | "s3";
  endpoint: string;
  accessKey: string;
  secretKey: string;
};

const SPEAKERS_KEY = "eventos:mvp:speakers";
const REPOSITORY_KEY = "eventos:mvp:repository";

export const useSpeakerRepositoryMvp = () => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [repositoryConfig, setRepositoryConfig] = useState<RepositoryConfig>({
    provider: "local",
    endpoint: "",
    accessKey: "",
    secretKey: "",
  });

  useEffect(() => {
    try {
      const storedSpeakers = localStorage.getItem(SPEAKERS_KEY);
      if (storedSpeakers) {
        setSpeakers(JSON.parse(storedSpeakers) as Speaker[]);
      }

      const storedRepository = localStorage.getItem(REPOSITORY_KEY);
      if (storedRepository) {
        setRepositoryConfig(JSON.parse(storedRepository) as RepositoryConfig);
      }
    } catch {
      setSpeakers([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SPEAKERS_KEY, JSON.stringify(speakers));
  }, [speakers]);

  useEffect(() => {
    localStorage.setItem(REPOSITORY_KEY, JSON.stringify(repositoryConfig));
  }, [repositoryConfig]);

  const addSpeaker = (speaker: Omit<Speaker, "id">) => {
    const next: Speaker = {
      id: crypto.randomUUID(),
      ...speaker,
    };

    setSpeakers((current) => [...current, next]);
  };

  const updateRepository = (next: RepositoryConfig) => {
    setRepositoryConfig(next);
  };

  const testConnection = async (): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return Boolean(repositoryConfig.endpoint && repositoryConfig.accessKey);
  };

  const uploadValidation = useMemo(
    () => ({
      maxSizeInMb: 20,
      allowedExtensions: ["pdf", "ppt", "pptx"],
    }),
    []
  );

  return {
    speakers,
    repositoryConfig,
    addSpeaker,
    updateRepository,
    testConnection,
    uploadValidation,
  };
};
