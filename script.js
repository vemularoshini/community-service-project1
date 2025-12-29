// Global State
let currentUser = null;
let currentLanguage = 'en';
let currentCountry = 'US';
let medications = [];
let healthData = [];
let emergencyContacts = [];
let profileStep = 1;
let profileData = {
    age: '',
    weight: '',
    height: '',
    healthConditions: [],
    allergies: [],
    dietaryPreferences: [],
    otherHealthConditions: '',
    otherAllergies: '',
    otherDietaryPreferences: '',
    medicalHistory: '',
    currentMedications: '',
    lifestyleInfo: ''
};

// Password validation utilities
function validatePassword(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const score = Object.values(requirements).filter(Boolean).length;
    const strength = score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong';
    
    return { requirements, score, strength };
}

function updatePasswordStrength(password) {
    const strengthContainer = document.getElementById('passwordStrength');
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text span');
    
    if (!strengthContainer || !strengthFill || !strengthText) return;
    
    const validation = validatePassword(password);
    
    if (password.length === 0) {
        strengthContainer.style.display = 'none';
        return;
    }
    
    strengthContainer.style.display = 'block';
    
    // Update strength bar
    const percentage = (validation.score / 5) * 100;
    strengthFill.style.width = `${percentage}%`;
    
    // Update colors and text
    if (validation.strength === 'weak') {
        strengthFill.style.background = '#ef4444';
        strengthText.textContent = 'Weak';
        strengthText.style.color = '#ef4444';
    } else if (validation.strength === 'medium') {
        strengthFill.style.background = '#f59e0b';
        strengthText.textContent = 'Medium';
        strengthText.style.color = '#f59e0b';
    } else {
        strengthFill.style.background = '#10b981';
        strengthText.textContent = 'Strong';
        strengthText.style.color = '#10b981';
    }
    
    // Update requirement indicators
    Object.keys(validation.requirements).forEach(req => {
        const element = document.getElementById(`${req}-req`);
        if (element) {
            const icon = element.querySelector('i');
            if (validation.requirements[req]) {
                icon.className = 'fas fa-check';
                icon.style.color = '#10b981';
                element.style.opacity = '1';
            } else {
                icon.className = 'fas fa-times';
                icon.style.color = '#ef4444';
                element.style.opacity = '0.6';
            }
        }
    });
}

function checkPasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const matchIndicator = document.getElementById('passwordMatch');
    
    if (!matchIndicator || !confirmPassword) return;
    
    if (confirmPassword.length === 0) {
        matchIndicator.style.display = 'none';
        return;
    }
    
    matchIndicator.style.display = 'block';
    
    if (password === confirmPassword) {
        matchIndicator.innerHTML = '<i class="fas fa-check" style="color: #10b981;"></i> Passwords match';
        matchIndicator.style.color = '#10b981';
    } else {
        matchIndicator.innerHTML = '<i class="fas fa-times" style="color: #ef4444;"></i> Passwords do not match';
        matchIndicator.style.color = '#ef4444';
    }
}

// Translations
const translations = {
    en: {
        // App basics
        appName: 'NutriCare+',
        appTagline: 'Your AI-powered health companion',
        
        // Auth
        welcomeBack: 'Welcome back',
        signInMessage: 'Sign in to access your health dashboard',
        fullName: 'Full Name',
        enterFullName: 'Enter your full name',
        emailAddress: 'Email Address',
        enterEmail: 'Enter your email',
        password: 'Password',
        enterPassword: 'Enter your password',
        confirmPassword: 'Confirm Password',
        confirmYourPassword: 'Confirm your password',
        signIn: 'Sign In',
        signUp: 'Sign up',
        noAccount: "Don't have an account?",
        createAccount: 'Create account',
        createAccountMessage: 'Join thousands managing their health with AI',
        alreadyHaveAccount: 'Already have an account?',
        
        // Profile Setup
        completeProfile: 'Complete Your Profile',
        personalizeExperience: 'Help us personalize your health experience',
        stepProgress: 'Step',
        basicInformation: 'Basic Information',
        ageYears: 'Age (years)',
        enterAge: 'Enter your age',
        weightKg: 'Weight (kg)',
        heightCm: 'Height (cm)',
        healthConditions: 'Health Conditions',
        selectHealthConditions: 'Select any health conditions you have (optional)',
        diabetes: 'Diabetes',
        hypertension: 'Hypertension',
        heartDisease: 'Heart Disease',
        asthma: 'Asthma',
        arthritis: 'Arthritis',
        highCholesterol: 'High Cholesterol',
        thyroidIssues: 'Thyroid Issues',
        kidneyDisease: 'Kidney Disease',
        liverDisease: 'Liver Disease',
        osteoporosis: 'Osteoporosis',
        anemia: 'Anemia',
        migraine: 'Migraine',
        otherHealthConditions: 'Other Health Conditions',
        enterOtherHealthConditions: 'Enter any other health conditions not listed above...',
        allergies: 'Allergies',
        selectAllergies: 'Select any food allergies you have (optional)',
        nuts: 'Nuts',
        dairy: 'Dairy',
        gluten: 'Gluten',
        shellfish: 'Shellfish',
        eggs: 'Eggs',
        soy: 'Soy',
        fish: 'Fish',
        sesame: 'Sesame',
        otherAllergies: 'Other Allergies',
        enterOtherAllergies: 'Enter any other allergies (vegetables, fruits, etc.) not listed above...',
        dietaryPreferences: 'Dietary Preferences',
        selectDietaryPreferences: 'Select your dietary preferences (optional)',
        vegetarian: 'Vegetarian',
        vegan: 'Vegan',
        keto: 'Keto',
        paleo: 'Paleo',
        mediterranean: 'Mediterranean',
        lowCarb: 'Low Carb',
        halal: 'Halal',
        kosher: 'Kosher',
        otherDietaryPreferences: 'Other Dietary Preferences',
        enterOtherDietaryPreferences: 'Enter any other dietary preferences not listed above...',
        additionalInformation: 'Additional Information',
        additionalInfoDesc: 'Please provide any additional information that might help us serve you better',
        medicalHistory: 'Medical History',
        enterMedicalHistory: 'Any surgeries, chronic conditions, or ongoing treatments...',
        currentMedications: 'Current Medications',
        enterCurrentMedications: 'List any medications you\'re currently taking...',
        lifestyleInfo: 'Lifestyle Information',
        enterLifestyleInfo: 'Exercise routine, work schedule, stress levels, sleep patterns...',
        almostDone: '🎉 Almost Done!',
        profileBenefits: 'Your profile will help us provide personalized meal plans, health recommendations, and medication reminders tailored specifically for you.',
        back: 'Back',
        next: 'Next',
        completeSetup: 'Complete Setup',
        
        // Navigation
        dashboard: 'Dashboard',
        medications: 'Medications',
        dietPlan: 'Diet Plan',
        healthTracking: 'Health Tracking',
        homeRemedies: 'Home Remedies',
        language: 'Language',
        country: 'Country',
        settings: 'Settings',
        signOut: 'Sign Out',
        
        // Dashboard
        healthSummary: "Here's your health summary for today",
        age: 'Age',
        weight: 'Weight',
        height: 'Height',
        bmi: 'BMI',
        activeMedications: 'Active Medications',
        todaysReminders: "Today's Reminders",
        latestBP: 'Latest BP',
        latestSugar: 'Latest Sugar',
        todaysMedicationSchedule: "Today's Medication Schedule",
        noMedicationsAdded: 'No medications added yet',
        addFirstMedication: 'Add Your First Medication',
        todaysMealPlan: "Today's Meal Plan",
        breakfast: 'Breakfast',
        lunch: 'Lunch',
        dinner: 'Dinner',
        snacks: 'Snacks',
        viewFullDietPlan: 'View Full Diet Plan',
        quickActions: 'Quick Actions',
        logHealthData: 'Log Health Data',
        manageMedications: 'Manage Medications',
        emergencyContact: 'Emergency Contact',
        voiceAssistant: 'Voice Assistant',
        available: 'Available',
        listen: 'Listen',
        quickCommands: 'Quick Commands',
        
        // Medications
        manageMedicationsDesc: 'Manage your medications and reminders',
        addMedication: 'Add Medication',
        noActiveMedications: 'No Active Medications',
        addFirstMedicationDesc: 'Add your first medication to get started with reminders',
        addNewMedication: 'Add New Medication',
        medicationName: 'Medication Name',
        medicationNamePlaceholder: 'e.g., Aspirin',
        dosage: 'Dosage',
        dosagePlaceholder: 'e.g., 100mg',
        medicationTiming: 'Medication Timing',
        morning: 'Morning',
        afternoon: 'Afternoon',
        night: 'Night',
        notesOptional: 'Notes (optional)',
        additionalNotes: 'Additional notes...',
        cancel: 'Cancel',
        
        // Diet Plan
        personalizedDietPlan: 'Personalized Diet Plan',
        mealsTailored: 'Meals tailored for your health conditions and dietary needs',
        dailySummary: 'Daily Summary',
        totalCalories: 'Total Calories',
        target: 'Target',
        protein: 'Protein',
        carbs: 'Carbs',
        fats: 'Fats',
        foodsToAvoid: 'Foods to Avoid',
        highSodiumFoods: 'High sodium foods',
        bloodPressureSpikes: 'May cause blood pressure spikes',
        processedSugars: 'Processed sugars',
        bloodSugarLevels: 'Can affect blood sugar levels',
        friedFoods: 'Fried foods',
        unhealthyFats: 'High in unhealthy fats',
        
        // Health Tracking
        healthTrackingTitle: 'Health Tracking',
        monitorVitalSigns: 'Monitor your vital signs and health progress',
        logHealthDataBtn: 'Log Health Data',
        bloodPressure: 'Blood Pressure',
        bloodSugar: 'Blood Sugar',
        heartRate: 'Heart Rate',
        healthTrend: 'Health Trend',
        noDataAvailable: 'No data available yet',
        logFirstReading: 'Log your first health reading to see trends',
        recentReadings: 'Recent Readings',
        date: 'Date',
        bpSystolic: 'BP Systolic',
        bpDiastolic: 'BP Diastolic',
        bloodSugarMgDl: 'Blood Sugar (mg/dL)',
        heartRateBpm: 'Heart Rate (bpm)',
        logData: 'Log Data',
        
        // Chat System
        chatWithExpert: 'Chat with Doctor/Dietitian',
        welcomeToChat: 'Hello! I\'m here to help you with your health concerns. You can share your medication list, health logs, or diet plans for review.',
        uploadMedications: 'Upload Medications',
        uploadHealthLog: 'Upload Health Log',
        uploadDietPlan: 'Upload Diet Plan',
        typeYourMessage: 'Type your message...',
        
        // Home Remedies
        homeRemediesTitle: 'Home Remedies',
        naturalTreatments: 'Natural treatments for common ailments',
        searchRemedies: 'Search remedies...',
        commonAilments: 'Common Ailments',
        fever: 'Fever',
        cold: 'Cold',
        cough: 'Cough',
        stomachAche: 'Stomach Ache',
        headache: 'Headache',
        sorethroat: 'Sore Throat',
        importantDisclaimer: 'Important Disclaimer',
        disclaimerText: 'These home remedies are for informational purposes only and should not replace professional medical advice. Always consult with a healthcare provider before trying new remedies, especially if you have existing health conditions or are taking medications. If symptoms persist or worsen, seek immediate medical attention.',
        
        // Emergency Contacts
        addEmergencyContact: 'Add Emergency Contact',
        emergencyContacts: 'Emergency Contacts',
        contactName: 'Contact Name',
        enterContactName: 'Enter contact name',
        phoneNumber: 'Phone Number',
        enterPhoneNumber: 'Enter phone number',
        relationship: 'Relationship',
        selectRelationship: 'Select relationship',
        family: 'Family',
        friend: 'Friend',
        doctor: 'Doctor',
        neighbor: 'Neighbor',
        other: 'Other',
        addContact: 'Add Contact',
        addNewContact: 'Add New Contact',
        close: 'Close',
        call: 'Call',
        remove: 'Remove'
    },
    hi: {
        // App basics
        appName: 'न्यूट्रीकेयर+',
        appTagline: 'आपका AI-संचालित स्वास्थ्य साथी',
        
        // Auth
        welcomeBack: 'वापसी पर स्वागत है',
        signInMessage: 'अपने स्वास्थ्य डैशबोर्ड तक पहुंचने के लिए साइन इन करें',
        fullName: 'पूरा नाम',
        enterFullName: 'अपना पूरा नाम दर्ज करें',
        emailAddress: 'ईमेल पता',
        enterEmail: 'अपना ईमेल दर्ज करें',
        password: 'पासवर्ड',
        enterPassword: 'अपना पासवर्ड दर्ज करें',
        confirmPassword: 'पासवर्ड की पुष्टि करें',
        confirmYourPassword: 'अपने पासवर्ड की पुष्टि करें',
        signIn: 'साइन इन',
        signUp: 'साइन अप',
        noAccount: 'कोई खाता नहीं है?',
        createAccount: 'खाता बनाएं',
        createAccountMessage: 'AI के साथ अपने स्वास्थ्य का प्रबंधन करने वाले हजारों लोगों में शामिल हों',
        alreadyHaveAccount: 'पहले से खाता है?',
        
        // Profile Setup
        completeProfile: 'अपनी प्रोफ़ाइल पूरी करें',
        personalizeExperience: 'अपने स्वास्थ्य अनुभव को व्यक्तिगत बनाने में हमारी सहायता करें',
        stepProgress: 'चरण',
        basicInformation: 'बुनियादी जानकारी',
        ageYears: 'आयु (वर्ष)',
        enterAge: 'अपनी आयु दर्ज करें',
        weightKg: 'वजन (किग्रा)',
        heightCm: 'ऊंचाई (सेमी)',
        healthConditions: 'स्वास्थ्य स्थितियां',
        selectHealthConditions: 'आपकी कोई भी स्वास्थ्य स्थिति चुनें (वैकल्पिक)',
        diabetes: 'मधुमेह',
        hypertension: 'उच्च रक्तचाप',
        heartDisease: 'हृदय रोग',
        asthma: 'दमा',
        arthritis: 'गठिया',
        highCholesterol: 'उच्च कोलेस्ट्रॉल',
        thyroidIssues: 'थायराइड की समस्याएं',
        kidneyDisease: 'गुर्दे की बीमारी',
        liverDisease: 'लीवर की बीमारी',
        osteoporosis: 'ऑस्टियोपोरोसिस',
        anemia: 'एनीमिया',
        migraine: 'माइग्रेन',
        otherHealthConditions: 'अन्य स्वास्थ्य स्थितियां',
        enterOtherHealthConditions: 'ऊपर सूचीबद्ध नहीं की गई कोई अन्य स्वास्थ्य स्थिति दर्ज करें...',
        allergies: 'एलर्जी',
        selectAllergies: 'आपकी कोई भी खाद्य एलर्जी चुनें (वैकल्पिक)',
        nuts: 'नट्स',
        dairy: 'डेयरी',
        gluten: 'ग्लूटन',
        shellfish: 'शेलफिश',
        eggs: 'अंडे',
        soy: 'सोया',
        fish: 'मछली',
        sesame: 'तिल',
        otherAllergies: 'अन्य एलर्जी',
        enterOtherAllergies: 'ऊपर सूचीबद्ध नहीं की गई कोई अन्य एलर्जी (सब्जियां, फल, आदि) दर्ज करें...',
        dietaryPreferences: 'आहार प्राथमिकताएं',
        selectDietaryPreferences: 'अपनी आहार प्राथमिकताएं चुनें (वैकल्पिक)',
        vegetarian: 'शाकाहारी',
        vegan: 'वीगन',
        keto: 'कीटो',
        paleo: 'पैलियो',
        mediterranean: 'भूमध्यसागरीय',
        lowCarb: 'कम कार्ब',
        halal: 'हलाल',
        kosher: 'कोशर',
        otherDietaryPreferences: 'अन्य आहार प्राथमिकताएं',
        enterOtherDietaryPreferences: 'ऊपर सूचीबद्ध नहीं की गई कोई अन्य आहार प्राथमिकताएं दर्ज करें...',
        additionalInformation: 'अतिरिक्त जानकारी',
        additionalInfoDesc: 'कृपया कोई अतिरिक्त जानकारी प्रदान करें जो हमें आपकी बेहतर सेवा करने में मदद कर सकती है',
        medicalHistory: 'चिकित्सा इतिहास',
        enterMedicalHistory: 'कोई सर्जरी, पुरानी स्थितियां, या चल रहे उपचार...',
        currentMedications: 'वर्तमान दवाइयां',
        enterCurrentMedications: 'वर्तमान में ली जा रही दवाइयों की सूची...',
        lifestyleInfo: 'जीवनशैली की जानकारी',
        enterLifestyleInfo: 'व्यायाम दिनचर्या, कार्य अनुसूची, तनाव का स्तर, नींद के पैटर्न...',
        almostDone: '🎉 लगभग हो गया!',
        profileBenefits: 'आपकी प्रोफ़ाइल हमें व्यक्तिगत भोजन योजना, स्वास्थ्य सिफारिशें और दवा अनुस्मारक प्रदान करने में मदद करेगी।',
        back: 'वापस',
        next: 'अगला',
        completeSetup: 'सेटअप पूरा करें',
        
        // Navigation
        dashboard: 'डैशबोर्ड',
        medications: 'दवाइयां',
        dietPlan: 'आहार योजना',
        healthTracking: 'स्वास्थ्य ट्रैकिंग',
        homeRemedies: 'घरेलू नुस्खे',
        language: 'भाषा',
        country: 'देश',
        settings: 'सेटिंग्स',
        signOut: 'साइन आउट',
        
        // Dashboard
        healthSummary: 'यहाँ आज के लिए आपका स्वास्थ्य सारांश है',
        age: 'आयु',
        weight: 'वजन',
        height: 'ऊंचाई',
        bmi: 'बीएमआई',
        activeMedications: 'सक्रिय दवाइयां',
        todaysReminders: 'आज के अनुस्मारक',
        latestBP: 'नवीनतम बीपी',
        latestSugar: 'नवीनतम शुगर',
        todaysMedicationSchedule: 'आज की दवा का समय',
        noMedicationsAdded: 'अभी तक कोई दवा नहीं जोड़ी गई',
        addFirstMedication: 'अपनी पहली दवा जोड़ें',
        todaysMealPlan: 'आज की भोजन योजना',
        breakfast: 'नाश्ता',
        lunch: 'दोपहर का भोजन',
        dinner: 'रात का खाना',
        snacks: 'नाश्ता',
        viewFullDietPlan: 'पूरी आहार योजना देखें',
        quickActions: 'त्वरित कार्य',
        logHealthData: 'स्वास्थ्य डेटा लॉग करें',
        manageMedications: 'दवाइयों का प्रबंधन',
        emergencyContact: 'आपातकालीन संपर्क',
        voiceAssistant: 'वॉयस असिस्टेंट',
        available: 'उपलब्ध',
        listen: 'सुनें',
        quickCommands: 'त्वरित कमांड',
        
        // Medications
        manageMedicationsDesc: 'अपनी दवाइयों और अनुस्मारकों का प्रबंधन करें',
        addMedication: 'दवा जोड़ें',
        noActiveMedications: 'कोई सक्रिय दवाइयां नहीं',
        addFirstMedicationDesc: 'अनुस्मारक शुरू करने के लिए अपनी पहली दवा जोड़ें',
        addNewMedication: 'नई दवा जोड़ें',
        medicationName: 'दवा का नाम',
        medicationNamePlaceholder: 'जैसे, एस्पिरिन',
        dosage: 'खुराक',
        dosagePlaceholder: 'जैसे, 100mg',
        medicationTiming: 'दवा का समय',
        morning: 'सुबह',
        afternoon: 'दोपहर',
        night: 'रात',
        notesOptional: 'नोट्स (वैकल्पिक)',
        additionalNotes: 'अतिरिक्त नोट्स...',
        cancel: 'रद्द करें',
        
        // Diet Plan
        personalizedDietPlan: 'व्यक्तिगत आहार योजना',
        mealsTailored: 'आपकी स्वास्थ्य स्थितियों और आहार आवश्यकताओं के लिए तैयार भोजन',
        dailySummary: 'दैनिक सारांश',
        totalCalories: 'कुल कैलोरी',
        target: 'लक्ष्य',
        protein: 'प्रोटीन',
        carbs: 'कार्बोहाइड्रेट',
        fats: 'वसा',
        foodsToAvoid: 'बचने योग्य खाद्य पदार्थ',
        highSodiumFoods: 'उच्च सोडियम खाद्य पदार्थ',
        bloodPressureSpikes: 'रक्तचाप बढ़ने का कारण हो सकता है',
        processedSugars: 'प्रसंस्कृत चीनी',
        bloodSugarLevels: 'रक्त शर्करा के स्तर को प्रभावित कर सकता है',
        friedFoods: 'तली हुई चीजें',
        unhealthyFats: 'अस्वस्थ वसा में उच्च',
        
        // Health Tracking
        healthTrackingTitle: 'स्वास्थ्य ट्रैकिंग',
        monitorVitalSigns: 'अपने महत्वपूर्ण संकेतों और स्वास्थ्य प्रगति की निगरानी करें',
        logHealthDataBtn: 'स्वास्थ्य डेटा लॉग करें',
        bloodPressure: 'रक्तचाप',
        bloodSugar: 'रक्त शर्करा',
        heartRate: 'हृदय गति',
        healthTrend: 'स्वास्थ्य प्रवृत्ति',
        noDataAvailable: 'अभी तक कोई डेटा उपलब्ध नहीं है',
        logFirstReading: 'रुझान देखने के लिए अपनी पहली स्वास्थ्य रीडिंग लॉग करें',
        recentReadings: 'हाल की रीडिंग',
        date: 'दिनांक',
        bpSystolic: 'बीपी सिस्टोलिक',
        bpDiastolic: 'बीपी डायस्टोलिक',
        bloodSugarMgDl: 'रक्त शर्करा (mg/dL)',
        heartRateBpm: 'हृदय गति (bpm)',
        logData: 'डेटा लॉग करें',
        
        // Chat System
        chatWithExpert: 'डॉक्टर/आहार विशेषज्ञ से चैट करें',
        welcomeToChat: 'नमस्ते! मैं आपकी स्वास्थ्य संबंधी चिंताओं में मदद करने के लिए यहाँ हूँ। आप समीक्षा के लिए अपनी दवाओं की सूची, स्वास्थ्य लॉग या आहार योजना साझा कर सकते हैं।',
        uploadMedications: 'दवाइयां अपलोड करें',
        uploadHealthLog: 'स्वास्थ्य लॉग अपलोड करें',
        uploadDietPlan: 'आहार योजना अपलोड करें',
        typeYourMessage: 'अपना संदेश टाइप करें...',
        
        // Home Remedies
        homeRemediesTitle: 'घरेलू नुस्खे',
        naturalTreatments: 'सामान्य बीमारियों के लिए प्राकृतिक उपचार',
        searchRemedies: 'नुस्खे खोजें...',
        commonAilments: 'सामान्य बीमारियां',
        fever: 'बुखार',
        cold: 'सर्दी',
        cough: 'खांसी',
        stomachAche: 'पेट दर्द',
        headache: 'सिरदर्द',
        sorethroat: 'गले में खराश',
        importantDisclaimer: 'महत्वपूर्ण अस्वीकरण',
        disclaimerText: 'ये घरेलू नुस्खे केवल जानकारी के उद्देश्य से हैं और पेशेवर चिकित्सा सलाह का विकल्प नहीं हैं। नए नुस्खे आजमाने से पहले हमेशा स्वास्थ्य सेवा प्रदाता से सलाह लें।',
        
        // Emergency Contacts
        addEmergencyContact: 'आपातकालीन संपर्क जोड़ें',
        emergencyContacts: 'आपातकालीन संपर्क',
        contactName: 'संपर्क का नाम',
        enterContactName: 'संपर्क का नाम दर्ज करें',
        phoneNumber: 'फोन नंबर',
        enterPhoneNumber: 'फोन नंबर दर्ज करें',
        relationship: 'रिश्ता',
        selectRelationship: 'रिश्ता चुनें',
        family: 'परिवार',
        friend: 'मित्र',
        doctor: 'डॉक्टर',
        neighbor: 'पड़ोसी',
        other: 'अन्य',
        addContact: 'संपर्क जोड़ें',
        addNewContact: 'नया संपर्क जोड़ें',
        close: 'बंद करें',
        call: 'कॉल करें',
        remove: 'हटाएं'
    },
    te: {
        // App basics
        appName: 'న్యూట్రీకేర్+',
        appTagline: 'మీ AI-శక్తితో కూడిన ఆరోగ్య సహాయకుడు',
        
        // Auth
        welcomeBack: 'తిరిగి స్వాగతం',
        signInMessage: 'మీ ఆరోగ్య డాష్‌బోర్డ్‌ను యాక్సెస్ చేయడానికి సైన్ ఇన్ చేయండి',
        fullName: 'పూర్తి పేరు',
        enterFullName: 'మీ పూర్తి పేరును నమోదు చేయండి',
        emailAddress: 'ఇమెయిల్ చిరునామా',
        enterEmail: 'మీ ఇమెయిల్‌ను నమోదు చేయండి',
        password: 'పాస్‌వర్డ్',
        enterPassword: 'మీ పాస్‌వర్డ్‌ను నమోదు చేయండి',
        confirmPassword: 'పాస్‌వర్డ్‌ను నిర్ధారించండి',
        confirmYourPassword: 'మీ పాస్‌వర్డ్‌ను నిర్ధారించండి',
        signIn: 'సైన్ ఇన్',
        signUp: 'సైన్ అప్',
        noAccount: 'ఖాతా లేదా?',
        createAccount: 'ఖాతా సృష్టించండి',
        createAccountMessage: 'AI తో వారి ఆరోగ్యాన్ని నిర్వహించే వేలాది మందితో చేరండి',
        alreadyHaveAccount: 'ఇప్పటికే ఖాతా ఉందా?',
        
        // Profile Setup
        completeProfile: 'మీ ప్రొఫైల్‌ను పూర్తి చేయండి',
        personalizeExperience: 'మీ ఆరోగ్య అనుభవాన్ని వ్యక్తిగతీకరించడంలో మాకు సహాయపడండి',
        stepProgress: 'దశ',
        basicInformation: 'ప్రాథమిక సమాచారం',
        ageYears: 'వయస్సు (సంవత్సరాలు)',
        enterAge: 'మీ వయస్సును నమోదు చేయండి',
        weightKg: 'బరువు (కిలోలు)',
        heightCm: 'ఎత్తు (సెం.మీ)',
        healthConditions: 'ఆరోగ్య పరిస్థితులు',
        selectHealthConditions: 'మీకు ఉన్న ఏవైనా ఆరోగ్య పరిస్థితులను ఎంచుకోండి (ఐచ్ఛికం)',
        diabetes: 'మధుమేహం',
        hypertension: 'అధిక రక్తపోటు',
        heartDisease: 'గుండె వ్యాధి',
        asthma: 'ఆస్తమా',
        arthritis: 'కీళ్లనొప్పులు',
        highCholesterol: 'అధిక కొలెస్ట్రాల్',
        thyroidIssues: 'థైరాయిడ్ సమస్యలు',
        kidneyDisease: 'మూత్రపిండాల వ్యాధి',
        liverDisease: 'కాలేయ వ్యాధి',
        osteoporosis: 'ఆస్టియోపోరోసిస్',
        anemia: 'రక్తహీనత',
        migraine: 'మైగ్రేన్',
        otherHealthConditions: 'ఇతర ఆరోగ్య పరిస్థితులు',
        enterOtherHealthConditions: 'పైన జాబితా చేయని ఇతర ఆరోగ్య పరిస్థితులను నమోదు చేయండి...',
        allergies: 'అలెర్జీలు',
        selectAllergies: 'మీకు ఉన్న ఏవైనా ఆహార అలెర్జీలను ఎంచుకోండి (ఐచ్ఛికం)',
        nuts: 'గింజలు',
        dairy: 'పాల ఉత్పత్తులు',
        gluten: 'గ్లూటెన్',
        shellfish: 'షెల్‌ఫిష్',
        eggs: 'గుడ్లు',
        soy: 'సోయా',
        fish: 'చేప',
        sesame: 'నువ్వులు',
        otherAllergies: 'ఇతర అలెర్జీలు',
        enterOtherAllergies: 'పైన జాబితా చేయని ఇతర అలెర్జీలను (కూరగాయలు, పండ్లు మొదలైనవి) నమోదు చేయండి...',
        dietaryPreferences: 'ఆహార ప్రాధాన్యతలు',
        selectDietaryPreferences: 'మీ ఆహార ప్రాధాన్యతలను ఎంచుకోండి (ఐచ్ఛికం)',
        vegetarian: 'శాకాహారి',
        vegan: 'వేగన్',
        keto: 'కీటో',
        paleo: 'పాలియో',
        mediterranean: 'మధ్యధరా',
        lowCarb: 'తక్కువ కార్బ్',
        halal: 'హలాల్',
        kosher: 'కోషర్',
        otherDietaryPreferences: 'ఇతర ఆహార ప్రాధాన్యతలు',
        enterOtherDietaryPreferences: 'పైన జాబితా చేయని ఇతర ఆహార ప్రాధాన్యతలను నమోదు చేయండి...',
        additionalInformation: 'అదనపు సమాచారం',
        additionalInfoDesc: 'మాకు మీకు మెరుగైన సేవ అందించడంలో సహాయపడే ఏదైనా అదనపు సమాచారాన్ని అందించండి',
        medicalHistory: 'వైద్య చరిత్ర',
        enterMedicalHistory: 'ఏవైనా శస్త్రచికిత్సలు, దీర్ఘకాలిక పరిస్థితులు లేదా కొనసాగుతున్న చికిత్సలు...',
        currentMedications: 'ప్రస్తుత మందులు',
        enterCurrentMedications: 'ప్రస్తుతం తీసుకుంటున్న మందుల జాబితా...',
        lifestyleInfo: 'జీవనశైలి సమాచారం',
        enterLifestyleInfo: 'వ్యాయామ దినచర్య, పని షెడ్యూల్, ఒత్తిడి స్థాయిలు, నిద్రా విధానాలు...',
        almostDone: '🎉 దాదాపు పూర్తయింది!',
        profileBenefits: 'మీ ప్రొఫైల్ మాకు వ్యక్తిగత భోజన ప్రణాళికలు, ఆరోగ్య సిఫార్సులు మరియు మందుల రిమైండర్లను అందించడంలో సహాయపడుతుంది.',
        back: 'వెనుకకు',
        next: 'తదుపరి',
        completeSetup: 'సెటప్ పూర్తి చేయండి',
        
        // Navigation
        dashboard: 'డాష్‌బోర్డ్',
        medications: 'మందులు',
        dietPlan: 'ఆహార ప్రణాళిక',
        healthTracking: 'ఆరోగ్య ట్రాకింగ్',
        homeRemedies: 'ఇంటి వైద్యం',
        language: 'భాష',
        country: 'దేశం',
        settings: 'సెట్టింగ్‌లు',
        signOut: 'సైన్ అవుట్',
        
        // Dashboard
        healthSummary: 'ఈరోజు మీ ఆరోగ్య సారాంశం ఇక్కడ ఉంది',
        age: 'వయస్సు',
        weight: 'బరువు',
        height: 'ఎత్తు',
        bmi: 'BMI',
        activeMedications: 'క్రియాశీల మందులు',
        todaysReminders: 'నేటి రిమైండర్లు',
        latestBP: 'తాజా BP',
        latestSugar: 'తాజా షుగర్',
        todaysMedicationSchedule: 'నేటి మందుల షెడ్యూల్',
        noMedicationsAdded: 'ఇంకా మందులు జోడించబడలేదు',
        addFirstMedication: 'మీ మొదటి మందును జోడించండి',
        todaysMealPlan: 'నేటి భోజన ప్రణాళిక',
        breakfast: 'అల్పాహారం',
        lunch: 'మధ్యాహ్న భోజనం',
        dinner: 'రాత్రి భోజనం',
        snacks: 'చిరుతిండి',
        viewFullDietPlan: 'పూర్తి ఆహార ప్రణాళికను చూడండి',
        quickActions: 'త్వరిత చర్యలు',
        logHealthData: 'ఆరోగ్య డేటాను లాగ్ చేయండి',
        manageMedications: 'మందుల నిర్వహణ',
        emergencyContact: 'అత్యవసర సంప్రదింపు',
        voiceAssistant: 'వాయిస్ అసిస్టెంట్',
        available: 'అందుబాటులో',
        listen: 'వినండి',
        quickCommands: 'త్వరిత కమాండ్‌లు',
        
        // Medications
        manageMedicationsDesc: 'మీ మందులు మరియు రిమైండర్లను నిర్వహించండి',
        addMedication: 'మందు జోడించండి',
        noActiveMedications: 'క్రియాశీల మందులు లేవు',
        addFirstMedicationDesc: 'రిమైండర్లతో ప్రారంభించడానికి మీ మొదటి మందును జోడించండి',
        addNewMedication: 'కొత్త మందు జోడించండి',
        medicationName: 'మందు పేరు',
        medicationNamePlaceholder: 'ఉదా., ఆస్పిరిన్',
        dosage: 'మోతాదు',
        dosagePlaceholder: 'ఉదా., 100mg',
        medicationTiming: 'మందు సమయం',
        morning: 'ఉదయం',
        afternoon: 'మధ్యాహ్నం',
        night: 'రాత్రి',
        notesOptional: 'గమనికలు (ఐచ్ఛికం)',
        additionalNotes: 'అదనపు గమనికలు...',
        cancel: 'రద్దు చేయండి',
        
        // Diet Plan
        personalizedDietPlan: 'వ్యక్తిగత ఆహార ప్రణాళిక',
        mealsTailored: 'మీ ఆరోగ్య పరిస్థితులు మరియు ఆహార అవసరాలకు అనుకూలమైన భోజనం',
        dailySummary: 'రోజువారీ సారాంశం',
        totalCalories: 'మొత్తం కేలరీలు',
        target: 'లక్ష్యం',
        protein: 'ప్రోటీన్',
        carbs: 'కార్బోహైడ్రేట్లు',
        fats: 'కొవ్వులు',
        foodsToAvoid: 'తప్పించవలసిన ఆహారాలు',
        highSodiumFoods: 'అధిక సోడియం ఆహారాలు',
        bloodPressureSpikes: 'రక్తపోటు పెరుగుదలకు కారణం కావచ్చు',
        processedSugars: 'ప్రాసెస్ చేసిన చక్కెరలు',
        bloodSugarLevels: 'రక్తంలో చక్కెర స్థాయిలను ప్రభావితం చేయవచ్చు',
        friedFoods: 'వేయించిన ఆహారాలు',
        unhealthyFats: 'అనారోగ్య కొవ్వులలో అధికం',
        
        // Health Tracking
        healthTrackingTitle: 'ఆరోగ్య ట్రాకింగ్',
        monitorVitalSigns: 'మీ ముఖ్యమైన సంకేతాలు మరియు ఆరోగ్య పురోగతిని పర్యవేక్షించండి',
        logHealthDataBtn: 'ఆరోగ్య డేటాను లాగ్ చేయండి',
        bloodPressure: 'రక్తపోటు',
        bloodSugar: 'రక్తంలో చక్కెర',
        heartRate: 'గుండె వేగం',
        healthTrend: 'ఆరోగ్య ధోరణి',
        noDataAvailable: 'ఇంకా డేటా అందుబాటులో లేదు',
        logFirstReading: 'ధోరణులను చూడడానికి మీ మొదటి ఆరోగ్య రీడింగ్‌ను లాగ్ చేయండి',
        recentReadings: 'ఇటీవలి రీడింగ్‌లు',
        date: 'తేదీ',
        bpSystolic: 'BP సిస్టోలిక్',
        bpDiastolic: 'BP డయాస్టోలిక్',
        bloodSugarMgDl: 'రక్తంలో చక్కెర (mg/dL)',
        heartRateBpm: 'గుండె వేగం (bpm)',
        logData: 'డేటాను లాగ్ చేయండి',
        
        // Chat System
        chatWithExpert: 'వైద్యుడు/పోషకాహార నిపుణుడితో చాట్ చేయండి',
        welcomeToChat: 'నమస్కారం! మీ ఆరోగ్య సమస్యలతో మీకు సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను. మీరు సమీక్ష కోసం మీ మందుల జాబితా, ఆరోగ్య లాగ్‌లు లేదా ఆహార ప్రణాళికలను పంచుకోవచ్చు.',
        uploadMedications: 'మందులను అప్‌లోడ్ చేయండి',
        uploadHealthLog: 'ఆరోగ్య లాగ్‌ను అప్‌లోడ్ చేయండి',
        uploadDietPlan: 'ఆహార ప్రణాళికను అప్‌లోడ్ చేయండి',
        typeYourMessage: 'మీ సందేశాన్ని టైప్ చేయండి...',
        
        // Home Remedies
        homeRemediesTitle: 'ఇంటి వైద్యం',
        naturalTreatments: 'సాధారణ వ్యాధులకు సహజ చికిత్సలు',
        searchRemedies: 'వైద్యాలను వెతకండి...',
        commonAilments: 'సాధారణ వ్యాధులు',
        fever: 'జ్వరం',
        cold: 'జలుబు',
        cough: 'దగ్గు',
        stomachAche: 'కడుపు నొప్పి',
        headache: 'తలనొప్పి',
        sorethroat: 'గొంతు నొప్పి',
        importantDisclaimer: 'ముఖ్యమైన నిరాకరణ',
        disclaimerText: 'ఈ ఇంటి వైద్యాలు కేవలం సమాచార ప్రయోజనాల కోసం మాత్రమే మరియు వృత్తిపరమైన వైద్య సలహాకు ప్రత్యామ్నాయం కాదు. కొత్త వైద్యాలను ప్రయత్నించే ముందు ఎల్లప్పుడూ ఆరోగ్య సేవా ప్రదాతను సంప్రదించండి.',
        
        // Emergency Contacts
        addEmergencyContact: 'అత్యవసర సంప్రదింపును జోడించండి',
        emergencyContacts: 'అత్యవసర సంప్రదింపులు',
        contactName: 'సంప్రదింపు పేరు',
        enterContactName: 'సంప్రదింపు పేరును నమోదు చేయండి',
        phoneNumber: 'ఫోన్ నంబర్',
        enterPhoneNumber: 'ఫోన్ నంబర్‌ను నమోదు చేయండి',
        relationship: 'సంబంధం',
        selectRelationship: 'సంబంధాన్ని ఎంచుకోండి',
        family: 'కుటుంబం',
        friend: 'స్నేహితుడు',
        doctor: 'వైద్యుడు',
        neighbor: 'పొరుగువాడు',
        other: 'ఇతర',
        addContact: 'సంప్రదింపును జోడించండి',
        addNewContact: 'కొత్త సంప్రదింపును జోడించండి',
        close: 'మూసివేయండి',
        call: 'కాల్ చేయండి',
        remove: 'తొలగించండి'
    }
};

// Enhanced country-specific meal plans with personalized food recommendations
const countryMealPlans = {
    IN: {
        general: {
            breakfast: [
                { name: 'Poha with vegetables', calories: 250, safe: true, allergens: ['gluten'], healthConditions: [], dietaryTypes: ['vegetarian'] },
                { name: 'Idli with sambar', calories: 200, safe: true, allergens: [], healthConditions: [], dietaryTypes: ['vegetarian', 'vegan'] },
                { name: 'Upma with coconut chutney', calories: 180, safe: true, allergens: ['gluten'], healthConditions: [], dietaryTypes: ['vegetarian'] },
                { name: 'Oats upma', calories: 220, safe: true, allergens: ['gluten'], healthConditions: ['diabetes', 'hypertension'], dietaryTypes: ['vegetarian'] },
                { name: 'Ragi porridge', calories: 180, safe: true, allergens: [], healthConditions: ['diabetes', 'anemia'], dietaryTypes: ['vegetarian', 'vegan'] }
            ],
            lunch: [
                { name: 'Dal rice with vegetables', calories: 400, safe: true, allergens: [], healthConditions: [], dietaryTypes: ['vegetarian', 'vegan'] },
                { name: 'Roti with sabzi', calories: 350, safe: true, allergens: ['gluten'], healthConditions: [], dietaryTypes: ['vegetarian'] },
                { name: 'Sambar rice', calories: 380, safe: true, allergens: [], healthConditions: [], dietaryTypes: ['vegetarian', 'vegan'] },
                { name: 'Quinoa pulao', calories: 320, safe: true, allergens: [], healthConditions: ['diabetes'], dietaryTypes: ['vegetarian', 'vegan'] },
                { name: 'Brown rice with dal', calories: 360, safe: true, allergens: [], healthConditions: ['diabetes', 'hypertension'], dietaryTypes: ['vegetarian', 'vegan'] }
            ],
            dinner: [
                { name: 'Khichdi with curd', calories: 300, safe: true, allergens: ['dairy'], healthConditions: [], dietaryTypes: ['vegetarian'] },
                { name: 'Vegetable curry with roti', calories: 320, safe: true, allergens: ['gluten'], healthConditions: [], dietaryTypes: ['vegetarian'] },
                { name: 'Moong dal soup', calories: 150, safe: true, allergens: [], healthConditions: ['diabetes', 'hypertension'], dietaryTypes: ['vegetarian', 'vegan'] },
                { name: 'Millet porridge', calories: 200, safe: true, allergens: [], healthConditions: ['diabetes'], dietaryTypes: ['vegetarian', 'vegan'] },
                { name: 'Vegetable broth', calories: 120, safe: true, allergens: [], healthConditions: ['hypertension'], dietaryTypes: ['vegetarian', 'vegan'] }
            ],
            snacks: [
                { name: 'Masala chai with biscuits', calories: 120, safe: true, allergens: ['gluten', 'dairy'], healthConditions: [], dietaryTypes: ['vegetarian'] },
                { name: 'Fruits (seasonal)', calories: 100, safe: true, allergens: [], healthConditions: [], dietaryTypes: ['vegetarian', 'vegan'] },
                { name: 'Roasted chana', calories: 140, safe: true, allergens: [], healthConditions: ['diabetes'], dietaryTypes: ['vegetarian', 'vegan'] },
                { name: 'Coconut water', calories: 45, safe: true, allergens: [], healthConditions: ['hypertension'], dietaryTypes: ['vegetarian', 'vegan'] }
            ]
        },
        diabetes: {
            breakfast: [
                { name: 'Oats upma with vegetables', calories: 220, safe: true, allergens: ['gluten'], healthConditions: ['diabetes'], dietaryTypes: ['vegetarian'] },
                { name: 'Ragi porridge (unsweetened)', calories: 180, safe: true, allergens: [], healthConditions: ['diabetes'], dietaryTypes: ['vegetarian', 'vegan'] },
                { name: 'Moong dal cheela', calories: 200, safe: true, allergens: [], healthConditions: ['diabetes'], dietaryTypes: ['vegetarian'] },
                { name: 'Quinoa upma', calories: 210, safe: true, allergens: [], healthConditions: ['diabetes'], dietaryTypes: ['vegetarian', 'vegan'] }
            ],
            lunch: [
                { name: 'Brown rice with dal and vegetables', calories: 350, safe: true, allergens: [], healthConditions: ['diabetes'], dietaryTypes: ['vegetarian', 'vegan'] },
                { name: 'Bajra roti with palak sabzi', calories: 320, safe: true, allergens: [], healthConditions: ['diabetes'], dietaryTypes: ['vegetarian'] },
                { name: 'Quinoa salad with vegetables', calories: 300, safe: true, allergens: [], healthConditions: ['diabetes'], dietaryTypes: ['vegetarian', 'vegan'] }
            ],
            dinner: [
                { name: 'Vegetable soup with ragi roti', calories: 250, safe: true, allergens: [], healthConditions: ['diabetes'], dietaryTypes: ['vegetarian', 'vegan'] },
                { name: 'Steamed vegetables with quinoa', calories: 220, safe: true, allergens: [], healthConditions: ['diabetes'], dietaryTypes: ['vegetarian', 'vegan'] }
            ]
        },
        hypertension: {
            breakfast: [
                { name: 'Oats porridge with fruits', calories: 200, safe: true, allergens: ['gluten'], healthConditions: ['hypertension'], dietaryTypes: ['vegetarian'] },
                { name: 'Idli with coconut chutney (low salt)', calories: 180, safe: true, allergens: [], healthConditions: ['hypertension'], dietaryTypes: ['vegetarian', 'vegan'] },
                { name: 'Banana smoothie with almonds', calories: 220, safe: true, allergens: ['nuts'], healthConditions: ['hypertension'], dietaryTypes: ['vegetarian'] }
            ],
            lunch: [
                { name: 'Brown rice with low-salt dal', calories: 340, safe: true, allergens: [], healthConditions: ['hypertension'], dietaryTypes: ['vegetarian', 'vegan'] },
                { name: 'Steamed vegetables with roti', calories: 300, safe: true, allergens: ['gluten'], healthConditions: ['hypertension'], dietaryTypes: ['vegetarian'] }
            ],
            dinner: [
                { name: 'Vegetable broth with herbs', calories: 120, safe: true, allergens: [], healthConditions: ['hypertension'], dietaryTypes: ['vegetarian', 'vegan'] },
                { name: 'Grilled vegetables with quinoa', calories: 200, safe: true, allergens: [], healthConditions: ['hypertension'], dietaryTypes: ['vegetarian', 'vegan'] }
            ]
        }
    },
    US: {
        general: {
            breakfast: [
                { name: 'Oatmeal with berries', calories: 250, safe: true, allergens: ['gluten'], healthConditions: [], dietaryTypes: ['vegetarian'] },
                { name: 'Whole grain toast with avocado', calories: 280, safe: true, allergens: ['gluten'], healthConditions: [], dietaryTypes: ['vegetarian', 'vegan'] },
                { name: 'Greek yogurt with nuts', calories: 200, safe: true, allergens: ['dairy', 'nuts'], healthConditions: [], dietaryTypes: ['vegetarian'] },
                { name: 'Smoothie bowl with fruits', calories: 220, safe: true, allergens: [], healthConditions: [], dietaryTypes: ['vegetarian', 'vegan'] },
                { name: 'Chia pudding', calories: 180, safe: true, allergens: [], healthConditions: ['diabetes'], dietaryTypes: ['vegetarian', 'vegan'] }
            ],
            lunch: [
                { name: 'Mediterranean salad', calories: 350, safe: true, allergens: [], healthConditions: [], dietaryTypes: ['vegetarian', 'vegan'] },
                { name: 'Quinoa bowl with vegetables', calories: 320, safe: true, allergens: [], healthConditions: [], dietaryTypes: ['vegetarian', 'vegan'] },
                { name: 'Lentil soup with bread', calories: 300, safe: true, allergens: ['gluten'], healthConditions: [], dietaryTypes: ['vegetarian', 'vegan'] },
                { name: 'Grilled chicken salad', calories: 380, safe: true, allergens: [], healthConditions: [], dietaryTypes: [] },
                { name: 'Buddha bowl', calories: 340, safe: true, allergens: [], healthConditions: [], dietaryTypes: ['vegetarian', 'vegan'] }
            ],
            dinner: [
                { name: 'Grilled salmon with vegetables', calories: 350, safe: true, allergens: ['fish'], healthConditions: [], dietaryTypes: [] },
                { name: 'Vegetable stir-fry with brown rice', calories: 280, safe: true, allergens: [], healthConditions: [], dietaryTypes: ['vegetarian', 'vegan'] },
                { name: 'Lentil curry with quinoa', calories: 300, safe: true, allergens: [], healthConditions: [], dietaryTypes: ['vegetarian', 'vegan'] },
                { name: 'Grilled tofu with vegetables', calories: 250, safe: true, allergens: ['soy'], healthConditions: [], dietaryTypes: ['vegetarian', 'vegan'] }
            ],
            snacks: [
                { name: 'Mixed nuts', calories: 160, safe: true, allergens: ['nuts'], healthConditions: [], dietaryTypes: ['vegetarian', 'vegan'] },
                { name: 'Apple slices with almond butter', calories: 180, safe: true, allergens: ['nuts'], healthConditions: [], dietaryTypes: ['vegetarian', 'vegan'] },
                { name: 'Greek yogurt', calories: 100, safe: true, allergens: ['dairy'], healthConditions: [], dietaryTypes: ['vegetarian'] },
                { name: 'Herbal tea with crackers', calories: 80, safe: true, allergens: ['gluten'], healthConditions: [], dietaryTypes: ['vegetarian'] }
            ]
        },
        diabetes: {
            breakfast: [
                { name: 'Steel-cut oats with cinnamon', calories: 200, safe: true, allergens: ['gluten'], healthConditions: ['diabetes'], dietaryTypes: ['vegetarian'] },
                { name: 'Chia seed pudding with berries', calories: 180, safe: true, allergens: [], healthConditions: ['diabetes'], dietaryTypes: ['vegetarian', 'vegan'] },
                { name: 'Vegetable omelet', calories: 220, safe: true, allergens: ['eggs'], healthConditions: ['diabetes'], dietaryTypes: ['vegetarian'] }
            ],
            lunch: [
                { name: 'Quinoa salad with lean protein', calories: 300, safe: true, allergens: [], healthConditions: ['diabetes'], dietaryTypes: ['vegetarian'] },
                { name: 'Lentil soup (low sodium)', calories: 250, safe: true, allergens: [], healthConditions: ['diabetes'], dietaryTypes: ['vegetarian', 'vegan'] }
            ],
            dinner: [
                { name: 'Grilled fish with steamed vegetables', calories: 280, safe: true, allergens: ['fish'], healthConditions: ['diabetes'], dietaryTypes: [] },
                { name: 'Tofu stir-fry with cauliflower rice', calories: 220, safe: true, allergens: ['soy'], healthConditions: ['diabetes'], dietaryTypes: ['vegetarian', 'vegan'] }
            ]
        },
        hypertension: {
            breakfast: [
                { name: 'Oatmeal with banana (no salt)', calories: 200, safe: true, allergens: ['gluten'], healthConditions: ['hypertension'], dietaryTypes: ['vegetarian'] },
                { name: 'Fruit smoothie with spinach', calories: 180, safe: true, allergens: [], healthConditions: ['hypertension'], dietaryTypes: ['vegetarian', 'vegan'] }
            ],
            lunch: [
                { name: 'Mediterranean salad (low sodium)', calories: 300, safe: true, allergens: [], healthConditions: ['hypertension'], dietaryTypes: ['vegetarian', 'vegan'] },
                { name: 'Quinoa bowl with herbs', calories: 280, safe: true, allergens: [], healthConditions: ['hypertension'], dietaryTypes: ['vegetarian', 'vegan'] }
            ],
            dinner: [
                { name: 'Herb-crusted salmon', calories: 320, safe: true, allergens: ['fish'], healthConditions: ['hypertension'], dietaryTypes: [] },
                { name: 'Vegetable curry (low salt)', calories: 250, safe: true, allergens: [], healthConditions: ['hypertension'], dietaryTypes: ['vegetarian', 'vegan'] }
            ]
        }
    }
};

// Enhanced country-specific remedies with personalized precautions
const countryRemedies = {
    IN: {
        fever: [
            {
                name: 'Tulsi (Holy Basil) Tea',
                ingredients: ['Fresh tulsi leaves', 'Water', 'Honey'],
                preparation: 'Boil tulsi leaves in water for 10 minutes. Add honey and drink warm.',
                benefits: 'Natural antipyretic and immune booster',
                precautions: 'Avoid if allergic to basil. Not recommended for people with diabetes without consulting doctor due to honey content.'
            },
            {
                name: 'Ginger and Turmeric Drink',
                ingredients: ['Fresh ginger', 'Turmeric powder', 'Warm water', 'Honey'],
                preparation: 'Mix 1 tsp ginger juice, 1/2 tsp turmeric in warm water. Add honey.',
                benefits: 'Anti-inflammatory and reduces fever',
                precautions: 'Limit turmeric if on blood thinners. Avoid if allergic to ginger.'
            },
            {
                name: 'Ajwain (Carom Seeds) Steam',
                ingredients: ['Ajwain seeds', 'Hot water'],
                preparation: 'Add ajwain to hot water and inhale steam for 10 minutes.',
                benefits: 'Relieves congestion and reduces body heat',
                precautions: 'Keep eyes closed during steaming. Not suitable for asthma patients.'
            },
            {
                name: 'Neem Leaves Decoction',
                ingredients: ['Fresh neem leaves', 'Water'],
                preparation: 'Boil neem leaves in water for 15 minutes. Strain and drink when cool.',
                benefits: 'Natural antipyretic and antibacterial',
                precautions: 'Very bitter taste. Not recommended for pregnant women.'
            },
            {
                name: 'Coriander Seed Water',
                ingredients: ['Coriander seeds', 'Water'],
                preparation: 'Soak coriander seeds overnight. Strain and drink the water.',
                benefits: 'Cooling effect and reduces fever',
                precautions: 'Generally safe for all. Start with small quantities.'
            }
        ],
        cold: [
            {
                name: 'Kadha (Herbal Decoction)',
                ingredients: ['Ginger', 'Black pepper', 'Cinnamon', 'Tulsi', 'Honey'],
                preparation: 'Boil all ingredients except honey for 15 minutes. Add honey before drinking.',
                benefits: 'Boosts immunity and clears congestion',
                precautions: 'Drink while warm for best results. Avoid if allergic to any ingredient.'
            },
            {
                name: 'Haldi Doodh (Turmeric Milk)',
                ingredients: ['Warm milk', 'Turmeric powder', 'Black pepper', 'Honey'],
                preparation: 'Mix 1/2 tsp turmeric and pinch of pepper in warm milk. Add honey.',
                benefits: 'Anti-inflammatory and soothes throat',
                precautions: 'Avoid if lactose intolerant or allergic to dairy.'
            },
            {
                name: 'Steam Inhalation with Eucalyptus',
                ingredients: ['Eucalyptus oil', 'Hot water'],
                preparation: 'Add 2-3 drops of eucalyptus oil to hot water and inhale steam.',
                benefits: 'Clears nasal congestion',
                precautions: 'Keep eyes closed. Not suitable for children under 6.'
            },
            {
                name: 'Garlic and Honey',
                ingredients: ['Fresh garlic cloves', 'Raw honey'],
                preparation: 'Crush garlic and mix with honey. Take 1 tsp twice daily.',
                benefits: 'Natural antibiotic and immune booster',
                precautions: 'Strong taste. Avoid if allergic to garlic.'
            },
            {
                name: 'Ginger Tea',
                ingredients: ['Fresh ginger', 'Water', 'Lemon', 'Honey'],
                preparation: 'Boil ginger in water, add lemon and honey.',
                benefits: 'Soothes throat and reduces inflammation',
                precautions: 'Avoid if allergic to ginger or citrus.'
            }
        ],
        cough: [
            {
                name: 'Honey and Ginger',
                ingredients: ['Fresh ginger juice', 'Raw honey'],
                preparation: 'Mix equal parts ginger juice and honey. Take 1 tsp every 4 hours.',
                benefits: 'Natural cough suppressant and throat soother',
                precautions: 'Not for children under 1 year due to honey. Avoid if diabetic without doctor consultation.'
            },
            {
                name: 'Mulethi (Licorice) Tea',
                ingredients: ['Mulethi root', 'Water'],
                preparation: 'Boil mulethi root in water for 10 minutes. Strain and drink.',
                benefits: 'Soothes throat and reduces cough',
                precautions: 'Avoid if you have high blood pressure or heart disease.'
            },
            {
                name: 'Betel Leaves with Honey',
                ingredients: ['Fresh betel leaves', 'Honey'],
                preparation: 'Crush betel leaves and mix with honey. Take small amounts.',
                benefits: 'Reduces cough and throat irritation',
                precautions: 'Use only fresh, clean betel leaves.'
            },
            {
                name: 'Onion Syrup',
                ingredients: ['Red onion', 'Honey'],
                preparation: 'Slice onion, layer with honey, let sit overnight. Take the syrup.',
                benefits: 'Natural expectorant',
                precautions: 'Strong taste. Not suitable for those allergic to onions.'
            },
            {
                name: 'Basil and Honey',
                ingredients: ['Fresh basil leaves', 'Honey'],
                preparation: 'Crush basil leaves and mix with honey.',
                benefits: 'Antimicrobial and cough suppressant',
                precautions: 'Avoid if allergic to basil.'
            }
        ],
        stomachAche: [
            {
                name: 'Jeera (Cumin) Water',
                ingredients: ['Cumin seeds', 'Water'],
                preparation: 'Soak cumin seeds overnight. Drink the water in the morning.',
                benefits: 'Aids digestion and reduces bloating',
                precautions: 'Start with small quantities. Generally safe for all.'
            },
            {
                name: 'Hing (Asafoetida) Remedy',
                ingredients: ['Asafoetida powder', 'Warm water', 'Salt'],
                preparation: 'Mix pinch of hing with warm water and salt. Drink immediately.',
                benefits: 'Relieves gas and stomach pain',
                precautions: 'Use very small quantities. Strong smell and taste.'
            },
            {
                name: 'Fennel Seed Tea',
                ingredients: ['Fennel seeds', 'Hot water'],
                preparation: 'Steep fennel seeds in hot water for 10 minutes.',
                benefits: 'Reduces gas and aids digestion',
                precautions: 'Generally safe. Avoid if allergic to fennel.'
            },
            {
                name: 'Mint Tea',
                ingredients: ['Fresh mint leaves', 'Hot water'],
                preparation: 'Steep mint leaves in hot water for 5-10 minutes.',
                benefits: 'Soothes stomach and reduces nausea',
                precautions: 'May worsen acid reflux in some people.'
            },
            {
                name: 'Ajwain and Salt',
                ingredients: ['Ajwain seeds', 'Black salt', 'Warm water'],
                preparation: 'Mix ajwain and salt in warm water. Drink slowly.',
                benefits: 'Relieves indigestion and gas',
                precautions: 'Monitor salt intake if you have hypertension.'
            }
        ],
        headache: [
            {
                name: 'Peppermint Oil Massage',
                ingredients: ['Peppermint oil', 'Coconut oil'],
                preparation: 'Mix few drops of peppermint oil with coconut oil. Massage on temples.',
                benefits: 'Cooling effect and pain relief',
                precautions: 'Avoid contact with eyes. Test on small skin area first.'
            },
            {
                name: 'Ginger Paste',
                ingredients: ['Fresh ginger', 'Water'],
                preparation: 'Make paste of ginger with little water. Apply on forehead.',
                benefits: 'Natural pain reliever',
                precautions: 'Wash off if skin irritation occurs. Avoid eye area.'
            },
            {
                name: 'Cinnamon Paste',
                ingredients: ['Cinnamon powder', 'Water'],
                preparation: 'Mix cinnamon with water to make paste. Apply on forehead.',
                benefits: 'Reduces headache pain',
                precautions: 'May cause skin sensitivity in some people.'
            },
            {
                name: 'Lavender Oil Inhalation',
                ingredients: ['Lavender essential oil'],
                preparation: 'Inhale lavender oil directly or add to diffuser.',
                benefits: 'Relaxation and stress relief',
                precautions: 'Use pure essential oil. Avoid if allergic to lavender.'
            },
            {
                name: 'Cold Compress',
                ingredients: ['Ice cubes', 'Clean cloth'],
                preparation: 'Wrap ice in cloth and apply to forehead for 15 minutes.',
                benefits: 'Reduces inflammation and pain',
                precautions: 'Don\'t apply ice directly to skin.'
            }
        ],
        sorethroat: [
            {
                name: 'Salt Water Gargle',
                ingredients: ['Salt', 'Warm water'],
                preparation: 'Mix 1 tsp salt in warm water. Gargle 3-4 times daily.',
                benefits: 'Reduces inflammation and kills bacteria',
                precautions: 'Do not swallow the salt water. Monitor salt intake if hypertensive.'
            },
            {
                name: 'Honey and Ginger',
                ingredients: ['Honey', 'Ginger juice'],
                preparation: 'Mix honey with fresh ginger juice. Take small sips.',
                benefits: 'Soothes throat and reduces inflammation',
                precautions: 'Not for infants under 1 year. Avoid if diabetic without consultation.'
            },
            {
                name: 'Turmeric Milk Gargle',
                ingredients: ['Turmeric powder', 'Warm milk', 'Salt'],
                preparation: 'Mix turmeric and salt in warm milk. Use for gargling.',
                benefits: 'Anti-inflammatory and antimicrobial',
                precautions: 'Avoid if lactose intolerant or allergic to dairy.'
            },
            {
                name: 'Clove Tea',
                ingredients: ['Whole cloves', 'Hot water'],
                preparation: 'Steep cloves in hot water for 10 minutes. Strain and drink.',
                benefits: 'Natural analgesic and antimicrobial',
                precautions: 'Strong taste. Use in moderation.'
            },
            {
                name: 'Licorice Root Tea',
                ingredients: ['Licorice root', 'Hot water'],
                preparation: 'Steep licorice root in hot water for 15 minutes.',
                benefits: 'Soothes throat irritation',
                precautions: 'Avoid if you have high blood pressure or heart conditions.'
            }
        ]
    },
    US: {
        fever: [
            {
                name: 'Willow Bark Tea',
                ingredients: ['Willow bark', 'Water', 'Honey'],
                preparation: 'Steep willow bark in hot water for 15 minutes. Add honey.',
                benefits: 'Natural aspirin-like effects',
                precautions: 'Avoid if allergic to aspirin or salicylates.'
            },
            {
                name: 'Elderberry Syrup',
                ingredients: ['Elderberries', 'Water', 'Honey', 'Ginger'],
                preparation: 'Simmer elderberries with ginger, strain, add honey.',
                benefits: 'Immune support and fever reduction',
                precautions: 'Use only ripe elderberries. Raw elderberries can be toxic.'
            },
            {
                name: 'Echinacea Tea',
                ingredients: ['Echinacea leaves', 'Hot water'],
                preparation: 'Steep echinacea in hot water for 10 minutes.',
                benefits: 'Immune system support',
                precautions: 'May cause allergic reactions in some people.'
            },
            {
                name: 'Ginger Lemon Tea',
                ingredients: ['Fresh ginger', 'Lemon', 'Honey', 'Hot water'],
                preparation: 'Steep ginger in hot water, add lemon and honey.',
                benefits: 'Anti-inflammatory and hydrating',
                precautions: 'Avoid if allergic to ginger or citrus.'
            },
            {
                name: 'Cool Bath',
                ingredients: ['Cool water', 'Epsom salt (optional)'],
                preparation: 'Take a lukewarm to cool bath for 10-15 minutes.',
                benefits: 'Helps reduce body temperature',
                precautions: 'Don\'t use ice-cold water. Monitor for shivering.'
            }
        ],
        cold: [
            {
                name: 'Chicken Soup',
                ingredients: ['Chicken broth', 'Vegetables', 'Herbs'],
                preparation: 'Simmer chicken with vegetables and herbs for 2 hours.',
                benefits: 'Hydration and immune support',
                precautions: 'Ensure proper cooking temperature. Avoid if vegetarian.'
            },
            {
                name: 'Echinacea Tea',
                ingredients: ['Echinacea leaves', 'Hot water', 'Lemon'],
                preparation: 'Steep echinacea in hot water for 10 minutes. Add lemon.',
                benefits: 'Immune system booster',
                precautions: 'May cause allergic reactions in some people with ragweed allergies.'
            },
            {
                name: 'Zinc Lozenges',
                ingredients: ['Zinc lozenges'],
                preparation: 'Dissolve zinc lozenge in mouth as directed.',
                benefits: 'May reduce cold duration',
                precautions: 'Follow dosage instructions. May cause nausea on empty stomach.'
            },
            {
                name: 'Steam Inhalation',
                ingredients: ['Hot water', 'Essential oils (optional)'],
                preparation: 'Inhale steam from hot water for 10-15 minutes.',
                benefits: 'Relieves nasal congestion',
                precautions: 'Be careful with hot water. Keep eyes closed.'
            },
            {
                name: 'Vitamin C Rich Foods',
                ingredients: ['Oranges', 'Berries', 'Bell peppers'],
                preparation: 'Consume fresh fruits and vegetables high in vitamin C.',
                benefits: 'Supports immune function',
                precautions: 'Generally safe. Avoid if allergic to specific fruits.'
            }
        ],
        cough: [
            {
                name: 'Honey and Lemon',
                ingredients: ['Raw honey', 'Fresh lemon juice', 'Warm water'],
                preparation: 'Mix honey and lemon juice in warm water.',
                benefits: 'Soothes throat and suppresses cough',
                precautions: 'Not for children under 1 year. Monitor if diabetic.'
            },
            {
                name: 'Thyme Tea',
                ingredients: ['Fresh thyme', 'Hot water', 'Honey'],
                preparation: 'Steep thyme in hot water, add honey.',
                benefits: 'Natural cough suppressant',
                precautions: 'Generally safe. Avoid if allergic to thyme.'
            },
            {
                name: 'Marshmallow Root Tea',
                ingredients: ['Marshmallow root', 'Hot water'],
                preparation: 'Steep marshmallow root in hot water for 15 minutes.',
                benefits: 'Soothes throat irritation',
                precautions: 'May interfere with medication absorption.'
            },
            {
                name: 'Slippery Elm',
                ingredients: ['Slippery elm bark powder', 'Hot water'],
                preparation: 'Mix powder with hot water to form gel-like consistency.',
                benefits: 'Coats and soothes throat',
                precautions: 'Take separately from medications.'
            },
            {
                name: 'Ginger Tea',
                ingredients: ['Fresh ginger', 'Hot water', 'Honey'],
                preparation: 'Steep ginger in hot water, add honey.',
                benefits: 'Anti-inflammatory and soothing',
                precautions: 'Avoid if allergic to ginger.'
            }
        ],
        stomachAche: [
            {
                name: 'Peppermint Tea',
                ingredients: ['Fresh peppermint leaves', 'Hot water'],
                preparation: 'Steep peppermint leaves in hot water for 10 minutes.',
                benefits: 'Soothes digestive system',
                precautions: 'May worsen acid reflux in some people.'
            },
            {
                name: 'Chamomile Tea',
                ingredients: ['Chamomile flowers', 'Hot water'],
                preparation: 'Steep chamomile in hot water for 5-10 minutes.',
                benefits: 'Anti-inflammatory and calming',
                precautions: 'Avoid if allergic to ragweed or daisies.'
            },
            {
                name: 'Ginger Tea',
                ingredients: ['Fresh ginger', 'Hot water'],
                preparation: 'Steep ginger in hot water for 10 minutes.',
                benefits: 'Reduces nausea and aids digestion',
                precautions: 'Avoid if allergic to ginger.'
            },
            {
                name: 'BRAT Diet',
                ingredients: ['Bananas', 'Rice', 'Applesauce', 'Toast'],
                preparation: 'Eat bland foods in small portions.',
                benefits: 'Easy to digest, helps firm stool',
                precautions: 'Not nutritionally complete for long-term use.'
            },
            {
                name: 'Fennel Tea',
                ingredients: ['Fennel seeds', 'Hot water'],
                preparation: 'Steep fennel seeds in hot water for 10 minutes.',
                benefits: 'Reduces gas and bloating',
                precautions: 'Generally safe. Avoid if allergic to fennel.'
            }
        ],
        headache: [
            {
                name: 'Lavender Oil',
                ingredients: ['Lavender essential oil', 'Carrier oil'],
                preparation: 'Dilute lavender oil and apply to temples.',
                benefits: 'Relaxation and pain relief',
                precautions: 'Always dilute essential oils. Test on small skin area first.'
            },
            {
                name: 'Peppermint Oil',
                ingredients: ['Peppermint essential oil', 'Carrier oil'],
                preparation: 'Dilute and apply to temples and forehead.',
                benefits: 'Cooling sensation and pain relief',
                precautions: 'Avoid contact with eyes. May cause skin sensitivity.'
            },
            {
                name: 'Cold Compress',
                ingredients: ['Ice pack', 'Towel'],
                preparation: 'Apply cold compress to forehead for 15-20 minutes.',
                benefits: 'Reduces inflammation and numbs pain',
                precautions: 'Don\'t apply ice directly to skin.'
            },
            {
                name: 'Magnesium Supplement',
                ingredients: ['Magnesium supplement'],
                preparation: 'Take as directed by healthcare provider.',
                benefits: 'May prevent migraines',
                precautions: 'Consult doctor before taking supplements.'
            },
            {
                name: 'Hydration',
                ingredients: ['Water', 'Electrolyte solution'],
                preparation: 'Drink plenty of fluids throughout the day.',
                benefits: 'Prevents dehydration headaches',
                precautions: 'Monitor fluid intake if you have kidney or heart conditions.'
            }
        ],
        sorethroat: [
            {
                name: 'Apple Cider Vinegar Gargle',
                ingredients: ['Apple cider vinegar', 'Warm water', 'Salt'],
                preparation: 'Mix ACV with warm water and salt. Gargle gently.',
                benefits: 'Antibacterial properties',
                precautions: 'Dilute properly to avoid irritation. Don\'t swallow.'
            },
            {
                name: 'Honey and Warm Water',
                ingredients: ['Raw honey', 'Warm water'],
                preparation: 'Mix honey in warm water and sip slowly.',
                benefits: 'Soothes throat and has antimicrobial properties',
                precautions: 'Not for children under 1 year.'
            },
            {
                name: 'Slippery Elm Lozenges',
                ingredients: ['Slippery elm lozenges'],
                preparation: 'Dissolve lozenge slowly in mouth.',
                benefits: 'Coats and soothes throat',
                precautions: 'Follow package directions.'
            },
            {
                name: 'Warm Salt Water Gargle',
                ingredients: ['Salt', 'Warm water'],
                preparation: 'Mix 1/2 tsp salt in warm water. Gargle several times daily.',
                benefits: 'Reduces swelling and kills bacteria',
                precautions: 'Don\'t swallow. Monitor salt intake if hypertensive.'
            },
            {
                name: 'Licorice Root Tea',
                ingredients: ['Licorice root', 'Hot water'],
                preparation: 'Steep licorice root in hot water for 15 minutes.',
                benefits: 'Anti-inflammatory and soothing',
                precautions: 'Avoid if you have high blood pressure or heart conditions.'
            }
        ]
    }
};

// Chat system responses
const chatResponses = {
    medication_analysis: {
        safe: "Your medication list has been reviewed. All medications appear to be appropriate for your health conditions. Continue taking as prescribed and maintain regular follow-ups with your doctor.",
        concern: "I've reviewed your medications and noticed some potential concerns. Please consult with your doctor about possible interactions or dosage adjustments.",
        postop: "For post-operative care, ensure you're taking pain medications as prescribed. Watch for signs of infection and follow wound care instructions."
    },
    health_log_analysis: {
        good: "Your health readings look stable. Keep maintaining your current lifestyle and medication routine.",
        bp_high: "Your blood pressure readings show some elevation. Consider reducing sodium intake and increasing physical activity. Consult your doctor if readings remain high.",
        sugar_high: "Your blood sugar levels are elevated. Monitor your carbohydrate intake and ensure you're taking diabetes medications as prescribed."
    },
    diet_plan_analysis: {
        approved: "Your diet plan looks well-balanced and appropriate for your health conditions. It aligns with your dietary preferences and restrictions.",
        needs_review: "Your diet plan has been forwarded to our nutritionist for review due to some concerns with your health conditions. You'll receive detailed feedback shortly."
    }
};

// Utility Functions
function t(key) {
    return translations[currentLanguage]?.[key] || key;
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function showElement(id) {
    const element = document.getElementById(id);
    if (element) element.style.display = 'block';
}

function hideElement(id) {
    const element = document.getElementById(id);
    if (element) element.style.display = 'none';
}

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-page="${pageId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Update page-specific content
    if (pageId === 'diet-plan') {
        updateMealPlan();
    } else if (pageId === 'home-remedies') {
        updateHomeRemedies();
    } else if (pageId === 'health-tracking') {
        updateHealthCharts();
    }
}

function updateTranslations() {
    // Update all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = t(key);
        
        if (element.tagName === 'INPUT' && element.type !== 'submit') {
            // For input elements, update placeholder
            if (element.hasAttribute('data-translate-placeholder')) {
                const placeholderKey = element.getAttribute('data-translate-placeholder');
                element.placeholder = t(placeholderKey);
            }
        } else if (element.tagName === 'OPTION') {
            // For option elements
            element.textContent = translation;
        } else {
            // For other elements, update text content
            element.textContent = translation;
        }
    });
    
    // Update placeholders separately
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        element.placeholder = t(key);
    });
}

// Authentication Functions
function initAuth() {
    const savedUser = loadFromLocalStorage('nutricare_user');
    if (savedUser) {
        currentUser = savedUser;
        if (savedUser.profileComplete) {
            showMainApp();
        } else {
            showProfileSetup();
        }
    } else {
        showAuthForm();
    }
}

function showAuthForm() {
    hideElement('profileSetup');
    hideElement('mainApp');
    showElement('authForm');
    // Start in signup mode by default
    toggleAuthMode(false); // false = signup mode
    updateTranslations();
}

function showProfileSetup() {
    hideElement('authForm');
    hideElement('mainApp');
    showElement('profileSetup');
    updateProfileStep();
    updateTranslations();
}

function showMainApp() {
    hideElement('authForm');
    hideElement('profileSetup');
    showElement('mainApp');
    updateUserInfo();
    updateDashboard();
    updateTranslations();
}

function handleAuth(event) {
    event.preventDefault();
    
    const isLoginMode = document.getElementById('nameField').style.display === 'none';
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Enhanced password validation for signup
    if (!isLoginMode) {
        // Check password strength
        const validation = validatePassword(password);
        if (validation.score < 5) {
            showError('Password must contain at least 8 characters with uppercase, lowercase, number, and special character.');
            return;
        }
        
        // Check password match
        if (password !== confirmPassword) {
            showError('Passwords do not match.');
            return;
        }
        
        // Check if name is provided
        if (!name.trim()) {
            showError('Please enter your full name.');
            return;
        }
    }
    
    // Show loading
    const btn = document.querySelector('.auth-btn');
    const btnText = document.getElementById('authBtnText');
    const loader = document.getElementById('authLoader');
    
    btnText.style.display = 'none';
    loader.style.display = 'inline-block';
    btn.disabled = true;
    
    setTimeout(() => {
        if (isLoginMode) {
            // Login logic with enhanced security
            const users = loadFromLocalStorage('nutricare_users') || [];
            const user = users.find(u => u.email === email);
            
            if (!user) {
                showError('No account found with this email address.');
            } else if (user.password !== password) {
                showError('Incorrect password. Please try again.');
            } else {
                // Successful login
                currentUser = { ...user };
                delete currentUser.password; // Remove password from memory
                saveToLocalStorage('nutricare_user', currentUser);
                
                if (currentUser.profileComplete) {
                    showMainApp();
                } else {
                    showProfileSetup();
                }
            }
        } else {
            // Register logic with enhanced validation
            const users = loadFromLocalStorage('nutricare_users') || [];
            const existingUser = users.find(u => u.email === email);
            
            if (existingUser) {
                showError('An account with this email already exists. Please sign in instead.');
            } else {
                const newUser = {
                    id: Date.now().toString(),
                    name: name.trim(),
                    email,
                    password, // Store securely hashed in production
                    profileComplete: false,
                    createdAt: new Date().toISOString()
                };
                
                users.push(newUser);
                saveToLocalStorage('nutricare_users', users);
                
                currentUser = { ...newUser };
                delete currentUser.password; // Remove password from memory
                saveToLocalStorage('nutricare_user', currentUser);
                
                showProfileSetup();
            }
        }
        
        // Reset button
        btnText.style.display = 'inline';
        loader.style.display = 'none';
        btn.disabled = false;
    }, 1000);
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.innerHTML = `<p>${message}</p>`;
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function toggleAuthMode(forceMode = null) {
    const nameField = document.getElementById('nameField');
    const confirmPasswordField = document.getElementById('confirmPasswordField');
    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');
    const authBtnText = document.getElementById('authBtnText');
    const authSwitchText = document.getElementById('authSwitchText');
    const authSwitchBtn = document.getElementById('authSwitchBtn');
    
    let isLoginMode;
    if (forceMode !== null) {
        isLoginMode = forceMode; // true for login, false for signup
    } else {
        isLoginMode = nameField.style.display !== 'none';
    }
    
    if (isLoginMode) {
        // Switch to login mode
        nameField.style.display = 'none';
        confirmPasswordField.style.display = 'none';
        authTitle.setAttribute('data-translate', 'welcomeBack');
        authSubtitle.setAttribute('data-translate', 'signInMessage');
        authBtnText.setAttribute('data-translate', 'signIn');
        authSwitchText.setAttribute('data-translate', 'noAccount');
        authSwitchBtn.setAttribute('data-translate', 'signUp');
        
        // Remove required attribute from signup fields
        document.getElementById('name').removeAttribute('required');
        document.getElementById('confirmPassword').removeAttribute('required');
    } else {
        // Switch to signup mode
        nameField.style.display = 'block';
        confirmPasswordField.style.display = 'block';
        authTitle.setAttribute('data-translate', 'createAccount');
        authSubtitle.setAttribute('data-translate', 'createAccountMessage');
        authBtnText.setAttribute('data-translate', 'createAccount');
        authSwitchText.setAttribute('data-translate', 'alreadyHaveAccount');
        authSwitchBtn.setAttribute('data-translate', 'signIn');
        
        // Add required attribute to signup fields
        document.getElementById('name').setAttribute('required', '');
        document.getElementById('confirmPassword').setAttribute('required', '');
    }
    
    // Clear form
    document.getElementById('authFormElement').reset();
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('passwordStrength').style.display = 'none';
    document.getElementById('passwordMatch').style.display = 'none';
    
    // Update translations
    updateTranslations();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('nutricare_user');
    // Redirect to signup page instead of profile setup
    showAuthForm();
}

// Profile Setup Functions
function updateProfileStep() {
    const currentStepSpan = document.getElementById('currentStep');
    const progressPercent = document.getElementById('progressPercent');
    const progressFill = document.getElementById('progressFill');
    const backBtn = document.getElementById('backBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (currentStepSpan) currentStepSpan.textContent = profileStep;
    if (progressPercent) progressPercent.textContent = `${Math.round((profileStep / 5) * 100)}% Complete`;
    if (progressFill) progressFill.style.width = `${(profileStep / 5) * 100}%`;
    
    // Show/hide steps
    for (let i = 1; i <= 5; i++) {
        const step = document.getElementById(`step${i}`);
        if (step) {
            if (i === profileStep) {
                step.style.display = 'block';
            } else {
                step.style.display = 'none';
            }
        }
    }
    
    // Update buttons
    if (backBtn) backBtn.disabled = profileStep === 1;
    
    if (nextBtn) {
        if (profileStep === 5) {
            nextBtn.setAttribute('data-translate', 'completeSetup');
            nextBtn.style.background = '#059669';
        } else {
            nextBtn.setAttribute('data-translate', 'next');
            nextBtn.style.background = '#2563eb';
        }
    }
    
    updateTranslations();
}

function nextStep() {
    if (profileStep < 5) {
        profileStep++;
        updateProfileStep();
    } else {
        completeProfile();
    }
}

function prevStep() {
    if (profileStep > 1) {
        profileStep--;
        updateProfileStep();
    }
}

function completeProfile() {
    // Collect profile data
    const ageInput = document.getElementById('age');
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const otherHealthConditionsInput = document.getElementById('otherHealthConditions');
    const otherAllergiesInput = document.getElementById('otherAllergies');
    const otherDietaryPreferencesInput = document.getElementById('otherDietaryPreferences');
    const medicalHistoryInput = document.getElementById('medicalHistory');
    const currentMedicationsInput = document.getElementById('currentMedications');
    const lifestyleInfoInput = document.getElementById('lifestyleInfo');
    
    profileData.age = ageInput ? parseInt(ageInput.value) || 0 : 0;
    profileData.weight = weightInput ? parseFloat(weightInput.value) || 0 : 0;
    profileData.height = heightInput ? parseFloat(heightInput.value) || 0 : 0;
    profileData.otherHealthConditions = otherHealthConditionsInput ? otherHealthConditionsInput.value : '';
    profileData.otherAllergies = otherAllergiesInput ? otherAllergiesInput.value : '';
    profileData.otherDietaryPreferences = otherDietaryPreferencesInput ? otherDietaryPreferencesInput.value : '';
    profileData.medicalHistory = medicalHistoryInput ? medicalHistoryInput.value : '';
    profileData.currentMedications = currentMedicationsInput ? currentMedicationsInput.value : '';
    profileData.lifestyleInfo = lifestyleInfoInput ? lifestyleInfoInput.value : '';
    
    // Update user profile
    currentUser = {
        ...currentUser,
        ...profileData,
        profileComplete: true
    };
    
    saveToLocalStorage('nutricare_user', currentUser);
    
    // Update users array
    const users = loadFromLocalStorage('nutricare_users') || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...profileData, profileComplete: true };
        saveToLocalStorage('nutricare_users', users);
    }
    
    showMainApp();
}

function toggleOption(button) {
    button.classList.toggle('selected');
    
    const container = button.parentElement;
    const containerId = container.id;
    const value = button.getAttribute('data-value');
    
    if (!profileData[containerId]) {
        profileData[containerId] = [];
    }
    
    if (button.classList.contains('selected')) {
        if (!profileData[containerId].includes(value)) {
            profileData[containerId].push(value);
        }
    } else {
        profileData[containerId] = profileData[containerId].filter(item => item !== value);
    }
}

// Main App Functions
function updateUserInfo() {
    if (currentUser) {
        const userNameElements = document.querySelectorAll('#userName, #dashboardUserName, #profileName');
        userNameElements.forEach(el => {
            if (el) el.textContent = currentUser.name;
        });
        
        const userEmailElement = document.getElementById('userEmail');
        if (userEmailElement) userEmailElement.textContent = currentUser.email;
        
        // Update profile details
        const profileAge = document.getElementById('profileAge');
        const profileWeight = document.getElementById('profileWeight');
        const profileHeight = document.getElementById('profileHeight');
        const profileBMI = document.getElementById('profileBMI');
        
        if (profileAge) profileAge.textContent = currentUser.age || '--';
        if (profileWeight) profileWeight.textContent = currentUser.weight || '--';
        if (profileHeight) profileHeight.textContent = currentUser.height || '--';
        
        // Calculate BMI
        if (currentUser.weight && currentUser.height && profileBMI) {
            const heightInMeters = currentUser.height / 100;
            const bmi = (currentUser.weight / (heightInMeters * heightInMeters)).toFixed(1);
            profileBMI.textContent = bmi;
        } else if (profileBMI) {
            profileBMI.textContent = '--';
        }
    }
}

function updateDashboard() {
    // Update medication count
    const medicationCountElement = document.getElementById('activeMedicationsCount');
    if (medicationCountElement) {
        medicationCountElement.textContent = medications.length;
    }
    
    // Update latest health readings
    updateLatestHealthReadings();
    
    // Update medication list
    const medicationEmptyState = document.getElementById('medicationEmptyState');
    const medicationList = document.getElementById('medicationList');
    
    if (medications.length === 0) {
        if (medicationEmptyState) medicationEmptyState.style.display = 'block';
        if (medicationList) medicationList.style.display = 'none';
    } else {
        if (medicationEmptyState) medicationEmptyState.style.display = 'none';
        if (medicationList) medicationList.style.display = 'block';
        renderMedicationList();
    }
    
    // Update meal plan with personalized recommendations
    updateMealPlan();
    updatePersonalizedWarnings();
}

function updateLatestHealthReadings() {
    if (healthData.length > 0) {
        const latestReading = healthData[healthData.length - 1];
        
        // Update BP
        const latestBPElement = document.getElementById('latestBPValue');
        const dashboardBPElement = document.getElementById('dashboardBPValue');
        if (latestReading.systolic && latestReading.diastolic) {
            const bpValue = `${latestReading.systolic}/${latestReading.diastolic}`;
            if (latestBPElement) latestBPElement.textContent = bpValue;
            if (dashboardBPElement) dashboardBPElement.textContent = bpValue;
        }
        
        // Update Sugar
        const latestSugarElement = document.getElementById('latestSugarValue');
        const dashboardSugarElement = document.getElementById('dashboardSugarValue');
        if (latestReading.bloodSugar) {
            if (latestSugarElement) latestSugarElement.textContent = latestReading.bloodSugar;
            if (dashboardSugarElement) dashboardSugarElement.textContent = latestReading.bloodSugar;
        }
        
        // Update Weight
        const dashboardWeightElement = document.getElementById('dashboardWeightValue');
        if (latestReading.weight && dashboardWeightElement) {
            dashboardWeightElement.textContent = latestReading.weight;
        }
        
        // Update Heart Rate
        const dashboardHeartRateElement = document.getElementById('dashboardHeartRateValue');
        if (latestReading.heartRate && dashboardHeartRateElement) {
            dashboardHeartRateElement.textContent = latestReading.heartRate;
        }
    }
}

function getPersonalizedMealPlan() {
    if (!currentUser) return countryMealPlans[currentCountry]?.general || countryMealPlans.US.general;
    
    const userHealthConditions = currentUser.healthConditions || [];
    const countryPlan = countryMealPlans[currentCountry] || countryMealPlans.US;
    
    // Prioritize meals based on health conditions
    if (userHealthConditions.includes('diabetes') && countryPlan.diabetes) {
        return countryPlan.diabetes;
    } else if (userHealthConditions.includes('hypertension') && countryPlan.hypertension) {
        return countryPlan.hypertension;
    }
    
    return countryPlan.general;
}

function updateMealPlan() {
    const mealPlan = getPersonalizedMealPlan();
    
    // Update dashboard meal cards with personalized recommendations
    const breakfastMeal = document.getElementById('breakfastMeal');
    const lunchMeal = document.getElementById('lunchMeal');
    const dinnerMeal = document.getElementById('dinnerMeal');
    
    if (breakfastMeal && mealPlan.breakfast && mealPlan.breakfast[0]) {
        const safeMeal = getSafeMealOption(mealPlan.breakfast);
        breakfastMeal.textContent = safeMeal.name;
    }
    if (lunchMeal && mealPlan.lunch && mealPlan.lunch[0]) {
        const safeMeal = getSafeMealOption(mealPlan.lunch);
        lunchMeal.textContent = safeMeal.name;
    }
    if (dinnerMeal && mealPlan.dinner && mealPlan.dinner[0]) {
        const safeMeal = getSafeMealOption(mealPlan.dinner);
        dinnerMeal.textContent = safeMeal.name;
    }
    
    // Update diet plan page
    updateDietPlanPage();
}

function getSafeMealOption(mealOptions) {
    if (!currentUser || !mealOptions || mealOptions.length === 0) {
        return mealOptions[0];
    }
    
    // Find the first meal that's safe for the user
    for (const meal of mealOptions) {
        if (checkFoodSafety(meal)) {
            return meal;
        }
    }
    
    // If no safe option found, return the first one with a warning
    return mealOptions[0];
}

function updateDietPlanPage() {
    const mealPlan = getPersonalizedMealPlan();
    const activeMeal = document.querySelector('.meal-tab.active')?.getAttribute('data-meal') || 'breakfast';
    
    updateMealContent(activeMeal, mealPlan);
}

function updateMealContent(mealType, mealPlan) {
    const mealIcon = document.getElementById('mealIcon');
    const mealTitle = document.getElementById('mealTitle');
    const mealTime = document.getElementById('mealTime');
    const mealItems = document.getElementById('mealItems');
    
    const mealTimes = {
        breakfast: '8:00 AM',
        lunch: '12:30 PM',
        dinner: '7:00 PM',
        snacks: 'Anytime'
    };
    
    const mealIcons = {
        breakfast: 'fas fa-sun',
        lunch: 'fas fa-cloud-sun',
        dinner: 'fas fa-moon',
        snacks: 'fas fa-utensils'
    };
    
    if (mealIcon) {
        mealIcon.className = mealIcons[mealType];
    }
    if (mealTitle) {
        mealTitle.textContent = t(mealType);
    }
    if (mealTime) {
        mealTime.textContent = mealTimes[mealType];
    }
    
    if (mealItems && mealPlan[mealType]) {
        mealItems.innerHTML = '';
        mealPlan[mealType].forEach(item => {
            const mealItemDiv = document.createElement('div');
            mealItemDiv.className = 'meal-item';
            
            // Enhanced safety check based on user profile
            const isSafe = checkFoodSafety(item);
            const isRecommended = checkFoodRecommendation(item);
            
            mealItemDiv.innerHTML = `
                <div class="meal-item-info">
                    <div class="meal-item-status ${isSafe ? (isRecommended ? 'recommended' : 'safe') : 'caution'}"></div>
                    <div class="meal-item-details">
                        <h4>${item.name}</h4>
                        <p>${item.calories} calories</p>
                        ${item.healthConditions && item.healthConditions.length > 0 ? 
                            `<p class="health-benefit">Good for: ${item.healthConditions.join(', ')}</p>` : ''}
                    </div>
                </div>
                <div class="meal-item-actions">
                    <span class="safety-badge ${isSafe ? (isRecommended ? 'recommended' : 'safe') : 'caution'}">
                        ${isRecommended ? 'Recommended' : (isSafe ? 'Safe' : 'Caution')}
                    </span>
                </div>
            `;
            
            mealItems.appendChild(mealItemDiv);
        });
    }
}

function checkFoodSafety(foodItem) {
    if (!currentUser) return true;
    
    // Check against user's allergies
    if (currentUser.allergies) {
        for (const allergy of currentUser.allergies) {
            if (foodItem.allergens && foodItem.allergens.includes(allergy.toLowerCase())) {
                return false;
            }
        }
    }
    
    // Check against other allergies from profile
    if (currentUser.otherAllergies) {
        const otherAllergies = currentUser.otherAllergies.toLowerCase().split(',');
        for (const allergy of otherAllergies) {
            if (foodItem.name.toLowerCase().includes(allergy.trim())) {
                return false;
            }
        }
    }
    
    // Check dietary preferences
    if (currentUser.dietaryPreferences) {
        if (currentUser.dietaryPreferences.includes('vegetarian') && 
            foodItem.dietaryTypes && !foodItem.dietaryTypes.includes('vegetarian')) {
            return false;
        }
        if (currentUser.dietaryPreferences.includes('vegan') && 
            foodItem.dietaryTypes && !foodItem.dietaryTypes.includes('vegan')) {
            return false;
        }
    }
    
    return true;
}

function checkFoodRecommendation(foodItem) {
    if (!currentUser || !currentUser.healthConditions) return false;
    
    // Check if food is specifically beneficial for user's health conditions
    if (foodItem.healthConditions) {
        for (const condition of currentUser.healthConditions) {
            if (foodItem.healthConditions.includes(condition)) {
                return true;
            }
        }
    }
    
    return false;
}

function updatePersonalizedWarnings() {
    const warningsContainer = document.getElementById('personalizedWarnings');
    if (!warningsContainer || !currentUser) return;
    
    warningsContainer.innerHTML = '';
    
    const warnings = [];
    
    // Add warnings based on health conditions
    if (currentUser.healthConditions) {
        if (currentUser.healthConditions.includes('diabetes')) {
            warnings.push({
                title: 'High sugar foods',
                desc: 'Can cause blood sugar spikes and complications'
            });
            warnings.push({
                title: 'Refined carbohydrates',
                desc: 'May affect glucose control'
            });
        }
        
        if (currentUser.healthConditions.includes('hypertension')) {
            warnings.push({
                title: 'High sodium foods',
                desc: 'May cause blood pressure spikes'
            });
            warnings.push({
                title: 'Processed foods',
                desc: 'Often high in sodium and preservatives'
            });
        }
        
        if (currentUser.healthConditions.includes('heartDisease')) {
            warnings.push({
                title: 'Trans fats',
                desc: 'Can worsen heart health'
            });
            warnings.push({
                title: 'Excessive saturated fats',
                desc: 'May increase cholesterol levels'
            });
        }
        
        if (currentUser.healthConditions.includes('highCholesterol')) {
            warnings.push({
                title: 'Fried foods',
                desc: 'High in unhealthy fats'
            });
        }
    }
    
    // Add warnings based on allergies
    if (currentUser.allergies) {
        currentUser.allergies.forEach(allergy => {
            warnings.push({
                title: `Foods containing ${allergy}`,
                desc: 'May cause allergic reactions'
            });
        });
    }
    
    // Default warnings if no specific conditions
    if (warnings.length === 0) {
        warnings.push({
            title: 'Processed foods',
            desc: 'High in sodium and preservatives'
        });
        warnings.push({
            title: 'Excessive sugar',
            desc: 'Can lead to health complications'
        });
        warnings.push({
            title: 'Trans fats',
            desc: 'Harmful to heart health'
        });
    }
    
    warnings.forEach(warning => {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'warning-item';
        warningDiv.innerHTML = `
            <div class="warning-title">${warning.title}</div>
            <div class="warning-desc">${warning.desc}</div>
        `;
        warningsContainer.appendChild(warningDiv);
    });
}

function switchMealTab(mealType) {
    // Update active tab
    document.querySelectorAll('.meal-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const targetTab = document.querySelector(`[data-meal="${mealType}"]`);
    if (targetTab) targetTab.classList.add('active');
    
    // Update meal content
    const mealPlan = getPersonalizedMealPlan();
    updateMealContent(mealType, mealPlan);
}

// Medication Functions
function addMedication(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('medicationName');
    const dosageInput = document.getElementById('medicationDosage');
    const notesInput = document.getElementById('medicationNotes');
    const morningEnabled = document.getElementById('morningEnabled');
    const afternoonEnabled = document.getElementById('afternoonEnabled');
    const nightEnabled = document.getElementById('nightEnabled');
    const morningTime = document.getElementById('morningTime');
    const afternoonTime = document.getElementById('afternoonTime');
    const nightTime = document.getElementById('nightTime');
    
    if (!nameInput || !dosageInput) return;
    
    const medication = {
        id: Date.now(),
        name: nameInput.value,
        dosage: dosageInput.value,
        notes: notesInput ? notesInput.value : '',
        timing: {
            morning: {
                enabled: morningEnabled ? morningEnabled.checked : false,
                time: morningTime ? morningTime.value : ''
            },
            afternoon: {
                enabled: afternoonEnabled ? afternoonEnabled.checked : false,
                time: afternoonTime ? afternoonTime.value : ''
            },
            night: {
                enabled: nightEnabled ? nightEnabled.checked : false,
                time: nightTime ? nightTime.value : ''
            }
        },
        active: true,
        createdAt: new Date()
    };
    
    medications.push(medication);
    saveToLocalStorage('nutricare_medications', medications);
    
    closeMedicationModal();
    updateDashboard();
    updateMedicationsPage();
    
    // Reset form
    const form = document.getElementById('medicationForm');
    if (form) form.reset();
    
    // Reset timing toggles
    if (morningEnabled) morningEnabled.checked = false;
    if (afternoonEnabled) afternoonEnabled.checked = false;
    if (nightEnabled) nightEnabled.checked = false;
    if (morningTime) morningTime.disabled = true;
    if (afternoonTime) afternoonTime.disabled = true;
    if (nightTime) nightTime.disabled = true;
}

function removeMedication(id) {
    medications = medications.filter(med => med.id !== id);
    saveToLocalStorage('nutricare_medications', medications);
    updateDashboard();
    updateMedicationsPage();
}

function renderMedicationList() {
    const medicationList = document.getElementById('medicationList');
    if (!medicationList) return;
    
    medicationList.innerHTML = '';
    
    medications.forEach(medication => {
        const medicationDiv = document.createElement('div');
        medicationDiv.className = 'medication-item';
        
        // Build timing display
        const timingParts = [];
        if (medication.timing.morning.enabled) {
            timingParts.push(`Morning: ${medication.timing.morning.time}`);
        }
        if (medication.timing.afternoon.enabled) {
            timingParts.push(`Afternoon: ${medication.timing.afternoon.time}`);
        }
        if (medication.timing.night.enabled) {
            timingParts.push(`Night: ${medication.timing.night.time}`);
        }
        
        medicationDiv.innerHTML = `
            <div class="medication-content">
                <div class="medication-info">
                    <div class="medication-icon">
                        <i class="fas fa-pills"></i>
                    </div>
                    <div class="medication-details">
                        <h3>${medication.name}</h3>
                        <p>${medication.dosage}</p>
                        <div class="medication-meta">
                            <div>
                                <i class="fas fa-clock"></i>
                                <span>${timingParts.join(', ') || 'No timing set'}</span>
                            </div>
                        </div>
                        ${medication.notes ? `<p>${medication.notes}</p>` : ''}
                    </div>
                </div>
                <div class="medication-actions">
                    <button onclick="removeMedication(${medication.id})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        medicationList.appendChild(medicationDiv);
    });
}

function updateMedicationsPage() {
    const medicationsEmptyState = document.getElementById('medicationsEmptyState');
    const medicationsContainer = document.getElementById('medicationsContainer');
    
    if (medications.length === 0) {
        if (medicationsEmptyState) medicationsEmptyState.style.display = 'block';
        if (medicationsContainer) medicationsContainer.style.display = 'none';
    } else {
        if (medicationsEmptyState) medicationsEmptyState.style.display = 'none';
        if (medicationsContainer) medicationsContainer.style.display = 'block';
        renderMedicationsContainer();
    }
}

function renderMedicationsContainer() {
    const container = document.getElementById('medicationsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    medications.forEach(medication => {
        const medicationDiv = document.createElement('div');
        medicationDiv.className = 'medication-item';
        
        // Build timing display
        const timingParts = [];
        if (medication.timing.morning.enabled) {
            timingParts.push(`Morning: ${medication.timing.morning.time}`);
        }
        if (medication.timing.afternoon.enabled) {
            timingParts.push(`Afternoon: ${medication.timing.afternoon.time}`);
        }
        if (medication.timing.night.enabled) {
            timingParts.push(`Night: ${medication.timing.night.time}`);
        }
        
        medicationDiv.innerHTML = `
            <div class="medication-content">
                <div class="medication-info">
                    <div class="medication-icon">
                        <i class="fas fa-pills"></i>
                    </div>
                    <div class="medication-details">
                        <h3>${medication.name}</h3>
                        <p>${medication.dosage}</p>
                        <div class="medication-meta">
                            <div>
                                <i class="fas fa-clock"></i>
                                <span>${timingParts.join(', ') || 'No timing set'}</span>
                            </div>
                        </div>
                        ${medication.notes ? `<p>${medication.notes}</p>` : ''}
                    </div>
                </div>
                <div class="medication-actions">
                    <button onclick="removeMedication(${medication.id})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(medicationDiv);
    });
}

// Health Data Functions
function addHealthData(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Get values from either form
    const date = document.getElementById('healthDate')?.value || document.getElementById('modalHealthDate')?.value;
    const systolic = document.getElementById('systolic')?.value || document.getElementById('modalSystolic')?.value;
    const diastolic = document.getElementById('diastolic')?.value || document.getElementById('modalDiastolic')?.value;
    const bloodSugar = document.getElementById('bloodSugar')?.value || document.getElementById('modalBloodSugar')?.value;
    const weight = document.getElementById('weightInput')?.value || document.getElementById('modalWeight')?.value;
    const heartRate = document.getElementById('heartRate')?.value || document.getElementById('modalHeartRate')?.value;
    
    const healthReading = {
        id: Date.now(),
        date: date,
        systolic: systolic,
        diastolic: diastolic,
        bloodSugar: bloodSugar,
        weight: weight,
        heartRate: heartRate,
        createdAt: new Date()
    };
    
    healthData.push(healthReading);
    saveToLocalStorage('nutricare_health_data', healthData);
    
    updateHealthReadings();
    updateLatestHealthReadings();
    updateHealthCharts();
    
    // Reset forms
    const healthDataForm = document.getElementById('healthDataForm');
    const healthDataModalForm = document.getElementById('healthDataModalForm');
    if (healthDataForm) healthDataForm.reset();
    if (healthDataModalForm) healthDataModalForm.reset();
    
    closeHealthDataModal();
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    const healthDateInput = document.getElementById('healthDate');
    const modalHealthDateInput = document.getElementById('modalHealthDate');
    if (healthDateInput) healthDateInput.value = today;
    if (modalHealthDateInput) modalHealthDateInput.value = today;
}

function updateHealthReadings() {
    const healthReadingsCard = document.getElementById('healthReadings');
    const healthReadingsList = document.getElementById('healthReadingsList');
    
    if (healthData.length > 0 && healthReadingsCard && healthReadingsList) {
        healthReadingsCard.style.display = 'block';
        healthReadingsList.innerHTML = '';
        
        healthData.slice(-5).reverse().forEach(reading => {
            const readingDiv = document.createElement('div');
            readingDiv.className = 'health-reading-item';
            
            const readingData = [];
            if (reading.systolic && reading.diastolic) {
                readingData.push(`<div><span>BP:</span> ${reading.systolic}/${reading.diastolic}</div>`);
            }
            if (reading.bloodSugar) {
                readingData.push(`<div><span>Sugar:</span> ${reading.bloodSugar} mg/dL</div>`);
            }
            if (reading.weight) {
                readingData.push(`<div><span>Weight:</span> ${reading.weight} kg</div>`);
            }
            if (reading.heartRate) {
                readingData.push(`<div><span>HR:</span> ${reading.heartRate} bpm</div>`);
            }
            
            readingDiv.innerHTML = `
                <div class="health-reading-header">
                    <div class="health-reading-date">${reading.date}</div>
                </div>
                <div class="health-reading-data">
                    ${readingData.join('')}
                </div>
            `;
            
            healthReadingsList.appendChild(readingDiv);
        });
    }
}

function updateHealthCharts() {
    // Combined chart implementation
    updateCombinedHealthChart();
}

function updateCombinedHealthChart() {
    const chartContainer = document.getElementById('healthChartContainer');
    const emptyState = document.getElementById('healthEmptyState');
    const canvas = document.getElementById('healthChart');
    
    if (!canvas) return;
    
    const relevantData = healthData.filter(reading => 
        (reading.systolic && reading.diastolic) || reading.bloodSugar
    );
    
    if (relevantData.length === 0) {
        if (chartContainer) chartContainer.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (chartContainer) chartContainer.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    if (relevantData.length > 1) {
        const bpData = relevantData.filter(d => d.systolic && d.diastolic);
        const sugarData = relevantData.filter(d => d.bloodSugar);
        
        const stepX = width / Math.max(bpData.length - 1, sugarData.length - 1, 1);
        
        // Draw BP line (red) - using systolic values
        if (bpData.length > 1) {
            const maxBP = Math.max(...bpData.map(d => parseInt(d.systolic)));
            const minBP = Math.min(...bpData.map(d => parseInt(d.systolic)));
            const bpRange = maxBP - minBP || 1;
            
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3;
            ctx.beginPath();
            bpData.forEach((reading, index) => {
                const x = index * stepX;
                const normalizedValue = (parseInt(reading.systolic) - minBP) / bpRange;
                const y = height - (normalizedValue * height * 0.8 + height * 0.1);
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
        }
        
        // Draw Sugar line (blue)
        if (sugarData.length > 1) {
            const maxSugar = Math.max(...sugarData.map(d => parseInt(d.bloodSugar)));
            const minSugar = Math.min(...sugarData.map(d => parseInt(d.bloodSugar)));
            const sugarRange = maxSugar - minSugar || 1;
            
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 3;
            ctx.beginPath();
            sugarData.forEach((reading, index) => {
                const x = index * stepX;
                const normalizedValue = (parseInt(reading.bloodSugar) - minSugar) / sugarRange;
                const y = height - (normalizedValue * height * 0.8 + height * 0.1);
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
        }
    }
}

// Chat System Functions
function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!chatInput || !chatMessages || !chatInput.value.trim()) return;
    
    const message = chatInput.value.trim();
    
    // Add user message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'chat-message user';
    userMessageDiv.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
        </div>
        <div class="message-avatar">
            <i class="fas fa-user"></i>
        </div>
    `;
    chatMessages.appendChild(userMessageDiv);
    
    // Clear input
    chatInput.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const botResponse = generateChatResponse(message);
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'chat-message bot';
        botMessageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user-md"></i>
            </div>
            <div class="message-content">
                <p>${botResponse}</p>
            </div>
        `;
        chatMessages.appendChild(botMessageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateChatResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('medication') || lowerMessage.includes('medicine')) {
        return "I can help you review your medications. Please use the 'Upload Medications' button to share your current medication list, and I'll check for any potential interactions or concerns.";
    } else if (lowerMessage.includes('blood pressure') || lowerMessage.includes('bp')) {
        return "Based on your recent blood pressure readings, I recommend monitoring your sodium intake and maintaining regular exercise. If readings consistently exceed 140/90, please consult your doctor.";
    } else if (lowerMessage.includes('blood sugar') || lowerMessage.includes('diabetes')) {
        return "For blood sugar management, focus on complex carbohydrates, regular meal timing, and monitor your levels as prescribed. Upload your health log for personalized advice.";
    } else if (lowerMessage.includes('diet') || lowerMessage.includes('food')) {
        return "I can review your diet plan for compatibility with your health conditions. Use the 'Upload Diet Plan' button to share your meal plan for analysis.";
    } else if (lowerMessage.includes('postoperative') || lowerMessage.includes('surgery')) {
        return "For post-operative care, ensure proper wound care, take medications as prescribed, watch for signs of infection (fever, increased pain, redness), and follow your surgeon's activity restrictions.";
    } else if (lowerMessage.includes('fever') || lowerMessage.includes('headache')) {
        return "It might be a viral infection, but I recommend seeing a doctor if symptoms persist for more than 2 days.";
    } else if (lowerMessage.includes('covid') || lowerMessage.includes('coronavirus')) {
        return "Common symptoms include fever, cough, loss of smell, and fatigue. Please consider testing if you're unsure.";
    } else if (lowerMessage.includes('tired') || lowerMessage.includes('fatigue')) {
        return "Fatigue can be due to anemia, thyroid issues, poor sleep, or stress. A blood test may help find the cause.";
    } else if (lowerMessage.includes('cholesterol')) {
        return "Eat more fiber-rich foods like oats, fruits, and vegetables. Avoid fried and processed foods for better cholesterol control.";
    } else if (lowerMessage.includes('ibuprofen') || lowerMessage.includes('paracetamol')) {
        return "Yes, they can be taken together safely, but it's best to space them out and follow dosage guidelines.";
    } else if (lowerMessage.includes('melatonin')) {
        return "Short-term use is generally safe, but long-term effects are still being studied. Use the lowest effective dose.";
    } else if (lowerMessage.includes('dementia') || lowerMessage.includes('memory')) {
        return "Short-term memory loss, confusion with time, and difficulty completing familiar tasks are common early signs of dementia.";
    } else if (lowerMessage.includes('rash') || (lowerMessage.includes('child') && lowerMessage.includes('rash'))) {
        return "Try using a gentle moisturizer and keep the area clean. If it spreads or worsens, consult a pediatrician.";
    } else if (lowerMessage.includes('burn') || lowerMessage.includes('burns')) {
        return "Cool the area under running water, avoid ice, and apply a sterile bandage. Seek help if blistering is severe.";
    } 
    // 🍽️ Diet-related questions
    else if (lowerMessage.includes('balanced diet')) {
        return "A balanced diet includes fruits, vegetables, whole grains, lean proteins, and healthy fats in proper proportions.";
    } else if (lowerMessage.includes('lose weight') || lowerMessage.includes('weight loss')) {
        return "For weight loss, reduce added sugars and processed foods. Focus on lean proteins, vegetables, and regular activity.";
    } else if (lowerMessage.includes('high blood pressure') || lowerMessage.includes('bp')) {
        return "Limit salt, processed foods, and caffeine. Include potassium-rich foods like bananas and spinach.";
    } else if (lowerMessage.includes('fruits') && lowerMessage.includes('diabetes')) {
        return "Yes, diabetics can eat fruits like berries, apples, and citrus in moderation. Avoid high-sugar fruits like mangoes.";
    } else if (lowerMessage.includes('snacks') && lowerMessage.includes('kids')) {
        return "Healthy snacks for kids include yogurt, fruits, nuts (if not allergic), boiled eggs, and whole-grain crackers.";
    } else if (lowerMessage.includes('calories') && lowerMessage.includes('day')) {
        return "Daily calorie needs depend on age, gender, and activity, but average adult needs range from 1,800 to 2,500 kcal.";
    } else if (lowerMessage.includes('is breakfast important') || lowerMessage.includes('skip breakfast')) {
        return "Yes, breakfast helps kickstart your metabolism and improves energy and focus throughout the day.";
    } else if (lowerMessage.includes('low-carb')) {
        return "A low-carb diet limits foods high in sugar and starch. Focus on protein, non-starchy vegetables, and healthy fats.";
    } else if (lowerMessage.includes('are eggs healthy') || lowerMessage.includes('egg')) {
        return "Eggs are a great source of protein and nutrients. They are healthy in moderation unless advised otherwise by a doctor.";

    // 🌿 Home remedy questions
    } else if (lowerMessage.includes('home remedy') && lowerMessage.includes('cough')) {
        return "A simple remedy for cough includes warm honey-lemon tea or turmeric milk. Stay hydrated and avoid cold drinks.";
    } else if (lowerMessage.includes('sore throat') && lowerMessage.includes('natural')) {
        return "Gargling with warm salt water, sipping ginger tea, or honey can help relieve a sore throat naturally.";
    } else if (lowerMessage.includes('indigestion') || lowerMessage.includes('bloating')) {
        return "Try drinking warm water, chewing fennel seeds, or taking a short walk after meals to relieve indigestion.";
    } else if (lowerMessage.includes('cold') || lowerMessage.includes('flu')) {
        return "Rest, drink warm fluids, use steam inhalation, and try ginger or tulsi tea for relief from cold and flu.";
    } else if (lowerMessage.includes('headache') && lowerMessage.includes('home')) {
        return "Apply a cold or warm compress, rest in a dark room, or try peppermint oil on the temples for mild headaches.";
    } else if (lowerMessage.includes('ginger') && lowerMessage.includes('nausea')) {
        return "Yes, ginger is a natural anti-nausea remedy. Ginger tea or ginger candies often help relieve nausea.";
    } else if (lowerMessage.includes('boost immunity')) {
        return "To boost immunity, eat fruits and vegetables rich in vitamins A, C, and E, get enough sleep, and reduce stress.";
    } else if (lowerMessage.includes('acne') && lowerMessage.includes('remedy')) {
        return "Try applying diluted tea tree oil or aloe vera gel. Always keep the skin clean and avoid touching your face.";
    } else if (lowerMessage.includes('reduce stress') && lowerMessage.includes('natural')) {
        return "Practice deep breathing, meditation, regular exercise, or herbal teas like chamomile to manage stress naturally.";

    // 🏥 Post-surgery precaution questions
    } else if (lowerMessage.includes('what should i eat after surgery') || (lowerMessage.includes('surgery') && lowerMessage.includes('diet'))) {
        return "After surgery, focus on protein-rich, easy-to-digest foods like soup, eggs, fruits, and plenty of water.";
    } else if (lowerMessage.includes('how long') && lowerMessage.includes('rest after surgery')) {
        return "It depends on the surgery, but rest for at least a few days and gradually increase activity as advised by your doctor.";
    } else if (lowerMessage.includes('can i walk') && lowerMessage.includes('surgery')) {
        return "Light walking is often encouraged after surgery unless otherwise restricted by your doctor.";
    } else if (lowerMessage.includes('take care of stitches') || lowerMessage.includes('wound care')) {
        return "Keep the area dry and clean. Don't scratch or remove stitches yourself. Follow your doctor's cleaning instructions.";
    } else if (lowerMessage.includes('infection') && lowerMessage.includes('signs')) {
        return "Redness, swelling, fever, pus, or increased pain at the surgical site could indicate infection. Contact your doctor immediately.";
    } else if (lowerMessage.includes('remove bandage')) {
        return "Remove the bandage only if your doctor advises it or after the wound has dried. Keep it clean and covered until then.";
    } else if (lowerMessage.includes('pain after surgery')) {
        return "Some pain is normal. If it becomes severe or doesn't improve over time, contact your healthcare provider.";
    } else if (lowerMessage.includes('can i take a bath') && lowerMessage.includes('surgery')) {
        return "Avoid soaking the surgical area. Sponge baths may be safer. Follow your doctor's instructions on bathing.";
    } else if (lowerMessage.includes('return to work') && lowerMessage.includes('surgery')) {
        return "Return to work only after your doctor clears you—this varies based on the type and complexity of the surgery.";

    // Default fallback
    } else {
        return "I'm here to help with your health concerns. You can ask about medications, diet plans, blood pressure, blood sugar management, or post-operative care. Feel free to upload your health data for personalized advice.";
    }
}

function uploadMedicationList() {
    const chatMessages = document.getElementById('chatMessages');
    
    if (medications.length === 0) {
        addChatMessage('bot', "You haven't added any medications yet. Please add your medications in the Medications section first, then I can review them for you.");
        return;
    }
    
    // Analyze medications
    const medicationList = medications.map(med => `${med.name} (${med.dosage})`).join(', ');
    const analysis = analyzeMedications();
    
    addChatMessage('bot', `I've reviewed your medications: ${medicationList}. ${analysis}`);
}

function uploadHealthLog() {
    const chatMessages = document.getElementById('chatMessages');
    
    if (healthData.length === 0) {
        addChatMessage('bot', "You haven't logged any health data yet. Please add your health readings in the Health Tracking section first.");
        return;
    }
    
    const analysis = analyzeHealthLog();
    addChatMessage('bot', analysis);
}

function uploadDietPlan() {
    const chatMessages = document.getElementById('chatMessages');
    const analysis = analyzeDietPlan();
    addChatMessage('bot', analysis);
}

function addChatMessage(sender, message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    if (sender === 'bot') {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user-md"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
            </div>
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function analyzeMedications() {
    // Enhanced medication analysis based on user's health conditions
    if (!currentUser || !currentUser.healthConditions) {
        return chatResponses.medication_analysis.safe;
    }
    
    // Check for potential concerns
    const hasHeartCondition = currentUser.healthConditions.includes('heartDisease') || 
                             currentUser.healthConditions.includes('hypertension');
    const hasDiabetes = currentUser.healthConditions.includes('diabetes');
    
    if (hasHeartCondition && hasDiabetes) {
        return chatResponses.medication_analysis.concern;
    }
    
    return chatResponses.medication_analysis.safe;
}

function analyzeHealthLog() {
    if (healthData.length === 0) return "No health data available for analysis.";
    
    const latestReading = healthData[healthData.length - 1];
    let analysis = [];
    
    // Analyze blood pressure
    if (latestReading.systolic && latestReading.diastolic) {
        const systolic = parseInt(latestReading.systolic);
        const diastolic = parseInt(latestReading.diastolic);
        
        if (systolic > 140 || diastolic > 90) {
            analysis.push(chatResponses.health_log_analysis.bp_high);
        }
    }
    
    // Analyze blood sugar
    if (latestReading.bloodSugar) {
        const sugar = parseInt(latestReading.bloodSugar);
        if (sugar > 140) {
            analysis.push(chatResponses.health_log_analysis.sugar_high);
        }
    }
    
    return analysis.length > 0 ? analysis.join(' ') : chatResponses.health_log_analysis.good;
}

function analyzeDietPlan() {
    const mealPlan = getPersonalizedMealPlan();
    
    // Check if any meals conflict with user allergies
    let hasConflicts = false;
    
    if (currentUser && currentUser.allergies) {
        for (const mealType in mealPlan) {
            if (mealPlan[mealType]) {
                for (const meal of mealPlan[mealType]) {
                    if (!checkFoodSafety(meal)) {
                        hasConflicts = true;
                        break;
                    }
                }
                if (hasConflicts) break;
            }
        }
    }
    
    return hasConflicts ? chatResponses.diet_plan_analysis.needs_review : chatResponses.diet_plan_analysis.approved;
}

// Home Remedies Functions
function updateHomeRemedies() {
    const activeAilment = document.querySelector('.ailment-btn.active')?.getAttribute('data-ailment') || 'fever';
    showRemedies(activeAilment);
}

function showRemedies(ailment) {
    // Update active ailment button
    document.querySelectorAll('.ailment-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const targetBtn = document.querySelector(`[data-ailment="${ailment}"]`);
    if (targetBtn) targetBtn.classList.add('active');
    
    const remedies = countryRemedies[currentCountry]?.[ailment] || countryRemedies.US[ailment] || [];
    const container = document.getElementById('remediesContainer');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (remedies.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-leaf"></i>
                </div>
                <p>No remedies available for this ailment.</p>
            </div>
        `;
        return;
    }
    
    remedies.forEach(remedy => {
        const personalizedPrecautions = getPersonalizedPrecautions(remedy);
        
        const remedyDiv = document.createElement('div');
        remedyDiv.className = 'remedy-card';
        remedyDiv.innerHTML = `
            <div class="remedy-header">
                <div class="remedy-icon">
                    <i class="fas fa-leaf"></i>
                </div>
                <div class="remedy-content">
                    <h3 class="remedy-title">${remedy.name}</h3>
                    
                    <div class="remedy-details">
                        <div class="remedy-section">
                            <h4>Ingredients:</h4>
                            <ul>
                                ${remedy.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="remedy-section">
                            <h4>Preparation:</h4>
                            <p>${remedy.preparation}</p>
                        </div>
                    </div>
                    
                    <div class="remedy-benefits">
                        <h4>Benefits:</h4>
                        <p>${remedy.benefits}</p>
                    </div>
                    
                    <div class="remedy-precautions">
                        <h4>⚠️ Precautions:</h4>
                        <p>${personalizedPrecautions}</p>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(remedyDiv);
    });
}

function getPersonalizedPrecautions(remedy) {
    let precautions = [remedy.precautions];
    
    if (!currentUser) return precautions.join(' ');
    
    // Add personalized precautions based on user profile
    if (currentUser.healthConditions) {
        if (currentUser.healthConditions.includes('diabetes') && remedy.ingredients.some(ing => ing.toLowerCase().includes('honey'))) {
            precautions.push('⚠️ Contains honey - monitor blood sugar levels if diabetic.');
        }
        
        if (currentUser.healthConditions.includes('hypertension') && remedy.ingredients.some(ing => ing.toLowerCase().includes('salt'))) {
            precautions.push('⚠️ Contains salt - monitor sodium intake if you have high blood pressure.');
        }
        
        if (currentUser.healthConditions.includes('asthma') && remedy.preparation.toLowerCase().includes('steam')) {
            precautions.push('⚠️ Steam inhalation may trigger asthma - use with caution.');
        }
    }
    
    if (currentUser.allergies) {
        for (const allergy of currentUser.allergies) {
            if (remedy.ingredients.some(ing => ing.toLowerCase().includes(allergy.toLowerCase()))) {
                precautions.push(`⚠️ Contains ${allergy} - avoid if allergic.`);
            }
        }
    }
    
    if (currentUser.otherAllergies) {
        const otherAllergies = currentUser.otherAllergies.toLowerCase().split(',');
        for (const allergy of otherAllergies) {
            if (remedy.ingredients.some(ing => ing.toLowerCase().includes(allergy.trim()))) {
                precautions.push(`⚠️ Contains ${allergy.trim()} - avoid if allergic.`);
            }
        }
    }
    
    return precautions.join(' ');
}

function searchRemedies() {
    const searchInput = document.getElementById('remedySearch');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const activeAilment = document.querySelector('.ailment-btn.active')?.getAttribute('data-ailment') || 'fever';
    const remedies = countryRemedies[currentCountry]?.[activeAilment] || countryRemedies.US[activeAilment] || [];
    
    const filteredRemedies = searchTerm 
        ? remedies.filter(remedy => 
            remedy.name.toLowerCase().includes(searchTerm) ||
            remedy.ingredients.some(ingredient => 
                ingredient.toLowerCase().includes(searchTerm)
            )
        )
        : remedies;
    
    const container = document.getElementById('remediesContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (filteredRemedies.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-leaf"></i>
                </div>
                <p>${searchTerm ? 'No remedies found matching your search.' : 'No remedies available for this ailment.'}</p>
            </div>
        `;
        return;
    }
    
    filteredRemedies.forEach(remedy => {
        const personalizedPrecautions = getPersonalizedPrecautions(remedy);
        
        const remedyDiv = document.createElement('div');
        remedyDiv.className = 'remedy-card';
        remedyDiv.innerHTML = `
            <div class="remedy-header">
                <div class="remedy-icon">
                    <i class="fas fa-leaf"></i>
                </div>
                <div class="remedy-content">
                    <h3 class="remedy-title">${remedy.name}</h3>
                    
                    <div class="remedy-details">
                        <div class="remedy-section">
                            <h4>Ingredients:</h4>
                            <ul>
                                ${remedy.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="remedy-section">
                            <h4>Preparation:</h4>
                            <p>${remedy.preparation}</p>
                        </div>
                    </div>
                    
                    <div class="remedy-benefits">
                        <h4>Benefits:</h4>
                        <p>${remedy.benefits}</p>
                    </div>
                    
                    <div class="remedy-precautions">
                        <h4>⚠️ Precautions:</h4>
                        <p>${personalizedPrecautions}</p>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(remedyDiv);
    });
}

// Emergency Contact Functions
function addEmergencyContact(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('contactName');
    const phoneInput = document.getElementById('contactPhone');
    const relationshipSelect = document.getElementById('contactRelationship');
    
    if (!nameInput || !phoneInput || !relationshipSelect) return;
    
    const contact = {
        id: Date.now(),
        name: nameInput.value,
        phone: phoneInput.value,
        relationship: relationshipSelect.value,
        createdAt: new Date()
    };
    
    emergencyContacts.push(contact);
    saveToLocalStorage('nutricare_emergency_contacts', emergencyContacts);
    
    closeEmergencyContactModal();
    
    // Reset form
    const form = document.getElementById('emergencyContactForm');
    if (form) form.reset();
    
    // Show contacts list
    showEmergencyContactsListModal();
}

function removeEmergencyContact(id) {
    emergencyContacts = emergencyContacts.filter(contact => contact.id !== id);
    saveToLocalStorage('nutricare_emergency_contacts', emergencyContacts);
    updateEmergencyContactsList();
}

function updateEmergencyContactsList() {
    const container = document.getElementById('emergencyContactsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (emergencyContacts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-phone"></i>
                </div>
                <p>No emergency contacts added yet</p>
                <p class="empty-subtitle">Add your first emergency contact to get started</p>
            </div>
        `;
        return;
    }
    
    emergencyContacts.forEach(contact => {
        const contactDiv = document.createElement('div');
        contactDiv.className = 'emergency-contact-item';
        contactDiv.innerHTML = `
            <div class="contact-info">
                <div class="contact-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="contact-details">
                    <h4>${contact.name}</h4>
                    <p>${contact.phone}</p>
                    <span class="contact-relationship">${contact.relationship}</span>
                </div>
            </div>
            <div class="contact-actions">
                <button class="btn primary small" onclick="callContact('${contact.phone}')">
                    <i class="fas fa-phone"></i>
                    <span data-translate="call">Call</span>
                </button>
                <button class="btn secondary small" onclick="removeEmergencyContact(${contact.id})">
                    <i class="fas fa-trash"></i>
                    <span data-translate="remove">Remove</span>
                </button>
            </div>
        `;
        container.appendChild(contactDiv);
    });
}

function callContact(phone) {
    window.open(`tel:${phone}`, '_self');
}

// Language and Country Functions
function setLanguage(lang) {
    currentLanguage = lang;
    saveToLocalStorage('nutricare_language', lang);
    updateTranslations();
    
    // Update flag display
    const flags = {
        en: '🇺🇸', hi: '🇮🇳', te: '🇮🇳'
    };
    const currentFlagElement = document.getElementById('currentFlag');
    if (currentFlagElement) {
        currentFlagElement.textContent = flags[lang];
    }
    
    // Update active language button
    document.querySelectorAll('.language-options button').forEach(btn => {
        btn.classList.remove('active');
    });
    const targetBtn = document.querySelector(`[data-lang="${lang}"]`);
    if (targetBtn) targetBtn.classList.add('active');
    
    hideLanguageDropdown();
}

function setCountry(country) {
    currentCountry = country;
    saveToLocalStorage('nutricare_country', country);
    
    // Update flag display
    const flags = {
        US: '🇺🇸', IN: '🇮🇳'
    };
    const currentCountryFlagElement = document.getElementById('currentCountryFlag');
    if (currentCountryFlagElement) {
        currentCountryFlagElement.textContent = flags[country];
    }
    
    // Update active country button
    document.querySelectorAll('.country-options button').forEach(btn => {
        btn.classList.remove('active');
    });
    const targetBtn = document.querySelector(`[data-country="${country}"]`);
    if (targetBtn) targetBtn.classList.add('active');
    
    // Update meal plans and remedies based on new country
    updateMealPlan();
    updateHomeRemedies();
    
    hideLanguageDropdown();
}

function toggleLanguageDropdown() {
    const dropdown = document.querySelector('.language-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function hideLanguageDropdown() {
    const dropdown = document.querySelector('.language-dropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}

function toggleUserDropdown() {
    const dropdown = document.querySelector('.user-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function hideUserDropdown() {
    const dropdown = document.querySelector('.user-dropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}

// Modal Functions
function showMedicationModal() {
    const modal = document.getElementById('medicationModal');
    if (modal) modal.classList.add('show');
}

function closeMedicationModal() {
    const modal = document.getElementById('medicationModal');
    if (modal) modal.classList.remove('show');
}

function showHealthDataModal() {
    const today = new Date().toISOString().split('T')[0];
    const modalHealthDate = document.getElementById('modalHealthDate');
    if (modalHealthDate) modalHealthDate.value = today;
    
    const modal = document.getElementById('healthDataModal');
    if (modal) modal.classList.add('show');
}

function closeHealthDataModal() {
    const modal = document.getElementById('healthDataModal');
    if (modal) modal.classList.remove('show');
}

function showEmergencyContactModal() {
    const modal = document.getElementById('emergencyContactModal');
    if (modal) modal.classList.add('show');
}

function closeEmergencyContactModal() {
    const modal = document.getElementById('emergencyContactModal');
    if (modal) modal.classList.remove('show');
}

function showEmergencyContactsListModal() {
    updateEmergencyContactsList();
    const modal = document.getElementById('emergencyContactsListModal');
    if (modal) modal.classList.add('show');
}

function closeEmergencyContactsListModal() {
    const modal = document.getElementById('emergencyContactsListModal');
    if (modal) modal.classList.remove('show');
}

// Initialize Application
function init() {
    // Load saved data
    const savedLanguage = loadFromLocalStorage('nutricare_language');
    const savedCountry = loadFromLocalStorage('nutricare_country');
    const savedMedications = loadFromLocalStorage('nutricare_medications');
    const savedHealthData = loadFromLocalStorage('nutricare_health_data');
    const savedEmergencyContacts = loadFromLocalStorage('nutricare_emergency_contacts');
    
    if (savedLanguage) currentLanguage = savedLanguage;
    if (savedCountry) currentCountry = savedCountry;
    if (savedMedications) medications = savedMedications;
    if (savedHealthData) healthData = savedHealthData;
    if (savedEmergencyContacts) emergencyContacts = savedEmergencyContacts;
    
    // Set default date for health forms
    const today = new Date().toISOString().split('T')[0];
    const healthDateInput = document.getElementById('healthDate');
    const modalHealthDateInput = document.getElementById('modalHealthDate');
    if (healthDateInput) healthDateInput.value = today;
    if (modalHealthDateInput) modalHealthDateInput.value = today;
    
    // Initialize auth
    initAuth();
    
    // Set up event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Auth form
    const authForm = document.getElementById('authFormElement');
    if (authForm) authForm.addEventListener('submit', handleAuth);
    
    const authSwitchBtn = document.getElementById('authSwitchBtn');
    if (authSwitchBtn) authSwitchBtn.addEventListener('click', () => toggleAuthMode());
    
    // Password validation
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            updatePasswordStrength(e.target.value);
        });
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', checkPasswordMatch);
    }
    
    // Password toggle
    const togglePassword = document.querySelector('.toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (passwordInput && icon) {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            }
        });
    }
    
    // Profile setup
    const nextBtn = document.getElementById('nextBtn');
    const backBtn = document.getElementById('backBtn');
    if (nextBtn) nextBtn.addEventListener('click', nextStep);
    if (backBtn) backBtn.addEventListener('click', prevStep);
    
    // Option buttons
    document.querySelectorAll('.option-btn').forEach(button => {
        button.addEventListener('click', () => toggleOption(button));
    });
    
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            if (page) showPage(page);
        });
    });
    
    // Language and country selection
    const languageBtn = document.querySelector('.language-btn');
    const userBtn = document.querySelector('.user-btn');
    if (languageBtn) languageBtn.addEventListener('click', toggleLanguageDropdown);
    if (userBtn) userBtn.addEventListener('click', toggleUserDropdown);
    
    document.querySelectorAll('[data-lang]').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            if (lang) setLanguage(lang);
        });
    });
    
    document.querySelectorAll('[data-country]').forEach(btn => {
        btn.addEventListener('click', () => {
            const country = btn.getAttribute('data-country');
            if (country) setCountry(country);
        });
    });
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    
    // Medication modal
    const addMedicationBtn = document.getElementById('addMedicationBtn');
    const addFirstMedicationBtn = document.getElementById('addFirstMedicationBtn');
    const medicationForm = document.getElementById('medicationForm');
    
    if (addMedicationBtn) addMedicationBtn.addEventListener('click', showMedicationModal);
    if (addFirstMedicationBtn) addFirstMedicationBtn.addEventListener('click', showMedicationModal);
    if (medicationForm) medicationForm.addEventListener('submit', addMedication);
    
    // Medication timing toggles
    const morningEnabled = document.getElementById('morningEnabled');
    const afternoonEnabled = document.getElementById('afternoonEnabled');
    const nightEnabled = document.getElementById('nightEnabled');
    const morningTime = document.getElementById('morningTime');
    const afternoonTime = document.getElementById('afternoonTime');
    const nightTime = document.getElementById('nightTime');
    
    if (morningEnabled && morningTime) {
        morningEnabled.addEventListener('change', () => {
            morningTime.disabled = !morningEnabled.checked;
            if (!morningEnabled.checked) morningTime.value = '';
        });
    }
    
    if (afternoonEnabled && afternoonTime) {
        afternoonEnabled.addEventListener('change', () => {
            afternoonTime.disabled = !afternoonEnabled.checked;
            if (!afternoonEnabled.checked) afternoonTime.value = '';
        });
    }
    
    if (nightEnabled && nightTime) {
        nightEnabled.addEventListener('change', () => {
            nightTime.disabled = !nightEnabled.checked;
            if (!nightEnabled.checked) nightTime.value = '';
        });
    }
    
    // Health data modal
    const logHealthDataBtn = document.getElementById('logHealthDataBtn');
    const healthDataForm = document.getElementById('healthDataForm');
    const healthDataModalForm = document.getElementById('healthDataModalForm');
    
    if (logHealthDataBtn) logHealthDataBtn.addEventListener('click', showHealthDataModal);
    if (healthDataForm) healthDataForm.addEventListener('submit', addHealthData);
    if (healthDataModalForm) healthDataModalForm.addEventListener('submit', addHealthData);
    
    // Chat system
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
    
    // Emergency contact
    const emergencyContactBtn = document.getElementById('emergencyContactBtn');
    const emergencyContactForm = document.getElementById('emergencyContactForm');
    
    if (emergencyContactBtn) {
        emergencyContactBtn.addEventListener('click', () => {
            if (emergencyContacts.length === 0) {
                showEmergencyContactModal();
            } else {
                showEmergencyContactsListModal();
            }
        });
    }
    
    if (emergencyContactForm) {
        emergencyContactForm.addEventListener('submit', addEmergencyContact);
    }
    
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) modal.classList.remove('show');
        });
    });
    
    // Meal tabs
    document.querySelectorAll('.meal-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const mealType = tab.getAttribute('data-meal');
            if (mealType) switchMealTab(mealType);
        });
    });
    
    // Ailment buttons
    document.querySelectorAll('.ailment-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const ailment = btn.getAttribute('data-ailment');
            if (ailment) showRemedies(ailment);
        });
    });
    
    // Search remedies
    const remedySearch = document.getElementById('remedySearch');
    if (remedySearch) remedySearch.addEventListener('input', searchRemedies);
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.language-selector')) {
            hideLanguageDropdown();
        }
        if (!e.target.closest('.user-menu')) {
            hideUserDropdown();
        }
    });
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
}

// Start the application
document.addEventListener('DOMContentLoaded', init);