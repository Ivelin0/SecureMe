#ifndef NOTIFICATION_SERVICE_H
#define NOTIFICATION_SERVICE_H

#include <QObject>
#include <QString>

class NotificationClient : public QObject
{
    Q_OBJECT

    static NotificationClient *instance;

    NotificationClient();
    ~NotificationClient();

public:
    static NotificationClient *getInstance();

    void setNotification(const QString &title, const QString &message, int channel = 0);
    QString notification() const;
};

#endif