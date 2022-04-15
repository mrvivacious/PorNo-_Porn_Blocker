package us.mrvivacio.porno;

import android.os.Environment;
import android.util.Log;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;

public class Utilities {
    public static String getRandomURL() {
        // Back to our hero, file io
        // Construct the filepath for the received month
        // First, get the path to external storage...
        File path = Environment.getExternalStorageDirectory();

        // ...and specify the folder in order to access our info
        File dir = new File(path.getAbsolutePath() + "/PorNo_user_data/");

        // Check if the directory exists
        if (!dir.isDirectory()) {
            // This directory doesn't exist, so let's create it real quick
            dir.mkdir();
            // Log.d("Utilities", "saveToFile: created directory ~");
        }

        // Now, we definitely know that the directory exists, so let's keep going
        // Create the filepath of this date's recipient data
        File file = new File(dir, "links.txt");

        // Check if the file exists
        // https://stackoverflow.com/questions/15571496
        if (!file.exists()) {
            // File doesn't exist, so let's return default url
            return "https://medium.com/@vivekbhookya/porno-de97189d82f6";
        }
        // Else, file exists, so open it and read the URLs
        else {
            BufferedReader reader = null;
            try {
                reader = new BufferedReader(new FileReader(file));
            } catch (FileNotFoundException e) {
                e.printStackTrace();
                return "https://medium.com/@vivekbhookya/porno-de97189d82f6";
            }

            try {
                String currLine = reader.readLine();
                ArrayList<String> currLinks = new ArrayList<>();

                // While we still have text to read, add all the links
                while (currLine != null) {
                    // Add the links
                    currLine = currLine.trim();
                    currLinks.add(currLine);

                    currLine = reader.readLine();
                }

                // Now choose a link at random
                if (currLinks.size() == 0) {
                    return "https://medium.com/@vivekbhookya/porno-de97189d82f6";
                }
                else {
                    int random = (int) Math.floor(Math.random() * currLinks.size());
                    return currLinks.get(random);
                }
            } catch (IOException ioe) {
                return "https://medium.com/@vivekbhookya/porno-de97189d82f6";
            }
        }
    }

    public static void saveToFile(ArrayList<String> URLs) {
        // Back to our hero, file io
        try {
            // Construct the filepath for the received month
            // First, get the path to external storage...
            File path = Environment.getExternalStorageDirectory();

            // ...and specify the folder in order to access our info
            File dir = new File(path.getAbsolutePath() + "/PorNo_user_data/");

            // Check if the directory exists
            if (!dir.isDirectory()) {
                // This directory doesn't exist, so let's create it real quick
                dir.mkdir();
                // Log.d("Utilities", "saveToFile: created directory ~");
            }

            // Now, we definitely know that the directory exists, so let's keep going
            // Create the filepath of this date's recipient data
            File file = new File(dir, "links.txt");

            // Check if the file exists
            // https://stackoverflow.com/questions/15571496
            if (!file.exists()) {
                // File doesn't exist, so let's create a new file and save today's date
                FileOutputStream os = new FileOutputStream(file);

                String urls = "";

                for (String url : URLs) {
                    urls += url + "\n";
                }

                os.write(urls.getBytes());
                 Log.d("Utilities", "CREATING NEW FILE");

                // Our job here is done
                os.close();
            }
            // Else, file exists, so open it and rewrite it
            else {
                // File doesn't exist, so let's create a new file and save today's date
                FileOutputStream os = new FileOutputStream(file);

                String urls = "";

                for (String url : URLs) {
                    urls += url + "\n";
                }

                os.write(urls.getBytes());
                // Log.d("Utilities", "CREATING NEW FILE");

                // Our job here is done
                os.close();
            }
        } catch (IOException ioe) {
            ioe.printStackTrace();
            return;
        }
    }

    // Update file every time link is added
    public static void updateFile(String url) {
        // Back to our hero, file io
        try {
            // Construct the filepath for the received month
            // First, get the path to external storage...
            File path = Environment.getExternalStorageDirectory();

            // ...and specify the HappyBirthday folder in order to access our prevDate info
            File dir = new File(path.getAbsolutePath() + "/PorNo_user_data/");

            // Check if the directory exists
            if (!dir.isDirectory()) {
                // This directory doesn't exist, so let's create it real quick
                dir.mkdir();
                // Log.d("Utilities", "saveToFile: created directory ~");
            }

            // Now, we definitely know that the directory exists, so let's keep going
            // Create the filepath of this date's recipient data
            File file = new File(dir, "links.txt");

            // Check if the file exists
            // https://stackoverflow.com/questions/15571496
            if (!file.exists()) {
                // File doesn't exist, so let's create a new file
                FileOutputStream os = new FileOutputStream(file);

                url = url + "\n";

                os.write(url.getBytes());
                // Log.d("Utilities", "CREATING NEW FILE");

                // Our job here is done
                os.close();
            }
            // Else, file exists, so open it and rewrite it
            else {
                BufferedReader reader = null;
                try {
                    reader = new BufferedReader(new FileReader(file));
                } catch (FileNotFoundException e) {
                    e.printStackTrace();
                    return;
                }

                try {
                    String currLine = reader.readLine();
                    String currLinks = "";

                    // While we still have text to read, add all the links
                    while (currLine != null) {
                        int idxOfSlash = currLine.indexOf("/");
                        currLinks +=  currLine + "\n";
                        currLine = reader.readLine();
                    }

                    // Add our new link
                    currLinks += url + "\n";

                    // Now save all the links
                    FileOutputStream os = new FileOutputStream(file);

                    os.write(currLinks.getBytes());

                    // Our job here is done
                    os.close();
                } catch (IOException ioe) {
                    return;
                }
            }
        } catch (IOException ioe) {
            ioe.printStackTrace();
            return;
        }
    }

    public static void removeFromFile(String url) {
        // First, get the path to external storage...
        File path = Environment.getExternalStorageDirectory();
        File dir = new File(path.getAbsolutePath() + "/PorNo_user_data/");

        // Check if the directory exists
        if (!dir.isDirectory()) {
            // This directory doesn't exist, so whatever lol nothing to do
            return;
        }

        // Now, we definitely know that the directory exists, so let's keep going
        // Create the filepath of this date's recipient data
        File file = new File(dir, "links.txt");

        // Check if the file exists
        // https://stackoverflow.com/questions/15571496/
        if (!file.exists()) {
            // no file no work
            return;
        }
        // Else, file exists, so open it and delete this url
        else {
            BufferedReader reader = null;
            try {
                reader = new BufferedReader(new FileReader(file));
            } catch (FileNotFoundException e) {
                e.printStackTrace();
                return;
            }

            try {
                String currLine = reader.readLine();
                String currLinks = "";

                // While we still have text to read, add all the links
                while (currLine != null) {
                    // Add the links but the one to delete
                    if (!currLine.contains(url)) {
                        currLinks += currLine + "\n";
                    }

                    currLine = reader.readLine();
                }

                // Now save all the links
                FileOutputStream os = new FileOutputStream(file);

                os.write(currLinks.getBytes());

                // Our job here is done
                os.close();
            } catch (IOException ioe) {
                return;
            }
        }
    }
}
