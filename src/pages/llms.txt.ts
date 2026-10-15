/** llms.txt (RECETTE §21), generated from the page registry. */
import { GUIDES, STATE_PAGES, stateId } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS, label } from '../i18n/nav';
export function GET() {
  const lines = [
    `# ${SITE_NAMES.en}`, '',
    `> Early retirement (FIRE) calculators for the United States that apply the rules on reaching retirement money before age 59½: the rule of 55 (50 for public safety), 72(t) substantially equal periodic payments under IRS Notice 2022-6 with the monthly 120 % mid-term AFR cap, the Roth conversion ladder and its five-year rule, governmental 457(b) plans, the 10 % additional tax and its exceptions, 2026 federal brackets (Rev. Proc. 2025-32), the ACA premium tax credit before Medicare (Rev. Procs. 2025-25 and 2026-26) and state tax on early withdrawals in states where the answer changes. Independent site published by Radif Partners; general information, not personal financial advice. Last updated ${LAST_UPDATED}.`, '',
    ...GROUPS.flatMap((g) => [`## ${g.label}`, ...GUIDES.filter((p) => p.group === g.id).map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`), '']),
    '## States', ...STATE_PAGES.map((s) => `- [${label(stateId(s.slug))}](${SITE_URL}${route(stateId(s.slug), 'en')}): ${s.intro}`), '',
    '## About', `- [How we calculate](${SITE_URL}${route('method', 'en')})`, `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
