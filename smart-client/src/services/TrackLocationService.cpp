#include <QtCore/private/qandroidextras_p.h>
#include <QTimer>
#include "TrackLocationService.h"
#include "../NotificationManager.h"
#include "../utility/permissions.h"
#include "../NetworkManager.h"
#include "LocationService.h"
#include "../StorageManager.h"
#include "../Config.h"
TrackLocationService *TrackLocationService::instance = nullptr;

TrackLocationService::TrackLocationService() : source(QGeoPositionInfoSource::createDefaultSource(this))
{
}
TrackLocationService::~TrackLocationService()
{
}

TrackLocationService *TrackLocationService::getInstance()
{
    if (instance == nullptr)
        instance = new TrackLocationService();
    return instance;
}

void TrackLocationService::ask_permissions()
{
    utility::ask_permission_android(utility::PERMISSIONS::ACCESS_BACKGROUND_LOCATION);
    utility::ask_permission_android(utility::PERMISSIONS::ACCESS_COARSE_LOCATION);
    utility::ask_permission_android(utility::PERMISSIONS::ACCESS_FINE_LOCATION);
    utility::ask_permission_android(utility::PERMISSIONS::POST_NOTIFICATIONS);
}

std::string TrackLocationService::getServiceName()
{
    return "track_location_service";
}

void TrackLocationService::start_activity()
{
    QTimer *timer = new QTimer(this);

    QObject::connect(timer, &QTimer::timeout, [this]()
                     {
                         if (!LocationService::getInstance()->is_service_active && !onGoing) {
                            {
                             source->startUpdates();
                             onGoing = true;
                            }

                         } });

    timer->start(5000);

    QObject::connect(source, &QGeoPositionInfoSource::positionUpdated, [this](const QGeoPositionInfo &update)
                     { 
            NetworkManager::getInstance()->authenticated_post(QJsonObject({{"latitude", update.coordinate().latitude()}, 
            {"longitude", update.coordinate().longitude()},
            {"prev_longitude", source->lastKnownPosition().coordinate().longitude()},
            {"prev_latitude", source->lastKnownPosition().coordinate().latitude()},
            {"fcm_token", StorageManager::getInstance()->getFcmToken()}}), QString::fromStdString(Config::getInstance()->serverUrl) + "/api/trackLocation");
                        source->stopUpdates(); 
                        onGoing = false; });
}

void TrackLocationService::start_service()
{
    QJniObject::callStaticMethod<void>("tech.secureme.services.TrackLocationService",
                                       "serviceStart",
                                       QNativeInterface::QAndroidApplication::context());
}

void TrackLocationService::stop_service()
{
}