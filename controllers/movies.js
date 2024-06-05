import { readJSON } from "../utils.js";

import { validateMovie, validatePartialMovie } from "../schemas/movies.js";

const movies = readJSON("./movies.json");

export class MovieController {
  static getAll(req, res) {
    const { genre } = req.query;
    if (genre) {
      const filteredMovies = movies.filter((movie) =>
        movie.genre.some((gen) => gen.toLowerCase() === genre.toLowerCase())
      );
      res.json(filteredMovies);
    }
    res.json(movies);
  }

  static getById(req, res) {
    const { id } = req.params;
    const movie = movies.find((movie) => movie.id === id);
    if (!movie) {
      res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);
  }

  static create(req, res) {
    const result = validateMovie(req.body);

    if (!result.success)
      return res.status(400).json({ error: JSON.parse(result.error.message) });

    const newMovie = { id: crypto.randomUUID(), ...result.data };
    movies.push(newMovie);

    res.status(201).json(newMovie);
  }

  static delete(req, res) {
    const { id } = req.params;

    const movieIndex = movies.findIndex((movie) => movie.id === id);

    if (movieIndex === -1) {
      return res.status(404).json({ message: "Movie not found" });
    }

    movies.splice(movieIndex, 1);
    res.json({ message: "Movie deleted successfully" });
  }

  static update(req, res) {
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
  }
}
