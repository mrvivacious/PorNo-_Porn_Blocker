package us.mrvivacio.porno

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.net.toUri
import io.sentry.Sentry
import kotlin.concurrent.thread

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

    fun openInAppChildSafetyReportDialog(view: View) {
        val input = EditText(this).apply {
            hint = "Share safety concerns here..."
            minLines = 4
            maxLines = 8
            setPadding(32, 32, 32, 32)
            setHintTextColor(resources.getColor(android.R.color.darker_gray))
            setTextColor(resources.getColor(android.R.color.white))
        }

        AlertDialog.Builder(this, android.R.style.Theme_Material_Dialog_Alert)
            .setTitle("Report Child Safety Concern")
            .setMessage("PorNo! maintains a strict zero-tolerance policy toward Child Sexual Abuse and Exploitation (CSAE). Submit your feedback or report directly below.")
            .setView(input)
            .setPositiveButton("Submit Report") { _, _ ->
                val message = input.text.toString().trim()
                if (message.isNotEmpty()) {
                    submitReportInBackground(message)
                    Toast.makeText(
                        this,
                        "Report submitted. Thank you for helping keep our community safe.",
                        Toast.LENGTH_LONG
                    ).show()
                } else {
                    Toast.makeText(
                        this,
                        "Please enter details before submitting.",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun submitReportInBackground(reportMessage: String) {
        thread {
            try {
                Sentry.captureMessage("Child Safety Report: $reportMessage")
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}

