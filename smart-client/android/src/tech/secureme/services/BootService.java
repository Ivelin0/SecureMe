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
import android.app.Service;
import android.content.pm.ServiceInfo;

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
        return Service.START_STICKY;
    }

    public static void startService(Context ctx) {
        ctx.startService(new Intent(ctx, BootService.class));
    }


}