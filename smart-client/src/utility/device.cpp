#include "device.h"
#include <QtCore/private/qandroidextras_p.h>

namespace utility
{

    QString getAndroidDeviceModel()
    {
        QJniObject brandObject = QJniObject::getStaticObjectField<jstring>("android/os/Build", "BRAND");

        return brandObject.toString();
    }
}