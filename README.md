# PorNo! Porn Blocker

<h3 align="center"> Special thanks to family, friends, users, and anyone I've spoken to about PorNo! 💛 </h3>

<br>

Welcome! This is meant to provide a free and public algorithm for porn detection.
<br>
<br>
<a href="https://chrome.google.com/webstore/detail/porno-porn-blocker-beta/fnfchnplgejcfmphhboehhlpcjnjkomp" target="_blank">Chrome extension</a>.

<a href="https://play.google.com/store/apps/details?id=us.mrvivacio.porno">Android app (NEEDS WORK)</a>.
<br>


### Vivek's to-dos that'll happen at some point and you're just gonna have to wait, ok?
✅ (Sept 15 2020) Add a Python build script to take the data in lists/ and generate a .js file 
<br>
✅ (Sept 24 2020) Add a Python build script to generate a Domains.java file (only has URLs) 
<br>
o Script to check for duplicate entries (housekeeping)
<br>
o Add the urls from database (via a script too ???? 👀)
<br>
o Add a way for users to add sites on the fly via internal form or somethin / suggest sites that shouldn't be banned without sending an email
<br>
o The many number of 18+ subbreddits
<br>
o Google images / videos search results page, add SafeSearch flag
<br>
o Update the Chrome extension and clean up the code
<br>
o Update the Android app and CLEAN up the code
<br>
✅ (Nov 3 2020) Cry
<br>
o Therapy
<br>
o Machine learning model that can detect sites without a prior database for on-the-fly detection!
<br>
o Implement IBM x-force API to categorize websites!
<br>
o Respond to emails people send me (No, PorNo! is not for sale at the moment, contribute to the repo or get lost)
<br>
o Translations because people that don't know English find PorNo! and download it and get stuck (sad)
<br>
o P A R A L L E L  P R O G R A M M I N G cuz speed is truly of essence here
<br>
o Don't watch porn, cultivate healthy genuine relationships, get gf, get wife weeeeeeeeeeee



### Some ideas for contributing:
<ul>
<li>
Speed improvements! For example, a program meant to block porn on the internet shouldn't let any part of the site visited
load before the assessment of the site is complete -- it's important to have an assessment faster than the speed of pageload, hence the importance of speed improvements.
</li>

<li>
Expanding the list of porn sites hardcoded in the file! 
</li>

<li>
Making this repo more "formally open source-y and proper"
</li>

<li>
Others to be determined later!
</li>

</ul>

Thank you!



### Misc
`$ ./listBuilder.py # Output in lists.js`
`$ ./java.py # Output in Domains.java`

<br>

Copy lists.js raw into Chrome console and use

```JavaScript
// Empty / clear buffer 
// Remove 'let' in subsequent runs, otherwise 
//  Dev Tools gives an error
let str=''; 

for (let i=0; bannedWordsList[i]; i++) {
    let word = bannedWordsList[i];
    let c = word[0];

    // Rotate out the character for different lists
    if (c === 'z') {
        // console.log(word);
        str += word + "\n";
    }
}

// Show me the money type mood
str;
```
<br>and

```JavaScript

str = '';

// pornMap is an 'object'
for (let property in pornMap) {
    let firstLetter = property[0].toLowerCase();
    
    if (firstLetter === 'z') {
        str += property + '\n';
    }
}
str;
```
