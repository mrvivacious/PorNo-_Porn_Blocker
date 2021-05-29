package us.mrvivacio.porno;

import org.junit.Test;

import static org.junit.Assert.*;

public class porNoTest {

    // isPorn() is sent URL hostnames, so test with those only
    @Test
    public void isPorn() {
        boolean malformedURL = porNo.isPorn("pornhub com");

        assertFalse(malformedURL);
    }

    @Test
    public void isNotPorn() {
        boolean notPornURL = porNo.isPorn("https://chrome.google.com/webstore/detail/porno-beta/fkhfpbfakkjpkhnonhelnnbohblaeooj");

        assertFalse(notPornURL);
    }

    @Test
    public void expectedHostNames() {
        String host = MyAccessibilityService.getHostName("hugesex.tv/en/");
        String host2 = MyAccessibilityService.getHostName("https://www.bangbros.com/");


        assertEquals("hugesex.tv", host);
        assertEquals("bangbros.com", host2);
    }
}