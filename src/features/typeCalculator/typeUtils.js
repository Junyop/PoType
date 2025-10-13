// SAVUNMA: çarpanları çarp
export function calculateDefenseEffectiveness(types, chart) {
    const effectiveness = {};

    types.forEach((type) => {
        const info = chart[type];
        for (const [enemyType, multiplier] of Object.entries(info.weakTo || {})) {
            effectiveness[enemyType] = (effectiveness[enemyType] || 1) * multiplier;
        }
        for (const [enemyType, multiplier] of Object.entries(info.resistantTo || {})) {
            effectiveness[enemyType] = (effectiveness[enemyType] || 1) * multiplier;
        }
        for (const [enemyType, multiplier] of Object.entries(info.immuneTo || {})) {
            effectiveness[enemyType] = 0;
        }
    });

    return effectiveness;
}

// SALDIRI: en güçlü saldırı seç (çarpma yok!)
export function calculateAttackEffectiveness(attackTypes, targetTypesArray, chart) {
    const result = {};

    attackTypes.forEach((attackType) => {
        result[attackType] = {};

        targetTypesArray.forEach((targetTypes) => {
            const targetLabel = targetTypes.join('/');
            let maxMultiplier = 0;

            for (const targetType of targetTypes) {
                const targetInfo = chart[targetType];
                let currentMultiplier = 1;

                if (targetInfo.immuneTo && targetInfo.immuneTo[attackType] === 0) {
                    maxMultiplier = 0;
                    break;
                } else if (targetInfo.weakTo && targetInfo.weakTo[attackType]) {
                    currentMultiplier = targetInfo.weakTo[attackType];
                } else if (targetInfo.resistantTo && targetInfo.resistantTo[attackType]) {
                    currentMultiplier = targetInfo.resistantTo[attackType];
                }

                maxMultiplier = Math.max(maxMultiplier, currentMultiplier);
            }

            result[attackType][targetLabel] = maxMultiplier;
        });
    });

    return result;
}

export function flattenAttackData(nestedAttack) {
    const summary = {};
    for (const [atkType, targets] of Object.entries(nestedAttack)) {
        for (const [targetCombo, multiplier] of Object.entries(targets)) {
            // eski hali (YANLIŞ): çarpma
            // summary[targetCombo] = (summary[targetCombo] || 1) * multiplier;

            // yeni hali (DOĞRU): en yüksek çarpanı seç
            summary[targetCombo] = Math.max(summary[targetCombo] || 0, multiplier);
        }
    }
    return summary;
}