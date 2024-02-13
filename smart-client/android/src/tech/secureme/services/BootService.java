package tech.secureme.services;

import java.lang.String;
import android.util.Log;
import android.content.Context;
import android.content.Intent;
import android.content.BroadcastReceiver;
import android.app.Notification;
import android.app.Notification.Builder;
import android.app.PendingIntent;
import org.qtproject.qt.android.bindings.QtService;
import android.content.Intent;

public class BootService extends QtService {
    private static final String TAG = "AndroidService";

    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        int ret = super.onStartCommand(intent, flags, startId);

        return START_STICKY;
    }

    public static void serviceStart(android.content.Context context) {
        android.content.Intent pQtAndroidService = new android.content.Intent(context, BootService.class);
        pQtAndroidService.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startService(pQtAndroidService);
    }

    public static void serviceStop(android.content.Context context) {
        android.content.Intent pQtAndroidService = new android.content.Intent(context, BootService.class);
        context.stopService(pQtAndroidService);
    }

}