import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.P.early;
const pen = K.pct(E.penalty, 0);
// Worked case: born September 1975, compares an exit at 54 with an exit at 55.
const at54 = K.tool('draw', { by: '1975', bm: '9', leave: 54 });
const at55 = K.tool('draw', { by: '1975', bm: '9', leave: 55 });
// Cost of drawing an old 401(k) at 52 with no exception, single, no other income.
const early52 = K.early({ amount: 30000, age: 52, account: 'oldPlan', status: 'single' });
const halfOf = (by: string, bm: string) => K.tool('draw', { by, bm }).value;
const MONTHS = ['January', 'March', 'May', 'June', 'July', 'September', 'December'];
const NUMS = ['1', '3', '5', '6', '7', '9', '12'];

export default defineGuide({
  id: 'when-can-you-draw-401k',
  group: 'access',
  order: 29,
  slug: 'when-can-you-draw-401k',
  nav: 'When can you draw a 401(k)',
  card: 'The first month each account pays you without the 10 %',
  title: '401(k) Draw Age 2026: 59½, Rule of 55, 72(t) and Roth',
  description: `401(k) draw age in 2026: 59½ for most money, ${E.ruleOf55Age} if you leave your job that year, any age for Roth contributions. Find the month your own 59½ falls in.`,
  h1: 'When can you draw from your 401(k)? The age for each account',
  intro: `A 401(k) pays without the ${pen} additional tax from the month you reach 59½, or earlier when you leave that employer in the year you turn ${E.ruleOf55Age}; other accounts follow their own clocks.`,
  resume: `You can draw from a 401(k) at any age once the plan lets you, but before 59½ the taxable amount owes a ${pen} additional tax on top of income tax unless an exception applies. The age that matters is 59½, which lands six months after your 59th birthday: born in September 1975, you reach it in ${halfOf('1975', '9')}. Three doors open earlier. Leaving the employer in or after the calendar year you turn ${E.ruleOf55Age} (${E.publicSafetyAge} for qualified public safety workers) frees that employer's plan. A 72(t) series of equal payments works at any age after you leave. A governmental 457(b) owes no ${pen} at all. Roth IRA contributions come back tax free whenever you want, conversions after five tax years each. Pulling ${K.usd(30000)} from an old 401(k) at 52 without an exception costs ${K.usd(early52.penalty)} of additional tax. The checker above turns your birth date and exit age into a date for each account.`,
  body: (h) => `
<h2>Your 59½ month comes from your birth month</h2>
<p>The IRS wording is "after participant/IRA owner reaches age 59½" (${h.src('irs_exceptions', 'IRS exceptions table')}). Half a year past the 59th birthday is the line, so two people born in the same year can be almost a full year apart. A payment dated the day before that line is an early distribution; the same payment a day later is not, and the ${pen} disappears for every 401(k), 403(b) and IRA you own at once.</p>
${h.table(['Born in', '1970', '1972', '1975', '1978'], MONTHS.map((m, i) => [m, halfOf('1970', NUMS[i]), halfOf('1972', NUMS[i]), halfOf('1975', NUMS[i]), halfOf('1978', NUMS[i])]), 'Month in which you reach 59½, computed by the engine of this site from the birth month.', ['l', 'l', 'l', 'l', 'l'])}
<p>A practical point about the paperwork: the plan reports each payment on Form 1099-R with a distribution code. If you are past 59½ and the form still shows code 1, the early code, Publication 575 tells you to file Form 5329 and claim the age exception yourself, so keep the payment date handy.</p>
${h.mini('draw', { t: 'Your own 59½ month', p: ['by', 'bm'], d: { by: '1968', bm: '11', leave: 56 } })}
<h2>Each account has its own clock</h2>
${h.table(['Account', 'Earliest draw without the 10 %', 'What decides it'], [
  ['401(k) or 403(b) of the job you leave', `year you turn ${E.ruleOf55Age} (${E.publicSafetyAge} in public safety)`, 'the calendar year of the separation'],
  ['401(k) of an earlier employer', '59½, or a 72(t) series', 'your age; no rule of 55 for that plan'],
  ['Traditional, rollover or SEP IRA', '59½, or a 72(t) series', 'your age'],
  ['Governmental 457(b)', 'any age once the plan pays', 'plan rules; no 10 % (Topic 558)'],
  ['Roth IRA: your contributions', 'any time', 'they come out first'],
  ['Roth IRA: each conversion', 'five tax years after it', 'January 1 of the conversion year starts the count'],
  ['Roth IRA: earnings', '59½ and five years since the first Roth', 'qualified distribution'],
], 'Sources: IRS exceptions table, Topic 558, Publication 590-B (2025), chapter 2.', ['l', 'l', 'l'])}
<p>The first line is the one people miss. Take someone born in September 1975. ${at54.sub} ${at55.sub} One calendar year of staying at work moves that plan's opening date from ${at54.value} to ${at55.rows?.[0]?.[1] ?? ''}. The rule looks at the year of the separation, not the birthday, which is why the ${h.a('rule-of-55', 'rule of 55 checker')} only asks for two years.</p>
<p>The governmental 457(b) line is different in kind. The IRS says in Topic 558 that an eligible state or local government 457 plan "isn't a qualified retirement plan", so its payments escape the ${pen} whatever your age (${h.src('tc558', 'Topic 558')}). The money still has to be payable under the plan, and the calculator above assumes the plan starts paying after you leave the job. The ${h.a('457b-early-withdrawal', '457(b) page')} covers the exception for money rolled in from other plans.</p>
<h2>Drawing before your account opens: the price</h2>
<p>Nothing stops a former employee from asking an old plan for cash at 52. The cost is arithmetic. On ${K.usd(30000)} with no other income in 2026, a single filer owes ${K.usd(early52.federal)} of federal income tax after the ${K.usd(K.P.tax.standardDeduction.single)} standard deduction, plus ${K.usd(early52.penalty)} of additional tax, and the plan withholds ${K.usd(early52.withheld)} up front. The additional tax is the part a little planning removes, and the tax code offers two tools for those under 55: a ${h.a('72t-calculator', '72(t) series')} from an IRA, and the Roth IRA ordering rules.</p>
${h.mini('penalty', { t: 'Old 401(k) at 52: what the 10 % takes', p: ['amt'], d: { amt: 30000, age: 52, acc: 'oldPlan', ex: 'none', oi: 0, state: 0 } })}
<h2>Roth money keeps a separate calendar</h2>
<p>A Roth IRA is not on the 59½ clock for most of its balance. Publication 590-B lists the order in which money leaves: regular contributions first, then conversions oldest first, then earnings (${h.src('pub590b', 'Publication 590-B')}). Contributions were never deducted, so drawing them back is neither taxable nor penalized at 41 or at 58. Each conversion has its own five-year period, counted from January 1 of the year you converted; once it has passed, that conversion can be drawn without the ${pen} as well. Only the earnings wait for 59½ and for five years since your first Roth contribution. The ${h.a('roth-ira-withdrawal-rules', 'Roth withdrawal page')} splits a withdrawal into those layers.</p>
<h2>A 401(k) still open at work</h2>
<p>Drawing from the plan of an employer you still work for is a separate question, and the plan decides it. Many plans pay nothing to active employees under 59½ except loans or hardship withdrawals; some allow in-service withdrawals of rollover money. A hardship withdrawal is not an exception to the ${pen} by itself: unless the reason also matches one of the exceptions in the IRS table, the additional tax applies. Ask the administrator for the plan's distribution options in writing before counting on one.</p>
<h2>Two spouses, two calendars</h2>
<p>The age test belongs to the participant or IRA owner, never to the couple. A joint return does not merge the dates: if one spouse reaches 59½ in ${halfOf('1970', '4')} and the other, born in 1974, only in ${halfOf('1974', '8')}, the older spouse's IRA opens more than four years before the younger one's. A household that stops work together can draw on the older spouse's accounts once that date passes, while the younger spouse's plans stay untouched. The rule of 55 works the same way: it looks at the year each person leaves his or her own employer.</p>
<h2>Putting the dates together</h2>
<p>Write the dates in one column: your 59½ month, the year you would leave, the first year each Roth conversion becomes free. The gap between your last paycheck and the first open account is the stretch you have to fund from taxable savings, Roth contributions or a 457(b). The ${h.a('early-retirement-bridge', 'bridge page')} prices that stretch, and the ${h.a('how-to-withdraw-money-from-401k', 'withdrawal steps page')} explains what happens the day you ask the plan for money.</p>
`,
  faqs: [
    { q: 'At what exact date can I draw my 401(k) without the 10 % if I was born in March 1972?', a: `In ${halfOf('1972', '3')}. The IRS line is age 59½, which falls six months after the 59th birthday. Any 401(k), 403(b) or IRA payment from that point owes income tax but no ${pen} additional tax, whichever employer the plan comes from.` },
    { q: 'Can I draw my 401(k) at 55 if I retired at 53?', a: `Not without the ${pen}, unless another exception applies. The rule of 55 needs the separation to happen in or after the calendar year you turn ${E.ruleOf55Age}; leaving at 53 and waiting does not count. That plan, like an IRA, opens at 59½ or through a 72(t) series of equal payments.` },
    { q: 'Which account can I draw first if I stop working at 48?', a: `Usually Roth IRA contributions, which come out tax and penalty free at any age, and a governmental 457(b), which owes no ${pen}. A 401(k) left at 48 stays penalized until 59½ unless you start a 72(t) series. Taxable brokerage money has no age limit at all.` },
    { q: 'Does the 401(k) draw age change for public safety workers?', a: `Yes. Qualified public safety employees of a state or local government, federal law enforcement officers, firefighters and air traffic controllers use age ${E.publicSafetyAge} instead of ${E.ruleOf55Age}, or ${E.publicSafetyYearsOfService} years of service under the plan if that comes first, for the governmental plan they separate from.` },
    { q: 'Can I draw from my 401(k) while I still work for the employer?', a: 'Only if the plan allows it. Many plans limit active employees under 59½ to loans or hardship withdrawals. A hardship payment still owes the 10 % additional tax unless the reason matches an IRS exception, such as medical expenses above 7.5 % of adjusted gross income.' },
  ],
  tool: 'draw',
  related: ['rule-of-55', '72t-calculator', 'roth-ira-withdrawal-rules', '457b-early-withdrawal', 'early-retirement-bridge', 'how-to-withdraw-money-from-401k'],
  sources: ['irs_exceptions', 'tc558', 'pub575', 'pub590b'],
});
