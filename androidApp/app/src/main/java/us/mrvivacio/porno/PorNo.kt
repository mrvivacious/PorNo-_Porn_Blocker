package us.mrvivacio.porno

import android.util.Log
import java.util.Locale

object PorNo {
    private const val TAG = "dawg"

    private fun processUrl(url: String): String? {
        var processedUrl = url.trim().lowercase(Locale.getDefault())

        if (processedUrl.contains("www.")) {
            processedUrl = processedUrl.substring(4)
        }

        if (processedUrl.length < 4 ||
            processedUrl.contains(" ") ||
            !processedUrl.contains(".")) {
            return null
        }

        return processedUrl
    }

    // read me https://stackoverflow.com/questions/4833480/have-i-reached-the-limits-of-the-size-of-objects-javascript-in-my-browser-can-ha
    /**
     * Function isPorn
     * Checks only if the url contains any mention of a porn url
     * @param url The url whose domain name we check against the porn sites
     */
    @JvmStatic
    fun isPorn(url: String): Boolean {
        Log.d(TAG, "input url = $url")

        val processedUrl = processUrl(url) ?: return false

        // Avoid fightthenewdrug and github
        if (processedUrl.contains("fightthenewdrug") ||
            processedUrl.contains("github")) {
            return false
        }

        // O(1)
        val dict2 = MyAccessibilityService.dict2
        return dict2[processedUrl] != null ||
                MainActivity.realtimeBannedLinks[processedUrl] != null
    }

    @JvmStatic
    fun isPornDomain(url: String): Boolean {
        // Return false for these URLs to avoid disrupting browsing experience
        // ie trying to look at PorNo.kt on the GitHub site shouldn't trigger
        // TODO do we still need these?
        if (url.contains("fightthenewdrug") ||
            url.contains("github") ||
            url.contains("chrome")
        ) {
            return false
        }

        val processedUrl = processUrl(url) ?: return false
        val dict2 = MyAccessibilityService.dict2

        return dict2[processedUrl] != null ||
                MainActivity.realtimeBannedLinks[processedUrl] != null
    }
}
