// Deployment Fix - Add error handling and debugging
(function() {
    'use strict';
    
    // Console logging for deployment debugging
    console.log('FitLife App: Loading...');
    
    // Error handler for debugging deployment issues
    window.addEventListener('error', function(e) {
        console.error('FitLife Error:', e.error);
        console.error('File:', e.filename);
        console.error('Line:', e.lineno);
    });

    // Check if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFitLife);
    } else {
        initFitLife();
    }

    function initFitLife() {
        console.log('FitLife App: DOM Ready, initializing...');
        
        // Ensure the main app initializes properly
        try {
            if (typeof FitLifeApp !== 'undefined') {
                console.log('FitLife App: Successfully initialized');
            } else {
                console.error('FitLife App: FitLifeApp class not found');
            }
        } catch (error) {
            console.error('FitLife App: Initialization error:', error);
        }
    }
})();