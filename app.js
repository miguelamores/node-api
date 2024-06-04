import express from "express";
import crypto from "node:crypto";
import cors from "cors";

import { readJSON } from "./utils.js";

import { validateMovie, validatePartialMovie } from "./schemas/movies.js";

const movies = readJSON("./movies.json");
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        "http://localhost:8080",
        "http://localhost:1234",
      ];

      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.disable("x-powered-by");

app.get("/movies", (req, res) => {
  const { genre } = req.query;
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((gen) => gen.toLowerCase() === genre.toLowerCase())
    );
    res.json(filteredMovies);
  }
  res.json(movies);
});

app.get("/movies/:id", (req, res) => {
  const id = req.params.id;
  const movie = movies.find((movie) => movie.id === id);
  if (!movie) {
    res.status(404).json({ message: "Movie not found" });
  }

  res.json(movie);
});

app.post("/movies", (req, res) => {
  const result = validateMovie(req.body);

  if (!result.success)
    return res.status(400).json({ error: JSON.parse(result.error.message) });

  const newMovie = { id: crypto.randomUUID(), ...result.data };
  movies.push(newMovie);

  res.status(201).json(newMovie);
});

app.delete("/movies/:id", (req, res) => {
  const { id } = req.params;

  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  movies.splice(movieIndex, 1);
  res.json({ message: "Movie deleted successfully" });
});

app.patch("/movies/:id", (req, res) => {
  const { id } = req.params;
  const result = validatePartialMovie(req.body);

  if (!result.success)
    return res.status(400).json({ error: JSON.parse(result.error.message) });

  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  const updatedMovie = { ...movies[movieIndex], ...result.data };

  movies[movieIndex] = updatedMovie;

  return res.json(updatedMovie);
});

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
