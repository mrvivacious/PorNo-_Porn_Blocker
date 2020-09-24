#!/usr/bin/env python3
# ./listBuilder.py ; cat lists.js

def main():
    # UNTIL MACHINE LEARNING MODEL,
    #  THIS WILL HELP RENEW OUR LISTS

    #DEV = "testFile.txt"
    PROD = "Domains.java"

    PATH_URLS = "lists/Urls/"
    PATH_KEYWORDS = "lists/Keywords/"

    # w = [over]write, a = append
    outputFile = open(PROD, "w")

    header = "// PorNo!\n"
    header += "// lists.java THIS FILE WAS GENERATED WITH java.py\n"
    header += "// Thank you:\n"
    header += "// https://github.com/ninjayoto/PornList/blob/master/PornList.txt\n"
    header += "// https://github.com/Bon-Appetit/porn-domains/blob/master/domains.txt\n"
    header += "// https://pastebin.com/gpHmA8X5\n"
    header += "// Alexa web ranking service for that good 7-day free trial\n"
    header += "// People who've triggered PorNo!'s capture system\n"
    header += "\n"

    header += "package us.mrvivacio.porno;\n\n"
    header += "import android.util.Log;\n"
    header += "import java.util.HashMap;\n"
    header += "import java.util.Map;\n\n"

    header += "public class Domains {"
    header += """
    \tstatic Map<String, Boolean> dict = new HashMap<String, Boolean>();
    \tstatic String TAG = "!! Domains";

    \tpublic static Map<String, Boolean> init() {
    \t\tadd0();
    \t\tadd1();
    \t\tadd2();
    \t\tadd3();
    \t\tadd4();
    \t\tadd5();
    \t\tadd6();
    \t\tadd7();
    \t\tadd8();
    \t\tadd9();
    \t\taddA();
    \t\taddB();
    \t\taddC();
    \t\taddD();
    \t\taddE();
    \t\taddF();
    \t\taddG();
    \t\taddH();
    \t\taddI();
    \t\taddJ();
    \t\taddK();
    \t\taddL();
    \t\taddM();
    \t\taddN();
    \t\taddO();
    \t\taddP();
    \t\taddQ();
    \t\taddR();
    \t\taddS();
    \t\taddT();
    \t\taddU();
    \t\taddV();
    \t\taddW();
    \t\taddX();
    \t\taddY();
    \t\taddZ();

    \t\treturn dict;
    \t}


    """

    outputFile.write(header)

    s = "\tstatic void add"
    for c in "0123456789abcdefghijklmnopqrstuvwxyz":
        s += c.upper() + "() {\n\t\tString[] domains = {"
        name = PATH_URLS + c + ".txt"
        urls = open(name, "r")

        for url in urls:
            urlWithoutNewLine = "\"" + url[:-1] + "\""
            s += urlWithoutNewLine + ","

        s = s[:-1]
        s += "};\n\n"
        s += "\t\tfor (String domain:domains) { dict.put(domain, true); }\n"

        s += "\t}\n\n"

        outputFile.write(s)
        s = "\tstatic void add"

    outputFile.write("}")

    #outputFile.write(s)

    s = "let bannedWordsList=["
    for c in "abcdefghijklmnopqrstuvwxyz":
        name = PATH_KEYWORDS + c + ".txt"
        urls = open(name, "r")

        for url in urls:
            urlWithoutNewLine = "\"" + url[:-1] + "\""
            s += urlWithoutNewLine + ","

    s = s[:-1]
    s += "];\n"

    #outputFile.write(s)
    outputFile.close()

if (__name__ == "__main__"):
    main()
