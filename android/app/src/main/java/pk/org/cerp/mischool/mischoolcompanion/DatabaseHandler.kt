package pk.org.cerp.mischool.mischoolcompanion

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import android.content.ContentValues
import android.database.Cursor
import android.database.sqlite.SQLiteException
import kotlin.collections.ArrayList

class DatabaseHandler(context: Context): SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {
    
    companion object {
        private const val DATABASE_VERSION = 1
        private const val DATABASE_NAME = "SMSDatabase"
        private const val TABLE_CONTACTS = "SMSTable"

        private const val KEY_ID = "id"
        private const val KEY_TEXT = "text"
        private const val KEY_PHONE = "phone"
        private const val KEY_DATE = "date"
        private const val KEY_STATUS = "status"
    }

    override fun onCreate(db: SQLiteDatabase?) {
        
        val createTableQuery = ("CREATE TABLE " + TABLE_CONTACTS + "("
                + KEY_ID + " INTEGER PRIMARY KEY," + KEY_TEXT + " TEXT,"+ KEY_DATE + " TEXT,"
                + KEY_PHONE + " TEXT,"+ KEY_STATUS + " TEXT" + ")")

        db?.execSQL(createTableQuery)
    }

    override fun onUpgrade(db: SQLiteDatabase?, oldVersion: Int, newVersion: Int) {
        db!!.execSQL("""DROP TABLE IF EXISTS $TABLE_CONTACTS""")
        onCreate(db)
    }

    fun add_message(sms: SMSItem): Long {

        // open connection
        val db = this.writableDatabase

        val contentValues = ContentValues()

        contentValues.put(KEY_TEXT, sms.text)
        contentValues.put(KEY_PHONE, sms.number )
        contentValues.put(KEY_STATUS, sms.status )
        contentValues.put(KEY_DATE, sms.date )

        // run insert query
        val success = db.insert(TABLE_CONTACTS, null, contentValues)

        // close db connection
        db.close()

        // return insert query result rowID or -1 in case of error
        return success
    }

    fun get_messages(status: String?): ArrayList<SMSItem> {

        val list = ArrayList<SMSItem>()

        val query = if(status == null) {
            "SELECT  * FROM $TABLE_CONTACTS"
        } else {
            "SELECT * FROM $TABLE_CONTACTS WHERE status='$status'"
        }

        // open connection for read action
        val db = this.readableDatabase
        // A Cursor implementation that exposes results from a query on a SQLiteDatabase
        var cursor: Cursor? = null

        try {
            cursor = db.rawQuery(query, null)
        } catch (e: SQLiteException) {
            db.execSQL(query)
            return ArrayList()
        }

        var message_id: Int
        var recipient_phone: String
        var sms_text: String
        var sms_status: String
        var sms_date: String

        if (cursor.moveToFirst()) {
            do {

                message_id = cursor.getInt(cursor.getColumnIndex("id"))
                recipient_phone = cursor.getString(cursor.getColumnIndex("phone"))
                sms_text = cursor.getString(cursor.getColumnIndex("text"))
                sms_date = cursor.getString(cursor.getColumnIndex("date"))
                sms_status = cursor.getString(cursor.getColumnIndex("status"))

                val sms = SMSItem( number = recipient_phone, text = sms_text, status = sms_status, date = sms_date)

                // add to list
                list.add(sms)
            } while (cursor.moveToNext())
        }
        return list
    }

    fun update_message(sms: SMSItem): Int {
        
        val db = this.writableDatabase
        val values = ContentValues()
        val timestamp = get_timestamp()

        // update the values
        values.put(KEY_STATUS, sms.status)
        values.put(KEY_DATE, timestamp)
        
        // execute update query
        val success = db.update(TABLE_CONTACTS, values, "text=? AND phone=? AND status !=?", arrayOf(sms.text, sms.number, SMSStatus.SENT))
        
        db.close()
        
        return success
    }

    fun delete_messages(): Int {

        val db = this.writableDatabase
        val success = db.delete(TABLE_CONTACTS, null, null)
        db.close()

        return success
    }

    fun delete_messages(status: String?): Int {

        val db = this.writableDatabase
        val success = db.delete(TABLE_CONTACTS, "status=?", arrayOf(status))
        db.close()

        return success
    }

    fun delete_message(sms: SMSItem): Int {
        
        val db = this.writableDatabase
        val success = db.delete(TABLE_CONTACTS, "phone=? AND status=?", arrayOf(sms.number, SMSStatus.FAILED))
        db.close()

        return success
    }
}