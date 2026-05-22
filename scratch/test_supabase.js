import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Carrega .env manualmente
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let key = match[1].trim();
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[key] = value;
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runTest() {
  const testEmail = `testuser_${Math.random().toString(36).substring(2, 9)}@example.com`;
  const testPassword = 'Password123!';
  
  console.log(`\n--- TESTANDO FLUXO DE CADASTRO PARA: ${testEmail} ---`);
  
  try {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User Agent',
          age: 30,
          height: 1.80,
          current_weight: 80.0,
          goal_weight: 75.0,
          objective: 'lose_weight'
        }
      }
    });

    if (signUpError) {
      console.error('❌ Erro no signUp:', signUpError.message);
      return;
    }

    console.log('✅ Cadastro realizado!');
    console.log('User ID:', signUpData.user.id);
    console.log('Email confirmado no retorno do signUp?', signUpData.user.email_confirmed_at ? 'SIM' : 'NÃO');
    console.log('Sessão retornada no signUp?', signUpData.session ? 'SIM' : 'NÃO');

    const userId = signUpData.user.id;

    // Aguardar um pouco para garantir que as triggers rodaram no banco
    console.log('Aguardando 2 segundos para checar o banco...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verificar se o profile foi criado na tabela profiles
    console.log('\n--- VERIFICANDO PROFILE NO BANCO DE DADOS ---');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('❌ Erro ao buscar profile:', profileError.message);
    } else if (!profileData) {
      console.warn('⚠️ ATENÇÃO: Nenhum profile foi criado no banco para o novo usuário! Trigger on_auth_user_created falhou ou não existe.');
    } else {
      console.log('✅ Profile encontrado no banco:', profileData);
    }

    // Tentar fazer login com o usuário criado
    console.log('\n--- TESTANDO LOGIN DO NOVO USUÁRIO ---');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });

    if (loginError) {
      console.error('❌ Erro no login com o novo usuário:', loginError.message);
    } else {
      console.log('✅ Login realizado com sucesso! Token de acesso retornado.');
      console.log('Confirmado em:', loginData.user.email_confirmed_at);
      
      // Limpeza opcional: Como é teste, podemos deletar o profile se quisermos, mas a conta fica lá.
    }

  } catch (e) {
    console.error('Erro inesperado no teste:', e);
  }
}

runTest();
