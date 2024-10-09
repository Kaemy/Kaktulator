// Sélection des éléments du DOM pour le changement de thème
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const darkIcon = document.getElementById('dark-icon');
const lightIcon = document.getElementById('light-icon');

// Fonction pour appliquer le thème en fonction de la sélection
function applyTheme(theme) {
    if (theme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        darkIcon.style.display = 'none';
        lightIcon.style.display = 'block';
    } else {
        body.setAttribute('data-theme', 'light');
        darkIcon.style.display = 'block';
        lightIcon.style.display = 'none';
    }
}

// Vérifier si un thème est déjà stocké dans le localStorage, sinon appliquer le thème sombre par défaut
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    applyTheme(savedTheme);
} else {
    // Appliquer le thème sombre par défaut
    applyTheme('dark');
    localStorage.setItem('theme', 'dark'); // Stocker la préférence dans le localStorage
}

// Basculer le thème lors du clic sur l'icône
themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Sauvegarder le nouveau thème dans localStorage
});


// Gérer les onglets
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const activeTab = button.getAttribute('data-tab');

        tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        button.classList.add('active');

        tabContents.forEach(content => {
            content.style.display = content.id === activeTab ? 'block' : 'none';
        });
    });
});

function openTab(event, tabId) {
    // Masquer tout le contenu des onglets
    const tabContents = document.querySelectorAll('.tab-content');
    const tabButtons = document.querySelectorAll('.tab-button');

    tabContents.forEach(tabContent => {
        tabContent.style.display = 'none'; // Cacher tout le contenu
    });

    // Retirer la classe active de tous les boutons
    tabButtons.forEach(tabButton => {
        tabButton.classList.remove('active');
    });

    // Afficher le contenu sélectionné
    const selectedTabContent = document.getElementById(tabId);
    selectedTabContent.style.display = 'block';

    // Ajouter la classe active au bouton sélectionné
    event.currentTarget.classList.add('active');
}

// Afficher le premier onglet par défaut au chargement
window.addEventListener('DOMContentLoaded', () => {
    const firstTabButton = document.querySelector('.tab-button');
    const firstTabContent = document.querySelector('.tab-content');

    if (firstTabButton && firstTabContent) {
        firstTabButton.classList.add('active');
        firstTabContent.style.display = 'block';
    }
});


// Calcul de la capture de pokémons

document.getElementById('generer').addEventListener('click', () => {
    // Récupération des valeurs
    const typeBall = parseInt(document.getElementById("typeball").value);
    const PLPFmembre = parseInt(document.getElementById("PLPFmembre").value);
    const NivWild = parseInt(document.getElementById("NivWild").value);
    const stadeEvo = parseInt(document.getElementById("stadeEvo").value);
    const Spetype = parseInt(document.getElementById("Spetype").value);
    const ballUse = parseInt(document.getElementById("BallUse").value);

    // Vérifier si PLPFmembre et NivWild ont des valeurs valides
    if (isNaN(PLPFmembre) || PLPFmembre < 1 || isNaN(NivWild) || NivWild < 1) {
        document.getElementById('kapturator-result').innerHTML = `
            Veuillez indiquer des valeurs valides pour le niveau du membre et le niveau du Pokémon sauvage.
        `;
        return; // Arrête le calcul ici si les valeurs ne sont pas valides
    }

    // Calcul de la différence de niveaux
    let niveauDiff = NivWild - PLPFmembre; // Différence entre le niveau du Pokémon sauvage et le membre

    // Vérification des bonus ou de l'échec automatique selon la différence de niveaux
    let niveauBonus = 0;
    if (niveauDiff >= 6) {
        // Échec automatique si la différence de niveau est supérieure ou égale à 6
        document.getElementById('kapturator-result').textContent = "La capture échoue : Le niveau du Pokémon sauvage est trop élevé.";
        return;
    } else if (niveauDiff >= 4 && niveauDiff <= 5) {
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

    // Calcul final de la capture avec les bonus
    let captureChance = typeBall + stadeEvo + Spetype + niveauBonus - ballUse;

    // Limiter le pourcentage à 100% maximum
    captureChance = Math.min(100, Math.max(0, captureChance));

    // Tirage random entre 1 et 100
    const randomTirage = Math.floor(Math.random() * 100) + 1;

    // Vérification du succès de la capture
    let resultatCapture = randomTirage <= captureChance ? "Félicitations ! Le Pokémon est capturé !" : "Pas de chance, le Pokémon s'est échappé.";

    // Affichage du résultat
    document.getElementById('kapturator-result').innerHTML = `
        Chance de capture : ${captureChance}%<br>
        Random : ${randomTirage}<br>
        ${resultatCapture}
    `;
});


// Logique d'effacement
document.getElementById('effacer').addEventListener('click', () => {
    document.getElementById('kapturator-form').reset(); // Réinitialise le formulaire
    document.getElementById('kapturator-result').textContent = ''; // Réinitialiser le résultat
});



////// ONGLET 2 ////////
// Table des types de la Génération 9 (simplifié)
const typeChart = {
    normal: { rock: 0.5, ghost: 0, steel: 0.5 },
    fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
    water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
    grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
    electric: { electric: 0.5, flying: 2, water: 2, ground: 0 },
    ice: { fire: 0.5, water: 1, grass: 1, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
    fighting: { normal: 2, ice: 2, rock: 2, dark: 2, steel: 1, flying: 0.5, psychic: 0.5, fairy: 0.5 },
    poison: { grass: 2, fairy: 2, poison: 0.5, ground: 1, rock: 1 },
    ground: { fire: 2, electric: 1, grass: 0.5, water: 1, poison: 1, rock: 2 },
    flying: { fighting: 2, bug: 2, grass: 1, electric: 0.5, rock: 0.5, steel: 0.5 },
    psychic: { fighting: 2, poison: 2, psychic: 0.5, bug: 0.5, ghost: 1, dark: 0.5 },
    bug: { grass: 2, psychic: 1, dark: 1, fire: 0.5, fighting: 0.5, flying: 0.5, ghost: 1, fairy: 0.5, rock: 0.5 },
    rock: { normal: 1, fire: 1, fighting: 0.5, flying: 2, bug: 1, ice: 1, poison: 1, ground: 1, steel: 0.5 },
    ghost: { normal: 0, fighting: 0.5, poison: 1, bug: 1, ghost: 2, dark: 1 },
    dragon: { dragon: 2, steel: 0.5, fairy: 0 },
    dark: { ghost: 2, psychic: 2, fighting: 0.5, dark: 1, fairy: 0.5 },
    steel: { normal: 1, fire: 0.5, water: 0.5, electric: 1, ice: 1, rock: 1, fairy: 2, steel: 0.5 },
    fairy: { fighting: 2, dark: 2, dragon: 1, steel: 0.5, poison: 0.5, fairy: 1 },
};

function calculateTypeEffectiveness(attackType, defenseType1, defenseType2 = '') {
    let multiplier = 1;

    // Appliquer le multiplicateur pour le premier type défensif
    if (typeChart[attackType] && typeChart[attackType][defenseType1]) {
        multiplier *= typeChart[attackType][defenseType1];
    }

    // Appliquer le multiplicateur pour le deuxième type défensif, s'il existe
    if (defenseType2 && typeChart[attackType] && typeChart[attackType][defenseType2]) {
        multiplier *= typeChart[attackType][defenseType2];
    }

    return multiplier;
}

document.getElementById("damage-form").addEventListener("submit", function(event) {
    event.preventDefault();

    // Récupérer les valeurs du formulaire
    const level = parseInt(document.getElementById("level").value);
    const attack = parseInt(document.getElementById("attack").value);
    const power = parseInt(document.getElementById("power").value);
    const defense = parseInt(document.getElementById("defense").value);
    const criticalRate = parseFloat(document.getElementById("critical-rate").value);
    const accuracy = parseInt(document.getElementById("accuracy").value);
    const effect = document.getElementById("effect").value;

    // Récupérer les types
    const attackType = document.getElementById("attack-type").value;
    const defenseType1 = document.getElementById("defense-type1").value;
    const defenseType2 = document.getElementById("defense-type2").value;

    // Calcul de l'efficacité du type
    const typeMultiplier = calculateTypeEffectiveness(attackType, defenseType1, defenseType2);

    // Gestion de l'affichage du taux de l'effet
    const effectRate = effect !== "none" ? parseInt(document.getElementById("effect-rate").value) : 0;

    // Tirage aléatoire pour la précision de l'attaque
    const accuracyRoll = Math.random();
    const randomAccuracyRoll = Math.floor(accuracyRoll * 100) + 1; // Convertir en entier entre 1 et 100

    // Vérifier si l'attaque réussit (le tirage doit être inférieur ou égal à la précision)
    const isHit = randomAccuracyRoll <= accuracy;

    const resultDiv = document.getElementById("damage-result");

    // Afficher le tirage de précision
    resultDiv.innerHTML = `Random pour la précision : ${randomAccuracyRoll} <br>`;

    // Si l'attaque échoue
    if (!isHit) {
        resultDiv.innerHTML += `(L'attaque échoue)<br>`;
        return; // Arrêter le script ici si l'attaque échoue
    }

    // Si l'attaque réussit, vérifier si le coup critique est possible
    let criticalMultiplier = 1;
    let criticalMessage = ""; // Par défaut, rien n'est affiché pour les coups critiques

    if (criticalRate > 0) { // Si le coup critique est possible
        // Tirage pour le coup critique
        const criticalRoll = Math.random();
        const randomCriticalRoll = Math.floor(criticalRoll * 100) + 1; // Tirage entre 1 et 100
        const isCriticalHit = criticalRoll < criticalRate;

        // Afficher le tirage pour le coup critique
        criticalMessage = `Random Coup Critique : ${randomCriticalRoll} `;

        if (isCriticalHit) {
            criticalMultiplier = 1.5; // Multiplier pour coup critique
            criticalMessage += `<i>(Coup critique !)</i><br>`;
        } else {
            criticalMessage += `<br>`;
        }
    }

    // Tirage pour l'effet secondaire si l'effet n'est pas "Aucun"
    let effectMessage = "";
    if (effect !== "none" && effectRate > 0) {
        const effectRoll = Math.random();
        const randomEffectRoll = Math.floor(effectRoll * 100) + 1; // Tirage entre 1 et 100

        // Afficher le tirage pour l'effet
        effectMessage += `Random pour l'effet : ${randomEffectRoll} `;

        if (randomEffectRoll <= effectRate) {
            switch (effect) {
                case "burn":
                    effectMessage += `(Effet déclenché : Brûlure)<br>`;
                    break;
                case "paralysis":
                    effectMessage += `(Effet déclenché : Paralysie)<br>`;
                    break;
                case "poison":
                    effectMessage += `(Effet déclenché : Empoisonnement)<br>`;
                    break;
                case "fear":
                    effectMessage += `(Effet déclenché : Peur)<br>`;
                    break;
                case "freeze":
                    effectMessage += `(Effet déclenché : Gel)<br>`;
                    break;
                case "confusion":
                    effectMessage += `(Effet déclenché : Confusion)<br>`;
                    break;
                default:
                    effectMessage += "";
            }
        } else {
            effectMessage += `<i>(Pas d'effet)</i><br>`;
        }
    }

     // Formule de calcul des dégâts (simplifiée avec multiplicateur de type)
     let damage = ((((level * 2 / 5 + 2) * attack * power / defense) / 50) + 2) * typeMultiplier * criticalMultiplier;

     // Arrondir au supérieur pour des .5 ou plus
     damage = Math.round(damage);
 
     // Message d'efficacité
        let effectivenessMessage = '';
        if (typeMultiplier > 1) {
            effectivenessMessage = "<i>C'est super efficace !</i>";
        } else if (typeMultiplier < 1) {
            effectivenessMessage = "<i>Ce n'est pas très efficace...</i>";
        }

    // Afficher le résultat
    resultDiv.innerHTML += `
        ${criticalMessage}
        ${effectMessage}<br>
        PV perdus : ${Math.max(0, Math.floor(damage))}<br>
        ${effectivenessMessage}
    `;
});

// Gestion de l'affichage du champ du taux d'effet en fonction de la sélection de l'effet secondaire
document.getElementById("effect").addEventListener("change", function() {
    const effectValue = this.value;
    const effectRateContainer = document.getElementById("effect-rate-container");
    
    if (effectValue === "none") {
        effectRateContainer.style.display = "none"; // Cacher le champ du taux si "Aucun" est sélectionné
        document.getElementById("effect-rate").removeAttribute("required"); // Rendre non obligatoire
    } else {
        effectRateContainer.style.display = "flex"; // Afficher le champ du taux si un effet est sélectionné
        document.getElementById("effect-rate").setAttribute("required", "required"); // Rendre obligatoire
    }
});

// Réinitialiser les résultats
document.getElementById("damage-form").addEventListener("reset", function() {
    document.getElementById("damage-result").innerHTML = ""; // Effacer les résultats
    document.getElementById("effect-rate-container").style.display = "none"; // Masquer le champ de taux d'effet
});



////// ONGLET 3 ////////
// Gérer la logique de randomisation
document.getElementById('cs-type').addEventListener('change', () => {
    const selectedType = document.getElementById('cs-type').value;
    
    // Montre ou cache les champs custom pour l'option "Autre"
    if (selectedType === 'autre') {
        document.getElementById('custom-range').style.display = 'block';
    } else {
        document.getElementById('custom-range').style.display = 'none';
    }
});

document.getElementById('generate-random').addEventListener('click', () => {
    const selectedType = document.getElementById('cs-type').value;
    let result = '';
    let randomNum;

    if (selectedType === 'coupe') {
        randomNum = Math.floor(Math.random() * 100) + 1;
        result += `Random tiré : ${randomNum}<br>`;

        if (randomNum <= 40) { // Baies communes
            const berries = ['Oran', 'Ceriz', 'Maron', 'Pecha', 'Fraive', 'Willia', 'Kika'];
            const berryIndex = Math.floor(Math.random() * berries.length);
            result += `Vous avez trouvé une baie commune : ${berries[berryIndex]}`;
        } else if (randomNum <= 70) { // Baies peu communes
            const uncommonBerries = ['Sitrus', 'Prine'];
            const berryIndex = Math.floor(Math.random() * uncommonBerries.length);
            result += `Vous avez trouvé une baie peu commune : ${uncommonBerries[berryIndex]}`;
        } else if (randomNum <= 90) { // Baies rares
            const rareBerries = ['Siam', 'Mangou', 'Rabuta', 'Tronci', 'Kiwan'];
            const berryIndex = Math.floor(Math.random() * rareBerries.length);
            result += `Vous avez trouvé une baie rare : ${rareBerries[berryIndex]}`;
        } else { // Baies très rares
            const veryRareBerries = ['Charti', 'Micle'];
            const berryIndex = Math.floor(Math.random() * veryRareBerries.length);
            result += `Vous avez trouvé une baie très rare : ${veryRareBerries[berryIndex]}`;
        }

    } else if (selectedType === 'force') {
        randomNum = Math.floor(Math.random() * 100) + 1;
        result += `Random tiré : ${randomNum}<br>`;

        if (randomNum <= 20) { // Objets inutilisables
            result += 'Vous avez trouvé un objet inutilisable ou rien.';
        } else if (randomNum <= 28) {
            result += 'Vous avez trouvé une Potion.';
        } else if (randomNum <= 36) {
            result += 'Vous avez trouvé une Poké-Ball.';
        } else if (randomNum <= 44) {
            const items = ['Antidote', 'Anti-Para', 'Anti-Brûle', 'Anti-Gel', 'Réveil'];
            const itemIndex = Math.floor(Math.random() * items.length);
            result += `Vous avez trouvé : ${items[itemIndex]}`;
        } else if (randomNum <= 51) {
            result += 'Vous avez trouvé un Lait Meumeu.';
        } else if (randomNum <= 58) {
            result += 'Vous avez trouvé une Super-Potion.';
        } else if (randomNum <= 64) {
            result += 'Vous avez trouvé une Super-Ball.';
        } else if (randomNum <= 70) {
            result += 'Vous avez trouvé une Hyper-Potion.';
        } else if (randomNum <= 76) {
            result += 'Vous avez trouvé une Hyper-Ball.';
        } else if (randomNum <= 82) {
            result += 'Vous avez trouvé un Total-Soin.';
        } else if (randomNum <= 88) {
            result += 'Vous avez trouvé un Rappel.';
        } else if (randomNum <= 94) {
            result += 'Vous avez trouvé un Rappel Max.';
        } else if (randomNum <= 97) {
            result += 'Vous avez trouvé un Superbonbon.';
        } else {
            const stones = ['Soleil', 'Lune', 'Foudre', 'Eau', 'Feu', 'Plante', 'Glace', 'Pierre Stase'];
            const stoneIndex = Math.floor(Math.random() * stones.length);
            result += `Vous avez trouvé une Pierre d'évolution : ${stones[stoneIndex]}`;
        }

    } else if (selectedType === 'eclate-roc') {
        randomNum = Math.floor(Math.random() * 100) + 1;
        result += `Random tiré : ${randomNum}<br>`;

        if (randomNum <= 10) { // Objets de rareté 4
            result += 'Vous avez trouvé une Potion.';
        } else if (randomNum <= 20) {
            result += 'Vous avez trouvé une Poké-Ball.';
        } else if (randomNum <= 30) {
            const items = ['Antidote', 'Anti-Para', 'Anti-Brûle', 'Anti-Gel', 'Réveil'];
            const itemIndex = Math.floor(Math.random() * items.length);
            result += `Vous avez trouvé : ${items[itemIndex]}`;
        } else if (randomNum <= 39) {
            result += 'Vous avez trouvé un Lait Meumeu.';
        } else if (randomNum <= 48) {
            result += 'Vous avez trouvé une Super-Potion.';
        } else if (randomNum <= 56) {
            result += 'Vous avez trouvé une Super-Ball.';
        } else if (randomNum <= 64) {
            result += 'Vous avez trouvé une Hyper-Potion.';
        } else if (randomNum <= 72) {
            result += 'Vous avez trouvé une Hyper-Ball.';
        } else if (randomNum <= 80) {
            result += 'Vous avez trouvé un Total-Soin.';
        } else if (randomNum <= 86) {
            result += 'Vous avez trouvé un Rappel.';
        } else if (randomNum <= 92) {
            result += 'Vous avez trouvé un Rappel Max.';
        } else if (randomNum <= 96) {
            result += 'Vous avez trouvé un Superbonbon.';
        } else {
            const stones = ['Soleil', 'Lune', 'Foudre', 'Eau', 'Feu', 'Plante', 'Glace', 'Pierre Stase'];
            const stoneIndex = Math.floor(Math.random() * stones.length);
            result += `Vous avez trouvé une Pierre d'évolution : ${stones[stoneIndex]}`;
        }

    } else if (selectedType === 'autre') {
        const min = parseInt(document.getElementById('custom-min').value);
        const max = parseInt(document.getElementById('custom-max').value);

        // Validation des entrées pour le random custom
        if (!isNaN(min) && !isNaN(max) && min < max) {
            randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
            result = `Le random entre ${min} et ${max} est : ${randomNum}`;
        } else {
            result = 'Veuillez entrer des valeurs valides pour le minimum et le maximum.';
        }
    }

    // Affichage du résultat
    document.getElementById('random-result').innerHTML = result;
});

document.getElementById('clear-result').addEventListener('click', () => {
    // Efface le résultat affiché
    document.getElementById('random-result').innerHTML = '';
});

// Ensure the first tab is active on page load
window.addEventListener('DOMContentLoaded', () => {
    const firstTabButton = document.querySelector('.tab-button');
    const firstTabContent = document.querySelector('.tab-content');

    if (firstTabButton && firstTabContent) {
        firstTabButton.classList.add('active');
        firstTabContent.style.display = 'block';
        firstTabContent.style.opacity = '1';  // Ensure smooth appearance
    }
});
