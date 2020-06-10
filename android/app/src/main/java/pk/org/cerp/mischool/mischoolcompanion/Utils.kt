package pk.org.cerp.mischool.mischoolcompanion;

public fun replaceUTF8CharsWithSpecialChars(text: String): String {
    return text
            .replace("%3F", "?")
            .replace("%3D", "=")
            .replace("%26", "&")
}
