package tech.secureme;

import android.app.Activity;
import android.app.admin.DeviceAdminReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.UserHandle;
import android.util.Log;
import android.widget.Toast;
import tech.secureme.MyService;
import tech.secureme.NotificationClient;
import tech.secureme.services.CameraService;
import tech.secureme.services.LocationService;

public class SecureMeDeviceAdminReceiver extends DeviceAdminReceiver {

  @Override
  public void onEnabled(Context context, Intent intent) {
    super.onEnabled(context, intent);
  }

  public native void handleHttpRequest();

  @Override
  public void onPasswordFailed(
    Context context,
    Intent intent,
    UserHandle user
  ) {
    CameraService.serviceStart(context);
  }
}
