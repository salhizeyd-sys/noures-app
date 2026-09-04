function goto(p){ page = p; renderSidebar(); renderPage(); }

function renderSidebar(){
  const el = document.getElementById('sidebar');
  el.innerHTML = `<div class="group-label">${role==='assistant' ? 'قائمة المساعد' : 'قائمة المدير'}</div>` +
    NAV[role].map(n => `
      <button class="nav-item ${n.id===page?'active':''}" onclick="goto('${n.id}')">
        <span class="dot"></span>${n.label}
      </button>`).join('');
}

function customerName(id){ const c = CUSTOMERS.find(c=>c.id===id); return c ? c.name : '—'; }
function customerPhone(id){ const c = CUSTOMERS.find(c=>c.id===id); return c ? c.phone : '—'; }
function itemName(id){ const i = CATALOG.find(i=>i.id===id); return i ? i.name : id; }
function itemPrice(id){ const i = CATALOG.find(i=>i.id===id); return i ? i.price : 0; }

function bookingDeliveries(bookingId){ return DELIVERIES.filter(d=>d.bookingId===bookingId); }
function isLocked(b){ return b.status === 'مؤكد' && bookingDeliveries(b.id).length > 0; }

function statusPillClass(s){
  if(s==='مؤكد') return 'confirmed';
  if(s==='ملغى') return 'cancelled';
  return 'pending';
}

function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2200);
}

function renderPage(){
  const main = document.getElementById('main');
  if(page==='dashboard') return renderDashboard(main);
  if(page==='bookings') return renderBookings(main);
  if(page==='deliveries') return renderDeliveries(main);
  if(page==='customers') return renderCustomers(main);
  if(page==='invoices') return renderInvoices(main);
}

function renderDashboard(main){
  const pending = BOOKINGS.filter(b=>b.status==='قيد الانتظار').length;
  const confirmed = BOOKINGS.filter(b=>b.status==='مؤكد').length;
  const locked = BOOKINGS.filter(isLocked).length;
  const todayDeliveries = DELIVERIES.length;

  main.innerHTML = `
    <div class="page-head">
      <div>
        <h1>لوحة التحكم</h1>
        <div class="desc">${role==='assistant' ? 'نظرة سريعة على حجوزاتك وعمليات التسليم.' : 'متابعة عامة — للمراجعة والتأكد فقط.'}</div>
      </div>
    </div>
    <div class="cards">
      <div class="card"><div class="num">${pending}</div><div class="lbl">حجوزات قيد الانتظار</div></div>
      <div class="card"><div class="num">${confirmed}</div><div class="lbl">حجوزات مؤكَّدة</div></div>
      <div class="card"><div class="num">${todayDeliveries}</div><div class="lbl">عمليات تسليم مسجَّلة</div></div>
      <div class="card"><div class="num">${locked}</div><div class="lbl">سجلات مقفلة</div></div>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>الزبون</th><th>تاريخ الحجز</th><th>الحالة</th><th>القفل</th></tr></thead>
        <tbody>
          ${BOOKINGS.slice(-5).reverse().map(b=>`
            <tr>
              <td>${customerName(b.customerId)}</td>
              <td>${b.date}</td>
              <td><span class="pill ${statusPillClass(b.status)}">${b.status}</span></td>
              <td>${isLocked(b) ? '<span class="pill locked">مقفل</span>' : '<span class="muted">—</span>'}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderBookings(main){
  const canEdit = role==='assistant';
  const canConfirm = role==='admin';

  main.innerHTML = `
    <div class="page-head">
      <div>
        <h1>الحجوزات</h1>
        <div class="desc">${canEdit ? 'أضف حجزًا جديدًا وحدّث بياناته قبل التأكيد.' : 'مراقبة الحجوزات وتأكيدها أو إلغاؤها.'}</div>
      </div>
      ${canEdit ? `<button class="primary-btn" onclick="openBookingModal()">+ حجز جديد</button>` : ''}
    </div>
    ${canConfirm ? `<div class="banner">صلاحيتك هنا: تأكيد الحجز أو إلغاؤه فقط. بيانات الحجز يعدّلها المساعد.</div>` : ''}
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>الزبون</th><th>الهاتف</th><th>تاريخ الحجز</th><th>العدد التقريبي</th>
            <th>الحالة</th><th>القفل</th><th>${canEdit || canConfirm ? 'إجراءات' : ''}</th>
          </tr>
        </thead>
        <tbody>
          ${BOOKINGS.map(b=>{
            const locked = isLocked(b);
            return `
            <tr>
              <td>${customerName(b.customerId)}</td>
              <td class="muted">${customerPhone(b.customerId)}</td>
              <td>${b.date}</td>
              <td>${b.estCount}</td>
              <td><span class="pill ${statusPillClass(b.status)}">${b.status}</span></td>
              <td>${locked ? '<span class="pill locked">مقفل</span>' : '<span class="muted">مفتوح</span>'}</td>
              <td>
                <div class="row-actions">
                  ${canEdit ? `<button ${locked?'disabled':''} onclick="editBooking(${b.id})">تعديل</button>` : ''}
                  ${canConfirm && !locked ? `
                    <button class="btn-confirm" ${b.status==='مؤكد'?'disabled':''} onclick="setBookingStatus(${b.id},'مؤكد')">تأكيد</button>
                    <button class="btn-cancel" ${b.status==='ملغى'?'disabled':''} onclick="setBookingStatus(${b.id},'ملغى')">إلغاء</button>
                  ` : ''}
                  ${canConfirm && locked ? `<button class="btn-reopen" onclick="reopenBooking(${b.id})">إعادة فتح</button>` : ''}
                </div>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
      ${BOOKINGS.length===0 ? '<div class="empty-note">لا توجد حجوزات بعد.</div>' : ''}
    </div>
  `;
}

async function setBookingStatus(id, status){
  const { error } = await db.from('bookings').update({ status }).eq('id', id);
  if(!error) {
    showToast(status==='مؤكد' ? 'تم تأكيد الحجز' : 'تم إلغاء الحجز');
    await loadDatabaseData();
    renderBookings(document.getElementById('main'));
  }
}

async function reopenBooking(id){
  const { error } = await db.from('bookings').update({ status: 'قيد الانتظار' }).eq('id', id);
  if(!error) {
    showToast('تمت إعادة فتح الحجز');
    await loadDatabaseData();
    renderBookings(document.getElementById('main'));
  }
}

function renderDeliveries(main){
  const canEdit = role==='assistant';
  main.innerHTML = `
    <div class="page-head">
      <div>
        <h1>التسليم</h1>
        <div class="desc">${canEdit ? 'سجّل المستلزمات الفعلية عند التسليم.' : 'مراقبة عمليات التسليم المسجَّلة.'}</div>
      </div>
      ${canEdit ? `<button class="primary-btn" onclick="openDeliveryModal()">+ تسليم جديد</button>` : ''}
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>الزبون</th><th>تاريخ الاستلام</th><th>المستلزمات</th><th>الحجز المرتبط</th></tr></thead>
        <tbody>
          ${DELIVERIES.map(d=>`
            <tr>
              <td>${customerName(d.customerId)}</td>
              <td>${d.date}</td>
              <td class="items-list">${d.items.map(it=>`${itemName(it.itemId)} × ${it.qty}`).join('، ')}</td>
              <td class="muted">${d.bookingId ? '#'+d.bookingId : '—'}</td>
            </tr>`).join('')}
        </tbody>
      </table>
      ${DELIVERIES.length===0 ? '<div class="empty-note">لا توجد عمليات تسليم بعد.</div>' : ''}
    </div>
  `;
}

function renderCustomers(main){
  const canEdit = role==='assistant';
  main.innerHTML = `
    <div class="page-head">
      <div>
        <h1>الزبائن</h1>
        <div class="desc">${canEdit ? 'أضف زبونًا جديدًا أو راجع بياناته.' : 'قائمة الزبائن للمراجعة.'}</div>
      </div>
      ${canEdit ? `<button class="primary-btn" onclick="openCustomerModal()">+ زبون جديد</button>` : ''}
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>الاسم</th><th>الهاتف</th><th>عدد الحجوزات</th></tr></thead>
        <tbody>
          ${CUSTOMERS.map(c=>`
            <tr>
              <td>${c.name}</td>
              <td class="muted">${c.phone}</td>
              <td>${BOOKINGS.filter(b=>b.customerId===c.id).length}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderInvoices(main){
  main.innerHTML = `
    <div class="page-head">
      <div>
        <h1>فاتورة الزبون</h1>
        <div class="desc">للمراجعة والتأكد فقط.</div>
      </div>
    </div>
    <div class="field" style="max-width:280px;margin-bottom:20px;">
      <label>اختر الزبون</label>
      <select class="invoice-select" onchange="renderInvoiceFor(this.value)">
        <option value="">— اختر —</option>
        ${CUSTOMERS.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}
      </select>
    </div>
    <div id="invoice-body"></div>
  `;
}

function renderInvoiceFor(customerId){
  const box = document.getElementById('invoice-body');
  if(!customerId){ box.innerHTML=''; return; }
  customerId = Number(customerId);
  const deliveries = DELIVERIES.filter(d=>d.customerId===customerId);

  const map = {};
  deliveries.forEach(d => d.items.forEach(it => {
    map[it.itemId] = (map[it.itemId]||0) + it.qty;
  }));
  const rows = Object.keys(map);

  if(rows.length===0){
    box.innerHTML = `<div class="table-wrap"><div class="empty-note">لا توجد عمليات تسليم مسجَّلة لهذا الزبون بعد.</div></div>`;
    return;
  }

  box.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead><tr><th>المستلزم</th><th>الكمية المسلَّمة</th><th>السعر</th><th>المبلغ</th></tr></thead>
        <tbody>
          ${rows.map(itemId=>{
            const qty = map[itemId], price = itemPrice(itemId);
            return `<tr><td>${itemName(itemId)}</td><td>${qty}</td><td>${price} د.ج</td><td>${qty*price} د.ج</td></tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
    <div class="banner" style="margin-top:14px;">
      المجموع الأولي: <strong>${rows.reduce((s,id)=>s+map[id]*itemPrice(id),0)} د.ج</strong>
    </div>
  `;
}

function openOverlay(html){
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('overlay').classList.add('open');
}
function closeOverlay(){ document.getElementById('overlay').classList.remove('open'); }

function openBookingModal(existing){
  const isEdit = !!existing;
  const custOptions = CUSTOMERS.map(c=>`<option value="${c.id}" ${existing&&existing.customerId===c.id?'selected':''}>${c.name}</option>`).join('');
  openOverlay(`
    <h2>${isEdit ? 'تعديل حجز' : 'حجز جديد'}</h2>
    <div class="modal-sub">أدخل بيانات الحجز الأولي.</div>
    <div class="field">
      <label>الزبون</label>
      <select id="bk-customer">${custOptions}<option value="__new__">+ زبون جديد</option></select>
    </div>
    <div class="field" id="bk-new-wrap" style="display:none;">
      <label>اسم ورقم هاتف الزبون الجديد</label>
      <input id="bk-new-name" placeholder="الاسم الكامل" style="margin-bottom:8px;">
      <input id="bk-new-phone" placeholder="رقم الهاتف">
    </div>
    <div class="field">
      <label>تاريخ الحجز / المناسبة</label>
      <input type="date" id="bk-date" value="${existing?existing.date:''}">
    </div>
    <div class="field">
      <label>العدد التقريبي للمستلزمات</label>
      <input type="number" min="0" id="bk-count" value="${existing?existing.estCount:''}">
    </div>
    <div class="modal-actions">
      <button class="primary-btn" onclick="saveBooking(${existing?existing.id:'null'})">${isEdit?'حفظ التعديل':'حفظ الحجز'}</button>
      <button class="ghost-btn" onclick="closeOverlay()">إلغاء</button>
    </div>
  `);
  document.getElementById('bk-customer').addEventListener('change', e=>{
    document.getElementById('bk-new-wrap').style.display = e.target.value==='__new__' ? 'block' : 'none';
  });
}

function editBooking(id){ openBookingModal(BOOKINGS.find(b=>b.id===id)); }

async function saveBooking(existingId){
  let custSel = document.getElementById('bk-customer').value;
  const date = document.getElementById('bk-date').value;
  const count = Number(document.getElementById('bk-count').value)||0;

  let customerId;
  if(custSel==='__new__'){
    const name = document.getElementById('bk-new-name').value.trim();
    const phone = document.getElementById('bk-new-phone').value.trim();
    if(!name){ showToast('يرجى إدخال اسم الزبون'); return; }
    
    const { data: newCust, error: cErr } = await db.from('customers').insert([{ name, phone: phone||'—' }]).select();
    if(cErr) { showToast('خطأ في حفظ الزبون'); return; }
    customerId = newCust[0].id;
  } else {
    customerId = Number(custSel);
  }
  if(!date){ showToast('يرجى اختيار تاريخ الحجز'); return; }

  if(existingId){
    await db.from('bookings').update({ customer_id: customerId, booking_date: date, est_count: count }).eq('id', existingId);
    showToast('تم تحديث الحجز');
  } else {
    await db.from('bookings').insert([{ customer_id: customerId, booking_date: date, est_count: count, status: 'قيد الانتظار', created_by: 'المساعد' }]);
    showToast('تم إضافة الحجز');
  }
  closeOverlay();
  await loadDatabaseData();
  renderBookings(document.getElementById('main'));
}

function openDeliveryModal(){
  const custOptions = CUSTOMERS.map(c=>`<option value="${c.id}">${c.name}</option>`).join('');
  const openBookings = BOOKINGS.filter(b=>!isLocked(b));
  const bookingOptions = `<option value="">— بدون ربط بحجز —</option>` +
    openBookings.map(b=>`<option value="${b.id}">#${b.id} — ${customerName(b.customerId)} (${b.date})</option>`).join('');

  openOverlay(`
    <h2>تسليم جديد</h2>
    <div class="modal-sub">حدّد الزبون والمستلزمات التي تم تسليمها فعليًا.</div>
    <div class="field">
      <label>الزبون</label>
      <select id="dl-customer">${custOptions}</select>
    </div>
    <div class="field">
      <label>ربط بحجز (اختياري)</label>
      <select id="dl-booking">${bookingOptions}</select>
    </div>
    <div class="field">
      <label>تاريخ ووقت الاستلام</label>
      <input type="datetime-local" id="dl-datetime">
    </div>
    <div class="field">
      <label>المستلزمات والكميات</label>
      ${CATALOG.map(it=>`
        <div class="item-row">
          <div class="name">${it.name} ${it.daily?'<span class="muted">(كراء باليوم)</span>':''}</div>
          <div class="price">${it.price} د.ج</div>
          <input type="number" min="0" value="0" id="qty-${it.id}">
        </div>
      `).join('')}
    </div>
    <div class="modal-actions">
      <button class="primary-btn" onclick="saveDelivery()">حفظ التسليم</button>
      <button class="ghost-btn" onclick="closeOverlay()">إلغاء</button>
    </div>
  `);
}

async function saveDelivery(){
  const customerId = Number(document.getElementById('dl-customer').value);
  const bookingId = document.getElementById('dl-booking').value ? Number(document.getElementById('dl-booking').value) : null;
  const dt = document.getElementById('dl-datetime').value;
  if(!dt){ showToast('يرجى تحديد تاريخ ووقت الاستلام'); return; }

  const items = CATALOG.map(it=>({
    itemId: it.id,
    qty: Number(document.getElementById('qty-'+it.id).value)||0
  })).filter(it=>it.qty>0);

  if(items.length===0){ showToast('أدخل كمية واحدة على الأقل'); return; }

  const dateStr = dt.replace('T',' ');
  await db.from('deliveries').insert([{ booking_id: bookingId, customer_id: customerId, delivery_date: dateStr, items }]);
  showToast('تم تسجيل التسليم');
  closeOverlay();
  await loadDatabaseData();
  renderDeliveries(document.getElementById('main'));
}

function openCustomerModal(){
  openOverlay(`
    <h2>زبون جديد</h2>
    <div class="field"><label>الاسم الكامل</label><input id="cu-name"></div>
    <div class="field"><label>رقم الهاتف</label><input id="cu-phone"></div>
    <div class="modal-actions">
      <button class="primary-btn" onclick="saveCustomer()">حفظ</button>
      <button class="ghost-btn" onclick="closeOverlay()">إلغاء</button>
    </div>
  `);
}

async function saveCustomer(){
  const name = document.getElementById('cu-name').value.trim();
  const phone = document.getElementById('cu-phone').value.trim();
  if(!name){ showToast('يرجى إدخال الاسم'); return; }
  await db.from('customers').insert([{ name, phone: phone||'—' }]);
  showToast('تم إضافة الزبون');
  closeOverlay();
  await loadDatabaseData();
  renderCustomers(document.getElementById('main'));
}

document.getElementById('overlay').addEventListener('click', e=>{
  if(e.target.id==='overlay') closeOverlay();
});

// بدء التحقق من الجلسة عند فتح التطبيق
checkSession();