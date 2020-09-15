#!/usr/bin/env python3

def main():
    # UNTIL MACHINE LEARNING MODEL,
    #  THIS WILL HELP RENEW OUR LISTS
    # Open URL dir
    # dict for URL
    # string for resulting list
    # For file in 0..Z.txt
    # Add url to dict, build string, concat to string
    # write to file

    # Do same thing with banned keywords
    print("Hello!")

    pathKeywords = "lists/Keywords/"
    pathUrls = "lists/Urls/"

    outputFile = open("testFile.txt", "w")

    ctr = 0
    for c in "0123456789abcdefghijklmnopqrstuvwxyz":
        name = pathUrls + c + ".txt"
        print(name)
        urls = open(name, "r")

        for url in urls:
            outputFile.write(url)
            ctr += 1


    print(ctr)

    # a = append, w = [over]write
    outputFile.close()


if (__name__ == "__main__"):
    main()
