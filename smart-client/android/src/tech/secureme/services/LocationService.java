package tech.secureme.services;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;
import org.qtproject.qt.android.bindings.QtService;
import tech.secureme.R;

public class LocationService extends QtService {

  @Override
  public int onStartCommand(Intent intent, int flags, int startId) {
    String CHANNEL_ID = "location_service";

    Intent showTaskIntent = new Intent(
      getApplicationContext(),
      LocationService.class
    );
    showTaskIntent.setAction(Intent.ACTION_MAIN);
    showTaskIntent.addCategory(Intent.CATEGORY_LAUNCHER);
    showTaskIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    PendingIntent contentIntent = PendingIntent.getActivity(
      getApplicationContext(),
      0,
      showTaskIntent,
      PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
    );

    NotificationCompat.Builder mNotifyBuilder = new NotificationCompat.Builder(
      this,
      CHANNEL_ID
    )
      .setTicker("SecureMe")
      .setContentTitle("SecureMe")
      .setContentText("Device tracked")
      .setSmallIcon(R.drawable.icon)
      .setContentIntent(contentIntent);

    NotificationManager mNotificationManager = (NotificationManager) getSystemService(
      Context.NOTIFICATION_SERVICE
    );
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
      CharSequence name = "location";
      int importance = NotificationManager.IMPORTANCE_HIGH;
      NotificationChannel mChannel = new NotificationChannel(
        CHANNEL_ID,
        name,
        importance
      );
      mNotificationManager.createNotificationChannel(mChannel);
    }
    startForeground(
      1,
      mNotifyBuilder.build(),
      ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION
    );

    return Service.START_NOT_STICKY;
  }

  public static void serviceStart(final Context context) {
    Intent serviceIntent = new Intent(context, LocationService.class);
    ContextCompat.startForegroundService(context, serviceIntent);
  }

  public static void serviceStop(final Context context) {
    Intent serviceIntent = new Intent(context, LocationService.class);
    context.stopService(serviceIntent);
  }
}
