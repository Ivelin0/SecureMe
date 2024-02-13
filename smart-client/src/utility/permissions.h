#ifndef SECUREME_PERMISSIONS_H
#define SECUREME_PERMISSIONS_H
#if defined(Q_OS_ANDROID)

#include <QString>
#include <QtCore/private/qandroidextras_p.h>

namespace utility
{

    enum class PERMISSIONS
    {
        POST_NOTIFICATIONS
    };

    std::map<PERMISSIONS, QString> permissions = {
        {PERMISSIONS::POST_NOTIFICATIONS, "POST_NOTIFICATIONS"}};

    void ask_permission_android(PERMISSIONS permission)
    {

        if (QNativeInterface::QAndroidApplication::sdkVersion() >= __ANDROID_API_T__)
        {
            const auto notificationPermission = "android.permission." + permissions[permission];
            auto requestResult = QtAndroidPrivate::requestPermission(notificationPermission);
            if (requestResult.result() != QtAndroidPrivate::Authorized)
            {
                qWarning() << "Failed to acquire permissions";
            }
        }
    }
#endif
}

#endif