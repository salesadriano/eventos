import request from "supertest";
import { createAppForTests } from "../utils/createAppForTests";

describe("GET /api/health", () => {
  it("returns health status as ok", async () => {
    const app = createAppForTests();

    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
