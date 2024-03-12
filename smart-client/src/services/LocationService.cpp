#include <QtCore/private/qandroidextras_p.h>
#include <QNetworkAccessManager>
#include <QGeoPositionInfoSource>
#include <QObject>
#include <QJsonObject>
#include <QJsonDocument>

#include "LocationService.h"
#include "../AndroidService.h"
#include "../NotificationManager.h"
#include "../utility/device.h"
#include "../utility/permissions.h"


LocationService *LocationService::instance = nullptr;

LocationService *LocationService::getInstance()
{
    if (instance == nullptr)
        instance = new LocationService();
    return instance;
}

LocationService::~LocationService()
{
}

LocationService::LocationService() : AndroidService()
{
}

std::string LocationService::getServiceName()
{
    return "location_service";
}

void LocationService::ask_permissions()
{
    utility::ask_permission_android(utility::PERMISSIONS::ACCESS_BACKGROUND_LOCATION);
    utility::ask_permission_android(utility::PERMISSIONS::ACCESS_COARSE_LOCATION);
    utility::ask_permission_android(utility::PERMISSIONS::ACCESS_FINE_LOCATION);
    utility::ask_permission_android(utility::PERMISSIONS::POST_NOTIFICATIONS);
}

void LocationService::start_activity()
{
    NotificationClient::getInstance()->setNotification("SecureMe", "started");
    QThread *thread = new QThread(this);

    QGeoPositionInfoSource *source = QGeoPositionInfoSource::createDefaultSource(this);

    QObject::connect(source, &QGeoPositionInfoSource::positionUpdated,
                     [&](const QGeoPositionInfo &info)
                     {
                         if (info.isValid())
                         {
                             qreal latitude = info.coordinate().latitude();
                             qreal longitude = info.coordinate().longitude();

                             qDebug() << "Current coordinates are:" << latitude << "," << longitude;

                             QJsonObject json;
                             json["latittude"] = latitude;
                             json["longitude"] = longitude;

                             QJsonDocument jsonDoc(json);

                             wsLocation.sendBinaryMessage(jsonDoc.toJson());
                         }
                     });

    QObject::connect(source, &QGeoPositionInfoSource::errorOccurred, [](QGeoPositionInfoSource::Error positioningError)
                     { NotificationClient::getInstance()->setNotification("Error", QString::number(positioningError)); });

    QObject::connect(
        thread, &QThread::started, [&source]()
        {
                                     source->startUpdates(); });
    wsLocation.open(QUrl("ws://secureme.live/smart_client"));
    thread->start();
}

void LocationService::start_service()
{
    QJniObject::callStaticMethod<void>("tech.secureme.services.LocationService",
                                       "serviceStart",
                                       "(Landroid/content/Context;)V",
                                       QNativeInterface::QAndroidApplication::context());
}