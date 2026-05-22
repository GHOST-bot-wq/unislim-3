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

async function checkSpecificUser() {
  const email = 'lj445657@gmail.com';
  const password = 'Password123!'; // Senha padrão ou teste
  
  console.log(`\n--- TESTANDO LOGIN PARA O USUÁRIO DE TESTE: ${email} ---`);
  
  try {
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password: 'Password123!' // Caso o usuário teste com outra senha, tentamos a padrão
    });

    if (loginError) {
      console.error('❌ Erro no login:', loginError.message);
      
      // Se der credenciais inválidas, talvez a senha seja outra, mas tentamos verificar se o perfil dele existe fazendo select na tabela profiles diretamente (com a chave anon pode ser bloqueado pela RLS se não estivermos logados)
      console.log('Tentando buscar perfil sem estar logado...');
      const { data: profiles, error: profError } = await supabase
        .from('profiles')
        .select('*');
      if (profError) {
        console.error('❌ Erro ao buscar perfis na tabela profiles:', profError.message);
      } else {
        console.log('✅ Perfis encontrados no banco:', profiles);
      }
    } else {
      console.log('✅ Login realizado com sucesso!');
      console.log('User ID:', loginData.user.id);
      console.log('Confirmado em:', loginData.user.email_confirmed_at);
      
      // Buscar profile
      const { data: profile, error: profError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', loginData.user.id)
        .maybeSingle();
        
      if (profError) {
        console.error('❌ Erro ao buscar profile:', profError.message);
      } else {
        console.log('✅ Profile do usuário no banco:', profile);
      }
    }
  } catch (e) {
    console.error('Erro inesperado no teste:', e);
  }
}

checkSpecificUser();
