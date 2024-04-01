#ifndef ANDROID_SERVICE_H
#define ANDROID_SERVICE_H
#include <string>
#include <QtCore/QObject>

class AndroidService : public QObject
{

protected:
    AndroidService();
    virtual ~AndroidService() = default;

public:
    virtual std::string getServiceName() = 0;

    virtual void ask_permissions() = 0;
    virtual void stop_service() = 0;
    virtual void start_service() = 0;
    virtual void start_activity() = 0;
};

#endif // ANDROID_SERVICE_H