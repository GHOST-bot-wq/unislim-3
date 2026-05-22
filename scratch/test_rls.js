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

async function runRlsTest() {
  const testEmail = `rlsuser_${Math.random().toString(36).substring(2, 9)}@example.com`;
  const testPassword = 'Password123!';
  
  console.log(`\n--- INICIANDO TESTE DE RLS PARA USUÁRIO: ${testEmail} ---`);
  
  try {
    // 1. Cadastrar usuário sem metadados para que a trigger do banco opcionalmente não crie perfil (ou crie com padrões)
    console.log('1. Cadastrando usuário...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword
    });

    if (signUpError) {
      console.error('❌ Erro no signUp:', signUpError.message);
      return;
    }

    const userId = signUpData.user.id;
    console.log('✅ Usuário cadastrado! ID:', userId);

    // 2. Tentar buscar perfil. Se a trigger do banco criou, deve retornar o perfil.
    console.log('2. Buscando perfil (SELECT)...');
    const { data: profileSelect, error: selectError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (selectError) {
      console.error('❌ Erro no SELECT do perfil:', selectError.message);
    } else {
      console.log('✅ SELECT efetuado com sucesso! Perfil retornado:', profileSelect);
    }

    // 3. Tentar fazer UPSERT/UPDATE no perfil
    console.log('3. Atualizando perfil (UPSERT)...');
    const { data: profileUpsert, error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: 'RLS Test User',
        current_weight: 82.5,
        goal_weight: 78.0,
        objective: 'lose_weight',
        theme: 'calm',
        streak_days: 1
      });

    if (upsertError) {
      console.error('❌ Erro no UPSERT do perfil:', upsertError.message);
    } else {
      console.log('✅ UPSERT efetuado com sucesso!');
    }

    // 4. Buscar novamente para ver se foi atualizado
    console.log('4. Re-buscando perfil para confirmar atualização...');
    const { data: profileUpdated, error: selectUpdatedError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (selectUpdatedError) {
      console.error('❌ Erro no SELECT pós-atualização:', selectUpdatedError.message);
    } else {
      console.log('✅ Perfil após atualização:', profileUpdated);
    }

  } catch (e) {
    console.error('Erro inesperado no teste de RLS:', e);
  }
}

runRlsTest();
