import QtQuick 2.15
import QtQuick.Window 2.15
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.3
import QtQuick.Controls.Fusion 2.3
import QtQuick.Controls.Material 2.5

ApplicationWindow {
    width: 640
    height: 480
    visible: true
    font.family: "Montserrat"

    Material.theme: Material.Light
    Material.accent: "#001b2a"

    property string currentComponent: "SecureMe.qml"
    property bool isSignIn: true

    Loader {
       id: componentLoader
       anchors.fill: parent
    }

    Connections {
        target: networkManager
                ignoreUnknownSignals: true
 
        onOperationFinished: function(responseRaw, isError) {
            var response = JSON.parse(networkManager.convertToJsonString(responseRaw));
            storageManager.attachAuthToken(response.auth_token);

            if(isError) {
               usernameFieldError.color = "red";
               usernameFieldError.visible = true;
               usernameFieldError.text = "* " + response.message;
               return;
            }

            componentLoader.source = "home.qml"
            
        }
    }


    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 15

        Item {
            Layout.fillWidth: true
            Layout.preferredHeight: 1
            Layout.alignment: Qt.AlignVCenter
        }

        RowLayout {
            spacing: 0
            Layout.fillWidth: true
            anchors.horizontalCenter: parent.horizontalCenter


            anchors.topMargin: 150
  
            Image {
                Layout.preferredWidth: 50
                Layout.preferredHeight: 50
                fillMode: Image.PreserveAspectFit
                source: "images/logo.png"
            }

            Text {
                text: qsTr("SecureMe")
                Layout.alignment: Qt.AlignHCenter
                font.pointSize: 30
                font.weight: Font.Bold
            }
        }

        RowLayout {
            spacing: 10

        Text {
            Layout.topMargin: 20
            font.pointSize: 18
            font.weight:  isSignIn ? Font.Bold : Font.Light 
            text: qsTr("Sign In")
            MouseArea {
                anchors.fill: parent
                onClicked: isSignIn = true
            }
        }

        Rectangle {
            Layout.topMargin: 20
            id: seperator
            height: 18
            width: 1
            color: 'black'
        }

        Text {
            Layout.topMargin: 20

            font.pointSize: 18
            font.weight: isSignIn ? Font.Light : Font.Bold
            text: qsTr("Sign Up")
            MouseArea {
                anchors.fill: parent
                onClicked: isSignIn = false
            
            }
        }

        }

        TextField {
            id: usernameField
            Layout.fillWidth: true
            property bool isBold: false
            property color borderColor: activeFocus ? "#1d5ffe" : "#464a53"
            Layout.topMargin: 15

            placeholderText: qsTr("Username")
            placeholderTextColor: "black"
            font.bold: isBold
            font.weight: isBold ? Font.Bold : Font.Normal
            color: AppStyle.textColor
            background: Item {
                Rectangle {
                    x: 15
                    width: parent.width - 15
                    height: 1
                    y: parent.height - height - 5
                    color: "black"
                }

            }
        }
                Text {
                    id: usernameFieldError
                    font.bold: true
                    Layout.topMargin: -10
                    visible: false
                }

        TextField {
            id: passwordField
            Layout.fillWidth: true
            property bool isBold: false
            property color borderColor: activeFocus ? "#1d5ffe" : "#464a53"
            Layout.topMargin: 20

            placeholderText: qsTr("Password")
            placeholderTextColor: "black"
            font.bold: isBold
            font.weight: isBold ? Font.Bold : Font.Normal
            padding: 0
            color: AppStyle.textColor

            background: Item {
                Rectangle {
                    x: 15
                    width: parent.width - 15
                    height: 1
                    y: parent.height - height - 5
                    color: "black"
                }
            }
            
        }

                TextField {
            id: confirmPassword
            visible: !isSignIn
            Layout.fillWidth: true
            property bool isBold: false
            property color borderColor: activeFocus ? "#1d5ffe" : "#464a53"
            Layout.topMargin: 15

            placeholderText: qsTr("Confirm Password")
            placeholderTextColor: "black"
            font.bold: isBold
            font.weight: isBold ? Font.Bold : Font.Normal
            color: AppStyle.textColor
            onEditingFinished: {

            }
            background: Item {
                Rectangle {
                    x: 15
                    width: parent.width - 15
                    height: 1
                    y: parent.height - height - 5
                    color: "black"
                }

            }
        }


        function createPostData() {
            var jsonObject = {
                "username": usernameField.text,
                "password": passwordField.text
            };

            return jsonObject;
        }

        CustomButton {
            anchors.horizontalCenter: parent.horizontalCenter
            radius: 0
            backgroundColor: "#00c1c9"
            implicitHeight: 50
            implicitWidth: 300
            text: qsTr("Login")
            Layout.topMargin: 15
            handleClick: () => {
            usernameField.focus = false;
            passwordField.focus = false;
            var jsonObject = {
                "username": usernameField.text,
                "password": passwordField.text,
                "fcm_token": storageManager.getFcmToken(),
                "full_model": device.getFullDeviceModel()
            };
            var path = isSignIn ? "login" : "register";
            networkManager.post(jsonObject, `http://secureme.live/api/${path}`);
                
            }
        }

        Item {
            Layout.fillWidth: true
            Layout.fillHeight: true
        }
    }
}
