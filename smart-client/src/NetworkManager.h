#ifndef SECUREME_NETWORK_MANAGER_H
#define SECUREME_NETWORK_MANAGER_H

#include <QObject>
#include <QString>
#include <QJsonObject>
#include <QJsonDocument>
#include <QHttpPart>
#include <vector>

#include <QNetworkAccessManager>

class NetworkManager : public QObject
{
    Q_OBJECT

    NetworkManager();
    ~NetworkManager();

    static NetworkManager *instance;
    QNetworkAccessManager *manager;

    QNetworkReply *reply;

    void attachCookie(QNetworkAccessManager *manager, const QString &url);

signals:
    void operationFinished(QJsonDocument responseData, bool isError);

public slots:
    void handleRequest();

public:
    Q_INVOKABLE void post(QJsonObject json, const QString &url);
    Q_INVOKABLE void authenticated_post(QJsonObject, const QString &url);
    Q_INVOKABLE void authenticated_post(std::vector<QHttpPart>, const QString &url);
    Q_INVOKABLE void get(const QString &url);
    Q_INVOKABLE void authenticated_get(const QString &url);
    Q_INVOKABLE QString convertToJsonString(const QVariant &variant);

    static NetworkManager *getInstance();
};

#endif