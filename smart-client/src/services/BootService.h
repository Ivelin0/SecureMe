#ifndef BOOT_SERVICE_H
#define BOOT_SERVICE_H

#include "../AndroidService.h"
#include <QtCore/QObject>
#include <string>
class BootService : public AndroidService
{
private:
    BootService();
    ~BootService();
    static BootService *instance;

public:
    void ask_permissions() override;
    void start_service() override;
    void start_activity() override;
    std::string getServiceName() override;

    static BootService *getInstance();
};

#endif // BOOT_SERVICE_H