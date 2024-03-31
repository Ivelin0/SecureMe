import QtQuick 2.15
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.3
import Qt5Compat.GraphicalEffects



Button {
    id:control

    implicitWidth: 46
    implicitHeight: 46

    property real radius: 8
    property color backgroundColor: "#14A44D"
    property string setIcon: ""

    property real borderWidth: 0
    property color borderColor: "transparent"
    font.pixelSize: FontStyle.h3
    font.family: FontStyle.getContentFont.name
    font.bold: Font.Bold
    font.weight: Font.Bold
    property string textColor: "white"
    property var handleClick: function() {}

        contentItem:ColumnLayout{
        width: parent.width
        height: parent.height
        anchors.horizontalCenter: parent.horizontalCenter
        Label{
            z:2
            Layout.alignment: Qt.AlignHCenter | Qt.AlignVCenter
            font:control.font
            text: control.text
            color: control.textColor
            visible: !setIcon
        }

        Image{
            Layout.alignment: Qt.AlignHCenter | Qt.AlignVCenter
            sourceSize: Qt.size(control.implicitWidth* 0.6,control.implicitHeight*0.6)
            source: setIcon
        }
    }
 
    background: Rectangle{
        implicitHeight: control.implicitHeight
        implicitWidth: control.implicitWidth
        radius: control.radius
        color: control.backgroundColor
        border.width: control.borderWidth
        border.color: control.borderColor


    }

    onClicked: {
       handleClick()
    }
}
