document.addEventListener("DOMContentLoaded", () => {
    // Sélection des éléments du DOM
    const form = document.forms['kapturatorform'];
    const generateButton = document.getElementById("generer");
    const resetButton = document.getElementById("effacer");
    const resultCapture = document.getElementById("resultcapture");

    // Initialisation du thème
    const toggleTheme = document.querySelector('.theme-toggle');
    const body = document.body;

    // Vérifier et appliquer le thème enregistré dans localStorage
    if (localStorage.getItem('theme') === 'light') {
        body.setAttribute('data-theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark'); // Par défaut, le thème sombre
    }

    // Fonction pour changer de thème
    toggleTheme.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme); // Enregistrer le nouveau thème dans localStorage
        updateIcons(newTheme); // Mise à jour des icônes
    });

    // Vérification des icônes de thème
    function updateIcons(theme) {
        const darkIcon = document.getElementById("dark-icon");
        const lightIcon = document.getElementById("light-icon");
        if (theme === "dark") {
            darkIcon.style.display = "inline"; // Afficher l'icône de lune
            lightIcon.style.display = "none"; // Cacher l'icône de soleil
        } else {
            darkIcon.style.display = "none"; // Cacher l'icône de lune
            lightIcon.style.display = "inline"; // Afficher l'icône de soleil
        }
    }

    // Calcul du pourcentage de capture
    generateButton.addEventListener("click", () => {
        // Récupération des valeurs du formulaire
        const typeball = parseFloat(form.typeball.value); // Valeur de la Pokéball
        const plpfmembre = parseFloat(form.PLPFmembre.value); // Niveau du membre (PLPF)
        const nivWild = parseFloat(form.NivWild.value); // Niveau du Pokémon sauvage
        const stadeEvo = parseFloat(form.StadeEvo.value); // Stade d'évolution du Pokémon
        const spetype = parseFloat(form.Spetype.value); // Médaille de spécialiste
        const balluse = parseFloat(form.BallUse.value); // Ball déjà utilisées

        // Vérification si les niveaux sont renseignés
        if (isNaN(plpfmembre) || isNaN(nivWild) || plpfmembre <= 0 || nivWild <= 0) {
            resultCapture.innerText = "Veuillez indiquer un niveau valide pour le membre et le Pokémon sauvage.";
            return; // On arrête le calcul ici
        }

        // Calcul de la différence de niveau entre le membre et le Pokémon sauvage
        let niveauDiff = nivWild - plpfmembre; // Calculé à partir du niveau sauvage moins le niveau du membre

        // Vérification de l'échec automatique si le Pokémon sauvage est supérieur de 6 niveaux ou plus
        if (niveauDiff >= 6) {
            resultCapture.innerText = "La capture du Pokémon est impossible en raison de son niveau trop élevé par rapport à vos compétences. Entraînez-vous avant de tenter ce genre d'actions !";
            return; // On arrête le calcul ici car la capture échoue automatiquement
        }

        // Calcul du bonus de différence de niveau (après avoir géré l'échec automatique)
        let niveauBonus = 0;
        if (niveauDiff >= 4 && niveauDiff <= 5) {
            niveauBonus = -5; // Sauvage PLPF +4 jusqu'à +5
        } else if (niveauDiff >= 0 && niveauDiff <= 3) {
            niveauBonus = 0; // Sauvage PLPF +0 jusqu'à +3
        } else if (niveauDiff >= -10 && niveauDiff <= -1) {
            niveauBonus = 5; // Sauvage PLPF -1 jusqu'à -10
        } else if (niveauDiff >= -20 && niveauDiff <= -11) {
            niveauBonus = 10; // Sauvage PLPF -11 jusqu'à -20
        } else {
            niveauBonus = 15; // Sauvage PLPF -21 ou plus
        }

        // Calcul du bonus en fonction du PLPF du membre
        let plpfBonus = 0;
        if (plpfmembre >= 5 && plpfmembre <= 10) {
            plpfBonus = 20;
        } else if (plpfmembre > 10 && plpfmembre <= 15) {
            plpfBonus = 15;
        } else if (plpfmembre > 15 && plpfmembre <= 20) {
            plpfBonus = 10;
        } else {
            plpfBonus = 0;
        }

        // Calcul du bonus de stade d'évolution
        let stadeBonus = 0;
        if (stadeEvo === 20) {
            stadeBonus = 20; // Pokémon de base
        } else if (stadeEvo === 10) {
            stadeBonus = 10; // Pokémon stade 1 ou sans évolution
        } else {
            stadeBonus = 0; // Pokémon stade 2
        }

        // Bonus médaille spécialiste
        const medailleBonus = spetype; // Déjà récupéré avec la bonne valeur

        // Bonus pour le nombre de balls utilisées
        const balluseBonus = balluse * 5;

        // Calcul final du pourcentage de capture
        let capture = typeball + plpfBonus + stadeBonus + medailleBonus + balluseBonus + niveauBonus;

        // Limitation du pourcentage de capture à des bornes raisonnables
        capture = Math.max(0, Math.min(100, Math.floor(capture)));

        // Lancer un tirage aléatoire entre 1 et 100
        const randomValue = Math.floor(Math.random() * 100) + 1; // 1 à 100

        // Vérifier si la capture est réussie
        const isSuccess = randomValue <= capture; // Si le tirage est inférieur ou égal au pourcentage

        // Affichage des résultats
        resultCapture.innerText = `Le pourcentage de capture est de ${capture} %\n` +
            `Random entre 1 et 100 donne : ${randomValue}\n` +
            (isSuccess
                ? "Félicitations ! Le Pokémon est capturé !"
                : "Pas de chance ! Il s'est échappé et semble vous défier de recommencer.");
    });

    // Réinitialisation des champs
    resetButton.addEventListener("click", () => {
        form.reset(); // Réinitialise tous les champs du formulaire
        resultCapture.innerText = ""; // Efface le message de résultat
    });
});
