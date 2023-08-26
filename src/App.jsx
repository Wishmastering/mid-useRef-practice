import "./App.css";
import json from "./mock-response/good-response.json";
import no_json from "./mock-response/bad-response.json";
import { useEffect, useState, useRef } from "react";

function useMovies() {
  const movies = json.Search;

  const mappedMovies = movies?.map((movie) => ({
    id: movie.imdbID,
    title: movie.Title,
    year: movie.Year,
    poster: movie.Poster,
  }));
  return { movies: mappedMovies };
}

function useSearch() {
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [searchRef, setSearchRef] = useState(false);

  useEffect(() => {
    if (searchRef) {
      (searchRef === search) === "";
      return;
    }

    if (search === "") {
      setError("No se puede buscar una pelicula vacia");
      return;
    }

    if (search.match(/^\d+$/)) {
      setError("No se puede buscar pelicula con solo numeros");
      return;
    }

    if (search.length < 3) {
      setError("Pelicula debe tener al menos 3 caracteres");
      return;
    }

    setError(null);
  }, [search]);

  return { search, setSearch, error };
}

export default function App() {
  const { movies } = useMovies();
  const { search, setSearch, error } = useSearch();

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="page">
      <header>
        <h4>Buscador De Peliculas</h4>
        <form>
          <input
            value={search}
            onChange={handleChange}
            type="text"
            placeholder="Avengers, Star Wars, LOTR"
          />
          <button> Buscar</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </header>

      <main>
        <Movies movies={movies} />
      </main>
    </div>
  );
}

function Movies({ movies }) {
  const hasMovies = movies?.length > 0;

  return (
    <>
      {hasMovies ? (
        <ul>
          {movies.map((movie) => (
            <li key={movie.id}>
              <h3>{movie.title}</h3>
              <p>{movie.year}</p>
              <img src={movie.poster} alt={movie.title} />
            </li>
          ))}
        </ul>
      ) : (
        <h4>No se encontraron peliculas para tu busqueda</h4>
      )}
    </>
  );
}
