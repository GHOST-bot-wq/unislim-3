/**
 * Helper para geração de mensagens humanas, acolhedoras e inteligentes.
 * Totalmente livre de termos técnicos como "tracker", "calorias" ou "déficit".
 */

export const getGreetingMessage = (name) => {
  const hour = new Date().getHours();
  const userName = name || 'amigo';
  
  if (hour >= 5 && hour < 12) {
    return {
      title: `Bom dia, ${userName}`,
      subtitle: 'Hoje é um novo ciclo de acolhimento e autocuidado. Que seja leve.'
    };
  } else if (hour >= 12 && hour < 18) {
    return {
      title: `Boa tarde, ${userName}`,
      subtitle: 'Como está o seu ritmo? Lembre-se de reservar alguns minutos para respirar fundo.'
    };
  } else {
    return {
      title: `Boa noite, ${userName}`,
      subtitle: 'Momento de desacelerar a mente e reconhecer cada pequeno cuidado de hoje.'
    };
  }
};

export const getDailyAestheticQuote = (streak = 0) => {
  const quotes = [
    "Pequenas ações geram grandes transformações.",
    "A consistência é o abraço do tempo na sua jornada.",
    "Seu corpo responde ao carinho e à paciência.",
    "Evoluir é dar um passo gentil de cada vez.",
    "A calma é a chave para uma rotina em harmonia.",
    "Respire fundo. A pressa é uma ilusão da mente.",
    "Hoje, escolha ser a sua melhor companhia.",
    "Cada escolha consciente é uma vitória interna."
  ];
  
  if (streak > 0 && streak % 3 === 0) {
    return `Você manteve consistência por ${streak} dias seguidos. Seu corpo e sua mente estão em harmonia.`;
  }
  
  const index = new Date().getDate() % quotes.length;
  return quotes[index];
};

export const getCheckInFeedback = (mood, energy, emotionalHunger) => {
  if (mood <= 2) {
    return {
      title: "Estamos com você",
      message: "Tudo bem ter momentos de recolhimento. Respire, seja gentil com suas emoções e permita-se descansar um pouco."
    };
  }
  
  if (emotionalHunger >= 4) {
    return {
      title: "Acolha o que sente",
      message: "A fome emocional é apenas um sinal de que algo precisa de atenção. Beba uma água morna, faça uma pausa e dê espaço para suas emoções se acalmarem."
    };
  }
  
  if (energy <= 2) {
    return {
      title: "Momento de recarregar",
      message: "Sua energia está pedindo repouso. Um banho morno ou uma caminhada bem leve podem fazer maravilhas. Respeite o seu ritmo."
    };
  }
  
  if (mood >= 4 && energy >= 4) {
    return {
      title: "Que dia radiante!",
      message: "Sua energia está brilhando hoje. Guarde essa sensação calorosa de bem-estar para fortalecer sua consistência nos próximos passos."
    };
  }
  
  return {
    title: "Registro de bem-estar concluído",
    message: "Obrigado por se ouvir hoje. Cada check-in é um passo importante para compreender sua própria evolução com equilíbrio."
  };
};

export const getHabitCompletionFeedback = (plan) => {
  const { hydration, walkMinutes, mindfulEating } = plan;
  
  let completedCount = 0;
  if (hydration >= 6) completedCount++;
  if (walkMinutes >= 20) completedCount++;
  if (mindfulEating) completedCount++;
  
  if (completedCount === 3) {
    return "Harmonia perfeita! Hoje você nutriu seu corpo de forma integral.";
  } else if (completedCount === 2) {
    return "Excelente. Você está se colocando como prioridade e seu corpo sente a diferença.";
  } else if (completedCount === 1) {
    return "Um ótimo começo. Um único ato de carinho já muda o rumo do seu dia.";
  } else {
    return "O dia ainda tem espaço para um gesto de cuidado com você.";
  }
};
