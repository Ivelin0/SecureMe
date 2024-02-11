rm CMakeCache.txt
rm cmake_install.cmake
rm -r CMakeFiles
rm Makefile
rm -r android-build

cmake -DCMAKE_TOOLCHAIN_FILE=/home/ivelin/Qt/6.6.1/android_arm64_v8a/lib/cmake/Qt6/qt.toolchain.cmake .
make

adb install -r android-build/secureme.apk