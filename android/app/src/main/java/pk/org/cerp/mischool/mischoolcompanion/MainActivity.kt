package pk.org.cerp.mischool.mischoolcompanion

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.os.Handler
import android.support.v4.app.ActivityCompat
import android.support.v4.content.ContextCompat
import android.support.v7.app.AppCompatActivity
import android.support.v7.widget.CardView
import android.support.v7.widget.DividerItemDecoration
import android.support.v7.widget.LinearLayoutManager
import android.support.v7.widget.RecyclerView
import android.text.method.ScrollingMovementMethod
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import com.beust.klaxon.Klaxon
import java.io.File

const val TAG = "MISchool-Companion"
const val MY_PERMISSIONS_SEND_SMS = 1
const val LOG_FILE_NAME = "logFile.txt"
const val filename = "pending_messages.json"
private lateinit var db_handler: DatabaseHandler

class MainActivity : AppCompatActivity() {

    private var list: RecyclerView? = null
    private var adapter: SMSAdapter? = null
    var sms_array_list = arrayListOf<SMSItem>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // get database handler
        db_handler = DatabaseHandler(this)

        val intent = this.intent
        val data = intent.data
        val data_string = intent.dataString

        val textview_logs = findViewById<TextView>(R.id.logtext)
        val textview_sent = findViewById<TextView>(R.id.textViewsent)
        val textview_pending = findViewById<TextView>(R.id.textViewpending)
        val textview_failed = findViewById<TextView>(R.id.textView2failed)

        // ask for permissions
        getPermissions()

        sms_array_list = db_handler.get_messages(null)

        val log_messages = read_log_messages()

        textview_logs.text = log_messages
        textview_logs.movementMethod = ScrollingMovementMethod()

        list = findViewById(R.id.recyclerV)

        val layout_manager = LinearLayoutManager(this)
        layout_manager.reverseLayout = true
        layout_manager.stackFromEnd = true
        list!!.layoutManager = layout_manager

        adapter = SMSAdapter(this@MainActivity)
        list!!.addItemDecoration(DividerItemDecoration(list!!.context, layout_manager.orientation))
        list!!.adapter = adapter

        if(!SingletonServiceManager.isSMSServiceRunning) {

            val messages = db_handler.get_messages(SMSStatus.PENDING)

            if(messages.size > 0 && data == null && data_string == null) {

                adapter!!.notifyDataSetChanged()
                update_log_text("Starting service for ${messages.size} pending messages")
                startService(Intent(this@MainActivity, SMSDispatcherService::class.java))
            }
        }

        if(data !== null || data_string !=null) {
            // first stop the service if running so that pending messages sent with new intent
            stopServiceIfRunning()
        }

        val clearLogsButton = findViewById<Button>(R.id.clearLogButton)
        val showLogsButton = findViewById<Button>(R.id.showLogs)
        val shareLogsButton = findViewById<Button>(R.id.shareLogs)
        val resendFailedSMSButton = findViewById<Button>(R.id.button)

        clearLogsButton.setOnClickListener {

            if(textview_logs.visibility === View.VISIBLE) {
                textview_logs.visibility = View.GONE
                showLogsButton.text = "Show Logs"
            }

            textview_logs.text = ""
            sms_array_list.clear()
            db_handler.delete_messages()
            clear_log_messages()

            Toast.makeText(baseContext, "Logs cleared!", Toast.LENGTH_SHORT).show()
            adapter!!.notifyDataSetChanged()
        }

        showLogsButton.setOnClickListener{
               if(textview_logs.visibility === View.VISIBLE) {
                    textview_logs.visibility = View.GONE
                    showLogsButton.text = "Show Logs"
               } else {
                   textview_logs.visibility = View.VISIBLE
                   showLogsButton.text = "Hide Logs"
               }
        }

        shareLogsButton.setOnClickListener{

            val logs = read_log_messages()

            if(logs.isNotEmpty()) {

                val sendIntent: Intent = Intent().apply {
                    action = Intent.ACTION_SEND
                    putExtra(Intent.EXTRA_TEXT, logs)
                    type = "text/plain"
                }

                val shareIntent = Intent.createChooser(sendIntent, "Share SMS Logs")
                startActivity(shareIntent)

            } else {
                Toast.makeText(baseContext, "No logs to share!", Toast.LENGTH_SHORT).show()
            }
        }

        resendFailedSMSButton.setOnClickListener {

            val messages = db_handler.get_messages(SMSStatus.FAILED)

            if(messages.isNotEmpty()) {

                Toast.makeText(baseContext, "Resending ${messages.size} failed messages", Toast.LENGTH_SHORT).show()

                // delete failed sms so that in next try they don't duplicate in db
                db_handler.delete_messages(SMSStatus.FAILED)

                for (msg in messages) {
                    val sms_item = SMSItem(number = msg.number, text = msg.text, status = "PENDING", date = msg.date)

                    // add in the message
                    db_handler.add_message(sms_item)
                }

                // first stop the service if running so that pending messages don't sent again in new service
                stopServiceIfRunning()

                adapter!!.notifyDataSetChanged()
                update_log_text("Starting service for resend all messages")
                startService(Intent(this@MainActivity, SMSDispatcherService::class.java))
            } else {
                Toast.makeText(baseContext, "No message to resend!", Toast.LENGTH_SHORT).show()
            }
        }

        var sms_sent= 0
        var sms_total = sms_array_list.size
        var sms_pending = 0
        var sms_failed = 0

        for(sms in sms_array_list) {

            when {
                sms.status.equals(SMSStatus.SENT) -> {
                    sms_sent++
                }
                sms.status.equals(SMSStatus.PENDING) -> {
                    sms_pending++
                }
                sms.status.equals(SMSStatus.FAILED) -> {
                    sms_failed++
                }
            }
        }

        textview_sent.text = "Sent: $sms_sent"
        textview_pending.text = "Pending: $sms_pending"
        textview_failed.text = "Failed: $sms_failed"

        val handler = Handler()
        var pre_logged_text = read_log_messages()

        handler.postDelayed(object : Runnable {
            override fun run() {

            sms_array_list = db_handler.get_messages(null)

            Log.d("tryArrayListSize","in handler" + sms_array_list.size.toString())

            // add delay to see update from service
            handler.postDelayed(this, 2000)

            val logged_text = read_log_messages()

            if(pre_logged_text != logged_text) {
                updateLogText(logged_text)
                pre_logged_text = logged_text
            }

            sms_sent = 0
            sms_failed = 0
            sms_pending = 0

            for(sms in sms_array_list) {

                Log.d("SMS-Status", sms.status)

                when {
                    sms.status.equals(SMSStatus.SENT) -> {
                        sms_sent++
                    }
                    sms.status.equals(SMSStatus.PENDING) -> {
                        sms_pending++
                    }
                    sms.status.equals(SMSStatus.FAILED) -> {
                        sms_failed++
                    }
                }
            }

            sms_total = sms_array_list.size

            textview_sent.text = "Sent: $sms_sent"
            textview_pending.text = "Pending: $sms_pending"
            textview_failed.text = "Failed: $sms_failed"

            adapter!!.notifyDataSetChanged()
            }
        }, 2000)

        if(data == null || data_string == null) {
            return
        }

        val json_string = java.net.URLDecoder.decode(data_string.split("=")[1], "UTF-8")

        textview_logs.append(json_string)

        val parsed: SMSPayload? = Klaxon().parse(json_string)

        if(parsed === null || parsed.messages.isEmpty()) {
            return
        }

        val curr_date = get_timestamp()

        for(sms in parsed.messages) {
            val sms_item = SMSItem(number = sms.number, text = sms.text, status =  sms.status, date =  curr_date)
            db_handler.add_message(sms_item)
        }

        try {
            if(parsed.messages.isNotEmpty()) {
                update_log_text("Service is starting at: ${curr_date} for MIS")
                startService(Intent(this, SMSDispatcherService::class.java))
            }
        } catch(e: Exception) {
            Log.e(TAG, e.message)
        }

        finish()
    }

    override fun onDestroy() {
        super.onDestroy()
        // close the connection
        db_handler.close()
    }

    private fun stopServiceIfRunning() {
        if(SingletonServiceManager.isSMSServiceRunning && SingletonServiceManager.mCurrentService !=null) {
            SingletonServiceManager.isSMSServiceRunning = false
            SingletonServiceManager.mCurrentService.stopSelf()
        }
    }

    fun updateLogText(text: String) {

        runOnUiThread {
            run {
                val textview_logs = findViewById<TextView>(R.id.logtext)
                textview_logs.text = text
            }
        }
    }


    private  fun update_log_text(message: String) {

        val file = File(applicationContext.filesDir, LOG_FILE_NAME)

        Log.d(TAG, "Appending message to log file")

        val content = if(file.exists()) {
            val bytes = file.readBytes()
            message + "\n" + String(bytes)
        } else {
            message
        }

        file.writeBytes(content.toByteArray())

        Log.d(TAG, "DONE writing logs to file")

    }

    private fun read_log_messages(): String {

        val file = File(filesDir, LOG_FILE_NAME)

        return if(file.exists()) {
            val bytes = file.readBytes()
            String(bytes)
        } else {
            ""
        }
    }

    private fun clear_log_messages() {
        val file = File(filesDir, LOG_FILE_NAME)
        if(file.exists()) {
         file.delete()
       }
    }

    private inner class SMSAdapter(internal var context: Context): RecyclerView.Adapter<SMSAdapter.SMSViewHolder >() {

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SMSAdapter.SMSViewHolder  {
            val view = LayoutInflater.from(context).inflate(R.layout.model, parent, false)
            return SMSViewHolder (view)
        }

        @SuppressLint("ResourceAsColor")
        override fun onBindViewHolder(holder: SMSAdapter.SMSViewHolder, position: Int) {

            holder.messsage_card.text =sms_array_list[position].number+"\n"+sms_array_list[position].text

            if(!sms_array_list[position].status.equals(SMSStatus.SENT) && !sms_array_list[position].status.equals(SMSStatus.PENDING)){
                holder.resend.visibility =  View.VISIBLE
                holder.resendcard.visibility = View.VISIBLE
            } else {
                holder.resend.visibility =  View.GONE
                holder.resendcard.visibility = View.GONE
            }

            if(!sms_array_list[position].date.equals("-1")) {
                holder.date.text = sms_array_list[position].date
            }

            holder.status.text = sms_array_list[position].status

            when {
                sms_array_list[position].status.equals(SMSStatus.SENT) -> {
                    holder.status.setBackgroundResource(R.color.green)
                }
                sms_array_list[position].status.equals(SMSStatus.PENDING) -> {
                    holder.status.setBackgroundResource(R.color.gray)
                }
                sms_array_list[position].status.equals(SMSStatus.FAILED) -> {
                    holder.status.setBackgroundResource(R.color.red)
                }
            }

            holder.resend.setOnClickListener(View.OnClickListener {

                val curr_messsage = sms_array_list[position]

                db_handler.delete_message(curr_messsage)

                Toast.makeText(context,"Resending message to ${curr_messsage.status}",Toast.LENGTH_LONG).show()

                val sms_item = SMSItem(number = curr_messsage.number,text = curr_messsage.text, status =  SMSStatus.PENDING, date = curr_messsage.date)

                db_handler.add_message(sms_item)
                sms_array_list.remove(curr_messsage)

                // first stop the service if running so that pending messages don't sent again in new service
                stopServiceIfRunning()

                notifyDataSetChanged()
                update_log_text("Starting service for resending single message")
                startService(Intent(this@MainActivity, SMSDispatcherService::class.java))
            })
0
        }
        override fun getItemCount(): Int {
            return sms_array_list.size
        }

        inner class SMSViewHolder (itemView: View): RecyclerView.ViewHolder(itemView) {

            internal var messsage_card: TextView
            internal var resend: Button
            internal var resendcard: CardView
            internal var status: Button
            internal var date: TextView
            init {
                messsage_card = itemView.findViewById(R.id.tvSMS)
                date = itemView.findViewById(R.id.textView2)
                resend = itemView.findViewById(R.id.resendButton2)
                status = itemView.findViewById(R.id.resendButton)
                resendcard = itemView.findViewById(R.id.card3)
            }
        }
    }


    private fun getPermissions() {

        if(ContextCompat.checkSelfPermission(this@MainActivity, android.Manifest.permission.SEND_SMS) != PackageManager.PERMISSION_GRANTED ||
            ContextCompat.checkSelfPermission(this@MainActivity, android.Manifest.permission.READ_SMS) != PackageManager.PERMISSION_GRANTED ||
            ContextCompat.checkSelfPermission(this@MainActivity, android.Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
            // no permission granted
            ActivityCompat.requestPermissions(this@MainActivity, arrayOf(android.Manifest.permission.SEND_SMS, android.Manifest.permission.READ_SMS, android.Manifest.permission.READ_PHONE_STATE, android.Manifest.permission.WRITE_EXTERNAL_STORAGE), MY_PERMISSIONS_SEND_SMS)
        }
        else {
            Log.d(TAG, "Permissions has been granted!")
        }

    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        when(requestCode) {
            MY_PERMISSIONS_SEND_SMS -> {
                if((grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED)) {
                    Log.d(TAG, "PERMISSION GRANTED IN HERE")
                }
            }
        }
    }
}
