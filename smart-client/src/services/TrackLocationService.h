#ifndef TRACK_LOCATION_SERVICE_H
#define TRACK_LOCATION_SERVICE_H

#include "../AndroidService.h"
#include <QtCore/QObject>
#include <string>
#include <QGeoPositionInfoSource>
#include <QWebSocket>

class TrackLocationService : public AndroidService
{
    Q_OBJECT
private:
    TrackLocationService();
    ~TrackLocationService();
    static TrackLocationService *instance;

    QWebSocket wsLocation;
    QGeoPositionInfoSource *source;

public:
    void ask_permissions() override;
    void start_service() override;
    void stop_service() override;
    void start_activity() override;

    std::string getServiceName() override;

    static TrackLocationService *getInstance();
};

#endif // TRACK_LOCATION_SERVICE_H