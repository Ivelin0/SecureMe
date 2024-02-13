#include <QtGlobal>
#include <QLibraryInfo>
#include <QVersionNumber>

#include <QCoreApplication>
#include <QGuiApplication>

#include <QSurfaceFormat>
#include <jni.h>

#include "services/BootService.h"
#include "AndroidService.h"
#include <QtCore/private/qandroidextras_p.h>

#include <vector>
int main(int argc, char *argv[])
{
#if defined(Q_OS_ANDROID)
    std::vector<AndroidService *> services{BootService::getInstance()};

    bool background_service = false;
    for (int i = 1; i < argc; i++)
    {
        for (size_t j = 0; j < services.size(); j++)
        {
            if ("--" + services[j]->getServiceName() != argv[i])
                continue;

            QAndroidService app(argc, argv);

            {
                services[j]->start_activity();

                return app.exec();
            }

            return EXIT_FAILURE;
        }
    }
#endif
    QGuiApplication app(argc, argv, true);

    // Application name
    app.setApplicationName("AndroidServiceDemo");
    app.setApplicationDisplayName("AndroidServiceDemo");
    app.setOrganizationName("emeric");
    app.setOrganizationDomain("emeric");

    if (QNativeInterface::QAndroidApplication::sdkVersion() >= __ANDROID_API_T__)
    {
        const auto notificationPermission = "android.permission.POST_NOTIFICATIONS";
        auto requestResult = QtAndroidPrivate::requestPermission(notificationPermission);
        if (requestResult.result() != QtAndroidPrivate::Authorized)
        {
            qWarning() << "Failed to acquire permissions";
        }
    }

#if defined(Q_OS_ANDROID)
    QNativeInterface::QAndroidApplication::hideSplashScreen(333);
    for (size_t i = 0; i < services.size(); i++)
    {
        services[i]->start_service();
        services[i]->ask_permissions();
    }
#endif

    return app.exec();
}

/* ************************************************************************** */

// 285827619