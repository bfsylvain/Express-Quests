require("dotenv").config();
const express = require("express");

const validateMovie = require("./middlewares/validateMovies")

const app = express();

app.use(express.json());

const port = process.env.APP_PORT

const movieControllers = require("./controllers/movieControllers");
const userControllers = require("./controllers/userControllers");
const validateUser = require("./middlewares/validateUser");

app.get("/api/movies", movieControllers.getMovies);
app.get("/api/movies/:id", movieControllers.getMovieById);

app.get("/api/users", userControllers.getUsers)
app.get("/api/users/:id", userControllers.getUserById)

app.post("/api/movies", validateMovie, movieControllers.postMovie)
app.post("/api/users", validateUser, userControllers.postUser)

app.put("/api/movies/:id",validateMovie, movieControllers.updateMovie)
app.put("/api/users/:id", validateUser, userControllers.updateUser)

app.delete("/api/movies/:id", movieControllers.deleteMovie)
app.delete("/api/users/:id", userControllers.deleteUser)

module.exports = app;
