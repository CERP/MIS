package pk.org.cerp.mischool.mischoolcompanion

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import android.content.ContentValues
import android.database.Cursor
import android.database.sqlite.SQLiteException
import android.os.Build
import android.support.annotation.RequiresApi
import android.util.Log
import java.text.SimpleDateFormat
import java.util.*
import kotlin.collections.ArrayList

//create the database logic, extending the SQLiteOpenHelper base class

class DatabaseHandler(context: Context): SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {
    
    companion object {
        private val DATABASE_VERSION = 1
        private val DATABASE_NAME = "SMSDatabase"
        private val TABLE_CONTACTS = "SMSTable"
        private val KEY_ID = "id"
        private val KEY_TEXT = "text"
        private val KEY_PHONE = "phone"
        private val KEY_DATE = "date"
        private val KEY_STATUS = "status"
    }

    override fun onCreate(db: SQLiteDatabase?) {
        
        //prepare database table query string
        val createTableQuery = ("CREATE TABLE " + TABLE_CONTACTS + "("
                + KEY_ID + " INTEGER PRIMARY KEY," + KEY_TEXT + " TEXT,"+ KEY_DATE + " TEXT,"
                + KEY_PHONE + " TEXT,"+ KEY_STATUS + " TEXT" + ")")

        db?.execSQL(createTableQuery)
    }

    override fun onUpgrade(db: SQLiteDatabase?, oldVersion: Int, newVersion: Int) {
        db!!.execSQL("""DROP TABLE IF EXISTS $TABLE_CONTACTS""")
        onCreate(db)
    }

    // store sms
    fun addSMS(sms: SMSItem): Long {

        // open connection for write query
        val db = this.writableDatabase

        val contentValues = ContentValues()

        contentValues.put(KEY_TEXT, sms.text)
        contentValues.put(KEY_PHONE, sms.number )
        contentValues.put(KEY_STATUS, sms.status )
        contentValues.put(KEY_DATE, sms.date )

        // run insert query
        // 2nd argument is String containing nullColumnHack
        val success = db.insert(TABLE_CONTACTS, null, contentValues)

        // close db connection
        db.close()

        // return insert query result rowID or -1 in case of error
        return success
    }

    // get all sms
    fun getAllSMS(): ArrayList<SMSItem> {

        val smsList: ArrayList<SMSItem> = ArrayList<SMSItem>()

        val selectQuery = "SELECT  * FROM $TABLE_CONTACTS"

        // open connection for read action
        val db = this.readableDatabase
        // A Cursor implementation that exposes results from a query on a SQLiteDatabase
        var cursor: Cursor? = null

        try {
            cursor = db.rawQuery(selectQuery, null)
        } catch (e: SQLiteException) {
            db.execSQL(selectQuery)
            return ArrayList()
        }

        var recipientId: Int
        var recipientPhone: String
        var smsText: String
        var smsStatus: String
        var smsDate: String

        if (cursor.moveToFirst()) {
            do {
                recipientId = cursor.getInt(cursor.getColumnIndex("id"))
                recipientPhone = cursor.getString(cursor.getColumnIndex("phone"))
                smsText = cursor.getString(cursor.getColumnIndex("text"))
                smsDate = cursor.getString(cursor.getColumnIndex("date"))
                smsStatus = cursor.getString(cursor.getColumnIndex("status"))

                Log.d("sms data from db", "phone: $recipientPhone text: $smsText status: $smsStatus")

                val sms = SMSItem( number = recipientPhone, text = smsText, status = smsStatus, date = smsDate)

                // add to list
                smsList.add(sms)
            } while (cursor.moveToNext())
        }
        return smsList
    }

    // get all sms with status failed
    fun getAllFailedSMS(): ArrayList<SMSItem> {

        val smsList: ArrayList<SMSItem> = ArrayList<SMSItem>()

        val selectQuery = "SELECT  * FROM $TABLE_CONTACTS WHERE status='FAILED'"

        val db = this.readableDatabase
        var cursor: Cursor? = null

        try {
            cursor = db.rawQuery(selectQuery, null)
        } catch (e: SQLiteException) {
            db.execSQL(selectQuery)
            return ArrayList()
        }

        var recipientId: Int
        var recipientPhone: String
        var smsText: String
        var smsStatus: String
        var smsDate: String

        if (cursor.moveToFirst()) {
            do {
                recipientId = cursor.getInt(cursor.getColumnIndex("id"))
                recipientPhone = cursor.getString(cursor.getColumnIndex("phone"))
                smsText = cursor.getString(cursor.getColumnIndex("text"))
                smsDate = cursor.getString(cursor.getColumnIndex("date"))
                smsStatus = cursor.getString(cursor.getColumnIndex("status"))

                Log.d("sms data from db", recipientPhone + " " + smsText + "  " + smsStatus);

                val sms = SMSItem( number = recipientPhone, text = smsText, status = smsStatus, date = smsDate)

                smsList.add(sms)
            } while (cursor.moveToNext())
        }
        return smsList
    }

    // get all sms with status PENDING
    fun getAllPendingSMS(): ArrayList<SMSItem> {

        val smsList: ArrayList<SMSItem> = ArrayList<SMSItem>()

        val selectQuery = "SELECT  * FROM $TABLE_CONTACTS WHERE status='PENDING'"

        val db = this.readableDatabase
        var cursor: Cursor? = null

        try {
            cursor = db.rawQuery(selectQuery, null)
        } catch (e: SQLiteException) {
            db.execSQL(selectQuery)
            return ArrayList()
        }

        var recipientId: Int
        var recipientPhone: String
        var smsText: String
        var smsStatus: String
        var smsDate: String

        if (cursor.moveToFirst()) {
            do {
                recipientId = cursor.getInt(cursor.getColumnIndex("id"))
                recipientPhone = cursor.getString(cursor.getColumnIndex("phone"))
                smsText = cursor.getString(cursor.getColumnIndex("text"))
                smsDate = cursor.getString(cursor.getColumnIndex("date"))
                smsStatus = cursor.getString(cursor.getColumnIndex("status"))

                Log.d("sms data from db", recipientPhone + " " + smsText + "  " + smsStatus);

                val sms = SMSItem( number = recipientPhone, text = smsText, status = smsStatus, date = smsDate)

                smsList.add(sms)
            } while (cursor.moveToNext())
        }
        return smsList
    }

    // update single sms
    @RequiresApi(Build.VERSION_CODES.O)
    fun updateSMS(sms: SMSItem): Int {
        
        val db = this.writableDatabase
        
        // update the sms status
        val contentValues = ContentValues()
        contentValues.put(KEY_STATUS, sms.status)
        
        // update the sms timestamp

        val date = Calendar.getInstance().time
        val formatter = SimpleDateFormat.getDateTimeInstance() //or use getDateInstance()
        val formattedDate = formatter.format(date)

        contentValues.put(KEY_DATE, formattedDate)
        
        // execute update query
        val success = db.update(TABLE_CONTACTS, contentValues, "text=? AND phone=? AND status !=?", arrayOf(sms.text, sms.number, "SENT"))
        
        // close database connection
        db.close()
        
        return success
    }

    // delete all sms
    fun deleteAllSMS(): Int {

        val db = this.writableDatabase
        val success = db.delete(TABLE_CONTACTS, null, null)
        
        // close database connection
        db.close()

        return success
    }

    // delete single sms
    fun deleteSMS(sms: SMSItem): Int {
        
        val db = this.writableDatabase
        val success = db.delete(TABLE_CONTACTS, "phone=? AND status=?", arrayOf(sms.number, "FAILED"))
        
        // close database connection
        db.close()
        
        return success
    }

    // delete all FAILED sms
    fun deleteAllFailedSMS(): Int {

        val db = this.writableDatabase
        val success = db.delete(TABLE_CONTACTS, "status=?", arrayOf("FAILED"))
        
        // close database connection
        db.close()
        
        return success
    }

    // delete all PENDING SMS
    fun deleteAllPendingSMS(): Int {

        val db = this.writableDatabase
        val success = db.delete(TABLE_CONTACTS, "status=?", arrayOf("PENDING"))

        // close database connection
        db.close()

        return success
    }
}