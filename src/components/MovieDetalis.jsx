import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MovieDetails () {
    const [movieData, setMovieData] = useState(null);
    const [error, setError] = useState('');
    const [responseJson, setResponseJson] = useState('');
    const [randomMovieId, setRandomMovieId] = useState(null);

    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = `https://api.themoviedb.org/3/movie`;

    const generateRandomMovieId = () => {
        return Math.floor(Math.random() * 100000) + 1;
    };

    const fetchMovieDetails = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}?api_key=${API_KEY}`);

            if (response.status === 200) {
                setMovieData(response.data);
                setError('');
                setResponseJson(JSON.stringify(response.data, null, 2)); // Convertir a JSON con formato legible
            }
        } catch (error) {
            console.error('Error al obtener detalles de la película:', error);
            setError('No se encontró ninguna película con este ID. Por favor, inténtelo de nuevo.');
            setMovieData(null);
            setResponseJson('');
        }
    };

    useEffect(() => {
        if (randomMovieId !== null) {
            fetchMovieDetails(randomMovieId);
        }
    }, [randomMovieId]); // Ejecutar useEffect cuando randomMovieId cambie

    const handleSearch = () => {
        const id = generateRandomMovieId();
        setRandomMovieId(id); // Generar un nuevo ID al hacer clic en el botón
    };

    return (
        <div>
            <h1>Detalles de Película Aleatoria</h1>
            <button onClick={handleSearch}>Generar Película Aleatoria</button>
            {randomMovieId && <p>ID de Película Generado: {randomMovieId}</p>}

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {movieData && (
                <div>
                    <p><strong>Título:</strong> {movieData.title}</p>
                    <img src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`} alt="Imagen de la película" />
                    <p><strong>Descripción:</strong> {movieData.overview}</p>
                    <p><strong>Géneros:</strong> {movieData.genres.map(genre => genre.name).join(', ')}</p>
                    <p><strong>Año de Lanzamiento:</strong> {movieData.release_date ? movieData.release_date.substring(0, 4) : 'Desconocido'}</p>
                </div>
            )}

            {responseJson && (
                <div>
                    <h2>Respuesta de la API (JSON)</h2>
                    <pre>{responseJson}</pre>
                </div>
            )}
        </div>
    );
};

export default MovieDetails;
