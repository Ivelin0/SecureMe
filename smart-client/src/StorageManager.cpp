#include "StorageManager.h"

#include <QObject>
#include <QSettings>
#include <QJniObject>
#include <QtCore/private/qandroidextras_p.h>
#include "NotificationManager.h"
#include <QVariant>
StorageManager *StorageManager::instance = nullptr;

StorageManager *StorageManager::getInstance()
{
    if (instance == nullptr)
        instance = new StorageManager();
    return instance;
}

StorageManager::StorageManager(QObject *parent) : QObject(parent), storage("tech.secureme", "SecureMe")
{
}

StorageManager::~StorageManager()
{
}

void StorageManager::attachAuthToken(const QString &auth_token)
{
    storage.setValue(QLatin1String("auth_token"), auth_token);
}

QString StorageManager::getAuthToken()
{
    storage.sync();
    return storage.value(QLatin1String("auth_token")).toString();
}

void StorageManager::attachFcmToken(const QString &fcm_token)
{
    storage.setValue(QLatin1String("fcm_token"), fcm_token);
    storage.sync();
}

bool StorageManager::switchSetting(const QString &setting)
{
    QVariant value = storage.value(setting);
    bool isOn = value.isNull() ? true : !value.toBool();
    storage.setValue(setting, isOn);

    return isOn;
}

bool StorageManager::getSettingSwitch(const QString &setting)
{
    QVariant value = storage.value(setting);
    if (value.isNull())
    {
        storage.setValue(setting, true);
        return true;
    }
    return storage.value(setting).toBool();
}

QString StorageManager::getFcmToken()
{
    return storage.value(QLatin1String("fcm_token")).toString();
}