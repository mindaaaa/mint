import { useState } from 'react';
import { Desktop } from './components/Desktop.jsx';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return <Desktop isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />;
}
