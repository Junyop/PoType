import { useContext } from 'react';
import TypeSelectorModeContext from './TypeSelectorModeContext';

export const useTypeSelectorMode = () => useContext(TypeSelectorModeContext);

export default useTypeSelectorMode;
