cmake_minimum_required(VERSION 3.16)
project(secureme LANGUAGES CXX)

set(CMAKE_INCLUDE_CURRENT_DIR ON)

set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

find_package(Qt6 COMPONENTS Gui Core REQUIRED)

set(PROJECT_SOURCES
        src/main.cpp
        src/AndroidService.cpp
        src/NotificationManager.cpp
        src/services/BootService.cpp
) 

file(GLOB SOURCES ${PROJECT_SOURCES})
qt_add_executable(secureme
    MANUAL_FINALIZATION
    ${PROJECT_SOURCES}
)

target_link_libraries(secureme PRIVATE Qt6::Gui Qt6::CorePrivate)

if(ANDROID)
    set(ANDROID_TARGET_SDK_VERSION 34)

    set_property(TARGET secureme APPEND PROPERTY QT_ANDROID_PACKAGE_SOURCE_DIR
                 ${CMAKE_CURRENT_SOURCE_DIR}/android)

    
    qt_finalize_executable(secureme)
endif()