/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from 'axios';
import { Movie, Series, Content } from '../types';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = (import.meta as any).env?.VITE_TMDB_API_KEY;

const api = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Sample fallback data for preview if API key is missing
const MOCK_MOVIES: Movie[] = [
  {
    id: 1,
    title: 'Interstellar',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    posterPath: 'https://image.tmdb.org/t/p/w500/gEU2QniE6EwfVnz64ubYpjtnetB.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/tYm0C2OosXonV9A6R6r1vQ6YpM5.jpg',
    releaseDate: '2014-11-05',
    voteAverage: 8.4,
    mediaType: 'movie'
  },
  {
    id: 2,
    title: 'Inception',
    overview: 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\", the implantation of another person\'s idea into a target\'s subconscious.',
    posterPath: 'https://image.tmdb.org/t/p/w500/edv5CZv0jG9yUPoQlbkd46E3S9P.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/8ZTPRkd1vEL69u4989fsS61vSU5.jpg',
    releaseDate: '2010-07-15',
    voteAverage: 8.3,
    mediaType: 'movie'
  }
];

export const getTrending = async (type: 'all' | 'movie' | 'tv' = 'all'): Promise<Content[]> => {
  if (!API_KEY) return MOCK_MOVIES;
  try {
    const { data } = await api.get(`/trending/${type}/week`);
    return data.results.map((item: any) => ({
      id: item.id,
      title: item.title || item.name,
      overview: item.overview,
      posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
      backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : '',
      releaseDate: item.release_date || item.first_air_date,
      voteAverage: item.vote_average,
      mediaType: item.media_type || (item.title ? 'movie' : 'tv'),
      trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    }));
  } catch (error) {
    console.error('Error fetching trending:', error);
    return MOCK_MOVIES;
  }
};

export const searchContent = async (query: string): Promise<Content[]> => {
  if (!API_KEY) return MOCK_MOVIES.filter(m => m.title.toLowerCase().includes(query.toLowerCase()));
  try {
    const { data } = await api.get('/search/multi', { params: { query } });
    return data.results.map((item: any) => ({
      id: item.id,
      title: item.title || item.name,
      overview: item.overview,
      posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
      backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : '',
      releaseDate: item.release_date || item.first_air_date,
      voteAverage: item.vote_average,
      mediaType: item.media_type,
      trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    }));
  } catch (error) {
    console.error('Error searching:', error);
    return [];
  }
};
