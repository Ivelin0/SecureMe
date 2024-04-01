#include "device.h"
#include <QtCore/private/qandroidextras_p.h>

namespace utility
{
    Device *Device::instance = nullptr;

    QString Device::getFullDeviceModel()
    {
        QString manufacturer = (QJniObject::getStaticObjectField<jstring>("android/os/Build", "MANUFACTURER")).toString();
        QString brand = (QJniObject::getStaticObjectField<jstring>("android/os/Build", "BRAND")).toString();

        if (manufacturer == brand)
            return brand;
        return manufacturer + " " + brand;
    }

    Device *Device::getInstance()
    {
        if (instance == nullptr)
            instance = new Device();
        return instance;
    }
}