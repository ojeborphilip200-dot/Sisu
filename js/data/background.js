// Language and home-country options from the "Tell us about you" onboarding step.
// Each entry is [id, label]. Used by the quiz and the Profile page.
export const languages = [
  ["en", "English"],
  ["ar", "العربية · Arabic"],
  ["zh", "中文 · Chinese"],
  ["fr", "Français · French"],
  ["hi", "हिन्दी · Hindi"],
  ["ja", "日本語 · Japanese"],
  ["ko", "한국어 · Korean"],
  ["pt", "Português · Portuguese"],
  ["es", "Español · Spanish"],
  ["tr", "Türkçe · Turkish"],
  ["vi", "Tiếng Việt · Vietnamese"],
  ["other", "Another language"],
];

export const countries = [
  ["br", "🇧🇷 Brazil"],
  ["cn", "🇨🇳 China"],
  ["co", "🇨🇴 Colombia"],
  ["eg", "🇪🇬 Egypt"],
  ["fr", "🇫🇷 France"],
  ["de", "🇩🇪 Germany"],
  ["gh", "🇬🇭 Ghana"],
  ["in", "🇮🇳 India"],
  ["it", "🇮🇹 Italy"],
  ["jp", "🇯🇵 Japan"],
  ["ke", "🇰🇪 Kenya"],
  ["mx", "🇲🇽 Mexico"],
  ["np", "🇳🇵 Nepal"],
  ["ng", "🇳🇬 Nigeria"],
  ["pk", "🇵🇰 Pakistan"],
  ["ph", "🇵🇭 Philippines"],
  ["kr", "🇰🇷 South Korea"],
  ["es", "🇪🇸 Spain"],
  ["tr", "🇹🇷 Türkiye"],
  ["vn", "🇻🇳 Vietnam"],
  ["other", "🌍 Another country"],
  ["prefer-not", "Prefer not to say"],
];

export const labelFor = (list, id) => list.find(([value]) => value === id)?.[1] ?? null;
