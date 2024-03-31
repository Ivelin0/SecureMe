#include "CameraService.h"
#include <QtCore/private/qandroidextras_p.h>

#include <QString>
#include <QImage>
#include <QByteArray>
#include <QBuffer>
#include <QHttpMultiPart>
#include <QHttpPart>
#include <QNetworkReply>

#include "../NetworkManager.h"
#include "../NotificationManager.h"
#include "../utility/device.h"
#include "../utility/permissions.h"
#include "../StorageManager.h"

CameraService *CameraService::instance = nullptr;

CameraService *CameraService::getInstance()
{
    if (instance == nullptr)
        instance = new CameraService();
    return instance;
}

void CameraService::ask_permissions()
{
    utility::ask_permission_android(utility::PERMISSIONS::CAMERA);
}

void CameraService::start_activity()
{
    NotificationClient::getInstance()->setNotification("SecureMe", "Device Found");

    QThread *thread = new QThread;

    QObject::connect(thread, &QThread::started, [this]()
                     {
                         QJniObject filePath = QJniObject::callStaticMethod<jstring>("tech.secureme.services.CameraService",
                                                                                     "capturePhoto",
                                                                                     "(Landroid/content/Context;)Ljava/lang/String;",
                                                                                     QNativeInterface::QAndroidApplication::context());

                         QHttpPart imagePart;
                         imagePart.setHeader(QNetworkRequest::ContentTypeHeader, QVariant("image/jpeg"));
                         imagePart.setHeader(QNetworkRequest::ContentDispositionHeader, QVariant("form-data; name=\"image\"; filename=\"image.jpg\""));
                         QByteArray byteArray;
                         QBuffer buffer(&byteArray);
                         QImage image(filePath.toString());
                         image.save(&buffer, "JPEG");
                         imagePart.setBody(byteArray);

                         QHttpPart fcm_token;
                         fcm_token.setHeader(QNetworkRequest::ContentTypeHeader, QVariant("text/plain"));
                         fcm_token.setHeader(QNetworkRequest::ContentDispositionHeader, QVariant("form-data; name=\"fcm_token\""));
                         fcm_token.setBody(StorageManager::getInstance()->getFcmToken().toUtf8());

                        QHttpPart brand;
                         brand.setHeader(QNetworkRequest::ContentTypeHeader, QVariant("text/plain"));
                         brand.setHeader(QNetworkRequest::ContentDispositionHeader, QVariant("form-data; name=\"brand\""));
                         brand.setBody(utility::Device::getInstance()->getFullDeviceModel().toUtf8());


                         NetworkManager::getInstance()->authenticated_post(std::vector<QHttpPart>{fcm_token, brand, imagePart}, "http://secureme.live/api/incorrect_password");

                        QObject::connect(NetworkManager::getInstance(), &NetworkManager::operationFinished, [this](QJsonDocument responseData, bool isError){
                            stop_service();
                        }); });

    thread->start();
}
void CameraService::start_service()
{
    QJniObject::callStaticMethod<void>("tech.secureme.services.CameraService",
                                       "serviceStart",
                                       "(Landroid/content/Context;)V",
                                       QNativeInterface::QAndroidApplication::context());
}

void CameraService::stop_service()
{
    QJniObject::callStaticMethod<void>("tech.secureme.services.CameraService",
                                       "serviceStop",
                                       "(Landroid/content/Context;)V",
                                       QNativeInterface::QAndroidApplication::context());
}

std::string CameraService::getServiceName()
{
    return "camera_service";
}

CameraService::CameraService()
{
}

CameraService::~CameraService() {}
