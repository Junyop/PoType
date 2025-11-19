import typeChartData from "../data/typeChart.json";

/**
 * TypeChart verisini kolay erişim için (AttackerType -> DefenderType -> Multiplier) formatına dönüştürür.
 * @param {string} attackingType - Saldıran tip
 * @param {string} defendingType - Savunan tip
 * @returns {number} Hasar Çarpanı (0, 0.5, 1, 2, 4 vb.)
 */
// Belirli bir saldıran tipe karşı savunan tipin etkililiğini döner
const getEffectivenessMultiplier = (attackingType, defendingType) => {
    // defendingType: Savunan tipin tüm weak/resistant/immune listesi
    const typeData = typeChartData[defendingType];

    // 1. Zayıflık (Weak To - Hasar alırsın)
    if (typeData.weakTo && typeData.weakTo[attackingType]) {
        return typeData.weakTo[attackingType]; // <-- Burası 2.0 dönmeli
    }
    // 2. Direnç (Resistant To - Az Hasar alırsın)
    if (typeData.resistantTo && typeData.resistantTo[attackingType]) {
        return typeData.resistantTo[attackingType];
    }
    // 3. Bağışıklık (Immune To - Hasar almazsın)
    if (typeData.immuneTo && typeData.immuneTo[attackingType]) {
        return typeData.immuneTo[attackingType];
    }

    // Normal hasar (1.0)
    return 1;
};

/**
 * Takım bazında saldırı (kapsama) ve savunma (ortalama direnç) analizlerini hesaplar.
 * @param {Array} team - Takımdaki Pokémon dizisi [{ name, types: [] }]
 * @returns {{ attack: Object, defense: Object, summary: Object }}
 */
export const calculateTeamAnalysis = (team) => {
    if (!Array.isArray(team) || team.length === 0) {
        // Tüm tiplerin listesi (typeChartData objesinin anahtar seti)
        const allTypes = Object.keys(typeChartData);
        const emptyAnalysis = { attack: {}, defense: {}, summary: { strongAgainst: [], weakAgainst: [], immuneTo: [] } };
        allTypes.forEach(type => {
            emptyAnalysis.attack[type] = "1.00";
            emptyAnalysis.defense[type] = "1.00";
        });
        return emptyAnalysis;
    }

    const allTypes = Object.keys(typeChartData);
    const analysis = {
        attack: {}, // { type: maxEtki } -> Takımın o tipe karşı maksimum vuruş çarpanı
        defense: {}, // { type: toplamZayıflık/avantaj } -> Takımın o tipten aldığı ortalama hasar
    };

    // Bütün tipleri sıfırla/başlat
    allTypes.forEach((type) => {
        analysis.attack[type] = 0; // Saldırı için başlangıç 0 (Max alacağız)
        analysis.defense[type] = 0; // Savunma için başlangıç 0 (Toplam alacağız)
    });

    // Her Pokémon için analiz
    team.forEach((pokemon) => {
        if (!pokemon || !Array.isArray(pokemon.types) || pokemon.types.length === 0) return;

        // SAVUNMA ANALİZİ (Average Defensive Multiplier): Takımın aldığı hasar çarpanlarını topla
        allTypes.forEach((attackingType) => {
            let totalMultiplier = 1;

            // Çift tiplerin çarpımsal etkisini hesapla
            pokemon.types.forEach((defType) => {
                const multiplier = getEffectivenessMultiplier(attackingType, defType);
                totalMultiplier *= multiplier;
            });

            // Takımdaki tüm üyelerin o tipe karşı aldığı hasar çarpanını toplama ekle
            analysis.defense[attackingType] += totalMultiplier;
        });

        // SALDIRI ANALİZİ (Max Coverage Multiplier): Takımın vurduğu en yüksek etkiyi bul
        pokemon.types.forEach((atkType) => {
            allTypes.forEach((defType) => {
                const multiplier = getEffectivenessMultiplier(atkType, defType);

                // Takımın o tipe karşı maksimum vuruş çarpanını güncelle
                if (multiplier > analysis.attack[defType]) {
                    analysis.attack[defType] = multiplier;
                }
            });
        });
    });

    // Ortalama Savunma Değerlerini Çıkar ve Ondalık Sayı Formatı
    let teamTypesCount = 0;

    if (team && Array.isArray(team)) {
        team.forEach((pokemon) => {
            if (pokemon && Array.isArray(pokemon.types) && pokemon.types.length > 0) {
                teamTypesCount = teamTypesCount + 1;
            }
        });
    }
    const teamSize = teamTypesCount || 1; // Bölme hatasını önlemek için en az 1

    Object.keys(analysis.defense).forEach((type) => {
        // Savunma için: Toplam çarpanı takım büyüklüğüne böl (ortalama)
        analysis.defense[type] = (analysis.defense[type] / teamSize).toFixed(2);

        // Saldırı için: Maksimum değeri string olarak formatla
        analysis.attack[type] = analysis.attack[type].toFixed(2);
    });

    // Genel özet (avantaj vs zayıflık sayısı) - Savunma ortalamasına göre
    const summary = {
        strongAgainst: [],
        weakAgainst: [],
        immuneTo: [],
    };

    Object.keys(analysis.defense).forEach((type) => {
        const val = parseFloat(analysis.defense[type]);
        // Zayıflık (Çift Zayıflık Ortalaması veya birden fazla zayıf üye varsa)
        if (val >= 1.26) summary.weakAgainst.push(type);
        // Direnç (Tek direnç ortalaması veya daha iyi)
        else if (val <= 0.74 && val > 0) summary.strongAgainst.push(type);
        // Bağışıklık (Mutlak 0 gelmesi)
        else if (val === 0) summary.immuneTo.push(type);
    });

    return { ...analysis, summary };
};

export default calculateTeamAnalysis;