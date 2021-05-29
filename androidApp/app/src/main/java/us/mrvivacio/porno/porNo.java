// PorNo! Android
// porNo.java
// @author Vivek Bhookya

package us.mrvivacio.porno;

import android.util.Log;

import java.util.Map;

public class porNo {
    private static String TAG = "dawg";
    // read me https://stackoverflow.com/questions/4833480/have-i-reached-the-limits-of-the-size-of-objects-javascript-in-my-browser-can-ha

    /*
     * Function isPorn
     * UNREFINED !! put me in another dedicated class of my own pleaseeeee
     * Checks only if the url contains any mention of a porn url
     * Ya boi Vivek out here writing a porn filter part 2!!!!!!!!!
     * @param url The url whose domain name we check against the porn sites
     */
    public static boolean isPorn(String url) {
        Log.d(TAG, "input url = " + url);
        Map<String, Boolean> dict2 = MyAccessibilityService.dict2;

        url = url.trim().toLowerCase();

        if (url.length() < 4) {
            return false;
        }

        if (url.contains(" ")) {
            return false;
        }

        if (!url.contains(".")) {
            return false;
        }

        // Avoid fightthenewdrug and github
        if (!url.contains("fightthenewdrug") && !url.contains("github")) {
//            Log.d(TAG, "isPorn: URL = " + url);
//            Log.d(TAG, "isPorn: dict2 get = " + dict2.get(url));

            // O(1)
            if (    dict2.get(url) != null ||
                    MainActivity.realtimeBannedLinks.get(url) != null) {
                return true;
            }
        }

        // Inconclusive
        return false;
    }

    public static boolean isPornDomain(String url) {
        Map<String, Boolean> dict2 = MyAccessibilityService.dict2;

        url = url.trim().toLowerCase();

        // 4 because p.co (example) could be a real porn site and don't wanna skip those
        if (url.length() < 4) {
            return false;
        }

        // Return false for these URLs to avoid disrupting browsing experience
        // ie trying to look at porNo.js on my Github shouldn't trigger lmao
        if (    url.contains("fightthenewdrug") ||
                url.contains("github") ||
                url.contains("chrome")   ) {
            return false;
        }
        // Lez keep going
        else {
            if (url.contains("www.")) {
                url = url.substring(4);
            }

//            Log.d(TAG, "isPornDomain: URL = " + url);
//            Log.d(TAG, "isPornDomain: dict2 " + dict2.get(url));

            // O(1)
            if (    dict2.get(url) != null ||
                    MainActivity.realtimeBannedLinks.get(url) != null) {
//                Log.d(TAG, "isPornDomain: only took " + (old - System.currentTimeMillis()));
                return true;
            }

            // O(n) worst case feels bad but whO(l)esome porn-checker feels good
//            for (int i = 0; i < Domains.domains.length; i++) {
//                if (url.contains(Domains.domains[i])) {
//                    // GET THE FUCK OUTTTTTTTTTTTTTTT
////                    Log.d(TAG, "isPorn: TRUE");
//
//                    return true;
//                }
//            }
        }

        // Inconclusive
        return false;
    }

}
