// [11 August 2026] Tour & App JS Module Update
(function () {
    'use strict';

    var tourId = window.__PT_TOUR_ID__;
    var currencyPrefix = 'Rs. ';
    var expandedMemberIds = {};
    var currentSettlementData = null;

    function fmtMoney(v) {
        var n = Number(v || 0);
        return currencyPrefix + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    var avatarPalettes = [
        'bg-[#dbeafe] text-[#1e40af]', // light blue
        'bg-[#dcfce7] text-[#166534]', // light green
        'bg-[#fef3c7] text-[#92400e]', // warm amber
        'bg-[#f3e8ff] text-[#6b21a8]', // soft purple
        'bg-[#ffe4e6] text-[#9f1239]', // soft rose
        'bg-[#ffedd5] text-[#9a3412]', // soft orange
        'bg-[#e0e7ff] text-[#3730a3]', // soft indigo
        'bg-[#ccfbf1] text-[#115e59]'  // soft teal
    ];

    function getAvatarClass(name, offset) {
        var str = (name || '').trim();
        var hash = offset || 0;
        for (var i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        var idx = Math.abs(hash) % avatarPalettes.length;
        return avatarPalettes[idx];
    }

    function getInitial(name) {
        return (((name || '?').trim().charAt(0) || '?')).toUpperCase();
    }

    function getTxKey(t, i) {
        var from = t.from_user || {};
        var to = t.to_user || {};
        var fromId = t.from_user_id || from.id || i;
        var toId = t.to_user_id || to.id || i;
        return 'pt_paid_tx_' + tourId + '_' + fromId + '_' + toId + '_' + t.amount;
    }

    function isTxPaid(txKey) {
        try {
            return localStorage.getItem(txKey) === '1';
        } catch (e) {
            return false;
        }
    }

    function getPaidTransfersForTour() {
        var paidList = [];
        var transfers = (currentSettlementData && currentSettlementData.transfers) || [];
        for (var i = 0; i < transfers.length; i++) {
            var t = transfers[i];
            var from = t.from_user || {};
            var to = t.to_user || {};
            var txKey = getTxKey(t, i);
            if (isTxPaid(txKey)) {
                paidList.push({
                    txKey: txKey,
                    from_user_id: t.from_user_id || from.id,
                    from_name: from.full_name || 'Member',
                    to_user_id: t.to_user_id || to.id,
                    to_name: to.full_name || 'Member',
                    amount: Number(t.amount || 0),
                    is_stripe: localStorage.getItem(txKey + '_stripe') === '1'
                });
            }
        }
        return paidList;
    }

    function showToast(message, type) {
        var existing = document.getElementById('settlementToast');
        if (existing && existing.parentNode) {
            existing.parentNode.removeChild(existing);
        }

        var toast = document.createElement('div');
        toast.id = 'settlementToast';
        var isSuccess = type === 'success';
        var bgClass = isSuccess
            ? 'bg-slate-900 dark:bg-slate-800 text-white border-emerald-500/50 shadow-emerald-500/20'
            : 'bg-slate-900 dark:bg-slate-800 text-white border-slate-700 shadow-slate-900/30';
        var icon = isSuccess
            ? '<span class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0"><i class="fa-solid fa-check text-xs"></i></span>'
            : '<span class="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0"><i class="fa-solid fa-info text-xs"></i></span>';

        toast.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border text-sm font-medium transition-all duration-300 transform translate-y-3 opacity-0 ' + bgClass;
        toast.innerHTML = icon + '<div class="text-xs sm:text-sm">' + message + '</div>';
        document.body.appendChild(toast);

        requestAnimationFrame(function () {
            toast.classList.remove('translate-y-3', 'opacity-0');
        });

        setTimeout(function () {
            toast.classList.add('translate-y-3', 'opacity-0');
            setTimeout(function () {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300);
        }, 3500);
    }

    function renderSummary(data) {
        if (!data) return;
        var totalExpEl = document.getElementById('cardTotalExpenses');
        var membersToPayEl = document.getElementById('cardMembersToPay');
        var membersToReceiveEl = document.getElementById('cardMembersToReceive');
        var totalMemEl = document.getElementById('cardTotalMembers');
        var netDiffEl = document.getElementById('cardNetDiff');

        if (totalExpEl) totalExpEl.textContent = fmtMoney(data.total_expenses);

        var perMember = data.per_member || [];
        var paidTransfers = getPaidTransfersForTour();

        var countToPay = 0;
        var countToReceive = 0;

        for (var i = 0; i < perMember.length; i++) {
            var m = perMember[i];
            var uid = m.user_id;
            var net = Number(m.net_balance || 0);

            var totalPaidOut = 0;
            var totalReceived = 0;

            for (var k = 0; k < paidTransfers.length; k++) {
                if (String(paidTransfers[k].from_user_id) === String(uid)) {
                    totalPaidOut += paidTransfers[k].amount;
                }
                if (String(paidTransfers[k].to_user_id) === String(uid)) {
                    totalReceived += paidTransfers[k].amount;
                }
            }

            if (net < -0.005) {
                var remainingDebt = Math.max(0, Math.abs(net) - totalPaidOut);
                if (remainingDebt > 0.005) countToPay++;
            } else if (net > 0.005) {
                var remainingCredit = Math.max(0, net - totalReceived);
                if (remainingCredit > 0.005) countToReceive++;
            }
        }

        if (membersToPayEl) membersToPayEl.textContent = String(countToPay);
        if (membersToReceiveEl) membersToReceiveEl.textContent = String(countToReceive);
        if (totalMemEl) totalMemEl.textContent = String(data.total_members || perMember.length || 0);
        if (netDiffEl && data.summary) {
            netDiffEl.textContent = fmtMoney(data.summary.net_zero_difference || 0);
        }
    }

    function renderTransfers(transfers) {
        var box = document.getElementById('transfersList');
        if (!box) return;

        if (!transfers || transfers.length === 0) {
            box.innerHTML = (
                '<div class="bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 rounded-2xl p-6 text-center text-slate-500 dark:text-slate-400 font-medium">' +
                    'All balances are settled! No payments needed.' +
                '</div>'
            );
            return;
        }

        var html = '';
        for (var i = 0; i < transfers.length; i++) {
            var t = transfers[i];
            var from = t.from_user || {};
            var to = t.to_user || {};
            var fromName = from.full_name || 'Member';
            var toName = to.full_name || 'Member';
            var fromId = t.from_user_id || from.id || i;
            var toId = t.to_user_id || to.id || i;
            var fromInitial = getInitial(fromName);
            var toInitial = getInitial(toName);

            var fromColor = getAvatarClass(fromName, 0);
            var toColor = getAvatarClass(toName, 2);

            var txKey = getTxKey(t, i);
            var isPaid = isTxPaid(txKey);
            var isStripePaid = isPaid && (localStorage.getItem(txKey + '_stripe') === '1');

            var buttonHtml = '';
            var rowBorderClass = 'border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600';
            var settledBadge = '';

            if (isPaid) {
                if (isStripePaid) {
                    rowBorderClass = 'border-indigo-300 dark:border-indigo-700/70 bg-indigo-50/20 dark:bg-indigo-950/20';
                    settledBadge = '<span class="inline-flex items-center gap-1 text-[11px] font-bold text-[#635bff] dark:text-indigo-300 bg-indigo-100/80 dark:bg-indigo-900/50 px-2.5 py-0.5 rounded-full"><i class="fa-brands fa-stripe text-xs"></i> Settled via Stripe</span>';
                    buttonHtml = (
                        '<button type="button" class="mark-paid-btn inline-flex items-center gap-1.5 px-4 py-2 border border-indigo-400 dark:border-indigo-600 rounded-xl text-sm font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100/70 dark:bg-indigo-950/60 hover:bg-indigo-200 transition cursor-pointer shadow-xs" data-tx-key="' + txKey + '" data-from-id="' + fromId + '" data-to-id="' + toId + '" data-from-name="' + fromName.replace(/"/g, '&quot;') + '" data-to-name="' + toName.replace(/"/g, '&quot;') + '" data-amount="' + t.amount + '" title="Settled through Stripe Checkout">' +
                            '<i class="fa-brands fa-stripe text-sm"></i>' +
                            '<span>Paid (Stripe)</span>' +
                        '</button>'
                    );
                } else {
                    rowBorderClass = 'border-emerald-300 dark:border-emerald-700/70 bg-emerald-50/20 dark:bg-emerald-950/20';
                    settledBadge = '<span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full"><i class="fa-solid fa-check text-[10px]"></i> Settled</span>';
                    buttonHtml = (
                        '<button type="button" class="mark-paid-btn inline-flex items-center gap-1.5 px-4 py-2 border border-emerald-400 dark:border-emerald-600 rounded-xl text-sm font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 hover:bg-emerald-200 transition cursor-pointer shadow-xs" data-tx-key="' + txKey + '" data-from-id="' + fromId + '" data-to-id="' + toId + '" data-from-name="' + fromName.replace(/"/g, '&quot;') + '" data-to-name="' + toName.replace(/"/g, '&quot;') + '" data-amount="' + t.amount + '" title="Click to unmark as paid">' +
                            '<svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>' +
                            '<span>Paid</span>' +
                        '</button>'
                    );
                }
            } else {
                buttonHtml = (
                    '<div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">' +
                        '<button type="button" class="stripe-pay-btn inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#635bff] hover:bg-[#5346e0] active:bg-[#4335c0] transition cursor-pointer shadow-xs" data-tx-key="' + txKey + '" data-from-name="' + fromName.replace(/"/g, '&quot;') + '" data-to-name="' + toName.replace(/"/g, '&quot;') + '" data-amount="' + t.amount + '" title="Pay directly via official Stripe checkout">' +
                            '<i class="fa-brands fa-stripe text-lg"></i>' +
                            '<span>Pay with Stripe</span>' +
                        '</button>' +
                        '<button type="button" class="mark-paid-btn inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition cursor-pointer shadow-xs" data-tx-key="' + txKey + '" data-from-id="' + fromId + '" data-to-id="' + toId + '" data-from-name="' + fromName.replace(/"/g, '&quot;') + '" data-to-name="' + toName.replace(/"/g, '&quot;') + '" data-amount="' + t.amount + '" title="Mark this transfer as paid offline">' +
                            '<span>Mark paid</span>' +
                        '</button>' +
                    '</div>'
                );
            }

            html += (
                '<div class="' + rowBorderClass + ' border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between shadow-none transition gap-3 sm:gap-4">' +
                    '<div class="flex items-center gap-2 sm:gap-3.5 min-w-0 flex-wrap sm:flex-nowrap">' +
                        '<div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full ' + fromColor + ' font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">' +
                            fromInitial +
                        '</div>' +
                        '<span class="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[130px] sm:max-w-none">' + fromName + '</span>' +
                        '<span class="text-slate-400 mx-1 text-xs font-semibold uppercase tracking-wider shrink-0">to</span>' +
                        '<div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full ' + toColor + ' font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">' +
                            toInitial +
                        '</div>' +
                        '<span class="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[130px] sm:max-w-none">' + toName + '</span>' +
                        (settledBadge ? '<span class="ml-1 shrink-0">' + settledBadge + '</span>' : '') +
                    '</div>' +
                    '<div class="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto">' +
                        '<span class="text-base sm:text-lg font-bold text-slate-900 dark:text-white shrink-0">' + fmtMoney(t.amount) + '</span>' +
                        buttonHtml +
                    '</div>' +
                '</div>'
            );
        }

        box.innerHTML = html;
        bindMarkPaidButtons(box);
    }

    function bindMarkPaidButtons(container) {
        var btns = container.querySelectorAll('.mark-paid-btn');
        container.querySelectorAll('.stripe-pay-btn').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var txKey = btn.getAttribute('data-tx-key');
                var toName = btn.getAttribute('data-to-name') || 'Member';
                var amount = parseFloat(btn.getAttribute('data-amount') || 0);
                if (!amount || amount <= 0) return;

                var origHtml = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Stripe...';

                api.apiFetch('/client/expenses/api/stripe/settlement-checkout/', {
                    method: 'POST',
                    body: JSON.stringify({
                        tour_id: tourId,
                        to_name: toName,
                        amount: amount,
                        tx_key: txKey
                    }),
                    contentType: 'application/json'
                }).then(function (r) {
                    if (r.ok && r.data && r.data.checkout_url) {
                        window.location.href = r.data.checkout_url;
                        return;
                    }
                    btn.disabled = false;
                    btn.innerHTML = origHtml;
                    showToast((r.data && r.data.detail) || 'Could not initiate Stripe checkout.', 'error');
                }).catch(function () {
                    btn.disabled = false;
                    btn.innerHTML = origHtml;
                    showToast('Network error connecting to Stripe.', 'error');
                });
            });
        });

        btns.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                var txKey = btn.getAttribute('data-tx-key');
                var fromId = btn.getAttribute('data-from-id');
                var toId = btn.getAttribute('data-to-id');
                var fromName = btn.getAttribute('data-from-name') || 'Member';
                var toName = btn.getAttribute('data-to-name') || 'Member';
                var amount = Number(btn.getAttribute('data-amount') || 0);

                if (!txKey) return;
                var currentPaid = isTxPaid(txKey);
                var nextPaid = !currentPaid;

                try {
                    if (nextPaid) {
                        localStorage.setItem(txKey, '1');
                    } else {
                        localStorage.removeItem(txKey);
                        localStorage.removeItem(txKey + '_stripe');
                    }
                } catch (err) {
                    console.error('Failed saving payment state to localStorage', err);
                }

                // 1. Expand the payer's section so they immediately see their payment
                if (fromId) {
                    expandedMemberIds[fromId] = true;
                }
                // Also expand receiver's section so they see they received the payment
                if (toId) {
                    expandedMemberIds[toId] = true;
                }

                // 2. Re-render Suggested Transactions, Member Balances and Summary
                if (currentSettlementData) {
                    renderSummary(currentSettlementData);
                    renderTransfers(currentSettlementData.transfers || []);
                    renderMemberChips(currentSettlementData.per_member || []);
                }

                // 3. Scroll to and highlight the payer's card in Member Balances section
                if (nextPaid && fromId) {
                    setTimeout(function () {
                        var payerCard = document.querySelector('.member-accordion-card[data-uid="' + fromId + '"]');
                        if (payerCard) {
                            payerCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            payerCard.classList.add('ring-4', 'ring-emerald-400', 'bg-emerald-50/80', 'dark:bg-emerald-950/40');
                            setTimeout(function () {
                                payerCard.classList.remove('ring-4', 'ring-emerald-400', 'bg-emerald-50/80', 'dark:bg-emerald-950/40');
                            }, 2500);
                        }
                    }, 120);
                }

                // 4. Show clear notification toast
                if (nextPaid) {
                    showToast('<strong>' + fromName + '</strong> paid <strong>' + fmtMoney(amount) + '</strong> to <strong>' + toName + '</strong>. Both member balances updated!', 'success');
                } else {
                    showToast('Payment unmarked: ' + fromName + ' to ' + toName + '. Balances restored.', 'info');
                }
            });
        });
    }

    function renderMemberChips(perMember) {
        var box = document.getElementById('memberChips');
        if (!box) return;

        if (!perMember || perMember.length === 0) {
            box.innerHTML = (
                '<div class="bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 rounded-2xl p-6 text-center text-slate-400">' +
                    'No members found in this tour.' +
                '</div>'
            );
            return;
        }

        // Expand the first member with expenses by default if none expanded yet
        var hasExpanded = Object.keys(expandedMemberIds).length > 0;
        if (!hasExpanded && perMember.length > 0) {
            expandedMemberIds[perMember[0].user_id] = true;
        }

        var paidTransfers = getPaidTransfersForTour();

        var html = '';
        for (var i = 0; i < perMember.length; i++) {
            var m = perMember[i];
            var u = m.user || {};
            var name = u.full_name || 'Member';
            var initial = getInitial(name);
            var colorClass = getAvatarClass(name, i);
            var uid = m.user_id;

            var isExpanded = Boolean(expandedMemberIds[uid]);
            var chevron = isExpanded ? '<i class="fa-solid fa-chevron-up text-xs"></i>' : '<i class="fa-solid fa-chevron-down text-xs"></i>';

            // Find all paid transfers involving this member
            var paidOutTransfers = [];
            var receivedTransfers = [];
            var totalPaidOut = 0;
            var totalReceived = 0;

            for (var k = 0; k < paidTransfers.length; k++) {
                var pt = paidTransfers[k];
                if (String(pt.from_user_id) === String(uid)) {
                    paidOutTransfers.push(pt);
                    totalPaidOut += pt.amount;
                }
                if (String(pt.to_user_id) === String(uid)) {
                    receivedTransfers.push(pt);
                    totalReceived += pt.amount;
                }
            }

            var net = Number(m.net_balance || 0);
            var balanceHtml = '';

            if (net < -0.005) {
                // Member owed money
                var debt = Math.abs(net);
                var remainingDebt = Math.max(0, debt - totalPaidOut);

                if (totalPaidOut > 0 && remainingDebt <= 0.005) {
                    // Fully settled payment
                    balanceHtml = (
                        '<div class="flex items-center gap-2 justify-end">' +
                            '<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">' +
                                '<i class="fa-solid fa-circle-check text-emerald-600 dark:text-emerald-400"></i> Paid & Settled' +
                            '</span>' +
                            '<p class="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">' + fmtMoney(0) + '</p>' +
                            '<span class="text-slate-400 font-bold text-base chevron-indicator">' + chevron + '</span>' +
                        '</div>' +
                        '<p class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">settled (' + fmtMoney(totalPaidOut) + ' paid)</p>'
                    );
                } else if (totalPaidOut > 0) {
                    // Partially settled
                    balanceHtml = (
                        '<div class="flex items-center gap-2 justify-end">' +
                            '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">' +
                                'Paid ' + fmtMoney(totalPaidOut) +
                            '</span>' +
                            '<p class="text-lg sm:text-xl font-bold text-[#b91c1c] dark:text-red-400">-' + fmtMoney(remainingDebt) + '</p>' +
                            '<span class="text-slate-400 font-bold text-base chevron-indicator">' + chevron + '</span>' +
                        '</div>' +
                        '<p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">to pay (partially settled)</p>'
                    );
                } else {
                    balanceHtml = (
                        '<div class="flex items-center gap-2 justify-end">' +
                            '<p class="text-lg sm:text-xl font-bold text-[#b91c1c] dark:text-red-400">-' + fmtMoney(debt) + '</p>' +
                            '<span class="text-slate-400 font-bold text-base chevron-indicator">' + chevron + '</span>' +
                        '</div>' +
                        '<p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">to pay</p>'
                    );
                }
            } else if (net > 0.005) {
                // Member was to receive money
                var credit = net;
                var remainingCredit = Math.max(0, credit - totalReceived);

                if (totalReceived > 0 && remainingCredit <= 0.005) {
                    // Fully received
                    balanceHtml = (
                        '<div class="flex items-center gap-2 justify-end">' +
                            '<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">' +
                                '<i class="fa-solid fa-hand-holding-dollar text-emerald-600 dark:text-emerald-400"></i> Received & Settled' +
                            '</span>' +
                            '<p class="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">' + fmtMoney(0) + '</p>' +
                            '<span class="text-slate-400 font-bold text-base chevron-indicator">' + chevron + '</span>' +
                        '</div>' +
                        '<p class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">settled (' + fmtMoney(totalReceived) + ' received)</p>'
                    );
                } else if (totalReceived > 0) {
                    // Partially received
                    balanceHtml = (
                        '<div class="flex items-center gap-2 justify-end">' +
                            '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">' +
                                'Recv ' + fmtMoney(totalReceived) +
                            '</span>' +
                            '<p class="text-lg sm:text-xl font-bold text-[#15803d] dark:text-emerald-400">+' + fmtMoney(remainingCredit) + '</p>' +
                            '<span class="text-slate-400 font-bold text-base chevron-indicator">' + chevron + '</span>' +
                        '</div>' +
                        '<p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">to receive (partially settled)</p>'
                    );
                } else {
                    balanceHtml = (
                        '<div class="flex items-center gap-2 justify-end">' +
                            '<p class="text-lg sm:text-xl font-bold text-[#15803d] dark:text-emerald-400">+' + fmtMoney(credit) + '</p>' +
                            '<span class="text-slate-400 font-bold text-base chevron-indicator">' + chevron + '</span>' +
                        '</div>' +
                        '<p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">to receive</p>'
                    );
                }
            } else {
                balanceHtml = (
                    '<div class="flex items-center gap-2 justify-end">' +
                        '<p class="text-lg sm:text-xl font-bold text-slate-600 dark:text-slate-400">' + fmtMoney(0) + '</p>' +
                        '<span class="text-slate-400 font-bold text-base chevron-indicator">' + chevron + '</span>' +
                    '</div>' +
                    '<p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">settled</p>'
                );
            }

            // Build settlement activities list (payments made and payments received)
            var settlementActivityHtml = '';
            if (paidOutTransfers.length > 0 || receivedTransfers.length > 0) {
                settlementActivityHtml += '<div class="space-y-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-700/80">';
                settlementActivityHtml += '<p class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Settlement Transfer Activity</p>';

                for (var pIdx = 0; pIdx < paidOutTransfers.length; pIdx++) {
                    var pot = paidOutTransfers[pIdx];
                    var pIconBg = pot.is_stripe ? 'bg-[#635bff]' : 'bg-emerald-500';
                    var pIcon = pot.is_stripe ? '<i class="fa-brands fa-stripe text-sm"></i>' : '<i class="fa-solid fa-check"></i>';
                    var pSub = pot.is_stripe ? '<span class="text-indigo-600 dark:text-indigo-400 font-semibold"><i class="fa-brands fa-stripe mr-1"></i> Paid with Stripe Checkout</span>' : 'Payment completed &amp; marked as paid';
                    var pBadge = pot.is_stripe ? 'Stripe Paid' : 'Paid';
                    var pBadgeColor = pot.is_stripe ? 'text-[#635bff] dark:text-indigo-300' : 'text-emerald-600 dark:text-emerald-400';

                    settlementActivityHtml += (
                        '<div class="p-3 bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl flex items-center justify-between transition">' +
                            '<div class="flex items-center gap-3">' +
                                '<span class="w-8 h-8 rounded-full ' + pIconBg + ' text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">' +
                                    pIcon +
                                '</span>' +
                                '<div>' +
                                    '<p class="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-200">Paid to ' + pot.to_name + (pot.is_stripe ? ' (Stripe)' : '') + '</p>' +
                                    '<p class="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">' + pSub + '</p>' +
                                '</div>' +
                            '</div>' +
                            '<div class="text-right shrink-0 ml-3">' +
                                '<span class="text-sm font-bold text-emerald-700 dark:text-emerald-300">-' + fmtMoney(pot.amount) + '</span>' +
                                '<span class="block text-[10px] ' + pBadgeColor + ' font-bold uppercase tracking-wider">' + pBadge + '</span>' +
                            '</div>' +
                        '</div>'
                    );
                }

                for (var rIdx = 0; rIdx < receivedTransfers.length; rIdx++) {
                    var rt = receivedTransfers[rIdx];
                    var rIconBg = rt.is_stripe ? 'bg-[#635bff]' : 'bg-emerald-500';
                    var rIcon = rt.is_stripe ? '<i class="fa-brands fa-stripe text-sm"></i>' : '<i class="fa-solid fa-arrow-down"></i>';
                    var rSub = rt.is_stripe ? '<span class="text-indigo-600 dark:text-indigo-400 font-semibold"><i class="fa-brands fa-stripe mr-1"></i> Received via Stripe Checkout</span>' : 'Payment received via suggested transfer';
                    var rBadge = rt.is_stripe ? 'Stripe Recv' : 'Received';
                    var rBadgeColor = rt.is_stripe ? 'text-[#635bff] dark:text-indigo-300' : 'text-emerald-600 dark:text-emerald-400';

                    settlementActivityHtml += (
                        '<div class="p-3 bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl flex items-center justify-between transition">' +
                            '<div class="flex items-center gap-3">' +
                                '<span class="w-8 h-8 rounded-full ' + rIconBg + ' text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">' +
                                    rIcon +
                                '</span>' +
                                '<div>' +
                                    '<p class="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-200">Received from ' + rt.from_name + (rt.is_stripe ? ' (Stripe)' : '') + '</p>' +
                                    '<p class="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">' + rSub + '</p>' +
                                '</div>' +
                            '</div>' +
                            '<div class="text-right shrink-0 ml-3">' +
                                '<span class="text-sm font-bold text-emerald-700 dark:text-emerald-300">+' + fmtMoney(rt.amount) + '</span>' +
                                '<span class="block text-[10px] ' + rBadgeColor + ' font-bold uppercase tracking-wider">' + rBadge + '</span>' +
                            '</div>' +
                        '</div>'
                    );
                }

                settlementActivityHtml += '</div>';
            }

            // Build individual expense list breakdown
            var expenses = m.expenses || [];
            var expensesHtml = '';
            if (expenses.length > 0) {
                for (var j = 0; j < expenses.length; j++) {
                    var exp = expenses[j];
                    var expTitle = exp.title || 'Expense';
                    var paidBadge = exp.paid_this ? ' <span class="text-slate-400 dark:text-slate-500 font-normal">· paid this</span>' : '';
                    var stripeBadge = '';
                    if (exp.payment_method === 'stripe' || (exp.notes && exp.notes.indexOf('Stripe Paid') !== -1)) {
                        stripeBadge = ' <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#635bff]/10 text-[#635bff] dark:bg-[#635bff]/25 dark:text-indigo-300 border border-[#635bff]/30" title="Paid via Stripe"><i class="fa-brands fa-stripe"></i> Stripe</span>';
                    }
                    var rightLabel = '';

                    if (exp.is_advance && exp.is_credit) {
                        rightLabel = '<span class="text-[#15803d] dark:text-emerald-400 font-medium">+' + fmtMoney(exp.share_amount) + ' credit</span>';
                    } else if (exp.is_advance && !exp.is_credit) {
                        rightLabel = '<span class="text-[#b91c1c] dark:text-red-400 font-medium">-' + fmtMoney(exp.share_amount) + ' debit</span>';
                    } else {
                        rightLabel = '<span class="text-slate-600 dark:text-slate-400 font-normal">share ' + fmtMoney(exp.share_amount) + '</span>';
                    }

                    expensesHtml += (
                        '<div class="flex items-center justify-between text-sm py-1.5 border-b border-slate-50 dark:border-slate-800/60 last:border-0">' +
                            '<span class="text-slate-800 dark:text-slate-200">' + expTitle + paidBadge + stripeBadge + '</span>' +
                            rightLabel +
                        '</div>'
                    );
                }
            } else {
                expensesHtml = '<p class="text-xs text-slate-400 py-2">No individual expenses assigned to this member yet.</p>';
            }

            var detailsContainerClass = isExpanded ? '' : 'hidden';

            html += (
                '<div class="member-accordion-card bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-none hover:border-slate-300 dark:hover:border-slate-600 transition cursor-pointer" data-uid="' + uid + '">' +
                    '<div class="flex items-center justify-between gap-4">' +
                        '<div class="flex items-center gap-3.5 min-w-0">' +
                            '<div class="w-10 h-10 rounded-full ' + colorClass + ' font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">' +
                                initial +
                            '</div>' +
                            '<div class="min-w-0">' +
                                '<p class="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">' + name + '</p>' +
                                '<p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate">' +
                                    'Paid ' + fmtMoney(m.paid) + ' · fair share ' + fmtMoney(m.owed_shares) +
                                '</p>' +
                            '</div>' +
                        '</div>' +
                        '<div class="text-right shrink-0 ml-4">' +
                            balanceHtml +
                        '</div>' +
                    '</div>' +

                    '<div class="member-detail-box ' + detailsContainerClass + ' border-t border-slate-100 dark:border-slate-700/80 pt-3 mt-3 space-y-2">' +
                        settlementActivityHtml +
                        (expenses.length > 0 && settlementActivityHtml ? '<p class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Expense Shares</p>' : '') +
                        expensesHtml +
                    '</div>' +
                '</div>'
            );
        }

        box.innerHTML = html;
        bindMemberAccordions(box);
    }

    function bindMemberAccordions(container) {
        var cards = container.querySelectorAll('.member-accordion-card');
        cards.forEach(function (card) {
            card.addEventListener('click', function () {
                var uid = card.getAttribute('data-uid');
                var detailBox = card.querySelector('.member-detail-box');
                var chevron = card.querySelector('.chevron-indicator');
                if (!detailBox) return;

                var isCurrentlyOpen = !detailBox.classList.contains('hidden');
                if (isCurrentlyOpen) {
                    detailBox.classList.add('hidden');
                    if (chevron) chevron.innerHTML = '<i class="fa-solid fa-chevron-down text-xs"></i>';
                    expandedMemberIds[uid] = false;
                } else {
                    detailBox.classList.remove('hidden');
                    if (chevron) chevron.innerHTML = '<i class="fa-solid fa-chevron-up text-xs"></i>';
                    expandedMemberIds[uid] = true;
                }
            });
        });
    }

    function setupAddMemberModal() {
        var openBtn = document.getElementById('openAddMemberBtn');
        var modal = document.getElementById('addMemberModal');
        var closeBtn = document.getElementById('closeAddMemberBtn');
        var cancelBtn = document.getElementById('cancelAddMemberBtn');
        var form = document.getElementById('addMemberForm');
        var input = document.getElementById('memberIdentifierInput');
        var msgBox = document.getElementById('addMemberModalMsg');
        var submitBtn = document.getElementById('submitAddMemberBtn');

        if (!openBtn || !modal) return;

        function openModal() {
            modal.classList.remove('hidden');
            if (input) {
                input.value = '';
                input.focus();
            }
            if (msgBox) {
                msgBox.className = 'text-xs hidden p-3 rounded-xl';
                msgBox.textContent = '';
            }
        }

        function closeModal() {
            modal.classList.add('hidden');
        }

        openBtn.addEventListener('click', openModal);
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });

        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                var val = (input.value || '').trim();
                if (!val) return;

                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Adding…';
                }

                var url = '/client/tours/api/' + tourId + '/invite/';
                if (window.PTApi && window.PTApi.apiFetch) {
                    window.PTApi.apiFetch(url, {
                        method: 'POST',
                        requireAuth: true,
                        body: { identifier: val, role: 'member' }
                    })
                    .then(function (res) {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.textContent = 'Add Member';
                        }
                        if (res && res.ok) {
                            if (msgBox) {
                                msgBox.className = 'text-xs block p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200';
                                msgBox.textContent = 'Member added successfully!';
                            }
                            setTimeout(function () {
                                closeModal();
                                loadSettlement();
                            }, 700);
                        } else {
                            var errMsg = (res && res.data && (res.data.detail || res.data.message)) || 'Could not add member.';
                            if (msgBox) {
                                msgBox.className = 'text-xs block p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200';
                                msgBox.textContent = errMsg;
                            }
                        }
                    })
                    .catch(function (err) {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.textContent = 'Add Member';
                        }
                        if (msgBox) {
                            msgBox.className = 'text-xs block p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200';
                            msgBox.textContent = (err && (err.detail || err.message)) || 'Network error.';
                        }
                    });
                }
            });
        }
    }

    function loadSettlement() {
        if (window.__PT_INITIAL_SETTLEMENT__ && typeof window.__PT_INITIAL_SETTLEMENT__ === 'object') {
            var initData = window.__PT_INITIAL_SETTLEMENT__;
            currentSettlementData = initData;
            renderSummary(initData);
            renderTransfers(initData.transfers || []);
            renderMemberChips(initData.per_member || []);
        }

        var url = '/client/tours/api/' + tourId + '/settlement/';
        if (window.PTApi && window.PTApi.apiFetch) {
            window.PTApi.apiFetch(url, { method: 'GET', requireAuth: true })
                .then(function (res) {
                    if (!res || !res.ok) {
                        if (!window.__PT_INITIAL_SETTLEMENT__) {
                            var msg = (res && res.data && (res.data.detail || res.data.message)) || (res && res.text) || 'Failed to load settlement.';
                            var mb = document.getElementById('messageBox');
                            if (mb) {
                                mb.innerHTML = '<div class="bg-rose-50 border border-rose-300 text-rose-800 p-4 rounded-xl text-sm font-medium mb-4">' + msg + '</div>';
                            }
                        }
                        return;
                    }
                    var data = (res && res.data) ? res.data : res;
                    currentSettlementData = data;
                    renderSummary(data);
                    renderTransfers(data.transfers || []);
                    renderMemberChips(data.per_member || []);
                })
                .catch(function (err) {
                    console.error('settlement api fetch error', err);
                });
        }
    }

    function checkStripeSettlementStatus() {
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('stripe_settlement') === 'success') {
            var txKey = urlParams.get('tx_key');
            var amount = urlParams.get('amount') || '';
            var toName = urlParams.get('to_name') || 'Member';
            if (txKey) {
                try {
                    localStorage.setItem(txKey, '1');
                    localStorage.setItem(txKey + '_stripe', '1');
                } catch (e) {}
            }
            window.history.replaceState({}, document.title, window.location.pathname);
            showToast('🎉 Stripe settlement payment of Rs. ' + amount + ' to ' + toName + ' was successful!', 'success');
        } else if (urlParams.get('stripe_settlement') === 'cancelled') {
            window.history.replaceState({}, document.title, window.location.pathname);
            showToast('Stripe settlement payment was cancelled.', 'info');
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        checkStripeSettlementStatus();
        loadSettlement();
        setupAddMemberModal();
    });
})();
