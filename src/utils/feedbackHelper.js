/**
 * Helper para geração de mensagens objetivas, humanas e acolhedoras.
 * Totalmente focado em consistência prática, sem termos contemplativos ou técnicas calóricas obsessivas.
 */

export const getGreetingMessage = (name) => {
  const hour = new Date().getHours();
  const userName = name || 'usuário';
  
  if (hour >= 5 && hour < 12) {
    return {
      title: `Bom dia, ${userName}`,
      subtitle: 'Comece o dia com o foco na consistência. Vamos dar os primeiros passos hoje?'
    };
  } else if (hour >= 12 && hour < 18) {
    return {
      title: `Boa tarde, ${userName}`,
      subtitle: 'Como está o ritmo da sua rotina? Mantenha o foco em suas pequenas ações de hoje.'
    };
  } else {
    return {
      title: `Boa noite, ${userName}`,
      subtitle: 'Dia concluído. Momento de registrar suas vitórias e descansar para o dia de amanhã.'
    };
  }
};

export const getDailyAestheticQuote = (streak = 0) => {
  const quotes = [
    "Pequenas ações geram grandes mudanças.",
    "Consistência vale mais que perfeição.",
    "Seu progresso é construído diariamente.",
    "Hoje é mais uma oportunidade de evoluir.",
    "Foco na consistência diária.",
    "Seu corpo responde ao que você repete.",
    "Grandes resultados vêm de pequenos hábitos diários.",
    "Cada escolha consciente de hoje fortalece sua jornada."
  ];
  
  if (streak > 0 && streak % 3 === 0) {
    return `Parabéns pela consistência! Você completou ${streak} dias seguidos de foco.`;
  }
  
  const index = new Date().getDate() % quotes.length;
  return quotes[index];
};

/**
 * Ajusta as metas de forma adaptativa com base nas respostas práticas do Plano Inteligente
 */
export const getAdjustedGoals = (todayCheckIn) => {
  const defaultGoals = {
    hydrationGoal: 8,
    walkGoal: 30,
    hydrationLabel: '8 copos de água',
    walkLabel: '30 min de caminhada',
    mindfulEatingLabel: 'Comer com atenção e sem telas',
    message: 'Faça seu ajuste diário de metas para adaptar sua rotina de hoje.',
    dayState: 'fresh', // Sem check-in
    toneColor: 'var(--color-primary)'
  };

  if (!todayCheckIn) {
    return defaultGoals;
  }

  // Desestruturando as respostas do Plano Inteligente
  const { dayType, obstacle, energyLevel } = todayCheckIn;
  
  let hydrationGoal = 8;
  let walkGoal = 30;
  let hydrationLabel = '8 copos de água';
  let walkLabel = '30 min de caminhada';
  let mindfulEatingLabel = 'Comer com atenção e sem telas';
  let message = 'Hoje o plano é focar em ações simples e consistentes.';
  let dayState = 'steady';
  let toneColor = 'var(--color-primary)'; // Lilás padrão

  // 1. Regra para dia Cansativo / Energia Baixa
  if (dayType === 'cansativo' || energyLevel <= 2) {
    walkGoal = 15;
    walkLabel = '15 min de caminhada regenerativa';
    toneColor = '#9BA8A0'; // Cinza/Verde meditativo
    dayState = 'restNeeded';
    message = 'Hoje o foco será leveza e constância. Reduzimos a caminhada para 15 min.';
    
    if (energyLevel === 1) {
      walkGoal = 10;
      walkLabel = '10 min de caminhada super leve';
      message = 'Dia com pouquíssima energia. Mantenha o básico: apenas 10 min de caminhada suave.';
    }
  }

  // 2. Regra para dia Corrido / Falta de Tempo
  if (dayType === 'corrido' || obstacle === 'tempo') {
    walkGoal = 15;
    walkLabel = '15 min de caminhada rápida';
    mindfulEatingLabel = 'Refeição consciente e prática';
    message = 'Dia corrido. Simplificamos a caminhada para 15 minutos e focamos em refeições práticas.';
    dayState = 'busy';
    toneColor = '#A399B2'; // Roxo acinzentado
  }

  // 3. Regra para dia Estressante / Ansiedade / Desânimo
  if (dayType === 'estressante' || obstacle === 'ansiedade' || obstacle === 'desanim') {
    toneColor = '#C1A499'; // Pêssego suave aconchegante
    mindfulEatingLabel = 'Comer devagar e respirar antes';
    message = 'Hoje vamos reduzir pressão e simplificar escolhas para desarmar a ansiedade.';
    dayState = 'mindfulFocus';
  }

  // 4. Regra específica de obstáculos alimentares (Doce / Beliscar)
  if (obstacle === 'doce') {
    mindfulEatingLabel = 'Alimentação presente (copo d\'água se der vontade de doce)';
    message = 'Dica para hoje: se bater vontade de doce, beba um copo de água e espere 5 minutos.';
  } else if (obstacle === 'beliscar') {
    mindfulEatingLabel = 'Comer apenas sentado e sem distrações';
    message = 'Foco total hoje em sentar-se para comer e evitar beliscar fora de hora.';
  }

  // 5. Dia tranquilo com muita energia
  if (dayType === 'tranquilo' && energyLevel >= 4) {
    message = 'Excelente nível de disposição! Aproveite o dia tranquilo para fazer sua rotina completa.';
    dayState = 'vibrant';
    toneColor = 'var(--color-primary)';
  }

  return {
    hydrationGoal,
    walkGoal,
    hydrationLabel,
    walkLabel,
    mindfulEatingLabel,
    message,
    dayState,
    toneColor
  };
};

export const getCheckInFeedback = (dayType, obstacle, energyLevel) => {
  if (dayType === 'cansativo' || energyLevel <= 2) {
    return {
      title: "Plano ajustado para hoje",
      message: "Hoje o foco será leveza e constância. Ajustamos suas metas para que você consiga cumprir com pouco esforço."
    };
  }
  
  if (dayType === 'estressante' || obstacle === 'ansiedade') {
    return {
      title: "Plano ajustado para hoje",
      message: "Hoje vamos reduzir pressão e simplificar escolhas. Suas metas estão simplificadas para evitar estresse."
    };
  }

  if (dayType === 'corrido' || obstacle === 'tempo') {
    return {
      title: "Plano ajustado para hoje",
      message: "Dia agitado! Suas metas foram condensadas em pequenos blocos rápidos para se encaixarem na sua agenda."
    };
  }
  
  return {
    title: "Plano ajustado para hoje",
    message: "Excelente! Seu plano diário foi calibrado de acordo com a sua rotina para garantir o máximo de consistência."
  };
};

export const getHabitCompletionFeedback = (plan, adjustedGoals) => {
  const { hydration, walkMinutes, mindfulEating, mentalPause } = plan;
  const hydGoal = adjustedGoals?.hydrationGoal || 8;
  const wlkGoal = adjustedGoals?.walkGoal || 30;
  
  let completedCount = 0;
  if (hydration >= hydGoal) completedCount++;
  if (walkMinutes >= wlkGoal) completedCount++;
  if (mindfulEating) completedCount++;
  if (mentalPause) completedCount++;
  
  if (completedCount === 4) {
    return "Vitória diária! Você concluiu todos os hábitos planejados para hoje.";
  } else if (completedCount >= 2) {
    return "Muito bem! Falta muito pouco para fechar sua rotina diária.";
  } else if (completedCount === 1) {
    return "Excelente começo. Uma pequena ação concluída já gera progresso.";
  } else {
    return "Sua rotina aguarda seu primeiro passo. O que vamos cumprir agora?";
  }
};
