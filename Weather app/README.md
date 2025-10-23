# 🌤️ Weather App

A beautiful, animated weather application built with HTML, CSS, and JavaScript. Features a mobile-first design and can be installed as a Progressive Web App (PWA) on Windows laptops and other devices.

## ✨ Features

- **Real-time Weather Data**: Current weather conditions and forecasts
- **Beautiful Animated UI**: Smooth animations and modern design
- **Mobile-First Design**: Responsive layout that works on all devices
- **PWA Support**: Installable as a standalone app on Windows
- **Offline Functionality**: Works without internet connection
- **Location Services**: Automatic location detection or manual city search
- **Hourly & Daily Forecasts**: Detailed weather predictions
- **Search Functionality**: Find weather for any city worldwide
- **Touch Gestures**: Swipe support for mobile devices

## 🚀 Installation

### Option 1: Install as PWA (Recommended)

1. Open the app in a modern browser (Chrome, Edge, Firefox)
2. Look for the install prompt or click the install button in your browser
3. The app will be installed and can run independently

### Option 2: Run Locally

1. Clone or download the project files
2. Open `index.html` in your web browser
3. Allow location access when prompted

## 🔧 Setup

### 1. Get OpenWeather API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Replace `YOUR_OPENWEATHER_API_KEY` in `script.js` with your actual API key

```javascript
// In script.js, line 3
this.apiKey = 'your_actual_api_key_here';
```

### 2. Configure PWA Settings

The app is already configured as a PWA with:
- Service Worker for offline functionality
- Web App Manifest for installation
- Cache strategies for optimal performance

## 📱 Usage

### Current Weather
- View current temperature, feels like, humidity, wind speed, and pressure
- Beautiful animated weather icons based on conditions
- Real-time location-based weather data

### Search Locations
- Tap the search button (🔍) in the top right
- Enter any city name
- Select from search results to view weather

### Forecasts
- **Hourly**: Scrollable 8-hour forecast
- **Daily**: 7-day weather predictions
- All data includes temperature and weather conditions

### Offline Mode
- App caches weather data for offline viewing
- Service worker handles background updates
- Works without internet connection

## 🎨 Design Features

### Animations
- Smooth loading animations
- Weather icon animations (sun rotation, cloud floating, rain falling)
- Staggered entrance animations for UI elements
- Hover effects and micro-interactions

### Responsive Design
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interface
- Optimized for both portrait and landscape orientations

### Visual Elements
- Gradient backgrounds
- Glassmorphism effects with backdrop blur
- Smooth transitions and transforms
- Modern typography with Inter font

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic markup and PWA support
- **CSS3**: Modern layouts, animations, and responsive design
- **JavaScript (ES6+)**: Modern async/await, classes, and modules
- **Service Workers**: Offline functionality and caching
- **Web APIs**: Geolocation, Fetch API, and PWA features

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 11.1+
- Edge 79+

### PWA Features
- Installable on Windows, macOS, Android, and iOS
- Offline functionality
- Background sync
- Push notifications (if implemented)
- App-like experience

## 📁 Project Structure

```
Weather app/
├── index.html          # Main HTML file
├── style.css           # Styles and animations
├── script.js           # JavaScript functionality
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
├── assets/            # Icons and images
│   └── weather-icon.svg
└── README.md          # This file
```

## 🔒 Privacy & Security

- **Location Data**: Only used for weather information, not stored
- **API Calls**: Secure HTTPS requests to OpenWeather API
- **Local Storage**: Minimal data stored locally for app functionality
- **No Tracking**: No analytics or user tracking implemented

## 🚀 Performance Features

- **Lazy Loading**: Images and resources loaded as needed
- **Efficient Caching**: Smart cache strategies for different content types
- **Optimized Animations**: Hardware-accelerated CSS animations
- **Minimal Dependencies**: No external libraries, pure vanilla code

## 🐛 Troubleshooting

### Common Issues

1. **Weather not loading**
   - Check your API key in `script.js`
   - Ensure internet connection
   - Allow location access in browser

2. **App won't install**
   - Use a modern browser (Chrome/Edge recommended)
   - Ensure HTTPS or localhost
   - Check if PWA is already installed

3. **Location not working**
   - Allow location access in browser settings
   - Check if GPS is enabled on mobile
   - App will fallback to default location

### Debug Mode

Open browser console (F12) to see:
- Service worker registration status
- API call results
- Error messages and debugging info

## 🔮 Future Enhancements

- [ ] Dark/Light theme toggle
- [ ] Weather alerts and notifications
- [ ] Multiple unit systems (Celsius/Fahrenheit)
- [ ] Weather maps integration
- [ ] Historical weather data
- [ ] Weather widgets for desktop
- [ ] Voice commands
- [ ] Weather-based recommendations

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Ensure all files are properly downloaded
4. Verify your API key is correct

---

**Enjoy your beautiful weather app! 🌤️✨**
