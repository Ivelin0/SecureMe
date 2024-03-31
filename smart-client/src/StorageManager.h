#ifndef SECUREME_TOKEN_MANAGER_H
#define SECUREME_TOKEN_MANAGER_H

#include <QObject>
#include <QSettings>

#include "NotificationManager.h"

class StorageManager : public QObject
{
    Q_OBJECT

    QSettings storage;
    static StorageManager *instance;

    StorageManager(QObject *parent = nullptr);
    ~StorageManager();
public:
    Q_INVOKABLE void attachAuthToken(const QString &token);
    Q_INVOKABLE QString getAuthToken();

    Q_INVOKABLE void attachFcmToken(const QString &);
    Q_INVOKABLE QString getFcmToken();

    Q_INVOKABLE bool switchSetting(const QString& setting);
    Q_INVOKABLE bool getSettingSwitch(const QString& setting);

    static StorageManager *getInstance();
};

#endif