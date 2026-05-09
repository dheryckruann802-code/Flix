package com.flix.movies;

import java.util.ArrayList;
import java.util.List;

/**
 * Service to manage free content streams and catalog.
 */
public class FreeContentService {
    
    public interface ContentCallback {
        void onContentLoaded(List<Movie> movies);
    }

    public static void getFreeMovies(ContentCallback callback) {
        // In a real app, this would fetch from a free movie API or legal open source
        List<Movie> movies = new ArrayList<>();
        movies.add(new Movie("Cosmos: A SpaceTime Odyssey", "Educational content", "https://..."));
        movies.add(new Movie("Sita Sings the Blues", "Free animation", "https://..."));
        
        if (callback != null) {
            callback.onContentLoaded(movies);
        }
    }
}
