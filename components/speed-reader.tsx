import React, { useState, useEffect, useRef } from 'react';
import { PlayCircle, PauseCircle, RotateCcw, Sun, Moon, X, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COLORS = {
  Orange: '#f97316',
  Red: '#ef4444',
  'Light Blue': '#38bdf8',
  'Light Green': '#4ade80',
  Brown: '#a8703a',
  Grey: '#9ca3af'
};

const SpeedReader = () => {
  const [text, setText] = useState('');
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(300);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [progress, setProgress] = useState(0);
  const [fontSize, setFontSize] = useState(24);
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [selectedColor, setSelectedColor] = useState('Orange');
  
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(null);
  const wpmRef = useRef(wpm);
  const colorMenuRef = useRef(null);
  const sizeMenuRef = useRef(null);

  useEffect(() => {
    wpmRef.current = wpm;
  }, [wpm]);

  const handleTextChange = (e) => {
    setText(e.target.value);
    const newWords = e.target.value.trim().split(/\s+/);
    setWords(newWords);
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  const getCurrentWord = () => {
    if (!words[currentIndex]) return { before: '', middle: '', after: '' };
    const word = words[currentIndex];
    const pivotIndex = Math.ceil(word.length / 2) - 1;
    
    return {
      before: word.slice(0, pivotIndex),
      middle: word[pivotIndex] || '',
      after: word.slice(pivotIndex + 1)
    };
  };

  const animate = (timestamp) => {
    if (!isPlaying || !lastTimeRef.current) {
      lastTimeRef.current = timestamp;
      requestAnimationFrame(animate);
      return;
    }

    const elapsed = timestamp - lastTimeRef.current;
    const msPerWord = (60 * 1000) / wpmRef.current;

    if (elapsed >= msPerWord) {
      setCurrentIndex(prev => {
        if (prev >= words.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
      lastTimeRef.current = timestamp;
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = null;
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    const progressPercentage = (currentIndex / Math.max(words.length - 1, 1)) * 100;
    setProgress(progressPercentage);
  }, [currentIndex, words.length]);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = Math.sign(e.deltaY) * -10;
    setWpm(prev => Math.max(100, Math.min(1000, prev + delta)));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorMenuRef.current && !colorMenuRef.current.contains(event.target)) {
        setShowColorMenu(false);
      }
      if (sizeMenuRef.current && !sizeMenuRef.current.contains(event.target)) {
        setShowSizeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`p-6 min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <textarea
        className={`w-full p-4 mb-4 h-32 rounded-lg ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
        }`}
        value={text}
        onChange={handleTextChange}
        placeholder="Paste your text here..."
      />

      <div
        ref={containerRef}
        className={`w-full h-40 mb-4 relative ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
        } rounded-lg overflow-hidden`}
        onWheel={handleWheel}
      >
        <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center">
          <div className="flex justify-center items-center text-2xl font-mono tracking-normal">
            <div className="text-right" style={{ width: '6ch', textOverflow: 'clip', overflow: 'hidden' }}>
              <span className="transition-colors duration-150">
                {getCurrentWord().before}
              </span>
            </div>
            <div className="w-[1ch] text-center transition-colors duration-150"
                 style={{ color: COLORS[selectedColor] }}>
              {getCurrentWord().middle}
            </div>
            <div className="text-left" style={{ width: '6ch', textOverflow: 'clip', overflow: 'hidden' }}>
              <span className="transition-colors duration-150">
                {getCurrentWord().after}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 transition-all duration-200"
             style={{ width: `${progress}%` }} />
        <div className="relative h-full -mt-2">
          {[25, 50, 75].map(quarter => (
            <div
              key={quarter}
              className="absolute top-0 w-px h-full bg-gray-400"
              style={{ left: `${quarter}%` }}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-2 relative">
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            variant={isDarkMode ? "secondary" : "outline"}
            className={isDarkMode ? "hover:bg-gray-700" : ""}
          >
            {isPlaying ? <PauseCircle className="h-6 w-6" /> : <PlayCircle className="h-6 w-6" />}
          </Button>
          <Button
            onClick={() => {
              setCurrentIndex(0);
              setIsPlaying(false);
            }}
            variant={isDarkMode ? "secondary" : "outline"}
            className={isDarkMode ? "hover:bg-gray-700" : ""}
          >
            <RotateCcw className="h-6 w-6" />
          </Button>
          <Button
            onClick={() => {
              setText('');
              setWords([]);
              setCurrentIndex(0);
              setIsPlaying(false);
            }}
            variant={isDarkMode ? "secondary" : "outline"}
            className={isDarkMode ? "hover:bg-gray-700" : ""}
          >
            <X className="h-6 w-6" />
          </Button>

          <div ref={colorMenuRef} className="relative">
            <Button
              onClick={() => {
                setShowColorMenu(!showColorMenu);
                setShowSizeMenu(false);
              }}
              variant={isDarkMode ? "secondary" : "outline"}
              className={isDarkMode ? "hover:bg-gray-700" : ""}
            >
              <div
                className="w-6 h-6 rounded-full border border-gray-400"
                style={{ backgroundColor: COLORS[selectedColor] }}
              />
            </Button>
            {showColorMenu && (
              <div 
                className={`absolute top-full mt-2 p-3 rounded-lg shadow-lg z-10 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
                style={{ width: '72px' }}
              >
                <div className="flex flex-col gap-3">
                  {Object.entries(COLORS).map(([name, color]) => (
                    <button
                      key={name}
                      className="w-8 h-8 rounded-full border border-gray-400 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setSelectedColor(name);
                        setShowColorMenu(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div ref={sizeMenuRef} className="relative">
            <Button
              onClick={() => {
                setShowSizeMenu(!showSizeMenu);
                setShowColorMenu(false);
              }}
              variant={isDarkMode ? "secondary" : "outline"}
              className={isDarkMode ? "hover:bg-gray-700" : ""}
            >
              <Type className="h-6 w-6" />
            </Button>
            {showSizeMenu && (
              <div className={`absolute top-full mt-2 p-2 rounded-lg shadow-lg z-10 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
              style={{ width: '120px' }}
              >
                <div className="flex flex-col gap-2">
                  {[16, 20, 24, 28, 32].map((size) => (
                    <button
                      key={size}
                      className={`p-1 rounded text-left ${
                        fontSize === size 
                          ? isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                          : ''
                      } ${
                        isDarkMode 
                          ? 'hover:bg-gray-700' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        setFontSize(size);
                        setShowSizeMenu(false);
                      }}
                    >
                      {size}px
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={() => setIsDarkMode(!isDarkMode)}
            variant={isDarkMode ? "secondary" : "outline"}
            className={isDarkMode ? "hover:bg-gray-700" : ""}
          >
            {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </Button>
        </div>
        <div className="text-lg">
          {wpm} WPM
        </div>
      </div>
    </div>
  );
};

export default SpeedReader;