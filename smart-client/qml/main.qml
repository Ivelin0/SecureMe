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

    Loader {
       id: componentLoader
       anchors.centerIn: parent

    }

     function onLoa() {

     }
    Component.onCompleted: {
        console.log('REQUESTED SENDED REQUESTED SENDED REQUESTED SENDED REQUESTED SENDED REQUESTED SENDED');
         networkManager.authenticated_get("https://secureme.live/api/authenticate");
    }


    Connections {
        target: networkManager
                        ignoreUnknownSignals: true


        function onOperationFinished(responseData, isError) {
        console.log(responseData);
            var json = JSON.parse(networkManager.convertToJsonString(responseData));

            if(isError) {
               componentLoader.source = "SecureMe.qml"
               return;
            }
            console.log(json.auth_token);
            storageManager.attachAuthToken(json.auth_token);
            console.log(storageManager.getAuthToken());
            componentLoader.source = "home.qml"
            
        }
    }
}
