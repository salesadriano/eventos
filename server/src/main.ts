import { createApp } from "./app";
import { environment } from "./config/environment";
import { buildContainer } from "./container";

const startServer = async (): Promise<void> => {
  try {
    // Initialize sheets and build container
    const { controllers } = await buildContainer();
    const app = createApp({ controllers });

    const server = app.listen(environment.port, () => {
      console.log(`Server listening on port ${environment.port}`);
    });

    server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `Port ${environment.port} is already in use. Please stop the process using this port or change the PORT environment variable.`
        );
        process.exit(1);
      } else {
        console.error("Server error:", error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
