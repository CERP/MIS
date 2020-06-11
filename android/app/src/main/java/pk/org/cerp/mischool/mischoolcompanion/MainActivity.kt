package pk.org.cerp.mischool.mischoolcompanion

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.opengl.Visibility
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
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter


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

        // ask for permissions
        getPermissions()

        val logMessages = readLogMessages()
        val tv = findViewById<TextView>(R.id.logtext)
        tv.text = logMessages
        tv.movementMethod = ScrollingMovementMethod()

        val databaseHandler: DatabaseHandler = DatabaseHandler(this)

        list = findViewById(R.id.recyclerV) as RecyclerView

        val layoutManager = LinearLayoutManager(this)
        layoutManager.setReverseLayout(true)
        layoutManager.setStackFromEnd(true)
        list!!.setLayoutManager(layoutManager)

        arraylist = databaseHandler.getAllSMS()

        recyclerAdapter = SMSAdapter(this@MainActivity)
        list!!.addItemDecoration(DividerItemDecoration(list!!.getContext(), layoutManager.orientation))
        list!!.setAdapter(recyclerAdapter)

        // clear logs button
        val clearLogsButton = findViewById<Button>(R.id.clearLogButton)
        clearLogsButton.setOnClickListener {

            clearLogMessages()
            databaseHandler.deleteAllSMS()
            databaseHandler.deleteAllFailedSMS()

            arraylist.clear()
            recyclerAdapter!!.notifyDataSetChanged()

            // re-reading logs to ensure removed
            tv.text = readLogMessages()
        }

        // resend failed sms button
        val resendFailedSMSButton = findViewById<Button>(R.id.button)
        resendFailedSMSButton.setOnClickListener {

            val failedMessages = databaseHandler.getAllFailedSMS()
            val failedMessagesSize = failedMessages.size

            if(failedMessagesSize > 0) {

                Toast.makeText(baseContext, "resending $failedMessagesSize failed sms", Toast.LENGTH_SHORT).show()

                // delete failed sms so that in next try they don't duplicate in db
                databaseHandler.deleteAllFailedSMS()

                //
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

        var sent= 0
        var total = 0
        var pending = 0
        var failed = 0

        for(sms in arraylist) {

            if(sms.status.equals("SENT")) {
                sent++
            } else if(sms.status.equals("PENDING")){
                pending++
            }
            else if(sms.status.equals("FAILED")){
                failed++
            }
        }

        total = arraylist.size

        val tvsent = findViewById<TextView>(R.id.textViewsent)
        val tvpending = findViewById<TextView>(R.id.textViewpending)
        val tvfailed = findViewById<TextView>(R.id.textView2failed)

        tvsent.text = "Sent: $sent"
        tvpending.text = "Pending: $pending"
        tvfailed.text = "Failed: $failed"

        val handler = Handler()
        var pre = readLogMessages()

        handler.postDelayed(object : Runnable {
            override fun run() {
                arraylist = databaseHandler.getAllSMS()
                Log.d("tryArrayListSize","in handler" + arraylist.size.toString())
                Log.d("tryDB", arraylist.size.toString())

                handler.postDelayed(this, 2000)
                val text = readLogMessages()

                if(pre != text) {
                    updateLogText(text)
                    pre = text
                }

                sent = 0
                failed = 0
                pending = 0

                for(sms in arraylist) {
                    
                    Log.d("SMS-Status", sms.status)

                    if(sms.status.equals("SENT")) {
                        sent++
                    } else if(sms.status.equals("PENDING")) {
                        pending++
                    } else if(sms.status.equals("FAILED")) {
                        failed++
                    }
                }

                total = arraylist.size

                tvsent.text = "Sent: $sent"
                tvpending.text = "Pending: $pending"
                tvfailed.text = "Failed: $failed"

                recyclerAdapter!!.notifyDataSetChanged()
            }
        }, 2000)

        if(data == null || dataString == null) {
            return
        }

        val jsonString = java.net.URLDecoder.decode(dataString.split("=")[1], "UTF-8")
        
        tv.append(jsonString)

        val parsed: SMSPayload? = Klaxon().parse(jsonString)
        if(parsed === null) {
            return
        }

        // open file, append messages and quit
        // task which runs every minute will consume from here
        // do I need to acquire a lock on this file?

        val timestamp = LocalDateTime.now()
        val date = timestamp.format(DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm a"))

        for(sms in parsed.messages) {
            databaseHandler.addSMS(SMSItem(number = sms.number, text = sms.text, status =  sms.status, date =  date))
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
                val tv = findViewById<TextView>(R.id.logtext)
                tv.text = text
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

        val file = File(filesDir, "${logFileName}")
        var content = if(file.exists()) {
            val bytes = file.readBytes()
            String(bytes)
        } else {
            ""
        }

        return content
    }

    private fun clearLogMessages() {

        val file = File(filesDir, "${logFileName}")
        file.writeBytes("".toByteArray())
    }

    private inner class SMSAdapter(internal var context: Context): RecyclerView.Adapter<SMSAdapter.SMSViewHolder >() {

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SMSAdapter.SMSViewHolder  {
            val view = LayoutInflater.from(context).inflate(R.layout.model, parent, false)
            return SMSViewHolder (view)
        }

        @SuppressLint("ResourceAsColor")
        override fun onBindViewHolder(holder: SMSAdapter.SMSViewHolder, position: Int) {

            holder.country.text =arraylist[position].number+"\n"+arraylist[position].text

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

            internal var country: TextView
            internal var resend: Button
            internal var resendcard: CardView
            internal var status: Button
            internal var date: TextView
            init {
                country = itemView.findViewById(R.id.textView)
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
            ActivityCompat.requestPermissions(this@MainActivity, arrayOf(android.Manifest.permission.SEND_SMS, android.Manifest.permission.READ_SMS, android.Manifest.permission.READ_PHONE_STATE), MY_PERMISSIONS_SEND_SMS)
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
