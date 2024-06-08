// import { MovieModel } from "../models/local-file/movie.js";
// import { MovieModel } from "../models/mongodb/movies.js";
import { MovieModel } from "../models/mysql/movies.js";

import { validateMovie, validatePartialMovie } from "../schemas/movies.js";

export class MovieController {
  static async getAll(req, res) {
    const { genre } = req.query;
    const movies = await MovieModel.getAll({ genre });
    res.json(movies);
  }

  static async getById(req, res) {
    const { id } = req.params;
    const movie = await MovieModel.getById({ id });
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    res.json(movie);
  }

  static async create(req, res) {
    const result = validateMovie(req.body);

    if (!result.success)
      return res.status(400).json({ error: JSON.parse(result.error.message) });

    const newMovie = await MovieModel.create({ input: result.data });

    res.status(201).json(newMovie);
  }

  static async delete(req, res) {
    const { id } = req.params;

    const result = await MovieModel.delete({ id });

    if (result === false) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json({ message: "Movie deleted successfully" });
  }

  static async update(req, res) {
    const { id } = req.params;
    const result = validatePartialMovie(req.body);

    if (!result.success)
      return res.status(400).json({ error: JSON.parse(result.error.message) });

    const updatedMovie = await MovieModel.update({ id, input: result.data });

    if (updatedMovie === false) {
      return res.status(404).json({ message: "Movie not found" });
    }

    return res.json(updatedMovie);
  }
}
