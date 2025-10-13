export function analyzeCounter(team, targetTypes, chart) {
    let offensiveCoverage = 0;
    let defensiveWeakness = 0;

    for (const slot of team) {
        // SALDIRI
        const attackEffect = slot.attack || {};
        const attackTotal = targetTypes
            .map((t) => attackEffect[t] || 1)
            .reduce((a, b) => a * b, 1);
        if (attackTotal >= 2) offensiveCoverage++;

        // SAVUNMA
        const defenseEffect = slot.defense || {};
        const defenseTotal = targetTypes
            .map((t) => defenseEffect[t] || 1)
            .reduce((a, b) => a * b, 1);
        if (defenseTotal > 1) defensiveWeakness++;
    }

    return {
        offensiveCoverage,
        defensiveWeakness,
        teamSize: team.length
    };
}
