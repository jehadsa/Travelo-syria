/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Trip } from './types';

export const INITIAL_TRIPS: Trip[] = [
  // --- HOTELS ---
  {
    id: 'hotel-1',
    category: 'hotels',
    title: 'فندق الشام بالاس - دمشق',
    title_en: 'Cham Palace Hotel - Damascus',
    subtitle: 'الفخامة الدمشقية الأصيلة في قلب العاصمة التاريخية دمشق',
    subtitle_en: 'Authentic Syrian luxury in the heart of historic Damascus',
    description: 'يُصنف فندق الشام كأحد أعرق الفنادق خمس نجوم في سوريا، حيث يجمع بين عراقة التراث وتجهيزات الضيافة العصرية الفاخرة، يضم مسابح ساحرة ومطاعم تقدم أشهى الوجبات.',
    description_en: 'Cham Palace Hotel is regarded as one of the most prestigious five-star landmarks in Syria, seamlessly combining timeless heritage with luxury amenities, featuring magical swimming pools and exquisite cuisine.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=85'
    ],
    price: '140',
    locationName: 'شارع ميسلون، وسط دمشق، سوريا',
    locationName_en: 'Maysaloun Street, Damascus, Syria',
    hotelLocation: 'Cham Palace Damascus, Syria',
    adminRating: '4.8',
    isBooked: false,
    companyName: 'مجموعة الفنادق الشامية الوطنية',
    companyName_en: 'National Cham Hotels Group',
    services: ['مسبح خارجي فاخر', 'إنترنت واي فاي فائق السرعة', 'خدمة غرف على مدار الساعة', 'مركز لياقة بدنية متكامل', 'موقف سيارات مجاني آمن'],
    services_en: ['Luxury Outdoor Pool', 'High-speed Wi-Fi', '24/7 Room Service', 'Fully Equipped Gym', 'Secure Free Parking'],
    bedType: 'two_beds'
  },
  {
    id: 'hotel-2',
    category: 'hotels',
    title: 'فندق الداماروز - دمشق',
    title_en: 'Dama Rose Hotel - Damascus',
    subtitle: 'إقامة راقية ومثالية قريبة من المتحف الوطني وحديقة تشرين',
    subtitle_en: 'Elegant premium stay near the National Museum and Tishreen Park',
    description: 'يتميز فندق الداماروز بحدائقه الجميلة وجلساته الهادئة وخدماته الراقية التي تجعل من رحلتك تجربة استجمام وراحة متكاملة، سواء كنت مسافراً للعمل أو السياحة.',
    description_en: 'Dama Rose Hotel is famous for its stunning gardens, serene lounges, and premium service that make your stay highly relaxing, whether traveling for leisure or business.',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85'
    ],
    price: '110',
    locationName: 'أوتوستراد شكري القوتلي، دمشق، سوريا',
    locationName_en: 'Shukri Al-Quwatli Boulevard, Damascus, Syria',
    hotelLocation: 'Dama Rose Damascus, Syria',
    adminRating: '4.7',
    isBooked: false,
    companyName: 'الشركة السورية العربية للسياحة',
    companyName_en: 'Syrian Arab Tourism Company',
    services: ['إنترنت واي فاي مجاني', 'صالة سبا وجاكوزي', 'قاعات مؤتمرات مجهزة', 'مجموعة مطاعم شرقية وغربية'],
    services_en: ['Free High Quality Wi-Fi', 'Spa & Jacuzzi Salon', 'Equipped Business Lounges', 'Eastern & Western Restaurant Venues'],
    bedType: 'single_bed'
  },
  {
    id: 'hotel-3',
    category: 'hotels',
    title: 'منتجع أفاميا روتانا - اللاذقية',
    title_en: 'Afamia Rotana Resort - Lattakia',
    subtitle: 'إطلالات بحرية بانورامية ساحرة على شاطئ البحر الأبيض المتوسط',
    subtitle_en: 'Panoramic sea-view bliss on the Mediterranean coast',
    description: 'المرساة الحقيقية لقضاء أفضل العطلات العائلية في سورية، يقدم شواطئ رملية طبيعية خاصة، مسابح دافئة، غرف نوم بإطلالات تنبض بالحياة.',
    description_en: 'The ultimate getaway for Syrian family holidays, providing pristine private sandy beaches, warm blue swimming pools, and rooms directly overlooking the shoreline.',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1200&q=85'
    ],
    price: '165',
    locationName: 'الشاطئ الأزرق الكورنيش، اللاذقية، سوريا',
    locationName_en: 'Blue Beach Corniche, Lattakia, Syria',
    hotelLocation: 'Afamia Rotana Lattakia, Syria',
    adminRating: '4.9',
    isBooked: false,
    companyName: 'مجموعة روتانا العالمية للضيافة',
    companyName_en: 'Rotana Hospitality Management',
    services: ['شاطئ رملي خاص', 'ألعاب مائية وقوارب بحرية', 'نادي صحي وساونا استرخاء', 'بوفيه طعام مفتوح يومي'],
    services_en: ['Private Fine Sandy Beach', 'Water sports & boating activities', 'Health club & relaxation sauna', 'Premium daily buffet breakfast'],
    bedType: 'two_beds'
  },
  {
    id: 'hotel-4',
    category: 'hotels',
    title: 'فندق شهباء حلب - حلب',
    title_en: 'Shahba Hotel - Aleppo',
    subtitle: 'جوهرة حلب المعمارية ومستقر الراحة والضيافة الراقية',
    subtitle_en: 'The architectural gem of Aleppo offering comfort and high hospitality',
    description: 'يقع في أرقى أحياء حلب السكنية ويقدم غرفاً فخمة مطلة على حلب ومساحات استجمام ومطاعم تقدم الكباب الحلبي الأصلي.',
    description_en: 'Nestled within Aleppo’s premium residential neighbourhood, offering luxury rooms with cityscape vistas and culinary venues crafting authentic famous Aleppo kebabs.',
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=85'
    ],
    price: '95',
    locationName: 'حي المحافظة، الشهباء، حلب، سوريا',
    locationName_en: 'Al-Muhafazah District, Aleppo, Syria',
    hotelLocation: 'Shahba Hotel Aleppo, Syria',
    adminRating: '4.6',
    isBooked: false,
    companyName: 'مجموعة الفنادق الوطنية',
    companyName_en: 'National Hotels Aleppine',
    services: ['واي فاي مجاني', 'صالة رياضية متطورة', 'حمام بخار حلبي تقليدي', 'مطعم شرقي فاخر'],
    services_en: ['Free Wi-Fi access', 'Advanced fitness gym', 'Traditional Aleppo steam bath', 'Fine Eastern dining'],
    bedType: 'single_bed'
  },

  // --- CARS ---
  {
    id: 'car-1',
    category: 'cars',
    title: 'هيونداي إلنترا - فئة مريحة',
    title_en: 'Hyundai Elantra - Comfort Class',
    subtitle: 'سيارة عائلية اقتصادية ومثالية السفر بين المحافظات السورية',
    subtitle_en: 'Economy family car, ideal for travel between Syrian provinces',
    description: 'تعتبر سيارة هيونداي إلنترا هي الخيار الأكثر طلباً وراحة بفضل اقتصاديتها العالية في استهلاك الوقود وتكييفها الفائق المناسب للأجواء الصيفية.',
    description_en: 'The Hyundai Elantra is the most demanded rental option due to its high fuel economy, ultra-cool AC, and comfortable cabin ideal for any season.',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85'
    ],
    price: '35', // Daily rate (base without driver)
    locationName: 'دمشق / حلب / اللاذقية',
    locationName_en: 'Damascus / Aleppo / Lattakia available',
    adminRating: '4.8',
    isBooked: false,
    companyName: 'شركة القدموس للنقل البري',
    companyName_en: 'Al-Kadmous Transport Services',
    services: ['تكييف تبريد ذكي', 'موصل شاحن سريع و بلوتوث', 'تأمين شامل للسيارة', 'خيار السائق الخاص المتاح'],
    services_en: ['Smart Air Conditioner', 'Fast USB Charger & Bluetooth', 'Full insurance covered', 'Private experienced driver option available']
  },
  {
    id: 'car-2',
    category: 'cars',
    title: 'كيا سيراتو - كاملة التجهيز',
    title_en: 'Kia Cerato - Full Option',
    subtitle: 'انسيابية مطلقة وموثوقية ممتعة في القيادة والتنقل اليومي',
    subtitle_en: 'Absolute smoothness and reliable engineering for everyday travel',
    description: 'سيارة متوسطة الحجم ذات مظهر رياضي رائع، مع شاشة ملاحة وتجربة تحكّم على عجلة القيادة تجعلها رائعة للتنقل داخل وخارج المدن.',
    description_en: 'A sports-styled medium sedan equipped with a smart navigation screen, active steering controls, and high ride comfort suited for urban or suburban roads.',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85'
    ],
    price: '40',
    locationName: 'دمشق / ريف دمشق / حمص',
    locationName_en: 'Damascus / Damascus Countryside / Homs available',
    adminRating: '4.7',
    isBooked: false,
    companyName: 'شركة شاهين لخدمات تأجير السيارات',
    companyName_en: 'Shahin Rent-A-Car Company',
    services: ['ناقل حركة أوتوماتيكي حديث', 'شاشة ذكية ونوافذ كهربائية', 'مستشعرات خلفية للاصطفاف', 'صندوق أمتعة خلفي واسع جداً'],
    services_en: ['Modern Automatic Transmission', 'Smart screen & electronic windows', 'Rear parking assist sensors', 'Spacious rear luggage space']
  },
  {
    id: 'car-3',
    category: 'cars',
    title: 'مرسيدس بنز E-Class - الفئة VIP الفخمة',
    title_en: 'Mercedes-Benz E-Class - Luxe VIP',
    subtitle: 'الفخامة والأناقة في أبهى صورها لرجال الأعمال والوفود السياحية',
    subtitle_en: 'Utmost luxury and status for business trips and premium tourist routes',
    description: 'مرسيدس بنز الفئة E تضع المعايير العالية للفخامة، المقاعد مطرزة بالجلد المتطور مع تبريد وتدفئة مدمجة مع باقة شاملة من وسائل الرفاهية والسلامة.',
    description_en: 'The majestic Mercedes E-Class sets the gold standard for executive travel, with ventilated heated leather seats and a suite of absolute comfort and safety systems.',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85'
    ],
    price: '80',
    locationName: 'دمشق / جميع المحافظات السورية',
    locationName_en: 'Damascus / All Syrian provinces coverage',
    adminRating: '4.9',
    isBooked: false,
    companyName: 'مكتب الشام VIP للسياحة والسيارات',
    companyName_en: 'Al-Sham VIP Travel & Limousines',
    services: ['سائق محترف يتحدث لغات متعددة', 'إنترنت واي فاي Wi-Fi داخلي', 'تفاصيل ضيافة ومشروبات ترحيبية', 'نظام عزل ضوضاء خارق'],
    services_en: ['Multilingual professional private driver', 'Free in-car Wi-Fi hotspot', 'Premium refreshments & welcoming gifts', 'Extraordinary cabin silence system']
  },

  // --- RESTAURANTS ---
  {
    id: 'restaurant-1',
    category: 'restaurants',
    title: 'مطعم بيت جدي الأثري - دمشق القديمة',
    title_en: 'Beit Jaddi Heritage Restaurant - Old Damascus',
    subtitle: 'عشاء دمشقي تراثي ساحر على صوت عزف العود ونسمات الياسمين والبحرة الأثرية',
    subtitle_en: 'Damascene dinner inside an ancient open courtyard with live Oud music',
    description: 'تجربة طعام دمشقية لا تضاهى، ينقلك هذا المطعم العريق في باب توما إلى منتصف القرن التاسع عشر ببهائه وباحته المزدانة بالياسمين الدمشقي والنافورة اللامعة في الوسط.',
    description_en: 'An unparalleled Damascene culinary escape, transporting you into a gorgeous 19th-century courtyard home adorned with Syrian Jasmine, historic fountains, and ancient stone design.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85'
    ],
    price: '25', // Booking price per person placeholder
    locationName: 'حارة مأذنة الشحم، دمشق القديمة، سوريا',
    locationName_en: 'Madhanat Al-Shaham Lane, Old Damascus, Syria',
    restaurantLocation: 'Beit Jaddi Damascus Old City, Syria',
    adminRating: '4.9',
    isBooked: false,
    companyName: 'مجموعة المأكولات التراثية الشرقية',
    companyName_en: 'Oriental Heritage Restaurants Group',
    services: ['عزف فني حي على العود', 'جلسات باحة سورية مكشوفة', 'أشهى المشويات الكباب والتبولة والفتوش', 'ضيافة قهوة عربية وحلويات مجانية'],
    services_en: ['Live traditional acoustic Oud performance', 'Open-air courtyard authentic seating', 'Famous Damascus Kebabs, Tabbouleh, and Fattoush', 'Complimentary Arabic coffee & sweets']
  },
  {
    id: 'restaurant-2',
    category: 'restaurants',
    title: 'مطعم الشلال الأخضر - بلودان',
    title_en: 'Green Waterfall Restaurant - Bloudan',
    subtitle: 'مشاوير صيفية منعشة وإطلالات طبيعية خلابة بجانب شلال بلودان العذب',
    subtitle_en: 'Refreshed mountain breezes and panoramic scenery by Bloudan waterfalls',
    description: 'يقع مطعم الشلال الأخضر في مصيف بلودان المرتفع عن سطح البحر، ويقدم جلسات عائلية ممتعة تحت دالية العنب العريضة وهواء نقي وبارد في عز الصيف دمشق.',
    description_en: 'Green Waterfall lies nestled inside Bloudan’s high-altitude resort. Perfect for relaxing afternoon family lunches, surrounded by cooling breezes, waterfalls, and shade trees.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85'
    ],
    price: '20',
    locationName: 'شارع الشلالات العام، بلودان، ريف دمشق، سوريا',
    locationName_en: 'Waterfalls Boulevard, Bloudan, Damascus Countryside, Syria',
    restaurantLocation: 'Bloudan waterfalls, Rif Dimashq, Syria',
    adminRating: '4.8',
    isBooked: false,
    companyName: 'بلودان للاستثمارات السياحية والترفيهية',
    companyName_en: 'Bloudan Tourism & Leisure Investments',
    services: ['إطلالة مذهلة على السهول ومجرى المياه', 'أقسام طعام عائلية خاصة ومستقلة', 'ألعاب آمنة ومسلية للأطفال', 'مواقف خاصة بالعملاء ومجانية'],
    services_en: ['Overwhelming valleys & waterfall views', 'Private family eating sections', 'Dedicated childrens playground zone', 'Free private valet parking space']
  },
  {
    id: 'restaurant-3',
    category: 'restaurants',
    title: 'مطعم نابل وكافيه - حمص',
    title_en: 'Nabel Restaurant & Cafe - Homs',
    subtitle: 'الملتقى الأرقى لتقديم وجبات شهية وقهوة مختصة ونكهة حديثة ومريحة',
    subtitle_en: 'The absolute classiest spot for specialized coffee, modern snacks and comfort',
    description: 'يجمع مطعم نابل أرقى تفاصيل الديكورات العصرية الهادئة المكتوبة بذوق فني في مدينة حمص الساحرة، ويقدم قائمة طعام عالمية متنوعة تلبّي رغبات الجميع.',
    description_en: 'Nabel unites executive chic aesthetics with contemporary industrial styling, crafting a diverse international menu tailored to young crowds and family outings.',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=85'
    ],
    price: '15',
    locationName: 'حي الغوطة، حمص، سوريا',
    locationName_en: 'Al-Ghouta District, Homs, Syria',
    restaurantLocation: 'Homs Al Ghouta, Syria',
    adminRating: '4.7',
    isBooked: false,
    companyName: 'شركة نابل جروب للمطاعم والضيافة',
    companyName_en: 'Nabel Group for Restaurants & Diners',
    services: ['تكييف مركزي متطور ومقاعد وثيرة', 'قهوة مختصة محضرة باحترافية', 'مكان مخصص ومريح للعمل والدراسة', 'عروض أسبوعية خاصة للعملاء'],
    services_en: ['Advanced climate control & premium seating', 'Handcrafted professional specialty coffee', 'Quiet spaces optimized for studying/remote work', 'Special weekly value discounts']
  },

  // --- APARTMENTS ---
  {
    id: 'apartment-1',
    category: 'apartments',
    title: 'شقة سكنية ديلوكس - أبو رمانة، دمشق',
    title_en: 'Deluxe Apartment - Abu Rummaneh, Damascus',
    subtitle: 'شقة مفروشة راقية ومجهزة بالكامل في أفخم أحياء العاصمة دمشق',
    subtitle_en: 'Fully equipped elegant furnished flat in the most prestigious VIP district of Damascus',
    description: 'شقة فسيحة ومفروشة بذوق رفيع في حي أبو رمانة الهادئ والمحمي، تحتوي على غرفتي نوم وصالون واسع مع شرفة مطلة على حديقة ياسمين، ومجهزة بالكامل بأنظمة طاقة بديلة وإنترنت فايبر عالي السرعة وتدفئة مدمجة.',
    description_en: 'Spacious and tastefully furnished apartment in the peaceful, elite Abu Rummaneh district. Features two bedrooms, a large saloon with a balcony overlooking a jasmine garden, solar backup power, and high-speed fiber Wi-Fi.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=85'
    ],
    price: '55',
    locationName: 'شارع الجلاء، حي أبو رمانة، دمشق، سوريا',
    locationName_en: 'Al-Jalaa Street, Abu Rummaneh, Damascus, Syria',
    adminRating: '4.8',
    isBooked: false,
    companyName: 'مكتب عقارات العاصمة الفاخرة',
    companyName_en: 'Capital Elite Real Estate Group',
    services: ['طاقة شمسية بديلة 24 ساعة', 'إنترنت ألياف ضوئية فايبر سريع', 'تدفئة مركزية وغسالة متطورة', 'مطبخ مجهز بكامل الأدوات', 'أمن وحراسة على مدار الساعة'],
    services_en: ['24/7 Solar Backup Power', 'High-Speed Fiber Wi-Fi', 'Central Heating & Washing Machine', 'Fully Equipped Modern Kitchen', '24/7 Building Security & Concierge']
  },
  {
    id: 'apartment-2',
    category: 'apartments',
    title: 'شقة إطلالة جبل قاسيون - مشروع دمر',
    title_en: 'Qasioun Mountain View Flat - Dummar Project',
    subtitle: 'إطلالة جبلية خلابة وهواء نقي في جزر مشروع دمر السكنية الحديثة',
    subtitle_en: 'Stunning mountain views and fresh clean air in modern Dummar project blocks',
    description: 'شقة سكنية حديثة ومألوفة تقع في الجزيرة السادسة بمشروع دمر، تمتاز بإطلالتها الفريدة الممتدة نحو جبل قاسيون الشهير ونظافتها الاستثنائية، وهي الخيار الأمثل للعائلات والمغتربين الزائرين لسوريا.',
    description_en: 'Modern residential flat positioned in the premium 6th island of Dummar Project. Renowned for its unique direct panoramic views of the famous Mt. Qasioun, high cleanliness standard, and suitability for families and expats.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85'
    ],
    price: '48',
    locationName: 'مشروع دمر، الجزيرة السادسة، دمشق، سوريا',
    locationName_en: 'Dummar Project, 6th Block, Damascus, Syria',
    adminRating: '4.7',
    isBooked: false,
    companyName: 'شهد للخدمات الفندقية والعقارية',
    companyName_en: 'Shahd Hotel & Real Estate Booking',
    services: ['تكييف صامت وتبريد ممتاز', 'شاشة عرض ذكية 4K وبلوتوث', 'نظام طاقة كهربائية متكامل', 'موقف سيارات مظلل وخاص', 'قريب من المجمعات التجارية'],
    services_en: ['Silent AC & cooling systems', 'Smart 4K TV & Streaming', 'Full electrical backup solution', 'Shaded private parking slot', 'Steps away from local malls & markets']
  },
  {
    id: 'apartment-3',
    category: 'apartments',
    title: 'شقة فاخرة على الكورنيش - طرطوس',
    title_en: 'Seafront Luxury Apartment - Tartus Corniche',
    subtitle: 'شقة فسيحة بإطلالة بحرية مباشرة على الكوبرا والجزيرة المقابلة أرواد',
    subtitle_en: 'Spacious flat enjoying direct azure sea views of Tartus shore and Arwad Island',
    description: 'استيقظ على نسيم البحر الأبيض المتوسط الرائع في هذه الشقة الفسيحة الواقعة مباشرة على الكورنيش البحري الجديد في طرطوس، مكسوة سوبر ديلوكس ومجهزة بشرفة واسعة للجلسات الصيفية والتمتع بالغروب.',
    description_en: 'Wake up to the refreshing Mediterranean breeze in this spacious, super-deluxe apartment placed directly on the new Beach Corniche in Tartus. Boasts a massive glass terrace perfect for sunset relaxation.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85'
    ],
    price: '60',
    locationName: 'الكورنيش البحري الجديد، مقابل أرواد، طرطوس، سوريا',
    locationName_en: 'New Sea Corniche, facing Arwad, Tartus, Syria',
    adminRating: '4.9',
    isBooked: false,
    companyName: 'مكتب الساحل الذهبي للخدمات السياحية',
    companyName_en: 'Golden Coast Tourist Rent Services',
    services: ['شرفة بانورامية واسعة على البحر', 'تدفئة وتكييف متكامليين', 'أجهزة مطبخ حديثة لطهي مريح', 'مصعد كهربائي سريع', 'خدمة إنترنت ممتازة وذكية'],
    services_en: ['Panoramic vast sea balcony', 'Integral heating & ventilation', 'High-end culinary tech suite', 'Fast modern lift access', 'High-speed internet router']
  }
];

export const CAR_PRICING = {
  withDriverIncrement: 20, // Add $20/day for private driver option
};
