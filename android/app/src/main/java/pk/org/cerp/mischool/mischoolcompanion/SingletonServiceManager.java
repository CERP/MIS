package pk.org.cerp.mischool.mischoolcompanion;

public class SingletonServiceManager {
    public static boolean isSMSServiceRunning;
    public static SMSDispatcherService mCurrentService;

    static {
        isSMSServiceRunning = false;
        mCurrentService = null;
    }
}
