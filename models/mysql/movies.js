import mysql from "mysql2/promise";

const DEFAULT_CONFIG = {
  host: "localhost",
  user: "root",
  port: 3306,
  database: "moviesdb",
};
const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG;

const connection = await mysql.createConnection(connectionString);

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase();

      const [genres] = await connection.query(
        "SELECT * FROM genre WHERE LOWER(name) = ?;",
        [lowerCaseGenre]
      );

      if (genres.length === 0) return [];

      const [result] = await connection.query(
        "SELECT bin_to_uuid(movie.id) id, movie.title, movie.year, movie.director, movie.duration, movie.poster, movie.rate, genre.name as genre FROM movie_genres JOIN movie on movie.id = movie_genres.movie_id join genre on genre.id = movie_genres.genre_id WHERE genre.name = ?;",
        [lowerCaseGenre]
      );

      console.log("by genres: ", result);
      return result;
    } // TODO
    const [movies] = await connection.query(
      "select *, bin_to_uuid(id) id from movie;"
    );

    return movies;
  }

  static async getById({ id }) {
    const [result] = await connection.query(
      "select *, BIN_TO_UUID(id) id from movie where id = UUID_TO_BIN(?);",
      [id]
    );

    if (result.length === 0) return null;
    console.log(result);
    return result[0];
  }

  static async create({ input }) {
    const {
      genre: genreInput,
      title,
      year,
      duration,
      director,
      rate,
      poster,
    } = input;

    // crypto.randomUUID()
    const [uuidResult] = await connection.query("SELECT UUID() uuid;");
    const [{ uuid }] = uuidResult;

    try {
      genreInput.forEach(async (genre) => {
        const [genreId] = await connection.query(
          "SELECT id FROM genre WHERE LOWER(name) = (?);",
          [genre]
        );
        const [{ id }] = genreId;
        await connection.query(
          "INSERT INTO movie_genres (movie_id, genre_id) VALUES (UUID_TO_BIN(?), ?);",
          [uuid, id]
        );
      });
    } catch (error) {
      console.log(error);
      throw new Error("Error creating movie_genres");
    }

    try {
      await connection.query(
        `INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES (UUID_TO_BIN("${uuid}"), ?,?,?,?,?,?);`,
        [title, year, director, duration, poster, rate]
      );
    } catch (error) {
      throw new Error("Error creating movie");
    }

    const [movies] = await connection.query(
      "SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie WHERE id = UUID_TO_BIN(?);",
      [uuid]
    );

    return movies[0];
  }

  static async update({ id, input }) {
    const setClause = Object.keys(input)
      .map((field) => `${field} = ?`)
      .join(", ");

    const values = [...Object.values(input), id];

    try {
      await connection.query(
        `UPDATE movie SET ${setClause} WHERE bin_to_uuid(id) = ?;`,
        values
      );

      const [movie] = await connection.query(
        "SELECT * FROM movie WHERE bin_to_uuid(id) = ?;",
        [id]
      );

      return movie[0];
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  static async delete({ id }) {
    try {
      await connection.query("DELETE FROM movie WHERE bin_to_uuid(id) = ?;", [
        id,
      ]);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
