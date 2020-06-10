package pk.org.cerp.mischool.mischoolcompanion

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import android.content.ContentValues
import android.database.Cursor
import android.database.sqlite.SQLiteException
import android.os.Build
import android.provider.Telephony
import android.support.annotation.RequiresApi
import android.util.Log
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

//creating the database logic, extending the SQLiteOpenHelper base class
class DatabaseHandler(context: Context): SQLiteOpenHelper(context,DATABASE_NAME,null,DATABASE_VERSION) {
    companion object {
        private val DATABASE_VERSION = 1
        private val DATABASE_NAME = "SMSDatabase"
        private val TABLE_CONTACTS = "SMSTable"
        private val KEY_ID = "id"
        private val KEY_TEXT = "text"
        private val KEY_NO = "no"
        private val KEY_DATE = "date"
        private val KEY_STATUS = "status"
    }
    override fun onCreate(db: SQLiteDatabase?) {
        // TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
        //creating table with fields
        val CREATE_CONTACTS_TABLE = ("CREATE TABLE " + TABLE_CONTACTS + "("
                + KEY_ID + " INTEGER PRIMARY KEY," + KEY_TEXT + " TEXT,"+ KEY_DATE + " TEXT,"
                + KEY_NO + " TEXT,"+ KEY_STATUS + " TEXT" + ")")
        db?.execSQL(CREATE_CONTACTS_TABLE)
    }

    override fun onUpgrade(db: SQLiteDatabase?, oldVersion: Int, newVersion: Int) {
        //  TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
        db!!.execSQL("DROP TABLE IF EXISTS " + TABLE_CONTACTS)
        onCreate(db)
    }


    //method to insert data
    fun addSms(emp: SMSItem):Long{
        val db = this.writableDatabase
        val contentValues = ContentValues()
        contentValues.put(KEY_TEXT, emp.text) // EmpModelClass Name
        contentValues.put(KEY_NO,emp.number )
        contentValues.put(KEY_STATUS,emp.status )
        contentValues.put(KEY_DATE,emp.date )// EmpModelClass Phone
        // Inserting Row
        val success = db.insert(TABLE_CONTACTS, null, contentValues)
        //2nd argument is String containing nullColumnHack
        db.close() // Closing database connection
        return success
    }
    //method to read data
    fun viewAllSms():ArrayList<SMSItem>{
        val empList:ArrayList<SMSItem> = ArrayList<SMSItem>()
        val selectQuery = "SELECT  * FROM $TABLE_CONTACTS"
        val db = this.readableDatabase
        var cursor: Cursor? = null
        try{
            cursor = db.rawQuery(selectQuery, null)
        }catch (e: SQLiteException) {
            db.execSQL(selectQuery)
            return ArrayList()
        }
        var userId: Int
        var userNo: String
        var userText: String
        var status: String
        var date: String

        if (cursor.moveToFirst()) {
            do {
                userId = cursor.getInt(cursor.getColumnIndex("id"))
                userNo = cursor.getString(cursor.getColumnIndex("no"))
                userText = cursor.getString(cursor.getColumnIndex("text"))
                date = cursor.getString(cursor.getColumnIndex("date"))
                status = cursor.getString(cursor.getColumnIndex("status"))
                Log.d("tryDB", userNo+"  "+userText+"  "+status);
                val emp= SMSItem( number = userNo,text=userText,status = status,date = date)
                empList.add(emp)
            } while (cursor.moveToNext())
        }
        return empList
    }

    fun getAllFailedSms():ArrayList<SMSItem>{
        val empList:ArrayList<SMSItem> = ArrayList<SMSItem>()
        val selectQuery = "SELECT  * FROM $TABLE_CONTACTS where status='Failed'"
        val db = this.readableDatabase
        var cursor: Cursor? = null
        try{
            cursor = db.rawQuery(selectQuery, null)
        }catch (e: SQLiteException) {
            db.execSQL(selectQuery)
            return ArrayList()
        }
        var userId: Int
        var userNo: String
        var userText: String
        var status: String
        var date:String
        if (cursor.moveToFirst()) {
            do {
                userId = cursor.getInt(cursor.getColumnIndex("id"))
                userNo = cursor.getString(cursor.getColumnIndex("no"))
                userText = cursor.getString(cursor.getColumnIndex("text"))
                status = cursor.getString(cursor.getColumnIndex("status"))
                date = cursor.getString(cursor.getColumnIndex("date"))
                Log.d("tryDB", userNo+"  "+userText+"  "+status);
                val emp= SMSItem( number = userNo,text=userText,status = status)
                empList.add(emp)
            } while (cursor.moveToNext())
        }
        return empList
    }
    //method to update data
    @RequiresApi(Build.VERSION_CODES.O)
    fun updateSms(emp: SMSItem):Int{
        val db = this.writableDatabase
        val contentValues = ContentValues()
        contentValues.put(KEY_STATUS, emp.status)
        // EmpModelClass Name
        val currentDateTime = LocalDateTime.now()
        val cdate = currentDateTime.format(DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm a"))
        contentValues.put(KEY_DATE, cdate)
        // Updating Row
        Log.d("tryDate",emp.date)
      //  if(!emp.date.equals("-1")) {
        val success = db.update(TABLE_CONTACTS, contentValues, "text='" + emp.text + "' AND no='" + emp.number + "'" + " AND status !='" + "SENT" + "'", null)
        db.close() // Closing database connection
        return success
//        }
//
//        val success = db.update(TABLE_CONTACTS, contentValues, "text='" + emp.text + "' AND no='" + emp.number + "'", null)
//        //2nd argument is String containing nullColumnHack
//        db.close() // Closing database connection
//        return success
    }
    //method to delete data
    fun deleteAllSMs():Int{
        val db = this.writableDatabase
//        val contentValues = ContentValues()
//        contentValues.put(KEY_ID, emp.userId) // EmpModelClass UserId
//        // Deleting Row
        val success = db.delete(TABLE_CONTACTS,null,null)
        //2nd argument is String containing nullColumnHack
        db.close() // Closing database connection
        return success
    }

    fun deleteSMs(itm:SMSItem):Int{
        val db = this.writableDatabase
//        val contentValues = ContentValues()
//        contentValues.put(KEY_ID, emp.userId) // EmpModelClass UserId
//        // Deleting Row
        val success = db.delete(TABLE_CONTACTS,"text='"+itm.text+"' AND no='"+itm.number+ "' AND status ='" + "Failed" + "'",null)
        //2nd argument is String containing nullColumnHack
        db.close() // Closing database connection
        return success
    }

    fun deleteAllFailedSMs():Int{
        val db = this.writableDatabase
//        val contentValues = ContentValues()
//        contentValues.put(KEY_ID, emp.userId) // EmpModelClass UserId
//        // Deleting Row
        val success = db.delete(TABLE_CONTACTS,"status ='Failed'",null)
        //2nd argument is String containing nullColumnHack
        db.close() // Closing database connection
        return success
    }
}