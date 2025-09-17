// FitLife Application JavaScript
class FitLifeApp {
    constructor() {
        this.data = {
            workouts: JSON.parse(localStorage.getItem('fitlife_workouts')) || [
                { id: 1, name: 'Squats', sets: 3, reps: 12, category: 'legs', completed: false, icon: 'fitness_center' },
                { id: 2, name: 'Push-ups', sets: 3, reps: 15, category: 'arms', completed: false, icon: 'exercise' },
                { id: 3, name: 'Crunches', sets: 3, reps: 20, category: 'core', completed: false, icon: 'self_improvement' },
                { id: 4, name: 'Pull-ups', sets: 3, reps: 10, category: 'arms', completed: false, icon: 'sports_gymnastics' },
                { id: 5, name: 'Lunges', sets: 3, reps: 15, category: 'legs', completed: false, icon: 'accessibility_new' }
            ],
            meals: JSON.parse(localStorage.getItem('fitlife_meals')) || [
                { id: 1, food: 'Grilled Chicken Salad', portion: '1 bowl', calories: 350, timestamp: new Date().toISOString() },
                { id: 2, food: 'Greek Yogurt', portion: '1 cup', calories: 150, timestamp: new Date().toISOString() },
                { id: 3, food: 'Banana', portion: '1 medium', calories: 105, timestamp: new Date().toISOString() }
            ],
            notes: JSON.parse(localStorage.getItem('fitlife_notes')) || [
                { id: 1, title: 'Morning Run', content: 'A quick run to start the day', category: 'workout', timestamp: new Date().toISOString() },
                { id: 2, title: 'Evening Yoga', content: 'Relaxing yoga session', category: 'workout', timestamp: new Date().toISOString() },
                { id: 3, title: 'Healthy Recipes', content: 'Collection of healthy recipes', category: 'nutrition', timestamp: new Date().toISOString() }
            ],
            settings: JSON.parse(localStorage.getItem('fitlife_settings')) || {
                calorieGoal: 2500,
                units: 'metric',
                motivationalQuotes: true,
                theme: 'dark',
                fontSize: 100,
                accentColor: '#13ecc8',
                workoutReminders: true,
                nutritionReminders: true,
                progressUpdates: false,
                profile: { name: 'Alex Johnson', email: 'alex.j@example.com', age: 28, weight: 70, height: 175 }
            }
        };
        
        this.currentFilter = 'all';
        this.motivationalQuotes = [
            "Consistency is key. Small, daily efforts lead to significant results over time. Keep pushing!",
            "Your body can do it. It's your mind you need to convince.",
            "The groundwork for all happiness is good health.",
            "Success is the sum of small efforts repeated day in and day out.",
            "Take care of your body. It's the only place you have to live."
        ];
        
        this.init();
    }

    init() {
        this.updateActiveNavigation();
        this.initializePage();
        this.setupEventListeners();
        this.applySettings();
    }

    updateActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if ((currentPage === 'index.html' && href === 'index.html') ||
                (currentPage.includes('workout') && href.includes('workout')) ||
                (currentPage.includes('nutrition') && href.includes('nutrition')) ||
                (currentPage.includes('note') && href.includes('note')) ||
                (currentPage.includes('settings') && href.includes('settings'))) {
                link.classList.add('active');
            }
        });
    }

    initializePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        switch (currentPage) {
            case 'index.html':
                this.initDashboard();
                break;
            case 'workout.html':
                this.initWorkout();
                break;
            case 'nutrition.html':
                this.initNutrition();
                break;
            case 'note.html':
                this.initNotes();
                break;
            case 'settings.html':
                this.initSettings();
                break;
        }
    }

    // Dashboard Functions
    initDashboard() {
        this.updateDashboardStats();
        this.updateMotivationalTip();
    }

    updateDashboardStats() {
        const completedWorkouts = this.data.workouts.filter(w => w.completed).length;
        const totalCalories = this.data.meals.reduce((sum, meal) => sum + meal.calories, 0);

        const workoutCountEl = document.getElementById('workoutCount');
        const totalCaloriesEl = document.getElementById('totalCalories');

        if (workoutCountEl) workoutCountEl.textContent = completedWorkouts;
        if (totalCaloriesEl) totalCaloriesEl.textContent = totalCalories;
    }

    updateMotivationalTip() {
        if (!this.data.settings.motivationalQuotes) return;
        
        const motivationTextEl = document.getElementById('motivationText');
        if (motivationTextEl) {
            const randomQuote = this.motivationalQuotes[Math.floor(Math.random() * this.motivationalQuotes.length)];
            motivationTextEl.textContent = randomQuote;
        }
    }

    // Workout Functions
    initWorkout() {
        this.renderWorkouts();
        this.setupWorkoutFilters();
    }

    renderWorkouts(filter = 'all') {
        const workoutList = document.getElementById('workoutList');
        if (!workoutList) return;

        const filteredWorkouts = filter === 'all' 
            ? this.data.workouts 
            : this.data.workouts.filter(w => w.category === filter);

        workoutList.innerHTML = filteredWorkouts.map(workout => `
            <div class="workout-item ${workout.completed ? 'completed' : ''}" data-id="${workout.id}">
                <div class="workout-icon">
                    <span class="material-symbols-outlined">${workout.icon}</span>
                </div>
                <div class="workout-content">
                    <p class="workout-name">${workout.name}</p>
                    <p class="workout-details">${workout.sets} sets of ${workout.reps} reps</p>
                </div>
                <div class="workout-actions">
                    <input type="checkbox" class="workout-checkbox" ${workout.completed ? 'checked' : ''} 
                           onchange="app.toggleWorkoutComplete(${workout.id})">
                    <button class="workout-menu" onclick="app.deleteWorkout(${workout.id})">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
        `).join('');
    }

    setupWorkoutFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const filter = e.target.dataset.filter;
                this.currentFilter = filter;
                this.renderWorkouts(filter);
            });
        });
    }

    toggleWorkoutComplete(id) {
        const workout = this.data.workouts.find(w => w.id === id);
        if (workout) {
            workout.completed = !workout.completed;
            this.saveData('workouts');
            this.renderWorkouts(this.currentFilter);
        }
    }

    addWorkout(workoutData) {
        const newWorkout = {
            id: Date.now(),
            ...workoutData,
            completed: false,
            icon: this.getWorkoutIcon(workoutData.category)
        };
        this.data.workouts.push(newWorkout);
        this.saveData('workouts');
        this.renderWorkouts(this.currentFilter);
    }

    deleteWorkout(id) {
        this.data.workouts = this.data.workouts.filter(w => w.id !== id);
        this.saveData('workouts');
        this.renderWorkouts(this.currentFilter);
    }

    getWorkoutIcon(category) {
        const icons = { legs: 'directions_run', arms: 'fitness_center', core: 'self_improvement' };
        return icons[category] || 'exercise';
    }

    // Nutrition Functions
    initNutrition() {
        this.renderMeals();
        this.updateCalorieSummary();
    }

    renderMeals() {
        const mealsList = document.getElementById('mealsList');
        if (!mealsList) return;

        mealsList.innerHTML = this.data.meals.map(meal => `
            <div class="meal-item" data-id="${meal.id}">
                <div class="meal-info">
                    <p class="meal-name">${meal.food}</p>
                    <p class="meal-portion">${meal.portion}</p>
                </div>
                <div class="meal-calories">${meal.calories} kcal</div>
                <div class="meal-actions">
                    <button class="meal-action-btn" onclick="app.editMeal(${meal.id})">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="meal-action-btn danger" onclick="app.deleteMeal(${meal.id})">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateCalorieSummary() {
        const currentCalories = this.data.meals.reduce((sum, meal) => sum + meal.calories, 0);
        const goalCalories = this.data.settings.calorieGoal;
        const percentage = Math.min((currentCalories / goalCalories) * 100, 100);

        const currentCaloriesEl = document.getElementById('currentCalories');
        const goalCaloriesEl = document.getElementById('goalCalories');
        const progressFillEl = document.getElementById('progressFill');
        const progressPercentageEl = document.getElementById('progressPercentage');
        const summaryDescriptionEl = document.getElementById('summaryDescription');

        if (currentCaloriesEl) currentCaloriesEl.textContent = currentCalories;
        if (goalCaloriesEl) goalCaloriesEl.textContent = goalCalories;
        if (progressFillEl) progressFillEl.style.width = `${percentage}%`;
        if (progressPercentageEl) progressPercentageEl.textContent = `${Math.round(percentage)}%`;
        if (summaryDescriptionEl) {
            summaryDescriptionEl.textContent = `You've consumed ${Math.round(percentage)}% of your daily calorie goal.`;
        }
    }

    addMeal(mealData) {
        const newMeal = { id: Date.now(), ...mealData, timestamp: new Date().toISOString() };
        this.data.meals.push(newMeal);
        this.saveData('meals');
        this.renderMeals();
        this.updateCalorieSummary();
    }

    editMeal(id) {
        const meal = this.data.meals.find(m => m.id === id);
        if (meal) {
            document.getElementById('foodInput').value = meal.food;
            document.getElementById('portionInput').value = meal.portion;
            document.getElementById('caloriesInput').value = meal.calories;
            this.deleteMeal(id);
        }
    }

    deleteMeal(id) {
        this.data.meals = this.data.meals.filter(m => m.id !== id);
        this.saveData('meals');
        this.renderMeals();
        this.updateCalorieSummary();
    }

    // Notes Functions
    initNotes() {
        this.renderNotes();
    }

    renderNotes() {
        const notesGrid = document.getElementById('notesGrid');
        if (!notesGrid) return;

        notesGrid.innerHTML = this.data.notes.map(note => `
            <div class="note-card" data-id="${note.id}">
                <div class="note-content">
                    <h3 class="note-title">${note.title}</h3>
                    <p class="note-description">${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}</p>
                    <p class="note-category">${note.category}</p>
                </div>
                <div class="note-actions">
                    <button class="note-action-btn" onclick="app.editNote(${note.id})">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="note-action-btn" onclick="app.deleteNote(${note.id})">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
        `).join('');
    }

    addNote(noteData) {
        const newNote = { id: Date.now(), ...noteData, timestamp: new Date().toISOString() };
        this.data.notes.push(newNote);
        this.saveData('notes');
        this.renderNotes();
    }

    editNote(id) {
        const note = this.data.notes.find(n => n.id === id);
        if (note) {
            document.getElementById('noteTitle').value = note.title;
            document.getElementById('noteContent').value = note.content;
            document.getElementById('noteCategory').value = note.category;
            document.getElementById('modalTitle').textContent = 'Edit Note';
            document.getElementById('saveNoteBtn').textContent = 'Update Note';
            document.getElementById('noteModal').classList.add('active');
            document.getElementById('noteForm').dataset.editId = id;
        }
    }

    deleteNote(id) {
        if (confirm('Are you sure you want to delete this note?')) {
            this.data.notes = this.data.notes.filter(n => n.id !== id);
            this.saveData('notes');
            this.renderNotes();
        }
    }

    // Settings Functions
    initSettings() {
        this.loadSettingsValues();
        this.setupSettingsListeners();
    }

    loadSettingsValues() {
        const settings = this.data.settings;
        
        if (document.getElementById('calorieGoal')) {
            document.getElementById('calorieGoal').value = settings.calorieGoal;
            document.getElementById('calorieRange').value = settings.calorieGoal;
        }
        
        if (document.getElementById('motivationalQuotes')) {
            document.getElementById('motivationalQuotes').checked = settings.motivationalQuotes;
        }
        
        if (document.getElementById('workoutReminders')) {
            document.getElementById('workoutReminders').checked = settings.workoutReminders;
            document.getElementById('nutritionReminders').checked = settings.nutritionReminders;
            document.getElementById('progressUpdates').checked = settings.progressUpdates;
        }

        if (document.getElementById('userName')) {
            document.getElementById('userName').value = settings.profile.name;
            document.getElementById('userEmail').value = settings.profile.email;
            document.getElementById('userAge').value = settings.profile.age;
            document.getElementById('userWeight').value = settings.profile.weight;
            document.getElementById('userHeight').value = settings.profile.height;
        }

        document.querySelectorAll(`[data-unit="${settings.units}"]`).forEach(btn => btn.classList.add('active'));
        document.querySelectorAll(`[data-theme="${settings.theme}"]`).forEach(btn => btn.classList.add('active'));
        document.querySelectorAll(`[data-color="${settings.accentColor}"]`).forEach(btn => btn.classList.add('active'));
    }

    setupSettingsListeners() {
        const calorieGoal = document.getElementById('calorieGoal');
        const calorieRange = document.getElementById('calorieRange');
        
        if (calorieGoal && calorieRange) {
            calorieGoal.addEventListener('input', (e) => {
                calorieRange.value = e.target.value;
                this.updateSetting('calorieGoal', parseInt(e.target.value));
            });
            
            calorieRange.addEventListener('input', (e) => {
                calorieGoal.value = e.target.value;
                this.updateSetting('calorieGoal', parseInt(e.target.value));
            });
        }

        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.updateSetting(e.target.id, e.target.checked);
            });
        });

        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const parent = e.target.parentElement;
                parent.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                if (e.target.dataset.unit) {
                    this.updateSetting('units', e.target.dataset.unit);
                } else if (e.target.dataset.theme) {
                    this.updateSetting('theme', e.target.dataset.theme);
                    this.applyTheme(e.target.dataset.theme);
                }
            });
        });

        document.querySelectorAll('.color-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const color = e.target.dataset.color;
                this.updateSetting('accentColor', color);
                this.applyAccentColor(color);
            });
        });

        document.querySelectorAll('#userName, #userEmail, #userAge, #userWeight, #userHeight').forEach(input => {
            input.addEventListener('change', (e) => {
                const field = e.target.id.replace('user', '').toLowerCase();
                let value = e.target.value;
                if (['age', 'weight', 'height'].includes(field)) {
                    value = parseFloat(value);
                }
                this.updateProfileSetting(field, value);
            });
        });

        const exportDataBtn = document.getElementById('exportDataBtn');
        const importDataBtn = document.getElementById('importDataBtn');
        const importFile = document.getElementById('importFile');
        const resetDataBtn = document.getElementById('resetDataBtn');

        if (exportDataBtn) exportDataBtn.addEventListener('click', () => this.exportData());
        if (importDataBtn && importFile) {
            importDataBtn.addEventListener('click', () => importFile.click());
            importFile.addEventListener('change', (e) => {
                if (e.target.files[0]) this.importData(e.target.files[0]);
            });
        }
        if (resetDataBtn) resetDataBtn.addEventListener('click', () => this.resetAllData());
    }

    updateSetting(key, value) {
        this.data.settings[key] = value;
        this.saveData('settings');
    }

    updateProfileSetting(key, value) {
        this.data.settings.profile[key] = value;
        this.saveData('settings');
    }

    applySettings() {
        this.applyTheme(this.data.settings.theme);
        this.applyAccentColor(this.data.settings.accentColor);
    }

    applyTheme(theme) {
        document.body.dataset.theme = theme;
    }

    applyAccentColor(color) {
        document.documentElement.style.setProperty('--primary-color', color);
    }

    exportData() {
        const dataToExport = {
            workouts: this.data.workouts,
            meals: this.data.meals,
            notes: this.data.notes,
            settings: this.data.settings,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `fitlife-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        alert('Data exported successfully!');
    }

    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                if (importedData.workouts) this.data.workouts = importedData.workouts;
                if (importedData.meals) this.data.meals = importedData.meals;
                if (importedData.notes) this.data.notes = importedData.notes;
                if (importedData.settings) this.data.settings = importedData.settings;
                
                this.saveAllData();
                alert('Data imported successfully!');
                setTimeout(() => location.reload(), 1000);
            } catch (error) {
                alert('Error importing data. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }

    resetAllData() {
        if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
            localStorage.clear();
            alert('All data has been reset!');
            setTimeout(() => location.reload(), 1000);
        }
    }

    // Modal Functions
    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    // Event Listeners Setup
    setupEventListeners() {
        window.navigateToPage = (page) => {
            window.location.href = page;
        };

        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                modal.classList.remove('active');
            });
        });

        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });

        this.setupPageSpecificListeners();
    }

    setupPageSpecificListeners() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        if (currentPage === 'workout.html') {
            const addExerciseBtn = document.getElementById('addExerciseBtn');
            const exerciseForm = document.getElementById('addExerciseForm');

            if (addExerciseBtn) {
                addExerciseBtn.addEventListener('click', () => this.showModal('addExerciseModal'));
            }

            if (exerciseForm) {
                exerciseForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const workoutData = {
                        name: document.getElementById('exerciseName').value,
                        sets: parseInt(document.getElementById('exerciseSets').value),
                        reps: parseInt(document.getElementById('exerciseReps').value),
                        category: document.getElementById('exerciseCategory').value
                    };
                    
                    this.addWorkout(workoutData);
                    this.hideModal('addExerciseModal');
                    e.target.reset();
                });
            }
        }

        if (currentPage === 'nutrition.html') {
            const mealForm = document.getElementById('mealForm');
            if (mealForm) {
                mealForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const mealData = {
                        food: document.getElementById('foodInput').value,
                        portion: document.getElementById('portionInput').value,
                        calories: parseInt(document.getElementById('caloriesInput').value)
                    };
                    
                    this.addMeal(mealData);
                    e.target.reset();
                });
            }
        }

        if (currentPage === 'note.html') {
            const newNoteBtn = document.getElementById('newNoteBtn');
            const noteForm = document.getElementById('noteForm');

            if (newNoteBtn) {
                newNoteBtn.addEventListener('click', () => {
                    document.getElementById('modalTitle').textContent = 'Add New Note';
                    document.getElementById('saveNoteBtn').textContent = 'Save Note';
                    document.getElementById('noteForm').removeAttribute('data-edit-id');
                    this.showModal('noteModal');
                });
            }

            if (noteForm) {
                noteForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const noteData = {
                        title: document.getElementById('noteTitle').value,
                        content: document.getElementById('noteContent').value,
                        category: document.getElementById('noteCategory').value
                    };
                    
                    const editId = e.target.dataset.editId;
                    if (editId) {
                        const note = this.data.notes.find(n => n.id === parseInt(editId));
                        if (note) {
                            Object.assign(note, noteData);
                            this.saveData('notes');
                            this.renderNotes();
                        }
                    } else {
                        this.addNote(noteData);
                    }
                    
                    this.hideModal('noteModal');
                    e.target.reset();
                });
            }
        }
    }

    // Data Management
    saveData(type) {
        localStorage.setItem(`fitlife_${type}`, JSON.stringify(this.data[type]));
    }

    saveAllData() {
        Object.keys(this.data).forEach(key => {
            localStorage.setItem(`fitlife_${key}`, JSON.stringify(this.data[key]));
        });
    }
}

// Initialize the application
const app = new FitLifeApp();
window.app = app;