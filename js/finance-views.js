import { clamp, sum, localDate } from './finance-engine.js';
import { ANALYSIS_VIEWS, financePlanSummary, isAnalysisView, monthlyMoney, wellbeingPlan } from './money-flow.js';
import { analyzeCategoryBudgets, budgetCategoryLabel, suggestedCategoryLimits } from './category-budgets.js';
import { E, N, btn, canvas, categoryIcon, categoryList, dateText, formatMonth, formatVND, heading, icon, ledgerButton } from './ui-parts.js';

const money = formatVND;
const percent = (ratio) => Number.isFinite(ratio) ? `${N(ratio * 100)}%` : '—';
const incomeNames = {
  NO_INCOME: 'Chưa ghi thu nhập',
  COLD_START: 'Đang tìm hiểu thu nhập',
  STABLE: 'Thu nhập khá đều',
  MODERATE: 'Thu nhập thay đổi nhẹ',
  IRREGULAR: 'Thu nhập không đều',
};
const budgetStatus = {
  safe: ['safe', 'Đang trong kế hoạch'],
  notice: ['notice', 'Chi hơi nhanh'],
  warning: ['warning', 'Cần chậm nhịp chi'],
  danger: ['danger', 'Cần xem lại mức chi'],
};
const header = (title, subtitle = '', action = '') => `<div class="panel-header"><div><h2>${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ''}</div>${action}</div>`;
const navigation = (label, section, cls = 'text-link') => btn(label, 'open-analysis', cls, '', `data-section="${section}"`);
const planning = (label, section, cls = 'text-link', attrs = '') => btn(label, 'open-planning', cls, '', `data-section="${section}" ${attrs}`);
const detail = (title, body) => `<details class="finance-method"><summary>${title}</summary><div class="method-content">${body}</div></details>`;
const stat = (label, value, note = '', cls = '') => `<div class="finance-stat ${cls}"><span>${label}</span><strong class="money">${value}</strong>${note ? `<small>${note}</small>` : ''}</div>`;
const dayEnd = (month) => localDate(new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0, 12));

function wellbeingAction(next, cls = 'primary small') {
  const attrs = [next.debtId ? `data-id="${E(next.debtId)}"` : '', next.section ? `data-section="${E(next.section)}"` : ''].join(' ');
  return btn(next.label, next.action, cls, '', attrs);
}

function wellbeingGap(plan, a) {
  if (plan.next.gap === undefined) return '';
  if (a.health.level === 1) return `Chi sinh hoạt đang cao hơn thu nhập mới ${money(plan.next.gap)}.`;
  if (plan.next.debtId) return `${E(plan.next.debtName)} · còn ${money(plan.next.gap)} nợ gốc.`;
  return `Còn cần ${money(plan.next.gap)} để chạm mốc này.`;
}

export function renderWellbeing(data, a) {
  const p = wellbeingPlan(data, a), h = a.health;
  return `<section class="panel wellbeing-overview" id="health-overview" aria-label="Sức khỏe tài chính và bước tự chủ">
    <div class="wellbeing-rating">
      <div class="wellbeing-gauge ${p.score === null ? 'unrated' : ''}" style="--health-score:${p.score ?? 0}%" role="img" aria-label="${p.score === null ? 'Chưa đủ dữ liệu để chấm điểm' : `Sức khỏe tài chính ${N(p.score)} trên 100`}">
        <div><strong>${p.score === null ? '—' : N(p.score)}</strong><small>/ 100</small></div>
      </div>
      <div><h2>Sức khỏe tài chính</h2><strong class="wellbeing-label">${p.label}</strong><p>${p.ready ? `Mốc ${h.level}/5 · ${p.provisional ? 'Đánh giá tạm từ sổ hiện có' : 'Theo thu chi, quỹ và nợ đã ghi'}.` : 'Ghi thêm thu nhập và chi thiết yếu để đánh giá.'}</p></div>
    </div>
    <div class="wellbeing-next"><span class="eyebrow">TỪNG BƯỚC TỰ CHỦ TÀI CHÍNH</span><h3>${p.next.title}</h3>${p.next.gap !== undefined ? `<strong class="wellbeing-gap">${wellbeingGap(p, a)}</strong>` : ''}<p>${p.next.text}</p>${wellbeingAction(p.next)}</div>
    <div class="wellbeing-footer"><span>${icon('shield')}${p.hasEssentials ? `Quỹ hiện đủ khoảng <strong>${N(h.runwayMonths)}/${N(h.targetRunway)} tháng</strong> chi thiết yếu.` : 'Thêm chi phí sinh hoạt để ước tính thời gian quỹ có thể hỗ trợ.'}</span>${btn('Xem lộ trình và từng phần', 'open-health', 'text-link')}</div>
  </section>`;
}

function renderHealthDetails(data, a) {
  const p = wellbeingPlan(data, a), h = a.health, income = a.income, surplus = a.current.income - a.current.spent;
  const factors = [
    { title: 'Tiền dư sau sinh hoạt', score: h.scores.sSavings, weight: 25, note: surplus >= 0 ? `Còn ${money(surplus)} trước để dành và trả nợ${a.current.income > 0 ? ` (${percent(h.netSavingsRate)} thu nhập)` : ''}.` : `Chi sinh hoạt vượt thu nhập mới ${money(-surplus)}.`, link: navigation('Xem gợi ý giảm chi', 'cutbacks-section') },
    { title: 'Quỹ cho lúc cần gấp', score: h.scores.sRunway, weight: 30, note: p.hasEssentials ? `${money(data.profile.liquidSavings)} · khoảng ${N(h.runwayMonths)} tháng chi thiết yếu. ${p.reserveGap > 0 ? `Còn thiếu ${money(p.reserveGap)} để đủ ${N(h.targetRunway)} tháng.` : 'Đã đạt mốc quỹ gợi ý.'}` : 'Cần thêm chi thiết yếu để ước tính quỹ.', link: planning('Xem quỹ để dành', 'reserve-section') },
    { title: 'Hóa đơn vừa với thu nhập', score: h.scores.sFixed, weight: 20, note: `Đã ghi ${money(a.totalActiveFixedBills)} hóa đơn/tháng${income.yBase > 0 ? ` · ${percent(h.fixedCostRatio)} thu nhập làm căn cứ` : ''}.`, link: planning('Đối chiếu hóa đơn', 'bills-section') },
    { title: 'Kiểm soát nợ', score: h.scores.sDebt, weight: 15, note: data.debts.length ? `Còn ${money(sum(data.debts.map((d) => d.principal)))} nợ gốc; trả tối thiểu ${money(h.totalMinDebtPayments)}/tháng${income.yBase > 0 ? ` (${percent(h.dtiRatio)} thu nhập làm căn cứ)` : ''}.${h.hasHighInterestDebt ? ' Có nợ lãi trên 10%/năm.' : ''}` : 'Chưa có khoản nợ được ghi. Đối chiếu để đánh giá sát hơn.', link: planning('Đối chiếu nợ', 'debts-section') },
    { title: 'Mua sắm trong khả năng', score: h.scores.sControl, weight: 10, note: `${money(a.current.wants)} cho chi linh hoạt${income.yBase > 0 ? ` · ${percent(h.wantsRatio)} thu nhập làm căn cứ` : ''}.`, link: ledgerButton('Xem các khoản này', '', 'data-group="wants" data-scope="everyday"') },
  ];
  const milestoneStatus = (m) => {
    if (m.key === 'debt' && !m.known) return 'Chưa đối chiếu nợ';
    if (m.key === 'buffer' || m.key === 'reserve') {
      if (!m.known) return 'Cần thêm chi thiết yếu';
      const target = m.key === 'buffer' ? 1 : h.targetRunway, gap = m.key === 'buffer' ? p.oneMonthGap : p.reserveGap;
      return `${N(h.runwayMonths)} / ${N(target)} tháng${m.done ? ' · Đã đạt' : ` · Thiếu ${money(gap)}`}`;
    }
    if (m.done) return 'Đã đạt theo dữ liệu hiện có';
    if (!m.known) return 'Cần thêm ghi chép';
    if (m.key === 'surplus') return `${p.surplusMonths}/3 tháng có dư sau sinh hoạt`;
    if (m.key === 'balance') return `${money(Math.max(0, -surplus))} chi vượt thu mới`;
    return 'Đang xây nền tảng';
  };
  return `<section class="panel health-details" id="health-analysis">
    ${header('Sức khỏe tài chính', p.score === null ? 'Hoàn thiện sổ trước khi đánh giá.' : `${N(p.score)}/100 · ${p.label} · Mốc ${h.level}/5${p.provisional ? ' · Đánh giá tạm' : ''}`, navigation('Xem kế hoạch tháng', 'monthly-plan-section', 'secondary small'))}
    <div class="health-detail-columns">
      <div><h3>Điểm sức khỏe đến từ đâu?</h3><div class="health-factor-list">
        ${factors.map((f) => `<article class="health-factor"><div class="health-factor-heading"><strong>${f.title}</strong><span>${p.ready ? `${N(f.score, 0)}/100` : '—'}</span></div><div class="health-factor-bar" aria-hidden="true"><i style="width:${p.ready ? clamp(f.score, 0, 100) : 0}%"></i></div><p>${f.note}</p>${f.link}</article>`).join('')}
      </div></div>
      <div class="independence-path"><h3>Lộ trình tự chủ tài chính</h3><p class="helper-text">Xây từng nền tảng để ít phải lo về tiền hơn.</p>
        ${p.milestones.map((m) => `<article class="independence-milestone ${m.done ? 'complete' : ''}"><span class="milestone-icon">${icon(m.done ? 'check' : 'target')}</span><div><h4>${m.title}</h4><span class="milestone-status">${milestoneStatus(m)}</span>${btn(m.label, m.action, 'text-link', '', `data-section="${m.section}"`)}</div></article>`).join('')}
        <div class="next-milestone"><span class="eyebrow">ƯU TIÊN HIỆN TẠI</span><h3>${p.next.title}</h3><p>${wellbeingGap(p, a) || p.next.text}</p>${wellbeingAction(p.next)}</div>
      </div>
    </div>
    ${p.hasEssentials ? `<div class="finance-callout">${icon('shield')}<div><strong>Mốc quỹ: ${money(p.target)}</strong><p>Dựa trên khoảng ${money(h.essentialMonthly)} chi thiết yếu/tháng và mục tiêu ${N(h.targetRunway)} tháng${h.totalMinDebtPayments ? ', chưa gồm tiền trả nợ' : ''}. Quỹ hiện có ${money(data.profile.liquidSavings)}.</p></div>${planning('Xem quỹ', 'reserve-section')}</div>` : ''}
    <p class="fine-print">Điểm cao cho thấy nền tảng tốt hơn; chưa có nghĩa là đã đủ tiền sống lâu dài mà không cần thu nhập. Khi xem tháng cũ, quỹ và nợ vẫn dùng số dư hiện đang lưu.</p>
    ${detail('Điểm sức khỏe được tính thế nào?', `<p>Điểm sức khỏe (FHI) là tổng điểm thành phần theo trọng số: ${factors.map((f) => `${f.title.toLowerCase()} ${f.weight}%`).join(', ')}.</p><p>Thứ tự ưu tiên của ứng dụng: cân bằng thu chi, xây một tháng quỹ đệm, xử lý nợ lãi cao, làm dày quỹ, rồi duy trì nền tảng. Phân bổ tiền được điều chỉnh theo cấp này.</p><p>Chi thiết yếu mỗi tháng được ước tính từ tối đa sáu tháng đã kết thúc, hoặc phần chi đã ghi nếu chưa có lịch sử. Mục tiêu quỹ là ${N(h.targetRunway)} tháng theo kiểu thu nhập. Tiền cọc, tiền được hoàn và tiền chuyển quỹ không làm sai số thu nhập hay chi sinh hoạt.</p>`)}
  </section>`;
}

/** Small overview cards are direct entrances to the full model, not a second budget calculation. */
export function renderPlanHighlights(data, a, monthly = monthlyMoney(data, a)) {
  const p = financePlanSummary(data, a, monthly);
  const cards = [
    ['Chi theo kế hoạch / ngày', p.canPlan ? money(a.safe.dailySafeToSpend) : '—', p.canPlan ? 'Sau hóa đơn và mục tiêu để dành' : 'Cần ghi thu nhập', 'budget-section'],
    ['Dự báo chi cuối tháng', p.canForecast ? money(a.forecast.blendedEomForecast) : '—', 'Chi sinh hoạt, gồm hóa đơn', 'forecast-section'],
    ['Nên để dành & trả nợ', p.canPlan ? money(p.target) : '—', p.canPlan ? `${money(a.safe.savingsTargetDaily)}/ngày` : 'Chưa có mức thu nhập làm căn cứ', 'savings-section'],
  ];
  return `<section class="panel plan-highlights" aria-label="Phân tích tài chính nhanh">
    ${header('Kế hoạch tài chính', p.provisional ? 'Tạm tính theo ghi chép hiện có.' : 'Gợi ý theo thu nhập và thói quen đã ghi.', navigation('Xem kế hoạch đầy đủ', 'monthly-plan-section', 'secondary small'))}
    <div class="plan-highlight-grid">${cards.map(([label, value, note, section]) => `<button class="plan-highlight-item" data-action="open-analysis" data-section="${section}"><span>${label}</span><strong class="money">${value}</strong><small>${note}</small></button>`).join('')}</div>
    <p class="fine-print">Mức chi theo thu nhập khác với số tiền thực còn trong ví; bấm từng mục để xem cách tính.</p>
  </section>`;
}

function renderIncome(a, p) {
  const i = a.income;
  return `<section class="panel finance-panel">
    ${header('Thu nhập để lập kế hoạch', incomeNames[i.mode] || 'Đang theo dõi', planning('Chỉnh cách nhận thu nhập', 'profile-form'))}
    <div class="finance-stat-row two">${stat('Mức thu nhập làm căn cứ / tháng', p.canPlan ? money(i.yBase) : '—', `Dựa trên ${i.months} tháng đã ghi`)}${stat('Thu nhập mới đã ghi tháng này', money(a.current.income), 'Không gồm tiền có sẵn đầu tháng và tiền hoàn')}</div>
    ${p.provisional ? '<p class="insight-note">Sổ còn ít tháng. Mức gợi ý có thể thay đổi nhiều khi bạn ghi thêm thu nhập hoặc chi phí.</p>' : ''}
    ${i.mode === 'IRREGULAR' && i.surplusForBuffer > 0 ? `<div class="finance-callout">${icon('shield')}<div><strong>Phần thu vượt mức căn cứ: ${money(i.surplusForBuffer)}</strong><p>Cân nhắc giữ phần dư cho những tháng ít thu hơn.</p></div>${btn('Ghi chuyển quỹ', 'reserve-in', 'secondary small')}</div>` : ''}
    ${detail('Cách chọn mức thu nhập', `<p>Ứng dụng nhìn tối đa 12 tháng: thu nhập đều dùng trung bình, thu nhập không đều dùng mức thận trọng hơn. Tháng chưa ghi trong lịch sử có thể được tính là 0. Có thể chọn cách nhận thu nhập ở cài đặt quỹ.</p><p>${i.cv === null ? 'Chưa đủ ba tháng để đo mức dao động thu nhập.' : `Mức dao động so với trung bình: ${percent(i.cv)}.`}</p>`)}
  </section>`;
}

function renderBudget(a, m, p) {
  const s = a.safe, status = budgetStatus[s.status], remaining = s.remainingVariablePool, hasCash = m.daily !== null;
  return `<section class="panel finance-panel" id="budget-section">
    ${header('Hạn mức chi tiêu theo ngày', `Còn ${s.daysLeft} ngày trong tháng, tính cả ngày đang xem.`, p.canPlan ? `<span class="badge ${status[0]}">${status[1]}</span>` : '')}
    <div class="finance-stat-row two">
      ${stat('Theo kế hoạch thu nhập', p.canPlan ? `${money(s.dailySafeToSpend)}/ngày` : '—', p.canPlan ? remaining >= 0 ? `Ngân sách còn ${money(remaining)}` : `Đã vượt ngân sách ${money(-remaining)}` : 'Cần ghi thu nhập', 'plan-emphasis')}
      ${stat('Tiền thực tạm chia / ngày', hasCash ? money(m.daily) : '—', hasCash ? `Đã giữ ${money(m.reserved)} cho hóa đơn và mức trả nợ còn thiếu` : 'Chưa có tiền đầu tháng')}
    </div>
    ${p.canPlan ? `<div class="budget-equation"><span>Thu nhập căn cứ<strong>${money(a.income.yBase)}</strong></span><span>− Hóa đơn cả tháng<strong>${money(a.totalActiveFixedBills)}</strong></span><span>− Để dành, trả nợ<strong>${money(s.savingsTargetMonthly)}</strong></span><span>= Quỹ chi ngoài hóa đơn<strong>${money(s.variableBudgetTotal)}</strong></span></div>
      <div class="budget-progress"><div><span>Đã chi ngoài hóa đơn</span><strong>${money(a.current.variable)} / ${money(s.variableBudgetTotal)}</strong></div><div class="finance-progress ${s.status}"><i style="width:${s.variableBudgetTotal > 0 ? clamp(a.current.variable / s.variableBudgetTotal * 100, 0, 100) : a.current.variable > 0 ? 100 : 0}%"></i></div><p>${s.variableBudgetTotal > 0 ? `Nhịp chi đang bằng ${percent(s.variableBurnRatio)} mức chi đều theo số ngày đã qua.` : 'Kế hoạch không còn phần chi ngoài hóa đơn.'} ${remaining < 0 ? 'Xem những khoản có thể giảm để hạn chế dùng tiền có sẵn.' : ''}</p></div>` : '<p class="helper-text">Thêm khoản thu nhập thực nhận hoặc lịch sử thu nhập để tính hạn mức theo kế hoạch.</p>'}
    ${p.canPlan || p.canForecast ? `<div class="finance-chart-title"><h3>Nhịp chi so với kế hoạch</h3><p>Tiền chi hằng ngày cộng dồn qua các ngày, không gồm hóa đơn cố định; đơn vị: triệu đồng.</p></div>${canvas('daily-chart', 'Chi ngoài hóa đơn cộng dồn từng ngày và mức chi đều theo kế hoạch')}` : ''}
    <div class="finance-action-row">${ledgerButton('Xem chi ngoài hóa đơn', '', 'data-scope="variable"', 'secondary small')}${navigation('Xem gợi ý giảm chi', 'cutbacks-section')}${hasCash ? '' : btn('Điền tiền đầu tháng', 'open-opening', 'text-link')}</div>
    ${detail('Vì sao có hai hạn mức?', `<p>Mức theo thu nhập lấy mức thu nhập làm căn cứ, trừ hóa đơn cả tháng, mục tiêu để dành/trả nợ và chi ngoài hóa đơn đã ghi, rồi chia số ngày còn lại. Mức tiền thực lấy tiền hiện còn, trừ hóa đơn chưa trả và mức trả nợ tháng này còn thiếu, rồi chia số ngày còn lại.</p><p>Hai con số trả lời hai câu hỏi khác nhau. Cả hai chỉ dựa trên những khoản bạn đã khai báo, không dự đoán thu nhập tương lai chưa ghi.</p>`)}
  </section>`;
}

function renderSavingsAndAllocation(data, a, p) {
  const colors = ['#247a58', '#a9c5b3', '#d2a265'], targetText = p.canPlan ? money(p.target) : '—';
  return `<div class="finance-grid">
    <section class="panel finance-panel" id="allocation-section">
      ${header('Chia thu nhập theo mục đích', 'Tỷ lệ gợi ý thay đổi theo sức khỏe và hóa đơn của bạn.')}
      ${p.canPlan ? `<div class="allocation-track" role="img" aria-label="${p.allocation.map((r) => `${r.label} ${percent(r.ratio)}`).join(', ')}">${p.allocation.map((r, i) => `<span style="width:${r.ratio * 100}%;background:${colors[i]}"></span>`).join('')}</div>
        <div class="allocation-table">${p.allocation.map((r, i) => `<article><div><span class="allocation-dot" style="background:${colors[i]}"></span><strong>${r.label}</strong><span class="badge">${percent(r.ratio)}</span></div><div class="allocation-values"><span>Kế hoạch <b>${money(r.plan)}</b></span><span>Đã ghi <b>${money(r.actual)}</b></span></div>${ledgerButton('Xem đã ghi', '', r.group === 'savings_debt' ? 'data-scope="contribution"' : `data-group="${r.group}" data-scope="everyday"`)}</article>`).join('')}</div>` : '<p class="helper-text">Có thu nhập làm căn cứ sẽ hiện tỷ lệ và số tiền từng nhóm.</p>'}
      <p class="fine-print">Đây là phân bổ gợi ý, khác tổng tiền thực đang có. Nhóm để dành và trả nợ tính cả tiền lãi đã trả.</p>
    </section>
    <section class="panel finance-panel" id="savings-section">
      ${header('Mục tiêu để dành & trả nợ', 'Theo dõi phần bạn thực sự dành ra từ sổ thu chi.')}
      <div class="finance-stat-row two">
        ${stat('Mục tiêu cả tháng', targetText, p.canPlan ? `Tương đương ${money(a.safe.savingsTargetDaily)}/ngày` : 'Chưa có mức thu nhập làm căn cứ')}
        ${stat('Đã dành & trả nợ (ròng)', money(p.contributions), 'Gồm chuyển quỹ, trả nợ và khoản để dành đã ghi')}
      </div>
      ${p.progress !== null ? `<div class="budget-progress"><div><span>Tiến độ mục tiêu</span><strong>${N(p.progress, 0)}%</strong></div><div class="finance-progress safe"><i style="width:${p.progress}%"></i></div><p>${p.contributionGap > 0 ? `Còn thiếu ${money(p.contributionGap)} để đạt mục tiêu tháng.` : 'Đã đạt mục tiêu theo các khoản đã ghi.'}</p></div>` : ''}
      <div class="finance-action-row">${btn('Ghi chuyển quỹ', 'reserve-in', 'secondary small', 'plus')}${ledgerButton('Xem tiền đã dành', '', 'data-scope="contribution"')}</div>
      <p class="fine-print">Số đầu kỳ của quỹ không tính lại vào tiến độ. Tiền rút khỏi quỹ được trừ khỏi số đã dành ròng.</p>
    </section>
  </div>`;
}

function renderCutbacks(a, p) {
  const plan = a.cutbacks, actions = plan.actions, cut = sum(actions.map((c) => c.suggestedCut));
  const ref = a.history.length ? a.history.slice(-6) : [a.current];
  const range = `data-all-months="true" data-from="${ref[0].month}-01" data-through="${a.history.length ? dayEnd(ref.at(-1).month) : a.today}" data-group="wants"`;
  return `<section class="panel finance-panel" id="cutbacks-section">
    ${header('Có thể giảm ở đâu?', 'Gợi ý thay đổi từng khoản để gần mục tiêu hơn.')}
    ${p.canPlan && p.canForecast ? `<div class="finance-stat-row three">${stat('Dự kiến dư sau sinh hoạt', money(plan.projectedSurplus))}${stat('Còn thiếu so với mục tiêu', money(plan.savingsGap))}${stat('Có thể giảm theo gợi ý', money(cut))}</div>
      ${plan.savingsGap === 0 ? '<p class="insight-note">Dự báo khoản dư đủ đạt mục tiêu tháng này. Tiếp tục theo dõi chi tiêu thực tế.</p>' : actions.length ? `<div class="table-scroll cutback-table"><table><thead><tr><th>Danh mục</th><th class="align-right">Mức trung bình</th><th class="align-right">Gợi ý giảm</th><th class="align-right">Mức mới/tháng</th><th class="align-right">Dành thêm/ngày</th><th></th></tr></thead><tbody>${actions.map((c) => `<tr><td><strong>${E(c.category)}</strong></td><td class="align-right money">${money(c.currentAvg)}</td><td class="align-right money amount-income">${money(c.suggestedCut)}<small class="table-secondary">${N(c.cutPct)}%</small></td><td class="align-right money">${money(c.newCap)}</td><td class="align-right money">${money(c.dailySaveGain)}</td><td>${ledgerButton('Xem khoản', c.category, range, 'ghost small')}</td></tr>`).join('')}</tbody></table></div>` : '<p class="helper-text">Chưa có danh mục chi linh hoạt đủ lớn để đề xuất mức giảm.</p>'}
      ${plan.unmetGap > 0 ? `<div class="finance-callout caution">${icon('alert')}<div><strong>Còn ${money(plan.unmetGap)} cần xử lý</strong><p>Xem lại hóa đơn, khoản linh hoạt hoặc phần thu nhập có thể bổ sung.</p></div>${planning('Xem hóa đơn', 'bills-section')}</div>` : ''}
      <p class="fine-print">${a.history.length ? `Mức trung bình lấy từ ${ref.length} tháng đã kết thúc.` : 'Tạm tính theo khoản chi đã ghi tháng này.'} Mức giảm là gợi ý cho cả tháng, không phải số bắt buộc phải giảm ngay.${p.provisional ? ' Cập nhật thêm lịch sử để gợi ý ổn định hơn.' : ''}</p>` : '<p class="helper-text">Cần cả thu nhập và chi sinh hoạt để tính phần còn thiếu so với mục tiêu.</p>'}
    ${detail('Cách gợi ý mức giảm', '<p>So sánh thu nhập làm căn cứ trừ dự báo chi sinh hoạt với mục tiêu để dành/trả nợ. Chỉ gợi ý giảm các danh mục linh hoạt, mỗi mức là bội số 50.000 ₫, tối đa 35% mức trung bình và không vượt phần còn thiếu.</p>')}
  </section>`;
}

export function renderDebtSimulation(plan) {
  if (!plan.orderedDebts.length) return '<p class="insight-note">Thêm khoản nợ để ước tính thời gian trả hết và số tiền lãi.</p>';
  const rows = [['Chỉ trả tối thiểu', plan.baseline], ['Trả thêm theo mức vừa chọn', plan.accelerated]];
  return `<div class="table-scroll debt-comparison"><table><thead><tr><th>Cách trả</th><th class="align-right">Thời gian</th><th class="align-right">Tổng lãi dự kiến</th></tr></thead><tbody>${rows.map(([label, result]) => `<tr><td>${label}</td><td class="align-right">${result.paidOff ? `${result.months} tháng` : 'Chưa trả hết'}</td><td class="align-right money">${result.paidOff ? money(result.interest) : '—'}</td></tr>`).join('')}</tbody></table></div>
    ${plan.interestSaved === 0 && plan.baseline.months === plan.accelerated.months ? '<p class="insight-note">Mức trả thêm đang chọn chưa thay đổi kết quả so với chỉ trả tối thiểu.</p>' : plan.interestSaved !== null ? `<p class="insight-note">Có thể giảm khoảng <strong>${money(plan.interestSaved)}</strong> tiền lãi${plan.baseline.months > plan.accelerated.months ? ` và rút ngắn ${plan.baseline.months - plan.accelerated.months} tháng` : ''}.</p>` : !plan.accelerated.paidOff ? '<p class="insight-note">Chưa thể tất toán với mức trả đang chọn. Thử thay đổi số trả thêm.</p>' : '<p class="insight-note">Phương án trả thêm có thể tất toán; chưa so sánh được tiền lãi với mức trả tối thiểu.</p>'}`;
}

function renderDebtAdvice(a, p) {
  return `<section class="panel finance-panel" id="debt-advice-section">
    ${header('Kế hoạch giảm nợ', 'Ước tính theo khoản nợ, lãi suất và mức trả bạn đã nhập.', planning('Thử mức trả khác', 'debt-simulation-section', 'secondary small', `data-extra="${p.extraDebt}"`))}
    ${a.debtPlan.orderedDebts.length ? `<div class="finance-stat-row two">${stat('Trả tối thiểu mỗi tháng', money(a.health.totalMinDebtPayments))}${stat('Phần trả thêm đang mô phỏng', money(p.extraDebt), p.canPlan ? 'Từ mục tiêu để dành/trả nợ, sau mức tối thiểu' : 'Chưa có thu nhập làm căn cứ')}</div>${renderDebtSimulation(a.debtPlan)}<p class="fine-print">Ưu tiên nợ lãi cao. Đây là mô phỏng, dùng hết phần trả thêm đã đặt; hãy chọn mức phù hợp với tiền thực và quỹ của bạn. Chưa tính phí hoặc thay đổi lãi suất.</p>` : '<p class="helper-text">Chưa có dư nợ đang theo dõi. Nếu còn vay, bổ sung khoản nợ để ứng dụng tính kế hoạch.</p>'}
    ${planning('Đối chiếu các khoản nợ', 'debts-section')}
  </section>`;
}

const limitBadges = {
  unset: ['Chưa đặt mức', ''],
  over: ['Vượt mức', 'danger'],
  bills: ['Thiếu cho hóa đơn', 'warning'],
  full: ['Hết mức', 'warning'],
  fast: ['Chi hơi nhanh', 'warning'],
  near: ['Sắp hết mức', 'warning'],
  within: ['Trong mức', 'safe'],
};

function limitAdvice(row, a) {
  if (row.status === 'unset') return 'Chọn mức chi phù hợp cho cả tháng.';
  if (row.nextBill) return `Chừa ${money(row.unpaid)} cho hóa đơn. Kỳ gần nhất ngày ${Math.min(row.nextBill.dueDay, a.daysInMonth)}.`;
  if (row.status === 'over' || row.status === 'full') return row.essential ? 'Kiểm tra khoản đã ghi và phần thiết yếu còn cần.' : 'Xem khoản có thể bớt hoặc dời sang tháng sau.';
  if (row.perDay !== null) return `Tạm chia ${money(row.perDay)}/ngày cho ${row.daysLeft} ngày còn lại tính từ mốc sổ.`;
  if (row.status === 'near') return 'Xem các khoản còn cần trong tháng.';
  return 'Theo dõi tiếp các khoản đã dự tính.';
}

function budgetLedgerLink(label, row, scope) {
  return btn(label, 'open-ledger', 'text-link', '', `data-category="${E(row.category)}" data-scope="${scope}"`);
}

function renderLimitRow(row, a, trial) {
  const [status, tone] = limitBadges[row.status];
  const changed = row.limit !== null || row.eventLimit !== null;
  const event = row.eventSpent || row.eventLimit !== null;
  const eventDetails = row.eventRemaining === null ? 'Chưa dự trù' : row.eventRemaining < 0 ? `Vượt dự trù ${money(-row.eventRemaining)}` : `Còn ${money(row.eventRemaining)} theo dự trù`;
  const difference = row.afterBills === null ? '—' : row.remaining < 0 ? `Vượt ${money(-row.remaining)}` : row.afterBills < 0 ? `Thiếu ${money(-row.afterBills)}` : money(row.afterBills);
  return `<tr>
    <th scope="row"><strong>${E(budgetCategoryLabel(row.category))}</strong>${row.unpaid ? `<small class="table-secondary">Hóa đơn còn ${money(row.unpaid)}</small>` : ''}</th>
    <td class="align-right money">${money(row.spent)}${row.fixedSpent ? `<small class="table-secondary">Đã trả hóa đơn ${money(row.fixedSpent)}</small>` : ''}${event ? `<small class="table-secondary">Theo lần ${money(row.eventSpent)}</small>` : ''}</td>
    <td class="align-right money">${row.limit === null ? (trial ? `<small class="table-secondary">Thử ${money(trial.limit)}</small>` : '—') : money(row.limit)}${row.eventLimit !== null ? `<small class="table-secondary">Theo lần ${money(row.eventLimit)}</small>` : ''}</td>
    <td class="align-right"><strong class="money ${row.afterBills < 0 ? 'amount-expense' : ''}">${difference}</strong><span class="badge ${tone}">${status}</span></td>
    <td><p>${limitAdvice(row, a)}</p>${event ? `<small class="table-secondary">Khoản theo lần · ${eventDetails}</small>` : ''}
      <div class="category-limit-links">${row.spent ? budgetLedgerLink('Xem đã chi', row, 'budget-routine') : ''}${row.eventSpent ? budgetLedgerLink('Xem khoản theo lần', row, 'budget-event') : ''}${btn(changed ? 'Chỉnh mức' : 'Đặt mức', 'edit-category-limit', 'text-link', '', `data-category="${E(row.category)}"`)}</div>
    </td>
  </tr>`;
}

function renderCategoryLimits(data, a, m) {
  const rows = analyzeCategoryBudgets(data, a, m);
  const suggestions = suggestedCategoryLimits(rows);
  const trials = new Map(suggestions.map((entry) => [entry.category, entry]));
  const configured = rows.some((row) => row.limit !== null || row.eventLimit !== null);
  const total = sum(rows.map((row) => row.limit ?? 0));
  const events = sum(rows.map((row) => row.eventLimit ?? 0));
  const debt = a.health.totalMinDebtPayments;
  const difference = total + events + debt - a.income.yBase;
  return `<section class="panel finance-panel" id="category-limits-section">
    ${header('Mức chi theo danh mục', m.latest ? `Theo sổ đến ${dateText(m.latest)}. Số còn lại đã chừa cho hóa đơn chưa trả.` : 'Đặt mức cho từng nhóm bạn muốn theo dõi.', `<div class="finance-action-row">${suggestions.length ? btn('Dùng mức thử', 'use-category-trials', 'primary small') : ''}${btn('Thêm mức chi', 'edit-category-limit', 'secondary small', 'plus')}</div>`)}
    ${configured ? `<p class="category-limit-summary"><strong>${money(total)}</strong> mức chi thường xuyên${events ? ` · <strong>${money(events)}</strong> dự trù theo lần` : ''}${debt ? ` · <strong>${money(debt)}</strong> trả nợ tối thiểu` : ''}</p>` : ''}
    ${configured && a.income.yBase > 0 && difference > 0 ? `<p class="insight-note">Tổng mức đã đặt và trả nợ cao hơn thu nhập làm căn cứ ${money(difference)}. Kiểm tra mức thu và phần chi linh hoạt trước khi dùng hết ngân sách.</p>` : ''}
    ${rows.length ? `<div class="table-scroll category-limit-table"><table><thead><tr><th>Danh mục</th><th class="align-right">Đã chi</th><th class="align-right">Mức tháng</th><th class="align-right">Còn lại</th><th>Việc nên làm</th></tr></thead><tbody>${rows.map((row) => renderLimitRow(row, a, trials.get(row.category))).join('')}</tbody></table></div>` : '<p class="helper-text">Thêm mức chi hoặc ghi giao dịch để thấy danh mục ở đây.</p>'}
    ${rows.some((row) => row.eventSpent) ? '<p class="fine-print">Khoản theo lần vẫn tính vào số dư. Bạn có thể dùng gợi ý từ ghi chú hoặc chọn cách tính khi sửa khoản đã ghi.</p>' : ''}
  </section>`;
}

function renderPlanAnalysis(data, a, m, p) {
  return `<div class="analysis-stack" id="monthly-plan-section">${renderCategoryLimits(data, a, m)}${renderBudget(a, m, p)}${renderSavingsAndAllocation(data, a, p)}${renderCutbacks(a, p)}${renderIncome(a, p)}${renderDebtAdvice(a, p)}</div>`;
}

function renderForecast(a, p) {
  const f = a.forecast, plan = a.cutbacks;
  const methods = ['Dựa vào nhịp chi đang ghi', 'Dựa thêm vào 1–2 tháng trước', 'Dựa vào xu hướng qua các tháng', 'Dựa thêm vào mùa vụ trong năm'];
  return `<section class="panel finance-panel" id="forecast-section">
    ${header('Dự báo đến cuối tháng', methods[f.tierIndex], navigation('Xem cách điều chỉnh', 'cutbacks-section', 'secondary small'))}
    <div class="finance-stat-row three">
      ${stat('Chi sinh hoạt đã ghi', money(a.current.spent))}
      ${stat('Chi sinh hoạt dự kiến', p.canForecast ? money(f.blendedEomForecast) : '—', 'Gồm hóa đơn đã trả và chưa trả', 'plan-emphasis')}
      ${stat('Dự kiến dư theo thu nhập', p.canPlan && p.canForecast ? money(plan.projectedSurplus) : '—', 'Trước để dành và trả nợ')}
    </div>
    ${p.canForecast ? `<div class="forecast-basis"><span>Ước theo nhịp chi hiện tại <strong>${money(f.intramonthProj)}</strong></span>${f.tierIndex > 0 ? `<span>Ước theo lịch sử <strong>${money(f.histForecast)}</strong></span>` : ''}${f.tierIndex >= 2 ? `<span>Xu hướng từ lịch sử/tháng <strong>${f.trendPerMonth >= 0 ? '+' : ''}${money(f.trendPerMonth)}</strong></span>` : ''}</div>` : '<p class="helper-text">Ghi thêm chi phí hoặc hóa đơn để có dự báo chi sinh hoạt.</p>'}
    ${p.canPlan && p.canForecast && plan.savingsGap > 0 ? `<p class="insight-note">Còn thiếu khoảng ${money(plan.savingsGap)} so với mục tiêu để dành và trả nợ. Xem kế hoạch để chọn khoản có thể giảm.</p>` : ''}
    ${detail('Dự báo được tính thế nào?', `<p>Phối hợp ước tính theo ngày đã qua trong tháng và lịch sử các tháng đã kết thúc. Hóa đơn được tính một lần. Phần chi cọc, chuyển quỹ và trả nợ được theo dõi riêng, không cộng vào dự báo sinh hoạt.</p><p>Phương pháp đang dùng: ${E(f.tier)}. Số tháng lịch sử: ${a.history.length}. Dự báo thay đổi mỗi khi bạn cập nhật sổ.</p>`)}
  </section>`;
}

function renderDeposits(m, a) {
  const linked = m.deposits.filter((d) => d.date.startsWith(a.month) || d.remaining > 0 || m.rows.some((t) => t.flow?.targetId === d.id));
  return `<section class="panel finance-panel" id="deposit-section">
    ${header('Cọc và tiền được hoàn', 'Vẫn tính đúng tiền ra vào, tách khỏi thu nhập và chi sinh hoạt.', btn('Ghi tiền cọc', 'new-deposit', 'secondary small', 'plus'))}
    ${linked.length ? `<div class="deposit-list">${linked.map((d) => `<article class="deposit-row"><div><h3>${E(d.note || d.category)}</h3><p>Cọc ${money(d.amount)} · Đã nhận lại ${money(d.refunded)}</p></div><span class="badge ${d.remaining ? 'warning' : 'safe'}">${d.remaining ? `Chờ ${money(d.remaining)}` : 'Đã nhận đủ'}</span><div class="row-actions">${d.remaining ? btn('Ghi nhận hoàn', 'refund-deposit', 'secondary small', '', `data-id="${E(d.id)}"`) : ''}${btn('Xem', 'edit-transaction', 'ghost small', '', `data-id="${E(d.id)}"`)}</div></article>`).join('')}</div>` : '<p class="helper-text">Khi ghi cọc, chọn “Tiền cọc chờ hoàn”. Lúc nhận lại, chọn khoản cọc để thấy số còn chờ.</p>'}
    ${m.unmatchedRefunds.length ? `<div class="compact-note">Có ${m.unmatchedRefunds.length} khoản hoàn chưa liên kết. ${btn('Chọn khoản cọc', 'edit-transaction', 'ghost small', '', `data-id="${E(m.unmatchedRefunds[0].id)}"`)}</div>` : ''}
  </section>`;
}

function renderCashflowAnalysis(data, a, m, p) {
  const top = m.categories[0];
  return `<div class="analysis-stack">
    <section class="panel finance-panel">
      ${header('Thu chi tháng đang xem', 'Cộng từ từng khoản bạn đã ghi.')}
      <div class="finance-stat-row three">
        ${stat('Thu nhập mới', money(m.earned), 'Không gồm số dư đầu tháng và tiền hoàn') }
        ${stat('Chi sinh hoạt', money(m.everyday), 'Không gồm cọc, chuyển quỹ và trả nợ')}
        ${stat('Thu trừ chi sinh hoạt', money(m.earned - m.everyday), 'Trước để dành và trả nợ', 'plan-emphasis')}
      </div>
      <div class="budget-equation cash-equation"><span>Tiền đầu tháng<strong>${m.opening ? money(m.opening.bank + m.opening.cash) : 'Chưa điền'}</strong></span><span>+ Thực nhận<strong>${money(m.received)}</strong></span><span>− Thực chi<strong>${money(m.paid)}</strong></span><span>= Tiền còn dùng<strong>${m.available === null ? '—' : money(m.available)}</strong></span></div>
      <div class="finance-action-row">${ledgerButton('Xem thu nhập mới', '', 'data-scope="earned"', 'secondary small')}${ledgerButton('Xem sổ thu chi')}${btn('Đối chiếu tiền đầu tháng', 'open-opening', 'text-link')}</div>
    </section>
    ${renderForecast(a, p)}
    <section class="panel finance-panel" id="spending-section">
      ${header('Tiền đã chi vào đâu?', top ? `${E(top.category)} chiếm ${percent(top.amount / m.everyday)} tiền sinh hoạt.` : 'Bổ sung chi tiêu để xem từng danh mục.', navigation('Xem gợi ý giảm chi', 'cutbacks-section'))}
      ${m.categories.length ? `<div class="category-analysis-layout"><div class="category-visual">${canvas('category-chart', 'Tỷ trọng chi sinh hoạt theo danh mục')}<div class="category-visual-total"><span>Tổng sinh hoạt</span><strong>${money(m.everyday)}</strong></div></div><div>${categoryList(m, m.categories.length)}</div></div><p class="fine-print">Bấm một danh mục để xem đúng các khoản tạo nên số tiền đó.</p>` : '<p class="helper-text">Chưa có khoản chi sinh hoạt trong tháng.</p>'}
    </section>
    <section class="panel finance-panel" id="income-history-section">
      ${header('Thu chi qua các tháng', 'Đơn vị biểu đồ: triệu đồng.')}
      ${canvas('cashflow-chart', 'Thu nhập mới, chi sinh hoạt và dự báo cuối tháng')}
      <div class="table-scroll monthly-history"><table><thead><tr><th>Tháng</th><th class="align-right">Thu nhập mới</th><th class="align-right">Chi sinh hoạt</th><th class="align-right">Thu trừ chi</th><th></th></tr></thead><tbody>${p.recentMonths.map((month) => `<tr><td><strong>${formatMonth(month.month)}</strong>${month.month === a.month ? '<small class="table-secondary">Đang xem</small>' : ''}</td><td class="align-right money">${money(month.income)}</td><td class="align-right money">${money(month.spent)}</td><td class="align-right money ${month.income >= month.spent ? 'amount-income' : 'amount-expense'}">${money(month.income - month.spent)}</td><td>${ledgerButton('Xem thu chi', '', `data-month="${month.month}" data-scope="operating"`, 'ghost small')}</td></tr>`).join('')}</tbody></table></div>
      <p class="fine-print">Chỉ dùng số liệu đã ghi, tháng có khoảng trống được tính 0 trong mô hình. Tháng hiện tại chưa kết thúc được ghi theo số thực đến hôm nay.</p>
    </section>
    ${renderDeposits(m, a)}
  </div>`;
}

function renderPayday(data, a) {
  const d = a.payday, available = d.psi !== null, ratio = !available ? 'Chưa đủ dữ liệu' : Number.isFinite(d.psi) ? `${N(d.psi)} lần` : 'Chỉ ghi chi trong kỳ';
  const scoped = `data-scope="payday" data-all-months="true" data-from="${d.start || a.today}" data-through="${a.today}"`;
  return `<section class="panel finance-panel" id="payday-section">
    ${header('Chi sau ngày nhận tiền', `So sánh 5 ngày kể từ ngày ${data.profile.paydayDay} với những ngày còn lại.`, `<span class="badge ${!available ? 'notice' : d.warning ? 'warning' : 'safe'}">${!available ? 'Đang thu thập' : d.warning ? 'Cần chú ý' : 'Khá cân bằng'}</span>`)}
    <strong class="diagnostic-figure">${ratio}</strong>
    <div class="finance-stat-row two">${stat('Mỗi ngày trong kỳ nhận tiền', available ? money(d.paydayAvg) : '—', d.windowDays !== undefined ? `${d.windowDays} ngày quan sát` : '')}${stat('Mỗi ngày còn lại', available ? money(d.otherAvg) : '—', d.otherDays !== undefined ? `${d.otherDays} ngày quan sát` : '')}</div>
    <p class="diagnostic-copy">${!available ? 'Ghi thêm chi phí để so sánh hai nhóm ngày.' : d.warning ? 'Bạn thường chi nhiều hơn trong những ngày nhận tiền. Thử giữ mức chi đều và để riêng phần dành cho hóa đơn.' : 'Chưa thấy nhịp chi tăng đến mức cần nhắc sau ngày nhận tiền.'}</p>
    <div class="finance-action-row">${available ? ledgerButton('Xem chi trong kỳ nhận tiền', '', scoped, 'secondary small') : ''}${planning('Chỉnh ngày nhận tiền', 'profile-form')}</div>
    ${detail('Cách tính chỉ số này', '<p>Chia tổng chi ngoài hóa đơn trong kỳ cho số ngày quan sát, kể cả ngày không chi, rồi so với mức trung bình các ngày còn lại trong tối đa ba tháng. Từ 1,5 lần trở lên được nhắc để xem lại.</p>')}
  </section>`;
}

function renderLifestyle(a) {
  const l = a.lifestyle, w = a.history.length >= 6 ? 3 : 2, ref = a.history.slice(-2 * w);
  const growthText = (value) => Number.isFinite(value) ? `${value >= 0 ? '+' : ''}${N(value)}%` : 'Từ 0 tăng lên';
  const delta = l.available ? `${l.driftPP > 0 ? '+' : ''}${N(l.driftPP)} điểm %` : 'Chưa đủ dữ liệu';
  const scoped = l.available ? `data-scope="everyday" data-group="wants" data-all-months="true" data-from="${ref[0].month}-01" data-through="${dayEnd(ref.at(-1).month)}"` : '';
  return `<section class="panel finance-panel" id="lifestyle-section">
    ${header('Chi linh hoạt có tăng quá nhanh?', l.available ? `So sánh ${w} tháng gần nhất đã kết thúc với ${w} tháng liền trước.` : 'Cần ít nhất 4 tháng hoàn chỉnh có thu nhập.', `<span class="badge ${!l.available ? 'notice' : l.warning ? 'warning' : 'safe'}">${!l.available ? 'Đang theo dõi' : l.warning ? 'Tăng nhanh' : 'Trong tầm kiểm soát'}</span>`)}
    <strong class="diagnostic-figure">${delta}</strong>
    <div class="finance-stat-row two">${stat('Chi linh hoạt / thu nhập trước đây', l.available ? percent(l.ratioPrev) : '—') }${stat('Chi linh hoạt / thu nhập gần đây', l.available ? percent(l.ratioCurr) : '—')}</div>
    ${l.available ? `<div class="forecast-basis"><span>Chi linh hoạt thay đổi <strong>${growthText(l.wantsGrowthPct)}</strong></span><span>Thu nhập thay đổi <strong>${growthText(l.incGrowthPct)}</strong></span></div>` : ''}
    <p class="diagnostic-copy">${!l.available ? 'Khi đủ lịch sử, bạn sẽ biết phần chi linh hoạt có tăng nhanh hơn thu nhập hay không.' : l.warning ? 'Cân nhắc giữ trần chi linh hoạt để thu nhập tăng có thể giúp bạn dành ra nhiều hơn.' : 'Chưa thấy phần chi linh hoạt tăng đến mức cần nhắc.'}</p>
    <div class="finance-action-row">${l.available ? ledgerButton('Xem các khoản được so sánh', '', scoped, 'secondary small') : ''}${navigation('Xem phân bổ gợi ý', 'allocation-section')}</div>
    ${detail('Cách so sánh thói quen', '<p>So sánh tỷ lệ chi linh hoạt trên thu nhập của hai giai đoạn liền nhau. Không dùng tháng đang dở. Nhắc khi tỷ lệ tăng từ 3 điểm phần trăm, hoặc chi tăng nhanh hơn thu nhập trên 5 điểm và tỷ lệ gần đây vượt 25%.</p>')}
  </section>`;
}

function renderAnomalies(a) {
  const rows = a.anomalies;
  const list = (items) => `<div class="anomaly-list">${items.map((t) => `<article class="anomaly-item"><span class="category-icon ${t.group}">${icon(categoryIcon(t.category, t.group))}</span><div class="anomaly-information"><strong>${E(t.note || t.category)}</strong><p>${E(t.category)} · ${dateText(t.date)} · Thông thường ${money(t.median)}</p><span class="badge ${t.severity === 'CRITICAL' ? 'danger' : 'warning'}">${t.severity === 'CRITICAL' ? 'Cao hơn hẳn' : 'Nên xem lại'}${t.multiple !== null ? ` · ${N(t.multiple)} lần` : ''}</span></div><div class="anomaly-amount"><strong class="money">${money(t.amount)}</strong>${btn('Xem khoản', 'edit-transaction', 'secondary small', '', `data-id="${E(t.id)}"`)}</div></article>`).join('')}</div>`;
  return `<section class="panel finance-panel" id="anomaly-section">
    ${header('Khoản chi cao hơn thông thường', 'So sánh với những lần trước trong cùng danh mục, trong 90 ngày gần nhất.', `<span class="badge ${rows.length ? 'warning' : 'safe'}">${rows.length} khoản</span>`)}
    ${rows.length ? `${list(rows.slice(0, 8))}${rows.length > 8 ? `<details class="finance-method"><summary>Xem tiếp ${Math.min(rows.length, 30) - 8} khoản</summary>${list(rows.slice(8, 30))}</details>` : ''}<div class="finance-action-row">${ledgerButton('Xem tất cả khoản được nhắc trong sổ', '', 'data-scope="anomaly" data-all-months="true"', 'secondary small')}</div>` : '<p class="helper-text">Chưa có khoản nào vượt ngưỡng nhắc. Mỗi danh mục cần ít nhất 5 khoản để so sánh.</p>'}
    <p class="fine-print">Khoản chi lớn có thể hợp lý. Dùng gợi ý để xem lại nội dung, danh mục, cọc/hoàn hoặc chi phí đột xuất.</p>
    ${detail('Cách nhận ra khoản chi khác thường', '<p>Ứng dụng so sánh mức chi với trung vị và độ phân tán trong từng danh mục (MAD, IQR), đồng thời yêu cầu số tiền chênh đủ lớn. Không tự sửa hay xóa khoản nào.</p>')}
  </section>`;
}

export function renderAnalysis(data, a, view = 'health') {
  const selected = isAnalysisView(view) ? view : 'health';
  const m = monthlyMoney(data, a), p = financePlanSummary(data, a, m);
  const pages = {
    health: () => renderHealthDetails(data, a),
    plan: () => renderPlanAnalysis(data, a, m, p),
    cashflow: () => renderCashflowAnalysis(data, a, m, p),
    habits: () => `<div class="analysis-stack" id="habit-section"><div class="finance-grid">${renderPayday(data, a)}${renderLifestyle(a)}</div>${renderAnomalies(a)}</div>`,
  };
  const alertCount = a.anomalies.length + Number(a.payday.warning) + Number(a.lifestyle.warning);
  return heading('Phân tích tài chính', 'Từng phần giúp bạn hiểu tiền của mình và điều chỉnh ngay từ sổ thu chi.', a) +
    `<nav class="finance-navigation" aria-label="Nhóm phân tích tài chính">${ANALYSIS_VIEWS.map((v) => `<a href="#analysis/${v.key}" class="finance-nav-item ${selected === v.key ? 'selected' : ''}" ${selected === v.key ? 'aria-current="page"' : ''}><span class="finance-nav-icon">${icon(v.icon)}</span><span><strong>${v.label}${v.key === 'habits' && alertCount ? ` <small class="badge warning">${alertCount}</small>` : ''}</strong><small>${v.description}</small></span></a>`).join('')}</nav>` + pages[selected]();
}
