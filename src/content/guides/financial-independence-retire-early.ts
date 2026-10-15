import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.P.limits;
const E = K.P.early;
const MED = K.P.aca.medicareAge;
// Calculator set for this page: $45,000 a year, stops at 42, other defaults.
const t = K.tool('firenum', { spend: 45000, age: 42 });
const v = (i: number) => Number(t.rows[i][2]);
const classic = v(0), taxAdd = v(1), health = v(2), full = classic + taxAdd + health;
const yr = (sr: number) => K.yearsFromRate(sr, 0.05, 0.04);
const y25 = yr(0.25), y50 = yr(0.5), y65 = yr(0.65);
const yrs = (x: number | null) => (x === null ? 'over 80' : K.dec(Math.round(x * 10) / 10, 1));
const all50 = L.deferral + L.ira + L.hsaFamily;
// Saving the 401(k) and IRA limits plus $10,000 in a taxable account, from zero and from $100,000.
const save = L.deferral + L.ira + 10000;
const t0 = K.yearsTo(full, 0, save, 0.05), t100 = K.yearsTo(full, 100000, save, 0.05);

export default defineGuide({
  id: 'financial-independence-retire-early',
  group: 'fire',
  order: 15,
  slug: 'financial-independence-retire-early',
  nav: 'What FIRE means',
  card: 'The FIRE movement in practice: savings rate, 2026 account limits, saving order and the bridge to 59½',
  title: 'Financial Independence Retire Early 2026: The US Steps',
  description: `Financial independence, retire early (FIRE) in 2026: savings rate, ${K.usd(L.deferral)} 401(k) and ${K.usd(L.ira)} IRA limits, saving order, the bridge to 59½ and health to ${MED}.`,
  h1: 'Financial independence, retire early: what the FIRE movement asks of you in the United States',
  intro: 'Financial independence, retire early (FIRE) is the plan of saving a large share of income until investments can pay your spending, then choosing whether and how much to keep working.',
  resume: `Financial independence, retire early, or FIRE, is a movement built on one idea: save and invest a large share of income until the portfolio can pay your yearly spending, then make work optional. The target is usually set at 25 times spending, which matches a 4 % withdrawal rate. In the United States three things complicate it. Federal income tax applies to withdrawals from traditional 401(k)s and IRAs; most retirement accounts charge a ${K.pct(E.penalty, 0)} additional tax if you take money before 59½ without an exception; and health coverage has to be bought until Medicare at ${MED}. For ${K.usd(45000)} a year and a stop at 42, the plain target is ${K.usd(classic)}; with 2026 tax and premiums of ${K.usd(7200)} a year after any credit, it becomes ${K.usd(full)}. The 2026 limits allow ${K.usd(L.deferral)} in a 401(k), ${K.usd(L.ira)} in an IRA and up to ${K.usd(L.hsaFamily)} in a family HSA. The calculator above starts from that case.`,
  body: (h) => `
<h2>What the movement is, and what it is not</h2>
<p>FIRE grew out of personal finance blogs and forums. Its followers range from people who cut spending to the bone to high earners who simply save more than they spend. The common thread is the savings rate: the share of take-home pay that is invested rather than spent. A high rate works twice, because it builds the portfolio and shows you can live on less, which lowers the target. The "retire early" half is optional for many; plenty of people reach financial independence and keep working at something they choose.</p>
<p>It is not a promise of any particular outcome. Markets set the returns, the job market sets the income, and health can rewrite any plan. The numbers below are arithmetic on assumptions you can change, not forecasts.</p>
<h2>Step one: the savings rate sets the timeline</h2>
<p>If you spend everything you do not save, the savings rate decides both how fast the portfolio grows and how large it must become. That makes income nearly irrelevant to the timeline. At a 5 % real return and a 4 % withdrawal rate, starting from nothing, a 25 % savings rate takes about ${yrs(y25)} years, 50 % takes ${yrs(y50)} years and 65 % takes ${yrs(y65)} years.</p>
${h.table(['Savings rate', 'Years to financial independence'],
  [0.2, 0.3, 0.4, 0.5, 0.6, 0.7].map((s) => [K.pct(s, 0), yrs(yr(s))]),
  'Starting from zero, 5 % real return, 4 % withdrawal rate, spending equal to take-home pay minus savings. Computed by the site\'s engine.', ['l', 'r'])}
${h.mini('rate', { t: 'Already have two years of spending saved?', p: ['sr'], d: { sr: 45, bal: 2 } })}
<h2>Step two: the accounts and their 2026 limits</h2>
<p>American savers have tax-advantaged accounts with yearly caps. A 401(k), 403(b) or governmental 457(b) takes employee deferrals; an IRA, traditional or Roth, takes a smaller sum; a health savings account (HSA) is open to people covered by a high-deductible health plan. Above these, a regular taxable brokerage account has no cap.</p>
${h.table(['Account', '2026 limit'], [
  ['401(k), 403(b) or 457(b) employee deferral', K.usd(L.deferral)],
  ['Catch-up at 50 or older', K.usd(L.catchUp50)],
  ['Catch-up at ages 60 to 63 instead', K.usd(L.catchUp60to63)],
  ['IRA, traditional or Roth', K.usd(L.ira)],
  ['IRA catch-up at 50 or older', K.usd(L.iraCatchUp)],
  ['HSA, self-only coverage', K.usd(L.hsaSelf)],
  ['HSA, family coverage', K.usd(L.hsaFamily)],
  ['All contributions to one employer plan, employer share included', K.usd(L.annualAdditions)],
], 'Sources: IRS IR-2025-111 and Notice 2025-67 (plans and IRAs), Rev. Proc. 2025-19 (HSA).', ['l', 'r'])}
<p>A saver under 50 who uses a 401(k), an IRA and a family HSA can shelter ${K.usd(all50)} in 2026, before any employer match. Direct Roth IRA contributions phase out for single filers with modified adjusted gross income between ${K.usd(L.rothPhaseOut.single[0])} and ${K.usd(L.rothPhaseOut.single[1])}, and for joint filers between ${K.usd(L.rothPhaseOut.joint[0])} and ${K.usd(L.rothPhaseOut.joint[1])}.</p>
${h.mini('limits', { t: 'Your 2026 room, by age', p: ['age'], d: { age: 51, hsa: 'family' } })}
<h2>Step three: an order many savers follow</h2>
<p>There is no single right order, but a common sequence in FIRE circles runs like this. First, enough in the 401(k) to collect the full employer match, since that is money you would otherwise leave on the table. Next, the HSA if you have one, because it can be deducted going in and, for medical costs, tax-free coming out. Then an IRA, often Roth for its flexibility: Roth contributions can be taken back at any age with no tax or penalty. Then the rest of the 401(k) room. Last, a taxable account, which has no special tax break but no lock either.</p>
<p>For an early retiree that last point matters more than it seems. Money that sits only in pre-tax accounts is hard to reach before 59½, so some savers deliberately build a taxable account sooner than the usual order suggests, to fund the first years.</p>
<p>Put the first steps together. A saver who fills the 2026 401(k) and IRA limits and adds ${K.usd(10000)} to a taxable account invests ${K.usd(save)} a year. Starting from zero at a 5 % real return, that reaches the ${K.usd(full)} target of this page in about ${yrs(t0)} years; starting from ${K.usd(100000)}, in about ${yrs(t100)}. Whether that is early depends on the age you start, which is exactly why the movement talks about savings rates rather than ages.</p>
<h2>Step four: plan the bridge to 59½</h2>
<p>Stopping work at 42 leaves more than seventeen years before 401(k) and IRA money opens without the ${K.pct(E.penalty, 0)} additional tax. The usual sources for that gap are taxable savings, Roth IRA contributions, a governmental 457(b) (no additional tax at any age after leaving the employer), the ${h.a('rule-of-55', 'rule of 55')} for those who leave in or after the year they turn ${E.ruleOf55Age}, a ${h.a('72t-calculator', '72(t) series')} of equal payments, and a ${h.a('roth-conversion-ladder', 'Roth conversion ladder')}, where each converted amount can be withdrawn five years later. The ${h.a('early-retirement-bridge', 'bridge page')} orders them by age.</p>
<h2>Step five: health coverage until ${MED}</h2>
<p>Employer coverage ends with the job. COBRA can extend it for a limited time at nearly full cost, and the Marketplace sells individual plans with a premium tax credit that depends on income. Because early retirees control their taxable income through the mix of withdrawals, they can often keep it in the range where the credit is substantial. In the example above, ${K.usd(7200)} a year of premiums from 42 to ${MED} adds ${K.usd(health)} to the target, while the 2026 tax on withdrawals adds ${K.usd(taxAdd)}. The ${h.a('health-insurance-before-medicare', 'health insurance guide')} explains the credit. Social Security is left out of these figures.</p>
`,
  faqs: [
    { q: 'What does financial independence, retire early actually require?', a: `A portfolio large enough to pay your spending, usually 25 times the yearly budget at a 4 % withdrawal rate, plus a plan for tax, health coverage until ${MED} and access to retirement accounts before 59½. For ${K.usd(45000)} a year and a stop at 42, the target with 2026 tax and health premiums is ${K.usd(full)}.` },
    { q: 'How long does financial independence take at a 50 % savings rate?', a: `About ${yrs(y50)} years, starting from zero, at a 5 % return after inflation and a 4 % withdrawal rate. The savings rate matters more than income because it sets both what you invest and what you must replace. At 25 % the same model gives ${yrs(y25)} years.` },
    { q: 'How much can a FIRE saver put in tax-advantaged accounts in 2026?', a: `An employee under 50 can defer ${K.usd(L.deferral)} to a 401(k), 403(b) or 457(b) and contribute ${K.usd(L.ira)} to an IRA. An HSA adds ${K.usd(L.hsaSelf)} for self-only or ${K.usd(L.hsaFamily)} for family coverage. At 50 or older, catch-ups of ${K.usd(L.catchUp50)} and ${K.usd(L.iraCatchUp)} apply.` },
    { q: 'Can the FIRE movement work if all my money is in a 401(k)?', a: `It can, but the years before 59½ need a route around the ${K.pct(E.penalty, 0)} additional tax: the rule of 55 if you leave in or after the year you turn ${E.ruleOf55Age}, a 72(t) series of equal payments, or a Roth conversion ladder started five years ahead. A taxable account built alongside makes the first years simpler.` },
  ],
  tool: 'firenum',
  toolArg: { spend: 45000, age: 42 },
  related: ['fire-number-calculator', 'retirement-contribution-limits', 'early-retirement-bridge', 'roth-conversion-ladder', 'health-insurance-before-medicare', 'how-much-to-save-for-retirement'],
  sources: ['limits_2026', 'notice_2025_67', 'rp_2025_19', 'roth_iras', 'irs_exceptions'],
});
