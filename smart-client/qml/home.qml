import QtQuick
import QtQuick.Controls
import QtQuick.Controls.Material
import QtQuick.Window
import Qt.labs.settings
import QtQuick
import QtQuick.Templates as T
import QtQuick.Controls.Material
import QtQuick.Controls.Material.impl

ApplicationWindow {
    id: appWindow
    minimumWidth: 480
    minimumHeight: 960

    Material.accent: Material.Cyan

    flags: Qt.Window
    color: "white"
    visible: true

    property string cameraOption: "camera"
    property string locationOption: "location_service"
    property string trackLocationOption: "track_location_service"
    property string bootOption: "boot_service"

    Rectangle {
        id: topRect
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        height: 52
        color: "#f1f3f5"

        Text {
            anchors.left: parent.left
            anchors.leftMargin: 16
            anchors.verticalCenter: parent.verticalCenter
            text: "SecureMe"
            font.pixelSize: 20
        }
        Text {
            anchors.right: parent.right
            anchors.verticalCenter: parent.verticalCenter
            anchors.rightMargin: 16
            text: "Logout"
            font.family: "Helvetica"
            font.pointSize: 24
            color: "#00c1c9"

            MouseArea {
            anchors.fill: parent
                onClicked: {
                    storageManager.attachAuthToken("");
                    componentLoader.source = "main.qml"
                }
            }
        }
    }

    Column {
        spacing: 20
        anchors.top: topRect.bottom
        anchors.topMargin: 20
        id: here

        Row {
            spacing: 10

            CheckBox {
                id: locationBox
                anchors.verticalCenter: parent.verticalCenter
                checked: storageManager.getSettingSwitch(locationOption)
                onClicked: storageManager.switchSetting(locationOption)

            }

            Column {
                spacing: 2

                Text {
                    text: "Следене на устройството"
                    font.bold: true
                }

                Text {
                    text: "При влизане в админ панела за октриване на съотвентото устройство ще се включи локацията на телефона, за да се проследи."
                    width: appWindow.width-locationBox.width
                    wrapMode: Text.WordWrap
                }
            }
        }

        Row {
            spacing: 10

            CheckBox {
                id: bootBox
                anchors.verticalCenter: parent.verticalCenter
                checked: storageManager.getSettingSwitch(bootOption)
                onClicked: storageManager.switchSetting(bootOption)
            }

            Column {
                spacing: 2

                Text {
                    text: "Известяване при стартиране"
                    font.bold: true
                }

                Text {
                    text: "При включване на текущото устройство всички навързани устройства ще бъдат известявани."
                    width: appWindow.width-bootBox.width

                    wrapMode: Text.WordWrap
                }
            }
        }

        Row {
            spacing: 10

            CheckBox {
                id: incorrectPasswordBox
                anchors.verticalCenter: parent.verticalCenter
                checked: storageManager.getSettingSwitch(cameraOption)
                onClicked: storageManager.switchSetting(cameraOption)
            }

            Column {
                spacing: 2

                Text {
                    text: "Известяване при сгрешена парола"
                    font.bold: true
                }

                Text {
                    text: "При грешене на паролата на текущото устройство всички навързани устройства ще бъдат."
                    width: appWindow.width-incorrectPasswordBox.width
                    wrapMode: Text.WordWrap
                }
            }
        }

        Row {
            spacing: 10

            CheckBox {
                id: locationTrackBox
                anchors.verticalCenter: parent.verticalCenter
                checked: storageManager.getSettingSwitch(trackLocationOption)
                onClicked: storageManager.switchSetting(trackLocationOption)
            }

            Column {
                spacing: 2

                Text {
                    text: "Запазване на история при локация"
                    font.bold: true
                }

                Text {
                    text: "През 5 минути се запазва текущата ви локация, в случай че сте в движение. Това може да се провери от админ панела."
                    width: appWindow.width-locationTrackBox.width
                    wrapMode: Text.WordWrap
                }
            }
        }

    }
}