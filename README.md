<!-- ...existing code... -->

# PoType

PoType, Pokémon tipi hesaplama ve takım oluşturma özellikleri sunan bir web uygulamasıdır. Kullanıcılar, Pokémon tiplerinin zayıflıklarını, güçlerini ve takım sinerjilerini kolayca analiz edebilir.

## Gereksinimler

- Node.js >= 16
- npm (veya yarn)
- Proje Vite/CRA benzeri dev sunucu ile çalışır (package.json içindeki script'lere bakın).

## Kurulum

1. Depoyu klonlayın:
    ```bash
    git clone https://github.com/Junyop/PoType.git
    cd PoType
    ```
2. Bağımlılıkları yükleyin:
    ```bash
    npm install
    ```
3. Geliştirme sunucusunu başlatın:
    ```bash
    npm run dev
    ```
4. Üretim derlemesi:
    ```bash
    npm run build
    ```

## Kullanım

- Ana sayfada Pokémon tiplerini seçerek zayıflık ve güç tablolarını görüntüleyebilirsiniz.
- Takım oluşturucu (Team Builder) ile farklı Pokémon tiplerinden bir takım kurup sinerjilerini analiz edebilirsiniz.
- Tip hesaplayıcı (Type Calculator) ile seçilen tiplerin karşılıklı etkilerini inceleyebilirsiniz.

## Proje Yapısı (kısa)

- src/
  - components/ — yeniden kullanılabilir UI bileşenleri (ör. TeamSlot.jsx)
  - contexts/ — React context'leri (Type selector vb.)
  - features/
    - teamBuilder/ — takım oluşturucu ekranı
    - typeCalculator/ — tip analizörü
  - utils/ — yardımcı fonksiyonlar (ör. typeColors.js)
  - store/ veya redux/ — redux slice/action'lar

## Önemli Notlar & Hata Giderme

- Fast Refresh / ESLint hatası:
  - Hata: "Fast refresh only works when a file only exports components. Move your React context(s) to a separate file."
  - Çözüm: context tanımlarını ayrı dosyada tutun (ör. `src/contexts/TypeSelectorModeContext.js`) ve Provider'ı ayrı dosyada tutmak Fast Refresh uyumluluğunu sağlar. Örnek:
    ```js
    // src/contexts/TypeSelectorModeContext.js
    import { createContext } from 'react';
    export const TypeSelectorModeContext = createContext();
    ```
    ```js
    // src/contexts/TypeSelectorModeProvider.jsx
    import React, { useState } from 'react';
    import { TypeSelectorModeContext } from './TypeSelectorModeContext';
    export const TypeSelectorModeProvider = ({ children }) => {
      const [mode, setMode] = useState('pokemon');
      return <TypeSelectorModeContext.Provider value={{ mode, setMode }}>{children}</TypeSelectorModeContext.Provider>;
    };
    ```

- İmport / export uyuşmazlıkları:
  - Eğer dosyada `export const TypeSelectorModeContext = ...` kullanıyorsanız import ederken `import { TypeSelectorModeContext } from '...'` kullanın.
  - Eğer `export default ...` ise `import X from '...'` şeklinde alın.

- useTypeSelectorMode hook:
  - Hook dosyanız `useContext(TypeSelectorModeContext)` kullanıyorsa, context export'unun doğru (named vs default) olduğundan emin olun.

- ESLint `no-unused-vars` yakaladıysa (ör. `catch (error)`), ya `catch { ... }` kullanın ya da `error` değişkenini kullanın (ör. `console.error(error)`).

- typeColors kullanımı:
  - `src/utils/typeColors.js` içinde `export default typeColors;` varsa import şu şekilde olmalı:
    ```js
    import typeColors from '../utils/typeColors';
    // kullanım
    typeColors('fire');
    ```
  - Alternatif olarak helper fonksiyon (getTypeColor) ekleyip alpha/rgba dönüşümleri yapabilirsiniz.

- CSS gradient:
  - MUI sx içinde gradient uygulamak için `background` veya `backgroundImage` kullanın; `backgroundColor: 'linear-gradient(...)'` çalışmaz.
  - Örnek:
    ```js
    background: isPokemonMode && selectedPokeData
      ? `linear-gradient(135deg, ${typeColors(selectedPokeData.types[0])}88, ${typeColors(selectedPokeData.types[1] || selectedPokeData.types[0])}88)`
      : '#e0e0e0'; // grey.200 hex
    ```

- Slot sıfırlama (TeamSlot):
  - Eğer reset butonuna basıldığında sadece filtreler resetleniyorsa, slot seçimini de sıfırlamak için ilgili Redux action'ı dispatch edin:
    ```js
    dispatch(setSlotTypes({ slotIndex, types: [], pokemon: '', sprite: '' }));
    ```

## Debugging Adımları

1. Konsol hatalarını oku (tarayıcı console + terminal).
2. Import/Export hatalarında dosya yollarını ve named/default export kullanımını kontrol et.
3. Hala fast-refresh/ESLint hatası varsa context ve component export'larını ayrı dosyalara taşı.

## Katkı Sağlama

Katkıda bulunmak için lütfen bir issue açın veya pull request gönderin. Kod standartlarına uyun ve küçük değişiklikler için PR açıklaması ekleyin.

## Lisans

Bu proje MIT lisansı ile lisanslanmıştır. Ayrıntılar için `LICENSE` dosyasını inceleyiniz.