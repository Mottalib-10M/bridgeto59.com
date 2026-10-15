import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.P.early;
const pen = K.pct(E.penalty, 0);
const X = K.P.exceptions;
const cap = (id: string) => X.find((x) => x.id === id)?.cap ?? 0;
const PLANNING = ['separation55', 'sepp'];
const IMPOSED = ['qdro', 'levy'];
const use = (id: string) => (PLANNING.includes(id) ? 'retirement plan' : IMPOSED.includes(id) ? 'imposed by a court or the IRS' : 'life event');
// The IRS table marks IRAs "n/a" for terminal illness, while Publication 590-B (2025) lists it among the IRA exceptions.
const iraCell = (x: (typeof X)[number]) => (x.id === 'terminal' ? 'in Pub. 590-B, not in the IRS table' : x.ira ? 'yes' : 'no');
const both = X.filter((x) => x.plan && x.ira && x.id !== 'terminal').length;
// Partial coverage: single filer, $60,000 of salary, 401(k) of a former employer.
const part = [
  { what: 'Birth of one child', id: 'birth', amt: 14000, age: 36 },
  { what: 'Emergency personal expense', id: 'emergency', amt: 2500, age: 44 },
  { what: 'Federally declared disaster', id: 'disaster', amt: 30000, age: 47 },
  { what: 'Domestic abuse victim', id: 'abuse', amt: 16000, age: 41 },
].map((p) => ({ ...p, r: K.early({ amount: p.amt, age: p.age, account: 'oldPlan', exception: p.id, status: 'single', otherIncome: 60000 }) }));
const [pBirth, pEmerg, pDis] = part;
const sepp55 = K.early({ amount: 36000, age: 52, account: 'oldPlan', exception: 'sepp', status: 'joint', otherIncome: 0 });
const none55 = K.early({ amount: 36000, age: 52, account: 'oldPlan', status: 'joint', otherIncome: 0 });

export default defineGuide({
  id: 'early-withdrawal-penalty-exceptions',
  group: 'access',
  order: 28,
  slug: 'early-withdrawal-penalty-exceptions',
  nav: 'Penalty exceptions',
  card: `Every way out of the ${pen} before 59½, plan by plan, with caps and code sections`,
  title: 'Early Withdrawal Penalty Exceptions 2026: Plan vs IRA List',
  description: `Early withdrawal penalty exceptions for 2026: the ${X.length} main IRS cases for a 401(k) or an IRA, with cap and code section, from the rule of 55 to ${K.usd(cap('birth'))} a birth.`,
  h1: `Early withdrawal penalty exceptions: every way out of the ${pen}`,
  intro: `The ${pen} additional tax has more than a dozen exceptions, but only two of them can carry an early retirement; the rest answer one event at a time.`,
  resume: `Section 72(t)(2) of the tax code lists the cases in which a withdrawal before 59½ escapes the ${pen} additional tax; income tax stays due in every one of them. The table on this page covers the ${X.length} exceptions most people ask about, with the account they apply to, the cap and the code section, as published in the IRS exceptions table updated in December 2025. Only two serve a planned early retirement: the rule of 55 (separation from service in or after the year you turn ${E.ruleOf55Age}, ${E.publicSafetyAge} for qualified public safety employees), which works only in an employer plan, and a 72(t) series of substantially equal payments, which works in both. The others follow a life event and many are capped: ${K.usd(cap('birth'))} per child for a birth or adoption, ${K.usd(cap('emergency'))} a year for an emergency expense, ${K.usd(cap('homebuyer'))} for a first home from an IRA, ${K.usd(cap('disaster'))} after a federally declared disaster. Above a cap, the ${pen} applies to the rest.`,
  body: (h) => `
<h2>The full table, account by account</h2>
<p>The IRS publishes one table with two columns that matter: qualified plans such as a 401(k) or 403(b), and IRAs, which include SEP, SIMPLE IRA and SARSEP accounts (${h.src('irs_exceptions', 'IRS exceptions table')}). Of the exceptions below, ${both} work in both; the others belong to one side only. The last column is this site's reading of what each exception is for.</p>
${h.table(['Exception', '401(k) or 403(b)', 'IRA', 'Cap', 'IRC section', 'Serves'],
  X.map((x) => [x.label, x.plan ? 'yes' : 'no', iraCell(x), x.cap ? K.usd(x.cap) : 'none', x.code || '401(k)(2)(B)(i)(I) in the IRS table', use(x.id)]),
  'IRS, Retirement topics: exceptions to tax on early distributions, updated December 11, 2025; Publication 575 (2025). Caps are per the IRS table; the domestic abuse cap is the lesser of the amount shown and 50 % of the account, the emergency cap one distribution per calendar year.', ['l', 'l', 'l', 'r', 'l', 'l'])}
<h2>The two that can carry an early retirement</h2>
<p>A planned retirement before 59½ needs an exception that keeps working year after year, without an event to prove. Only two do. The rule of 55 opens the plan of the employer you leave in or after the calendar year you turn ${E.ruleOf55Age}; for qualified public safety employees the age is ${E.publicSafetyAge}, or ${E.publicSafetyYearsOfService} years of service under the plan, as the ${h.a('rule-of-55-public-safety', 'public safety page')} details. It never applies to an IRA. A series of substantially equal periodic payments under section 72(t)(2)(A)(iv) works from an IRA at any age, and from a plan once you have left that employer, but it locks the yearly amount until the later of five years and 59½.</p>
<p>The difference is large. A 52-year-old couple with no other income who take ${K.usd(36000)} a year from an old 401(k) owe ${K.usd(none55.penalty)} of additional tax each year without an exception. If ${K.usd(36000)} is what a 72(t) series produces on the account they use, the same amount owes ${K.usd(sepp55.penalty)}, and the income tax, about ${K.usd(sepp55.federal)} on a joint return, is identical. The ${h.a('72t-calculator', '72(t) calculator')} sizes the series, and the ${h.a('early-retirement-bridge', 'bridge page')} combines it with other accounts.</p>
${h.mini('exceptions', { t: 'Does your situation reach this account?', p: ['ex', 'acc'], d: { ex: 'sepp', acc: 'oldPlan', amt: 36000, age: 52 } })}
<h2>Life events, and where the cap bites</h2>
<p>Most exceptions answer one event and cover a limited amount. When the withdrawal is larger than the cap, the ${pen} applies only to the part above it. The engine applies the caps of the IRS table:</p>
${h.table(['Event', 'Withdrawal', 'Covered by the exception', `${pen} on the rest`], part.map((p) => [p.what, K.usd(p.amt), K.usd(p.amt - p.r.penalized), K.usd(p.r.penalty)]),
  'Single filer, $60,000 of salary, 401(k) of a former employer. Income tax is due on the whole withdrawal in every case.', ['l', 'r', 'r', 'r'])}
<p>For a birth, ${K.usd(pBirth.amt)} taken from a 401(k) leaves ${K.usd(pBirth.r.penalized)} exposed and ${K.usd(pBirth.r.penalty)} of additional tax; the ${K.usd(cap('birth'))} is per child, so twins double it. The emergency exception allows one distribution per calendar year, up to the lesser of ${K.usd(cap('emergency'))} or the vested balance above ${K.usd(cap('emergency'))}, so ${K.usd(pEmerg.amt)} leaves ${K.usd(pEmerg.r.penalty)} to pay. After a federally declared disaster where you live, ${K.usd(cap('disaster'))} is covered for qualified individuals who suffer an economic loss; on ${K.usd(pDis.amt)} the rest owes ${K.usd(pDis.r.penalty)}. The domestic abuse exception covers the lesser of ${K.usd(cap('abuse'))} or half the account.</p>
<p>Three exceptions have conditions rather than caps. Disability means, in the words of Publication 575, that you cannot do any substantial gainful activity because of a physical or mental condition that a physician determines can be expected to result in death or to be of long, continued or indefinite duration (${h.src('pub575', 'Publication 575')}). Terminal illness requires a physician's certification that the condition can reasonably be expected to result in death within 84 months, with the content the publication lists. Medical expenses are covered only to the extent they exceed 7.5 % of adjusted gross income, whether or not you itemize; the calculator above treats the whole amount you enter as qualifying, so enter only the part above that floor.</p>
<h2>Exceptions outside the table</h2>
<p>The IRS list is longer than the table above, which keeps the cases people meet in practice. Reaching 59½ ends the additional tax. Distributions after the death of the owner are exempt. A rollover to another plan or IRA within 60 days is not a taxable distribution at all. Corrective distributions of excess contributions, dividends passed through from an employee stock ownership plan (ESOP), IRA contributions returned by the extended due date of the return, permissive withdrawals from a plan with automatic enrollment, and distributions from a pension-linked emergency savings account are also listed. Publication 575 adds phased retirement annuity payments to federal employees. A governmental 457(b) sits apart: its distributions carry no ${pen} at all, except amounts rolled in from another type of plan or an IRA (${h.src('tc558', 'IRS Topic 558')}).</p>
<h2>Claiming an exception</h2>
<p>The plan or custodian reports each payout on Form 1099-R with a code in box 7. When it does not show an exception that applies to you, because the payer could not know about your medical bills or your new child, the IRS says to use Form 5329 to indicate the correct exception. Keep the proof that matches the exception: a certification, a birth certificate, invoices, a disaster declaration. The ${h.a('401k-withdrawal-penalty', '401(k) penalty page')} and the ${h.a('ira-early-withdrawal-penalty', 'IRA penalty page')} show what a withdrawal costs when no exception applies.</p>
`,
  faqs: [
    { q: 'Which early withdrawal penalty exceptions work for both a 401(k) and an IRA?', a: `In the IRS table, the 72(t) series, disability, unreimbursed medical expenses above 7.5 % of AGI, birth or adoption up to ${K.usd(cap('birth'))} per child, the emergency expense up to ${K.usd(cap('emergency'))}, domestic abuse, a federally declared disaster, an IRS levy and a reservist called to active duty. The rule of 55 and payments under a QDRO are plan-only.` },
    { q: 'Is there an early withdrawal penalty exception for losing my job?', a: `Not as such. Job loss alone does not remove the ${pen}. Leaving an employer in or after the year you turn ${E.ruleOf55Age} does, for that employer's plan. From an IRA, health insurance premiums are covered after 12 weeks of unemployment with unemployment compensation. Otherwise a layoff before ${E.ruleOf55Age} brings the full additional tax on withdrawals.` },
    { q: 'Do I still pay income tax when an early withdrawal penalty exception applies?', a: `Yes, in every case. An exception removes only the ${pen} additional tax. A pre-tax 401(k) or traditional IRA payout is ordinary income for the year, taxed at your 2026 bracket; a single filer with no other income pays nothing on the first ${K.usd(K.P.tax.standardDeduction.single)} thanks to the standard deduction.` },
    { q: 'What happens when my withdrawal is larger than the exception cap?', a: `The ${pen} applies to the part above the cap. Taking ${K.usd(pBirth.amt)} from a 401(k) for the birth of one child, ${K.usd(cap('birth'))} is covered and ${K.usd(pBirth.r.penalized)} is not, so the additional tax is ${K.usd(pBirth.r.penalty)}. The same logic applies to the first home, emergency, abuse and disaster exceptions.` },
    { q: 'Which early withdrawal penalty exceptions are useful for early retirement?', a: `Two: the rule of 55, for the employer plan you leave in or after the year you turn ${E.ruleOf55Age} (${E.publicSafetyAge} in public safety), and a 72(t) series of substantially equal payments, which works from an IRA at any age. Both repeat every year without proof of an event. A governmental 457(b) needs no exception at all.` },
  ],
  tool: 'exceptions',
  related: ['401k-withdrawal-penalty', 'ira-early-withdrawal-penalty', 'rule-of-55', '72t-calculator', '457b-early-withdrawal', 'early-retirement-bridge'],
  sources: ['irs_exceptions', 'pub575', 'tc558', 'irs_sepp'],
});
