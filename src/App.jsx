import "./App.css";
import { useEffect, useState, useRef } from "react";

function useMovies({ search, sort }) {
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(false);
  const movies = movieList?.Search;
  const searchRef = useRef(search);

  const getMovies = async () => {
    if (search === searchRef.current) return;

    try {
      setLoading(true);
      searchRef.current = search;
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=e1f20ea6&s=${search}`
      );

      const data = await res.json();

      setMovieList(data);
    } catch (e) {
      throw new Error("Error while searching your movies");
    } finally {
      setLoading(false);
    }
  };

  const mappedMovies = movies?.map((movie) => ({
    id: movie.imdbID,
    title: movie.Title,
    year: movie.Year,
    poster: movie.Poster,
  }));

  const sortedMovies = sort
    ? [...mappedMovies].sort((a, b) => b.title.localeCompare(a.title))
    : mappedMovies;

  return { movies: sortedMovies, getMovies, movieList, loading };
}

function useSearch() {
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const searchRef = useRef(true);

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current = search === "";
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
  const [sort, setSort] = useState(false);
  const { search, setSearch, error } = useSearch();
  const { movies, getMovies, movieList, loading } = useMovies({ search, sort });

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getMovies();
  };

  const handleSort = () => {
    setSort(!sort);
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
          <input type="checkbox" onClick={handleSort} />
          <button onClick={handleSubmit}> Buscar</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </header>

      <main>
        {loading ? <p>Loading your Movies...</p> : <Movies movies={movies} />}
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
