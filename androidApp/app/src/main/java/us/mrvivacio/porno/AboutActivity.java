package us.mrvivacio.porno;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

public class AboutActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_about);

<<<<<<< HEAD
        // https://stackoverflow.com/questions/39052127
        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle("About PorNo!");
            getSupportActionBar().setDisplayHomeAsUpEnabled(true); // Add back arrow in action bar
=======
        // Thank you, https://stackoverflow.com/questions/39052127
        if (getActionBar() != null) {
            getActionBar().setTitle("About PorNo!");
            getActionBar().setDisplayHomeAsUpEnabled(true); // Add back arrow in action bar
            getActionBar().setDisplayShowCustomEnabled(true);
>>>>>>> send button done
        }
    }

    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return super.onSupportNavigateUp();
    }
}
