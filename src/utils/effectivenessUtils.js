export function groupEffectiveness(data) {
    const groups = {
        'x2': [],
        'x0.5': [],
        'x0': [],
        neutral: []
    };

    for (const [type, value] of Object.entries(data)) {
        if (value === 2) groups['x2'].push(type);
        else if (value === 0.5) groups['x0.5'].push(type);
        else if (value === 0) groups['x0'].push(type);
        else groups.neutral.push(type);
    }

    return groups;
}
