export function calculateDefenseEffectiveness(types = [], chart) {
    // types: ['fire', 'flying'] gibi
    // return: { rock: 2, water: 1, ... } => gelen saldırı tipine karşı multipl.
    const result = {};
    const allTypes = Object.keys(chart);

    allTypes.forEach((attacker) => {
        // başta 1 (nötr)
        let multiplier = 1;
        // her target tipi için saldırı tipine karşı etkiyi hesapla
        if (types.length === 0) {
            multiplier = 1;
        } else {
            // çoklu hedef varsa çarpma değil, her tipin saldırı etkisini ayrı hesapla
            // Savunma için, her target tipi için attacker'a karşı etkiyi çarp
            multiplier = types.reduce((acc, defendType) => {
                // chart[defendType] içinde "weakTo/resistantTo/immuneTo"
                const defInfo = chart[defendType];
                if (!defInfo) return acc;
                // Eğer attacker has immunity: 0
                if (defInfo.immuneTo && typeof defInfo.immuneTo[attacker] !== 'undefined') {
                    return acc * Number(defInfo.immuneTo[attacker]);
                }
                // Eğer attacker does x2
                if (defInfo.weakTo && defInfo.weakTo[attacker]) {
                    return acc * Number(defInfo.weakTo[attacker]);
                }
                // Eğer resistant
                if (defInfo.resistantTo && defInfo.resistantTo[attacker]) {
                    return acc * Number(defInfo.resistantTo[attacker]);
                }
                return acc * 1;
            }, 1);
        }
        result[attacker] = multiplier;
    });

    return result;
}


export function calculateAttackEffectiveness(types = [], targetCombos = [], chart) {
    // types: ['fire', 'flying'] gibi
    // targetCombos: [['rock'], ['rock','ground'], ...] gibi
    // return: { atkType: { 'rock': 2, 'rock+ground': 1 }, ... }
    const result = {};
    const allAttackTypes = types.length ? types : Object.keys(chart); // Eğer types boşsa, tüm tipleri kullan

    allAttackTypes.forEach((atkType) => {
        result[atkType] = {};
        targetCombos.forEach((combo) => {
            // Her combo için etkiyi hesapla
            let mult = 1;
            combo.forEach((t) => {
                // Her target tipi için atkType'a karşı etkiyi çarp
                const targetInfo = chart[t];
                if (!targetInfo) return;
                if (targetInfo.immuneTo && typeof targetInfo.immuneTo[atkType] !== 'undefined') {
                    mult *= Number(targetInfo.immuneTo[atkType]);
                } else if (targetInfo.weakTo && targetInfo.weakTo[atkType]) {
                    mult *= Number(targetInfo.weakTo[atkType]);
                } else if (targetInfo.resistantTo && targetInfo.resistantTo[atkType]) {
                    mult *= Number(targetInfo.resistantTo[atkType]);
                } else {
                    mult *= 1;
                }
            });
            // combo dizisini 'rock+ground' gibi label'a çevir
            const label = combo.join('+');
            result[atkType][label] = mult;
        });
    });

    return result;
}

export function flattenAttackData(nestedAttack) {
    // nestedAttack: { atkType: { targetCombo: mult, ... }, ... }
    // return: { targetCombo: maxMult, ... }
    const summary = {};

    for (const [atkType, targets] of Object.entries(nestedAttack)) {
        for (const [targetCombo, mult] of Object.entries(targets)) {
            // Her targetCombo için en yüksek mult'ı al
            if (!summary[targetCombo]) summary[targetCombo] = mult;
            else summary[targetCombo] = Math.max(summary[targetCombo], mult);
        }
    }

    return summary;
}