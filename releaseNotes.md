# releaseNotes

## 0.0.1.902 Chrome Extension

- (Enhancement) reduced chrome extension size by removing jQuery library. I refactored jQuery into Vanilla JavaScript
- (Lists) updated the ban list

***

## 0.0.1.901 Chrome Extension

- (Enhancement) Custom banlists. Access the menu by clicking `Ban this site?` in the top right corner of the popup
- (Lists) updated the ban list!

***

## 0.0.1.9 Chrome Extension

- (Enhancement) Submit V3 migration, to prevent Chrome from removing PorNo!
- (Enhancement) UI and visual improvements, courtesy [webVerts](https://github.com/mrvivacious/PorNo-_Porn_Blocker/commits?author=webVerts)! Thank you so much! Good ideas with the input box border and contrasting colors 😃
- (Enhancement) Bing now defaults to safemode
- (Enhancement) Ported some jQuery into Vanilla JS. Planning to eventually phase out all jQuery, which will lead to removing the library, futher saving on app size.
- (Lists) updated the ban list!

***

## 0.0.1.8 Chrome Extension

- (Bug fix) Issue with PorNo! attempting to redirect to `/lastTimestampSynced`. This bug has been taken care of and PorNo! will redirect as usual.

***

## 0.0.1.7 Chrome Extension

- (Feature) Streak! See how long it's been since your last redirect. Hopefully this helps motivate users to keep going during tougher times.
- (Feature) Link to subreddit has been added. Join the subreddit and leave feedback about this version update!
- (Lists) Updated banlist.

**Data** This version collects new data. No personal information / identifiable information is collected.
Specifically, a list of every redirect is saved (this is used to calculate the streak). Additionally, the list of (anonymous!) redirects are uploaded to 
 the PorNo! database to help set up "overall project analytics" coming in the future.
Again, NO PERSONAL INFORMATION IS COLLECTED, if you are conscious of your data you can rest easy knowing that nobody can trace the PorNo! database to any specific user, let alone any user at all.

***

## 0.0.1.6 Chrome Extension

- (Improvement) Better filtering for NSFW subreddits to avoid flagging an entire, potentially SFW subreddit because of an arbitrary NSFW post [that was most likely flagged to hide spoilers as opposed to containing genuinely NSFW material].

***

## 0.0.1.5 Chrome Extension

- (Feature) Redirection and detection support for NSFW subreddits.
- (Improvement) Slight improvement to the detection algorithm, now support websites that are generally SFW but have an NSFW section as a path in the URL (ie. "test.com/adultstuff", "test2.com/nsfw")


