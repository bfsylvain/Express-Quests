const request = require("supertest");

const app = require("../src/app");

const database = require("../database");

afterAll(() => database.end());

describe("GET /api/users", () => {
  it("should return all users", async () => {
    const response = await request(app).get("/api/users");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });
});

describe("GET /api/users/:id", () => {
  it("should return one user", async () => {
    const response = await request(app).get("/api/users/1");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });

  it("should return no user", async () => {
    const response = await request(app).get("/api/users/0");

    expect(response.status).toEqual(404);
  });
});

describe("POST /api/users", () => {
  it("should return created user", async () => {
    const newUser = {
      firstname: "Maria",
      lastname: "Lopez",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "London",
      language: "russian",
    };
    const response = await request(app).post("/api/users").send(newUser);

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");

    const [result] = await database.query(
      "SELECT * FROM users WHERE id=?",
      response.body.id
    );

    const [userInDatabase] = result;

    expect(userInDatabase).toHaveProperty("lastname");
    expect(userInDatabase).toHaveProperty("email");
    expect(userInDatabase.firstname).toStrictEqual(newUser.firstname);
  });

  it("should return a problem", async () => {
    const userWithMistake = { firstname: "Angela" };

    const response = await request(app)
      .post("/api/users")
      .send(userWithMistake);

    expect(response.status).toEqual(422);
  });
});

describe("PUT /api/users/:id", () => {
  it("should edit a user", async () => {
    const newUser = {
      firstname: "Cassandra",
      lastname: "Gomez",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Mexico",
      language: "spanish",
    };

    const [result] = await database.query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [
        newUser.firstname,
        newUser.lastname,
        newUser.email,
        newUser.city,
        newUser.language,
      ]
    );

    const id = result.insertId;

    const updateUser = {
      firstname: "Elena",
      lastname: "Carter",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "New York",
      language: "English",
    };

    const response = await request(app)
      .put(`/api/users/${id}`)
      .send(updateUser);

    expect(response.status).toEqual(204);

    const [results] = await database.query(
      "SELECT * FROM users WHERE id=?",
      id
    );
    const [userDatabase] = results;

    expect(userDatabase).toHaveProperty("id");

    expect(userDatabase).toHaveProperty("firstname");
    expect(userDatabase.firstname).toStrictEqual(updateUser.firstname);

    expect(userDatabase).toHaveProperty("lastname");
    expect(userDatabase.lastname).toStrictEqual(updateUser.lastname);

    expect(userDatabase).toHaveProperty("email");
    expect(userDatabase.email).toStrictEqual(updateUser.email);

    expect(userDatabase).toHaveProperty("city");
    expect(userDatabase.city).toStrictEqual(updateUser.city);

    expect(userDatabase).toHaveProperty("language");
    expect(userDatabase.language).toStrictEqual(updateUser.language);
  });

  it("should return an error", async () => {
    const missingPropsUser = { firstname: "Lily" };

    const response = await request(app)
      .put("/api/users/1")
      .send(missingPropsUser);

    expect(response.status).toEqual(422);
  });

  it("should return no user", async () => {
    const newUser = {
      firstname: "Marge",
      lastname: "Simpson",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Springfield",
      language: "English",
    };
    const answer = await request(app).put("/api/users/0").send(newUser);

    expect(answer.status).toEqual(404);
  });
});
