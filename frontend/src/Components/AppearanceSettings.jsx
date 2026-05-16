import { Moon, Sun, Palette } from "lucide-react";
import { useTheme } from "../context/themeContext";

const options = [
  { value: "light", label: "Light", description: "Clean, bright interface", icon: Sun },
  { value: "dark", label: "Dark", description: "Easy on the eyes at night", icon: Moon },
];

function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="card p-5 sm:p-6 mb-6">
      <div className="flex items-start gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="p-2.5 rounded-lg bg-brand-50 dark:bg-brand-500/10">
          <Palette className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        </div>
        <div>
          <h2 className="text-base font-medium text-slate-900 dark:text-slate-100">
            Appearance
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Choose how the app looks on your device
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => {
          const selected = theme === opt.value;
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTheme(opt.value)}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                selected
                  ? "border-brand-500 bg-brand-50/80 dark:bg-brand-500/10 dark:border-brand-500"
                  : "border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-600 bg-white dark:bg-slate-800/50"
              }`}
            >
              <div
                className={`p-2.5 rounded-lg shrink-0 ${
                  selected
                    ? "bg-brand-500 text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">{opt.label}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{opt.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AppearanceSettings;
