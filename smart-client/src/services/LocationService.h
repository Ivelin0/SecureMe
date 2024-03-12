#ifndef LOCATION_SERVICE_H
#define LOCATION_SERVICE_H

#include "../AndroidService.h"
#include <QtCore/QObject>
#include <string>
#include <QGeoPositionInfoSource>
#include <QWebSocket>

class LocationService : public QObject, public AndroidService
{
    Q_OBJECT
private:
    LocationService();
    ~LocationService();
    static LocationService *instance;
    QGeoPositionInfoSource *source;

    QWebSocket wsLocation;

public slots:
    void start_location_thread();

public:
    void ask_permissions() override;
    void start_service() override;
    void start_activity() override;

    std::string getServiceName() override;

    static LocationService *getInstance();
};

#endif // LOCATION_SERVICE_H