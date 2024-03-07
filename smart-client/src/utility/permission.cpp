#include "permissions.h"
#include <QtCore/private/qandroidextras_p.h>
namespace utility
{
    enum class PERMISSIONS
    {
        POST_NOTIFICATIONS,
        ACCESS_BACKGROUND_LOCATION
    };

    std::map<PERMISSIONS, QString> permissions = {
        {PERMISSIONS::POST_NOTIFICATIONS, "POST_NOTIFICATIONS"},
        {PERMISSIONS::ACCESS_BACKGROUND_LOCATION, "ACCESS_BACKGROUND_LOCATION"}};

    void ask_permission_android(PERMISSIONS permission)
    {
        const auto notificationPermission = "android.permission." + permissions[permission];
        auto requestResult = QtAndroidPrivate::requestPermission(notificationPermission);
        if (requestResult.result() != QtAndroidPrivate::Authorized)
        {
            qWarning() << "Failed to acquire permissions";
        }
    }
}