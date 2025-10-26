import React, { useState, useEffect } from 'react';
import { Leaf, TrendingDown, Award, Calendar, Zap, Car, Utensils, ShoppingBag, Home, Plus, X, CheckCircle, ArrowRight, Sparkles, BarChart3, Target, Moon, Sun } from 'lucide-react';
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

const LEVELS = [
  { name: 'Bronze Beginner', minCarbon: 0, maxCarbon: 50, color: '#cd7f32', icon: '🥉', benefits: 'Just getting started!' },
  { name: 'Silver Saver', minCarbon: 50, maxCarbon: 100, color: '#C0C0C0', icon: '🥈', benefits: 'Making good progress!' },
  { name: 'Gold Guardian', minCarbon: 100, maxCarbon: 200, color: '#FFD700', icon: '🥇', benefits: 'Environmental champion!' },
  { name: 'Platinum Pioneer', minCarbon: 200, maxCarbon: Infinity, color: '#E5E4E2', icon: '💎', benefits: 'Elite eco-warrior!' }
];

// Simulated leaderboard data (for demo - in production this would be real users)
const generateRandomLeaderboard = () => {
  const names = [
    'EcoWarrior_23', 'GreenGuru', 'ClimateChamp', 'TreeHugger', 'CarbonCrusher',
    'SolarSoul', 'WindWalker', 'OceanGuardian', 'BikeCommuter', 'ZeroWaster',
    'RecycleRanger', 'CompostKing', 'VeganVibes', 'GreenMachine', 'EarthFirst'
  ];
  const avatars = ['🌟', '🌿', '⚡', '🌳', '💪', '☀️', '🌊', '🚴', '♻️', '🌱', '🔥', '💚', '🌍', '✨', '🦋'];
  
  return Array.from({ length: 10 }, (_, i) => {
    const carbon = Math.random() * 250 + 20; // Random between 20-270
    const level = LEVELS.find(l => carbon >= l.minCarbon && carbon < l.maxCarbon) || LEVELS[0];
    return {
      name: names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100),
      carbon: parseFloat(carbon.toFixed(1)),
      streak: Math.floor(Math.random() * 60) + 1,
      level: level.name,
      avatar: avatars[Math.floor(Math.random() * avatars.length)]
    };
  });
};

function WelcomeScreen({ onStart }) {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className={`max-w-4xl w-full relative z-10 transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Logo and Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl shadow-2xl mb-6 transform hover:scale-110 transition-transform duration-300">
            <Leaf className="w-14 h-14 text-emerald-500" />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            EcoTrack
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light">
            Your Personal Carbon Footprint Journey
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <div className="bg-emerald-400/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Track Daily Impact</h3>
            <p className="text-white/80 text-sm">Monitor your carbon footprint from transport, meals, shopping, and energy use</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <div className="bg-blue-400/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Set Green Goals</h3>
            <p className="text-white/80 text-sm">Get personalized insights and tips to reduce your environmental impact</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <div className="bg-purple-400/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Earn Achievements</h3>
            <p className="text-white/80 text-sm">Build streaks and unlock badges as you maintain sustainable habits</p>
          </div>
        </div>

        {/* Stats Preview */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-yellow-300" />
            <h3 className="text-white font-semibold text-xl">Why Track Your Carbon?</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">12kg</div>
              <div className="text-white/80 text-sm">Average daily CO₂ per person</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">60%</div>
              <div className="text-white/80 text-sm">Reduction possible with simple changes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">21kg</div>
              <div className="text-white/80 text-sm">CO₂ absorbed by one tree yearly</div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={onStart}
            className="group bg-white text-emerald-600 px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
          >
            Start Your Journey
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
          <p className="text-white/70 text-sm mt-4">Join thousands making a difference, one day at a time</p>
        </div>
      </div>
    </div>
  );
}

export default function CarbonTracker() {
  const [activities, setActivities] = useState([]);
  const [showLogger, setShowLogger] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [streak, setStreak] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);
  const [viewMode, setViewMode] = useState('week');
  const [showWelcome, setShowWelcome] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [showAiLogger, setShowAiLogger] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [challengeProgress, setChallengeProgress] = useState({});
  const [showAiCoach, setShowAiCoach] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  
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
  
  const hasVisited = localStorage.getItem('carbonHasVisited');
  if (hasVisited) {
    setShowWelcome(false);
  }
  
  const savedDarkMode = localStorage.getItem('carbonDarkMode');
  if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
}, []);

  useEffect(() => {
  localStorage.setItem('carbonDarkMode', JSON.stringify(darkMode));
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [darkMode]);

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

  const handleStartJourney = () => {
  localStorage.setItem('carbonHasVisited', 'true');
  setShowWelcome(false);
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

  const getCurrentLevel = () => {
    const total = parseFloat(getTotalCarbon());
    
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (total >= LEVELS[i].minCarbon) {
        const level = LEVELS[i];
        const nextLevel = LEVELS[i + 1];
        const progress = nextLevel 
          ? ((total - level.minCarbon) / (nextLevel.minCarbon - level.minCarbon)) * 100
          : 100;
        
        return {
          ...level,
          progress: Math.min(progress, 100),
          nextLevel: nextLevel || null,
          carbonToNext: nextLevel ? nextLevel.minCarbon - total : 0
        };
      }
    }
    
    return {
      ...LEVELS[0],
      progress: 0,
      nextLevel: LEVELS[1],
      carbonToNext: LEVELS[1].minCarbon
    };
  };

  const getLeaderboardWithUser = () => {
    const userEntry = {
      name: 'You',
      carbon: parseFloat(getTotalCarbon()),
      streak: streak,
      level: getCurrentLevel().name,
      avatar: '👤',
      isUser: true
    };
    
    const allUsers = [...generateRandomLeaderboard(), userEntry];
    return allUsers.sort((a, b) => b.carbon - a.carbon);
  };

  const getChallengeProgress = (challenge) => {
    if (!challenge) return 0;
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    
    const weekActivities = activities.filter(a => a.date >= weekAgoStr);
    
    switch (challenge.type) {
      case 'transport':
        // Count bike/walk days
        const bikeDays = new Set(
          weekActivities
            .filter(a => a.category === 'transport' && (a.type === 'bike' || a.type === 'walk'))
            .map(a => a.date)
        ).size;
        return bikeDays;
        
      case 'meals':
        // Count plant-based meals
        const plantMeals = weekActivities.filter(
          a => a.category === 'meals' && (a.type === 'vegan' || a.type === 'vegetarian')
        ).length;
        return plantMeals;
        
      case 'shopping':
        // Count shopping activities (lower is better)
        const shopping = weekActivities.filter(a => a.category === 'shopping').length;
        return Math.max(0, challenge.target - shopping);
        
      case 'energy':
        // Compare energy use this week vs last week
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        const twoWeeksAgoStr = twoWeeksAgo.toISOString().split('T')[0];
        
        const thisWeekEnergy = weekActivities
          .filter(a => a.category === 'energy')
          .reduce((sum, a) => sum + a.carbon, 0);
          
        const lastWeekEnergy = activities
          .filter(a => a.date >= twoWeeksAgoStr && a.date < weekAgoStr && a.category === 'energy')
          .reduce((sum, a) => sum + a.carbon, 0);
          
        if (lastWeekEnergy === 0) return 0;
        const reduction = ((lastWeekEnergy - thisWeekEnergy) / lastWeekEnergy) * 100;
        return Math.max(0, Math.min(20, reduction));
        
      default:
        return 0;
    }
  };

  const startChallenge = (challenge) => {
    setActiveChallenge(challenge);
    localStorage.setItem('activeChallenge', JSON.stringify(challenge));
  };

  const completeChallenge = () => {
    if (!activeChallenge) return;
    
    const completed = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
    completed.push({
      ...activeChallenge,
      completedDate: new Date().toISOString(),
      progress: getChallengeProgress(activeChallenge)
    });
    localStorage.setItem('completedChallenges', JSON.stringify(completed));
    
    setActiveChallenge(null);
    localStorage.removeItem('activeChallenge');
    alert('🎉 Challenge completed! You earned a badge!');
  };

  const chatWithAI = async (message) => {
    setIsAiThinking(true);
    
    // Add user message to chat
    const newUserMsg = { role: 'user', content: message };
    setChatHistory(prev => [...prev, newUserMsg]);
    setUserMessage('');
    
    try {
      // Prepare context about user's data
      const userContext = `
User's Carbon Tracking Data:
- Total CO₂ tracked: ${getTotalCarbon()} kg
- Daily average: ${getAverageDaily()} kg
- Current streak: ${streak} days
- Total activities: ${activities.length}
- Current level: ${getCurrentLevel().name}

Category breakdown:
${getCategoryData().map(cat => `- ${cat.name}: ${cat.value} kg (${((cat.value / parseFloat(getTotalCarbon())) * 100).toFixed(1)}%)`).join('\n')}

Recent activities (last 5):
${activities.slice(0, 5).map(a => `- ${a.category}: ${a.type} (${a.carbon} kg CO₂)`).join('\n')}
`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an expert sustainability coach helping users reduce their carbon footprint. Be encouraging, specific, and actionable. Use the user's actual tracking data to give personalized advice. Keep responses concise (2-3 paragraphs max). Use emojis sparingly but effectively.

${userContext}`
            },
            ...chatHistory.slice(-6), // Last 3 exchanges for context
            newUserMsg
          ],
          max_tokens: 300,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const aiMessage = {
        role: 'assistant',
        content: data.choices[0].message.content
      };

      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again! In the meantime, focus on reducing your highest carbon category. 💚"
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsAiThinking(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('activeChallenge');
    if (saved) {
      setActiveChallenge(JSON.parse(saved));
    }
  }, []);

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

  const parseNaturalLanguage = (text) => {
    const activities = [];
    const lowerText = text.toLowerCase();
    
    // Transport patterns
    const transportPatterns = [
      { regex: /drove?\s+(\d+)\s*(km|kilometers?)/i, type: 'car', category: 'transport' },
      { regex: /drove?\s+.*?(\d+)\s*(km|kilometers?)/i, type: 'car', category: 'transport' },
      { regex: /(bus|took\s+bus).*?(\d+)\s*(km|kilometers?)/i, type: 'bus', category: 'transport' },
      { regex: /(train|took\s+train).*?(\d+)\s*(km|kilometers?)/i, type: 'train', category: 'transport' },
      { regex: /(bike|biked|cycled).*?(\d+)\s*(km|kilometers?)/i, type: 'bike', category: 'transport' },
      { regex: /(motorcycle|bike|motorbike).*?(\d+)\s*(km|kilometers?)/i, type: 'motorcycle', category: 'transport' },
    ];
    
    // Meals patterns
    const mealPatterns = [
      { regex: /(beef|steak|burger)/i, type: 'beef', category: 'meals', quantity: 1 },
      { regex: /(pork|bacon|ham)/i, type: 'pork', category: 'meals', quantity: 1 },
      { regex: /(chicken|poultry)/i, type: 'chicken', category: 'meals', quantity: 1 },
      { regex: /(fish|seafood|salmon|tuna)/i, type: 'fish', category: 'meals', quantity: 1 },
      { regex: /(vegetarian|veggie)/i, type: 'vegetarian', category: 'meals', quantity: 1 },
      { regex: /(vegan|plant.based)/i, type: 'vegan', category: 'meals', quantity: 1 },
    ];
    
    // Shopping patterns
    const shoppingPatterns = [
      { regex: /(bought|purchased).*?(\d+).*?(shirt|cloth|dress|pant)/i, type: 'clothing', category: 'shopping' },
      { regex: /(bought|purchased).*?(phone|laptop|electronics|computer)/i, type: 'electronics', category: 'shopping', quantity: 1 },
      { regex: /(bought|purchased).*?(\d+).*?(item|thing)/i, type: 'other', category: 'shopping' },
      { regex: /(groceries|grocery|food\s+shopping)/i, type: 'groceries', category: 'shopping', quantity: 1 },
    ];
    
    // Energy patterns
    const energyPatterns = [
      { regex: /(ac|air.?conditioning|cooling).*?(\d+)\s*(hour|hr)/i, type: 'cooling', category: 'energy' },
      { regex: /(heat|heating).*?(\d+)\s*(hour|hr)/i, type: 'heating', category: 'energy' },
      { regex: /(electricity|power).*?(\d+)\s*(hour|hr)/i, type: 'electricity', category: 'energy' },
    ];
    
    // Parse transport
    transportPatterns.forEach(pattern => {
      const match = lowerText.match(pattern.regex);
      if (match) {
        const distance = match[1] || match[2];
        if (distance) {
          activities.push({
            category: pattern.category,
            type: pattern.type,
            distance: distance,
            quantity: '',
            hours: '',
            date: new Date().toISOString().split('T')[0]
          });
        }
      }
    });
    
    // Parse meals
    mealPatterns.forEach(pattern => {
      const match = lowerText.match(pattern.regex);
      if (match) {
        // Check for quantity
        const quantityMatch = lowerText.match(new RegExp(`(\\d+).*?${pattern.regex.source}`, 'i'));
        const quantity = quantityMatch ? quantityMatch[1] : '1';
        
        activities.push({
          category: pattern.category,
          type: pattern.type,
          distance: '',
          quantity: quantity,
          hours: '',
          date: new Date().toISOString().split('T')[0]
        });
      }
    });
    
    // Parse shopping
    shoppingPatterns.forEach(pattern => {
      const match = lowerText.match(pattern.regex);
      if (match) {
        const quantity = match[2] || '1';
        activities.push({
          category: pattern.category,
          type: pattern.type,
          distance: '',
          quantity: quantity,
          hours: '',
          date: new Date().toISOString().split('T')[0]
        });
      }
    });
    
    // Parse energy
    energyPatterns.forEach(pattern => {
      const match = lowerText.match(pattern.regex);
      if (match) {
        const hours = match[2];
        activities.push({
          category: pattern.category,
          type: pattern.type,
          distance: '',
          quantity: '',
          hours: hours,
          date: new Date().toISOString().split('T')[0]
        });
      }
    });
    
    return activities;
  };

  const processNaturalLanguage = (text) => {
    const parsedActivities = parseNaturalLanguage(text);
    
    if (parsedActivities.length === 0) {
      alert('🤔 Sorry, I couldn\'t understand that. Try something like: "drove 50km and ate beef"');
      return;
    }
    
    // Add all parsed activities
    parsedActivities.forEach(activity => {
      const carbon = calculateCarbon(activity);
      const newActivity = {
        ...activity,
        carbon,
        id: Date.now() + Math.random(), // Unique ID
        timestamp: new Date().toISOString()
      };
      setActivities(prev => [newActivity, ...prev]);
    });
    
    alert(`✨ AI logged ${parsedActivities.length} activity/activities!`);
  };

  if (showWelcome) {
  return <WelcomeScreen onStart={handleStartJourney} />;
}

  return (
  <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 border-b transition-colors duration-300 ${darkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/80 border-emerald-100'} backdrop-blur-lg`}>
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
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your Carbon Journey</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                 onClick={() => setDarkMode(!darkMode)}
                 className={`p-2 rounded-lg transition-all ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                 title={darkMode ? 'Light Mode' : 'Dark Mode'}
              >
                 {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
              <button
                onClick={() => setShowAiCoach(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                AI Coach
              </button>
              <button
                onClick={() => setShowAiLogger(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                AI Logger
              </button>
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
    </div>

      {/* Navigation */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-1 flex gap-1 border border-emerald-100">
          {['dashboard', 'activities', 'achievements', 'leaderboard', 'challenges'].map(tab => (
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

            {/* Level Progress Card */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 backdrop-blur-lg rounded-xl p-6 border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Your Level</p>
                  <h3 className="text-2xl font-bold" style={{ color: getCurrentLevel().color }}>
                    {getCurrentLevel().icon} {getCurrentLevel().name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{getCurrentLevel().benefits}</p>
                </div>
              </div>
              
              {getCurrentLevel().nextLevel && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress to {getCurrentLevel().nextLevel.name}</span>
                    <span className="font-bold text-gray-800">{getCurrentLevel().progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${getCurrentLevel().progress}%`,
                        background: `linear-gradient(to right, ${getCurrentLevel().color}, ${getCurrentLevel().nextLevel.color})`
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {getCurrentLevel().carbonToNext.toFixed(1)} kg more to level up!
                  </p>
                </div>
              )}
            </div>

            {/* Active Challenge Card */}
            {activeChallenge && (
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 backdrop-blur-lg rounded-xl p-6 border-2 border-pink-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{activeChallenge.icon}</span>
                    <div>
                      <p className="text-sm text-gray-600">Active Challenge</p>
                      <h3 className="text-xl font-bold text-gray-800">{activeChallenge.name}</h3>
                    </div>
                  </div>
                  <Target className="w-6 h-6 text-pink-500" />
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-bold text-gray-800">
                      {getChallengeProgress(activeChallenge)} / {activeChallenge.target}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((getChallengeProgress(activeChallenge) / activeChallenge.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{activeChallenge.desc}</p>
                
                {getChallengeProgress(activeChallenge) >= activeChallenge.target && (
                  <button
                    onClick={completeChallenge}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    ✅ Complete Challenge
                  </button>
                )}
              </div>
            )}

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

        {currentTab === 'leaderboard' && (
          <div className="space-y-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">🏆 Global Leaderboard</h3>
              <p className="text-white/90">See how you rank among eco-warriors worldwide!</p>
            </div>

            {/* Current User Level */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border-2" style={{ borderColor: getCurrentLevel().color }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-6xl">{getCurrentLevel().icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold" style={{ color: getCurrentLevel().color }}>
                      {getCurrentLevel().name}
                    </h3>
                    <p className="text-gray-600">{getCurrentLevel().benefits}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {getTotalCarbon()} kg CO₂ tracked • {streak} day streak
                    </p>
                  </div>
                </div>
                {getCurrentLevel().nextLevel && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Next Level</p>
                    <p className="text-lg font-bold" style={{ color: getCurrentLevel().nextLevel.color }}>
                      {getCurrentLevel().nextLevel.icon} {getCurrentLevel().nextLevel.name}
                    </p>
                    <p className="text-xs text-gray-500">{getCurrentLevel().carbonToNext.toFixed(1)} kg to go</p>
                  </div>
                )}
              </div>
            </div>

            {/* Leaderboard List */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-gray-200">
              <h3 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Top Carbon Trackers
              </h3>
              <div className="space-y-2">
                {getLeaderboardWithUser().map((user, index) => {
                  const userLevel = LEVELS.find(l => l.name === user.level) || LEVELS[0];
                  const isTopThree = index < 3;
                  const medals = ['🥇', '🥈', '🥉'];
                  
                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                        user.isUser 
                          ? 'bg-gradient-to-r from-emerald-100 to-teal-100 border-2 border-emerald-300 shadow-md' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-gray-400 w-8">
                          {isTopThree ? medals[index] : `#${index + 1}`}
                        </div>
                        <div className="text-3xl">{user.avatar}</div>
                        <div>
                          <h4 className={`font-semibold ${user.isUser ? 'text-emerald-800' : 'text-gray-800'}`}>
                            {user.name}
                            {user.isUser && <span className="ml-2 text-xs bg-emerald-500 text-white px-2 py-1 rounded-full">YOU</span>}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {userLevel.icon} {user.level} • {user.streak} day streak
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold" style={{ color: userLevel.color }}>
                          {user.carbon.toFixed(1)}
                        </p>
                        <p className="text-xs text-gray-500">kg CO₂</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Level Breakdown */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-gray-200">
              <h3 className="font-semibold mb-4 text-gray-800">🎯 Level System</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {LEVELS.map((level, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      getCurrentLevel().name === level.name
                        ? 'border-current shadow-lg scale-105'
                        : 'border-gray-200'
                    }`}
                    style={{ borderColor: getCurrentLevel().name === level.name ? level.color : undefined }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{level.icon}</span>
                      <div>
                        <h4 className="font-bold" style={{ color: level.color }}>
                          {level.name}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {level.minCarbon === 0 ? 'Start' : `${level.minCarbon}+`} kg CO₂
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{level.benefits}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentTab === 'challenges' && (
          <div className="space-y-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">🎯 Weekly Challenges</h3>
              <p className="text-white/90">Complete challenges to earn badges and level up faster!</p>
            </div>

            {/* Active Challenge */}
            {activeChallenge && (
              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border-2 border-pink-300">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{activeChallenge.icon}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{activeChallenge.name}</h3>
                    <p className="text-gray-600">{activeChallenge.desc}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Your Progress</span>
                    <span className="font-bold text-gray-800">
                      {getChallengeProgress(activeChallenge)} / {activeChallenge.target}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((getChallengeProgress(activeChallenge) / activeChallenge.target) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {getChallengeProgress(activeChallenge) >= activeChallenge.target 
                      ? '🎉 Challenge completed! Click below to claim your badge!'
                      : `Keep going! ${activeChallenge.target - getChallengeProgress(activeChallenge)} more to complete.`
                    }
                  </p>
                </div>

                {getChallengeProgress(activeChallenge) >= activeChallenge.target ? (
                  <button
                    onClick={completeChallenge}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-xl transition-all"
                  >
                    ✅ Complete Challenge & Earn Badge
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveChallenge(null)}
                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    Cancel Challenge
                  </button>
                )}
              </div>
            )}

            {/* Available Challenges */}
            {!activeChallenge && (
              <div className="grid md:grid-cols-2 gap-4">
                {WEEKLY_CHALLENGES.map(challenge => (
                  <div
                    key={challenge.id}
                    className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200 hover:border-pink-300 transition-all hover:shadow-lg"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl">{challenge.icon}</span>
                      <div>
                        <h4 className="font-bold text-lg text-gray-800">{challenge.name}</h4>
                        <p className="text-sm text-gray-600">{challenge.desc}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-3 mb-3">
                      <p className="text-sm text-gray-700">
                        <strong>Goal:</strong> {challenge.target > 0 ? `Complete ${challenge.target} times` : 'Minimize activities'} this week
                      </p>
                    </div>
                    
                    <button
                      onClick={() => startChallenge(challenge)}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Start Challenge
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Completed Challenges */}
            {JSON.parse(localStorage.getItem('completedChallenges') || '[]').length > 0 && (
              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  Completed Challenges
                </h3>
                <div className="grid md:grid-cols-3 gap-3">
                  {JSON.parse(localStorage.getItem('completedChallenges') || '[]').map((challenge, index) => (
                    <div key={index} className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <div className="text-3xl mb-2">{challenge.icon}</div>
                      <h4 className="font-semibold text-gray-800">{challenge.name}</h4>
                      <p className="text-xs text-gray-500">
                        {new Date(challenge.completedDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

      {/* AI Coach Modal */}
      {showAiCoach && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full h-[600px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-blue-500" />
                  AI Sustainability Coach
                </h2>
                <p className="text-sm text-gray-600">Ask me anything about reducing your carbon footprint!</p>
              </div>
              <button onClick={() => setShowAiCoach(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🤖</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Hi! I'm your AI Coach</h3>
                  <p className="text-gray-600 mb-6">I've analyzed your carbon tracking data. Ask me anything!</p>
                  
                  <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
                    <button
                      onClick={() => chatWithAI("What's my biggest carbon source and how can I reduce it?")}
                      className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-left transition-all"
                    >
                      <p className="font-semibold text-blue-800 text-sm">💡 Biggest Impact</p>
                      <p className="text-xs text-gray-600 mt-1">Where should I focus?</p>
                    </button>
                    <button
                      onClick={() => chatWithAI("Give me 3 easy ways to reduce my footprint this week")}
                      className="p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-left transition-all"
                    >
                      <p className="font-semibold text-emerald-800 text-sm">🌱 Quick Wins</p>
                      <p className="text-xs text-gray-600 mt-1">Easy changes to make</p>
                    </button>
                    <button
                      onClick={() => chatWithAI("How does my carbon footprint compare to average?")}
                      className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-left transition-all"
                    >
                      <p className="font-semibold text-purple-800 text-sm">📊 How am I doing?</p>
                      <p className="text-xs text-gray-600 mt-1">Compare to average</p>
                    </button>
                    <button
                      onClick={() => chatWithAI("What challenge should I try next?")}
                      className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl text-left transition-all"
                    >
                      <p className="font-semibold text-orange-800 text-sm">🎯 Next Challenge</p>
                      <p className="text-xs text-gray-600 mt-1">Level up my impact</p>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {chatHistory.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-4 ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {isAiThinking && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-2xl p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && userMessage.trim() && !isAiThinking) {
                      chatWithAI(userMessage);
                    }
                  }}
                  placeholder="Ask me anything about reducing carbon..."
                  className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                  disabled={isAiThinking}
                />
                <button
                  onClick={() => {
                    if (userMessage.trim() && !isAiThinking) {
                      chatWithAI(userMessage);
                    }
                  }}
                  disabled={!userMessage.trim() || isAiThinking}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Logger Modal */}
      {showAiLogger && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">🤖 AI Activity Logger</h2>
                <p className="text-sm text-gray-600">Describe your activities in plain English!</p>
              </div>
              <button onClick={() => setShowAiLogger(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Examples */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-2">💡 Try these examples:</h3>
                <div className="space-y-1 text-sm text-purple-700">
                  <p>• "I drove 50km to work today"</p>
                  <p>• "Had a beef burger and chicken salad"</p>
                  <p>• "Bought 3 shirts and used AC for 5 hours"</p>
                  <p>• "Took the bus 20km and ate vegan lunch"</p>
                </div>
              </div>

              {/* Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your activities:
                </label>
                <textarea
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="w-full p-4 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none min-h-[120px]"
                  placeholder="E.g., I drove 30km, ate beef, and bought 2 shirts..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    processNaturalLanguage(aiInput);
                    setAiInput('');
                    setShowAiLogger(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Process with AI
                </button>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setAiInput("drove 50km to work")}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-all"
                >
                  🚗 Drove to work
                </button>
                <button
                  onClick={() => setAiInput("had beef burger for lunch")}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-all"
                >
                  🍔 Beef meal
                </button>
                <button
                  onClick={() => setAiInput("bought 2 shirts")}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-all"
                >
                  👕 Shopping
                </button>
                <button
                  onClick={() => setAiInput("used AC for 3 hours")}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-all"
                >
                  ❄️ AC usage
                </button>
              </div>
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
  );
}