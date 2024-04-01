package tech.secureme.services;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import java.lang.String;
import org.qtproject.qt.android.bindings.QtService;

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
    return Service.START_NOT_STICKY;
  }

  public static void startService(Context ctx) {
    android.content.Intent pQtAndroidService = new android.content.Intent(
      ctx,
      BootService.class
    );
    pQtAndroidService.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
    ctx.startService(pQtAndroidService);
  }
}
