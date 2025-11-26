const request = require("supertest");
const express = require("express");
const submission = require("./submission"); // the user code

describe("Easy: User Configuration Service", () => {
  let app;
  const configUrl = "/config";

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/", submission);
  });

  // Ensure the server state is clean for a proper 404 check
  test("GET /config returns 404 before any configuration is set", async () => {
    const res = await request(app).get(configUrl);
    expect(res.status).toBe(404);
  });

  test("POST /config successfully stores and retrieves the configuration", async () => {
    const newConfig = { theme: "dark-mode", locale: "en-US", notifications: true };
    
    // 1. Store the config
    const postRes = await request(app)
      .post(configUrl)
      .send(newConfig);
      
    expect(postRes.status).toBe(201);
    expect(postRes.body).toEqual(newConfig);

    // 2. Retrieve the stored config
    const getRes = await request(app).get(configUrl);
    expect(getRes.status).toBe(200);
    expect(getRes.body).toEqual(newConfig);
  });
  
  test("POST /config overwrites the existing configuration with new data", async () => {
    const configV1 = { theme: "light-mode", locale: "fr-FR" };
    const configV2 = { theme: "system", locale: "es-ES" };

    // Set V1 (already tested, but needed for state)
    await request(app).post(configUrl).send(configV1);
    
    // Set V2 (should overwrite)
    await request(app).post(configUrl).send(configV2).expect(201);

    // Retrieve and verify V2
    const getRes = await request(app).get(configUrl);
    expect(getRes.body.theme).toBe("system");
    expect(getRes.body.locale).toBe("es-ES");
  });
});
