package pk.org.cerp.mischool.mischoolcompanion

import android.annotation.TargetApi
import android.app.Activity
import android.app.PendingIntent
import android.app.Service
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.Uri
import android.os.Build
import android.os.IBinder
import android.provider.Telephony
import android.support.annotation.RequiresApi
import android.telephony.SmsManager
import android.util.Log
import com.beust.klaxon.Klaxon
import java.io.File
import java.text.DateFormat
import java.util.*

class SMSDispatcherService : Service() {

    companion object {
        const val SENT_KEY = "SENT"
        const val PENDING_KEY = "PENDING"
        const val FAILED_KEY = "FAILED"
    }

    override fun onCreate() {
        super.onCreate()
        Log.d("tryStartService","on create called")
    }

    @TargetApi(Build.VERSION_CODES.O)
    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN)
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Thread(Runnable {
            kotlin.run {
                prepareSendingSms()
            }
        }).start()
        return Service.START_STICKY
    }

    override fun onBind(p0: Intent?): IBinder? {
        TODO("not implemented")
    }

    private fun prepareSendingSms() {

        return try {

            Log.d(TAG, "doing run job using service")

            val pending = readMessagesFromFile()
            val num_messages = pending.size

            val history = messageHistory()
            val last_min_messages = history.first
            val last_15_min_messages = history.second
            val max_per_minute = 30 // this should be variable depending on android version
            val max_per_pta_rule = 12
            val max_sendable = max_per_minute - last_min_messages

            Log.d(TAG, "${pending.size} items queued")
            updateLogText("Pending: ${pending.size} items queued")


            // we assume that sending messages will not error for now.
            // because when they do error they tend to show up in the messages app for manual retry
            Log.d("tryMMessage", "max = $max_per_minute last min msgs = $last_min_messages current msgs = $num_messages")

            val nextList = when {

                last_min_messages > max_per_minute -> {
                    Log.d(TAG, "too many messages sent last minute. waiting until next round")
                    pending
                }
                (last_min_messages + num_messages) < max_per_minute -> {
                    Log.d(TAG, "sending all messages right now")
                    Log.d("tryMMessage", "sending all messages right now")
                    sendBatchSMS(pending)
                    emptyList<SMSItem>()
                }
                (last_15_min_messages + num_messages) in 30..185 -> {
                    // we don't need to worry about the pta rule, so fire off max per minute this round.
                    Log.d("tryMMessage", "between 30 and 185")
                    Log.d(TAG, "between 30 and 185 messages")
                    sendBatchSMS(pending.take(max_sendable))
                    pending.drop(max_sendable)
                }
                (num_messages + last_15_min_messages) > 200 -> {
                    Log.d("tryMMessage", "Snum + last 15")
                    // fire the messages off at a rate that cares about the pta limit (200 / 15 min) 12 per minute...
                    sendBatchSMS(pending.take(max_per_pta_rule))
                    pending.drop(max_per_pta_rule)
                }
                else -> {
                    Log.d(TAG, "unforseen combination of numbers. last_min: $last_min_messages, 15 min: $last_15_min_messages, pending: $num_messages")
                    sendBatchSMS(pending.take(max_sendable))
                    pending.drop(max_sendable)
                }
            }

            // write message to file
            writeMessagesToFile(nextList)

        } catch(e: Exception) {
            e.printStackTrace()
        } finally {
            Log.d(TAG, "done sending messages!")
        }
    }

    private fun sendBatchSMS(messages: List<SMSItem>) {
        for(message in messages) {
            Log.d(TAG, "send " + message.text + " to " + message.number)
            sendSMS(message)
            Thread.sleep(1000)
        }
    }

    private fun sendSMS(sms: SMSItem) {

        try {

            val smsManager = SmsManager.getDefault();

            val messages = smsManager.divideMessage(replaceUTF8CharsWithSpecialChars(sms.text))
            Log.d(TAG, "size of messages: ${messages.size}")

            val currentTime = DateFormat.getDateTimeInstance().format(Date())
            val sentPI = PendingIntent.getBroadcast(this, 0, Intent("SENT"), 0)
            val databaseHandler: DatabaseHandler = DatabaseHandler(this)

            val broadCastReceiver = object: BroadcastReceiver() {
                @RequiresApi(Build.VERSION_CODES.O)
                override fun onReceive(contxt: Context?, intent: Intent?) {
                    
                    unregisterReceiver(this)

                    when (resultCode) {
                        Activity.RESULT_OK -> {
                            sms.status = SENT_KEY
                            databaseHandler.updateSMS(sms)
                        }
//                        SmsManager.RESULT_ERROR_GENERIC_FAILURE -> {
//                            sms.status = FAILED_KEY
//                            databaseHandler.updateSMS(sms)
//                        }
//                        SmsManager.RESULT_ERROR_NO_SERVICE -> {
//                            sms.status = FAILED_KEY
//                            databaseHandler.updateSMS(sms)
//                        }
//                        SmsManager.RESULT_ERROR_NULL_PDU -> {
//                            sms.status = FAILED_KEY
//                            databaseHandler.updateSMS(sms)
//                        }
//                        SmsManager.RESULT_ERROR_RADIO_OFF -> {
//                            sms.status = FAILED_KEY
//                            databaseHandler.updateSMS(sms)
//                        }
                        else -> {
                            sms.status = FAILED_KEY
                            databaseHandler.updateSMS(sms)
                        }
                    }
                }
            }

            registerReceiver(broadCastReceiver, IntentFilter("SENT"))

            if(messages.size > 1) {
                Log.d("trySend", "SENDING MULTIPART")

                var plist = arrayListOf<PendingIntent>()
                for (i in 0 until messages.size) {
                    plist.add(sentPI)
                }
                smsManager.sendMultipartTextMessage(sms.number, null, messages, plist, null)
                updateLogText("Message: ${sms.number}-${sms.text}-${sms.status}-$currentTime")
                
            } else {

                val msgText = replaceUTF8CharsWithSpecialChars(sms.text)

                smsManager.sendTextMessage(sms.number, null, msgText, sentPI, null)
                updateLogText("Message: ${sms.number}-${sms.text}-${sms.status}-$currentTime")
            }

        } catch( e: Exception) {
            Log.d(TAG, e.message)
            val currentTime = DateFormat.getDateTimeInstance().format(Date())
            updateLogText("ERROR: ${sms.number}-${sms.text}-${sms.status}-$currentTime")
        }
    }

    private  fun messageHistory() : Pair<Int, Int> {

        val unixTime = System.currentTimeMillis()

        try {

            val minTime = unixTime - (15 * 60 * 1000)
            val cursor = this.applicationContext.contentResolver.query(
                    Uri.parse("content://sms/sent"),
                    arrayOf("date"),
                    "date > $minTime",
                    null,
                    null
            )


            return if (cursor.moveToFirst()) {

                var messages_past_minute = 0
                var messages_past_15_minute = 0

                do {

                    val date = cursor.getLong(cursor.getColumnIndex("date"))
                    val diff = (unixTime - date) / 1000L

                    if(diff <= 60) messages_past_minute++

                    messages_past_15_minute++

                } while (cursor.moveToNext())

                return Pair(messages_past_minute, messages_past_15_minute)
            } else {
                Log.d(TAG, "couldnt move to first...")
                return Pair(0, 0)
            }
        } catch(e : Exception) {
            Log.e(TAG, e.message)
            return Pair(0, 0)
        }
    }

    private fun readMessagesFromFile(): List<SMSItem> {

        Log.d(TAG, "appending messages to file.....")

        val file = File(applicationContext.filesDir, "$filename")

        var content : String? = null

        if(file.exists()) {
            val bytes = file.readBytes()
            content = String(bytes)
            Log.d("tryWriteMsgToFile","content of pending messages is $content")
        }

        return if(content == null) emptyList<SMSItem>() else Klaxon().parseArray<SMSItem>(content).orEmpty()
    }

    private  fun writeMessageToLogFile(message: String) {

        val file = File(applicationContext.filesDir, "$logFileName")

        Log.d(TAG, "appending messages to log file.....")

        var content = if(file.exists()) {
            val bytes = file.readBytes()
            String(bytes) + "\n" + message
        } else {
            message
        }

        file.writeBytes(content.toByteArray())

        Log.d(TAG, "DONE writing")

    }

    private fun writeMessagesToFile(messages: List<SMSItem>) {

        val file = File(applicationContext.filesDir, "$filename")
        Log.d(TAG, "messages length is ${messages.size}")
        val res = Klaxon().toJsonString(messages)
        file.writeBytes(res.toByteArray())

        Log.d(TAG, "DONE  writing file")
    }

    private fun updateLogText(text : String) {
        // here we'll write logs to a file
        // on the ui we'll read the file and display it
        try {
            writeMessageToLogFile(text)
        }
        catch (e : Exception) {
            Log.e(TAG, e.message)
        }
    }

}