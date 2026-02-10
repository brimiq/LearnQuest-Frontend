import { useState } from 'react';
import { motion } from 'motion/react';
import { Palette, Check, Sun, Moon } from 'lucide-react';
import clsx from 'clsx';
import { useThemeStore } from '../stores/themeStore';

export function Settings() {
  const { theme, themes, setTheme } = useThemeStore();
  const [filterCategory, setFilterCategory] = useState<'All' | 'Light' | 'Dark'>('All');

  const filteredThemes = filterCategory === 'All' 
    ? themes 
    : themes.filter(t => t.category === filterCategory);

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-base-content">Settings</h1>
        <p className="text-base-content/60 mt-1">Customize your LearnQuest experience</p>
      </div>

      {/* Theme Section */}
      <div className="bg-base-200 rounded-2xl border border-base-300 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Palette size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-base-content">Appearance</h2>
            <p className="text-sm text-base-content/60">Choose a theme for the interface</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6">
          {(['All', 'Light', 'Dark'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                filterCategory === cat
                  ? "bg-primary text-primary-content"
                  : "bg-base-300/30 text-base-content/60 hover:bg-base-300/50"
              )}
            >
              {cat === 'Light' && <Sun size={14} />}
              {cat === 'Dark' && <Moon size={14} />}
              {cat}
            </button>
          ))}
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredThemes.map((t) => (
            <motion.button
              key={t.name}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setTheme(t.name)}
              className={clsx(
                "relative rounded-xl border-2 overflow-hidden transition-all",
                theme === t.name
                  ? "border-primary shadow-lg shadow-primary/20"
                  : "border-base-300 hover:border-primary/50"
              )}
            >
              {/* Theme Preview */}
              <div data-theme={t.name} className="p-3 bg-base-100">
                <div className="flex gap-1 mb-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  <div className="w-2 h-2 rounded-full bg-neutral"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 w-full rounded bg-base-content/20"></div>
                  <div className="h-1.5 w-3/4 rounded bg-base-content/10"></div>
                </div>
                <div className="flex gap-1 mt-2">
                  <div className="h-4 flex-1 rounded bg-primary text-primary-content text-[8px] flex items-center justify-center font-bold">A</div>
                  <div className="h-4 flex-1 rounded bg-secondary text-secondary-content text-[8px] flex items-center justify-center font-bold">B</div>
                  <div className="h-4 flex-1 rounded bg-accent text-accent-content text-[8px] flex items-center justify-center font-bold">C</div>
                </div>
              </div>

              {/* Label */}
              <div className="px-3 py-2 bg-base-200 flex items-center justify-between">
                <span className="text-xs font-semibold text-base-content truncate">{t.label}</span>
                {theme === t.name && (
                  <Check size={14} className="text-primary shrink-0" />
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Current Theme Info */}
        <div className="mt-6 p-4 bg-base-300/20 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-sm text-base-content/60">Current theme: </span>
            <span className="text-sm font-bold text-base-content capitalize">{themes.find(t => t.name === theme)?.label || theme}</span>
          </div>
          <button
            onClick={() => setTheme('light')}
            className="text-xs text-primary hover:underline"
          >
            Reset to default
          </button>
        </div>
      </div>
    </div>
  );
}
