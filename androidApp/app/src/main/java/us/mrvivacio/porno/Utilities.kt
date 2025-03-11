package us.mrvivacio.porno

import android.os.Environment
import android.util.Log
import java.io.BufferedReader
import java.io.File
import java.io.FileNotFoundException
import java.io.FileOutputStream
import java.io.FileReader
import java.io.IOException
import kotlin.math.floor

val randomURL: String
    get() {
        val reader = getReader("links.txt") ?: return "https://medium.com/@vivekbhookya/porno-de97189d82f6"

        try {
            var currLine = reader.readLine()
            val currLinks = mutableListOf<String>()

            // While we still have text to read, add all the links
            while (currLine != null) {
                // Add the links
                currLinks.add(currLine)
                currLine = reader.readLine()
            }

            // Now choose a link at random
            return if (currLinks.isEmpty()) {
                "https://medium.com/@vivekbhookya/porno-de97189d82f6"
            } else {
                val random = floor(Math.random() * currLinks.size).toInt()
                currLinks[random]
            }
        } catch (ioe: IOException) {
            Log.e("Utilities", "Error reading links file", ioe)
            return "https://medium.com/@vivekbhookya/porno-de97189d82f6"
        } finally {
            reader.close()
        }
    }


fun getDirectory(): File? {
    val path = Environment.getExternalStorageDirectory()
    val dir = File("${path.absolutePath}/PorNo_user_data/")
    if (!dir.isDirectory && !dir.mkdir()) {
        // Directory creation failed
        Log.e("Utilities", "Failed to create directory: ${dir.absolutePath}")
        return null
    }

    return dir
}

fun getFile(fileName: String): File? {
    val dir = getDirectory() ?: return null // Return null if getDirectory fails
    val file = File(dir, fileName)
    if (!file.exists()) {
        try {
            file.createNewFile()
        } catch (e: IOException) {
            Log.e("Utilities", "Error creating file: ${file.absolutePath}", e)
            return null
        }
    }

    return file
}

fun getReader(fileName: String): BufferedReader? {
    val file = getFile(fileName) ?: return null
    try {
        return BufferedReader(FileReader(file))
    } catch (e: FileNotFoundException) {
        Log.e("Utilities", "File not found: ${file.absolutePath}", e)
        return null
    }
}

fun getWriter(fileName: String): FileOutputStream? {
    val file = getFile(fileName) ?: return null
    try {
        return FileOutputStream(file)
    } catch (e: FileNotFoundException) {
        Log.e("Utilities", "File not found: ${file.absolutePath}", e)
        return null
    }
}

fun saveToFile(URLs: List<String>) {
    val os = getWriter("links.txt") ?: return

    var urls = ""
    for (url in URLs) {
        urls += "$url\n"
    }

    try {
        os.write(urls.toByteArray())
        Log.d("Utilities", "CREATING NEW FILE")

        os.close()
    } catch (e: IOException) {
        Log.e("Utilities", "Error writing to file", e)
    }
}

fun updateFile(url: String) {
    val file = getFile("links.txt") ?: return // If getFile() returns null, exit
    val urlWithNewLine = "$url\n"

    // Check if the file exists. If not, write the url to a new file
    if (!file.exists()) {
        val os = getWriter("links.txt") ?: return
        try {
            os.write(urlWithNewLine.toByteArray())
            os.close()
        } catch (e: IOException) {
            Log.e("Utilities", "Error writing to new file", e)
        }
    } else {
        try {
            // Open in append mode
            val os = FileOutputStream(file, true)
            os.write(urlWithNewLine.toByteArray())
            os.close()
        } catch (ioe: IOException) {
            Log.e("Utilities", "Error appending to file", ioe)
        }
    }
}

fun removeFromFile(url: String) {
    val file = getFile("links.txt") ?: return

    if (!file.exists()) {
        // no file no work
        return
    } else {
        val reader = getReader("links.txt") ?: return

        try {
            var currLine = reader.readLine()
            var currLinks = ""

            // While we still have text to read, add all the links
            while (currLine != null) {
                // Add the links but the one to delete
                if (!currLine.contains(url)) {
                    currLinks += "$currLine\n"
                }

                currLine = reader.readLine()
            }

            // Now save all the links
            val os = FileOutputStream(file)

            os.write(currLinks.toByteArray())

            // Our job here is done
            os.close()
        } catch (ioe: IOException) {
            Log.e("Utilities", "Error removing URL from file", ioe)
        } finally {
            reader.close()
        }
    }
}