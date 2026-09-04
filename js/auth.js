async function checkSession() {
  const { data: { session } } = await db.auth.getSession();
  if (session) {
    role = session.user.user_metadata.role || 'assistant';
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app-shell').classList.add('active');
    document.getElementById('user-role-display').textContent = role === 'admin' ? 'المدير' : 'المساعد';
    await loadDatabaseData();
    renderSidebar();
    renderPage();
  } else {
    document.getElementById('auth-screen').style.display = 'flex';
    document.getElementById('app-shell').classList.remove('active');
  }
}

async function handleLogin() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error) {
    showToast('خطأ في تسجيل الدخول: ' + error.message);
  } else {
    checkSession();
  }
}

async function handleLogout() {
  await db.auth.signOut();
  checkSession();
}

async function loadDatabaseData() {
  let { data: custData } = await db.from('customers').select('*');
  let { data: bookData } = await db.from('bookings').select('*');
  let { data: delData } = await db.from('deliveries').select('*');

  CUSTOMERS = custData || [];
  BOOKINGS = (bookData || []).map(b => ({
    id: b.id,
    customerId: b.customer_id,
    date: b.booking_date,
    estCount: b.est_count,
    status: b.status,
    createdBy: b.created_by
  }));
  DELIVERIES = (delData || []).map(d => ({
    id: d.id,
    bookingId: d.booking_id,
    customerId: d.customer_id,
    date: d.delivery_date,
    items: d.items
  }));
}