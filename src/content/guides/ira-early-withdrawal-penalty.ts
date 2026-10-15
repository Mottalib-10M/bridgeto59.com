import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.P.early;
const pen = K.pct(E.penalty, 0), simple = K.pct(E.simpleIraFirst2Years, 0), wh = K.pct(E.planWithholding, 0);
const X = K.P.exceptions;
const home = X.find((x) => x.id === 'homebuyer')!;
const iraOnly = X.filter((x) => x.ira && !x.plan);
const planOnly = X.filter((x) => x.plan && !x.ira);
// Cases, single filer.
const house = K.early({ amount: 25000, age: 38, account: 'ira', exception: 'homebuyer', status: 'single', otherIncome: 65000 });
const school = K.early({ amount: 15000, age: 44, account: 'ira', exception: 'education', status: 'single', otherIncome: 80000 });
const rolled = K.early({ amount: 18000, age: 56, account: 'ira', status: 'single', otherIncome: 0 });
const kept = K.early({ amount: 18000, age: 56, account: 'plan', exception: 'separation55', status: 'single', otherIncome: 0 });
const simpleAmt = 12000;
const simpleTax = simpleAmt * E.simpleIraFirst2Years, simpleLater = simpleAmt * E.penalty;

export default defineGuide({
  id: 'ira-early-withdrawal-penalty',
  group: 'access',
  order: 27,
  slug: 'ira-early-withdrawal-penalty',
  nav: 'IRA early withdrawal penalty',
  card: `The ${pen} on an IRA before 59½, the IRA-only exceptions and the ${simple} SIMPLE trap`,
  title: 'IRA Early Withdrawal Penalty 2026: Exceptions Only IRAs Get',
  description: `IRA early withdrawal penalty in 2026: ${pen} before 59½, ${simple} on a SIMPLE IRA in its first 2 years, and the IRA-only exceptions such as ${K.usd(home.cap ?? 0)} for a first home.`,
  h1: 'IRA early withdrawal penalty: the 10 % and the exceptions that only IRAs have',
  intro: `An IRA plays by its own rules before 59½: some doors that a 401(k) offers are shut, and three others open only here.`,
  resume: `A withdrawal from a traditional IRA, SEP or SIMPLE IRA before age 59½ owes a ${pen} additional tax on the taxable amount, on top of income tax, unless an exception applies; from a SIMPLE IRA within the first two years of participation the rate is ${simple} instead. IRAs have three exceptions that 401(k) plans do not: qualified higher education expenses, a first-time home purchase up to ${K.usd(home.cap ?? 0)}, and health insurance premiums paid while unemployed. They also lose two that plans have: the rule of 55 and payments to an ex-spouse under a qualified domestic relations order. A 38-year-old taking ${K.usd(25000)} for a first home pays the ${pen} only on the part above ${K.usd(home.cap ?? 0)}, ${K.usd(house.penalty)}. The mandatory ${wh} withholding of employer plans does not apply to IRA payouts, so the tax is settled on the return. Roth IRA contributions come out free at any age.`,
  body: (h) => `
<h2>Same ${pen}, different list of ways out</h2>
<p>The additional tax is the same ${pen} for an IRA as for a 401(k). The IRS exceptions table puts IRAs, SEPs, SIMPLE IRAs and SARSEPs in one column and qualified plans such as a 401(k) in another, and the two columns do not match (${h.src('irs_exceptions', 'IRS exceptions table')}). The pattern is easy to read once laid side by side: the IRA-only exceptions concern a house, school and health insurance, while the plan-only ones are tied to leaving an employer and to court orders addressed to a plan.</p>
${h.table(['Exception', '401(k) or 403(b)', 'IRA', 'Cap', 'IRC section'],
  [...iraOnly, ...planOnly].map((x) => [x.label, x.plan ? 'yes' : 'no', x.ira ? 'yes' : 'no', x.cap ? K.usd(x.cap) : 'none', x.code]),
  'Only the exceptions that differ between plans and IRAs. Source: IRS exceptions table, updated December 11, 2025. The full list is on the exceptions page.', ['l', 'l', 'l', 'r', 'l'])}
<h2>The three IRA-only exceptions, with their limits</h2>
<p>The first-time homebuyer exception covers up to ${K.usd(home.cap ?? 0)}. On a ${K.usd(25000)} withdrawal at 38, single, with ${K.usd(65000)} of salary, the exception removes the ${pen} from ${K.usd(home.cap ?? 0)} and leaves it on the other ${K.usd(house.penalized)}: ${K.usd(house.penalty)} of additional tax, plus about ${K.usd(house.federal)} of federal income tax on the whole amount because it lands on top of the salary. A smaller withdrawal sized to the cap avoids the penalty entirely, but income tax remains.</p>
<p>The education exception covers qualified higher education expenses, with no dollar cap in the IRS table. A 44-year-old paying ${K.usd(15000)} of tuition from an IRA owes no additional tax, but the ${K.usd(15000)} still counts as income: about ${K.usd(school.federal)} of federal tax on an ${K.usd(80000)} salary. The third exception, unemployed health insurance, is narrow by design. The IRS table describes it as distributions equal to the amount paid for family health insurance by someone who was unemployed for 12 weeks and received unemployment compensation in the year of the distribution or the year after. Someone who quits to retire early and never draws unemployment does not meet it.</p>
${h.mini('penalty', { t: 'A first home: how much of the withdrawal the exception covers', p: ['amt'], d: { amt: 25000, age: 38, acc: 'ira', ex: 'homebuyer', oi: 65000, state: 0 } })}
<h2>No rule of 55 in an IRA</h2>
<p>This is the costly one for early retirees. The separation-from-service exception, age ${E.ruleOf55Age} or ${E.publicSafetyAge} for public safety, is marked "no" in the IRA column. Someone who leaves a job at 55 and rolls the 401(k) into an IRA the same month turns a penalty-free account into a penalized one. Take ${K.usd(18000)} at 56 with no other income: from the IRA, ${K.usd(rolled.penalty)} of additional tax; left in the plan of the employer just left, ${K.usd(kept.penalty)}. Federal income tax is the same either way, ${K.usd(rolled.federal)}, because the standard deduction absorbs most of it. The ${h.a('rule-of-55', 'rule of 55 page')} explains the calendar-year test.</p>
<p>An IRA does offer the main early-retirement tool that works at any age: a series of substantially equal periodic payments under section 72(t), with no need to have left an employer. The ${h.a('72t-calculator', '72(t) calculator')} computes it.</p>
<h2>The SIMPLE IRA two-year rule</h2>
<p>A footnote in the IRS table sets a higher rate for one case: distributions from a SIMPLE IRA within the first two years of participation incur a ${simple} additional tax instead of ${pen}. On ${K.usd(simpleAmt)}, that is ${K.usd(simpleTax)} instead of ${K.usd(simpleLater)}. The two years run from your first participation in the employer's SIMPLE IRA plan, so someone who joined a small employer recently and quits early to retire should check the date before touching that account. After the two years, the ordinary ${pen} applies, with the same exceptions as any IRA.</p>
<h2>Withholding: the ${wh} rule belongs to employer plans</h2>
<p>The mandatory ${wh} withholding described in Publication 575 applies to eligible rollover distributions paid by an employer plan (${h.src('pub575', 'IRS Publication 575')}). An IRA payout is outside that rule; what the custodian holds back depends on the election you make on its withdrawal form. Whatever is or is not withheld, the income tax and the ${pen} are settled on your return, with Form 5329 for the additional tax or for an exception that box 7 of the Form 1099-R does not show.</p>
<h2>Roth IRAs follow a different order</h2>
<p>A Roth IRA is an IRA for the ${pen}, but the order of withdrawals changes everything: your own contributions come out first, free of tax and of the additional tax at any age, and only earnings can be penalized. Conversions have their own five-year clock. The ${h.a('roth-ira-withdrawal-rules', 'Roth IRA withdrawal page')} works through the ordering rules (${h.src('pub590b', 'Publication 590-B')}).</p>
<h2>Exceptions shared with plans</h2>
<p>Disability, a birth or adoption, unreimbursed medical expenses above the 7.5 % of adjusted gross income floor, an emergency personal expense, domestic abuse, a federally declared disaster, an IRS levy and a reservist called to active duty all work for IRAs as well, each with the cap shown on the ${h.a('early-withdrawal-penalty-exceptions', 'full exceptions page')}. The ${h.a('401k-withdrawal-penalty', '401(k) penalty page')} covers the plan side.</p>
`,
  faqs: [
    { q: 'How much of an IRA withdrawal for a first home escapes the 10 % penalty?', a: `The IRS exceptions table describes it as qualified first-time homebuyers, up to ${K.usd(home.cap ?? 0)}. Above that amount, the ${pen} applies to the rest: on ${K.usd(25000)} taken at 38, the additional tax is ${K.usd(house.penalty)}. Income tax is due on the full withdrawal from a traditional IRA. The exception does not exist for a 401(k).` },
    { q: 'Can I use the rule of 55 on an IRA withdrawal at 56?', a: `No. The separation-from-service exception is for employer plans only. At 56, ${K.usd(18000)} from an IRA owes ${K.usd(rolled.penalty)} of additional tax, while the same amount from the 401(k) of the employer you left in or after the year you turned ${E.ruleOf55Age} owes none. Rolling that plan into an IRA gives up the exception.` },
    { q: 'What is the SIMPLE IRA early withdrawal penalty in the first two years?', a: `${simple} instead of ${pen}, according to the IRS exceptions table, for distributions within the first two years of participation in the SIMPLE IRA plan. On ${K.usd(simpleAmt)} that is ${K.usd(simpleTax)} of additional tax, against ${K.usd(simpleLater)} later on. Income tax is due on top in both cases.` },
    { q: `Is ${wh} withheld from an early IRA withdrawal like a 401(k)?`, a: `No. The mandatory ${wh} withholding applies to eligible rollover distributions from employer plans, as Publication 575 describes. For an IRA, the custodian's withdrawal form sets what is withheld according to your election. The ${pen} additional tax and the income tax are then settled on your return, whatever was held back.` },
    { q: 'Does the IRA unemployed health insurance exception work if I quit to retire early?', a: 'Usually not. The IRS table ties it to someone who was unemployed for 12 weeks and received unemployment compensation in the year of the distribution or the following year, and it covers amounts equal to the health insurance premiums paid. Leaving voluntarily without unemployment compensation does not meet the condition.' },
  ],
  tool: 'penalty',
  toolArg: { acc: 'ira' },
  related: ['early-withdrawal-penalty-exceptions', '72t-calculator', 'roth-ira-withdrawal-rules', 'rule-of-55', '401k-withdrawal-penalty'],
  sources: ['irs_exceptions', 'pub590b', 'pub575', 'irs_sepp'],
});
