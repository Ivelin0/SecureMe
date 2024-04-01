#ifndef SECUREME_DEVICE_H
#define SECUREME_DEVICE_H

#include <QString>
#include <QObject>

namespace utility
{
    class Device : public QObject
    {
        Q_OBJECT

        static Device *instance;

    public:
        Q_INVOKABLE QString getFullDeviceModel();

        static Device *getInstance();
    };

}

#endif