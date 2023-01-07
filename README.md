<!-- ![PorNo! banner](https://mrvivacious.github.io/pictures/banners/porNo_text.png) -->

<p align="center">
    <img src="/pictures/heart_PorNo.png" width="150">
    <h1 align="center">PorNo! Porn Blocker</h1>
    <h3 align="center">PorNo! redirects users from porn to positive, fulfilling websites, instead of the standard "page blocked / blank screen" response<h3>
</p>
    
<br>
    
<!--   Links   -->

<table align="center">
  <tr>
    <th>Chrome Extension</th>
    <th>Android App</th>
    <th>Join the Subreddit</th>
    <th>Additional Support</th>
  </tr>
  <tr>
    <th>
        <a href="https://chrome.google.com/webstore/detail/porno-porn-blocker-beta/fnfchnplgejcfmphhboehhlpcjnjkomp" target="_blank">
            <img src="/pictures/chromeWebStoreIcon.png">
        </a>
    </th>
    <th>
            <a href='https://play.google.com/store/apps/details?id=us.mrvivacio.porno&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1' target="_blank">
              <img width="220" alt='Get PorNo! Porn Blocker on Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'/>
            </a>
    </th>
    <th>
            <a href='https://www.reddit.com/r/ourlastpornblocker/' target="_blank">
              <img width="220" alt='Subreddit for PorNo!. r-slash-ourlastpornblocker' src='https://1000logos.net/wp-content/uploads/2017/05/Reddit-logo.jpg'/>
            </a>
    </th>
    <th>  
        <a href="mailto:jvnnvt@gmail.com?Subject=PorNo! (From GitHub)" target="_blank"><em>Email me!</em></a>
    </th>
  </tr>
</table>


<!--   End links   -->

<!--
<h5 align="center">
    <em>Special thanks to family, friends, users, and anyone I've spoken to about PorNo! 💛 </em>
</h5>
-->


<!--
[![forthebadge](https://forthebadge.com/images/badges/for-you.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/0-percent-optimized.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/built-for-android.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/you-didnt-ask-for-this.svg)](https://forthebadge.com)
-->

## Contents
who what where when why how, goals of project (last porn blocker ever rawr)

monetization

mention problem with finding urls

[Installation](#installation)
    
[HELP TRANSLATE PorNo! ](#translations)

add a gif for web and a gif for android


# Note to self

    Your problems with porn are not my issue.
    
    Your welfare is not my priority.
    
    I work on this project for my own amusement. 
    I am not your friend.   
    
    If there are ways to improve the software / issues with the software, I am 
     listening at jvnnvt@gmail.com and the ourlastpornblocker Subreddit.
    
    Thank you for your time.
    
## Why?
March 2018, I was dealing with a break up off a nasty relationship, and I was using porn to feel less bad/pain/hurt/etc.

When I listened to my favorite music, I noticed I felt good off that. As music doesn't come with the dangers that porn use brings, I thought it would be cool if, whenever I went to a porn site (which was frequent during that time), I instead was shown my favorite music.

This technology didn't exist. I was in college studying computer science (and astronomy), and I thought I could try to build this kind of porn blocker.

The PorNo! Chrome Extension was released in July 2018.
The PorNo! Android app was released in January 2019.

## How to use
- See [Installation](#installation) for updating the lists
- Download, deploy, visit a porn site, add a redirect site, visit a porn site.
- Chrome
  - blahblah
- Android
  - blah blah

## [Installation](#contents)
### Updating the lists
If you've modified `lists/`, apply your changes with `./generateLists.py` or `python generateLists.py` in a terminal   
    
This command will update `chromeExtension/lists.js` and `androidApp/app/src/main/java/us/mrvivacio/porno/Domains.java`
    
### Release builds:
#### Chrome Extension
Click [this](https://chrome.google.com/webstore/detail/porno-porn-blocker-beta/fnfchnplgejcfmphhboehhlpcjnjkomp) or click the "Available in the Chrome Web Store" button at the top of the README

#### Android App
Click [this](https://play.google.com/store/apps/details?id=us.mrvivacio.porno&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1) or click the "Get it on Google Play" button at the top of the README

### Developmental builds:
#### Chrome Extension
1. Clone this repo to an easy-to-find place on your computer. For example, this bash command clones the repo to a folder called porNo in your Desktop:

```
 cd Desktop && git clone https://github.com/mrvivacious/PorNo-_Porn_Blocker.git porNo
```
2. Enter `chrome://extensions/` in the Google Chrome omnibox / search bar
3. Turn on `Developer mode` in the top right corner of the window
4. Click `Load unpacked` in the top left corner of the window
5. Navigate to the folder you cloned PorNo and double-click the `chromeExtension` folder
6. If successful, give yourself a pat on the back.

#### Android App:
1. Same as above
2. Open `androidApp/` in Android Studio
3. Read [this](https://developer.android.com/training/basics/firstapp/running-app)
4. NOTE: For Firebase stuff to work, you will need a [google-services.json file](https://support.google.com/firebase/answer/7015592?hl=en#zippy=%2Cin-this-article) (and probably need to create the project, create the database, etc)

**Note: I don't have a magic CI/CD pipeline at the moment where y'all can recieve the latest changes to the repositories so just make sure you `git pull` regularly thx**
    
## [Translations](#contents)
    
1. Fork this repository, button in top right of screen
2. Download/clone your repo to your computer
3. Download [Android Studio](https://developer.android.com/studio/index.html)
4. Open `androidApp/` in Android Studio
5. Go to `androidApp/app/src/main/res/values/strings.xml`

6. Do [this](https://developer.android.com/studio/write/translations-editor#designlayout)
7. Translate / Use Google Translate to copy the English text into the rows of the language you are translating for
8. When finished, [change your device language](https://www.androidcentral.com/how-change-system-language-your-android-phone) and run PorNo! (green triangle at top of studio) to verify there is no more English
9. Git commit your changes and git push
10. On the GitHub page for your fork, create a pull request for me to review your changes!
(If these instructions aren't clear enough, dm me on Instagram @mrvivacious and let me know how I can improve them)

## Features
- 

## Edit the URL lists

## Filing issues / contributing

## Todo

## Contact me

<hr>

## Milestones
- Created subreddit (June 26)
