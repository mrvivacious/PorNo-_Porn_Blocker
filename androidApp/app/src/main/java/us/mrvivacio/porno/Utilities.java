package us.mrvivacio.porno;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Environment;
import android.util.Log;

import androidx.preference.PreferenceManager;

import java.io.File;
import java.util.ArrayList;
import java.util.Map;

public class Utilities {
    public static final String LINKS_MIGRATED = "migration_done_v1";
    private static final String PREFIX = "url_"; // Our new namespace

    /**
     * Migrates data from the legacy Text File and Activity-specific SharedPreferences
     * into the Global DefaultSharedPreferences.
     */
    public static void migrateIfNecessary(Context context) {
        SharedPreferences globalPrefs = PreferenceManager.getDefaultSharedPreferences(context);
        if (globalPrefs.getBoolean(LINKS_MIGRATED, false)) {
            return;
        }

        SharedPreferences.Editor editor = globalPrefs.edit();

        // Migrate from OLD Activity SharedPreferences (Preserves Name -> URL mapping)
        // Trivia: previously, used PorNo_user_data/links.txt
        SharedPreferences oldPrefs = context.getSharedPreferences("MainActivity", Context.MODE_PRIVATE);
        Map<String, ?> allEntries = oldPrefs.getAll();
        for (Map.Entry<String, ?> entry : allEntries.entrySet()) {
            if (entry.getValue() instanceof String) {
                Log.d("PorNo_migration", (entry.getValue()).toString());

                // ADD PREFIX DURING MIGRATION
                editor.putString(PREFIX + entry.getKey(), (String) entry.getValue());
            }
        }

        deleteLegacyFolder(context);
        oldPrefs.edit().clear().apply();

        editor.putBoolean(LINKS_MIGRATED, true);
        editor.apply();
    }

    /**
     * Returns a random URL from the global SharedPreferences.
     * Used by MyAccessibilityService.
     */
    public static String getRandomURL(Context context) {
        SharedPreferences globalPrefs = PreferenceManager.getDefaultSharedPreferences(context);
        Map<String, ?> allEntries = globalPrefs.getAll();

        ArrayList<String> urlsOnly = new ArrayList<>();

        for (Map.Entry<String, ?> entry : allEntries.entrySet()) {
            if (entry.getKey().startsWith(PREFIX) && entry.getValue() instanceof String) { // skips LINKS_MIGRATED flag
                urlsOnly.add((String) entry.getValue());
            }
        }

        if (!urlsOnly.isEmpty()) {
            int random = (int) (Math.random() * urlsOnly.size());
            return urlsOnly.get(random);
        }

        // Fallback if no links are found
        return "https://medium.com/@vivekbhookya/porno-de97189d82f6";
    }

    /**
     * Standard save method for the new SharedPreferences architecture
     */
    public static void saveUrl(Context context, String name, String url) {
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
        // ADD PREFIX ON SAVE
        prefs.edit().putString(PREFIX + name, url).apply();
    }

    /**
     * Standard remove method for the new SharedPreferences architecture
     */
    public static void removeUrl(Context context, String name) {
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
        prefs.edit().remove(PREFIX + name).apply();
    }

    private static void deleteLegacyFolder(Context context) {
        try {
            // Locations to check
            File[] roots = {
                    Environment.getExternalStorageDirectory(), // The "Internal Storage" root
                    context.getExternalFilesDir(null),         // App-specific external
                    new File("/sdcard")                        // Common alias on older Samsungs
            };

            for (File root : roots) {
                if (root == null) continue;

                // Look for the folder in this root
                File dir = new File(root, "PorNo_user_data");

                if (dir.exists() && dir.isDirectory()) {
                    // 1. Delete the file inside first
                    File file = new File(dir, "links.txt");
                    if (file.exists()) {
                        boolean fileDeleted = file.delete();
                        Log.d("PorNo_Cleanup", "File deleted: " + fileDeleted);
                    }

                    // 2. Delete the folder now that it's empty
                    boolean dirDeleted = dir.delete();
                    Log.d("PorNo_Cleanup", "Folder deleted: " + dirDeleted + " at " + dir.getAbsolutePath());
                }
            }
        } catch (Exception e) {
            Log.e("PorNo_Cleanup", "Failed cleanup: " + e.getMessage());
        }
    }
}