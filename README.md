# SecureMe - Smart Device Protection System
 
![SecureMe](https://github.com/user-attachments/assets/c1e49d66-0f4c-4dcd-9a05-46bcd62e12cf)

A comprehensive multi-platform security solution that provides additional physical-level protection for smart devices across Android, Linux, and Windows platforms.
 
## 🛡️ Overview
 
SecureMe is an integrated security system designed to protect smart devices from various threats through real-time monitoring, automated notifications, and comprehensive analysis tools. The system consists of a "smart" client installed on the specific device, a central server for data processing, and a web dashboard for management and monitoring.
The word "smart" comes from the fact that it can be shared and connected across all type of devices and operating systems through an account.

## 🏆 Main cause

SecureMe is an award-winning cybersecurity project that achieved recognition at multiple international Bulgarian olympiads in 2024. The project was developed to address the growing need for comprehensive, cross-platform security solutions in an increasingly connected world.
Current Status: While not being mantained ever since it had followed a successful competition phase. The codebase represents a fully functional security solution that demonstrates advanced concepts in multi-platform security architecture. 

## ✨ Key Features

![Functionalities](https://github.com/user-attachments/assets/967d4a89-5720-4d1e-a4da-f95b91b2b62f)

### 📍 Real-time Location Tracking
- Continuous device location monitoring with a few minutes intervals
- Historical location data with 100m movement threshold
- Interactive map visualization with filterable date ranges
- Location history stored and accessible through web dashboard
 
### 🔔 Device Status Notifications
- Instant notifications when devices come online
- Cross-device alert system for all connected devices
- Centralized notification management through a single account
 
### 📷 Security Camera Integration
- Automatic photo capture on failed password attempts
- Images stored in database with timestamp information
- Immediate alerts sent to all connected devices when unauthorized access is detected
 
### 🌐 Cross-Platform Compatibility
- **Mobile**: Android devices with various distributions (Samsung, Xiaomi, ASUS, etc.)
- **Desktop**: Windows and Linux (Ubuntu, Debian, CentOS, etc.)
- **Web Dashboard**: Responsive design accessible from any browser
 
## 🏗️ System Architecture
 
![AndroidExtension](https://github.com/user-attachments/assets/b99cc36c-1f4f-430b-9246-b347d2aa2324)

## 🔧 Technical Stack
 
| Component | Technology | Purpose |
|-----------|------------|---------|
| **Smart Client** | C++, Java, Qt6, QML | Cross-platform device monitoring |
| **Server** | Node.js, TypeScript, Express | API and data processing |
| **Database** | MongoDB, Redis | Data storage and caching |
| **Web Dashboard** | React, TypeScript, Tailwind CSS | User interface and analytics |
| **Messaging** | Firebase Cloud Messaging | Push notifications |
| **Build System** | CMake, Android NDK | Cross-platform compilation |
 
## 🚀 Quick Start
 
### Prerequisites
 
- **Qt6 SDK** - For cross-platform application development
- **Android NDK** - For mobile builds
- **Node.js** (v16+) - For server runtime
- **MongoDB** - Primary database
- **Redis** - Caching and session storage
- **Firebase Project** - For push notifications
 
### Installation
 
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/secureme.git
   cd secureme
   ```
 
2. **Install dependencies**
   ```bash
   # Install Qt6 and required libraries
   # Configure Android NDK path
   # Install Node.js dependencies
   npm install
   ```
 
3. **Configure environment**
   ```bash
   # Copy environment template
   cp .env.example .env
 
   # Edit configuration
   nano .env
   ```
 
4. **Build and run**
   ```bash
   # Run startup script
   ./start.sh
   ```
 
### Configuration
 
Create a `.env` file with the following variables:
 
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/secureme
REDIS_URL=redis://localhost:6379
 
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
 
# Server Configuration
PORT=3000
JWT_SECRET=your-jwt-secret
SSL_CERT_PATH=/path/to/cert.pem
SSL_KEY_PATH=/path/to/key.pem
```
 
## 📱 Usage
 
### Device Registration
 
1. **Mobile App Registration**
   - Install the SecureMe app on your device
   - Create an account with email and secure password
   - Grant necessary permissions (location, camera, notifications)
 
2. **Desktop Client Setup**
   - Download and install the desktop client
   - Log in with your existing account or create a new one
   - Configure security preferences
 
3. **Web Dashboard Access**
   - Visit the web dashboard at `https://secureme.online`
   - Log in with your credentials
   - Monitor all connected devices from one interface
 
### Monitoring Features
 
- **Real-time Location**: View current device locations on interactive maps
- **Security Alerts**: Receive instant notifications for security events
- **Device Status**: Monitor online/offline status of all devices
- **History Review**: Analyze historical data with date filters
 
## 🔒 Security Features
 
### Data Protection
- **End-to-end encryption** for all communications
- **Secure token-based authentication** with JWT
- **Encrypted local storage** for sensitive data
- **SSL/TLS encryption** for web traffic
 
**⚠️ Disclaimer**: SecureMe provides additional physical-level security for smart devices and should be used in conjunction with standard security practices. Users are responsible for complying with local privacy and surveillance laws.
