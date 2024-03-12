#ifndef SECUREME_PERMISSIONS_H
#define SECUREME_PERMISSIONS_H
#if defined(Q_OS_ANDROID)

#include <QString>
#include <QtCore/private/qandroidextras_p.h>

namespace utility
{
    enum class PERMISSIONS
    {
        POST_NOTIFICATIONS,
        ACCESS_BACKGROUND_LOCATION,
        ACCESS_FINE_LOCATION,
        ACCESS_COARSE_LOCATION
    };

    extern std::map<PERMISSIONS, QString> permissions;
    void ask_permission_android(PERMISSIONS permission);
}
#endif
#endif