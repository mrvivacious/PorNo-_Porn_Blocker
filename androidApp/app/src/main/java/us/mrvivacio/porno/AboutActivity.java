package us.mrvivacio.porno;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

public class AboutActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_about);

        // https://stackoverflow.com/questions/39052127
        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle("About PorNo!"); // TODO extract String resource
            getSupportActionBar().setDisplayHomeAsUpEnabled(true); // Add back arrow in action bar TODO do we need this line?
        }
    }

    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return super.onSupportNavigateUp();
    }
}
