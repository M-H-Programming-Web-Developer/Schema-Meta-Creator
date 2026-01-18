
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wand2, 
  Code2, 
  Settings2, 
  Globe2, 
  MapPin, 
  Layers, 
  ChevronRight,
  Info,
  Loader2,
  Trash2,
  Plus,
  Link2,
  Layout,
  MessageSquare,
  HelpCircle,
  Navigation,
  Clock,
  Facebook,
  Twitter,
  Image as ImageIcon,
  User,
  Type
} from 'lucide-react';
import { Input } from './components/Input';
import { CodeBlock } from './components/CodeBlock';
import { SeoData, ServiceType, SERVICE_SCHEMA_MAP, PageType, FAQ, WorkingHours } from './types';
import { generateSeoContent } from './services/geminiService';

const DEFAULT_CITIES = ['Houston', 'Bellaire', 'Pasadena', 'Pearland', 'Sugar Land'];
const DEFAULT_FAQS: FAQ[] = [
  { question: "How often should I clean my air ducts?", answer: "We recommend professional cleaning every 3-5 years depending on usage and local air quality." },
  { question: "Are your technicians certified?", answer: "Yes, all our service professionals are fully trained, certified, and insured for your peace of mind." }
];

const App: React.FC = () => {
  const [formData, setFormData] = useState<SeoData>({
    businessName: 'Almo Air Duct Cleaning',
    baseUrl: 'https://almohoustonairductcleaning.com/',
    phone: '+1-281-715-0763',
    email: 'service@almohoustonairductcleaning.com',
    address: '5085 Westheimer Rd',
    city: 'Houston',
    state: 'TX',
    zip: '77056',
    lat: '29.7407',
    lng: '-95.4636',
    serviceType: 'Air Duct Cleaning',
    areaServed: DEFAULT_CITIES,
    relatedServices: ['AC Cleaning', 'Vent Sanitizing', 'Furnace Cleaning'],
    themeColor: '#0b2a4a',
    faviconUrl: 'https://almohoustonairductcleaning.com/img/fav.png',
    appleTouchIconUrl: 'https://almohoustonairductcleaning.com/img/apple-touch-icon.png',
    logoUrl: 'https://almohoustonairductcleaning.com/img/logo.png',
    primaryImageUrl: 'https://almohoustonairductcleaning.com/img/air-duct-cleaning-houston.jpg',
    facebookUrl: 'https://www.facebook.com/almoairductcleaning',
    twitterUrl: 'https://twitter.com/almoairduct',
    couponImageUrl: '', 
    pageType: 'Home',
    faqs: DEFAULT_FAQS,
    workingHours: {
      weekdayOpens: '08:00',
      weekdayCloses: '19:00',
      weekendOpens: '09:00',
      weekendCloses: '17:00',
      is247: false
    },
    metaTitle: '',
    metaDescription: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [newCity, setNewCity] = useState('');
  const [newRelated, setNewRelated] = useState('');

  const services: ServiceType[] = [
    'Air Duct Cleaning',
    'Dryer Vent Cleaning',
    'Water Heater Service',
    'Plumbing',
    'Garage Door',
    'Locksmith',
    'Carpet Cleaning'
  ];

  const pageTypes: PageType[] = ['Home', 'Service', 'About', 'Contact', 'FAQs', 'Locations'];

  const handleAiGeneration = async () => {
    setIsGenerating(true);
    const content = await generateSeoContent(
      formData.serviceType, 
      formData.city, 
      formData.businessName,
      formData.pageType,
      formData.relatedServices
    );
    setFormData(prev => ({
      ...prev,
      metaTitle: content.title,
      metaDescription: content.description
    }));
    setIsGenerating(false);
  };

  useEffect(() => {
    handleAiGeneration();
  }, [formData.serviceType, formData.city, formData.businessName, formData.pageType]);

  const addCity = () => {
    if (newCity && !formData.areaServed.includes(newCity)) {
      setFormData(prev => ({ ...prev, areaServed: [...prev.areaServed, newCity] }));
      setNewCity('');
    }
  };

  const removeCity = (city: string) => {
    setFormData(prev => ({ ...prev, areaServed: prev.areaServed.filter(c => c !== city) }));
  };

  const addRelated = () => {
    if (newRelated && !formData.relatedServices.includes(newRelated)) {
      setFormData(prev => ({ ...prev, relatedServices: [...prev.relatedServices, newRelated] }));
      setNewRelated('');
    }
  };

  const removeRelated = (item: string) => {
    setFormData(prev => ({ ...prev, relatedServices: prev.relatedServices.filter(i => i !== item) }));
  };

  const updateFaq = (index: number, field: keyof FAQ, value: string) => {
    const updated = [...formData.faqs];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, faqs: updated }));
  };

  const addFaq = () => {
    setFormData(prev => ({ ...prev, faqs: [...prev.faqs, { question: '', answer: '' }] }));
  };

  const removeFaq = (index: number) => {
    setFormData(prev => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== index) }));
  };

  const updateWorkingHours = (field: keyof WorkingHours, value: any) => {
    setFormData(prev => ({
      ...prev,
      workingHours: { ...prev.workingHours, [field]: value }
    }));
  };

  const generatedCode = useMemo(() => {
    const { 
      businessName, baseUrl, phone, email, address, city, state, zip, 
      lat, lng, serviceType, areaServed, relatedServices, themeColor, 
      faviconUrl, appleTouchIconUrl, logoUrl, primaryImageUrl, facebookUrl, twitterUrl, pageType, faqs, workingHours,
      metaTitle, metaDescription 
    } = formData;
    
    const schemaType = SERVICE_SCHEMA_MAP[serviceType];
    const canonicalBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const pageSlug = pageType === 'Home' ? '' : pageType.toLowerCase().replace(/\s+/g, '-');
    const canonical = pageSlug ? `${canonicalBase}${pageSlug}/` : canonicalBase;
    
    const safeTitle = metaTitle || `${businessName} ${pageType} - ${serviceType} ${city}`;
    const safeDesc = metaDescription || `Professional ${serviceType} in ${city}, ${state}. Contact ${businessName} for quality service.`;

    const breadcrumbs = [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": canonicalBase }
    ];

    if (pageType !== 'Home') {
      breadcrumbs.push({ 
        "@type": "ListItem", 
        "position": 2, 
        "name": pageType, 
        "item": canonical 
      });
    }

    const openingHoursSpec = workingHours.is247 
      ? [{
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
          "opens": "00:00",
          "closes": "23:59"
        }]
      : [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
            "opens": workingHours.weekdayOpens,
            "closes": workingHours.weekdayCloses
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Saturday","Sunday"],
            "opens": workingHours.weekendOpens,
            "closes": workingHours.weekendCloses
          }
        ];

    const socialLinks = [facebookUrl, twitterUrl].filter(Boolean);

    const commonBusiness = {
      "@type": schemaType,
      "@id": `${canonicalBase}#business`,
      "name": `${businessName}, INC`,
      "url": canonicalBase,
      "logo": logoUrl,
      "image": primaryImageUrl,
      "telephone": phone,
      "email": email,
      "priceRange": "$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": address,
        "addressLocality": city,
        "addressRegion": state,
        "postalCode": zip,
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": parseFloat(lat),
        "longitude": parseFloat(lng)
      },
      "hasMap": `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address} ${city} ${state} ${zip}`)}`,
      "openingHoursSpecification": openingHoursSpec,
      "areaServed": areaServed.map(c => ({ "@type": "City", "name": `${c}, ${state}` })),
      "sameAs": socialLinks
    };

    let specificSchema = "";

    if (pageType === 'Service') {
      specificSchema = `,
    {
      "@type": "Service",
      "@id": "${canonical}#service",
      "name": "${serviceType}",
      "provider": { "@id": "${canonicalBase}#business" },
      "areaServed": ${JSON.stringify(areaServed.map(c => ({ "@type": "City", "name": `${c}, ${state}` })), null, 2).split('\n').join('\n      ')},
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "${serviceType} Related Services",
        "itemListElement": [
          ${relatedServices.map(rs => JSON.stringify({
            "@type": "Offer",
            "itemOffered": { "@type": "Service", "name": rs }
          })).join(',\n          ')}
        ]
      }
    }`;
    } else if (pageType === 'Contact') {
      specificSchema = `,
    {
      "@type": "ContactPage",
      "@id": "${canonical}#contactpage",
      "url": "${canonical}",
      "name": "${safeTitle}",
      "mainEntity": { "@id": "${canonicalBase}#business" }
    }`;
    } else if (pageType === 'About') {
      specificSchema = `,
    {
      "@type": "AboutPage",
      "@id": "${canonical}#aboutpage",
      "url": "${canonical}",
      "name": "${safeTitle}",
      "mainEntity": { "@id": "${canonicalBase}#business" }
    }`;
    } else if (pageType === 'FAQs') {
      specificSchema = `,
    {
      "@type": "FAQPage",
      "@id": "${canonical}#faqpage",
      "mainEntity": [
        ${faqs.map(faq => JSON.stringify({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
        })).join(',\n        ')}
      ]
    }`;
    } else if (pageType === 'Locations') {
      specificSchema = `,
    {
      "@type": "ItemPage",
      "@id": "${canonical}#locationspage",
      "name": "Service Locations - ${businessName}",
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": [
          ${areaServed.map((c, i) => JSON.stringify({
            "@type": "ListItem",
            "position": i + 1,
            "name": `${c}, ${state}`,
            "description": `${serviceType} services provided in ${c}, ${state} by ${businessName}`
          })).join(',\n          ')}
        ]
      }
    }`;
    }

    return `<!-- ✅ SEO-Edited HEAD (Clean + Modern + Local SEO) -->
<title>${safeTitle}</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="${safeDesc}" />
<link rel="canonical" href="${canonical}" />

<!-- ✅ Robots (clean) -->
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">

<!-- ✅ Modern SEO Tags -->
<meta name="author" content="${businessName}">
<meta name="theme-color" content="${themeColor}">
<meta name="format-detection" content="telephone=yes">

<!-- ✅ Local SEO Power Tags -->
<meta name="geo.region" content="US-${state}">
<meta name="geo.placename" content="${city}">
<meta name="geo.position" content="${lat};${lng}">
<meta name="ICBM" content="${lat}, ${lng}">

<!-- FavIcons -->
<link rel="apple-touch-icon" href="${appleTouchIconUrl}">
<link rel="icon" href="${faviconUrl}" type="image/png">
<link rel="stylesheet" type="text/css" href="${canonicalBase}print.css" media="print"/>

<!-- Open Graph -->
<meta property="og:title" content="${safeTitle}" />
<meta property="og:description" content="${safeDesc}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${canonical}" />
<meta property="og:image" content="${primaryImageUrl}" />
<meta property="og:site_name" content="${businessName} ${city} ${state}" />
${facebookUrl ? `<meta property="og:see_also" content="${facebookUrl}" />` : ''}

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${safeTitle}">
<meta name="twitter:description" content="${safeDesc}">
<meta name="twitter:image" content="${primaryImageUrl}">
${twitterUrl ? `<meta name="twitter:site" content="@${twitterUrl.split('/').pop()}">` : ''}

<!-- ✅ ${pageType} Page Schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "${canonicalBase}#website",
      "url": "${canonicalBase}",
      "name": "${businessName}"
    },
    ${JSON.stringify(commonBusiness, null, 2).split('\n').join('\n    ')},
    {
      "@type": "WebPage",
      "@id": "${canonical}#webpage",
      "url": "${canonical}",
      "name": "${safeTitle}",
      "isPartOf": { "@id": "${canonicalBase}#website" },
      "about": { "@id": "${canonicalBase}#business" },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": "${primaryImageUrl}"
      }
    }${specificSchema},
    {
      "@type": "BreadcrumbList",
      "@id": "${canonical}#breadcrumbs",
      "itemListElement": ${JSON.stringify(breadcrumbs, null, 2).split('\n').join('\n      ')}
    }
  ]
}
</script>`;
  }, [formData]);

  const renderFaqEditor = () => (
    <div className="pt-4 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2 text-slate-800">
          <HelpCircle size={18} className="text-blue-500" />
          <h3 className="font-semibold text-sm">FAQ List</h3>
        </div>
        <button onClick={addFaq} className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
          <Plus size={14} /> Add FAQ
        </button>
      </div>
      <div className="space-y-4">
        {formData.faqs.map((faq, idx) => (
          <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3 relative group">
            <button 
              onClick={() => removeFaq(idx)}
              className="absolute -right-2 -top-2 bg-white border border-red-200 text-red-500 p-1.5 rounded-full shadow-sm hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={12} />
            </button>
            <div className="space-y-2">
              <input 
                placeholder="Question" 
                className="w-full bg-transparent font-semibold text-sm outline-none border-b border-slate-200 pb-1 focus:border-blue-400"
                value={faq.question}
                onChange={(e) => updateFaq(idx, 'question', e.target.value)}
              />
              <textarea 
                placeholder="Answer" 
                rows={2}
                className="w-full bg-transparent text-xs text-slate-600 outline-none resize-none"
                value={faq.answer}
                onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHoursEditor = () => (
    <div className="pt-4 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2 text-slate-800">
          <Clock size={18} className="text-blue-500" />
          <h3 className="font-semibold text-sm">Working Hours</h3>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={formData.workingHours.is247}
            onChange={(e) => updateWorkingHours('is247', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <span className="text-xs font-semibold text-slate-700">Open 24/7</span>
        </label>
      </div>
      
      {!formData.workingHours.is247 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Weekdays (Mon-Fri)</span>
            <div className="flex gap-2">
              <input 
                type="time" 
                value={formData.workingHours.weekdayOpens}
                onChange={(e) => updateWorkingHours('weekdayOpens', e.target.value)}
                className="flex-1 px-2 py-1 text-xs border rounded bg-white outline-none focus:ring-1 focus:ring-blue-400"
              />
              <span className="text-slate-400 self-center">-</span>
              <input 
                type="time" 
                value={formData.workingHours.weekdayCloses}
                onChange={(e) => updateWorkingHours('weekdayCloses', e.target.value)}
                className="flex-1 px-2 py-1 text-xs border rounded bg-white outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Weekends (Sat-Sun)</span>
            <div className="flex gap-2">
              <input 
                type="time" 
                value={formData.workingHours.weekendOpens}
                onChange={(e) => updateWorkingHours('weekendOpens', e.target.value)}
                className="flex-1 px-2 py-1 text-xs border rounded bg-white outline-none focus:ring-1 focus:ring-blue-400"
              />
              <span className="text-slate-400 self-center">-</span>
              <input 
                type="time" 
                value={formData.workingHours.weekendCloses}
                onChange={(e) => updateWorkingHours('weekendCloses', e.target.value)}
                className="flex-1 px-2 py-1 text-xs border rounded bg-white outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pb-12">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Wand2 className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">SEO Wizard Pro</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden sm:inline-flex items-center gap-1.5 font-medium">
              <Info size={14} /> Full Local Business Automation
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {/* Page Type Selector Tabs */}
        <div className="mb-6 flex overflow-x-auto gap-2 p-1 bg-slate-200/50 rounded-2xl w-fit">
          {pageTypes.map(pt => (
            <button
              key={pt}
              onClick={() => setFormData(p => ({...p, pageType: pt}))}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                formData.pageType === pt 
                ? 'bg-white shadow-md text-blue-600 scale-105' 
                : 'text-slate-600 hover:bg-white/50'
              }`}
            >
              {pt === 'Home' && <Layout size={14} />}
              {pt === 'Service' && <Layers size={14} />}
              {pt === 'About' && <User size={14} />}
              {pt === 'Contact' && <MessageSquare size={14} />}
              {pt === 'FAQs' && <HelpCircle size={14} />}
              {pt === 'Locations' && <Navigation size={14} />}
              {pt}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-slate-800">
                <Settings2 size={20} />
                <h2 className="font-bold">Global Configuration</h2>
              </div>

              <div className="space-y-5">
                {/* Meta Content Section */}
                <div className="pt-2 space-y-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-800 border-b border-blue-100 pb-2">
                    <Type size={18} className="text-blue-600" />
                    <h3 className="font-bold text-sm">Meta Content (Editable)</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-blue-700">Meta Title</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.metaTitle}
                        onChange={(e) => setFormData(p => ({...p, metaTitle: e.target.value}))}
                        placeholder="SEO Meta Title..."
                      />
                      <span className="text-[10px] text-slate-400 self-end font-mono">{formData.metaTitle.length} / 60</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-blue-700">Meta Description</label>
                      <textarea 
                        rows={3}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        value={formData.metaDescription}
                        onChange={(e) => setFormData(p => ({...p, metaDescription: e.target.value}))}
                        placeholder="SEO Meta Description..."
                      />
                      <span className="text-[10px] text-slate-400 self-end font-mono">{formData.metaDescription.length} / 160</span>
                    </div>
                  </div>
                </div>

                {/* Primary Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Primary Service</label>
                    <select 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.serviceType}
                      onChange={(e) => setFormData(p => ({...p, serviceType: e.target.value as ServiceType}))}
                    >
                      {services.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <Input label="Business Name" value={formData.businessName} onChange={(e) => setFormData(p => ({...p, businessName: e.target.value}))} />
                  </div>
                  <div className="col-span-2">
                    <Input label="Base Website URL" placeholder="https://almoairductcleaning.com" value={formData.baseUrl} onChange={(e) => setFormData(p => ({...p, baseUrl: e.target.value}))} />
                  </div>
                  <Input label="Phone" value={formData.phone} onChange={(e) => setFormData(p => ({...p, phone: e.target.value}))} />
                  <Input label="Email" value={formData.email} onChange={(e) => setFormData(p => ({...p, email: e.target.value}))} />
                </div>

                {/* Brand Assets */}
                <div className="pt-2 space-y-4">
                  <div className="flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-2">
                    <ImageIcon size={18} className="text-blue-500" />
                    <h3 className="font-semibold text-sm">Brand Assets</h3>
                  </div>
                  <div className="space-y-3">
                    <Input label="Business Logo URL" placeholder="https://domain.com/img/logo.png" value={formData.logoUrl} onChange={(e) => setFormData(p => ({...p, logoUrl: e.target.value}))} />
                    <Input label="Primary Page Image (Hero)" placeholder="https://domain.com/img/hero.jpg" value={formData.primaryImageUrl} onChange={(e) => setFormData(p => ({...p, primaryImageUrl: e.target.value}))} />
                    <Input label="Favicon URL" placeholder="img/fav.png" value={formData.faviconUrl} onChange={(e) => setFormData(p => ({...p, faviconUrl: e.target.value}))} />
                    <Input label="Apple Touch Icon URL" placeholder="img/apple-touch-icon.png" value={formData.appleTouchIconUrl} onChange={(e) => setFormData(p => ({...p, appleTouchIconUrl: e.target.value}))} />
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-2 space-y-4">
                  <div className="flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-2">
                    <Globe2 size={18} className="text-blue-500" />
                    <h3 className="font-semibold text-sm">Social Media</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-3 items-end">
                      <Facebook size={20} className="text-blue-600 mb-2" />
                      <div className="flex-1"><Input label="Facebook URL" value={formData.facebookUrl} onChange={(e) => setFormData(p => ({...p, facebookUrl: e.target.value}))} /></div>
                    </div>
                    <div className="flex gap-3 items-end">
                      <Twitter size={20} className="text-slate-800 mb-2" />
                      <div className="flex-1"><Input label="Twitter / X URL" value={formData.twitterUrl} onChange={(e) => setFormData(p => ({...p, twitterUrl: e.target.value}))} /></div>
                    </div>
                  </div>
                </div>

                {formData.pageType === 'Service' && (
                  <div className="pt-2 space-y-4">
                    <div className="flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-2">
                      <Link2 size={18} className="text-blue-500" />
                      <h3 className="font-semibold text-sm">Related Services</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.relatedServices.map(item => (
                        <span key={item} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">
                          {item}
                          <button onClick={() => removeRelated(item)}><Trash2 size={12} /></button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" placeholder="Add service..." className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        value={newRelated} onChange={(e) => setNewRelated(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addRelated()}
                      />
                      <button onClick={addRelated} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm"><Plus size={16} /></button>
                    </div>
                  </div>
                )}

                {renderHoursEditor()}
                {formData.pageType === 'FAQs' && renderFaqEditor()}

                <hr className="border-slate-100 my-2" />

                <div className="pt-2 space-y-4">
                  <div className="flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-2">
                    <MapPin size={18} className="text-blue-500" />
                    <h3 className="font-semibold text-sm">Location Details</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-3">
                      <Input label="Street Address" value={formData.address} onChange={(e) => setFormData(p => ({...p, address: e.target.value}))} />
                    </div>
                    <Input label="City" value={formData.city} onChange={(e) => setFormData(p => ({...p, city: e.target.value}))} />
                    <Input label="State" value={formData.state} onChange={(e) => setFormData(p => ({...p, state: e.target.value}))} />
                    <Input label="ZIP" value={formData.zip} onChange={(e) => setFormData(p => ({...p, zip: e.target.value}))} />
                    <Input label="Lat" value={formData.lat} onChange={(e) => setFormData(p => ({...p, lat: e.target.value}))} />
                    <Input label="Lng" value={formData.lng} onChange={(e) => setFormData(p => ({...p, lng: e.target.value}))} />
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <div className="flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-2">
                    <Globe2 size={18} className="text-blue-500" />
                    <h3 className="font-semibold text-sm">Service Areas</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.areaServed.map(city => (
                      <span key={city} className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200">
                        {city}
                        <button onClick={() => removeCity(city)}><Trash2 size={12} /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" placeholder="Add location..." className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm outline-none"
                      value={newCity} onChange={(e) => setNewCity(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCity()}
                    />
                    <button onClick={addCity} className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-sm"><Plus size={16} /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border overflow-hidden shadow-sm flex flex-col h-full min-h-[800px]">
              <div className="p-6 border-b bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Code2 className="text-slate-600" size={20} />
                  <div>
                    <h2 className="font-bold text-slate-800 leading-tight">{formData.pageType} Page Result</h2>
                    <p className="text-xs text-slate-500">Includes Social, Icons & Schema</p>
                  </div>
                </div>
                <button 
                  onClick={handleAiGeneration}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow-lg transition-all"
                >
                  {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                  Regenerate Meta
                </button>
              </div>

              <div className="p-6 bg-white border-b">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Snippet Preview</h3>
                <div className="max-w-xl">
                  <div className="text-[#1a0dab] text-xl hover:underline cursor-pointer font-medium mb-1 truncate">
                    {formData.metaTitle || 'Loading title...'}
                  </div>
                  <div className="text-[#006621] text-sm mb-1 truncate">
                    {formData.baseUrl}{formData.pageType !== 'Home' ? formData.pageType.toLowerCase().replace(/\s+/g, '-') + '/' : ''}
                  </div>
                  <div className="text-[#4d5156] text-sm leading-relaxed line-clamp-2 italic">
                    {formData.metaDescription || 'Optimizing description...'}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-hidden p-6 bg-slate-50">
                 <CodeBlock code={generatedCode} />
              </div>

              <div className="p-4 bg-blue-50 border-t border-blue-100 flex gap-3">
                <Info className="text-blue-500 shrink-0" size={18} />
                <p className="text-xs text-blue-800 leading-normal">
                  <strong>Branding Power:</strong> Business Logo and Primary Hero Images are now integrated into JSON-LD and OG tags for maximum search visibility and social click-through rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="mt-12 py-8 border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
          <p>© 2024 Advanced SEO Local Wizard. Premium JSON-LD Generator.</p>
          <div className="flex gap-4">
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">Social-Enabled</span>
            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">Asset-Linked</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
