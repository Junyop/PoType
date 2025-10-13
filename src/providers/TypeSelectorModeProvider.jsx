import React, { useState } from 'react';
import TypeSelectorModeContext from '../contexts/TypeSelectorModeContext';


const TypeSelectorModeProvider = ({ children }) => {
    const [mode, setMode] = useState('pokemon');

    return (
        <TypeSelectorModeContext.Provider value={{ mode, setMode }}>
            {children}
        </TypeSelectorModeContext.Provider>
    );
};

export default TypeSelectorModeProvider;
