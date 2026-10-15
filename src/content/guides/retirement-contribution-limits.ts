import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.P.limits;
const E = K.P.early;
const pen = K.pct(E.penalty, 0);
const single = L.deferral + L.ira + L.hsaSelf;
const couple = 2 * L.deferral + 2 * L.ira + L.hsaFamily;
const deferAt = (a: number) => L.deferral + (a >= 60 && a <= 63 ? L.catchUp60to63 : a >= 50 ? L.catchUp50 : 0);
const iraAt = (a: number) => L.ira + (a >= 50 ? L.iraCatchUp : 0);
const R = L.rothPhaseOut;
// Example: an employer that puts in $8,000 a year.
const match = 8000;
const afterTaxRoom = L.annualAdditions - L.deferral - match;
// Five years of Roth IRA contributions at the 2026 limit, available at any age.
const fiveYears = 5 * L.ira;
// Ten years of maximum contributions from 45 to 54, 5 % real return, 2026 limits held in today's dollars.
let k401 = 0, ira = 0, hsa = 0, basis = 0;
for (let a = 45; a < 55; a++) { k401 = k401 * 1.05 + deferAt(a); ira = ira * 1.05 + iraAt(a); hsa = hsa * 1.05 + L.hsaSelf; basis += iraAt(a); }

export default defineGuide({
  id: 'retirement-contribution-limits',
  group: 'fire',
  order: 16,
  slug: 'retirement-contribution-limits',
  nav: '2026 contribution limits',
  card: '401(k), IRA and HSA limits, and which account opens before 59½',
  title: 'Retirement Contribution Limits 2026: 401(k), IRA, HSA by Age',
  description: `Retirement contribution limits for 2026: ${K.usd(L.deferral)} to a 401(k), ${K.usd(L.ira)} to an IRA, ${K.usd(L.hsaSelf)} to an HSA, catch-ups from 50, and which account you can reach before 59½.`,
  h1: 'Retirement contribution limits for 2026, read for early retirement',
  intro: `The 2026 limits set how much can go into each tax-advantaged account; for anyone stopping before 59½, the order in which those accounts open matters as much as their size.`,
  resume: `For 2026 the IRS lets an employee defer ${K.usd(L.deferral)} to a 401(k), 403(b), governmental 457(b) or the federal Thrift Savings Plan, plus a catch-up of ${K.usd(L.catchUp50)} from age 50, or ${K.usd(L.catchUp60to63)} for ages 60 to 63. The IRA limit is ${K.usd(L.ira)}, plus ${K.usd(L.iraCatchUp)} from 50, shared between traditional and Roth IRAs. Direct Roth IRA contributions phase out between ${K.usd(R.single[0])} and ${K.usd(R.single[1])} of modified adjusted gross income (MAGI) for a single filer and between ${K.usd(R.joint[0])} and ${K.usd(R.joint[1])} for a married couple filing jointly. All additions to one person's employer plan, employer money included, are capped at ${K.usd(L.annualAdditions)}. A health savings account takes ${K.usd(L.hsaSelf)} with self-only coverage or ${K.usd(L.hsaFamily)} with family coverage. One person under 50 can therefore shelter ${K.usd(single)} of their own money, and a couple ${K.usd(couple)}. For early retirement, the question that follows is which of these accounts pays out before 59½ without the ${pen} additional tax.`,
  body: (h) => `
<h2>The 2026 figures, by age</h2>
<p>The employee deferral limit and the IRA limit rose for 2026 (${h.src('limits_2026', 'IRS IR-2025-111')}, ${h.src('notice_2025_67', 'Notice 2025-67')}). The catch-up depends on the age you reach by the end of the year. Since 2025, people who turn 60, 61, 62 or 63 during the year get a larger catch-up in their workplace plan; at 64 it falls back to the ordinary amount.</p>
${h.table(['Age at the end of 2026', '401(k), 403(b), 457(b) deferral', 'IRA', 'Both together'], [
  ['Under 50', K.usd(deferAt(40)), K.usd(iraAt(40)), K.usd(deferAt(40) + iraAt(40))],
  ['50 to 59', K.usd(deferAt(55)), K.usd(iraAt(55)), K.usd(deferAt(55) + iraAt(55))],
  ['60 to 63', K.usd(deferAt(61)), K.usd(iraAt(61)), K.usd(deferAt(61) + iraAt(61))],
  ['64 and over', K.usd(deferAt(64)), K.usd(iraAt(64)), K.usd(deferAt(64) + iraAt(64))],
], 'Employee money. Employer contributions come on top, within the annual additions limit.', ['l', 'r', 'r', 'r'])}
<p>The health savings account limits come from a separate Revenue Procedure: ${K.usd(L.hsaSelf)} for self-only coverage and ${K.usd(L.hsaFamily)} for family coverage under a high-deductible health plan (${h.src('rp_2025_19', 'Rev. Proc. 2025-19')}). The overall cap on additions to one person's account in a defined contribution plan, deferrals, employer match, profit sharing and any after-tax money together, is ${K.usd(L.annualAdditions)}; catch-ups sit outside it.</p>
${h.mini('limits', { t: 'At 61, the larger catch-up applies', p: ['age'], d: { age: 61, hsa: 'self' } })}
<h2>Roth IRA: the income ranges</h2>
<p>Anyone with earned income can make a traditional IRA contribution, but a direct Roth IRA contribution shrinks once MAGI enters the phase-out range and stops at its top: ${K.usd(R.single[0])} to ${K.usd(R.single[1])} for single filers and heads of household, ${K.usd(R.joint[0])} to ${K.usd(R.joint[1])} for married couples filing jointly (${h.src('roth_iras', 'IRS, Roth IRAs')}). Within the range, the allowed amount falls in proportion to how far income has climbed. Above it, many savers contribute to a traditional IRA without a deduction and convert it to Roth, a two-step route whose tax depends on any other pre-tax IRA balance.</p>
<h2>Which limit to fill first if you plan to stop before 59½</h2>
<p>For a saver who will work to 65, the choice between accounts is mostly about tax. For an early retiree there is a second test: can the money be spent before 59½ without the ${pen}? The accounts differ sharply.</p>
${h.table(['Account', '2026 limit', 'Spendable before 59½ without the 10 %'], [
  ['401(k) or 403(b), current employer', K.usd(L.deferral), `if you leave in or after the year you turn ${E.ruleOf55Age} (${E.publicSafetyAge} in public safety), or through a 72(t)`],
  ['Governmental 457(b)', K.usd(L.deferral), 'yes, once you leave the employer, at any age'],
  ['Roth IRA', K.usd(L.ira), 'contributions at any time; conversions after five tax years; earnings no'],
  ['Traditional IRA', K.usd(L.ira), 'only through an exception, mainly a 72(t) series'],
  ['HSA', `${K.usd(L.hsaSelf)} / ${K.usd(L.hsaFamily)}`, 'qualified medical costs, tax-free at any age'],
  ['Taxable brokerage account', 'no limit', 'yes, gains taxed at 0 %, 15 % or 20 %'],
], 'Sources: IRS exceptions table, Topic 558, Publication 590-B.', ['l', 'r', 'l'])}
<p>A common order among early retirees runs like this. First the 401(k) up to the full employer match, since the match is money that disappears otherwise. Then the HSA if the health plan allows one, because it is deductible going in and tax-free coming out for medical costs, which an early retiree pays every year until Medicare. Then the Roth IRA: its contributions come back out at any age, tax-free and without penalty, so five years at the 2026 limit is ${K.usd(fiveYears)} of bridge money that also keeps compounding tax-free if not needed. Then the rest of the workplace limit. Last, the brokerage account, which has no limit and no lock.</p>
<p>The governmental 457(b) deserves its own line. Distributions from it owe no ${pen} after you separate from the employer, whatever your age (${h.src('tc558', 'IRS Topic 558')}), so a public employee who can defer to one has a pre-tax account that doubles as bridge money. Money rolled into a 457(b) from a 401(k) or an IRA keeps the ${pen}, though: the exemption covers only what was deferred into the 457(b) itself.</p>
${h.mini('roth', { t: 'Taking back five years of Roth contributions at 48', p: ['amt'], d: { amt: 25000, c: fiveYears, cv: 0, e: 12000, age: 48 } })}
<h2>Ten years at the limits, from 45 to 55</h2>
<p>Picture a single saver who fills the workplace plan, a Roth IRA and a self-only HSA every year from 45 through 54, with the catch-ups from 50, and earns a ${K.pct(0.05, 0)} return after inflation. At 55 the 401(k) holds about ${K.usd(k401)}, the Roth IRA about ${K.usd(ira)} and the HSA about ${K.usd(hsa)}, in today's dollars. Now apply the access test. If the saver leaves that employer at 55, the whole 401(k) opens under the rule of ${E.ruleOf55Age}. In the Roth IRA, the ${K.usd(basis)} of contributions can come out at any time, while the growth on top waits for 59½. The HSA pays medical bills. Leave the same job at 52 instead and the picture changes: the 401(k) stays locked, and the Roth contributions plus whatever sits in a brokerage account must carry the years to 59½.</p>
<h2>Room above the deferral limit</h2>
<p>The gap between the ${K.usd(L.deferral)} deferral and the ${K.usd(L.annualAdditions)} cap is filled by the employer, and in some plans by after-tax contributions. With an ${K.usd(match)} employer contribution, the room left is ${K.usd(afterTaxRoom)}. Plans that accept after-tax money and allow an in-plan Roth conversion or a distribution of it while still employed let high savers move part of that room into Roth money. Whether yours does is a question for the plan document, not for the tax code; many plans offer neither.</p>
<p>The limits cap how much gets a tax break, not how much you can save. Anyone saving more than ${K.usd(single)} a year as a single person under 50 will put the rest in a brokerage account, which is exactly the money that pays the first years of an early retirement. Social Security is left out of this page. To turn these figures into years of work, see the ${h.a('how-much-to-save-for-retirement', 'savings rate page')}; for the order in which each account opens, ${h.a('when-can-you-draw-401k', 'when each account can be drawn')}; for the Roth rules, ${h.a('roth-ira-withdrawal-rules', 'Roth IRA withdrawals')}.</p>
`,
  faqs: [
    { q: 'What is the 401(k) contribution limit for 2026 if I am 61?', a: `${K.usd(deferAt(61))}: the ${K.usd(L.deferral)} employee deferral plus the ${K.usd(L.catchUp60to63)} catch-up for people who reach 60, 61, 62 or 63 during the year. At 64 the catch-up falls back to ${K.usd(L.catchUp50)}. The IRA allows ${K.usd(iraAt(61))} at the same age, and employer money comes on top within ${K.usd(L.annualAdditions)}.` },
    { q: 'Can I contribute to both a 401(k) and a Roth IRA in 2026?', a: `Yes. The ${K.usd(L.deferral)} workplace limit and the ${K.usd(L.ira)} IRA limit are separate. The Roth IRA has an income test: direct contributions phase out between ${K.usd(R.single[0])} and ${K.usd(R.single[1])} of MAGI for a single filer and between ${K.usd(R.joint[0])} and ${K.usd(R.joint[1])} for a joint return.` },
    { q: 'Which 2026 retirement contribution limit matters most for retiring before 59½?', a: `The Roth IRA limit, for its access. Its ${K.usd(L.ira)} of yearly contributions can be withdrawn at any age without tax or the ${pen}, so five years of contributions give ${K.usd(fiveYears)} of bridge money. A 401(k) opens early only with the rule of ${E.ruleOf55Age} or a 72(t); a governmental 457(b) opens once you leave.` },
    { q: 'How much can a married couple put in retirement accounts in 2026?', a: `Two spouses under 50 can each defer ${K.usd(L.deferral)} to a workplace plan and put ${K.usd(L.ira)} in an IRA, and the family can add ${K.usd(L.hsaFamily)} to an HSA: ${K.usd(couple)} in all. A spouse without earnings can still fund an IRA on a joint return. Catch-ups from 50 and employer money raise the total.` },
    { q: 'Are HSA contribution limits part of the retirement contribution limits?', a: `They are separate. For 2026 the HSA limit is ${K.usd(L.hsaSelf)} with self-only coverage and ${K.usd(L.hsaFamily)} with family coverage, set by Rev. Proc. 2025-19, on top of the ${K.usd(L.deferral)} workplace and ${K.usd(L.ira)} IRA limits. You need a high-deductible health plan to contribute, but not to spend the money later on medical costs.` },
  ],
  tool: 'limits',
  related: ['how-much-to-save-for-retirement', 'roth-ira-withdrawal-rules', '457b-early-withdrawal', 'when-can-you-draw-401k', 'roth-conversion-ladder', 'rule-of-55'],
  sources: ['limits_2026', 'notice_2025_67', 'rp_2025_19', 'roth_iras', 'tc558', 'irs_exceptions'],
});
