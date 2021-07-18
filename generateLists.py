#!/usr/bin/env python3
# ./generateLists.py ; cat lists.js # Feel free to cat lists.java as well

def generateListsInJavaScript():
    # UNTIL MACHINE LEARNING MODEL,
    #  THIS WILL HELP RENEW OUR LISTS

    DEV = "testjs.txt"
    PROD = "chromeExtension/lists.js"

    PATH_URLS = "lists/Urls/"
    PATH_KEYWORDS = "lists/Keywords/"

    # w = [over]write, a = append
    outputFile = open(PROD, "w")

    header = "// PorNo!\n"
    header += "// lists.js THIS FILE WAS GENERATED WITH listBuilder.py\n"
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

def generateListsInJava():
    DEV = "testjava.txt"
    PROD = "androidApp/app/src/main/java/us/mrvivacio/porno/Domains.java"

    PATH_URLS = "lists/Urls/"
    PATH_KEYWORDS = "lists/Keywords/"

    # w = [over]write, a = append
    outputFile = open(PROD, "w")

    header = "// PorNo!\n"
    header += "// Domains.java THIS FILE WAS GENERATED WITH java.py\n"
    header += "// Thank you:\n"
    header += "// https://github.com/ninjayoto/PornList/blob/master/PornList.txt\n"
    header += "// https://github.com/Bon-Appetit/porn-domains/blob/master/domains.txt\n"
    header += "// https://pastebin.com/gpHmA8X5\n"
    header += "// Alexa web ranking service for that good 7-day free trial\n"
    header += "// People who've triggered PorNo!'s capture system\n"
    header += "//\n"
    header += "// This file looks like this because of https://stackoverflow.com/questions/36797134/\n"
    header += "\n"

    header += "package us.mrvivacio.porno;\n\n"
    header += "import android.util.Log;\n"
    header += "import java.util.HashMap;\n"
    header += "import java.util.Map;\n\n"

    header += "public class Domains {\n"
    header += """\tstatic Map<String, Boolean> dict = new HashMap<String, Boolean>();
    static String TAG = "!! Domains";

    public static Map<String, Boolean> init() {\n"""

    for c in "0123456789abcdefghijklmnopqrstuvwxyz":
        methodName = "\t\tadd" + c.upper() + "();\n"
        header += methodName

    header += """
    \treturn dict;
    }

    """

    outputFile.write(header)

    s = "static void add"
    for c in "0123456789abcdefghijklmnopqrstuvwxyz":
        s += c.upper() + "() {\n\t\tString[] domains = {"
        name = PATH_URLS + c + ".txt"
        urls = open(name, "r")

        for url in urls:
            urlWithoutNewLine = "\"" + url[:-1] + "\""
            s += urlWithoutNewLine + ","

        s = s[:-1]
        s += "};\n"
        s += "\t\tfor (String domain:domains) { dict.put(domain, true); }\n"

        if (c == "z"):
            s += "\t}\n"

        else:
            s += "\t}\n\n"

        outputFile.write(s)
        s = "\tstatic void add"

    outputFile.write("}")
    #outputFile.write(s)

    # s = "let bannedWordsList=["
    # for c in "abcdefghijklmnopqrstuvwxyz":
    #     name = PATH_KEYWORDS + c + ".txt"
    #     urls = open(name, "r")
    #
    #     for url in urls:
    #         urlWithoutNewLine = "\"" + url[:-1] + "\""
    #         s += urlWithoutNewLine + ","
    #
    # s = s[:-1]
    # s += "];\n"

    # outputFile.write(s)
    outputFile.close()

if (__name__ == "__main__"):
    generateListsInJavaScript()
    generateListsInJava()
    print("Generated file at chromeExtension/lists.js")
    print("Generated file at androidApp/app/src/main/java/us/mrvivacio/porno/Domains.java")
