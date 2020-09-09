package pk.org.cerp.mischool.mischoolcompanion

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log


class SMSRestarterBroadcastReceiver : BroadcastReceiver() {
	override fun onReceive(context: Context, intent: Intent?) {
		Log.i(SMSRestarterBroadcastReceiver::class.java.simpleName, "Service Stops! Oooooooooooooppppssssss!!!!")
		context.startService(Intent(context, SMSDispatcherService::class.java))
	}
}