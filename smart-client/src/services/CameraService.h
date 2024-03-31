//
// Created by ivelin on 04.03.24.
//

#ifndef SECUREME_CAMERASERVICE_H
#define SECUREME_CAMERASERVICE_H

#include "../AndroidService.h"

class CameraService : public AndroidService {
private:
    static CameraService *instance;

    CameraService();
    ~CameraService();

public:
    void ask_permissions() override;
    void stop_service() override;
    void start_service() override;
    void start_activity() override;
    std::string getServiceName() override;

    static CameraService *getInstance();
};


#endif //SECUREME_CAMERASERVICE_H
