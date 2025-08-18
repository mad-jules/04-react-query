import { useEffect, useState } from 'react';
import { fetchMovies, fetchTrendMovies } from '../../services/movieService';
import { SearchBar } from '../SearchBar/SearchBar';
import type { Movie } from '../../types/movie';
import { MovieGrid } from '../MovieGrid/MovieGrid';
import toast, { Toaster } from 'react-hot-toast';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { Loader } from '../Loader/Loader';
import { MovieModal } from '../MovieModal/MovieModal';

export default function App() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    function onSelect(movie: Movie) {
        setSelectedMovie(movie);
    }

    function closeModal() {
        setSelectedMovie(null);
    }

    async function handleSubmit(query: string) {
        try {
            setIsError(false);
            setIsLoading(true);
            setMovies([]);
            const response = await fetchMovies(query);
            setMovies(response.results);
            if (!response.results.length) {
                toast.error('No movies found for your request.');
            }
        } catch (error) {
            setIsError(true);
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        async function fetchInitialMovies() {
            const initialMovies = await fetchTrendMovies();
            setMovies(initialMovies.results);
        }
        fetchInitialMovies();
    }, []);

    return (
        <>
            <SearchBar onSubmit={handleSubmit} />

            {isLoading && Loader()}

            {isError && ErrorMessage()}

            {selectedMovie && (
                <MovieModal movie={selectedMovie} onClose={closeModal} />
            )}

            {Boolean(movies.length) && (
                <MovieGrid onSelect={onSelect} movies={movies} />
            )}

            <Toaster />
        </>
    );
}
