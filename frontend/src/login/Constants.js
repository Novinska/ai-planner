export const authService = {
  loginWithGoogle: () => {
    window.location.href = "http://localhost:5999/auth/google";
  },
};

export const benefitItems = [
  {
    id: 1,
    title: "AI Асисент",
    icon: "icon-sparlkles",
    description: "Персональні планування та формування розпорядку за тебе",
  },
  {
    id: 2,
    title: "Розумний календар",
    icon: "icon-calendar",
    description: "Автоматичне планування та нагадування",
  },
  {
    id: 3,
    title: "Економія часу",
    icon: "icon-time",
    description: "Більше фокусу на тому, що важливо",
  },
];
