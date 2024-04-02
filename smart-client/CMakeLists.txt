cmake_minimum_required(VERSION 3.16)
project(secureme LANGUAGES CXX)

set(CMAKE_INCLUDE_CURRENT_DIR ON)

set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)
include(/home/ivelin/android_openssl/android_openssl.cmake)

find_package(Qt6 COMPONENTS Gui Core Network Positioning Widgets Multimedia WebSockets Concurrent Qml REQUIRED)

set(PROJECT_SOURCES
        src/main.cpp
        src/AndroidService.cpp
        src/NetworkManager.cpp 
        src/StorageManager.cpp
        src/NotificationManager.cpp
        src/utility/permission.cpp
        src/utility/device.cpp
        src/services/BootService.cpp
        src/services/LocationService.cpp
        src/services/CameraService.cpp
        src/services/TrackLocationService.cpp
)
set(OpenCV_DIR "/home/ivelin/opencv/release")
find_package( OpenCV REQUIRED )
include_directories( ${OpenCV_INCLUDE_DIRS} )
file(GLOB SOURCES ${PROJECT_SOURCES})
qt_add_executable(secureme
    MANUAL_FINALIZATION
    ${PROJECT_SOURCES}
)

message("Mario ${OpenCV_LIBS}")

set(NEW_LIST "")

foreach(item IN LISTS ${OpenCV_LIBS})

    string(APPEND NEW_LIST "${item}.so ")

endforeach()

target_link_libraries(secureme PRIVATE Qt6::Gui Qt6::CorePrivate Qt6::Network Qt6::Positioning Qt6::Widgets Qt6::Multimedia Qt6::WebSockets Qt6::Concurrent Qt6::Qml
)

if(ANDROID)
    set(ANDROID_TARGET_SDK_VERSION 34)
    add_android_openssl_libraries(secureme)

    set_property(TARGET secureme APPEND PROPERTY QT_ANDROID_PACKAGE_SOURCE_DIR
                 ${CMAKE_CURRENT_SOURCE_DIR}/android)

            qt6_add_resources(secureme "main"
                 PREFIX
                     "/"
                 FILES
                 "qml/CustomTextField.qml"
                     "qml/Auth.qml"
                     "qml/AppStyle.qml"
                     "qml/CustomButton.qml"
                     "qml/home.qml"
                     "qml/main.qml"
                     "qml/images/logo.png"
                 )

    qt_finalize_executable(secureme)
endif()