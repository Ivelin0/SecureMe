#include <QGuiApplication>
#include <QtCore/private/qandroidextras_p.h>

#include "AndroidService.h"
#include "NotificationManager.h"
#include "services/BootService.h"
#include "services/WebService.h"

int main(int argc, char *argv[])
{
#if defined(Q_OS_ANDROID)
    std::vector<AndroidService *> services{
        BootService::getInstance(),
        WebService::getInstance()};

    bool background_service = false;
    for (int i = 1; i < argc; i++)
    {
        for (size_t j = 0; j < services.size(); j++)
        {
            if ("--" + services[j]->getServiceName() != argv[i])
                continue;

            QAndroidService app(argc, argv);

            services[j]->start_activity();

            return app.exec();
        }
    }
#endif

    QGuiApplication app(argc, argv, true);

#if defined(Q_OS_ANDROID)
    QNativeInterface::QAndroidApplication::hideSplashScreen(333);
    for (size_t i = 0; i < services.size(); i++)
    {
        qDebug() << "Starting service: " << services[i]->getServiceName();

        services[i]->start_service();
        services[i]->ask_permissions();
    }
#endif

    return app.exec();
}