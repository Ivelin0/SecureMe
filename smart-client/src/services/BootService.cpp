

#include "BootService.h"
#include "../AndroidService.h"
#include "../NotificationManager.h"
#include <QtCore/private/qandroidextras_p.h>

#include <QNetworkAccessManager>
#include <QJsonObject>
#include <QJsonDocument>

#include "../utility/permissions.h"
#include "../utility/device.h"

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
    QNetworkAccessManager *manager = new QNetworkAccessManager(this);

    QJsonObject json;
    json["brand"] = utility::getAndroidDeviceModel();
    QJsonDocument jsonDoc(json);
    QByteArray jsonData = jsonDoc.toJson();

    QNetworkRequest request(QUrl("https://secureme.live/boot"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, QVariant("application/json"));

    manager->post(request, jsonData);
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