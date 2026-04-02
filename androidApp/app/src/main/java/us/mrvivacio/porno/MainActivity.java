package us.mrvivacio.porno;

import android.Manifest;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.provider.Settings;
import android.text.TextUtils;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Toast;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Map;
import java.util.Objects;

import androidx.appcompat.app.AppCompatActivity;

import static us.mrvivacio.porno.R.string.*;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = "dawg";
    private ArrayList<String> items;
    private ArrayAdapter<String> itemsAdapter;
    private ListView lvItems;

    // https://stackoverflow.com/questions/39052127
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.toolbar, menu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        if (!isAccessibilitySettingsOn(this)) {
            openAlertDialogForEnablingPorNoService();
        }

        requestStoragePermissionsForSavingUserUrlData();


        // Tutorial code
        // https://guides.codepath.com/android/Basic-Todo-App-Tutorial#configuring-android-studio
        lvItems = findViewById(R.id.lv_Items);
        items = new ArrayList<>();

        // Populate the listView with the link names saved in sharedPref
        loadLinksFromSharedPreferences();

        itemsAdapter = new ArrayAdapter<>(this,
                android.R.layout.simple_list_item_1, items);

        lvItems.setAdapter(itemsAdapter);
        setLongClickToDeleteLink();
        setShortClickToOpenLink();
    }

    private void setLongClickToDeleteLink() {
        lvItems.setOnItemLongClickListener(
                (adapterView, view, pos, l) -> {
                    String URLName = items.get(pos);
                    openDeleteLinkHandler(URLName, pos);

                    // Return true consumes the long click event (marks it handled)
                    return true;
                }
        );
    }
    private void setShortClickToOpenLink() {
        lvItems.setOnItemClickListener(
                (adapterView, view, pos, l) -> {
                    String URLName = items.get(pos);
                    String URLToOpen = getURLFromSharedPreferences(URLName);

                    if (URLToOpen == null) { return; } // todo How would this happen...?

                    openUrlInBrowser(URLToOpen);
                }
        );
    }

    // Open all the saved URLs
    public void onEmergencyButtonPress(View v) {
        SharedPreferences prefs = this.getPreferences(Context.MODE_PRIVATE);
        Map<String, ?> allLinks = prefs.getAll();

        for (Map.Entry<String, ?> entry : allLinks.entrySet()) {
            String URL = entry.getValue().toString();

            openUrlInBrowser(URL);
        }
    }

    private void openUrlInBrowser(String URL) {
        // Open the url
        Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(URL));
        startActivity(browserIntent);
    }

    private void addLinkToSharedPreferences(String name, String URL) {
        SharedPreferences prefs = this.getPreferences(Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();

        editor.putString(name, URL);
        editor.apply();
    }

    // Return the URL of the passed in name key
    private String getURLFromSharedPreferences(String key) {
        return this.getPreferences(Context.MODE_PRIVATE).getString(key, null);
    }

    private void deleteLinkFromSharedPreferences(String key) {
        SharedPreferences prefs = this.getPreferences(Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();

        String url = getURLFromSharedPreferences(key);

        editor.remove(key);
        editor.apply();

        Utilities.removeFromFile(url);

        Toast.makeText(this, getString(toast_delete_link) + " " + key, Toast.LENGTH_LONG).show();
    }

    public void loadLinksFromSharedPreferences() {
        ArrayList<String> names = new ArrayList<>();
        ArrayList<String> URLList = new ArrayList<>(); // todo migration?

        SharedPreferences prefs = this.getPreferences(Context.MODE_PRIVATE);
        Map<String, ?> allLinks = prefs.getAll();

        // Log.d(TAG, "keys  =  " + allLinks.keySet());

        // https://stackoverflow.com/questions/22089411
        for (Map.Entry<String, ?> entry : allLinks.entrySet()) {
            String name = entry.getKey();
            String URL = entry.getValue().toString();

            if (PorNo.isPorn(getHostName(URL))) {
                deleteLinkFromSharedPreferences(name);
            }
            // url not in porn map -> keep it
            else {
                names.add(name);
                URLList.add(URL);      // TODO migrate this shit Original:In order to reference URLs during redirection
            }
        }

        items = names;
        Utilities.saveToFile(URLList);
    }

    public String getHostName(String url) {
        URI uri;

        try {
            uri = new URI(url);
        } catch (URISyntaxException e) {
            Log.d(TAG, Objects.requireNonNull(e.getMessage()));
            return url;
        }

        String hostName = uri.getHost();

        // If null, return the original url
        if (hostName == null) {
            return url;
        }
        else if (hostName.contains("www.")) {
            hostName = hostName.substring(4);
        }

        // mobile prefixes break my hashmap lol
        if (hostName.contains("mobile.")) {
            return hostName.substring(7);
        }
        else if (hostName.contains("m.")) {
            return hostName.substring(2);
        }

        return hostName;
    }

    private boolean isAccessibilitySettingsOn(Context mContext) {
        // https://stackoverflow.com/questions/18094982
        int accessibilityEnabled = 0;
        final String service = getPackageName() + "/" + MyAccessibilityService.class.getCanonicalName();

        try {
            accessibilityEnabled = Settings.Secure.getInt(
                    mContext.getApplicationContext().getContentResolver(),
                    android.provider.Settings.Secure.ACCESSIBILITY_ENABLED);
//            Log.v(TAG, "accessibilityEnabled = " + accessibilityEnabled);
        } catch (Settings.SettingNotFoundException e) {
            Log.e(TAG, "Error finding setting, default accessibility to not found: "
                    + e.getMessage());
        }

        TextUtils.SimpleStringSplitter mStringColonSplitter = new TextUtils.SimpleStringSplitter(':');

        if (accessibilityEnabled == 1) {
            Log.v(TAG, "***ACCESSIBILITY IS ENABLED*** -----------------");
            String settingValue = Settings.Secure.getString(
                    mContext.getApplicationContext().getContentResolver(),
                    Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES);
            if (settingValue != null) {
                mStringColonSplitter.setString(settingValue);
                while (mStringColonSplitter.hasNext()) {
                    String accessibilityService = mStringColonSplitter.next();

//                    Log.v(TAG, "-------------- > accessibilityService :: " + accessibilityService + " " + service);
                    if (accessibilityService.equalsIgnoreCase(service)) {
//                        Log.v(TAG, "We've found the correct setting - accessibility is switched on!");
                        return true;
                    }
                }
            }
        } else {
            Log.v(TAG, "***ACCESSIBILITY IS DISABLED***");
        }

        return false;
    }

    // TODO a video demonstrating this wouldn't hurt. basically a clear explanation of how to enable
    private void openAlertDialogForEnablingPorNoService() {
        // https://stackoverflow.com/questions/2115758
        AlertDialog.Builder builder;
        builder = new AlertDialog.Builder(this, android.R.style.Theme_Material_Dialog_Alert);

        // Build the alert
        builder.setTitle(alert_disabled_title)
                .setMessage(alert_disabled_body)
                .setPositiveButton(R.string.alert_disabled_action, (dialog, which) -> {
                    // Open accessibility screen
                    Intent intent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);
                    startActivity(intent);
                })
//                .setNegativeButton("I'll go there myself", new DialogInterface.OnClickListener() {
//                    public void onClick(DialogInterface dialog, int which) {
//                        // Do nothing
//                    }
//                })
                .setIcon(android.R.drawable.ic_dialog_alert)
                .show();
    }

    private void openDeleteLinkHandler(String name, int index) {
        AlertDialog.Builder builder;
        builder = new AlertDialog.Builder(this, android.R.style.Theme_Material_Dialog_Alert);

        builder.setTitle(alert_delete_title)
//                .setMessage("Name: " + name + "\nLink: " + getItem(name))
                .setMessage(name + "\n" + getURLFromSharedPreferences(name))
                .setPositiveButton("Yes", (dialog, which) -> {
                    deleteLinkFromSharedPreferences(name);

                    // Remove the item within array at position
                    items.remove(index);

                    // Refresh the adapter
                    itemsAdapter.notifyDataSetChanged();
                })
                .setNegativeButton("No", (dialog, which) -> {
                    // Do nothing
                })
                .setIcon(android.R.drawable.ic_dialog_alert)
                .show();
    }

    private void requestStoragePermissionsForSavingUserUrlData() {
        // https://stackoverflow.com/questions/32635704
        int PERMISSION_REQUEST_CODE = 1;

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            if (checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE)
                    == PackageManager.PERMISSION_DENIED) {
                String[] permissions = {Manifest.permission.WRITE_EXTERNAL_STORAGE};
                requestPermissions(permissions, PERMISSION_REQUEST_CODE);
            }
            if (checkSelfPermission(Manifest.permission.READ_EXTERNAL_STORAGE)
                    == PackageManager.PERMISSION_DENIED) {
                String[] permissions = {Manifest.permission.READ_EXTERNAL_STORAGE};
                requestPermissions(permissions, PERMISSION_REQUEST_CODE);
            }
        }
    }

    // Screen the URL and add it if the URL isn't in our porn map
    public void onAddItemButtonPress(View v) {
        EditText url = findViewById(R.id.et_NewItem);
        EditText name = findViewById(R.id.et_NewItem2);

        String urlText = url.getText().toString().trim();
        String nameText = name.getText().toString().trim();

        if (urlText.contains(" ")) {
            Toast.makeText(this, toast_validate_url_spaces, Toast.LENGTH_SHORT).show();
            return;
        }

        if (PorNo.isPorn(getHostName(urlText))) {
            Toast.makeText(this, toast_validate_url_invalid, Toast.LENGTH_SHORT).show();
            return;
        }

        if (urlText.isEmpty()) {
            return;
        }
        else if (nameText.isEmpty()) {
            nameText = urlText; // No name provided? Use the url as the name
        }

        if (!urlText.contains("http")) { urlText = "http://" + urlText; }

        // TODO is there a limit to shared preferences? would this ever return an error?
        addLinkToSharedPreferences(nameText, urlText);

        itemsAdapter.add(nameText);
        url.setText("");
        name.setText("");

        Utilities.updateFile(urlText);
    }

    /////// CORRESPONDS TO ACTION BAR MENU

    public void openAlertDialogForInstructions(MenuItem item) {
        AlertDialog.Builder builder;
        builder = new AlertDialog.Builder(this, android.R.style.Theme_Material_Dialog_Alert);

        builder.setTitle(alert_instructions_title)
                .setMessage(alert_instructions_body)
                .setPositiveButton(alert_instructions_thank_you, (dialog, which) -> {
                    // doNothing()
                })
                .setIcon(android.R.drawable.ic_dialog_alert)
                .show();
    }

    public void openUrlForChromeExtension(MenuItem item) {
        openUrlInBrowser("https://chrome.google.com/webstore/detail/porno-porn-blocker-beta/fnfchnplgejcfmphhboehhlpcjnjkomp");
    }

    public void openUrlForPrivacyPolicy(MenuItem item) {
        openUrlInBrowser("https://github.com/mrvivacious/PRIVACY_POLICY/blob/master/PorNo_privacy_policy.txt");
    }

    public void openActivityForAboutPorNo(MenuItem item) {
        Intent intent = new Intent(this, AboutActivity.class);
        startActivity(intent);
    }

    public void openUrlForGitHub(MenuItem item) {
        openUrlInBrowser("https://github.com/mrvivacious/PorNo-_Porn_Blocker");
    }

    // TODO replace with a google form link to submit problems, questions, etc.
    public void sendEmail(MenuItem item) {
        composeEmail("jvnnvt@gmail.com", "PorNo! Porn Blocker (Android)");
    }

    public void composeEmail(String recipient, String subject) {
        Intent intent = new Intent(Intent.ACTION_SENDTO);
        intent.setData(Uri.parse("mailto:")); // only email apps should handle this
        intent.putExtra(Intent.EXTRA_EMAIL, new String[]{recipient});
        intent.putExtra(Intent.EXTRA_SUBJECT, subject);
        startActivity(intent);
    }
}
