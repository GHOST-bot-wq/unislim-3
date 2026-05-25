import { createClient } from '@supabase/supabase-js';

// Sanitização robusta para evitar aspas ou espaços que possam quebrar a conexão
let supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
let supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

if (supabaseUrl.startsWith('"') && supabaseUrl.endsWith('"')) {
  supabaseUrl = supabaseUrl.slice(1, -1).trim();
} else if (supabaseUrl.startsWith("'") && supabaseUrl.endsWith("'")) {
  supabaseUrl = supabaseUrl.slice(1, -1).trim();
}

if (supabaseAnonKey.startsWith('"') && supabaseAnonKey.endsWith('"')) {
  supabaseAnonKey = supabaseAnonKey.slice(1, -1).trim();
} else if (supabaseAnonKey.startsWith("'") && supabaseAnonKey.endsWith("'")) {
  supabaseAnonKey = supabaseAnonKey.slice(1, -1).trim();
}

// Função auxiliar para validar se o token tem o formato de um JWT (padrão em chaves do Supabase)
const isValidJWT = (token) => {
  if (!token) return false;
  return token.split('.').length === 3;
};

// Verifica se as credenciais do Supabase parecem válidas e se a chave anon é um JWT válido
const isConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') && 
  !supabaseAnonKey.includes('your-anon-key') &&
  isValidJWT(supabaseAnonKey);

if (supabaseAnonKey && !isValidJWT(supabaseAnonKey)) {
  console.warn(
    '⚠️ [Supabase Connection] A chave anônima fornecida (VITE_SUPABASE_ANON_KEY) não é um JWT válido do Supabase. O aplicativo usará o modo Mock para evitar falhas.'
  );
}

console.log('🔌 [Supabase Connection] Tentando inicializar o cliente...');
console.log('🔌 [Supabase Connection] SUPABASE URL:', supabaseUrl || 'NÃO CONFIGURADA');
console.log('🔌 [Supabase Connection] KEY MASCARADA:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 15)}...` : 'NÃO CONFIGURADA');

let supabaseInstance = null;

if (isConfigured) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    console.log('⚡ SUPABASE CONNECTED - Conexão ativa com o banco em nuvem.');
  } catch (error) {
    console.error('❌ Falha ao inicializar o Supabase:', error);
  }
}

if (!supabaseInstance) {
  console.warn(
    '⚠️ Supabase não configurado ou chaves inválidas. O UniSlim está rodando em modo Mock Premium (dados salvos no LocalStorage).'
  );
  
  // Criar um mock elegante do Supabase client para o app não quebrar
  supabaseInstance = {
    auth: {
      getSession: async () => {
        const sessionJson = localStorage.getItem('unislim_mock_session');
        const session = sessionJson ? JSON.parse(sessionJson) : null;
        return { data: { session }, error: null };
      },
      onAuthStateChange: (callback) => {
        const handleStorageChange = () => {
          const sessionJson = localStorage.getItem('unislim_mock_session');
          const session = sessionJson ? JSON.parse(sessionJson) : null;
          callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
        };
        window.addEventListener('storage', handleStorageChange);
        // Disparar inicialmente
        setTimeout(handleStorageChange, 50);
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                window.removeEventListener('storage', handleStorageChange);
              }
            }
          }
        };
      },
      signInWithPassword: async ({ email, password }) => {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simula latência de rede
        
        // Verifica se o usuário existe no localStorage
        const users = JSON.parse(localStorage.getItem('unislim_mock_users') || '[]');
        const cleanEmail = email.trim().toLowerCase();
        const user = users.find(u => u.email.trim().toLowerCase() === cleanEmail && u.password === password);
        
        if (!user) {
          return { data: { user: null, session: null }, error: { message: 'E-mail ou senha inválidos.' } };
        }
        
        const session = {
          access_token: 'mock-token-' + Date.now(),
          user: {
            id: user.id,
            email: user.email,
            user_metadata: user.user_metadata
          }
        };
        
        localStorage.setItem('unislim_mock_session', JSON.stringify(session));
        // Força atualização da auth
        window.dispatchEvent(new Event('storage'));
        
        return { data: { user: session.user, session }, error: null };
      },
      signUp: async ({ email, password, options }) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const users = JSON.parse(localStorage.getItem('unislim_mock_users') || '[]');
        const cleanEmail = email.trim().toLowerCase();
        if (users.find(u => u.email.trim().toLowerCase() === cleanEmail)) {
          return { data: { user: null }, error: { message: 'Este e-mail já está cadastrado.' } };
        }
        
        const userId = 'mock-uid-' + Math.random().toString(36).substr(2, 9);
        const newUser = {
          id: userId,
          email,
          password,
          user_metadata: options?.data || {}
        };
        
        users.push(newUser);
        localStorage.setItem('unislim_mock_users', JSON.stringify(users));
        
        // Cria automaticamente o profile correspondente no mock
        const profiles = JSON.parse(localStorage.getItem('unislim_mock_profiles') || '{}');
        profiles[userId] = {
          id: userId,
          created_at: new Date().toISOString(),
          full_name: options?.data?.full_name || email.split('@')[0],
          avatar_url: options?.data?.avatar_url || '',
          theme: 'calm',
          streak_days: 0
        };
        localStorage.setItem('unislim_mock_profiles', JSON.stringify(profiles));
        
        // Login automático após cadastro
        const session = {
          access_token: 'mock-token-' + Date.now(),
          user: {
            id: userId,
            email,
            user_metadata: newUser.user_metadata
          }
        };
        
        localStorage.setItem('unislim_mock_session', JSON.stringify(session));
        window.dispatchEvent(new Event('storage'));
        
        return { data: { user: session.user, session }, error: null };
      },
      signOut: async () => {
        localStorage.removeItem('unislim_mock_session');
        window.dispatchEvent(new Event('storage'));
        return { error: null };
      }
    },
    // Mock simples do Database query builder
    from: (table) => {
      const getSessionUser = () => {
        const sessionJson = localStorage.getItem('unislim_mock_session');
        const session = sessionJson ? JSON.parse(sessionJson) : null;
        return session?.user;
      };

      const getTableData = () => {
        try {
          return JSON.parse(localStorage.getItem(`unislim_mock_${table}`) || '[]');
        } catch {
          return [];
        }
      };

      const saveTableData = (data) => {
        localStorage.setItem(`unislim_mock_${table}`, JSON.stringify(data));
      };

      // Query Builder Mock
      const query = {
        select: (columns = '*') => {
          query._action = 'select';
          return query;
        },
        insert: (rows) => {
          query._action = 'insert';
          query._payload = rows;
          return query;
        },
        update: (values) => {
          query._action = 'update';
          query._payload = values;
          return query;
        },
        delete: () => {
          query._action = 'delete';
          return query;
        },
        upsert: (rows) => {
          query._action = 'upsert';
          query._payload = rows;
          return query;
        },
        eq: (col, val) => {
          query._filters = query._filters || [];
          query._filters.push({ col, val, op: 'eq' });
          return query;
        },
        order: (col, { ascending = true } = {}) => {
          query._sort = { col, ascending };
          return query;
        },
        single: () => {
          query._single = true;
          return query;
        },
        maybeSingle: () => {
          query._maybeSingle = true;
          return query;
        },
        // Executores
        then: async (resolve, reject) => {
          try {
            const user = getSessionUser();
            if (!user && table !== 'profiles') {
              resolve({ data: null, error: { message: 'Não autorizado.' } });
              return;
            }

            const data = getTableData();
            let result = null;
            let error = null;

            // Filtros básicos com tratamento resiliente para não-iteráveis
            let filtered = Array.isArray(data) ? [...data] : [];
            
            // Tratamento especial para tabelas de dicionário de chaves (ex: profiles pode ser armazenado como dict ou list)
            if (table === 'profiles') {
              const profilesDict = JSON.parse(localStorage.getItem('unislim_mock_profiles') || '{}');
              filtered = Object.values(profilesDict);
            }

            if (query._filters) {
              for (const f of query._filters) {
                filtered = filtered.filter(row => row[f.col] === f.val);
              }
            }

            if (query._sort) {
              const { col, ascending } = query._sort;
              filtered.sort((a, b) => {
                if (a[col] < b[col]) return ascending ? -1 : 1;
                if (a[col] > b[col]) return ascending ? 1 : -1;
                return 0;
              });
            }

            if (query._action === 'select') {
              if (query._single || query._maybeSingle) {
                result = filtered[0] || null;
              } else {
                result = filtered;
              }
            } else if (query._action === 'insert') {
              const payload = Array.isArray(query._payload) ? query._payload : [query._payload];
              const toInsert = payload.map(item => ({
                id: item.id || 'mock-id-' + Math.random().toString(36).substr(2, 9),
                created_at: new Date().toISOString(),
                user_id: user?.id,
                ...item
              }));
              
              if (table === 'profiles') {
                const profilesDict = JSON.parse(localStorage.getItem('unislim_mock_profiles') || '{}');
                toInsert.forEach(p => {
                  profilesDict[p.id] = p;
                });
                localStorage.setItem('unislim_mock_profiles', JSON.stringify(profilesDict));
              } else {
                const newData = [...data, ...toInsert];
                saveTableData(newData);
              }
              result = query._single || query._maybeSingle ? toInsert[0] : toInsert;
            } else if (query._action === 'update') {
              // Atualiza linhas correspondentes
              let updatedCount = 0;
              
              if (table === 'profiles') {
                const profilesDict = JSON.parse(localStorage.getItem('unislim_mock_profiles') || '{}');
                // Encontrar o id no filtro
                const idFilter = query._filters?.find(f => f.col === 'id')?.val;
                if (idFilter && profilesDict[idFilter]) {
                  profilesDict[idFilter] = { ...profilesDict[idFilter], ...query._payload };
                  localStorage.setItem('unislim_mock_profiles', JSON.stringify(profilesDict));
                  result = profilesDict[idFilter];
                  updatedCount = 1;
                }
              } else {
                const updatedData = data.map(row => {
                  let match = true;
                  if (query._filters) {
                    for (const f of query._filters) {
                      if (row[f.col] !== f.val) match = false;
                    }
                  }
                  if (match) {
                    updatedCount++;
                    return { ...row, ...query._payload };
                  }
                  return row;
                });
                
                if (updatedCount > 0) {
                  saveTableData(updatedData);
                  result = query._payload;
                }
              }
              
              if (updatedCount === 0) {
                error = { message: 'Nenhum registro encontrado para atualização.' };
              }
            } else if (query._action === 'upsert') {
              const payload = Array.isArray(query._payload) ? query._payload : [query._payload];
              
              if (table === 'profiles') {
                const profilesDict = JSON.parse(localStorage.getItem('unislim_mock_profiles') || '{}');
                payload.forEach(item => {
                  const key = item.id || user?.id;
                  profilesDict[key] = {
                    id: key,
                    created_at: new Date().toISOString(),
                    ...profilesDict[key],
                    ...item
                  };
                });
                localStorage.setItem('unislim_mock_profiles', JSON.stringify(profilesDict));
                result = payload;
              } else {
                // Upsert genérico baseado no id ou user_id + created_at (para daily_logs)
                const currentData = [...data];
                const upserted = payload.map(item => {
                  let existingIndex = -1;
                  if (item.id) {
                    existingIndex = currentData.findIndex(r => r.id === item.id);
                  } else if (item.user_id && item.created_at) {
                    existingIndex = currentData.findIndex(r => r.user_id === item.user_id && r.created_at === item.created_at);
                  }
                  
                  const row = {
                    id: item.id || 'mock-id-' + Math.random().toString(36).substr(2, 9),
                    created_at: new Date().toISOString(),
                    user_id: user?.id,
                    ...item
                  };
                  
                  if (existingIndex > -1) {
                    currentData[existingIndex] = { ...currentData[existingIndex], ...row };
                  } else {
                    currentData.push(row);
                  }
                  return row;
                });
                saveTableData(currentData);
                result = query._single || query._maybeSingle ? upserted[0] : upserted;
              }
            }

            resolve({ data: result, error });
          } catch (e) {
            resolve({ data: null, error: { message: e.message } });
          }
        }
      };
      return query;
    },
    // Mock do Storage
    storage: {
      from: (bucket) => ({
        upload: async (filePath, file, options) => {
          await new Promise(resolve => setTimeout(resolve, 800)); // Latência de rede simulada rápida
          
          try {
            // Cria uma URL de Blob em memória para visualização instantânea sem estourar o LocalStorage
            const blobUrl = URL.createObjectURL(file);
            const fileKey = `${bucket}_${filePath}`;
            
            // Armazena a Blob URL em memória global para recuperação nesta sessão
            window.unislim_mock_files = window.unislim_mock_files || {};
            window.unislim_mock_files[fileKey] = blobUrl;
            
            // Tenta salvar no localStorage para persistência parcial apenas se for menor que 500KB
            if (file.size < 500000) {
              const reader = new FileReader();
              reader.onloadend = () => {
                try {
                  localStorage.setItem(`unislim_mock_file_${fileKey}`, reader.result);
                } catch (e) {
                  console.warn('⚠️ [Supabase Mock] LocalStorage cheio, ignorando persistência offline para este arquivo.');
                }
              };
              reader.readAsDataURL(file);
            }
            
            return {
              data: { path: filePath },
              error: null
            };
          } catch (err) {
            return {
              data: null,
              error: { message: err.message || 'Erro ao carregar o arquivo.' }
            };
          }
        },
        getPublicUrl: (filePath) => {
          const fileKey = `${bucket}_${filePath}`;
          
          // Tenta pegar primeiro da memória (Blob URL temporária ativa nesta sessão)
          if (window.unislim_mock_files && window.unislim_mock_files[fileKey]) {
            return { data: { publicUrl: window.unislim_mock_files[fileKey] } };
          }
          
          // Tenta pegar do localStorage
          const dataUrl = localStorage.getItem(`unislim_mock_file_${fileKey}`);
          if (dataUrl) {
            return { data: { publicUrl: dataUrl } };
          }
          
          // Fallback para caminhos legados
          const fallbackKey = `avatars_${filePath}`;
          const fallbackData = localStorage.getItem(`unislim_mock_file_${fallbackKey}`);
          if (fallbackData) {
            return { data: { publicUrl: fallbackData } };
          }
          
          // Retorna URL de imagem placeholder dependendo do caminho/bucket
          if (filePath.includes('avatar') || bucket === 'avatars') {
            return { data: { publicUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80` } };
          }
          return { data: { publicUrl: `https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&auto=format&fit=crop&q=80` } };
        }
      })
    }
  };
}

export const supabase = supabaseInstance;
export default supabase;
