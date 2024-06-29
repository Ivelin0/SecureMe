import QtQuick 2.15
import QtQuick.Window 2.15
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.3
import QtQuick.Controls.Fusion 2.3
import QtQuick.Controls.Material 2.5

ApplicationWindow {
    width: 640
    height: 480
    visible: false
    font.family: "Montserrat"

    Material.theme: Material.Light
    Material.accent: "#001b2a"

    Loader {
       id: componentLoader
       anchors.centerIn: parent

    }

    Component.onCompleted: function() {
        networkManager.authenticated_get(serverUrl + "/api/authenticate", (data, isError) => {  
                const {auth_token} = JSON.parse(data);

                if(isError) {
                    componentLoader.source = "Auth.qml"
                } else {
                    componentLoader.source = "home.qml"
                }
        });
    }
}