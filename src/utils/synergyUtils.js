// Takımdaki zaafları hangi Pokémon'un kapattığını analiz eder
export function findSynergy(team) {
    const typeSynergy = {};

    team.forEach((slot, i) => {
        const { pokemon, defense, attack } = slot;

        // Her Pokémon'un zayıflıklarını bul
        const weaknesses = Object.entries(defense || {})
            .filter(([_, val]) => val > 1)
            .map(([type]) => type);

        weaknesses.forEach((weakType) => {
            if (!typeSynergy[weakType]) {
                typeSynergy[weakType] = { weakMembers: [], covers: [] };
            }
            typeSynergy[weakType].weakMembers.push(pokemon);
        });
    });

    // Takımın saldırılarını kontrol et (kim kimi kapatıyor)
    Object.entries(typeSynergy).forEach(([weakType, data]) => {
        team.forEach((slot) => {
            const { pokemon, attack } = slot;
            if (attack && attack[weakType] >= 2) {
                data.covers.push(pokemon);
            }
        });
    });

    return typeSynergy;
}
