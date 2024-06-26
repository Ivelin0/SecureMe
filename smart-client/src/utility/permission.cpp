#include "permissions.h"
#include <QtCore/private/qandroidextras_p.h>
namespace utility
{
    enum class PERMISSIONS
    {
        POST_NOTIFICATIONS,
        ACCESS_BACKGROUND_LOCATION,
        ACCESS_FINE_LOCATION,
        ACCESS_COARSE_LOCATION,
        CAMERA
    };

    std::map<PERMISSIONS, QString> permissions = {
        {PERMISSIONS::POST_NOTIFICATIONS, "POST_NOTIFICATIONS"},
        {PERMISSIONS::ACCESS_BACKGROUND_LOCATION, "ACCESS_BACKGROUND_LOCATION"},
        {PERMISSIONS::ACCESS_FINE_LOCATION, "ACCESS_FINE_LOCATION"},
        {PERMISSIONS::ACCESS_COARSE_LOCATION, "ACCESS_COARSE_LOCATION"},
        {PERMISSIONS::CAMERA, "CAMERA"}};

    void ask_permission_android(PERMISSIONS permission)
    {
        const auto notificationPermission = "android.permission." + permissions[permission];
        auto requestResult = QtAndroidPrivate::requestPermission(notificationPermission);
        if (requestResult.result() != QtAndroidPrivate::Authorized)
        {
            qWarning() << "Failed to acquire permission " << permissions[permission];
        }
    }
}