import request from "supertest";
import { createAppForTests } from "../utils/createAppForTests";

describe("Protected routes without token", () => {
  it("returns 401 on GET /api/events when Authorization header is missing", async () => {
    const app = createAppForTests();

    const response = await request(app).get("/api/events");

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      message: "No token provided",
    });
  });
});
