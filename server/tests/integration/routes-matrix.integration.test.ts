import request from "supertest";
import { JwtService } from "../../src/infrastructure/auth/JwtService";
import { createAppForTests } from "../utils/createAppForTests";

const jwtService = new JwtService({
  secret: process.env.JWT_SECRET ?? "test-jwt-secret",
  accessTokenExpiry: "15m",
  refreshTokenExpiry: "7d",
});

const validAccessToken = jwtService.generateAccessToken({
  userId: "test-user-id",
  email: "test.user@example.com",
  profile: "admin",
});

describe("Route matrix integration", () => {
  it("returns 401 for protected resources without token", async () => {
    const app = createAppForTests();

    const targets = [
      "/api/events",
      "/api/users",
      "/api/inscriptions",
      "/api/presences",
    ];

    for (const target of targets) {
      const response = await request(app).get(target);
      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({ message: "No token provided" });
    }
  });

  it("reaches protected controllers with valid token", async () => {
    const app = createAppForTests();

    const targets = [
      "/api/events",
      "/api/users",
      "/api/inscriptions",
      "/api/presences",
    ];

    for (const target of targets) {
      const response = await request(app)
        .get(target)
        .set("Authorization", `Bearer ${validAccessToken}`);

      expect(response.status).toBe(501);
      expect(response.body).toMatchObject({
        message: "Test controller handler not implemented",
      });
    }
  });

  it("keeps unprotected endpoints reachable", async () => {
    const app = createAppForTests();

    const emailResponse = await request(app).post("/api/emails").send({
      to: "recipient@example.com",
      subject: "Subject",
      text: "Message",
    });

    expect(emailResponse.status).toBe(501);
    expect(emailResponse.body).toMatchObject({
      message: "Test controller handler not implemented",
    });

    const legacyResponse = await request(app).get("/api/sheets/values");
    expect(legacyResponse.status).toBe(501);
    expect(legacyResponse.body).toMatchObject({
      message: "Test controller handler not implemented",
    });
  });
});