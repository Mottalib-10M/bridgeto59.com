import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.P.early;
const pen = K.pct(E.penalty, 0);
const psAge = E.publicSafetyAge, yos = E.publicSafetyYearsOfService;
// Case A: a city firefighter born in 1976 retires in 2026, the year of the 50th birthday; married filing jointly, $40,000 of pension income.
const a = K.rule55({ birthYear: 1976, separationYear: 2026, publicSafety: true });
const aOk = K.early({ amount: 30000, age: psAge, account: 'plan', exception: 'separation55', status: 'joint', otherIncome: 40000 });
const aNo = K.early({ amount: 30000, age: psAge, account: 'plan', status: 'joint', otherIncome: 40000 });
// Case B: a deputy hired at 22, born in 1979, leaves in 2026 at 47 with 25 years under the plan; Case C: same deputy with one year less.
const b = K.rule55({ birthYear: 1979, separationYear: 2026, publicSafety: true, serviceYears: yos });
const c = K.rule55({ birthYear: 1979, separationYear: 2026, publicSafety: true, serviceYears: yos - 1 });
const cCost = K.early({ amount: 24000, age: 47, account: 'plan', status: 'single', otherIncome: 52000 });

export default defineGuide({
  id: 'rule-of-55-public-safety',
  group: 'access',
  order: 21,
  slug: 'rule-of-55-public-safety',
  nav: 'Public safety at 50',
  card: `Police, firefighters, controllers: no ${pen} from age ${psAge} or ${yos} years of service`,
  title: `Rule of 55 Public Safety 2026: Age ${psAge} or ${yos} Years of Service`,
  description: `Rule of 55 for public safety in 2026: police, firefighters, corrections officers and air traffic controllers leave at ${psAge}, or after ${yos} years, with no ${pen} tax.`,
  h1: `Public safety rule of 55: age ${psAge}, or ${yos} years on the job`,
  intro: `If you protect the public for a living, the age in the rule of 55 drops to ${psAge}, and ${yos} years of service under the plan can open the money even sooner.`,
  resume: `Qualified public safety employees reach the plan money without the ${pen} additional tax five years before everyone else: the separation-from-service exception of IRC section 72(t)(10) uses age ${psAge} instead of ${E.ruleOf55Age}, and Publication 575 adds a second test, ${yos} years of service under the plan, whichever comes first. The IRS table of exceptions names who counts: public safety employees of a state or a political subdivision in a governmental defined benefit or defined contribution plan, specified federal law enforcement officers, corrections officers, customs and border protection officers, federal firefighters, private-sector firefighters and air traffic controllers, with the TSP cited as a covered plan. A firefighter born in 1976 who retires in 2026 qualifies by age; a deputy hired at 22 who leaves at 47 with ${yos} years qualifies by service. Income tax still applies, and an IRA never inherits the exception. The checker above is set for a public safety worker born in 1976.`,
  body: (h) => `
<h2>Two doors instead of one</h2>
<p>For most workers, the rule of 55 has a single test: the calendar year of the separation. Public safety employees get two. The first is age: leaving in or after the year you turn ${psAge} is enough. The second is time on the job: Publication 575 lets a qualified public safety employee, or a private-sector firefighter, separate in or after the year of the earlier of age ${psAge} or ${yos} years of service under the plan (${h.src('pub575', 'IRS Publication 575')}). For people who joined a department at 20 or 21, the second door opens first, sometimes three or four years before the 50th birthday.</p>
<p>Take a city firefighter born in 1976 who retires in 2026. The checker answers that ${a.reason}, so withdrawals from the governmental plan she leaves carry no ${pen} additional tax. On ${K.usd(30000)} taken in the same year, with ${K.usd(40000)} of pension income and a joint return, the ${pen} would have been ${K.usd(aNo.penalty)}. It falls to zero; federal income tax on the withdrawal stays at about ${K.usd(aOk.federal)}, and the plan still holds back ${K.usd(aOk.withheld)} at payout, which a refund settles if the real tax is lower.</p>
${h.mini('rule55', { t: `Hired at 22: does ${yos} years open the plan at 47?`, p: ['sy'], d: { by: '1979', ly: '2026', ps: 'yes', sy: yos, amt: 24000 } })}
<h2>Who the IRS counts as a qualified public safety employee</h2>
<p>The list is specific, and it lives in a footnote of the IRS exceptions table (${h.src('irs_exceptions', 'irs.gov exceptions table')}). The age ${psAge} rule covers public safety employees of a state, or of a political subdivision of a state such as a county or a city, when the money sits in a governmental defined benefit or defined contribution plan. The same footnote extends it to specified federal law enforcement officers, corrections officers, customs and border protection officers, federal firefighters, private-sector firefighters and air traffic controllers. It allows the exemption for distributions from defined benefit plans, defined contribution plans and other governmental plans, and it names the Thrift Savings Plan (TSP), the federal workforce's 401(k)-style plan, as one of them.</p>
${h.table(['Who', 'Plan the rule reaches', 'Age or service'], [
  ['Police, sheriff, fire and emergency staff of a state, county or city', 'governmental defined benefit or defined contribution plan', `${psAge}, or ${yos} years under the plan`],
  ['Specified federal law enforcement officers', 'governmental plans, the TSP included', `${psAge}, or ${yos} years under the plan`],
  ['Corrections officers', 'governmental plans', `${psAge}, or ${yos} years under the plan`],
  ['Customs and border protection officers', 'governmental plans, the TSP included', `${psAge}, or ${yos} years under the plan`],
  ['Federal firefighters', 'governmental plans, the TSP included', `${psAge}, or ${yos} years under the plan`],
  ['Private-sector firefighters', 'the qualified plan of the private employer', `${psAge}, or ${yos} years under the plan`],
  ['Air traffic controllers', 'governmental plans, the TSP included', `${psAge}, or ${yos} years under the plan`],
  ['Any other employee', 'the plan of the employer left', `${E.ruleOf55Age}, by calendar year`],
], 'IRS exceptions table, footnote on qualified public safety employees (updated December 11, 2025); Publication 575 (2025) for the years-of-service test.', ['l', 'l', 'l'])}
<p>Anyone outside those lines uses age ${E.ruleOf55Age}, even inside the same government. A clerk in the sheriff's office who never held a public safety position is judged on the general rule. If your job title sits near the border of the list, the plan administrator is the one who codes the distribution on Form 1099-R, so ask in writing how your position is classified before you set a date.</p>
<h2>The service count and the one year that decides it</h2>
<p>Years of service are counted under the plan, not in your career. A deputy who worked six years in one county and nineteen in another may have nineteen years in the plan that pays, not ${yos}. That gap is the most expensive surprise in this area, because the separation has to happen in or after the qualifying year. Leave a year early and the exception is lost for that plan for good; waiting for the 50th birthday afterwards does not repair it, exactly as in the Publication 575 example of a worker who left at 49.</p>
<p>The engine shows the effect. Born in 1979, leaving in 2026 at 47 with ${yos} years under the plan: eligible, because of ${b.reason}. Same person with ${yos - 1} years: not eligible, because ${c.reason}. On a ${K.usd(24000)} withdrawal with ${K.usd(52000)} of other income on a single return, that one year costs ${K.usd(cCost.penalty)} of additional tax, and every withdrawal until 59½ repeats it unless another exception applies.</p>
<h2>Plans that never needed the exception</h2>
<p>Many state and local safety workers also have a governmental 457(b). Distributions from it carry no ${pen} at any age, except the part that came in as a rollover from another plan or an IRA (${h.src('tc558', 'IRS Topic 558')}). The age ${psAge} rule matters for the pension-side plan and for a 401(a) or 401(k) account; the 457(b) is open the day you leave. The ${h.a('457b-early-withdrawal', '457(b) page')} covers the rollover trap, and the order of use matters: spending the 457(b) first can leave the plan covered by the age ${psAge} rule untouched for later years.</p>
<h2>What the earlier age does not change</h2>
<ul>
<li>An IRA does not inherit it. Roll the governmental plan into an IRA after leaving and the money falls under IRA rules, where separation from service is no exception at all.</li>
<li>Income tax stays. Only the ${pen} additional tax goes away; a pre-tax payout is ordinary income for the year at the 2026 brackets.</li>
<li>The ${K.pct(E.planWithholding, 0)} withholding stays on any eligible rollover distribution paid to you.</li>
<li>Plan rules still decide how often you can take money out after separation.</li>
</ul>
<p>One more interaction is worth knowing. The IRS SEPP questions and answers list a distribution to a qualified public safety employee under section 72(t)(10) next to death and disability as events that do not count as a modification of a 72(t) series (${h.src('irs_sepp', 'IRS SEPP FAQ')}). The ${h.a('72t-modification', '72(t) modification page')} explains what does break one.</p>
<h2>A bridge that starts at 50</h2>
<p>For a safety worker who retires at ${psAge} with a pension, the plan covered by this rule usually becomes the second income line, drawn in amounts that keep each year in the 10 % or 12 % bracket. The nine and a half years to 59½ are long, and the IRA, if any, stays closed apart from a ${h.a('72t-calculator', '72(t) series')}. The ${h.a('retire-at-50', 'retire at 50 page')} runs the whole bridge, health insurance included, and the general ${h.a('rule-of-55', 'rule of 55')} page explains the calendar-year test that applies to everyone else.</p>
${h.mini('penalty', { t: 'The same withdrawal from an IRA at 50', p: ['amt'], d: { amt: 30000, age: psAge, acc: 'ira', st: 'joint', oi: 40000, state: 0 } })}
`,
  faqs: [
    { q: `Do I need to be exactly ${psAge} for the public safety rule of 55, or does the calendar year count?`, a: `The calendar year counts. The separation must happen in or after the year you reach ${psAge}, or the year you complete ${yos} years of service under the plan if that comes first. A firefighter born in November 1976 who retires in February 2026 qualifies, even though still 49 on the last shift.` },
    { q: `How are the ${yos} years of service counted for the public safety exception?`, a: `Under the plan that pays you, according to Publication 575. Service with an earlier employer that sits in a different plan does not add up. A deputy with ${yos - 1} years in the current plan who leaves before the year of the 50th birthday loses the exception for that plan and owes the ${pen} on each withdrawal before 59½.` },
    { q: 'Does the TSP follow the public safety rule of 55 for federal officers?', a: `Yes. The IRS exceptions table names the TSP among the governmental plans covered for specified federal law enforcement officers, customs and border protection officers, federal firefighters and air traffic controllers. Separating in or after the year you turn ${psAge} removes the ${pen} additional tax on TSP withdrawals; income tax remains due.` },
    { q: 'Are private-sector firefighters covered by the age 50 public safety rule?', a: `Yes. Publication 575 and the IRS exceptions table both extend the earlier age to private-sector firefighters: separation in or after the year of age ${psAge}, or ${yos} years of service under the plan, removes the ${pen} additional tax on that employer's qualified plan. An IRA funded by a rollover from it does not keep the exception.` },
    { q: 'If I roll my police pension plan into an IRA at 51, can I still use the age 50 exception?', a: `No. The separation-from-service exception, including its public safety version, applies to employer plans only; the IRS table marks it "no" for IRAs. After the rollover, a withdrawal at 51 owes the ${pen} additional tax unless another exception applies, such as a 72(t) series. Leaving the money in the plan keeps the exception.` },
  ],
  tool: 'rule55',
  toolArg: { ps: 'yes', by: '1976' },
  related: ['rule-of-55', 'retire-at-50', '457b-early-withdrawal', '72t-calculator', 'early-withdrawal-penalty-exceptions'],
  sources: ['irs_exceptions', 'pub575', 'tc558', 'irs_sepp'],
});
