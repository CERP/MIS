package pk.org.cerp.mischool.mischoolcompanion;

import java.text.SimpleDateFormat
import java.util.*

fun replace_utf8_chars_with_special_chars(text: String): String {
    return text
            .replace("%3F", "?")
            .replace("%3D", "=")
            .replace("%26", "&")
}

fun get_timestamp(): String {
    val date = Calendar.getInstance().time
    val formatter = SimpleDateFormat.getDateTimeInstance()
    return formatter.format(date)
}
