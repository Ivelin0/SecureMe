#include "NetworkManager.h"

#include <QString>
#include <QJsonObject>
#include <QJsonDocument>
#include <QNetworkRequest>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QNetworkCookie>
#include <QNetworkCookieJar>
#include "StorageManager.h"
#include "NotificationManager.h"

NetworkManager::NetworkManager()
{
    manager = new QNetworkAccessManager();
}

NetworkManager::~NetworkManager()
{
    delete instance;
}

NetworkManager *NetworkManager::instance = nullptr;
NetworkManager *NetworkManager::getInstance()
{
    if (!instance)
    {
        instance = new NetworkManager();
        return instance;
    }
    return instance;
}

void NetworkManager::post(QJsonObject json, const QString &urlPath)
{
    QObject::connect(manager, &QNetworkAccessManager::finished,
                     []() {

                     });
    QJsonDocument jsonDoc(json);
    QByteArray jsonData = jsonDoc.toJson();

    const QUrl url = QUrl(urlPath);
    QNetworkRequest request(url);

    request.setHeader(QNetworkRequest::ContentTypeHeader, QVariant("application/json"));

    reply = manager->post(request, jsonData);

    connect(reply, &QNetworkReply::finished, this, &NetworkManager::handleRequest);
}

void NetworkManager::authenticated_get(const QString &urlPath)
{
    attachCookie(manager, urlPath);

    const QUrl url = QUrl(urlPath);
    QNetworkRequest request(url);
    request.setHeader(QNetworkRequest::ContentTypeHeader, QVariant("application/json"));

    reply = manager->get(request);
    connect(reply, &QNetworkReply::finished, this, &NetworkManager::handleRequest);
}

void NetworkManager::attachCookie(QNetworkAccessManager *manager, const QString &url)
{
    QList<QNetworkCookie> cookies;
    cookies.append(QNetworkCookie(("auth_token"), StorageManager::getInstance()->getAuthToken().toUtf8()));
    QNetworkCookieJar *cookieJar = new QNetworkCookieJar;
    cookieJar->setCookiesFromUrl(cookies, url);
    manager->setCookieJar(cookieJar);
}

void NetworkManager::authenticated_post(QJsonObject json, const QString &urlPath)
{
    QJsonDocument jsonDoc(json);
    QByteArray jsonData = jsonDoc.toJson();

    attachCookie(manager, urlPath);

    const QUrl url = QUrl(urlPath);
    QNetworkRequest request(url);
    request.setHeader(QNetworkRequest::ContentTypeHeader, QVariant("application/json"));

    reply = manager->post(request, jsonData);
    connect(reply, &QNetworkReply::finished, this, &NetworkManager::handleRequest);
}

void NetworkManager::authenticated_post(std::vector<QHttpPart> httpParts, const QString &urlPath)
{

    QHttpMultiPart *multiPart = new QHttpMultiPart(QHttpMultiPart::FormDataType);
    for (const auto &httpPart : httpParts)
        multiPart->append(httpPart);

    attachCookie(manager, urlPath);

    const QUrl url = QUrl(urlPath);
    QNetworkRequest request(url);

    reply = manager->post(request, multiPart);
    connect(reply, &QNetworkReply::finished, this, &NetworkManager::handleRequest);
}

void NetworkManager::handleRequest()
{
    reply->deleteLater();
    QByteArray responseData = reply->readAll();
    QVariant statusCode = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute);
    bool isError = !(statusCode.toInt() >= 200 && statusCode.toInt() <= 299);

    QJsonDocument jsonDoc = QJsonDocument::fromJson(responseData);

    emit operationFinished(jsonDoc, isError);
}

void NetworkManager::get(const QString &url)
{
    QNetworkRequest request(url);

    QNetworkReply *reply = manager->get(request);

    QObject::connect(reply, &QNetworkReply::finished, [this, reply]()
                     {
                         reply->deleteLater();
                        QByteArray responseData = reply->readAll();
                        QVariant statusCode = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute);
                        bool isError = !(statusCode.toInt() >= 200 && statusCode.toInt() <= 299);

                        QJsonDocument jsonDoc = QJsonDocument::fromJson(responseData);
                        
                        emit operationFinished(jsonDoc, isError); });
}

QString NetworkManager::convertToJsonString(const QVariant &variant)
{
    QJsonDocument doc = qvariant_cast<QJsonDocument>(variant);
    return QString(doc.toJson(QJsonDocument::Compact));
}