/**
 * Gerador Inteligente de Plano Alimentar
 * Adapta o plano com base no check-in do Plano Inteligente do Dia
 */

const MEAL_PLANS = {
  balanced: {
    type: 'balanced',
    label: 'Plano Equilibrado',
    insight: 'Refeições nutritivas e balanceadas para manter sua energia ao longo do dia.',
    aiMessage: 'Foco em nutrição completa e saciedade duradoura.',
    meals: [
      {
        id: 'breakfast',
        period: 'Café da manhã',
        time: '7h – 9h',
        emoji: '☀️',
        name: 'Omelete com pão integral e fruta',
        description: 'Omelete de 2 ovos, 1 fatia de pão integral e uma fruta da estação.',
        calories: 380,
        justification: 'Proteína + fibra garantem saciedade até o almoço sem picos de fome.'
      },
      {
        id: 'lunch',
        period: 'Almoço',
        time: '12h – 13h30',
        emoji: '🍽️',
        name: 'Frango grelhado com arroz e legumes',
        description: 'Peito de frango temperado com ervas, arroz e legumes refogados.',
        calories: 520,
        justification: 'Refeição equilibrada com proteína, carboidrato e fibras para energia sustentada.'
      },
      {
        id: 'snack',
        period: 'Lanche da tarde',
        time: '15h – 16h',
        emoji: '🌰',
        name: 'Iogurte grego com amêndoas',
        description: '1 pote de iogurte grego natural com 1 punhado de amêndoas.',
        calories: 210,
        justification: 'Gordura boa e proteína mantêm energia sem picos de insulina à tarde.'
      },
      {
        id: 'dinner',
        period: 'Jantar',
        time: '19h – 20h30',
        emoji: '🌙',
        name: 'Sopa de legumes com frango',
        description: 'Caldo de legumes com frango desfiado e folhas verdes.',
        calories: 380,
        justification: 'Jantar leve favorece o descanso e a recuperação durante o sono.'
      }
    ]
  },

  light: {
    type: 'light',
    label: 'Plano Leve',
    insight: 'Refeições simples e reconfortantes para um dia de pouca energia.',
    aiMessage: 'Hoje priorizamos refeições fáceis. Sem pressão, sem complicação.',
    meals: [
      {
        id: 'breakfast',
        period: 'Café da manhã',
        time: '7h – 9h',
        emoji: '☀️',
        name: 'Vitamina de banana com aveia',
        description: 'Banana batida com leite (ou vegetal), aveia e mel.',
        calories: 320,
        justification: 'Fácil de preparar e fornece energia gradual para o início do dia cansativo.'
      },
      {
        id: 'lunch',
        period: 'Almoço',
        time: '12h – 13h30',
        emoji: '🍽️',
        name: 'Salada com atum e torrada integral',
        description: 'Mix de folhas, atum ao natural, tomate e 2 torradas integrais com azeite.',
        calories: 380,
        justification: 'Refeição leve mas nutritiva. Atum fornece proteína sem exigir muito do organismo.'
      },
      {
        id: 'snack',
        period: 'Lanche da tarde',
        time: '15h – 16h',
        emoji: '🌰',
        name: 'Fruta + castanha',
        description: 'Maçã ou pera com 1 pequeno punhado de castanhas.',
        calories: 180,
        justification: 'Lanche rápido e nutritivo para recarregar sem pesar no organismo.'
      },
      {
        id: 'dinner',
        period: 'Jantar',
        time: '19h – 20h30',
        emoji: '🌙',
        name: 'Ovos mexidos com pão integral',
        description: '2 ovos mexidos com temperos suaves e 1 fatia de pão integral.',
        calories: 340,
        justification: 'Simples e reconfortante para noites cansativas. Pronto em menos de 10 minutos.'
      }
    ]
  },

  practical: {
    type: 'practical',
    label: 'Plano Prático',
    insight: 'Refeições rápidas e nutritivas para encaixar na sua agenda agitada.',
    aiMessage: 'Dia corrido. Refeições práticas que cabem na sua rotina.',
    meals: [
      {
        id: 'breakfast',
        period: 'Café da manhã',
        time: '7h – 9h',
        emoji: '☀️',
        name: 'Iogurte grego com granola e fruta',
        description: '1 pote de iogurte grego com granola e banana fatiada.',
        calories: 290,
        justification: 'Menos de 2 minutos de preparo. Nutritivo e energético para o dia agitado.'
      },
      {
        id: 'lunch',
        period: 'Almoço',
        time: '12h – 13h30',
        emoji: '🍽️',
        name: 'Wrap de frango com vegetais',
        description: 'Tortilla integral com frango, alface, tomate e azeite.',
        calories: 440,
        justification: 'Prático, nutritivo e pode ser feito ou comprado rapidamente.'
      },
      {
        id: 'snack',
        period: 'Lanche da tarde',
        time: '15h – 16h',
        emoji: '🌰',
        name: 'Banana com pasta de amendoim',
        description: '1 banana com 1 colher de pasta de amendoim integral.',
        calories: 220,
        justification: 'Rico em energia para aguentar a tarde agitada sem precisar parar para comer muito.'
      },
      {
        id: 'dinner',
        period: 'Jantar',
        time: '19h – 20h30',
        emoji: '🌙',
        name: 'Omelete com salada simples',
        description: '3 ovos com queijo leve e mix de folhas com azeite.',
        calories: 360,
        justification: 'Pronto em 10 minutos. Proteico e suficiente para uma boa noite de descanso.'
      }
    ]
  },

  satiating: {
    type: 'satiating',
    label: 'Plano Saciante',
    insight: 'Refeições de alto volume e saciedade para controlar a ansiedade alimentar.',
    aiMessage: 'Seu plano foi ajustado para reduzir a ansiedade e a vontade de beliscar.',
    meals: [
      {
        id: 'breakfast',
        period: 'Café da manhã',
        time: '7h – 9h',
        emoji: '☀️',
        name: 'Omelete com queijo e pão integral',
        description: '2 ovos com queijo branco, 1 fatia de pão integral e café preto.',
        calories: 420,
        justification: 'Alto em proteína para reduzir fome ao longo da manhã e evitar beliscar.'
      },
      {
        id: 'lunch',
        period: 'Almoço',
        time: '12h – 13h30',
        emoji: '🍽️',
        name: 'Frango + salada farta + arroz',
        description: 'Prato com bastante salada variada, frango grelhado e arroz com feijão.',
        calories: 560,
        justification: 'Alto volume e completamente nutritivo para saciar totalmente e afastar a ansiedade.'
      },
      {
        id: 'snack',
        period: 'Lanche da tarde',
        time: '15h – 16h',
        emoji: '🌰',
        name: 'Iogurte grego com cacau em pó',
        description: '1 pote de iogurte grego com 1 colher de cacau em pó e mel.',
        calories: 230,
        justification: 'Satisfaz a vontade de doce de forma saudável. Proteína que mantém a saciedade.'
      },
      {
        id: 'dinner',
        period: 'Jantar',
        time: '19h – 20h30',
        emoji: '🌙',
        name: 'Sopa cremosa de legumes',
        description: 'Caldo grosso de abóbora ou mandioquinha com frango desfiado.',
        calories: 400,
        justification: 'Refeição quentinha e reconfortante. Alta saciedade para não beliscar à noite.'
      }
    ]
  }
};

/**
 * Seleciona o plano ideal baseado no check-in do Plano Inteligente do Dia
 */
export const generateMealPlan = (checkIn) => {
  if (!checkIn) return MEAL_PLANS.balanced;

  const { dayType, obstacle, energyLevel } = checkIn;

  // Prioridade 1: Energia baixa ou dia cansativo → plano leve
  if (energyLevel <= 2 || dayType === 'cansativo') {
    return MEAL_PLANS.light;
  }

  // Prioridade 2: Dia corrido ou falta de tempo → plano prático
  if (dayType === 'corrido' || obstacle === 'tempo') {
    return MEAL_PLANS.practical;
  }

  // Prioridade 3: Ansiedade, doce, beliscar → plano saciante
  if (obstacle === 'ansiedade' || obstacle === 'doce' || obstacle === 'beliscar') {
    return MEAL_PLANS.satiating;
  }

  // Padrão: plano equilibrado
  return MEAL_PLANS.balanced;
};

/**
 * Retorna a refeição atual com base no horário
 */
export const getCurrentMeal = (meals) => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return meals.find(m => m.id === 'breakfast');
  if (hour >= 11 && hour < 15) return meals.find(m => m.id === 'lunch');
  if (hour >= 15 && hour < 18) return meals.find(m => m.id === 'snack');
  return meals.find(m => m.id === 'dinner');
};

/**
 * Retorna as calorias totais estimadas do plano
 */
export const getTotalCalories = (meals) =>
  meals.reduce((acc, m) => acc + m.calories, 0);
