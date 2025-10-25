import React, { useState, useEffect } from 'react';
import { Leaf, TrendingDown, Award, Calendar, Zap, Car, Utensils, ShoppingBag, Home, Plus, X, CheckCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const CARBON_FACTORS = {
  transport: {
    car: 0.21,
    bus: 0.089,
    train: 0.041,
    bike: 0,
    walk: 0,
    motorcycle: 0.113
  },
  meals: {
    beef: 2.5,
    pork: 1.2,
    chicken: 0.9,
    fish: 0.7,
    vegetarian: 0.4,
    vegan: 0.2
  },
  shopping: {
    electronics: 50,
    clothing: 10,
    groceries: 2,
    other: 5
  },
  energy: {
    electricity: 0.92,
    heating: 2.3,
    cooling: 1.8
  }
};

const TIPS = [
  "🚴 Biking just 5km instead of driving saves 1kg of CO2!",
  "🌱 One vegan meal per day can save 500kg CO2 per year",
  "💡 LED bulbs use 75% less energy than traditional bulbs",
  "🚗 Carpooling can cut your commute emissions in half",
  "🔌 Unplugging devices saves phantom energy consumption",
  "🛍️ Buying second-hand reduces manufacturing emissions by 80%",
  "🌡️ Lowering thermostat by 1°C saves 300kg CO2 yearly",
  "🥗 Local produce has 5x less carbon footprint than imported"
];

const ACHIEVEMENTS = [
  { id: 1, name: 'First Step', desc: 'Log your first activity', icon: '🌱', threshold: 1 },
  { id: 2, name: 'Week Warrior', desc: '7 day streak', icon: '🔥', threshold: 7 },
  { id: 3, name: 'Green Giant', desc: 'Save 10kg CO2', icon: '🌳', threshold: 10 },
  { id: 4, name: 'Eco Champion', desc: '30 day streak', icon: '👑', threshold: 30 },
  { id: 5, name: 'Carbon Crusher', desc: 'Save 50kg CO2', icon: '⚡', threshold: 50 }
];

const WEEKLY_CHALLENGES = [
  { id: 1, name: 'Bike Week', desc: 'Bike or walk 5 days this week', type: 'transport', target: 5, icon: '🚴' },
  { id: 2, name: 'Meatless Monday', desc: 'Have 4 plant-based meals', type: 'meals', target: 4, icon: '🥗' },
  { id: 3, name: 'Zero Waste', desc: 'No new shopping this week', type: 'shopping', target: 0, icon: '♻️' },
  { id: 4, name: 'Energy Saver', desc: 'Reduce energy use by 20%', type: 'energy', target: 0, icon: '💡' }
];

const COMPARISON_DATA = {
  avgPersonYearly: 4000,
  avgPersonDaily: 11,
  countries: {
    usa: 16,
    uk: 8,
    india: 1.9,
    global: 4.5
  }
};

export default function CarbonTracker() {
  const [activities, setActivities] = useState([]);
  const [showLogger, setShowLogger] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [streak, setStreak] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);
  const [viewMode, setViewMode] = useState('week');
  const [showShareModal, setShowShareModal] = useState(false);
  
  const [newActivity, setNewActivity] = useState({
    category: 'transport',
    type: 'car',
    distance: '',
    quantity: '',
    hours: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const saved = localStorage.getItem('carbonActivities');
    if (saved) {
      setActivities(JSON.parse(saved));
    }
    const savedStreak = localStorage.getItem('carbonStreak');
    if (savedStreak) setStreak(parseInt(savedStreak));
  }, []);

  useEffect(() => {
    localStorage.setItem('carbonActivities', JSON.stringify(activities));
    calculateStreak();
    calculateTotalSaved();
  }, [activities]);

  const calculateStreak = () => {
    if (activities.length === 0) return;
    const dates = [...new Set(activities.map(a => a.date))].sort().reverse();
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]);
      const expected = new Date();
      expected.setDate(expected.getDate() - i);
      if (dates[i] === expected.toISOString().split('T')[0]) {
        currentStreak++;
      } else {
        break;
      }
    }
    setStreak(currentStreak);
    localStorage.setItem('carbonStreak', currentStreak.toString());
  };

  const calculateTotalSaved = () => {
    const baseline = 50;
    const total = activities.reduce((sum, activity) => sum + activity.carbon, 0);
    const saved = Math.max(0, (activities.length * 10) - total);
    setTotalSaved(saved);
  };

  const calculateCarbon = (activity) => {
    const { category, type, distance, quantity, hours } = activity;
    let carbon = 0;

    switch (category) {
      case 'transport':
        carbon = (parseFloat(distance) || 0) * (CARBON_FACTORS.transport[type] || 0);
        break;
      case 'meals':
        carbon = (parseFloat(quantity) || 1) * (CARBON_FACTORS.meals[type] || 0);
        break;
      case 'shopping':
        carbon = (parseFloat(quantity) || 1) * (CARBON_FACTORS.shopping[type] || 0);
        break;
      case 'energy':
        carbon = (parseFloat(hours) || 0) * (CARBON_FACTORS.energy[type] || 0);
        break;
    }
    return parseFloat(carbon.toFixed(2));
  };

  const addActivity = () => {
    if (!newActivity.type) return;
    const carbon = calculateCarbon(newActivity);
    const activity = {
      ...newActivity,
      carbon,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    setActivities([activity, ...activities]);
    setNewActivity({
      category: 'transport',
      type: 'car',
      distance: '',
      quantity: '',
      hours: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowLogger(false);
  };

  const deleteActivity = (id) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const getChartData = () => {
    const now = new Date();
    const days = viewMode === 'week' ? 7 : viewMode === 'month' ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayActivities = activities.filter(a => a.date === dateStr);
      const carbon = dayActivities.reduce((sum, a) => sum + a.carbon, 0);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        carbon: parseFloat(carbon.toFixed(2)),
        count: dayActivities.length
      });
    }
    return data;
  };

  const getCategoryData = () => {
    const categories = {};
    activities.forEach(activity => {
      categories[activity.category] = (categories[activity.category] || 0) + activity.carbon;
    });
    
    const data = Object.entries(categories).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: parseFloat(value.toFixed(2))
    }));
    
    // Return empty array with placeholder if no data
    if (data.length === 0) {
      return [{ name: 'No Data', value: 1 }];
    }
    
    return data;
  };

  const getTotalCarbon = () => {
    return activities.reduce((sum, a) => sum + a.carbon, 0).toFixed(2);
  };

  const getAverageDaily = () => {
    const days = new Set(activities.map(a => a.date)).size || 1;
    return (getTotalCarbon() / days).toFixed(2);
  };

  const getUnlockedAchievements = () => {
    return ACHIEVEMENTS.filter(achievement => {
      if (achievement.id === 1 && activities.length >= 1) return true;
      if ((achievement.id === 2 || achievement.id === 4) && streak >= achievement.threshold) return true;
      if ((achievement.id === 3 || achievement.id === 5) && totalSaved >= achievement.threshold) return true;
      return false;
    });
  };

  const getInsight = () => {
    const total = parseFloat(getTotalCarbon());
    const avgDaily = parseFloat(getAverageDaily());
    const treesEquivalent = (total / 21).toFixed(1);
    
    if (total < 10) return `Great start! Keep tracking to see your full impact.`;
    if (avgDaily < 5) return `🌟 Amazing! You're 60% below average daily emissions (12kg)!`;
    if (avgDaily < 8) return `💚 Good job! You're 33% below average daily emissions!`;
    return `Your total footprint equals ${treesEquivalent} trees needed to offset it. Let's reduce it together!`;
  };

  const getPredictiveInsights = () => {
    if (activities.length < 3) return null;
    
    const totalDays = new Set(activities.map(a => a.date)).size;
    const avgDaily = parseFloat(getTotalCarbon()) / totalDays;
    
    // Project for month, year
    const monthProjection = (avgDaily * 30).toFixed(1);
    const yearProjection = (avgDaily * 365).toFixed(1);
    
    // Calculate trend (last 7 days vs previous 7 days)
    const now = new Date();
    const last7Days = [];
    const prev7Days = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last7Days.push(...activities.filter(a => a.date === dateStr));
      
      const prevDate = new Date(now);
      prevDate.setDate(prevDate.getDate() - (i + 7));
      const prevDateStr = prevDate.toISOString().split('T')[0];
      prev7Days.push(...activities.filter(a => a.date === prevDateStr));
    }
    
    const last7Total = last7Days.reduce((sum, a) => sum + a.carbon, 0);
    const prev7Total = prev7Days.reduce((sum, a) => sum + a.carbon, 0);
    const trend = prev7Total > 0 ? (((last7Total - prev7Total) / prev7Total) * 100).toFixed(1) : 0;
    
    // Trees needed
    const treesNeeded = Math.ceil(yearProjection / 21);
    
    // Comparison to global average
    const vsGlobal = (((avgDaily - COMPARISON_DATA.countries.global) / COMPARISON_DATA.countries.global) * 100).toFixed(0);
    
    return {
      monthProjection,
      yearProjection,
      trend: parseFloat(trend),
      treesNeeded,
      vsGlobal: parseFloat(vsGlobal),
      avgDaily
    };
  };

  const getAlternativeSuggestion = (activity) => {
    const suggestions = {
      transport: {
        car: { alt: 'public transit or bike', saving: 0.12, emoji: '🚌' },
        motorcycle: { alt: 'bike or e-scooter', saving: 0.113, emoji: '🚴' },
        bus: { alt: 'train or carpool', saving: 0.048, emoji: '🚆' },
        train: { alt: 'bike for short trips', saving: 0.041, emoji: '🚴' }
        // bike and walk are zero emission, no suggestion needed
      },
      meals: {
        beef: { alt: 'chicken or fish', saving: 1.6, emoji: '🍗' },
        pork: { alt: 'vegetarian meal', saving: 0.8, emoji: '🥗' },
        chicken: { alt: 'vegan option', saving: 0.7, emoji: '🌱' },
        fish: { alt: 'vegetarian meal', saving: 0.3, emoji: '🥗' },
        vegetarian: { alt: 'vegan option', saving: 0.2, emoji: '🌱' }
        // vegan is lowest, no suggestion
      },
      shopping: {
        electronics: { alt: 'refurbished device', saving: 30, emoji: '♻️' },
        clothing: { alt: 'second-hand clothing', saving: 8, emoji: '👕' },
        groceries: { alt: 'local produce', saving: 0.5, emoji: '🥕' },
        other: { alt: 'buy used or rent', saving: 3, emoji: '♻️' }
      },
      energy: {
        electricity: { alt: 'renewable energy plan', saving: 0.46, emoji: '☀️' },
        heating: { alt: 'lower thermostat 1°C', saving: 0.5, emoji: '🌡️' },
        cooling: { alt: 'use fans instead', saving: 0.9, emoji: '💨' }
      }
    };
    
    const suggestion = suggestions[activity.category]?.[activity.type];
    if (!suggestion) return null;
    
    let potentialSaving = 0;
    if (activity.category === 'transport') {
      potentialSaving = (parseFloat(activity.distance) || 0) * suggestion.saving;
    } else if (activity.category === 'meals') {
      potentialSaving = (parseFloat(activity.quantity) || 1) * suggestion.saving;
    } else if (activity.category === 'shopping') {
      potentialSaving = (parseFloat(activity.quantity) || 1) * suggestion.saving;
    } else if (activity.category === 'energy') {
      potentialSaving = (parseFloat(activity.hours) || 0) * suggestion.saving;
    }
    
    return {
      ...suggestion,
      potentialSaving: potentialSaving.toFixed(2)
    };
  };

  const generateShareCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#10b981');
    gradient.addColorStop(1, '#14b8a6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);
    
    // Add some decorative circles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.arc(1000, 100, 150, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(200, 500, 100, 0, Math.PI * 2);
    ctx.fill();
    
    // Main content box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.roundRect(100, 100, 1000, 430, 20);
    ctx.fill();
    
    // Title
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 60px system-ui';
    ctx.fillText('🌱 My Carbon Impact', 150, 200);
    
    // Stats
    const total = getTotalCarbon();
    const avgDaily = getAverageDaily();
    const treesNeeded = Math.ceil((avgDaily * 365) / 21);
    
    ctx.font = 'bold 80px system-ui';
    ctx.fillStyle = '#10b981';
    ctx.fillText(`${total} kg CO₂`, 150, 320);
    
    ctx.font = '35px system-ui';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(`Total Carbon Footprint Tracked`, 150, 370);
    
    // Additional stats
    ctx.font = 'bold 40px system-ui';
    ctx.fillStyle = '#1f2937';
    ctx.fillText(`📊 ${avgDaily} kg/day average`, 150, 420);
    ctx.fillText(`🌳 ${treesNeeded} trees needed/year`, 150, 470);
    
    // Footer
    ctx.font = 'bold 30px system-ui';
    ctx.fillStyle = '#10b981';
    ctx.fillText('Track yours at EcoTrack', 150, 510);
    
    // Streak badge if exists
    if (streak > 0) {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(950, 200, 70, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 50px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(streak.toString(), 950, 220);
      ctx.font = '20px system-ui';
      ctx.fillText('DAY STREAK', 950, 245);
      ctx.textAlign = 'left';
    }
    
    return canvas.toDataURL('image/png');
  };

  const downloadShareCard = () => {
    const dataUrl = generateShareCard();
    const link = document.createElement('a');
    link.download = `ecotrack-${new Date().toISOString().split('T')[0]}.png`;
    link.href = dataUrl;
    link.click();
  };

  const copyShareText = () => {
    const text = `🌱 I've tracked ${getTotalCarbon()} kg of CO₂ with EcoTrack!\n📊 Daily average: ${getAverageDaily()} kg\n🔥 ${streak} day streak!\n\nJoin me in tracking your carbon footprint! #CarbonTracking #EcoTrack #ClimateAction`;
    navigator.clipboard.writeText(text);
    alert('Share text copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-2 rounded-xl">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  EcoTrack
                </h1>
                <p className="text-xs text-gray-500">Your Carbon Journey</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowShareModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                Share
              </button>
              <button
                onClick={() => setShowLogger(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Log Activity
              </button>
            </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-1 flex gap-1 border border-emerald-100">
          {['dashboard', 'activities', 'achievements'].map(tab => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                currentTab === tab
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        {currentTab === 'dashboard' && (
          <div className="space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-emerald-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Carbon</p>
                    <p className="text-2xl font-bold text-gray-800">{getTotalCarbon()}</p>
                    <p className="text-xs text-gray-500">kg CO₂</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-emerald-500" />
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Daily Average</p>
                    <p className="text-2xl font-bold text-gray-800">{getAverageDaily()}</p>
                    <p className="text-xs text-gray-500">kg CO₂/day</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-orange-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current Streak</p>
                    <p className="text-2xl font-bold text-gray-800">{streak}</p>
                    <p className="text-xs text-gray-500">days</p>
                  </div>
                  <Zap className="w-8 h-8 text-orange-500" />
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">CO₂ Saved</p>
                    <p className="text-2xl font-bold text-gray-800">{totalSaved.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">kg CO₂</p>
                  </div>
                  <Award className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Insight Card */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Leaf className="w-5 h-5" />
                Your Impact Insight
              </h3>
              <p className="text-white/90">{getInsight()}</p>
            </div>

            {/* Predictive Insights */}
            {getPredictiveInsights() && (
              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-purple-100">
                <h3 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-purple-500" />
                  Predictive Insights & Projections
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">This Month</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {getPredictiveInsights().monthProjection} kg
                    </p>
                    <p className="text-xs text-gray-500">projected CO₂</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">This Year</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {getPredictiveInsights().yearProjection} kg
                    </p>
                    <p className="text-xs text-gray-500">projected CO₂</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Trees Needed</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {getPredictiveInsights().treesNeeded} 🌳
                    </p>
                    <p className="text-xs text-gray-500">to offset yearly</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">7-Day Trend</p>
                      <p className={`text-xl font-bold ${getPredictiveInsights().trend < 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {getPredictiveInsights().trend > 0 ? '+' : ''}{getPredictiveInsights().trend}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">vs Global Avg</p>
                      <p className={`text-xl font-bold ${getPredictiveInsights().vsGlobal < 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {getPredictiveInsights().vsGlobal > 0 ? '+' : ''}{getPredictiveInsights().vsGlobal}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View Mode Selector */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-emerald-100">
              <div className="flex gap-2 mb-4">
                {['week', 'month', 'quarter'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      viewMode === mode
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      borderRadius: '8px',
                      border: '1px solid #10b981'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="carbon" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Charts Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-emerald-100">
                <h3 className="font-semibold mb-4 text-gray-800">By Category</h3>
                
                {activities.length === 0 ? (
                  <div className="h-[250px] flex items-center justify-center text-gray-400">
                    <p>Log activities to see breakdown</p>
                  </div>
                ) : (
                  <div className="space-y-4 py-4">
                    {getCategoryData().map((category, index) => {
                      const total = getCategoryData().reduce((sum, cat) => sum + cat.value, 0);
                      const percentage = ((category.value / total) * 100).toFixed(1);
                      return (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-gray-800">{category.name}</span>
                            <span className="text-sm font-medium text-gray-600">{category.value} kg · {percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                            <div
                              className="h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: COLORS[index % COLORS.length]
                              }}
                            >
                              <span className="text-white text-xs font-bold">{percentage}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-emerald-100">
                <h3 className="font-semibold mb-4 text-gray-800">Activity Frequency</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        borderRadius: '8px',
                        border: '1px solid #3b82f6'
                      }} 
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-emerald-100">
              <h3 className="font-semibold mb-3 text-gray-800">💡 Green Tips</h3>
              <div className="grid md:grid-cols-2 gap-2">
                {TIPS.slice(0, 4).map((tip, i) => (
                  <div key={i} className="bg-emerald-50 rounded-lg p-3 text-sm text-gray-700">
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentTab === 'activities' && (
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-12 text-center border border-emerald-100">
                <Leaf className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No activities yet</h3>
                <p className="text-gray-600 mb-4">Start logging your daily activities to track your carbon footprint!</p>
                <button
                  onClick={() => setShowLogger(true)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Log Your First Activity
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {activities.map(activity => {
                  const suggestion = getAlternativeSuggestion(activity);
                  return (
                    <div key={activity.id} className="bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-emerald-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${
                            activity.category === 'transport' ? 'bg-blue-100' :
                            activity.category === 'meals' ? 'bg-orange-100' :
                            activity.category === 'shopping' ? 'bg-purple-100' :
                            'bg-yellow-100'
                          }`}>
                            {activity.category === 'transport' && <Car className="w-6 h-6 text-blue-600" />}
                            {activity.category === 'meals' && <Utensils className="w-6 h-6 text-orange-600" />}
                            {activity.category === 'shopping' && <ShoppingBag className="w-6 h-6 text-purple-600" />}
                            {activity.category === 'energy' && <Home className="w-6 h-6 text-yellow-600" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 capitalize">{activity.type}</h4>
                            <p className="text-sm text-gray-600">
                              {activity.category === 'transport' && `${activity.distance} km`}
                              {activity.category === 'meals' && `${activity.quantity || 1} meal(s)`}
                              {activity.category === 'shopping' && `${activity.quantity || 1} item(s)`}
                              {activity.category === 'energy' && `${activity.hours} hours`}
                              {' • '} {new Date(activity.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-800">{activity.carbon}</p>
                            <p className="text-xs text-gray-500">kg CO₂</p>
                          </div>
                          <button
                            onClick={() => deleteActivity(activity.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5 text-red-500" />
                          </button>
                        </div>
                      </div>
                      {suggestion && (
                        <div className="mt-2 bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                          <p className="text-sm text-emerald-800 font-medium">
                            💡 Try {suggestion.emoji} {suggestion.alt} instead - Save {suggestion.potentialSaving} kg CO₂!
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {currentTab === 'achievements' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">🏆 Your Achievements</h3>
              <p className="text-white/90">
                Unlocked {getUnlockedAchievements().length} of {ACHIEVEMENTS.length} achievements
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {ACHIEVEMENTS.map(achievement => {
                const unlocked = getUnlockedAchievements().some(a => a.id === achievement.id);
                return (
                  <div
                    key={achievement.id}
                    className={`rounded-xl p-6 border-2 transition-all ${
                      unlocked
                        ? 'bg-white/80 backdrop-blur-lg border-emerald-300 shadow-lg'
                        : 'bg-gray-100/50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-5xl ${unlocked ? 'grayscale-0' : 'grayscale opacity-40'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold text-lg ${unlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                          {achievement.name}
                        </h4>
                        <p className={`text-sm ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                          {achievement.desc}
                        </p>
                      </div>
                      {unlocked && <CheckCircle className="w-6 h-6 text-emerald-500" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Activity Logger Modal */}
      {showLogger && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Log Activity</h2>
              <button onClick={() => setShowLogger(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {['transport', 'meals', 'shopping', 'energy'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setNewActivity({ ...newActivity, category: cat, type: Object.keys(CARBON_FACTORS[cat])[0] })}
                      className={`p-3 rounded-lg border-2 transition-all capitalize ${
                        newActivity.category === cat
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newActivity.type}
                  onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 outline-none"
                >
                  {Object.keys(CARBON_FACTORS[newActivity.category] || {}).map(type => (
                    <option key={type} value={type} className="capitalize">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {newActivity.category === 'transport' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Distance (km)</label>
                  <input
                    type="number"
                    value={newActivity.distance}
                    onChange={(e) => setNewActivity({ ...newActivity, distance: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 outline-none"
                    placeholder="Enter distance"
                  />
                </div>
              )}

              {(newActivity.category === 'meals' || newActivity.category === 'shopping') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={newActivity.quantity}
                    onChange={(e) => setNewActivity({ ...newActivity, quantity: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 outline-none"
                    placeholder="Enter quantity"
                  />
                </div>
              )}

              {newActivity.category === 'energy' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hours</label>
                  <input
                    type="number"
                    value={newActivity.hours}
                    onChange={(e) => setNewActivity({ ...newActivity, hours: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 outline-none"
                    placeholder="Enter hours"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newActivity.date}
                  onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 outline-none"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <p className="text-sm text-gray-600 mb-1">Estimated Carbon Impact:</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {calculateCarbon(newActivity).toFixed(2)} kg CO₂
                </p>
              </div>

              <button
                onClick={addActivity}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Log Activity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Share Your Progress</h2>
              <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Preview */}
              <div className="bg-gray-100 rounded-xl p-4">
                <img 
                  src={generateShareCard()} 
                  alt="Share card preview" 
                  className="w-full rounded-lg shadow-lg"
                />
              </div>

              {/* Share Options */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={downloadShareCard}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Award className="w-5 h-5" />
                  Download Image
                </button>
                <button
                  onClick={copyShareText}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Award className="w-5 h-5" />
                  Copy Share Text
                </button>
              </div>

              {/* Stats Preview */}
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <h3 className="font-semibold text-emerald-800 mb-2">Your Share Stats:</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-emerald-600">{getTotalCarbon()}</p>
                    <p className="text-xs text-gray-600">kg CO₂ tracked</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{streak}</p>
                    <p className="text-xs text-gray-600">day streak</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{activities.length}</p>
                    <p className="text-xs text-gray-600">activities logged</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}