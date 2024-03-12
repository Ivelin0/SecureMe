package tech.secureme;

import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.messaging.FirebaseMessaging;
import org.qtproject.qt.android.bindings.QtActivity;
import tech.secureme.R;
import tech.secureme.SecureMeDeviceAdminReceiver;

public class MyActivity extends QtActivity {

  DevicePolicyManager devicePolicyManager;
  ComponentName demoDeviceAdmin;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    Intent i = getIntent();

    devicePolicyManager =
      (DevicePolicyManager) getSystemService(Context.DEVICE_POLICY_SERVICE);
    demoDeviceAdmin =
      new ComponentName(this, SecureMeDeviceAdminReceiver.class);

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
            String token = task.getResult();

            Log.d("Token", token);
          }
        }
      );

    FirebaseMessaging
      .getInstance()
      .subscribeToTopic("location")
      .addOnCompleteListener(
        new OnCompleteListener<Void>() {
          @Override
          public void onComplete(Task<Void> task) {
            String msg = "Subscribed";
            if (!task.isSuccessful()) {
              msg = "Subscribe failed";
            }
            Log.e("Message", msg);
          }
        }
      );
  }
}
