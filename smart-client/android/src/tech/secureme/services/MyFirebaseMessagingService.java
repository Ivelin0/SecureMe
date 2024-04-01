package tech.secureme.services;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.util.Log;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import tech.secureme.NotificationClient;
import tech.secureme.R;
import tech.secureme.services.LocationService;

public class MyFirebaseMessagingService extends FirebaseMessagingService {

  public static native String callQtFunction();

  public static native void onTokenReceived(String token);

  @Override
  public void onMessageReceived(RemoteMessage remoteMessage) {
    Map<String, String> data = remoteMessage.getData();

    if (
      data.get("method").equals("GET") && data.get("route").equals("/locations")
    ) LocationService.serviceStart(this); else if (
      data.get("method").equals("DELETE") &&
      data.get("route").equals("/locations")
    ) LocationService.serviceStop(this); else {
      String file_path = data.get("file_path").substring(1); // remove the first character which specifies the current directory - '.'
      NotificationClient.notify(
        getApplicationContext(),
        "Опит за  отключване",
        "На" + data.get("brand") + "беше сгрешена парола",
        56
      );
      OkHttpClient client = new OkHttpClient();
      Request request = new Request.Builder()
        .url("http://localhost:8000/" + file_path)
        .build();

      client
        .newCall(request)
        .enqueue(
          new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
              //Handle the error
            }

            @Override
            public void onResponse(Call call, Response response)
              throws IOException {
              if (response.isSuccessful()) {
                final Bitmap bitmap = BitmapFactory.decodeStream(
                  response.body().byteStream()
                );
              } else {
                // Handle the error
              }
            }
          }
        );
    }
  }

  public static String getFcmToken(Context context) {
    final String[] token = { "null" };
    FirebaseMessaging
      .getInstance()
      .getToken()
      .addOnCompleteListener(
        new OnCompleteListener<String>() {
          @Override
          public void onComplete(Task<String> task) {
            if (!task.isSuccessful()) {
              Log.w(
                "ERROR",
                "Fetching FCM registration token failed",
                task.getException()
              );
              return;
            }

            onTokenReceived(task.getResult());
          }
        }
      );

    return token[0];
  }
}
