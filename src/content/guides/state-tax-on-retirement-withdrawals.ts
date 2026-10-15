import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { STATES } from '../../lib/engine/states';

const keys = Object.keys(STATES).sort((a, b) => STATES[a].name.localeCompare(STATES[b].name));
const ca = K.S('california');
const fmtEx = (slug: string) => {
  const s = STATES[slug];
  if (s.rate.kind === 'none') return 'no income tax';
  if (!s.exclusions.length) return 'none';
  return s.exclusions.map((e) => `${e.minAge > 0 ? `from ${e.minAge === 59.5 ? '59½' : e.minAge}` : 'any age'}${e.maxAge ? ` to ${e.maxAge}` : ''}: ${e.amount ? K.usd(e.amount) : 'all'}`).join('; ');
};
const rate = (slug: string) => { const r = STATES[slug].rate; return r.kind === 'flat' && r.flat ? K.pct(r.flat, 2) : r.kind === 'none' ? 'none' : 'graduated'; };
// $40,000 withdrawn at 52 with the federal 10 % due, in each state with a flat rate on file.
const at52 = (slug: string) => K.stateTax(slug, 40000, 52, 0, true);
const at56 = (slug: string) => K.stateTax(slug, 40000, 56, 0, false);

export default defineGuide({
  id: 'state-tax-on-retirement-withdrawals',
  group: 'tax',
  order: 52,
  slug: 'state-tax',
  nav: 'State tax on early withdrawals',
  card: 'Eleven states compared, plus the ones with no income tax',
  title: 'State Tax on 401(k) Early Withdrawals 2026: Rules by State',
  description: `State tax on early 401(k) and IRA withdrawals in 2026: California adds ${K.pct(ca.earlyPenalty ?? 0, 1)}, Illinois exempts them at any age, Iowa from 55. Eleven states compared here.`,
  h1: 'State tax on early 401(k) and IRA withdrawals, state by state',
  intro: 'The federal rules are the same everywhere; the state bill on the same withdrawal ranges from nothing to a second penalty, depending on where you live and how old you are.',
  resume: `Most states start from federal adjusted gross income, so a 401(k) or IRA withdrawal is taxed again at the state rate. What changes from one state to another is what they subtract and at what age. Illinois subtracts payouts from qualified plans and IRAs at any age, early ones included. Iowa excludes retirement income entirely from the year you are 55 on December 31. Colorado subtracts up to ${K.usd(20000)} a person from 55, New York up to ${K.usd(20000)} only after 59½, Georgia from 62, New Jersey from 62 with an income limit. Pennsylvania and Mississippi exempt retirement income only once the plan's retirement conditions are met, so an early payout is taxable. California goes the other way and adds a ${K.pct(ca.earlyPenalty ?? 0, 1)} tax of its own on early distributions, on top of the federal ${K.pct(K.P.early.penalty, 0)}. Washington, Texas, Florida, Nevada, South Dakota and Alaska tax neither wages nor withdrawals. The calculator above applies each rule as we read it on the state's revenue department site.`,
  body: (h) => `
<h2>Eleven states where age changes the answer</h2>
<p>We chose the states where the treatment of an early withdrawal differs from a plain "taxed like wages": an exclusion that starts at a given age, a rule tied to the federal penalty, a state penalty, or no income tax at all with a separate tax on investment gains. Each rule below was read on the state's own site; the source and the tax year are on each state page.</p>
${h.table(['State', 'Exclusion of retirement payouts', 'Early payout (before 59½)', 'Rate on file'], keys.map((k) => [h.a(`state:${k}`, STATES[k].name), fmtEx(k), STATES[k].earlyPenalty ? `taxed + ${K.pct(STATES[k].earlyPenalty!, 1)} state tax` : STATES[k].rate.kind === 'none' ? 'not taxed' : STATES[k].exclusions.some((e) => e.minAge === 0 && !e.noPenaltyOnly) ? 'excluded' : 'taxed', rate(k)]), 'Read on state revenue department sites, October 15, 2026. "Graduated": brackets not reproduced here; type your own rate in the calculator.', ['l', 'l', 'l', 'r'])}
<h2>Same withdrawal, same age, different states</h2>
<p>Take ${K.usd(40000)} from an old 401(k) at 52, with the federal ${K.pct(K.P.early.penalty, 0)} due. In Illinois the state subtracts it: ${K.usd(at52('illinois').total)} of state tax. In Iowa, which waits until 55, it is taxed at the flat rate: ${K.usd(at52('iowa').total)}. In Pennsylvania, where an early payout is taxable above the contributions already taxed, up to ${K.usd(at52('pennsylvania').total)} at ${K.pct(K.S('pennsylvania').rate.flat ?? 0, 2)}. In Georgia, before 62, ${K.usd(at52('georgia').total)}. Four years later, at 56 and under the rule of 55, the Iowa bill drops to ${K.usd(at56('iowa').total)} while the Georgia bill does not change. California's own early-distribution tax alone is ${K.usd(at52('california').early)} on that withdrawal, before its income tax.</p>
${h.mini('state', { t: 'The same withdrawal in another state', p: ['sx', 'age'], d: { sx: 'iowa', amt: 40000, age: 54 } })}
<h2>States without an individual income tax</h2>
<p>Six states that we could confirm on their own official sites impose no individual income tax in 2026: ${K.NO_TAX.list.map((x) => x.name).join(', ')}. A withdrawal there costs only the federal tax and, before 59½ without an exception, the federal ${K.pct(K.P.early.penalty, 0)}. Washington taxes large long-term capital gains through a separate excise, but money in 401(k), 403(b), 457(b) and IRA accounts is exempt from it; the ${h.a('state:washington', 'Washington page')} gives the threshold and the income tax voted for 2028. New Hampshire, Tennessee and Wyoming are often listed with them; their revenue sites could not be read when this page was written, so we do not state their rules here.</p>
<h2>How states read the federal penalty</h2>
<p>Several states tie their exclusion to the federal treatment. Colorado and South Carolina leave out a distribution that the IRS treats as premature; Pennsylvania exempts an IRA payout only when no federal early-withdrawal penalty applies; Mississippi taxes a distribution reported on federal Form 5329. In those states an exception to the federal ${K.pct(K.P.early.penalty, 0)}, such as the ${h.a('rule-of-55', 'rule of 55')} or a ${h.a('72t-calculator', '72(t) series')}, can also change the state bill. The calculator has a "Federal 10 % applies" switch for that reason.</p>
<h2>Exclusions per person, not per household</h2>
<p>Where a state caps its exclusion, the cap usually applies to each spouse on that spouse's own retirement income. Colorado computes its subtraction separately for each spouse; Georgia's exclusion is per person, and each spouse must qualify on age; New York's ${K.usd(20000)} applies to each spouse who is 59½ and receives qualifying payments. A couple therefore gets the most from these exclusions when both have retirement accounts in their own name. New Jersey works differently: its retirement exclusion is a household cap that depends on the filing status, and it disappears when New Jersey income passes ${K.usd(150000)}. Two rules of thumb follow. First, a withdrawal taken from the older spouse's IRA may be excluded when the same amount from the younger spouse's IRA is not. Second, the age that counts is often the age at the end of the tax year, as in Iowa (December 31), so a withdrawal in January of the year you turn 55 can already qualify there. The state pages give the exact wording each state uses.</p>
<h2>Moving before the withdrawal years</h2>
<p>A withdrawal is generally taxed by the state where you live when you receive it, which is why some early retirees time a move before their largest withdrawal or conversion years. A move is a life decision, not a tax trick: property tax, sales tax and the cost of health insurance differ just as much, and residency rules are strict about where you really live. The state pages give the facts for each state; they do not recommend one.</p>
<h2>What the comparison leaves out</h2>
<ul>
<li>Graduated rates: for California, New York, New Jersey, Colorado and South Carolina, type your own marginal rate; the 2026 brackets of several of them were not yet published when we read their sites.</li>
<li>Local income taxes, such as those of some cities and counties.</li>
<li>States not listed: their rule is usually "taxed like wages", but we only publish what we have read on the state's own site.</li>
</ul>
<p>Federal tax on the same withdrawal is on the ${h.a('tax-on-401k-withdrawal', '401(k) withdrawal tax page')}.</p>
`,
  faqs: [
    { q: 'Which states do not tax 401(k) withdrawals before 59½?', a: `Among the states covered here, Illinois subtracts qualified plan and IRA payouts at any age, early ones included, and Iowa excludes them from the year you are 55. ${K.NO_TAX.list.map((x) => x.name).join(', ')} have no individual income tax in 2026. Elsewhere, an early withdrawal is usually taxed like wages.` },
    { q: 'Does any state add its own penalty on early IRA withdrawals?', a: `California does: ${K.pct(ca.earlyPenalty ?? 0, 1)} of the taxable part of an early distribution, figured on form FTB 3805P, on top of the federal ${K.pct(K.P.early.penalty, 0)}. California does not follow every federal exception, so a withdrawal exempt from the federal penalty can still owe the state one.` },
    { q: 'Does the rule of 55 also lower my state tax on early withdrawals?', a: 'In some states. Colorado, South Carolina, Pennsylvania and Mississippi look at whether the federal early-withdrawal penalty applies, so a payout covered by the rule of 55 can qualify for their exclusion if you meet the age. Iowa excludes payouts from 55 anyway; Georgia and New York ignore it and wait for 62 and 59½.' },
    { q: 'Why are some states missing from the early withdrawal comparison?', a: 'We list only rules we have read on the state revenue department site, with the date. States where an early withdrawal is simply taxed like wages are not listed one by one, and for New Hampshire, Tennessee and Wyoming the official pages could not be read when we checked, so we state nothing about them.' },
  ],
  tool: 'state',
  related: ['state:california', 'state:illinois', 'state:iowa', 'state:washington', 'tax-on-401k-withdrawal', 'rule-of-55'],
  sources: ['irs_exceptions', 'rp_2025_32'],
});
