

#include "BootService.h"
#include "../AndroidService.h"
#include "../NotificationManager.h"
#include "../utility/permissions.h"

#include <QtCore/private/qandroidextras_p.h>

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
    return "service";
}

void BootService::ask_permissions()
{
    utility::ask_permission_android(utility::PERMISSIONS::POST_NOTIFICATIONS);
}

void BootService::start_activity()
{
    NotificationClient::getInstance()->setNotification("Secure Me", "Service Started");
}

void BootService::start_service()
{
    QJniObject::callStaticMethod<void>("tech.secureme.services.BootService",
                                       "serviceStart",
                                       "(Landroid/content/Context;)V",
                                       QNativeInterface::QAndroidApplication::context());
}