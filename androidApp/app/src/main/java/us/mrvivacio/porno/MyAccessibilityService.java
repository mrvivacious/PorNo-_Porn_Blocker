// This file handles the reception of Accessibility events
// We analyze the events related to web-browsing and text-editing for any sign of porn

package us.mrvivacio.porno;

import android.accessibilityservice.AccessibilityService;
import android.content.Intent;
import android.net.Uri;
import android.provider.Browser;
import android.util.Log;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// Todo:
/*
 o Write tests to screen trimmed URLs
 + Run the trimmed urls thru a length test
 + So, find the shortest porn URL -- our trimmed links
    should not be shorter than this URl or be malformed
 o abstract browsers into their own classes?
 */

public class MyAccessibilityService extends AccessibilityService {
    static Map<String, Boolean> dict2 = new HashMap<>();

    static boolean isFound = false;
    static String currURL = "zz";

    static String TAG = "dawgAccessibility";
    private final String omniboxViewID = "com.android.chrome:id/url_bar";

    // private long start = 0;

    @Override
    public void onCreate() {
        super.onCreate();

        Utilities.migrateIfNecessary(this);

        dict2 = Domains.init(); // David pair programming ftw

        Log.d(TAG, "onCreate: # of domains recognized: " + dict2.size());
    }

    public String getRandomURL() {
        // Service can "see" the MainActivity preferences
        return Utilities.getRandomURL(this);
    }

    // https://stackoverflow.com/questions/38783205
    // https://stackoverflow.com/questions/42125940
    // https://web.archive.org/web/20161228170758/http://axovel.com/blog/2016/05/06/taking-accessibility-service-to-next-level-android/
    // https://gist.github.com/mrvivacious/1c252b2438bda1c35f234873b508c593
    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        // start = System.currentTimeMillis();
//        Log.d(TAG, "ACCESSIBILITY EVENT --------");

        // Chrome
        if (isChromeEvent(event)) {
            parseNodeForURLViaAPI(event);
        }
    }

    private void parseNodeForURLViaAPI(AccessibilityEvent event) {
        AccessibilityNodeInfo source = event.getSource();
        if (source == null) { return; }

        List<AccessibilityNodeInfo> findAccessibilityNodeInfosByViewId = source.findAccessibilityNodeInfosByViewId(omniboxViewID);

        if (!findAccessibilityNodeInfosByViewId.isEmpty()) {
            AccessibilityNodeInfo omniboxView = findAccessibilityNodeInfosByViewId.get(0);
            if (omniboxView == null) { return; }

            CharSequence omniboxText = omniboxView.getText();
            if (omniboxText == null) { return; }

            String currentURL = omniboxView.getText().toString();
            String hostNameManually = currentURL.replace("https://", "").replace("http://", "").replace("www.", "");
            String hostNameWithoutPath = "";
            if (hostNameManually.contains("/")) {
                hostNameWithoutPath = hostNameManually.substring(0, hostNameManually.indexOf("/"));
            }

            String host = getHostNameNew(currentURL);

            // todo make following lines into methods
            host = host.replace("www.", "");
            host = stripMobilePrefixIfPresent(host);
            if (host.contains("/")) {
                host = host.substring(0, host.indexOf("/"));
            }

//            Log.d(TAG, "\n\n--------------------------------\n\n");
//            Log.d(TAG, "host : hostNameManually : currentURL = " + host + " : " + hostNameManually + " : " + currentURL);


            if (PorNo.isPorn(host) || PorNo.isPorn(hostNameManually) || PorNo.isPorn(hostNameWithoutPath)) {
                long start = System.currentTimeMillis();
                isFound = true;
                Log.d(TAG, "porn site " + host + " found at " + start);

//            if (txt.equals("yahoo.com")) {

                // Attempting direct redirection
                String randomURL = getRandomURL();
                currURL = getHostNameNew(randomURL); // todo we don't need this line i believe

                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(randomURL));
                intent.putExtra(Browser.EXTRA_APPLICATION_ID, "com.android.chrome");
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);

                Log.d(TAG, "rdr = " + (System.currentTimeMillis() - start));
//                }
            }
            else if (isUnsafeGoogleSearch(currentURL)) {
                applySafeModeToUnsafeGoogleSearch(currentURL);
            }
            else {
                Log.d(TAG, "host : currentURL = " + host + " : " + currentURL);
                Log.d(TAG, "regular site found at " + System.currentTimeMillis());
            }

//                // If the user is typing in the omnibox, optimization ideas for the future
//                    if (eventType.contains("TYPE_VIEW_TEXT")) {
//                        String text = event.getText().toString();
//                        // Nothing 2 do
//                        if (text == null || text.length() < 3) {
//                            // Do nothing
//                        }
//                        // We have some text!
//                        else {
//                            while (text.contains(" ")) {
//                                text = text.replaceAll(" ", "");
//                            }
//
//                            text = text.substring(1, text.length() - 1);
//                            text = getHostName(text);
//            }
        }
    }

    private String stripMobilePrefixIfPresent(String host) {
        if (host.contains("mobile.")) {
            host = host.substring(7);
        }
        else if (host.contains("m.")) {
            host = host.substring(2);
        }

        return host;
    }

    private boolean isChromeEvent(AccessibilityEvent event) {
        return event.getPackageName() != null && event.getPackageName().toString().contains("com.android.chrome");
    }

    private void applySafeModeToUnsafeGoogleSearch(String url) {
        Log.d("dawg", "applying safe mode");
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://" + url + "&safe=active"));
        intent.putExtra(Browser.EXTRA_APPLICATION_ID, "com.android.chrome");
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);
    }

    public boolean isUnsafeGoogleSearch(String url) {
        return url.contains("google.com/search?") && !url.contains("&safe=active");
    }

    // todo rethink the DFS strategy in order to avoid having two getHostName
    // https://stackoverflow.com/questions/23079197
    public static String getHostName(String url) {
        URI uri;
//        Log.d(TAG, "getHostName: url = " + url);

        try {
            uri = new URI(url);
        } catch (URISyntaxException e) {
            e.printStackTrace();
            return url;
        }

        String hostName = uri.getHost();

        // If null, then hostname = the original url ?
        if (hostName == null) {
            hostName = url;
        }

        if (hostName.contains("www.")) {
            hostName = hostName.substring(4);
        }

        // websites that use mobile prefix break my hashmap
        if (hostName.contains("mobile.")) {
            hostName = hostName.substring(7);
        }
        else if (hostName.contains("m.") && hostName.indexOf("m.") < 3) { // medium.com => dium.com smh todo?
            hostName = hostName.substring(2);
        }

        // trim
        if (hostName.contains("/")) {
            return hostName.substring(0, hostName.indexOf("/"));
        }

//        Log.d(TAG, "getHostName: url++ = " + hostName);
        return hostName;
    }

    // https://stackoverflow.com/questions/23079197
    public static String getHostNameNew(String url) {
        URI uri;
//        Log.d(TAG, "getHostName: url = " + url);

        try {
            uri = new URI(url);
        } catch (URISyntaxException e) {
            Log.d(TAG, "URISyntaxException with url = " + url);
            e.printStackTrace();
            return url;
        }

        String hostName = uri.getHost();

//        Log.d(TAG, "getHostName hostName = " + hostName);

        // If null, return the original url
        if (hostName == null) { return url; }

        return hostName;
    }

    @Override
    public void onInterrupt() {}
}
