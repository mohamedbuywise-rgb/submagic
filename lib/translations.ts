export type Lang = 'ar' | 'en'

export const BRAND = { en: 'ClipGenie', ar: 'كليب جيني' }

export const translations = {
  en: {
    dir: 'ltr' as const,
    nav: { pricing: 'Pricing', features: 'Features', dashboard: 'Dashboard', getStarted: 'Get Started' },
    hero: {
      title1: 'Auto Subtitles',
      titleAnd: '&',
      titleAccent: 'AI Backgrounds',
      subtitle:
        'Upload your video. Get perfect subtitles in Arabic & 99 languages. Upload your product. Get studio backgrounds in seconds.',
      ctaSubtitles: 'Try Subtitles Free →',
      ctaBackgrounds: 'Generate Backgrounds',
    },
    features: {
      heading: 'What you get',
      sub: 'No templates. No cards. Just clean, flowing design.',
      items: [
        {
          title: 'Auto Subtitles',
          desc: 'AI listens to your video and writes every word. Arabic dialects included. Download as SRT, VTT, or burn directly into the video.',
        },
        {
          title: 'Background Generator',
          desc: 'Remove any background from your product photo. Replace with white, gradient, or AI-generated lifestyle scenes.',
        },
        {
          title: 'Lightning Fast',
          desc: '10-minute video processed in under 2 minutes. No queues, no waiting hours. Your time matters.',
        },
      ],
    },
    upload: {
      heading: 'Upload anything',
      sub: 'Drag, drop, done. No complicated forms.',
      dropTitle: 'Drop your file here',
      videoOrImage: 'Video (MP4, MOV) or Image (PNG, JPG)',
      upTo: 'Up to',
      browse: 'Or click to browse',
    },
    fileStatus: { Done: 'Done', Processing: 'Processing' },
    pricing: {
      heading: 'Simple pricing',
      sub: 'Pay for what you use. No hidden fees.',
      popular: '★ Popular',
      plans: [
        { name: 'Free', desc: '10 min video + 5 images', price: '$0' },
        { name: 'Basic', desc: '60 min + 50 images / month', price: '$5' },
        { name: 'Pro', desc: '300 min + 200 images / month', price: '$15' },
      ],
    },
    cta: {
      heading: 'Ready to try?',
      sub: 'Start free. No credit card required. Cancel anytime.',
      button: 'Start Free →',
    },
    footer: {
      madeWith: `Made with ✨ by the ${BRAND.en} Team`,
      pricing: 'Pricing',
      apiDocs: 'API Docs',
      privacy: 'Privacy',
      contact: 'Contact',
    },
    dashboardNav: { credits: 'Credits' },
    sidebar: { allTools: 'All Tools', menu: 'Menu', myFiles: 'My Files', settings: 'Settings', credits: 'Credits' },
    panel: {
      options: 'Options',
      selectOption: 'Select option...',
      enterText: 'Enter Text',
      textPlaceholder: 'اكتب النص هنا... / Type your text here...',
      dropFile: 'Drop your file here',
      upTo: 'Up to',
      browse: 'Or click to browse',
      video: 'Video',
      image: 'Image',
      file: 'File',
      generateSpeech: '🔊 Generate Speech',
      processWith: '⚡ Process with',
      recentFiles: 'Recent Files',
      download: '↓ Download',
    },
    alerts: {
      uploadSoon: 'Upload coming soon!',
      enterTextFirst: 'Please enter text first!',
      processingWith: 'Processing with',
    },
    tools: {
      subtitles: {
        name: 'Auto Subtitles',
        desc: 'Transcribe video to text with professional styling',
        options: [
          'Output: SRT only',
          'Output: Burn-in (Classic)',
          'Output: Burn-in (TikTok)',
          'Output: Burn-in (Box)',
          'Output: Burn-in (Glow)',
          'Output: Burn-in (Minimal)',
        ],
      },
      'remove-bg': { name: 'Remove Background', desc: 'Remove background from product photos' },
      tts: {
        name: 'Text to Speech',
        desc: 'Convert text to natural-sounding voice',
        options: ['Language: Arabic', 'Language: English', 'Language: French'],
      },
      audio: { name: 'Audio Enhance', desc: 'Remove noise and boost audio quality' },
      compress: {
        name: 'Compress Video',
        desc: 'Reduce file size while keeping quality',
        options: ['Quality: Low (smallest)', 'Quality: Medium (balanced)', 'Quality: High (best)'],
      },
      noise: { name: 'Noise Removal', desc: 'Clean background noise from audio/video' },
      speed: {
        name: 'Speed Control',
        desc: 'Speed up or slow down your video',
        options: ['0.5x — Slow motion', '0.75x — Slightly slow', '1.25x — Slightly fast', '1.5x — Fast', '2.0x — Very fast'],
      },
      convert: {
        name: 'Convert Format',
        desc: 'Change video/image to any format',
        options: ['Format: MP4', 'Format: MOV', 'Format: AVI', 'Format: WebM', 'Format: GIF', 'Format: MKV'],
      },
    },
    sampleFiles: {
      f1: { name: 'tutorial_video.mp4', meta: '10:24 • 45MB' },
      f2: { name: 'product_shoe.png', meta: '2.4MB' },
      f3: { name: 'podcast_ep12.mp4', meta: '45:00 • 120MB' },
      f4: { name: 'vlog_compressed.mp4', meta: '12MB (was 89MB)' },
    },
  },
  ar: {
    dir: 'rtl' as const,
    nav: { pricing: 'الأسعار', features: 'المميزات', dashboard: 'لوحة التحكم', getStarted: 'ابدأ الآن' },
    hero: {
      title1: 'ترجمة تلقائية',
      titleAnd: 'و',
      titleAccent: 'خلفيات بالذكاء الاصطناعي',
      subtitle: 'ارفع الفيديو بتاعك واحصل على ترجمة احترافية بالعربي و٩٩ لغة تانية. ارفع صورة المنتج واحصل على خلفية استوديو في ثواني.',
      ctaSubtitles: 'جرّب الترجمة مجانًا ←',
      ctaBackgrounds: 'اعمل خلفية جديدة',
    },
    features: {
      heading: 'هتاخد إيه؟',
      sub: 'من غير تمبلتس ولا كروت تقليدية، تصميم نضيف وسلس.',
      items: [
        {
          title: 'ترجمة تلقائية',
          desc: 'الذكاء الاصطناعي بيسمع الفيديو ويكتب كل كلمة، وبيفهم اللهجات العربية كمان. نزّل الترجمة SRT أو VTT، أو خليها تظهر جوه الفيديو على طول.',
        },
        {
          title: 'مولّد الخلفيات',
          desc: 'شيل أي خلفية من صورة منتجك، وحطّ بدالها لون أبيض، تدرّج لوني، أو مشهد واقعي بالذكاء الاصطناعي.',
        },
        {
          title: 'سرعة البرق',
          desc: 'فيديو مدته ١٠ دقايق بيتظبط في أقل من دقيقتين. من غير طوابير ولا استنى ساعات، وقتك يهمنا.',
        },
      ],
    },
    upload: {
      heading: 'ارفع أي حاجة',
      sub: 'اسحب الملف، حطه، وخلاص. من غير فورمات معقدة.',
      dropTitle: 'حط ملفك هنا',
      videoOrImage: 'فيديو (MP4, MOV) أو صورة (PNG, JPG)',
      upTo: 'لحد',
      browse: 'أو دوس تختار من جهازك',
    },
    fileStatus: { Done: 'خلصان', Processing: 'بيتم تجهيزه' },
    pricing: {
      heading: 'أسعار بسيطة',
      sub: 'ادفع بس على اللي بتستخدمه، من غير رسوم مخفية.',
      popular: '★ الأكتر طلبًا',
      plans: [
        { name: 'مجاني', desc: '١٠ دقايق فيديو + ٥ صور', price: '$0' },
        { name: 'أساسي', desc: '٦٠ دقيقة + ٥٠ صورة شهريًا', price: '$5' },
        { name: 'برو', desc: '٣٠٠ دقيقة + ٢٠٠ صورة شهريًا', price: '$15' },
      ],
    },
    cta: {
      heading: 'جاهز تجرّب؟',
      sub: 'ابدأ مجانًا، من غير فيزا، وتقدر تلغي في أي وقت.',
      button: 'ابدأ مجانًا ←',
    },
    footer: {
      madeWith: `اتعمل بحب ✨ من فريق ${BRAND.ar}`,
      pricing: 'الأسعار',
      apiDocs: 'توثيق الـ API',
      privacy: 'الخصوصية',
      contact: 'تواصل معانا',
    },
    dashboardNav: { credits: 'رصيد' },
    sidebar: { allTools: 'كل الأدوات', menu: 'القائمة', myFiles: 'ملفاتي', settings: 'الإعدادات', credits: 'الرصيد' },
    panel: {
      options: 'الخيارات',
      selectOption: 'اختار خيار...',
      enterText: 'اكتب النص',
      textPlaceholder: 'اكتب النص هنا... / Type your text here...',
      dropFile: 'حط ملفك هنا',
      upTo: 'لحد',
      browse: 'أو دوس تختار من جهازك',
      video: 'فيديو',
      image: 'صورة',
      file: 'ملف',
      generateSpeech: '🔊 اعمل الصوت',
      processWith: '⚡ ابدأ التنفيذ بـ',
      recentFiles: 'آخر الملفات',
      download: '↓ تنزيل',
    },
    alerts: {
      uploadSoon: 'خاصية الرفع جاية قريب!',
      enterTextFirst: 'اكتب النص الأول من فضلك!',
      processingWith: 'بيتم التنفيذ بـ',
    },
    tools: {
      subtitles: {
        name: 'ترجمة تلقائية',
        desc: 'حوّل الفيديو لنص بتنسيق احترافي',
        options: [
          'المخرج: SRT بس',
          'المخرج: مدمجة (كلاسيك)',
          'المخرج: مدمجة (تيك توك)',
          'المخرج: مدمجة (بوكس)',
          'المخرج: مدمجة (جلو)',
          'المخرج: مدمجة (بسيطة)',
        ],
      },
      'remove-bg': { name: 'شيل الخلفية', desc: 'شيل خلفية صور المنتجات بضغطة واحدة' },
      tts: {
        name: 'تحويل نص لصوت',
        desc: 'حوّل أي نص لصوت طبيعي',
        options: ['اللغة: عربي', 'اللغة: إنجليزي', 'اللغة: فرنساوي'],
      },
      audio: { name: 'تحسين الصوت', desc: 'شيل الضوضاء وحسّن جودة الصوت' },
      compress: {
        name: 'ضغط الفيديو',
        desc: 'قلّل حجم الفيديو من غير ما تخسر الجودة',
        options: ['الجودة: منخفضة (أصغر حجم)', 'الجودة: متوسطة (متوازنة)', 'الجودة: عالية (الأفضل)'],
      },
      noise: { name: 'إزالة الضوضاء', desc: 'نضّف صوت الفيديو من الضوضاء' },
      speed: {
        name: 'التحكم في السرعة',
        desc: 'سرّع أو بطّئ الفيديو بتاعك',
        options: ['0.5x — سلو موشن', '0.75x — أبطأ شوية', '1.25x — أسرع شوية', '1.5x — سريع', '2.0x — سريع جدًا'],
      },
      convert: {
        name: 'تغيير الصيغة',
        desc: 'حوّل الفيديو أو الصورة لأي صيغة',
        options: ['الصيغة: MP4', 'الصيغة: MOV', 'الصيغة: AVI', 'الصيغة: WebM', 'الصيغة: GIF', 'الصيغة: MKV'],
      },
    },
    sampleFiles: {
      f1: { name: 'فيديو_تعليمي.mp4', meta: '١٠:٢٤ • ٤٥ ميجا' },
      f2: { name: 'صورة_منتج.png', meta: '٢.٤ ميجا' },
      f3: { name: 'بودكاست_حلقة١٢.mp4', meta: '٤٥:٠٠ • ١٢٠ ميجا' },
      f4: { name: 'فلوج_مضغوط.mp4', meta: '١٢ ميجا (كانت ٨٩ ميجا)' },
    },
  },
} as const

export type Translations = typeof translations.en
