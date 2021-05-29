package us.mrvivacio.porno;

import android.app.Activity;
import android.os.Bundle;

public class AboutActivity extends Activity {

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
