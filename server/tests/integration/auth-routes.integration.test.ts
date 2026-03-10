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

describe("Auth routes integration", () => {
  it("keeps public auth endpoints reachable without bearer token", async () => {
    const app = createAppForTests();

    const registerResponse = await request(app).post("/api/auth/register").send({
      name: "Test",
      email: "test@example.com",
      password: "password123",
    });
    expect(registerResponse.status).toBe(501);

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });
    expect(loginResponse.status).toBe(501);

    const refreshResponse = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: "refresh-token" });
    expect(refreshResponse.status).toBe(501);

    const providersResponse = await request(app).get("/api/auth/providers");
    expect(providersResponse.status).toBe(501);

    const oauthStartResponse = await request(app)
      .post("/api/auth/oauth/google/start")
      .send({ codeChallenge: "code-challenge" });
    expect(oauthStartResponse.status).toBe(501);

    const oauthCallbackResponse = await request(app)
      .post("/api/auth/oauth/google/callback")
      .send({
        state: "state",
        code: "code",
        codeVerifier: "code-verifier",
      });
    expect(oauthCallbackResponse.status).toBe(501);
  });

  it("protects logout and revoke endpoints when token is missing", async () => {
    const app = createAppForTests();

    const logoutResponse = await request(app).post("/api/auth/logout");
    expect(logoutResponse.status).toBe(401);
    expect(logoutResponse.body).toMatchObject({ message: "No token provided" });

    const revokeResponse = await request(app).post("/api/auth/revoke").send({
      refreshToken: "refresh-token",
    });
    expect(revokeResponse.status).toBe(401);
    expect(revokeResponse.body).toMatchObject({ message: "No token provided" });
  });

  it("reaches protected auth controllers with valid bearer token", async () => {
    const app = createAppForTests();

    const logoutResponse = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${validAccessToken}`);
    expect(logoutResponse.status).toBe(501);
    expect(logoutResponse.body).toMatchObject({
      message: "Test controller handler not implemented",
    });

    const revokeResponse = await request(app)
      .post("/api/auth/revoke")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({ refreshToken: "refresh-token" });
    expect(revokeResponse.status).toBe(501);
    expect(revokeResponse.body).toMatchObject({
      message: "Test controller handler not implemented",
    });
  });

  it("returns 401 for invalid bearer token on protected routes", async () => {
    const app = createAppForTests();

    const targets = ["/api/events", "/api/auth/logout", "/api/auth/revoke"];

    for (const target of targets) {
      const response = await request(app)
        .post(target)
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        message: "Invalid or expired token",
      });
    }
  });
});