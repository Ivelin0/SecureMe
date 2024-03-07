#include "WebService.h"
#include <QtCore/private/qandroidextras_p.h>
#include <QWebSocket>
#include <QTimer>

#include "../NotificationManager.h"
#include "../utility/device.h"

WebService::WebService()
{
}

WebService::~WebService()
{
}

WebService *WebService::instance = nullptr;
WebService *WebService::getInstance()
{
    if (!instance)
        instance = new WebService();
    return instance;
}

std::string WebService::getServiceName()
{
    return "web_service";
}

void WebService::ask_permissions()
{
}

void WebService::start_service()
{
    QJniObject::callStaticMethod<void>("tech.secureme.services.WebService",
                                       "serviceStart",
                                       "(Landroid/content/Context;)V",
                                       QNativeInterface::QAndroidApplication::context());
}

void WebService::start_activity()
{
    QObject::connect(&timer, &QTimer::timeout, [this](){
        wsLocation.ping("ping");
    });

    QObject::connect(&wsLocation, &QWebSocket::errorOccurred, [](QAbstractSocket::SocketError error){
        NotificationClient::getInstance()->setNotification("ERROR", QString::number(error));
    });

    wsLocation.open(QUrl("ws://secureme.live/" + utility::getAndroidDeviceModel()));
    timer.start(1000);
}