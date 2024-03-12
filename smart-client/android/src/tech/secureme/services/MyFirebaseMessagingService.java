package tech.secureme.services;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import java.util.Map;
import tech.secureme.R;
import tech.secureme.services.LocationService;

public class MyFirebaseMessagingService extends FirebaseMessagingService {

  @Override
  public void onMessageReceived(RemoteMessage remoteMessage) {
    Map<String, String> data = remoteMessage.getData();

    if (
      data.get("method").equals("GET") && data.get("route").equals("/locations")
    ) LocationService.serviceStart(this); else if (
      data.get("method").equals("DELETE") &&
      data.get("route").equals("/locations")
    ) LocationService.serviceStop(this);
  }
}
