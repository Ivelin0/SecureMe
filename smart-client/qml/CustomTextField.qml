import QtQuick 2.15
import QtQuick.Window 2.15
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.3
import QtQuick.Controls.Fusion 2.3
import QtQuick.Controls.Material 2.5

Item {
    id: window
    anchors.fill: parent

    anchors.margins: 30
    Rectangle {
        id: bottomBorder
        width: window.width - 30t
        height: usernameField.activeFocus ? 3 : 1
        color: "black"
        y: usernameField.y + usernameField.height - 5
        x: usernameField.x + 15
    }

    TextField {
        id: usernameField
        width: window.width
        property bool isBold: false
            property color borderColor: activeFocus ? "#1d5ffe" : "#464a53"

                anchors.horizontalCenter: parent.horizontalCenter


                placeholderText: qsTr("Username")
                placeholderTextColor: "black"

                font.bold: isBold ? Font.Bold : Font.Normal
                font.weight: isBold ? Font.Bold : Font.Normal

                color: AppStyle.textColor
                background: Rectangle {
                    color: "transparent"
                }




            }



            MouseArea {
                id: mouseArea
                anchors.fill: usernameField
                hoverEnabled: true

                onPressed: {
                    usernameField.forceActiveFocus();
                }

            }

        }