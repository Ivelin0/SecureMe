#include "Config.h"
#include "json.hpp"
#include <fstream>
#include <iostream>
#include <QFile>
#include <QDebug>
#include <memory>

using json = nlohmann::json;

#define SET_CONFIG_SETTINGS(TYPE, NAME, DEFAULT)                        \
    this->NAME = data.contains(#NAME)                                   \
                     ? data[#NAME].template get<decltype(this->NAME)>() \
                     : DEFAULT;

Config *Config::config = nullptr;

Config *Config::getInstance()
{
    if (config == nullptr)
        config = new Config;
    return config;
}
Config::Config()
{
    QFile file(":/src/config.json");
    file.open(QIODevice::ReadOnly | QIODevice::Text);
    auto jsonData = file.readAll().data();

    auto before = jsonData;

    json data = json::parse(jsonData);

    file.close();
    CONFIG_SETTINGS_LIST(SET_CONFIG_SETTINGS)
}

void Config::Log() {}
