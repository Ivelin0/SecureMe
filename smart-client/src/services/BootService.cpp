

#include "BootService.h"
#include "../AndroidService.h"
#include "../NotificationManager.h"
#include <QtCore/private/qandroidextras_p.h>

#include <QNetworkAccessManager>
#include <QJsonObject>
#include <QJsonDocument>

#include "../NetworkManager.h"
#include "../utility/permissions.h"
#include "../utility/device.h"
#include "../StorageManager.h"
#include "../Config.h"

BootService *BootService::instance = nullptr;

BootService *BootService::getInstance()
{
    if (instance == nullptr)
        instance = new BootService();
    return instance;
}

BootService::~BootService()
{
}

BootService::BootService() : AndroidService()
{
}

std::string BootService::getServiceName()
{
    return "boot_service";
}

void BootService::start_activity()
{
    NetworkManager::getInstance()->authenticated_post(QJsonObject({{"fcm_token", StorageManager::getInstance()->getFcmToken()}, {"brand", utility::Device::getInstance()->getFullDeviceModel()}}), QString::fromStdString(Config::getInstance()->httpServerUrl) + "/api/boot");
}

void BootService::ask_permissions()
{
    utility::ask_permission_android(utility::PERMISSIONS::POST_NOTIFICATIONS);
}

void BootService::start_service()
{
    QJniObject::callStaticMethod<void>("tech.secureme.services.BootService",
                                       "startService",
                                       "(Landroid/content/Context;)V",
                                       QNativeInterface::QAndroidApplication::context());
}

void BootService::stop_service()
{
}