package tech.secureme.services;

import tech.secureme.R;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.app.NotificationCompat;
import android.app.Notification;
import android.content.Intent;


import org.qtproject.qt.android.bindings.QtService;
import android.content.pm.ServiceInfo;
import tech.secureme.utils.QGpsUtils;

public class WebService extends QtService {
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        return Service.START_STICKY;
    }

    public static void serviceStart(Context ctx) {
        ctx.startService(new Intent(ctx, WebService.class));
    }
}