package tech.secureme;

import android.app.Notification;
import android.app.NotificationManager;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.BitmapFactory;
import android.app.NotificationChannel;
import android.util.Log;

public class NotificationClient {
    public static void notify(final Context context, final String title, final String message, final int channel) {
        try {

            NotificationManager notificationManager = (NotificationManager) context
                    .getSystemService(Context.NOTIFICATION_SERVICE);
            Notification.Builder builder;

            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                NotificationChannel notificationChannel = new NotificationChannel("secure me", "app notification",
                        NotificationManager.IMPORTANCE_DEFAULT);

                notificationChannel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);

                notificationManager.createNotificationChannel(notificationChannel);
                builder = new Notification.Builder(context, notificationChannel.getId());
            } else {
                builder = new Notification.Builder(context);
            }

            builder.setSmallIcon(R.drawable.icon)
                    .setContentTitle(title)
                    .setContentText(message)
                    .setDefaults(Notification.DEFAULT_SOUND);

            notificationManager.notify(channel, builder.build());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}