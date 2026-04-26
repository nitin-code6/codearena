import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor({ language: externalLanguage, value, onChange }) {
  const [internalLanguage, setInternalLanguage] = useState('cpp');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  const currentLanguage = externalLanguage !== undefined ? externalLanguage : internalLanguage;

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    if (externalLanguage === undefined) {
      setInternalLanguage(newLang);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      // Enter fullscreen
      containerRef.current.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error(`Fullscreen error: ${err.message}`));
    } else {
      // Exit fullscreen
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(err => console.error(`Exit fullscreen error: ${err.message}`));
    }
  };

  // Listen for fullscreen change events (e.g., ESC key)
  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  // Add/remove event listener when component mounts/unmounts
  useState(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontWeight: 'bold' }}>Language:</label>
          <select 
            value={currentLanguage} 
            onChange={handleLanguageChange}
            style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="cpp">C++</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>
        <button
          onClick={toggleFullscreen}
          style={{
            padding: '4px 12px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: '#f0f0f0',
            cursor: 'pointer'
          }}
        >
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>
      <Editor
        height="60vh"
        language={currentLanguage}
        value={value}
        onChange={onChange}
        theme="vs-light"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: 'on'
        }}
      />
    </div>
  );
}

export default CodeEditor;