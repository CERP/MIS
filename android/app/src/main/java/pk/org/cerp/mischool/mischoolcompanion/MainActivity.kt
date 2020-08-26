package pk.org.cerp.mischool.mischoolcompanion

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.support.annotation.RequiresApi
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
import java.text.SimpleDateFormat
import java.util.*

const val TAG = "MISchool-Companion"
const val MY_PERMISSIONS_SEND_SMS = 1
const val filename = "pending_messages.json"
const val logFileName = "logFile.txt"

class MainActivity : AppCompatActivity() {

    private var list: RecyclerView? = null
    private var recyclerAdapter: SMSAdapter? = null
    var arraylist = arrayListOf<SMSItem>()

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val intent = this.intent
        val data = intent.data
        val dataString = intent.dataString

        val textview_logs = findViewById<TextView>(R.id.logtext)
        val textview_sent = findViewById<TextView>(R.id.textViewsent)
        val textview_pending = findViewById<TextView>(R.id.textViewpending)
        val textview_failed = findViewById<TextView>(R.id.textView2failed)

        // ask for permissions
        getPermissions()

        val logMessages = readLogMessages()
        val databaseHandler: DatabaseHandler = DatabaseHandler(this)
        arraylist = databaseHandler.getAllSMS()

        textview_logs.text = logMessages
        textview_logs.movementMethod = ScrollingMovementMethod()

        list = findViewById<RecyclerView>(R.id.recyclerV)

        val layoutManager = LinearLayoutManager(this)
        layoutManager.reverseLayout = true
        layoutManager.stackFromEnd = true
        list!!.layoutManager = layoutManager

        recyclerAdapter = SMSAdapter(this@MainActivity)
        list!!.addItemDecoration(DividerItemDecoration(list!!.context, layoutManager.orientation))
        list!!.adapter = recyclerAdapter

        val clearLogsButton = findViewById<Button>(R.id.clearLogButton)
        val showLogsButton = findViewById<Button>(R.id.showLogs)
        val shareLogsButton = findViewById<Button>(R.id.shareLogs)
        val resendFailedSMSButton = findViewById<Button>(R.id.button)

        clearLogsButton.setOnClickListener {

            if(textview_logs.visibility === View.VISIBLE) {
                textview_logs.visibility = View.GONE
                showLogsButton.text = "Show Logs"
            }

            clearLogMessages()
            clearPendingMessages()
            databaseHandler.deleteAllSMS()
            textview_logs.text = ""
            arraylist.clear()

            Toast.makeText(baseContext, "Logs cleared!", Toast.LENGTH_SHORT).show()
            recyclerAdapter!!.notifyDataSetChanged()
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

            val logs = readLogMessages()

            val sendIntent: Intent = Intent().apply {
                action = Intent.ACTION_SEND
                putExtra(Intent.EXTRA_TEXT, logs)
                type = "text/plain"
            }

            val shareIntent = Intent.createChooser(sendIntent, "Share SMS Logs")
            startActivity(shareIntent)
        }

        resendFailedSMSButton.setOnClickListener {

            val failedMessages = databaseHandler.getAllFailedSMS()
            val failedMessagesSize = failedMessages.size

            if(failedMessagesSize > 0) {

                Toast.makeText(baseContext, "resending $failedMessagesSize failed sms", Toast.LENGTH_SHORT).show()

                // delete failed sms so that in next try they don't duplicate in db
                databaseHandler.deleteAllFailedSMS()

                val databaseHandler: DatabaseHandler = DatabaseHandler(baseContext)
                for (msg in failedMessages) {
                    databaseHandler.addSMS(SMSItem(number = msg.number, text = msg.text, status = msg.status, date = msg.date))
                }

                // appending failed sms to file
                appendMessagesToFile(failedMessages)

                recyclerAdapter!!.notifyDataSetChanged()
                startService(Intent(this@MainActivity, SMSDispatcherService::class.java))
            } else {
                Toast.makeText(baseContext, "No sms to resend", Toast.LENGTH_SHORT).show()
            }
        }

        var sms_sent= 0
        var sms_total = arraylist.size
        var sms_pending = 0
        var sms_failed = 0

        for(sms in arraylist) {

            when {
                sms.status.equals("SENT") -> {
                    sms_sent++
                }
                sms.status.equals("PENDING") -> {
                    sms_pending++
                }
                sms.status.equals("FAILED") -> {
                    sms_failed++
                }
            }
        }


        textview_sent.text = "Sent: $sms_sent"
        textview_pending.text = "Pending: $sms_pending"
        textview_failed.text = "Failed: $sms_failed"

        val handler = Handler()
        var pre_logged_text = readLogMessages()

        handler.postDelayed(object : Runnable {
            override fun run() {

                arraylist = databaseHandler.getAllSMS()

                Log.d("tryArrayListSize","in handler" + arraylist.size.toString())

                // add delay in sms sending
                handler.postDelayed(this, 2000)
                
                val logged_text = readLogMessages()

                if(pre_logged_text != logged_text) {
                    updateLogText(logged_text)
                    pre_logged_text = logged_text
                }

                sms_sent = 0
                sms_failed = 0
                sms_pending = 0

                for(sms in arraylist) {
                    
                    Log.d("SMS-Status", sms.status)

                    when {
                        sms.status.equals("SENT") -> {
                            sms_sent++
                        }
                        sms.status.equals("PENDING") -> {
                            sms_pending++
                        }
                        sms.status.equals("FAILED") -> {
                            sms_failed++
                        }
                    }
                }

                sms_total = arraylist.size

                textview_sent.text = "Sent: $sms_sent"
                textview_pending.text = "Pending: $sms_pending"
                textview_failed.text = "Failed: $sms_failed"

                recyclerAdapter!!.notifyDataSetChanged()
            }
        }, 2000)

        if(data == null || dataString == null) {
            return
        }

        val json_string = java.net.URLDecoder.decode(dataString.split("=")[1], "UTF-8")
        
        textview_logs.append(json_string)

        val parsed: SMSPayload? = Klaxon().parse(json_string)
        
        if(parsed === null) {
            return
        }

        // open file, append messages and quit
        // task which runs every minute will consume from here
        // do I need to acquire a lock on this file?
        
        val date = Calendar.getInstance().time
        val formatter = SimpleDateFormat.getDateTimeInstance()
        val formattedDate = formatter.format(date)

        for(sms in parsed.messages) {
            databaseHandler.addSMS(SMSItem(number = sms.number, text = sms.text, status =  sms.status, date =  formattedDate))
        }

        try {
            appendMessagesToFile(parsed.messages)
        } catch(e: Exception){
            Log.e(TAG, e.message)
            Log.e(TAG, e.toString())
        }

        Log.d(TAG, "scheduling....")

        try {
            if(parsed.messages.isNotEmpty()) {
                startService(Intent(this, SMSDispatcherService::class.java))
            }
        } catch(e: Exception) {
            Log.e(TAG, e.message)
        }

        finish()
    }

    fun updateLogText(text: String) {

        runOnUiThread {
            run {
                val textview_logs = findViewById<TextView>(R.id.logtext)
                textview_logs.text = text
            }
        }
    }


    private fun appendMessagesToFile(messages: List<SMSItem>) {

        // first read the file as json

        Log.d(TAG, "appending messages to file.....")

        val path = filesDir
        val file = File(path, filename)

        Log.d(TAG, file.absolutePath)

        var content: String? = null

        if(file.exists()) {
            val bytes = file.readBytes()
            content = String(bytes)
            Log.d(TAG,"content of pending messages is $content")
        }

         val newList = if(content == null) {
            messages
        } else {
            val parsed = Klaxon().parseArray<SMSItem>(content)
            parsed.orEmpty() + messages
        }

        Log.d(TAG, "new list is $newList")

        val res = Klaxon().toJsonString(newList)
        file.writeBytes(res.toByteArray())

        Log.d(TAG, "DONE writing")

    }

    private fun readLogMessages(): String {

        val file = File(filesDir, logFileName)

        return if(file.exists()) {
            val bytes = file.readBytes()
            String(bytes)
        } else {
            ""
        }
    }

    private fun clearLogMessages() {

        val file = File(filesDir, logFileName)
       if(file.exists()) {
         file.delete()
       }
    }

    private fun clearPendingMessages() {
        val file = File(filesDir, filename)
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

            holder.messsage_card.text =arraylist[position].number+"\n"+arraylist[position].text

            if(!arraylist[position].status.equals("SENT") && !arraylist[position].status.equals("PENDING")){
                holder.resend.visibility =  View.VISIBLE
                holder.resendcard.visibility = View.VISIBLE
            } else {
                holder.resend.visibility =  View.GONE
                holder.resendcard.visibility = View.GONE
            }

            if(!arraylist[position].date.equals("-1")) {
                holder.date.text = arraylist[position].date
            }

            holder.status.text = arraylist[position].status

            if(arraylist[position].status.equals("SENT")) {
                holder.status.setBackgroundResource(R.color.green)
            } else if(arraylist[position].status.equals("FAILED")) {
                holder.status.setBackgroundResource(R.color.red)
            } else if(arraylist[position].status.equals("PENDING")) {
                holder.status.setBackgroundResource(R.color.gray)
            }

            holder.resend.setOnClickListener(View.OnClickListener {

                Toast.makeText(context,"retrying",Toast.LENGTH_LONG).show()

                val messages = arrayListOf<SMSItem>()
                messages.add(arraylist[position])
                // append failed messages to file
                appendMessagesToFile(messages)

                // add sms to database
                val databaseHandler: DatabaseHandler = DatabaseHandler(context)
                databaseHandler.deleteSMS(arraylist[position])
                databaseHandler.addSMS(SMSItem(number = arraylist[position].number,text = arraylist[position].text, status =  arraylist[position].status,date = arraylist[position].date))
                arraylist.remove(arraylist[position])

                notifyDataSetChanged()

                startService(Intent(this@MainActivity, SMSDispatcherService::class.java))
            })

        }
        override fun getItemCount(): Int {
            return arraylist.size
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
