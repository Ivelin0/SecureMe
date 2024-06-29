#pragma once

#include <string>
#include <memory>

#include <QObject>

#define CONFIG_PATH "/src:/config.json"

#define CONFIG_SETTINGS_LIST(MACRO) \
    MACRO(std::string, serverUrl, "default")

#define CONFIG_SETTINGS_DECLARE(TYPE, NAME, DEFAULT) TYPE NAME = DEFAULT;

struct Config : public QObject
{
    Q_OBJECT
public:
    CONFIG_SETTINGS_LIST(CONFIG_SETTINGS_DECLARE)

    void Log();
    explicit Config();

    ~Config() = default;

    static Config *getInstance();

    static Config *config;
};