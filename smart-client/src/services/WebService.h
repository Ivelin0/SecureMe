#ifndef SECUREME_WEBSERVICE_H
#define SECUREME_WEBSERVICE_H


#include "../AndroidService.h"
#include <QWebSocket>
#include <QTimer>

class WebService : public AndroidService {

    static WebService *instance;
    QWebSocket wsLocation;
    QTimer timer;


    WebService();
    ~WebService();

public:
    void ask_permissions() override;
    void start_service() override;
    void start_activity() override;
    std::string getServiceName() override;

    static WebService *getInstance();
};


#endif //SECUREME_WEBSERVICE_H
