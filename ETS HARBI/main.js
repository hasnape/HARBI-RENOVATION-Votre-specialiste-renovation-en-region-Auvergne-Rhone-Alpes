// Fonction pour masquer la bannière de bienvenue
function hideWelcomeBanner() {
    const banner = document.getElementById('welcomeBanner');
    banner.style.display = 'none';
}

// Fonction pour valider le formulaire de demande de projet
function validateProjectForm() {
    const form = document.getElementById('projectRequestForm');
    form.addEventListener('submit', function(event) {
        alert('Votre demande a été envoyée avec succès !');
        event.preventDefault(); // Pour empêcher l'envoi réel du formulaire
    });
}

// Fonction pour naviguer vers les sections correspondantes dans la navigation
function scrollToSection() {
    document.querySelectorAll('.navigation a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = document.querySelector(this.getAttribute('href'));
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Fonction pour s'inscrire à la newsletter
function subscribeToNewsletter() {
    const newsletterForm = document.querySelector('.footer form');
    newsletterForm.addEventListener('submit', function(event) {
        alert('Merci de vous être inscrit à notre newsletter !');
        event.preventDefault(); // Pour empêcher l'envoi réel du formulaire
    });
}

// Initialisation des fonctions au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    validateProjectForm();
    scrollToSection();
    subscribeToNewsletter();
    const closeButton = document.querySelector('#welcomeBanner button');
    closeButton.addEventListener('click', hideWelcomeBanner);
});

// Vérifiez si l'API de reconnaissance vocale est prise en charge
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    let isRecording = false;
    let timeoutId;

    // Fonction pour démarrer ou continuer la reconnaissance vocale
    function toggleRecognition(inputId) {
        const inputElement = document.getElementById(inputId);
        const countdownElement = document.getElementById('countdown-' + inputId);

        if (isRecording) {
            recognition.stop();
            clearTimeout(timeoutId);
            countdownElement.textContent = ''; // Effacer le compte à rebours
        } else {
            recognition.start();
            isRecording = true;
            countdownElement.textContent = '10'; // Initialiser le compte à rebours

            // Définissez un minuteur pour limiter l'enregistrement à 10 secondes
            let countdown = 10; // Durée du compte à rebours en secondes
            timeoutId = setInterval(function() {
                countdown--;
                countdownElement.textContent = countdown.toString();
                if (countdown <= 0) {
                    clearInterval(timeoutId);
                    recognition.stop();
                    countdownElement.textContent = '';
                }
            }, 1000);

            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                inputElement.value += transcript;
            };

            recognition.onend = function() {
                isRecording = false;
                clearInterval(timeoutId);
                countdownElement.textContent = '';
            };

            recognition.onerror = function(event) {
                console.error('Erreur de reconnaissance vocale:', event.error);
                recognition.stop();
                clearInterval(timeoutId);
                isRecording = false;
                countdownElement.textContent = '';
            };
        }
    }

    // Ajoutez un bouton de microphone et un élément de compte à rebours à côté du titre de chaque champ de saisie
    document.querySelectorAll('#projectRequestForm label').forEach(function(label) {
        const inputId = label.getAttribute('for');
        const micButton = document.createElement('button');
        micButton.innerText = '🎤';
        micButton.type = 'button';
        micButton.setAttribute('aria-label', 'Démarrer la reconnaissance vocale');
        micButton.onclick = function(event) {
            event.preventDefault();
            toggleRecognition(inputId);
        };

        const countdownSpan = document.createElement('span');
        countdownSpan.id = 'countdown-' + inputId;
        countdownSpan.className = 'countdown';

        label.appendChild(micButton);
        label.appendChild(countdownSpan);
    });
} else {
    console.log('La reconnaissance vocale n\'est pas prise en charge dans ce navigateur.');
}
