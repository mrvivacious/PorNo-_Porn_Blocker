package us.mrvivacio.porno;

import android.os.Environment;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;

public class Utilities {
    public static String getRandomURL() {
        File path = Environment.getExternalStorageDirectory();
        File dir = new File(path.getAbsolutePath() + "/PorNo_user_data/");

        if (!dir.isDirectory()) {
            dir.mkdir();
        }

        File file = new File(dir, "links.txt");

        if (!file.exists()) {
            return "https://medium.com/@vivekbhookya/porno-de97189d82f6";
        }
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

                while (currLine != null) {
                    currLine = currLine.trim();
                    currLinks.add(currLine);
                    currLine = reader.readLine();
                }

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
        try {
            File path = Environment.getExternalStorageDirectory();
            File dir = new File(path.getAbsolutePath() + "/PorNo_user_data/");
            if (!dir.isDirectory()) {
                dir.mkdir();
            }

            File file = new File(dir, "links.txt");
            if (!file.exists()) {
                FileOutputStream os = new FileOutputStream(file);

                String urls = "";

                for (String url : URLs) {
                    urls += url + "\n";
                }

                os.write(urls.getBytes());
                os.close();
            }
            else {
                FileOutputStream os = new FileOutputStream(file);
                String urls = "";

                for (String url : URLs) {
                    urls += url + "\n";
                }

                os.write(urls.getBytes());
                os.close();
            }
        } catch (IOException ioe) {
            ioe.printStackTrace();
        }
    }

    public static void updateFile(String url) {
        try {
            File path = Environment.getExternalStorageDirectory();
            File dir = new File(path.getAbsolutePath() + "/PorNo_user_data/");

            if (!dir.isDirectory()) {
                dir.mkdir();
            }

            File file = new File(dir, "links.txt");
            if (!file.exists()) {
                FileOutputStream os = new FileOutputStream(file);
                url = url + "\n";
                os.write(url.getBytes());
                os.close();
            }
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

                    while (currLine != null) {
                        int idxOfSlash = currLine.indexOf("/");
                        currLinks +=  currLine + "\n";
                        currLine = reader.readLine();
                    }

                    currLinks += url + "\n";
                    FileOutputStream os = new FileOutputStream(file);
                    os.write(currLinks.getBytes());

                    os.close();
                } catch (IOException ioe) {
                }
            }
        } catch (IOException ioe) {
            ioe.printStackTrace();
        }
    }

    public static void removeFromFile(String url) {
        File path = Environment.getExternalStorageDirectory();
        File dir = new File(path.getAbsolutePath() + "/PorNo_user_data/");

        if (!dir.isDirectory()) {
            return;
        }

        File file = new File(dir, "links.txt");

        if (!file.exists()) {
            return;
        }
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