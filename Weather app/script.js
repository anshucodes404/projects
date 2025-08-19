// Weather App JavaScript
class WeatherApp {
    constructor() {
        this.apiKey = 'YOUR_OPENWEATHER_API_KEY'; // Replace with your API key
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.currentLocation = null;
        this.weatherData = null;
        this.deferredPrompt = null;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupPWA();
        await this.getCurrentLocation();
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 60000); // Update time every minute
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById('searchBtn').addEventListener('click', () => this.showSearchModal());
        document.getElementById('closeSearchBtn').addEventListener('click', () => this.hideSearchModal());
        document.getElementById('searchSubmitBtn').addEventListener('click', () => this.performSearch());
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });

        // Install prompt
        document.getElementById('installBtn').addEventListener('click', () => this.installApp());
        document.getElementById('dismissInstallBtn').addEventListener('click', () => this.hideInstallPrompt());

        // Close modal when clicking outside
        document.getElementById('searchModal').addEventListener('click', (e) => {
            if (e.target.id === 'searchModal') this.hideSearchModal();
        });
    }

    setupPWA() {
        // Service Worker Registration
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        }

        // Install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPrompt();
        });

        // App installed
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.hideInstallPrompt();
        });
    }

    async getCurrentLocation() {
        try {
            if (navigator.geolocation) {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 600000
                    });
                });

                this.currentLocation = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };

                await this.fetchWeatherData();
            } else {
                // Fallback to default location (London)
                this.currentLocation = { lat: 51.5074, lon: -0.1278 };
                await this.fetchWeatherData();
            }
        } catch (error) {
            console.error('Error getting location:', error);
            // Fallback to default location
            this.currentLocation = { lat: 51.5074, lon: -0.1278 };
            await this.fetchWeatherData();
        }
    }

    async fetchWeatherData() {
        try {
            this.showLoading();
            
            // Check if we have a valid API key
            if (this.apiKey === 'YOUR_OPENWEATHER_API_KEY') {
                // Use demo data if no API key is set
                console.log('Using demo weather data - please add your API key');
                this.weatherData = this.getDemoWeatherData();
                this.updateUI();
                this.hideLoading();
                return;
            }
            
            const [currentWeather, forecast] = await Promise.all([
                this.fetchCurrentWeather(),
                this.fetchForecast()
            ]);

            this.weatherData = {
                current: currentWeather,
                forecast: forecast
            };

            this.updateUI();
            this.hideLoading();
        } catch (error) {
            console.error('Error fetching weather data:', error);
            // Fallback to demo data on error
            console.log('Falling back to demo data due to API error');
            this.weatherData = this.getDemoWeatherData();
            this.updateUI();
            this.hideLoading();
        }
    }

    getDemoWeatherData() {
        const now = new Date();
        const demoCurrent = {
            name: 'Demo City',
            main: {
                temp: 22,
                feels_like: 24,
                humidity: 65,
                pressure: 1013
            },
            weather: [{ main: 'Clear', description: 'clear sky' }],
            wind: { speed: 3.5 }
        };

        const demoForecast = {
            list: Array.from({ length: 40 }, (_, i) => {
                const time = new Date(now.getTime() + i * 3 * 60 * 60 * 1000); // 3-hour intervals
                return {
                    dt: Math.floor(time.getTime() / 1000),
                    main: {
                        temp: 20 + Math.sin(i * 0.5) * 8 + (Math.random() - 0.5) * 4
                    },
                    weather: [{ main: i % 3 === 0 ? 'Clouds' : 'Clear', description: 'partly cloudy' }]
                };
            })
        };

        return {
            current: demoCurrent,
            forecast: demoForecast
        };
    }

    async fetchCurrentWeather() {
        const response = await fetch(
            `${this.baseUrl}/weather?lat=${this.currentLocation.lat}&lon=${this.currentLocation.lon}&appid=${this.apiKey}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error('Weather API request failed');
        }
        
        return await response.json();
    }

    async fetchForecast() {
        const response = await fetch(
            `${this.baseUrl}/forecast?lat=${this.currentLocation.lat}&lon=${this.currentLocation.lon}&appid=${this.apiKey}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error('Forecast API request failed');
        }
        
        return await response.json();
    }

    updateUI() {
        if (!this.weatherData) return;

        this.updateCurrentWeather();
        this.updateHourlyForecast();
        this.updateDailyForecast();
        this.updateLocationInfo();
    }

    updateCurrentWeather() {
        const current = this.weatherData.current;
        
        document.getElementById('tempValue').textContent = Math.round(current.main.temp);
        document.getElementById('weatherDescription').textContent = current.weather[0].description;
        document.getElementById('feelsLike').textContent = `${Math.round(current.main.feels_like)}°C`;
        document.getElementById('humidity').textContent = `${current.main.humidity}%`;
        document.getElementById('windSpeed').textContent = `${Math.round(current.wind.speed * 3.6)} km/h`; // Convert m/s to km/h
        document.getElementById('pressure').textContent = `${current.main.pressure} hPa`;

        this.updateWeatherIcon(current.weather[0].main, current.weather[0].description);
    }

    updateWeatherIcon(weatherMain, description) {
        const iconContainer = document.getElementById('weatherIconLarge');
        iconContainer.innerHTML = '';

        let iconHTML = '';
        let iconClass = '';

        switch (weatherMain.toLowerCase()) {
            case 'clear':
                iconHTML = '<div class="sun-large"></div>';
                iconClass = 'sunny';
                break;
            case 'clouds':
                iconHTML = '<div class="cloud-large"></div>';
                iconClass = 'cloudy';
                break;
            case 'rain':
                iconHTML = '<div class="cloud-large rain"></div>';
                iconClass = 'rainy';
                break;
            case 'snow':
                iconHTML = '<div class="cloud-large snow"></div>';
                iconClass = 'snowy';
                break;
            case 'thunderstorm':
                iconHTML = '<div class="cloud-large thunder"></div>';
                iconClass = 'thunder';
                break;
            case 'drizzle':
                iconHTML = '<div class="cloud-large drizzle"></div>';
                iconClass = 'drizzle';
                break;
            case 'mist':
            case 'fog':
                iconHTML = '<div class="cloud-large fog"></div>';
                iconClass = 'foggy';
                break;
            default:
                iconHTML = '<div class="sun-large"></div>';
                iconClass = 'sunny';
        }

        iconContainer.innerHTML = iconHTML;
        iconContainer.className = `weather-icon-large ${iconClass}`;
    }

    updateHourlyForecast() {
        const hourlyContainer = document.getElementById('hourlyContainer');
        hourlyContainer.innerHTML = '';

        const hourlyData = this.weatherData.forecast.list.slice(0, 8); // Next 8 hours

        hourlyData.forEach((hour, index) => {
            const hourItem = document.createElement('div');
            hourItem.className = 'hourly-item';
            hourItem.style.animationDelay = `${index * 0.1}s`;

            const time = new Date(hour.dt * 1000);
            const timeString = time.getHours() === 0 ? '12 AM' : 
                             time.getHours() > 12 ? `${time.getHours() - 12} PM` : 
                             `${time.getHours()} AM`;

            hourItem.innerHTML = `
                <div class="hourly-time">${timeString}</div>
                <div class="hourly-temp">${Math.round(hour.main.temp)}°</div>
                <div class="hourly-icon">${this.getWeatherEmoji(hour.weather[0].main)}</div>
            `;

            hourlyContainer.appendChild(hourItem);
        });
    }

    updateDailyForecast() {
        const dailyContainer = document.getElementById('dailyContainer');
        dailyContainer.innerHTML = '';

        // Group forecast by day and get daily averages
        const dailyData = this.groupForecastByDay();
        const dailyItems = dailyData.slice(0, 7); // 7 days

        dailyItems.forEach((day, index) => {
            const dayItem = document.createElement('div');
            dayItem.className = 'daily-item';
            dayItem.style.animationDelay = `${index * 0.1}s`;

            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            dayItem.innerHTML = `
                <div class="daily-info">
                    <div class="daily-date">${dayName}<br>${monthDay}</div>
                    <div class="daily-icon">${this.getWeatherEmoji(day.weather)}</div>
                </div>
                <div class="daily-temp">${Math.round(day.temp)}°</div>
            `;

            dailyContainer.appendChild(dayItem);
        });
    }

    groupForecastByDay() {
        const dailyMap = new Map();
        
        this.weatherData.forecast.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dayKey = date.toDateString();
            
            if (!dailyMap.has(dayKey)) {
                dailyMap.set(dayKey, {
                    date: date,
                    temps: [],
                    weather: item.weather[0].main,
                    descriptions: []
                });
            }
            
            dailyMap.get(dayKey).temps.push(item.main.temp);
            dailyMap.get(dayKey).descriptions.push(item.weather[0].description);
        });

        return Array.from(dailyMap.values()).map(day => ({
            ...day,
            temp: day.temps.reduce((a, b) => a + b, 0) / day.temps.length
        }));
    }

    getWeatherEmoji(weatherMain) {
        const emojiMap = {
            'clear': '☀️',
            'clouds': '☁️',
            'rain': '🌧️',
            'snow': '❄️',
            'thunderstorm': '⛈️',
            'drizzle': '🌦️',
            'mist': '🌫️',
            'fog': '🌫️'
        };
        
        return emojiMap[weatherMain.toLowerCase()] || '🌤️';
    }

    updateLocationInfo() {
        if (this.weatherData.current.name) {
            document.getElementById('cityName').textContent = this.weatherData.current.name;
            
            // Show demo mode indicator if using demo data
            if (this.apiKey === 'YOUR_OPENWEATHER_API_KEY') {
                const demoIndicator = document.createElement('div');
                demoIndicator.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #f59e0b;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 500;
                    z-index: 1001;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                `;
                demoIndicator.textContent = 'DEMO MODE';
                document.body.appendChild(demoIndicator);
                
                // Remove after 5 seconds
                setTimeout(() => demoIndicator.remove(), 5000);
            }
        }
    }

    updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        document.getElementById('dateTime').textContent = now.toLocaleDateString('en-US', options);
    }

    async performSearch() {
        const query = document.getElementById('searchInput').value.trim();
        if (!query) return;

        try {
            const response = await fetch(
                `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${this.apiKey}`
            );
            
            if (!response.ok) throw new Error('Search failed');
            
            const results = await response.json();
            this.displaySearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
            this.showError('Search failed. Please try again.');
        }
    }

    displaySearchResults(results) {
        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = '';

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No cities found</p>';
            return;
        }

        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <div class="city-name">${result.name}</div>
                <div class="country">${result.country}</div>
            `;
            
            resultItem.addEventListener('click', () => {
                this.selectLocation(result.lat, result.lon, result.name);
            });
            
            resultsContainer.appendChild(resultItem);
        });
    }

    async selectLocation(lat, lon, name) {
        this.currentLocation = { lat, lon };
        this.hideSearchModal();
        document.getElementById('searchInput').value = '';
        await this.fetchWeatherData();
    }

    showSearchModal() {
        document.getElementById('searchModal').style.display = 'flex';
        document.getElementById('searchInput').focus();
    }

    hideSearchModal() {
        document.getElementById('searchModal').style.display = 'none';
        document.getElementById('searchResults').innerHTML = '';
    }

    showLoading() {
        document.getElementById('loadingScreen').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
    }

    hideLoading() {
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
    }

    showError(message) {
        // Create and show error notification
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ef4444;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 1001;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    showInstallPrompt() {
        document.getElementById('installPrompt').style.display = 'block';
    }

    hideInstallPrompt() {
        document.getElementById('installPrompt').style.display = 'none';
    }

    async installApp() {
        if (!this.deferredPrompt) return;
        
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        
        this.deferredPrompt = null;
        this.hideInstallPrompt();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});

// Handle offline/online status
window.addEventListener('online', () => {
    console.log('App is online');
    // Refresh weather data if needed
});

window.addEventListener('offline', () => {
    console.log('App is offline');
    // Show offline message or cached data
});

// Add touch gestures for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe up - could refresh weather
            console.log('Swipe up detected');
        } else {
            // Swipe down - could show more details
            console.log('Swipe down detected');
        }
    }
}
