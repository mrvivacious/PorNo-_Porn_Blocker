#!/usr/bin/env python3

def main():
    # UNTIL MACHINE LEARNING MODEL,
    #  THIS WILL HELP RENEW OUR LISTS

    DEV = "testFile.txt"
    PROD = "lists.js"

    PATH_URLS = "lists/Urls/"
    PATH_KEYWORDS = "lists/Keywords/"

    # w = [over]write, a = append
    outputFile = open(PROD, "w")

    header = "// PorNo!\n"
    header += "// lists.js\n"
    header += "// Thank you:\n"
    header += "// https://github.com/ninjayoto/PornList/blob/master/PornList.txt\n"
    header += "// https://github.com/Bon-Appetit/porn-domains/blob/master/domains.txt\n"
    header += "// https://pastebin.com/gpHmA8X5\n"
    header += "// Alexa web ranking service for that good 7-day free trial\n"
    header += "// People who've triggered PorNo!'s capture system\n"
    header += "\n"

    outputFile.write(header)
    
    s = "let pornMap={"
    for c in "0123456789abcdefghijklmnopqrstuvwxyz":
        name = PATH_URLS + c + ".txt"
        urls = open(name, "r")

        for url in urls:
            urlWithoutNewLine = "\"" + url[:-1] + "\":!0"
            s += urlWithoutNewLine + ","

    s = s[:-1]
    s += "};\n"

    outputFile.write(s)

    s = "let bannedWordsList=["
    for c in "abcdefghijklmnopqrstuvwxyz":
        name = PATH_KEYWORDS + c + ".txt"
        urls = open(name, "r")

        for url in urls:
            urlWithoutNewLine = "\"" + url[:-1] + "\""
            s += urlWithoutNewLine + ","

    s = s[:-1]
    s += "];\n"

    outputFile.write(s)
    outputFile.close()

if (__name__ == "__main__"):
    main()
