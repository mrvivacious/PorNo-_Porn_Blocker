// PorNo! Android
//
// MyAccessibilityService.java
// This file handles the reception of Accessibility events
// We analyze the events related to web-browsing and text-editing for any sign of porn
//
// @author Vivek Bhookya

package us.mrvivacio.porno;

import android.accessibilityservice.AccessibilityService;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Browser;
import android.util.Log;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import androidx.annotation.RequiresApi;

// Todo:
/*
 o Write tests to screen trimmed URLs
 + Run the trimmed urls thru a length test
 + So, find the shortest porn URL -- our trimmed links
    should not be shorter than this URl or be malformed
 o Remove admob stuff
 o abstract browsers into their own classes?
 */

public class MyAccessibilityService extends AccessibilityService {
    static Map<String, Boolean> dict2 = new HashMap<>();

    static boolean isFound = false;
    static String currURL = "zz";

    static String TAG = "dawgAccessibility";
    private String omnibox = "zz";

    private long start = 0;

    @Override
    public void onCreate() {
        MainActivity.readDB();
        super.onCreate();

        // Static shout out mister David Wang pair programming ftw
        dict2 = Domains.init();
        Log.d(TAG, "onCreate: we saved our dict2 lez see wat hapn " + dict2.size());
//        Log.d("onCreate", "onCreate");
    }

    // https://stackoverflow.com/questions/38783205
    // https://stackoverflow.com/questions/42125940
    // https://web.archive.org/web/20161228170758/http://axovel.com/blog/2016/05/06/taking-accessibility-service-to-next-level-android/
    // https://gist.github.com/mrvivacious/1c252b2438bda1c35f234873b508c593
    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        start = System.currentTimeMillis();
//        Log.d(TAG, "ACCESSIBILITY EVENT --------");

        // Chrome
        if (isChromeEvent(event)) {
//            if (false) { // for testing the "old way" (dont use the api 16 pixel device, it doesnt have chrome lol)
            if (deviceSdkIsAtLeast18()) {
//                Log.d(TAG, "sdk is at least 18 :)");
                parseNodeForURLViaAPI(event);
            }
            else { // "old way" aka api15,16,17
                Log.d("hi", "evaluating via old way :)");

                String eventType = AccessibilityEvent.eventTypeToString(event.getEventType());

//                Log.d(TAG, "onAccessibilityEvent: event = " + event);
//                Log.d(TAG, "onAccessibilityEvent: className = " + event.getClassName());

                // The user opens a URL from a different source (ie hyperlink, URL in SMS message...)
                if (eventType.contains("WINDOW")) {
                    String className = event.getClassName().toString();

//                Log.d(TAG, "onAccessibilityEvent: event = " + event);
//                Log.d(TAG, "onAccessibilityEvent: className = " + className);

                    // No null check cuz event.getClassName() will never return null...thank you Android <3

                    ////////////////////////////////////////////////////
                    // 6 out of 6 setup
                    // 4 out of 6 is/are correct
                    // $$ = detects in regular mode
                    // ^^ = redirects in regular mode
                    // ## = detects in incognito
                    // ** = redirects in incognito

                    // $$ Clicking a hyperlink on a webpage ## **
                    // $$ ^^ Navigating using Android back button ## ^^ COULD BE FASTER
                    // $$ ^^ Navigating using Chrome forward navigation button ## ^^ COULD BE FASTER
                    if (className.equals("android.widget.EditText")) {
////                    // do nothing

//                    Log.d(TAG, "onAccessibilityEvent: inside ET $$$$$$");
                        parseNodeForURLViaDFS(event.getSource());
                    }

                    // $$ ^^ Hyperlink from external source, such as an sms msg (Can't test for incognito -- no
                    //  "Open in incognito" option exists, that I've seen so far, thus we will say this is correct)
                    if (className.equals("org.chromium.chrome.browser.ChromeTabbedActivity")) {
//                    Log.d(TAG, "onAccessibilityEvent: event = " + event);
//
                        parseNodeForURLViaDFS(event.getSource());
                    }

                    // $$ ^^ Typing the URL in ## **
                    // $$ ^^ Pasting the URL in ## ** (works through TYPE_VIEW_TEXT events)
                    // We have a source, so we can query
                    // Omnibox sits in the class android.widget.ListView
                    // We specify this class because a porn URL embedded in a webpage (even as just plaintext) will trigger
                    //  the redirect. However! Webpage data is in the class android.widget.FrameLayout, so we can avoid that class
                    if (className.equals("android.widget.ListView")) {
                        // Trying to use the nodeID won't work -- the ids keep changing (probably for good reason)
                        // So much for saving cycles -- just check all window events, sorry phone

                        // Can't use .getText() strategy -- WINDOW event metadata doesn't contain URL info
                        //  when opened through hyperlinks therefore dfs() we go
                        parseNodeForURLViaDFS(event.getSource());
                    }
                }
                // If the user is typing in the omnibox,
                else if (eventType.contains("TYPE_VIEW_TEXT")) {
                    String text = event.getText().toString();
                    // Nothin 2 do
                    if (text == null || text.length() < 3) {
                        // Do nothing
                    }
                    // We have some text!
                    else {
                        while (text.contains(" ")) {
                            text = text.replaceAll(" ", "");
                        }

                        text = text.substring(1, text.length() - 1);
                        text = getHostName(text);

                    Log.d(TAG, "onAccessibilityEvent: our text is " + text);

                        if (porNo.isPornDomain(text)) {
                            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(getRandomURL()));
                            intent.putExtra(Browser.EXTRA_APPLICATION_ID, "com.android.chrome");
                            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                            startActivity(intent);

//                        Log.d(TAG, "dfs: Speed = " + (System.currentTimeMillis() - time));
                        }

                        // Save the resourceID for the omnibox to reduce some cycles
                        // cuz omni not needed to evaluate just text
                        if (event.getSource() != null) {
                            String src = event.getSource().toString();
                            String current = getId(src);

//                        Log.d(TAG, "onAccessibilityEvent: current = " + current);

                            // Save ID of omnibox
                            if (!omnibox.equals(current)) {
//                            Log.d(TAG, "onAccessibilityEvent: UPDATE -- " + omnibox);
                                omnibox = current;
                            }
                        }
                    }
                }
            }
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    private void parseNodeForURLViaAPI(AccessibilityEvent event) {
        AccessibilityNodeInfo source = event.getSource();
        if (source == null) { return; }

        List<AccessibilityNodeInfo> findAccessibilityNodeInfosByViewId = source.findAccessibilityNodeInfosByViewId("com.android.chrome:id/url_bar");

        if (findAccessibilityNodeInfosByViewId.size() > 0) {
            AccessibilityNodeInfo omniboxView = findAccessibilityNodeInfosByViewId.get(0);

            String currentURL = omniboxView.getText().toString();
            String host = getHostNameNew(currentURL);

            // todo make following lines into methods
            host = host.replace("www.", "");
            host = stripMobilePrefixIfPresent(host);
            if (host.contains("/")) {
                host = host.substring(0, host.indexOf("/"));
            }

//            Log.d(TAG, "\n\n--------------------------------\n\n");

            if (porNo.isPorn(host)) {
                long start = System.currentTimeMillis();
                isFound = true;
                Log.d(TAG, "porn site " + host + " found at " + start);

//            if (txt.equals("yahoo.com")) {

                // Attempting direct redirection
                String randomURL = getRandomURL();
                currURL = getHostNameNew(randomURL); // todo we dont need this line i believe

                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(randomURL));
                intent.putExtra(Browser.EXTRA_APPLICATION_ID, "com.android.chrome");
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);

                Log.d(TAG, "rdr = " + (System.currentTimeMillis() - start));
//                }
            }
            else {
                Log.d(TAG, "host : currentURL = " + host + " : " + currentURL);
                Log.d(TAG, "regular site found at " + System.currentTimeMillis());
            }

//                // If the user is typing in the omnibox, optimization ideas for the future
////                    if (eventType.contains("TYPE_VIEW_TEXT")) {
////                        String text = event.getText().toString();
////                        // Nothin 2 do
////                        if (text == null || text.length() < 3) {
////                            // Do nothing
////                        }
////                        // We have some text!
////                        else {
////                            while (text.contains(" ")) {
////                                text = text.replaceAll(" ", "");
////                            }
////
////                            text = text.substring(1, text.length() - 1);
////                            text = getHostName(text);
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

    private boolean deviceSdkIsAtLeast18() {
        return android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.JELLY_BEAN_MR2;
    }

    private boolean isChromeEvent(AccessibilityEvent event) {
        return event.getPackageName() != null && event.getPackageName().toString().contains("com.android.chrome");
    }

    public void parseNodeForURLViaDFS(AccessibilityNodeInfo info){
        if (info == null) {
            return;
        }

        if (info.getText() != null && info.getText().toString().trim().length() > 0) {
            String txt = info.getText().toString().trim();
            txt = txt.toLowerCase();

//            Log.d(TAG, "dfs: the text is " + txt);

            if (txt.contains(" ")) {
                return;
            }

            if (!txt.contains(".")) {
                return;
            }

            // If we have a non-zz value for the omnibox AND the current node corresponds to
            //  the omnibox, then return to prevent rest of dfs -- omnibox gets searched in code more above
            //
            // If omnibox is zz, it's uninitialized, so proceed with dfs
            // Otherwise, we have a value for omnibox, so this evaluates
            //  to true when we have a node that isn't the omnibox
            if (!omnibox.equals("zz") && !getId(info.toString()).equals(omnibox)) {
//                Log.d(TAG, "dfs: rip... info:omnibox = " + getId(info.toString()) + " : " + omnibox);
                return;
            }

            // Else, let's check this out
            String host = getHostName(txt);

            // If we have the redirect url, we can start processing stuff again
            // Otherwise, check if we are still in the REDIRECTION state
            Log.d(TAG, "dfs: host : currURL + isFound =  " + host + " : " + currURL + " + " + isFound);

            if (host.contains(currURL)) {
//                Log.d(TAG, "dfs: host does equal currURL");
                isFound = false;
            }
            if (isFound && !porNo.isPorn(host)) {
//                Log.d(TAG, "dfs: isFound evaluated to true: host - currURL = " + host + " - " + currURL);
                return;
            }

//            Log.d(TAG, "dfs: the URL is " + txt);
//            Log.d(TAG, "dfs: the URL, thru URI, is " + host);
//            Log.d(TAG, "isFound = " + isFound);

            if (isUnsafeGoogleSearch(txt)) {
                // todo this doesnt work when:
                // user visits google.com
                // user searches within that search bar (doesnt throw an event we listen for atm)
                // user can see porn sites as search results :(
                Log.d(TAG, "redirecting to safe google search");
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://" + txt + "&safe=active"));
                intent.putExtra(Browser.EXTRA_APPLICATION_ID, "com.android.chrome");
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
                return;
            }

            // Is the txt a banned URL?
            if (porNo.isPorn(host)) {
                isFound = true;

//                Log.d(TAG, "dfs: source info =  " + info);

//            if (txt.equals("yahoo.com")) {

                // Attempting direct redirection
                String randomURL = getRandomURL();
                currURL = getHostName(randomURL);

                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(randomURL));

                // First, we "stop" the page load of the porn site....
                // Why is hugesex.tv so fucking fast wtffffff
                // NAW FIXEDDDDD: Clicking the back button to visit a porn site completely bypasses our url detection
                // fuck u stop watching porn >:(
                intent.putExtra(Browser.EXTRA_APPLICATION_ID, "com.android.chrome");
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);

//                    Log.d(TAG, "dfs: Speed = " + (System.currentTimeMillis() - time));
                return;
//                }
            }
        }

        for (int i = 0 ; i < info.getChildCount(); i++) {
//            Log.d(TAG, "onAccessibilityEvent: Iteration " + i + "/" + info.getChildCount());

            AccessibilityNodeInfo child = info.getChild(i);
            parseNodeForURLViaDFS(child);

            if (child != null) {
                child.recycle();
            }
        }
    }

    public boolean isUnsafeGoogleSearch(String url) {
        return url.contains("google.com/search?") && !url.contains("&safe=active");
    }

    // Get the associated nodeId of the passed in event source
    public String getId(String src) {
        int start = src.indexOf("@");
        int stop = src.indexOf(";");

        return src.substring(start, stop);
    }

    public String getRandomURL() {
        return Utilities.getRandomURL();
    }

    // todo rethink the DFS strategy in order to avoid having two getHostName lolol
    // Thank you, https://stackoverflow.com/questions/23079197/extract-host-name-domain-name-from-url-string/23079402
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

        // Fuck you websites that use mobile prefix and break my hashmap
        if (hostName.contains("mobile.")) {
            hostName = hostName.substring(7);
        }
        else if (hostName.contains("m.") && hostName.indexOf("m.") < 3) { // medium.com => dium.com smh todo?
            hostName = hostName.substring(2);
        }

        // Fuck you no path allowed
        if (hostName.contains("/")) {
            return hostName.substring(0, hostName.indexOf("/"));
        }

//        Log.d(TAG, "getHostName: url++ = " + hostName);
        return hostName;
    }

    // Thank you, https://stackoverflow.com/questions/23079197/extract-host-name-domain-name-from-url-string/23079402
    public static String getHostNameNew(String url) {
        URI uri;
//        Log.d(TAG, "getHostName: url = " + url);

        try {
            uri = new URI(url);
        } catch (URISyntaxException e) {
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
    public void onInterrupt() {
    }
}
