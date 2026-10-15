import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('pennsylvania');
const rate = st.rate.flat ?? 0; // 3.07 %
const fed = K.P.early.penalty;
// Worked case: $40,000 from a 401(k) at 51, before the plan's retirement age, with $25,000 of contributions
// Pennsylvania already taxed as pay.
const amt = 40000, basis = 25000;
const ceiling = K.stateTax('pennsylvania', amt, 51, 0, true);
const above = amt - basis;

export default defineState({
  slug: 'pennsylvania',
  title: 'Pennsylvania Retirement Withdrawal Tax 2026: Basis First',
  description: `Pennsylvania retirement withdrawal tax 2026: an early 401(k) payout is taxed at ${K.pct(rate, 2)} only above the contributions already taxed; IRAs need no penalty.`,
  intro: `Pennsylvania taxed your 401(k) contributions when you earned them, so an early payout is taxed at ${K.pct(rate, 2)} only on the part above that basis, and the basis comes out first.`,
  resume: `Pennsylvania works backwards from most states. It never lets employees deduct their own retirement contributions: in the words of the Department of Revenue, "employee contributions to any retirement plan are always taxable as compensation." In exchange, the payout side is light. Retirement benefits from an eligible Pennsylvania plan are not taxable once the plan's own age or service conditions are met. A distribution before that point is taxable only to the extent it exceeds contributions already taxed, and the cost recovery method treats those contributions as coming out first. IRAs follow a federal test: the department considers a distribution exempt "so long as the taxpayer is not required to pay a penalty for early withdrawal." The rate is a flat ${K.pct(rate, 2)}, unchanged since 2004. Take ${K.usd(amt)} out of a 401(k) at 51 with ${K.usd(basis)} of taxed contributions inside: only ${K.usd(above)} is taxable, for ${K.usd(above * rate)} of Pennsylvania tax. The calculator above shows the ceiling of ${K.usd(ceiling.total)}, as if no basis existed.`,
  body: (h) => `
<h2>Taxed on the way in, so the way out is lighter</h2>
<p>Federal law lets a 401(k) deferral skip income tax in the year you earn it. Pennsylvania does not follow: it counts those deferrals as taxable compensation, and you have paid ${K.pct(rate, 2)} on them already. That history is your basis. When you take money out early, the department's guide says the distribution is taxable "to the extent that the distributions exceed previously taxed contributions", and adds that early distributions "are deemed to come from previously taxed contributions first."</p>
<p>The order matters a lot for an early retiree. A worker who deferred ${K.usd(basis)} over a career and now draws ${K.usd(amt)} at 51, before the plan's retirement age, has ${K.usd(basis)} that Pennsylvania will not tax again and ${K.usd(above)} of earnings above it. The state bill is ${K.usd(above * rate)}. The next withdrawal from the same plan has no basis left, so the full amount becomes taxable.</p>
${h.mini('state', { t: 'Pennsylvania ceiling on a 401(k) payout at 51', p: ['amt', 'age'], d: { sx: 'pennsylvania', age: 51, amt: 40000 } })}
<p>The calculator taxes the whole withdrawal, because it does not know your basis. Treat its figure as the most Pennsylvania can ask, and subtract the contributions you were taxed on to find the real bill.</p>
<h2>The plan's retirement age, not 59½</h2>
<p>For an employer plan, the exemption depends on the plan document: benefits are not taxable once you have retired under the plan's age or years-of-service conditions. Each plan writes its own conditions. If yours are met at 56, a payout at 56 is exempt in Pennsylvania even though the IRS keeps looking at 59½. Ask the plan administrator what the plan's retirement conditions are before counting on it. The department's guide names 401(a) plans, IRAs, Roth IRAs, SEPs and Keogh plans; it does not name 403(b) or 457(b) plans explicitly, and we have not seen how it treats them.</p>
<h2>IRAs: the federal penalty is the switch</h2>
<p>For an IRA the department uses a simpler signal. If the IRS does not charge its ${K.pct(fed, 0)} additional tax, Pennsylvania treats the distribution as exempt retirement income. That reaches the federal exceptions used in FIRE plans. A ${h.a('72t-calculator', '72(t) series of equal payments')} owes no federal penalty, so on the department's wording each payment of the series is exempt in Pennsylvania as well. An IRA withdrawal at 50 that does pay the federal penalty is taxable here above your previously taxed contributions, the same basis-first logic as above.</p>
<h2>Where it fits in a bridge plan</h2>
<p>At ${K.pct(rate, 2)}, Pennsylvania has the lowest single rate of the taxing states covered on this site, and the basis rule shrinks it further for long-time savers. The bigger cost in the bridge years is federal: compare the routes on the ${h.a('early-withdrawal-penalty-exceptions', 'exceptions page')} and the ${h.a('rule-of-55', 'rule of 55')} before choosing the account to draw.</p>
`,
  faqs: [
    { q: 'Why does Pennsylvania tax only part of my early 401(k) withdrawal?', a: `Pennsylvania taxed your 401(k) contributions as pay when you made them. An early distribution is taxable only above those previously taxed contributions, and the cost recovery method takes the contributions out first. With ${K.usd(basis)} of basis in a ${K.usd(amt)} payout, ${K.usd(above)} is taxable, about ${K.usd(above * rate)} at ${K.pct(rate, 2)}.` },
    { q: 'Is a 72(t) series from an IRA taxed in Pennsylvania?', a: `On the Department of Revenue's wording, no. It considers an IRA distribution exempt retirement income so long as no federal penalty for early withdrawal is owed. A properly run 72(t) series owes no federal ${K.pct(fed, 0)}, so its payments fall on the exempt side. If the series is broken and the IRS recaptures its penalty, that condition is no longer met.` },
    { q: 'Does Pennsylvania tax my 401(k) once I reach the plan’s retirement age?', a: 'No. Benefits from an eligible Pennsylvania retirement plan paid after you retire under the plan’s age or years-of-service conditions are not taxable. The test is the plan document, not age 59½, so a plan whose retirement conditions are met before 59½ opens the exemption earlier. Check the conditions with the plan administrator.' },
    { q: 'What flat rate does Pennsylvania apply to taxable retirement payouts in 2026?', a: `Pennsylvania's personal income tax rate is ${K.pct(rate, 2)}, the same since tax year 2004. It applies to the taxable part of an early plan or IRA distribution, that is the amount above contributions already taxed. There is no separate state penalty on early withdrawals.` },
  ],
  related: ['state-tax-on-retirement-withdrawals', '72t-calculator', 'early-withdrawal-penalty-exceptions', 'rule-of-55', '401k-early-withdrawal-calculator'],
});
