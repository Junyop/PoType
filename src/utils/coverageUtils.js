export function getCoverageGaps(team) {
    const allTypes = [
        'normal', 'fire', 'water', 'electric', 'grass', 'ice',
        'fighting', 'poison', 'ground', 'flying', 'psychic',
        'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
    ];

    const gaps = [];

    for (const targetType of allTypes) {
        let covered = false;

        for (const slot of team) {
            if (!slot.attack) continue;

            const effectiveness = slot.attack[targetType];

            if (effectiveness && effectiveness >= 2) {
                covered = true;
                break;
            }
        }

        if (!covered) {
            gaps.push(targetType);
        }
    }

    return gaps;
}
