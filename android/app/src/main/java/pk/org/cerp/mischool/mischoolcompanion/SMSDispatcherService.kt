package pk.org.cerp.mischool.mischoolcompanion

import android.annotation.TargetApi
import android.app.*
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.icu.util.UniversalTimeScale.toLong
import android.net.Uri
import android.os.Build
import android.os.IBinder
import android.support.annotation.RequiresApi
import android.support.v4.app.NotificationCompat
import android.support.v4.app.NotificationManagerCompat
import android.telephony.SmsManager
import android.util.Log
import com.beust.klaxon.Converter
import com.beust.klaxon.Klaxon
import java.io.File
import java.text.DateFormat
import java.util.*

class SMSDispatcherService : Service() {

    private var multipart_sms_counter = 0
    private var num_messages = 0
    private var sent_sms_counter = 0
    private val notification_id = 777
    private val channel_id = "Progress Notification" as String
    private lateinit var notification_manager: NotificationManagerCompat
    private lateinit var notification: NotificationCompat.Builder

    companion object {
        const val SENT_KEY = "SENT"
        const val PENDING_KEY = "PENDING"
        const val FAILED_KEY = "FAILED"
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannels()
        Log.d("tryStartService","on create called")

        //Create a Notification Manager
        notification_manager = NotificationManagerCompat.from(this)
    }

    @TargetApi(Build.VERSION_CODES.O)
    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN)
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {

        // Call notification builder
        notificationBuilder(intent)

        //Initial Alert
        notification_manager.notify(1, notification.build())

        Thread(Runnable {
            kotlin.run {
                prepareSendingSms()
            }

            notification.setContentText("SMS sending has been completed!")
                    .setProgress(0, 0, false)
                    .setOngoing(false)
            notification_manager.notify(1, notification.build())

        }).start()

        updateLogText("Service has been start")
        SingletonServiceManager.isSMSServiceRunning = true

        // start sticky service
        return START_STICKY
    }

    override fun onBind(p0: Intent?): IBinder? {
        TODO("not implemented")
    }

    override fun onDestroy() {
        super.onDestroy()
        updateLogText("Service has been destroyed")
        SingletonServiceManager.isSMSServiceRunning = false
    }

    private fun prepareSendingSms() {

        return try {

            Log.d(TAG, "doing run job using service")

            val pending = readMessagesFromFile()

            num_messages = pending.size

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

            notification.setContentText("SMS sending  ${++sent_sms_counter} of ${num_messages}")
            notification_manager.notify(1, notification.build())

            sendSMS(message)
            Thread.sleep(8_000)
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
                            updateLogText("Message: ${sms.number}-${SENT_KEY}-$currentTime")
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
                            updateLogText("Message: ${sms.number}-${FAILED_KEY}-$currentTime")
                            databaseHandler.updateSMS(sms)
                        }
                    }
                }
            }

            if(messages.size > 1) {

                multipart_sms_counter += messages.size

                Log.d("trySend", "SENDING MULTIPART")

                var plist = arrayListOf<PendingIntent>()

                for (i in 0 until messages.size) {
                    plist.add(sentPI)
                }

                // this is to make sure, if a message broken down to multiple messages
                // to avoid the PTA restriction, sleep for 4000 fo each message
                // so next chunk of messages after the total 4000 * message.size - 8000
                Thread.sleep((messages.size * 4000 - (4_000)).toLong())

                smsManager.sendMultipartTextMessage(sms.number, null, messages, plist, null)
                updateLogText("Multipart SMS count: ${multipart_sms_counter}")
                updateLogText("Multipart Message(${messages.size}): ${sms.number}-${sms.status}-$currentTime")

            } else {
             smsManager.sendTextMessage(sms.number, null, sms.text, sentPI, null)
                updateLogText("Message: ${sms.number}-${sms.status}-$currentTime")
            }
            registerReceiver(broadCastReceiver, IntentFilter("SENT"))

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
            message + "\n" + String(bytes)
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

    //Check if the Android version is greater than 8. (Android Oreo)
    private fun createNotificationChannels(){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                    channel_id,
                    "Progress Notification",
                    //IMPORTANCE_HIGH = shows a notification as peek notification.
                    //IMPORTANCE_LOW = shows the notification in the status bar.
                    NotificationManager.IMPORTANCE_HIGH
            )
            channel.description = "Progress Notification Channel"
            val manager = getSystemService(
                    NotificationManager::class.java
            )
            manager.createNotificationChannel(channel)
        }
    }

    private fun notificationBuilder(intent: Intent?) {

        //Sets the maximum progress as 100
        val progressMax = 100
        //Creating a notification and setting its various attributes
        notification = NotificationCompat.Builder(this, channel_id)
                .setSmallIcon(R.mipmap.ic_android)
                .setContentTitle("MISchool Companion")
                .setContentText("Starting sending SMS")
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setOngoing(true)
                .setOnlyAlertOnce(true)
                .setProgress(progressMax, 0, true)
                .setAutoCancel(true)
    }

}