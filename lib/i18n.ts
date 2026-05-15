import { cookies } from 'next/headers';
import { dictionaries, Locale, Dictionary } from './dictionaries';

export async function getDictionary(): Promise<Dictionary> {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value || 'en') as Locale;
  return dictionaries[locale] || dictionaries.en;
}

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return (cookieStore.get('NEXT_LOCALE')?.value || 'en') as Locale;
}
