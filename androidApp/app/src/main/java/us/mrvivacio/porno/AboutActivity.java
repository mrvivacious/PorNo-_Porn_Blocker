package us.mrvivacio.porno;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

public class AboutActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_about);

        // Thank you, https://stackoverflow.com/questions/39052127
        if (getActionBar() != null) {
            getActionBar().setTitle("About PorNo!");
            getActionBar().setDisplayHomeAsUpEnabled(true); // Add back arrow in action bar
        }
    }

    // Thank you, https://stackoverflow.com/questions/26651602
    @Override
    public boolean onNavigateUp() {
        onBackPressed();
        return true;
    }
}
