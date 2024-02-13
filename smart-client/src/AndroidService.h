#ifndef ANDROID_SERVICE_H
#define ANDROID_SERVICE_H

#include <QtCore/QObject>
#include <string>

class AndroidService : public QObject
{

protected:
    AndroidService();
    virtual ~AndroidService() = default;

public:
    virtual std::string getServiceName() = 0;

    virtual void start_service() = 0;
    virtual void start_activity() = 0;
};

#endif // ANDROID_SERVICE_H