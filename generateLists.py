#!/usr/bin/env python3
import sys
import os

PATH_URLS = "lists/Urls/"

def generateListsInJavaScript():
    # UNTIL MACHINE LEARNING MODEL,
    #  THIS WILL HELP RENEW OUR LISTS
    DEV = "testjs.txt"
    PROD = "chromeExtension/lists.js"

    PATH_KEYWORDS = "lists/Keywords/"

    # w = [over]write, a = append
    outputFile = open(PROD, "w")

    header = "// PorNo!\n"
    header += "// lists.js THIS FILE WAS GENERATED WITH generateLists.py\n"
    header += "\n"

    outputFile.write(header)

    s = "let pornMap={"
    for c in "0123456789abcdefghijklmnopqrstuvwxyz":
        name = PATH_URLS + c + ".txt"
        urls = open(name, "r")

        for url in urls:
            urlWithoutNewLine = "\"" + url.strip() + "\":!0"
            s += urlWithoutNewLine + ","

    s = s[:-1]
    s += "};\n"

    outputFile.write(s)

    s = "let bannedWordsList=["
    for c in "abcdefghijklmnopqrstuvwxyz":
        name = PATH_KEYWORDS + c + ".txt"
        urls = open(name, "r")

        for url in urls:
            urlWithoutNewLine = "\"" + url.strip() + "\""
            s += urlWithoutNewLine + ","

    s = s[:-1]
    s += "];\n"

    outputFile.write(s)
    outputFile.close()

def generateListsInJava():
    DEV = "testjava.txt"
    PROD = "androidApp/app/src/main/java/us/mrvivacio/porno/Domains.java"

    PATH_KEYWORDS = "lists/Keywords/"

    # w = [over]write, a = append
    outputFile = open(PROD, "w")

    header = "// PorNo!\n"
    header += "// Domains.java THIS FILE WAS GENERATED WITH generateLists.py\n"
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
            urlWithoutNewLine = "\"" + url.strip() + "\""
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
    outputFile.close()

def add_urls(domains):
    PATH_URLS = "lists/Urls/"

    for domain in domains:
        domain = domain.strip().lower()
        if not domain:
            continue

        first_char = domain[0]

        if first_char not in "0123456789abcdefghijklmnopqrstuvwxyz":
            print(f"Skipping invalid domain: {domain}")
            continue

        file_path = os.path.join(PATH_URLS, f"{first_char}.txt")

        with open(file_path, "a+") as f:
            f.seek(0, os.SEEK_END)

            if f.tell() > 0:
                f.seek(f.tell() - 1)
                if f.read(1) != "\n":
                    f.write("\n")

            f.write(domain + "\n")

        print(f"Added {domain} -> {file_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "add":
        domains = sys.argv[2:]

        if not domains:
            print("Usage: ./generateLists.py add domain1 domain2 ...")
            sys.exit(1)

        add_urls(domains)

    generateListsInJavaScript()
    generateListsInJava()

    print()
    print("Updated chromeExtension/lists.js")
    print("Updated androidApp/.../Domains.java")