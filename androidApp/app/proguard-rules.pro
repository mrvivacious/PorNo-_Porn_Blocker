# Add project specific ProGuard rules here.
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Uncomment this to preserve the line number information for
# debugging stack traces.
-keepattributes SourceFile,LineNumberTable # Sentry needs these to preserve stack traces

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

# Keep the domain list from being stripped
-keep class us.mrvivacio.porno.Domains { *; }

# prevent classes from being renamed
-keep class us.mrvivacio.porno.PorNo { *; }
-keep class us.mrvivacio.porno.Utilities { *; }
-keep class us.mrvivacio.porno.MyAccessibilityService { *; }

