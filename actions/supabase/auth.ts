'use server';

import { supabase } from '@/services/supabase/client';

export async function signup({ email, password, name, phone, avatar }: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  avatar?: string;
}) {
  const { data, error } = await supabase.functions.invoke('signup', {
    body: { email, password, name, phone, avatar },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function login({ email, password }: {
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.functions.invoke('login', {
    body: { email, password },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function verifyEmail({ email, pin }: {
  email: string;
  pin: string;
}) {
  const { data, error } = await supabase.functions.invoke('verify_email', {
    body: { email, pin },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function sendPin({ email }: {
  email: string;
}) {
  const { data, error } = await supabase.functions.invoke('send_pin', {
    body: { email },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function getUser({ access_token }: {
  access_token: string;
}) {
  const { data, error } = await supabase.functions.invoke('get_user', {
    body: { access_token },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function resetPassword({ email, pin, new_password }: {
  email: string;
  pin: string;
  new_password: string;
}) {
  const { data, error } = await supabase.functions.invoke('reset_password', {
    body: { email, pin, new_password },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function updateUser({ access_token, name, phone, avatar }: {
  access_token: string;
  name?: string;
  phone?: string;
  avatar?: string;
}) {
  const { data, error } = await supabase.functions.invoke('update_user', {
    body: { access_token, name, phone, avatar },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function changePassword({ access_token, current_password, new_password }: {
  access_token: string;
  current_password: string;
  new_password: string;
}) {
  const { data, error } = await supabase.functions.invoke('change_password', {
    body: { access_token, current_password, new_password },
  });
  if (error) throw new Error(error.message);
  return data;
}
