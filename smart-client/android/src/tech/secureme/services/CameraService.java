package tech.secureme.services;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.graphics.SurfaceTexture;
import android.hardware.Camera;
import android.os.Environment;
import android.util.Log;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;
import java.io.File;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.CountDownLatch;
import org.qtproject.qt.android.bindings.QtService;
import tech.secureme.NotificationClient;
import tech.secureme.R;
import tech.secureme.utils.QGpsUtils;

public class CameraService extends QtService {

  private static CameraService instance = null;

  @Override
  public void onCreate() {
    super.onCreate();
    instance = this;
  }

  @Override
  public int onStartCommand(Intent intent, int flags, int startId) {
    String CHANNEL_ID = "camera_service";

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
      .setContentText("Camera")
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
      ServiceInfo.FOREGROUND_SERVICE_TYPE_CAMERA
    );

    return Service.START_NOT_STICKY;
  }

  private static String capturePhoto(Context context) {
    final CountDownLatch latch = new CountDownLatch(1);
    
    Camera camera = null;
    Camera.CameraInfo cameraInfo = new Camera.CameraInfo();
    int frontCamera = 1;
    Camera.getCameraInfo(frontCamera, cameraInfo);
    camera = Camera.open(frontCamera);

    try {
      camera.setPreviewTexture(new SurfaceTexture(0));
    } catch (Exception e) {
      e.printStackTrace();
    }
    camera.startPreview();

    final String[] filePath = new String[1];
    camera.takePicture(
      null,
      null,
      new Camera.PictureCallback() {
        @Override
        public void onPictureTaken(byte[] data, Camera camera) {
          File pictureFileDir = Environment.getExternalStoragePublicDirectory(
            Environment.DIRECTORY_DOWNLOADS
          );

          if (!pictureFileDir.exists() && !pictureFileDir.mkdirs()) {
            pictureFileDir.mkdirs();
          }
          SimpleDateFormat dateFormat = new SimpleDateFormat("yyyymmddhhmmss");
          String date = dateFormat.format(new Date());
          String photoName = "Captured_" + date + ".jpg";
          filePath[0] = pictureFileDir.getPath() + File.separator + photoName;
          File mainPicture = new File(filePath[0]);

          try {
            FileOutputStream fos = new FileOutputStream(mainPicture);
            fos.write(data);
            fos.close();
          } catch (Exception e) {
            e.printStackTrace();
          } finally {
            camera.release();
            latch.countDown();
          }
        }
      }
    );

    try {
      latch.await(); 
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    return filePath[0];
  }

  public static void serviceStart(final Context context) {
    Intent serviceIntent = new Intent(context, CameraService.class);
    ContextCompat.startForegroundService(context, serviceIntent);
  }

  public static void serviceStop(Context context) {
    if (instance != null) {
      instance.stopForeground(true);
      instance.stopSelf();
    }
  }
}
