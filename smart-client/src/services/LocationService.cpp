#include <QtCore/private/qandroidextras_p.h>
#include <QNetworkAccessManager>
#include <QGeoPositionInfoSource>
#include <QObject>
#include <QJsonObject>
#include <QJsonDocument>
#include <QNetworkCookie>
#include <QNetworkCookieJar>
#include <QVariant>
#include <QTimer>
#include <QUrlQuery>

#include "LocationService.h"
#include "../AndroidService.h"
#include "../NotificationManager.h"
#include "../utility/device.h"
#include "../utility/permissions.h"
#include "../StorageManager.h"
#include <qvariant.h>
#include "../utility/device.h"
#include "TrackLocationService.h"

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

#include <QString>
#include "../Config.h"

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
int i = 0;
void LocationService::start_activity()
{
    NotificationClient::getInstance()->setNotification("SecureMe", "started");
    QThread *thread = new QThread(this);

    this->is_service_active = true;

    QGeoPositionInfoSource *source = QGeoPositionInfoSource::createDefaultSource(this);

    QObject::connect(source, &QGeoPositionInfoSource::positionUpdated,
                     [&](const QGeoPositionInfo &info)
                     {
                         if (info.isValid())
                         {
                             qreal latitude = info.coordinate().latitude();
                             qreal longitude = info.coordinate().longitude();

                             QJsonObject json;

                             json["event"] = "location";
                             json["latitude"] = latitude;
                             json["longitude"] = longitude;
                             json["full_brand"] = utility::Device::getInstance()->getFullDeviceModel();

                             QJsonDocument jsonDoc(json);

                             wsLocation.sendBinaryMessage(jsonDoc.toJson());
                         }
                     });

    QObject::connect(source, &QGeoPositionInfoSource::errorOccurred, [](QGeoPositionInfoSource::Error positioningError)
                     { NotificationClient::getInstance()->setNotification("Error", QString::number(positioningError)); });

    QObject::connect(
        thread, &QThread::started, [&source]()
        { source->startUpdates(); });

    QUrl url(QString::fromStdString(Config::getInstance()->wsServerUrl + "/api/smart_client"));
    QUrlQuery query;

    query.addQueryItem("auth_token", StorageManager::getInstance()->getAuthToken());
    query.addQueryItem("fcm_token", StorageManager::getInstance()->getFcmToken());

    url.setQuery(query.query());

    QNetworkRequest request(url);
    QObject::connect(&wsLocation, &QWebSocket::disconnected, [this, thread]()
                     {
        NotificationClient::getInstance()->setNotification("DISCONNECT", "DISCONNECTED");
        thread->exit();
        stop_service(); });

    QObject::connect(&wsLocation, &QWebSocket::errorOccurred, [](QAbstractSocket::SocketError webErrors)
                     { NotificationClient::getInstance()->setNotification("Errors", QString::number(webErrors)); });

    request.setRawHeader("Cookie", QString("auth_token=" + StorageManager::getInstance()->getAuthToken() + ";").toUtf8());
    wsLocation.open(request);

    thread->start();
}

void LocationService::start_service()
{
    this->is_service_active = false;
    QJniObject::callStaticMethod<void>("tech.secureme.services.LocationService",
                                       "serviceStart",
                                       "(Landroid/content/Context;)V",
                                       QNativeInterface::QAndroidApplication::context());
}

void LocationService::stop_service()
{
    QJniObject::callStaticMethod<void>("tech.secureme.services.LocationService",
                                       "serviceStop",
                                       "(Landroid/content/Context;)V",
                                       QNativeInterface::QAndroidApplication::context());
}