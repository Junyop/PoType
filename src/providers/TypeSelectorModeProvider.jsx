import React, { useState } from 'react';
import TypeSelectorModeContext from '../contexts/TypeSelectorModeContext';

// Bu sağlayıcı, TypeSelectorModeContext için durumu yönetir
const TypeSelectorModeProvider = ({ children }) => {
    const [mode, setMode] = useState('pokemon');

    return (
        <TypeSelectorModeContext.Provider value={{ mode, setMode }}>
            {children}
        </TypeSelectorModeContext.Provider>
    );
};

export default TypeSelectorModeProvider;
