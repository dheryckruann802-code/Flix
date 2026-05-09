package com.flix.movies;

import android.os.Bundle;
import android.view.View;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import java.util.ArrayList;
import java.util.List;

/**
 * Native Android implementation of Flix App.
 * This is 100% Java as requested.
 */
public class MainActivity extends AppCompatActivity {

    private RecyclerView movieRecyclerView;
    private MovieAdapter movieAdapter;
    private List<Movie> movieLines;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Transparent Status Bar for Cinematic Look
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);

        movieRecyclerView = findViewById(R.id.movie_recycler_view);
        movieRecyclerView.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false));

        movieLines = new ArrayList<>();
        // Mock data for native demo
        movieLines.add(new Movie("Interstellar", "Space exploration", "https://..."));
        movieLines.add(new Movie("Inception", "Dream architecture", "https://..."));

        movieAdapter = new MovieAdapter(movieLines, this);
        movieRecyclerView.setAdapter(movieAdapter);
    }
}
