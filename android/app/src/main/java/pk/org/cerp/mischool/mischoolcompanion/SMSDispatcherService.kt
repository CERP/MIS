package pk.org.cerp.mischool.mischoolcompanion

import android.annotation.TargetApi
import android.app.*
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.IBinder
import android.support.annotation.RequiresApi
import android.support.v4.app.NotificationCompat
import android.support.v4.app.NotificationManagerCompat
import android.telephony.SmsManager
import android.util.Log
import java.io.File
import java.text.DateFormat
import java.util.*

class SMSDispatcherService : Service() {

    private var multipart_sms_counter = 0
    private var pending_messages_size = 0
    private var sent_sms_counter = 0

    private val notification_id = 777
    private val channel_id = "Progress Notification"
    private lateinit var notification_manager: NotificationManagerCompat
    private lateinit var notification: NotificationCompat.Builder

    private lateinit var db_handler: DatabaseHandler

    override fun onCreate() {
        super.onCreate()

        //Create a notification channel and manager
        create_notification_channel()
        notification_manager = NotificationManagerCompat.from(this)
    }

    @TargetApi(Build.VERSION_CODES.O)
    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN)
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {

        // get database connect
        db_handler = DatabaseHandler(this)

        // Call notification builder
        notification_builder()

        //Initial Alert
        notification_manager.notify(notification_id, notification.build())

        Thread(Runnable {
            kotlin.run {
                prepareSendingSms()
            }

            notification.setContentText("SMS sending has been completed. Sent $pending_messages_size")
                    .setProgress(0, 0, false)
                    .setOngoing(false)
            notification_manager.notify(notification_id, notification.build())

        }).start()

        update_log_text("Service has been started")
        SingletonServiceManager.isSMSServiceRunning = true

        // start sticky service
        return START_STICKY
    }

    override fun onBind(p0: Intent?): IBinder? {
        TODO("not implemented")
    }

    override fun onDestroy() {
        super.onDestroy()
        update_log_text("Service has been destroyed in onDestroy")
        SingletonServiceManager.isSMSServiceRunning = false

        db_handler.close()

        // restarting the service when the user killed the app
//        val broadcastIntent = Intent(this, SMSRestarterBroadcastReceiver::class.java)
//        sendBroadcast(broadcastIntent)
    }

    override fun onTaskRemoved(rootIntent: Intent?) {
        super.onTaskRemoved(rootIntent)
//        val broadcastIntent = Intent(this, SMSRestarterBroadcastReceiver::class.java)
//        sendBroadcast(broadcastIntent)
        update_log_text("Service has been destroyed in onTaskRemoved")
        SingletonServiceManager.isSMSServiceRunning = false
    }

    private fun prepareSendingSms() {

        return try {

            val messages = db_handler.get_messages(SMSStatus.PENDING)
            this.pending_messages_size = messages.size

            // send all pending messages
            sendBatchSMS(messages)

        } catch(e: Exception) {
            e.printStackTrace()
        } finally {
            Log.d(TAG, "Done sending messages!")
        }
    }

    private fun sendBatchSMS(messages: List<SMSItem>) {
        for(message in messages) {
            sendSMS(message)
            // put delay for next SMS
            Thread.sleep(6_000)
        }
    }

    private fun sendSMS(sms: SMSItem) {

        try {

            val sms_manager = SmsManager.getDefault();

            val messages = sms_manager.divideMessage(replace_utf8_chars_with_special_chars(sms.text))
            Log.d(TAG, "size of messages: ${messages.size}")

            val currentTime = DateFormat.getDateTimeInstance().format(Date())
            val sentPI = PendingIntent.getBroadcast(this, 0, Intent("SENT"), 0)

            val broadCastReceiver = object: BroadcastReceiver() {
                @RequiresApi(Build.VERSION_CODES.O)
                override fun onReceive(contxt: Context?, intent: Intent?) {
                    
                    unregisterReceiver(this)

                    when (resultCode) {
                        Activity.RESULT_OK -> {
                            sms.status = SMSStatus.SENT
                            
                            update_log_text("Message: ${sms.number}-${SMSStatus.SENT}-$currentTime")

                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                                notification.setContentText("SMS sending  ${++sent_sms_counter} of ${pending_messages_size}. Sent ${sms.number}")
                                notification_manager.notify(notification_id, notification.build())
                            }

                            db_handler.update_message(sms)
                        }
                        else -> {
                            sms.status = SMSStatus.FAILED
                            
                            update_log_text("Message: ${sms.number}-${SMSStatus.FAILED}-$currentTime")

                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                                notification.setContentText("SMS sending  ${++sent_sms_counter} of ${pending_messages_size}. Failed  ${sms.number}")

                            }
                            db_handler.update_message(sms)
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
                // so next chunk of messages after the total 4000 * message.size - 4000
                // also this helps to avoid android system warnings
                Thread.sleep((messages.size * 4000 - (4_000)).toLong())

                sms_manager.sendMultipartTextMessage(sms.number, null, messages, plist, null)
                update_log_text("Multipart SMS count: ${multipart_sms_counter}")
                update_log_text("Multipart SMS(${messages.size}): ${sms.number}-${sms.status}-$currentTime")

            } else {
             sms_manager.sendTextMessage(sms.number, null, sms.text, sentPI, null)
                update_log_text("SMS: ${sms.number}-${sms.status}-$currentTime")
            }

            registerReceiver(broadCastReceiver, IntentFilter("SENT"))

        } catch( e: Exception) {
            Log.d(TAG, e.message)
            val currentTime = DateFormat.getDateTimeInstance().format(Date())
            update_log_text("ERROR: ${sms.number}-${sms.text}-${sms.status}-$currentTime")
        }
    }

    private  fun writeMessageToLogFile(message: String) {

        val file = File(applicationContext.filesDir, "$LOG_FILE_NAME")

        Log.d(TAG, "Appending messages to log file in service")

        var content = if(file.exists()) {
            val bytes = file.readBytes()
            message + "\n" + String(bytes)
        } else {
            message
        }

        file.writeBytes(content.toByteArray())

        Log.d(TAG, "DONE writing")

    }

    private fun update_log_text(text : String) {
        // here we'll write logs to a file
        // on the ui we'll read the file and display it
        try {
            writeMessageToLogFile(text)
        }
        catch (e : Exception) {
            Log.e(TAG, e.message)
        }
    }

    // Check if the Android version is greater than 8. (Android Oreo)
    private fun create_notification_channel() {
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

    private fun notification_builder() {

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            //Sets the maximum progress as 100
            val progress_max = 100
            //Creating a notification and setting its various attributes
            notification = NotificationCompat.Builder(this, channel_id)
                    .setSmallIcon(R.mipmap.ic_android)
                    .setContentTitle("MISchool SMS Companion")
                    .setContentText("Starting sending SMS")
                    .setPriority(NotificationCompat.PRIORITY_HIGH)
                    .setOngoing(true)
                    .setOnlyAlertOnce(true)
                    .setProgress(progress_max, 0, true)
                    .setAutoCancel(true)
        }
    }

}