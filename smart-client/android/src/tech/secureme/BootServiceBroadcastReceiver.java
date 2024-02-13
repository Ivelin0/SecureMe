package tech.secureme;

import android.content.Context;
import android.content.Intent;
import android.content.BroadcastReceiver;
import tech.secureme.services.BootService;

public class BootServiceBroadcastReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        Intent startServiceIntent = new Intent(context, BootService.class);
        context.startService(startServiceIntent);
    }
}