package pk.org.cerp.mischool.mischoolcompanion

import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.v4.app.ActivityCompat
import android.support.v4.content.ContextCompat
import android.telephony.SmsManager
import android.util.Log
import android.widget.Toast
import com.beust.klaxon.Klaxon
import com.evernote.android.job.util.support.PersistableBundleCompat
import java.io.File
import kotlin.Exception

const val TAG = "MISchool-Companion"
const val MY_PERMISSIONS_SEND_SMS = 1
const val filename = "pending_messages.json"

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val intent = this.intent

        val data = intent.data
        val dataString = intent.dataString

        permissions()

        Log.d(TAG, "HELLOOOO")
        Log.d(TAG, intent.action)

        if(data == null || dataString == null) {
            return
        }

        Log.d(TAG, "scheduling....")
        try {
            SMSJob.scheduleJob()
        }
        catch(e : Exception) {
            Log.e(TAG, e.message)
        }

        Log.d(TAG, dataString)

        val json_string = java.net.URLDecoder.decode(dataString.split("=")[1], "UTF-8")
        Log.d(TAG, json_string)

        val parsed : SMSPayload? = Klaxon().parse(json_string)

        if(parsed == null) {
            return
        }

        // open file, append messages and quit
        // task which runs every minute will consume from here
        // do I need to acquire a lock on this file?

        try {
            appendMessagesToFile(parsed.messages)
        }
        catch(e : Exception){
            Log.e(TAG, e.message)
            Log.e(TAG, e.toString())
        }

        finish()

    }

    fun appendMessagesToFile( messages : List<SMSItem>) {

        // first read the file as json

        Log.d(TAG, "appending messages to file.....")

        val path = filesDir
        val file = File(path, filename)

        Log.d(TAG, file.absolutePath)

        var content : String? = null

        /*
        if(file.exists()) {
            file.delete()
        }
        */

        if(file.exists()) {
            val bytes = file.readBytes()
            content = String(bytes)
            Log.d(TAG,"content of pending messages is $content")
        }

        val new_list = if(content == null) {
            messages
        } else {
            val parsed = Klaxon().parseArray<SMSItem>(content)

            parsed.orEmpty() + messages
        }

        Log.d(TAG, "new list is $new_list")

        val res = Klaxon().toJsonString(new_list)
        file.writeBytes(res.toByteArray())

        Log.d(TAG, "DONE writing")

    }


    fun permissions() {


        if(ContextCompat.checkSelfPermission(this@MainActivity, android.Manifest.permission.SEND_SMS) != PackageManager.PERMISSION_GRANTED ||
           ContextCompat.checkSelfPermission(this@MainActivity, android.Manifest.permission.READ_SMS) != PackageManager.PERMISSION_GRANTED ) {
          // ContextCompat.checkSelfPermission(this@MainActivity, android.Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            // no permission granted
            ActivityCompat.requestPermissions(this@MainActivity, arrayOf(android.Manifest.permission.SEND_SMS, android.Manifest.permission.READ_SMS), MY_PERMISSIONS_SEND_SMS)

        }
        else {
            Log.d(TAG, "Permissions are granted...")
        }
    }

    fun sendAllSMS(messages : List<SMSItem>) {
        for(p in messages) {
            Log.d(TAG, "send " + p.text + " to " + p.number)
            sendSMS(p.text, p.number)
            Thread.sleep(100)
        }

        Toast.makeText(applicationContext, messages.size.toString() + " messages Sent", Toast.LENGTH_SHORT).show()

    }

    fun sendSMS(text: String, phoneNumber: String) {
        try {

            // check permission first
            val smsManager = SmsManager.getDefault();
            smsManager.sendTextMessage(phoneNumber, null, text, null, null)

            //Toast.makeText(applicationContext, "Message Sent", Toast.LENGTH_SHORT).show()
        } catch( e: Exception) {
            Log.d(TAG, e.message)
        }

    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        when(requestCode) {
            MY_PERMISSIONS_SEND_SMS -> {
                if((grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED)) {
                    Log.d(TAG, "PERMISSION GRANTED IN HERE");
                }
            }
        }
    }
}
