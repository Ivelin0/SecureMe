#include <QGuiApplication>
#include <QtCore/private/qandroidextras_p.h>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <vector>
#include <QString>
#include <QNetworkAccessManager>
#include <QJsonDocument>
#include <QNetworkReply>
#include <QJsonObject>
#include <QtCore/private/qandroidextras_p.h>
#include <QNetworkAccessManager>
#include <QJsonDocument>
#include <QNetworkReply>
#include <QJsonObject>
#include <QGeoPositionInfoSource>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include "services/LocationService.h"
#include "services/BootService.h"
#include "NotificationManager.h"
#include "services/WebService.h"
#include "AndroidService.h"

int main(int argc, char *argv[])
{
#if defined(Q_OS_ANDROID)

    std::vector<AndroidService*> initial_services {BootService::getInstance()};
    std::vector<AndroidService*> services {LocationService::getInstance()};

    for (AndroidService* service : initial_services) {
        services.push_back(service);
    }

    for (int i = 1; i < argc; i++)
    {
        for(size_t j = 0; j < services.size(); j++) {

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

    for(size_t i = 0; i < initial_services.size(); i++) {
        initial_services[i]->ask_permissions();
        initial_services[i]->start_service();
    }

    for(size_t i = 0; i < services.size(); i++)
        services[i]->ask_permissions();
#endif

    return app.exec();
}