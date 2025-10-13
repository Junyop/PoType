export function getStackedWeaknesses(team) {
    const counts = {};

    for (const slot of team) {
        const defense = slot.defense || {};
        for (const [type, multiplier] of Object.entries(defense)) {
            if (multiplier > 1) {
                counts[type] = (counts[type] || 0) + 1;
            }
        }
    }

    // Sadece 2+ kişi aynı zayıflığa sahipse
    const stacked = Object.entries(counts)
        .filter(([_, count]) => count >= 2)
        .map(([type, count]) => ({ type, count }));

    return stacked;
}
