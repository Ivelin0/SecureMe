
#include <QtCore/qjniobject.h>
#include <QtCore/qcoreapplication.h>
#include <QtCore/private/qandroidextras_p.h>

#include "NotificationManager.h"
#include <QObject>

NotificationClient *NotificationClient::instance = nullptr;

NotificationClient *NotificationClient::getInstance()
{
    if (instance == nullptr)
        instance = new NotificationClient();

    return instance;
}

NotificationClient::NotificationClient()
{
}

NotificationClient::~NotificationClient()
{
}

void NotificationClient::setNotification(const QString &title, const QString &message, int channel)
{
#if defined(Q_OS_ANDROID)
    QJniObject javaTitle = QJniObject::fromString(title);
    QJniObject javaMessage = QJniObject::fromString(message);
    jint javaChannel = channel;

    QJniObject::callStaticMethod<void>(
        "tech/secureme/NotificationClient",
        "notify",
        "(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;I)V",
        QNativeInterface::QAndroidApplication::context(),
        javaTitle.object<jstring>(),
        javaMessage.object<jstring>(),
        javaChannel);
#endif
}