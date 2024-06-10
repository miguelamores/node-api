import { createApp } from "./app.js";
import { MovieModel } from "./models/local-file/movie.js";

createApp({ movieModel: MovieModel });
