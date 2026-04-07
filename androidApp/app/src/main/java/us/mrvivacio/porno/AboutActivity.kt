package us.mrvivacio.porno

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.core.net.toUri

class AboutActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_about)

        // https://stackoverflow.com/questions/39052127
        supportActionBar?.let {
            it.title = "About PorNo!"
            it.setDisplayHomeAsUpEnabled(true)
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return super.onSupportNavigateUp()
    }

    fun openEmailIntentForChildSafety(view : View) {
        val intent = Intent(Intent.ACTION_SENDTO)

        intent.data = "mailto:jvnnvt@gmail.com".toUri()
        intent.putExtra(Intent.EXTRA_SUBJECT, "Child Safety - PorNo!")

        startActivity(intent)
    }
}
