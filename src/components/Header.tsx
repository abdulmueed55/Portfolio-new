import Link from "next/link";
import { getPrimaryMenu } from "@/lib/queries";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Locale } from "@/lib/i18n";

export async function Header({ locale }: { locale: Locale }) {
  // Falls back to an empty nav instead of crashing the page if WPGraphQL
  // isn't reachable yet (e.g. plugin not installed on WordPress).
  const menuItems = await getPrimaryMenu(locale).catch(() => []);

  return (
    <header className="border-b border-brand-lavender">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href={`/${locale}`} className="font-heading text-lg font-bold text-brand-navy">
          AIFOD
        </Link>
        <nav className="hidden gap-6 md:flex">
          {menuItems.map((item: any) => (
            <Link
              key={item.id}
              href={`/${locale}${item.path ?? "/"}`}
              className="text-sm font-medium text-brand-navy hover:text-brand-pink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <LanguageSwitcher current={locale} />
      </div>
    </header>
  );
}
