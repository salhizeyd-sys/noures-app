const SUPABASE_URL = 'https://jvzsaphvyeycigkrbsxr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2enNhcGh2eWV5Y2lna3Jic3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0Nzk3MjksImV4cCI6MjEwNDA1NTcyOX0.LllvIp-sX0OFm0GLWmsB7CkOlRQA4TtH2-EvcPqudkM';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CATALOG = [
  // --- قسم الأثاث والجلوس ---
  { id: 1, name: 'كرسي عادي', price: 0, daily: false },
  { id: 2, name: 'غلاف كرسي', price: 50, daily: true },
  { id: 3, name: 'طاولات أكل', price: 100, daily: false },
  { id: 4, name: 'كراسي أكل / وليمة', price: 25, daily: false },
  { id: 5, name: 'كرسي أكل فردي', price: 0, daily: false },
  { id: 6, name: 'هيكل طاولة', price: 0, daily: false },
  { id: 7, name: 'طاولة عريس', price: 0, daily: false },
  { id: 8, name: 'طاولة عريس + عروس', price: 0, daily: false },
  { id: 9, name: 'كرسي مصري 1', price: 0, daily: false },
  { id: 10, name: 'كرسي مصري 2', price: 0, daily: false },
  { id: 11, name: 'كرسي عريس + عروس 1', price: 0, daily: false },
  { id: 12, name: 'كرسي عريس + عروس 3', price: 0, daily: false },

  // --- المفارش والأغطية ---
  { id: 13, name: 'ماطلات DCR', price: 0, daily: false },
  { id: 14, name: 'ماطلات 1', price: 0, daily: false },
  { id: 15, name: 'ماطلات 2', price: 0, daily: false },
  { id: 16, name: 'ماطلات 3', price: 0, daily: false },
  { id: 17, name: 'وسايد DCR', price: 0, daily: false },
  { id: 18, name: 'وسايد', price: 0, daily: false },
  { id: 19, name: 'حصيرة', price: 0, daily: false },
  { id: 20, name: 'حصيرة 2', price: 0, daily: false },
  { id: 21, name: 'بساطات', price: 0, daily: false },
  { id: 22, name: 'زاورة جديدة', price: 0, daily: false },
  { id: 23, name: 'زاورة 1', price: 0, daily: false },
  { id: 24, name: 'زاورة 2', price: 0, daily: false },
  { id: 25, name: 'دراوات', price: 0, daily: false },

  // --- الخيم والديكور ---
  { id: 26, name: 'تندة', price: 0, daily: false },
  { id: 27, name: 'أعمدة', price: 0, daily: false },
  { id: 28, name: 'كولي 3', price: 0, daily: false },
  { id: 29, name: 'كولي 4', price: 0, daily: false },
  { id: 30, name: 'كولي 5', price: 0, daily: false },
  { id: 31, name: 'باش تندة', price: 0, daily: false },
  { id: 32, name: 'باش ستار', price: 0, daily: false },
  { id: 33, name: 'باش فراش', price: 0, daily: false },
  { id: 34, name: 'باشات دلاق', price: 0, daily: false },
  { id: 35, name: 'ستائر', price: 0, daily: false },
  { id: 36, name: 'غلاف سقف', price: 0, daily: false },
  { id: 37, name: 'خلفية تركيب سكاي', price: 0, daily: false },
  { id: 38, name: '1 / 2 / 3 خلفية فوركس', price: 0, daily: false },
  { id: 39, name: 'لافته زواج سعيد', price: 0, daily: false },
  { id: 40, name: 'ريدو خلفية', price: 0, daily: false },
  { id: 41, name: 'ديكور عريس', price: 0, daily: false },

  // --- الإضاءة والكهرباء ---
  { id: 42, name: 'كابل + سبولة', price: 0, daily: false },
  { id: 43, name: 'كابل + لمبة LED', price: 0, daily: false },
  { id: 44, name: 'كابل + PROJE LED', price: 0, daily: false },
  { id: 45, name: 'PROJECT LED كبير', price: 0, daily: false },
  { id: 46, name: 'كابل & براشمة 3', price: 0, daily: false },
  { id: 47, name: 'كابل & Prise', price: 0, daily: false },
  { id: 48, name: 'شبكة ضوئية', price: 0, daily: false },
  { id: 49, name: 'مصداح سبونة + كابل 20م', price: 700, daily: false },
  { id: 50, name: 'كابل لمبة 6 متر', price: 0, daily: false },
  { id: 51, name: 'LED اللمبة', price: 0, daily: false },

  // --- الأواني والمطبخ ---
  { id: 52, name: 'مائدة أكل', price: 0, daily: false },
  { id: 53, name: 'صحن جاري', price: 0, daily: false },
  { id: 54, name: 'صحن طبق 2', price: 0, daily: false },
  { id: 55, name: 'صفحة سلطة', price: 0, daily: false },
  { id: 56, name: 'صفحة طاجين', price: 0, daily: false },
  { id: 57, name: 'ملعقة', price: 0, daily: false },
  { id: 58, name: 'شوكة', price: 0, daily: false },
  { id: 59, name: 'قصع خشب', price: 0, daily: false },
  { id: 60, name: 'سينية', price: 0, daily: false },
  { id: 61, name: 'دلو مرق', price: 0, daily: false },
  { id: 62, name: 'لالوش', price: 0, daily: false },
  { id: 63, name: 'لالوش كبيرة', price: 0, daily: false },
  { id: 64, name: 'سلة كبيرة / صغيرة', price: 0, daily: false },
  { id: 65, name: 'باسينة', price: 0, daily: false },
  { id: 66, name: 'طابونة', price: 0, daily: false },
  { id: 67, name: 'طاس ماء', price: 0, daily: false },
  { id: 68, name: 'ترموست قهوة + حليب', price: 0, daily: false },
  { id: 69, name: 'ترموست شاي 1 لتر', price: 0, daily: false },
  { id: 70, name: 'ترموست شاي 3 لتر', price: 0, daily: false },
  { id: 71, name: 'كافتيريا شاي 3/4/8/10', price: 0, daily: false },
  { id: 72, name: 'قلاصيار', price: 0, daily: false },
  { id: 73, name: 'بوني بندراق', price: 0, daily: false },
  { id: 74, name: 'كاسرونة', price: 0, daily: false },
  { id: 75, name: 'خزان ماء', price: 0, daily: false },

  // --- الأجهزة والكراء باليوم ---
  { id: 76, name: 'فونتان فراش', price: 2000, daily: true },
  { id: 77, name: 'مبرد هواء', price: 1000, daily: true },
  { id: 78, name: 'Congélateur 1000', price: 1000, daily: true },
  { id: 79, name: 'Congélateur 1500', price: 1500, daily: true },
  { id: 80, name: 'مروحة', price: 0, daily: false },
  { id: 81, name: 'كواة', price: 0, daily: false },

  // --- الخدمات والعمالة ---
  { id: 82, name: 'تركيب ديكور', price: 0, daily: false },
  { id: 83, name: 'تركيب تندة', price: 0, daily: false },
  { id: 84, name: 'نقل', price: 0, daily: false },
  { id: 85, name: 'إضافات أخرى', price: 0, daily: false }
];

let CUSTOMERS = [];
let BOOKINGS = [];
let DELIVERIES = [];

let role = 'assistant';
let page = 'dashboard';

const NAV = {
  assistant: [
    {id:'dashboard', label:'لوحة التحكم'},
    {id:'bookings', label:'الحجوزات'},
    {id:'deliveries', label:'التسليم'},
    {id:'customers', label:'الزبائن'},
  ],
  admin: [
    {id:'dashboard', label:'لوحة التحكم'},
    {id:'bookings', label:'الحجوزات'},
    {id:'deliveries', label:'التسليم'},
    {id:'invoices', label:'الفواتير'},
    {id:'customers', label:'الزبائن'},
  ]
};