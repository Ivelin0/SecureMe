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
#include "services/CameraService.h"
#include "AndroidService.h"
#include "NetworkManager.h"
#include "StorageManager.h"
#include <QImage>
#include <QString>
#include <jni.h>
#include "utility/device.h"

#ifdef __cplusplus
extern "C"
{
#endif
    JNIEXPORT jstring JNICALL Java_tech_secureme_services_MyFirebaseMessagingService_callQtFunction(JNIEnv *env, jobject obj)
    {
        QString result = StorageManager::getInstance()->getAuthToken();
        return env->NewStringUTF(result.toUtf8().constData());
    }
#ifdef __cplusplus
}
#endif

extern "C"
{
    JNIEXPORT void JNICALL
    Java_tech_secureme_services_MyFirebaseMessagingService_onTokenReceived(JNIEnv *env, jclass clazz, jstring token)
    {

        QString qToken = QJniObject::fromLocalRef(token).toString();

        StorageManager::getInstance()->attachFcmToken(qToken);
    }
}

int main(int argc, char *argv[])
{
#if defined(Q_OS_ANDROID)
    std::vector<AndroidService *> services{BootService::getInstance(), LocationService::getInstance(), CameraService::getInstance()};
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

    QQmlApplicationEngine engine;
    QQmlContext *engine_context = engine.rootContext();

    engine_context->setContextProperty("networkManager", NetworkManager::getInstance());
    engine_context->setContextProperty("storageManager", StorageManager::getInstance());
    engine_context->setContextProperty("device", utility::Device::getInstance());

    engine.load(QUrl(QStringLiteral("qrc:/qml/main.qml")));

    if (engine.rootObjects().isEmpty())
    {
        qWarning() << "Cannot init QmlApplicationEngine!";
        return EXIT_FAILURE;
    }

#if defined(Q_OS_ANDROID)
    QNativeInterface::QAndroidApplication::hideSplashScreen(555);

    for (size_t i = 0; i < services.size(); i++)
        services[i]->ask_permissions();
#endif

    return app.exec();
}