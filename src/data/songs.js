// src/data/songs.js
// Central song registry — all tracks, all artists
// Lyrics: timestamped {time, line} arrays (Hindi/Urdu + romanization alternating)

export const SONGS = [

  // ── JAGJIT SINGH ─────────────────────────────────────────────
  {
    id: "hoshwalon-ko-khabar-kya",
    title: "Hoshwalon Ko Khabar Kya",
    artistId: "jagjit-singh", artist: "Jagjit Singh",
    duration: "5:12", durationSec: 312,
    year: "1988", plays: "2.4M", album: "Saath Saath",
    genre: ["Ghazal"], mood: ["Melancholic", "Soulful"],
    tags: ["classic", "jagjit", "ghazal"],
    lyrics: [
      { time: 0,  line: "होशवालों को खबर क्या" },
      { time: 6,  line: "बेखुदी क्या चीज़ है" },
      { time: 12, line: "इश्क कीजे फिर समझिये" },
      { time: 18, line: "ज़िंदगी क्या चीज़ है" },
      { time: 28, line: "Hoshwalon ko khabar kya" },
      { time: 34, line: "bekhudi kya cheez hai" },
      { time: 40, line: "Ishq keeje phir samajhiye" },
      { time: 46, line: "zindagi kya cheez hai" },
      { time: 58, line: "दिल की बातें दिल ही जाने" },
      { time: 64, line: "न कोई समझे न जाने" },
      { time: 70, line: "जो भी है बस इसी लम्हे में है" },
    ],
  },
  {
    id: "tum-itna-jo",
    title: "Tum Itna Jo Muskura Rahe Ho",
    artistId: "jagjit-singh", artist: "Jagjit Singh",
    duration: "4:26", durationSec: 266,
    year: "1981", plays: "3.1M", album: "Arth",
    genre: ["Ghazal"], mood: ["Sad", "Introspective"],
    tags: ["classic", "jagjit", "arth"],
    lyrics: [
      { time: 0,  line: "तुम इतना जो मुस्कुरा रहे हो" },
      { time: 7,  line: "क्या ग़म है जिसको छुपा रहे हो" },
      { time: 14, line: "Tum itna jo muskura rahe ho" },
      { time: 21, line: "kya gham hai jisko chupa rahe ho" },
      { time: 32, line: "आँखों में नमी, हँसी लबों पर" },
      { time: 39, line: "क्या हाल है, क्या दिखा रहे हो" },
    ],
  },
  {
    id: "jhuki-jhuki",
    title: "Jhuki Jhuki Si Nazar",
    artistId: "jagjit-singh", artist: "Jagjit Singh",
    duration: "5:01", durationSec: 301,
    year: "1990", plays: "1.8M", album: "Sajda",
    genre: ["Ghazal"], mood: ["Romantic", "Tender"],
    tags: ["sajda", "jagjit", "romantic"],
    lyrics: [
      { time: 0,  line: "झुकी झुकी सी नज़र" },
      { time: 6,  line: "बेकरार है कि नहीं" },
      { time: 12, line: "Jhuki jhuki si nazar" },
      { time: 18, line: "bekarar hai ki nahin" },
      { time: 28, line: "दिल में कोई बात है" },
      { time: 34, line: "जो ज़ुबाँ पे आ नहीं सकी" },
    ],
  },
  {
    id: "chitthi-na-koi",
    title: "Chitthi Na Koi Sandesh",
    artistId: "jagjit-singh", artist: "Jagjit Singh",
    duration: "6:40", durationSec: 400,
    year: "1999", plays: "4.2M", album: "Dushman",
    genre: ["Film", "Ghazal"], mood: ["Longing", "Nostalgic"],
    tags: ["dushman", "jagjit", "film"],
    lyrics: [
      { time: 0,  line: "चिट्ठी न कोई संदेश" },
      { time: 7,  line: "जाने वो कौन सा देश" },
      { time: 14, line: "जहाँ तुम चले गए" },
      { time: 21, line: "Chitthi na koi sandesh" },
      { time: 28, line: "jaane woh kaun sa desh" },
      { time: 48, line: "पास रहके भी तुम कितने दूर थे" },
    ],
  },
  {
    id: "koi-fariyaad",
    title: "Koi Fariyaad",
    artistId: "jagjit-singh", artist: "Jagjit Singh",
    duration: "8:09", durationSec: 489,
    year: "2003", plays: "5.7M", album: "Tum Bin",
    genre: ["Film", "Ghazal"], mood: ["Devotional", "Soulful"],
    tags: ["tum-bin", "jagjit", "film"],
    lyrics: [
      { time: 0,  line: "कोई फ़रियाद तेरे दिल में दबी हो जैसे" },
      { time: 8,  line: "एक आँसू जो रुका हो कभी रोई हो जैसे" },
      { time: 20, line: "Koi fariyad tere dil mein dabi ho jaise" },
      { time: 28, line: "ek aansu jo ruka ho kabhi roi ho jaise" },
      { time: 40, line: "तेरी आँखों में मुझे डूबना अच्छा लगता है" },
    ],
  },
  {
    id: "tere-baare-mein",
    title: "Tere Baare Mein Jab Socha Nahi Tha",
    artistId: "jagjit-singh", artist: "Jagjit Singh",
    duration: "4:55", durationSec: 295,
    year: "1993", plays: "1.2M", album: "Marasim",
    genre: ["Ghazal"], mood: ["Romantic", "Longing"],
    tags: ["marasim", "jagjit"],
    lyrics: [
      { time: 0,  line: "तेरे बारे में जब सोचा नहीं था" },
      { time: 7,  line: "ज़माने भर की परवाह नहीं थी" },
      { time: 14, line: "Tere baare mein jab socha nahi tha" },
      { time: 21, line: "zamaane bhar ki parwaah nahi thi" },
    ],
  },

  // ── MEHDI HASSAN ─────────────────────────────────────────────
  {
    id: "tum-nahin-aaye",
    title: "Tum Nahin Aaye",
    artistId: "mehdi-hassan", artist: "Mehdi Hassan",
    duration: "5:33", durationSec: 333,
    year: "1972", plays: "1.9M", album: "Ghazal",
    genre: ["Ghazal"], mood: ["Longing", "Heartbreak"],
    tags: ["mehdi", "classic", "dard"],
    lyrics: [
      { time: 0,  line: "तुम नहीं आये तो क्या" },
      { time: 7,  line: "हम यहीं रहते हैं" },
      { time: 14, line: "Tum nahin aaye to kya" },
      { time: 21, line: "hum yahi rehte hain" },
      { time: 30, line: "शमा जलती रही रात भर" },
      { time: 37, line: "हम तेरी याद में जागते रहे" },
    ],
  },
  {
    id: "ranjish-hi-sahi",
    title: "Ranjish Hi Sahi",
    artistId: "mehdi-hassan", artist: "Mehdi Hassan",
    duration: "6:20", durationSec: 380,
    year: "1974", plays: "4.1M", album: "Ranjish Hi Sahi",
    genre: ["Ghazal"], mood: ["Melancholic", "Longing"],
    tags: ["mehdi", "classic", "ahmed-faraz"],
    lyrics: [
      { time: 0,  line: "रंजिश ही सही, दिल ही दुखाने के लिये आ" },
      { time: 9,  line: "आ फिर से मुझे छोड़ के जाने के लिये आ" },
      { time: 18, line: "Ranjish hi sahi, dil hi dukhane ke liye aa" },
      { time: 27, line: "aa phir se mujhe chhod ke jaane ke liye aa" },
      { time: 40, line: "पहले से मराسिम न सही, फिर भी कभी तो" },
      { time: 48, line: "रस्म-ओ-राह चलन, बात बनाने के लिये आ" },
    ],
  },
  {
    id: "zindagi-mein-to-sabhi",
    title: "Zindagi Mein To Sabhi Pyaar Kiya Karte Hain",
    artistId: "mehdi-hassan", artist: "Mehdi Hassan",
    duration: "7:04", durationSec: 424,
    year: "1975", plays: "2.8M", album: "Sarhadein",
    genre: ["Ghazal"], mood: ["Philosophical", "Soulful"],
    tags: ["mehdi", "sarhadein", "classic"],
    lyrics: [
      { time: 0,  line: "ज़िन्दगी में तो सभी प्यार किया करते हैं" },
      { time: 9,  line: "मैं तो मरकर भी मेरी जान तुझे चाहूँगा" },
      { time: 18, line: "Zindagi mein to sabhi pyaar kiya karte hain" },
      { time: 27, line: "main to markar bhi meri jaan tujhe chahunga" },
    ],
  },
  {
    id: "pyar-bhare-do-sharmile",
    title: "Pyar Bhare Do Sharmile Nain",
    artistId: "mehdi-hassan", artist: "Mehdi Hassan",
    duration: "5:44", durationSec: 344,
    year: "1977", plays: "1.5M", album: "Ghazal",
    genre: ["Ghazal"], mood: ["Romantic"],
    tags: ["mehdi", "romantic"],
    lyrics: [
      { time: 0,  line: "प्यार भरे दो शर्मीले नैन" },
      { time: 7,  line: "ढूँढ रहे हैं एक जहाँ" },
      { time: 14, line: "Pyar bhare do sharmile nain" },
      { time: 21, line: "dhundh rahe hain ek jahaan" },
    ],
  },
  {
    id: "gulon-mein-rang-bhare",
    title: "Gulon Mein Rang Bhare",
    artistId: "mehdi-hassan", artist: "Mehdi Hassan",
    duration: "6:55", durationSec: 415,
    year: "1979", plays: "3.2M", album: "Live in London",
    genre: ["Ghazal"], mood: ["Devotional", "Soulful"],
    tags: ["mehdi", "faiz", "classic"],
    lyrics: [
      { time: 0,  line: "गुलों में रंग भरे, बाद-ए-नौबहार चले" },
      { time: 9,  line: "चले भी आओ कि गुलशन का कारोबार चले" },
      { time: 18, line: "Gulon mein rang bhare, baad-e-naubahaar chale" },
      { time: 27, line: "chale bhi aao ki gulshan ka kaarobaar chale" },
    ],
  },

  // ── NUSRAT FATEH ALI KHAN ────────────────────────────────────
  {
    id: "dam-mast-qalandar",
    title: "Dam Mast Qalandar",
    artistId: "nusrat-fateh-ali-khan", artist: "Nusrat Fateh Ali Khan",
    duration: "9:30", durationSec: 570,
    year: "1987", plays: "12.4M", album: "Shahen Shah",
    genre: ["Qawwali", "Sufi"], mood: ["Ecstatic", "Devotional"],
    tags: ["nusrat", "qawwali", "sufi", "lal-shahbaz"],
    lyrics: [
      { time: 0,  line: "دم مست قلندر مست مست" },
      { time: 8,  line: "Dam mast qalandar mast mast" },
      { time: 16, line: "Lal meri pat rakhiyo bala jhole lalan" },
      { time: 24, line: "Sindri da Sehwan da sakhi Shahbaz Qalandar" },
      { time: 36, line: "جھولے لال جھولے لال" },
      { time: 44, line: "Jhole laal, jhole laal" },
    ],
  },
  {
    id: "mere-rashke-qamar",
    title: "Mere Rashke Qamar",
    artistId: "nusrat-fateh-ali-khan", artist: "Nusrat Fateh Ali Khan",
    duration: "6:15", durationSec: 375,
    year: "1986", plays: "6.8M", album: "Live in London",
    genre: ["Ghazal", "Sufi"], mood: ["Romantic", "Devotional"],
    tags: ["nusrat", "romantic", "bahadur-shah-zafar"],
    lyrics: [
      { time: 0,  line: "میرے رشکِ قمر، تو نے پہلی نظر" },
      { time: 8,  line: "Mere rashke qamar, tu ne pehli nazar" },
      { time: 16, line: "دل کا حال سنا، جان ہنستی رہی" },
      { time: 24, line: "dil ka haal suna, jaan hansti rahi" },
    ],
  },
  {
    id: "mustt-mustt",
    title: "Mustt Mustt",
    artistId: "nusrat-fateh-ali-khan", artist: "Nusrat Fateh Ali Khan",
    duration: "8:44", durationSec: 524,
    year: "1990", plays: "5.2M", album: "Mustt Mustt",
    genre: ["Qawwali", "Fusion"], mood: ["Ecstatic", "Trance"],
    tags: ["nusrat", "mustt", "fusion", "real-world"],
    lyrics: [
      { time: 0,  line: "مست مست مست" },
      { time: 6,  line: "Mast mast mast" },
      { time: 14, line: "Na jaana, na jaana mujhse baat na karo" },
      { time: 22, line: "میں مست قلندر" },
      { time: 30, line: "Main mast qalandar" },
    ],
  },
  {
    id: "yeh-jo-halka-halka",
    title: "Yeh Jo Halka Halka Suroor Hai",
    artistId: "nusrat-fateh-ali-khan", artist: "Nusrat Fateh Ali Khan",
    duration: "7:12", durationSec: 432,
    year: "1986", plays: "3.3M", album: "Shahen Shah",
    genre: ["Qawwali"], mood: ["Devotional", "Euphoric"],
    tags: ["nusrat", "suroor", "sufi"],
    lyrics: [
      { time: 0,  line: "یہ جو ہلکا ہلکا سرور ہے" },
      { time: 8,  line: "Yeh jo halka halka suroor hai" },
      { time: 16, line: "یہ تیری نگاہ کا قصور ہے" },
      { time: 24, line: "yeh teri nigah ka qasoor hai" },
    ],
  },
  {
    id: "allah-hoo",
    title: "Allah Hoo",
    artistId: "nusrat-fateh-ali-khan", artist: "Nusrat Fateh Ali Khan",
    duration: "8:44", durationSec: 524,
    year: "1990", plays: "8.7M", album: "Mustt Mustt",
    genre: ["Qawwali", "Sufi"], mood: ["Devotional"],
    tags: ["nusrat", "qawwali", "devotional"],
    lyrics: [
      { time: 0,  line: "اللہ ہو، اللہ ہو" },
      { time: 8,  line: "Allah Hoo, Allah Hoo" },
      { time: 16, line: "ہو ہو ہو ہو" },
      { time: 24, line: "Hoo hoo hoo hoo" },
    ],
  },

  // ── ABIDA PARVEEN ────────────────────────────────────────────
  {
    id: "mast-qalandar-abida",
    title: "Mast Qalandar",
    artistId: "abida-parveen", artist: "Abida Parveen",
    duration: "11:20", durationSec: 680,
    year: "1988", plays: "3.1M", album: "Mast Nazron Se",
    genre: ["Qawwali", "Sufi"], mood: ["Ecstatic", "Devotional"],
    tags: ["abida", "qalandar", "sufi"],
    lyrics: [
      { time: 0,  line: "مست قلندر مست" },
      { time: 8,  line: "Mast qalandar mast" },
      { time: 18, line: "ہو لعل میری پت رکھیو بھلا جھولے لالن" },
    ],
  },
  {
    id: "tu-jhoom",
    title: "Tu Jhoom",
    artistId: "abida-parveen", artist: "Abida Parveen",
    duration: "5:02", durationSec: 302,
    year: "2022", plays: "2.7M", album: "Tu Jhoom",
    genre: ["Sufi", "Folk"], mood: ["Joyful", "Devotional"],
    tags: ["abida", "coke-studio", "modern"],
    lyrics: [
      { time: 0,  line: "تو جھوم، تو جھوم" },
      { time: 6,  line: "Tu jhoom, tu jhoom" },
      { time: 14, line: "جھومتے جھومتے جا" },
      { time: 20, line: "jhoomte jhoomte ja" },
    ],
  },
  {
    id: "tere-ishq-nachaya",
    title: "Tere Ishq Nachaya",
    artistId: "abida-parveen", artist: "Abida Parveen",
    duration: "8:15", durationSec: 495,
    year: "2015", plays: "1.8M", album: "Raqs-e-Bismil",
    genre: ["Sufi", "Kafi"], mood: ["Devotional", "Ecstatic"],
    tags: ["abida", "bulleh-shah", "kafi"],
    lyrics: [
      { time: 0,  line: "تیرے عشق نچایا" },
      { time: 7,  line: "Tere ishq nachaya" },
      { time: 15, line: "کر کے تھیا تھیا" },
      { time: 22, line: "kar ke thiya thiya" },
    ],
  },

  // ── FARIDA KHANUM ────────────────────────────────────────────
  {
    id: "aaj-jaane-ki-zid",
    title: "Aaj Jaane Ki Zid Na Karo",
    artistId: "farida-khanum", artist: "Farida Khanum",
    duration: "4:48", durationSec: 288,
    year: "1977", plays: "5.8M", album: "Farida Khanum",
    genre: ["Ghazal", "Thumri"], mood: ["Romantic", "Pleading"],
    tags: ["farida", "classic", "timeless"],
    lyrics: [
      { time: 0,  line: "آج جانے کی ضد نہ کرو" },
      { time: 7,  line: "Aaj jaane ki zid na karo" },
      { time: 14, line: "یوں ہی پہلو میں بیٹھے رہو" },
      { time: 21, line: "yunhi pehlu mein baithe raho" },
      { time: 32, line: "ہاں کیے جاؤ چاہے ستم" },
      { time: 39, line: "ہنستے ہنستے گزر جائے گا دم" },
    ],
  },
  {
    id: "mujhe-tum-yaad-aate",
    title: "Mujhe Tum Yaad Aate Ho",
    artistId: "farida-khanum", artist: "Farida Khanum",
    duration: "5:10", durationSec: 310,
    year: "1985", plays: "1.2M", album: "Mujhe Tum Yaad Aate Ho",
    genre: ["Ghazal"], mood: ["Nostalgic", "Longing"],
    tags: ["farida", "classic"],
    lyrics: [
      { time: 0,  line: "مجھے تم یاد آتے ہو" },
      { time: 7,  line: "Mujhe tum yaad aate ho" },
      { time: 14, line: "برستی رات میں" },
      { time: 20, line: "barasti raat mein" },
    ],
  },

  // ── GHULAM ALI ───────────────────────────────────────────────
  {
    id: "chupke-chupke",
    title: "Chupke Chupke Raat Din",
    artistId: "ghulam-ali", artist: "Ghulam Ali",
    duration: "6:30", durationSec: 390,
    year: "1977", plays: "3.8M", album: "Chupke Chupke",
    genre: ["Ghazal"], mood: ["Romantic", "Tender"],
    tags: ["ghulam-ali", "classic", "hasrat-mohani"],
    lyrics: [
      { time: 0,  line: "چپکے چپکے رات دن" },
      { time: 7,  line: "Chupke chupke raat din" },
      { time: 14, line: "آنسو بہانا یاد ہے" },
      { time: 21, line: "aansu bahana yaad hai" },
      { time: 32, line: "ہم کو روکو نہ کرو باز" },
      { time: 39, line: "یہ نہ سمجھو کہ ستانا یاد ہے" },
    ],
  },
  {
    id: "hungama-hai-kyun",
    title: "Hungama Hai Kyun Barpa",
    artistId: "ghulam-ali", artist: "Ghulam Ali",
    duration: "5:48", durationSec: 348,
    year: "1984", plays: "2.1M", album: "Aawaz",
    genre: ["Ghazal"], mood: ["Philosophical", "Soulful"],
    tags: ["ghulam-ali", "aawaz", "akbar-allahabadi"],
    lyrics: [
      { time: 0,  line: "ہنگامہ ہے کیوں برپا" },
      { time: 7,  line: "Hungama hai kyun barpa" },
      { time: 14, line: "تھوڑی سی جو پی لی ہے" },
      { time: 21, line: "thodi si jo pee li hai" },
    ],
  },
  {
    id: "aawara-hoon",
    title: "Aawara Hoon",
    artistId: "ghulam-ali", artist: "Ghulam Ali",
    duration: "5:22", durationSec: 322,
    year: "1990", plays: "1.4M", album: "Meraj-e-Ghazal",
    genre: ["Ghazal"], mood: ["Wandering", "Melancholic"],
    tags: ["ghulam-ali", "meraj"],
    lyrics: [
      { time: 0,  line: "آوارہ ہوں، آوارہ ہوں" },
      { time: 7,  line: "Aawara hoon, aawara hoon" },
      { time: 14, line: "یا دل کا سہارا ہوں" },
      { time: 21, line: "ya dil ka sahara hoon" },
    ],
  },

  // ── PANKAJ UDHAS ─────────────────────────────────────────────
  {
    id: "chitthi-aayi-hai",
    title: "Chitthi Aayi Hai",
    artistId: "pankaj-udhas", artist: "Pankaj Udhas",
    duration: "5:44", durationSec: 344,
    year: "1986", plays: "6.2M", album: "Naam (Soundtrack)",
    genre: ["Film", "Ghazal"], mood: ["Nostalgic", "Longing"],
    tags: ["pankaj", "naam", "film", "diaspora"],
    lyrics: [
      { time: 0,  line: "चिट्ठी आई है, आई है, आई है" },
      { time: 8,  line: "वतन से चिट्ठी आई है" },
      { time: 16, line: "Chitthi aayi hai, aayi hai, aayi hai" },
      { time: 24, line: "watan se chitthi aayi hai" },
      { time: 36, line: "चिट्ठी में क्या लिखा है पूछते हो" },
      { time: 44, line: "बस इतना लिखा है घर आ जाओ" },
    ],
  },
  {
    id: "na-kajre-ki-dhar",
    title: "Na Kajre Ki Dhar",
    artistId: "pankaj-udhas", artist: "Pankaj Udhas",
    duration: "4:55", durationSec: 295,
    year: "1985", plays: "2.8M", album: "Nayaab",
    genre: ["Ghazal"], mood: ["Romantic"],
    tags: ["pankaj", "nayaab", "romantic"],
    lyrics: [
      { time: 0,  line: "न काजरे की धार" },
      { time: 6,  line: "न मोतियों के हार" },
      { time: 12, line: "Na kajre ki dhaar" },
      { time: 18, line: "na motiyon ke haar" },
      { time: 28, line: "न तो कोई राग है" },
      { time: 34, line: "न कोई बात है" },
    ],
  },
  {
    id: "thodi-thodi-piya-karo",
    title: "Thodi Thodi Piya Karo",
    artistId: "pankaj-udhas", artist: "Pankaj Udhas",
    duration: "5:10", durationSec: 310,
    year: "1994", plays: "1.9M", album: "Aafreen",
    genre: ["Ghazal"], mood: ["Playful", "Romantic"],
    tags: ["pankaj", "aafreen"],
    lyrics: [
      { time: 0,  line: "थोड़ी थोड़ी पिया करो" },
      { time: 7,  line: "ज़्यादा नहीं" },
      { time: 14, line: "Thodi thodi piya karo" },
      { time: 21, line: "zyaada nahi" },
    ],
  },

  // ── TALAT AZIZ ───────────────────────────────────────────────
  {
    id: "dil-ke-armaan",
    title: "Dil Ke Armaan",
    artistId: "talat-aziz", artist: "Talat Aziz",
    duration: "5:30", durationSec: 330,
    year: "1988", plays: "1.1M", album: "Tasveer",
    genre: ["Ghazal"], mood: ["Nostalgic", "Longing"],
    tags: ["talat", "classic"],
    lyrics: [
      { time: 0,  line: "दिल के अरमाँ आँसुओं में बह गए" },
      { time: 8,  line: "हम वफ़ा करके भी तनहा रह गए" },
      { time: 16, line: "Dil ke armaan aansuon mein beh gaye" },
      { time: 24, line: "hum wafa karke bhi tanha reh gaye" },
    ],
  },
  {
    id: "kuch-na-kaho",
    title: "Kuch Na Kaho",
    artistId: "talat-aziz", artist: "Talat Aziz",
    duration: "4:48", durationSec: 288,
    year: "1994", plays: "1.3M", album: "Film: 1942 A Love Story",
    genre: ["Film", "Ghazal"], mood: ["Romantic"],
    tags: ["talat", "film", "1942"],
    lyrics: [
      { time: 0,  line: "कुछ न कहो, कुछ न कहो" },
      { time: 7,  line: "कुछ भी न कहो" },
      { time: 14, line: "Kuch na kaho, kuch na kaho" },
      { time: 21, line: "kuch bhi na kaho" },
      { time: 32, line: "जो भी हो, कल जो हो" },
      { time: 39, line: "आने दो उसे" },
    ],
  },
  {
    id: "dil-dhoondta-hai",
    title: "Dil Dhoondta Hai",
    artistId: "bhupinder-singh", artist: "Bhupinder Singh",
    duration: "5:44", durationSec: 344,
    year: "1975", plays: "2.2M", album: "Mausam",
    genre: ["Film", "Ghazal"], mood: ["Nostalgic", "Longing"],
    tags: ["bhupinder", "gulzar", "mausam"],
    lyrics: [
      { time: 0,  line: "दिल ढूँढता है फिर वही" },
      { time: 7,  line: "फ़ुरसत के रात दिन" },
      { time: 14, line: "Dil dhoondta hai phir wohi" },
      { time: 21, line: "fursat ke raat din" },
    ],
  },
  {
    id: "lag-jaa-gale",
    title: "Lag Jaa Gale",
    artistId: "lata-mangeshkar", artist: "Lata Mangeshkar",
    duration: "3:55", durationSec: 235,
    year: "1964", plays: "9.1M", album: "Woh Kaun Thi",
    genre: ["Film", "Semi-Classical"], mood: ["Romantic", "Tender"],
    tags: ["lata", "classic", "film", "madan-mohan"],
    lyrics: [
      { time: 0,  line: "लग जा गले, कि फिर ये हसीं रात हो न हो" },
      { time: 8,  line: "शायद फिर इस जनम में मुलाक़ात हो न हो" },
      { time: 16, line: "Lag jaa gale, ki phir ye haseen raat ho na ho" },
      { time: 24, line: "Shayad phir is janam mein mulaaqat ho na ho" },
    ],
  },
]

export const getSongById       = (id)       => SONGS.find(s => s.id === id)
export const getSongsByArtist  = (artistId) => SONGS.filter(s => s.artistId === artistId)
export const getSongByTitle    = (title)    => SONGS.find(s => s.title.toLowerCase() === title.toLowerCase())

// ── ADDITIONAL SONGS (appended to existing SONGS array) ───────
// Import this file and spread into your existing SONGS array,
// OR just copy-paste these entries into the SONGS array in songs.js

export const EXTRA_SONGS = [

  // ── MORE JAGJIT SINGH ─────────────────────────────────────────
  { id: "woh-kagaz-ki-kashti", title: "Woh Kagaz Ki Kashti", artistId: "jagjit-singh", artist: "Jagjit Singh", duration: "5:30", durationSec: 330, year: "1990", plays: "3.8M", album: "Sajda", genre: ["Ghazal"], mood: ["Nostalgic"], tags: ["jagjit", "sajda", "childhood"],
    lyrics: [{ time: 0, line: "वो काग़ज़ की कश्ती" }, { time: 6, line: "वो बारिश का पानी" }, { time: 12, line: "Woh kagaz ki kashti" }, { time: 18, line: "woh barish ka paani" }] },
  { id: "in-aankhon-ki-masti", title: "In Aankhon Ki Masti", artistId: "jagjit-singh", artist: "Jagjit Singh", duration: "4:44", durationSec: 284, year: "1982", plays: "2.9M", album: "Saath Saath", genre: ["Ghazal"], mood: ["Romantic"], tags: ["jagjit", "saath-saath"],
    lyrics: [{ time: 0, line: "इन आँखों की मस्ती के" }, { time: 7, line: "मस्ताने हज़ारों हैं" }, { time: 14, line: "In aankhon ki masti ke" }, { time: 21, line: "mastaane hazaaron hain" }] },
  { id: "tum-ko-dekha", title: "Tum Ko Dekha To Yeh Khayaal Aaya", artistId: "jagjit-singh", artist: "Jagjit Singh", duration: "5:02", durationSec: 302, year: "1982", plays: "2.1M", album: "Arth", genre: ["Ghazal"], mood: ["Romantic"], tags: ["jagjit", "arth"],
    lyrics: [{ time: 0, line: "तुम को देखा तो यह ख़याल आया" }, { time: 7, line: "ज़िंदगी धूप, तुम घना साया" }, { time: 14, line: "Tum ko dekha to yeh khayaal aaya" }, { time: 21, line: "zindagi dhoop, tum ghana saaya" }] },
  { id: "main-nahin-maangta", title: "Main Nahin Maangta Duniya Se Kuch Bhi", artistId: "jagjit-singh", artist: "Jagjit Singh", duration: "6:10", durationSec: 370, year: "1994", plays: "1.1M", album: "Marasim", genre: ["Ghazal"], mood: ["Devotional"], tags: ["jagjit", "marasim"],
    lyrics: [{ time: 0, line: "मैं नहीं माँगता दुनिया से कुछ भी" }, { time: 8, line: "मुझको तो बस तेरा सहारा चाहिए" }] },

  // ── MORE MEHDI HASSAN ─────────────────────────────────────────
  { id: "patta-patta", title: "Patta Patta Boota Boota", artistId: "mehdi-hassan", artist: "Mehdi Hassan", duration: "8:20", durationSec: 500, year: "1977", plays: "2.4M", album: "Ghazal", genre: ["Ghazal"], mood: ["Devotional", "Soulful"], tags: ["mehdi", "mir-taqi-mir"],
    lyrics: [{ time: 0, line: "پتا پتا بوٹا بوٹا حال ہمارا جانے ہے" }, { time: 9, line: "Patta patta boota boota haal hamara jaane hai" }, { time: 18, line: "جانے نہ جانے گل ہی نہ جانے" }, { time: 27, line: "baagh to saara jaane hai" }] },
  { id: "ab-ke-hum-bichde", title: "Ab Ke Hum Bichde", artistId: "mehdi-hassan", artist: "Mehdi Hassan", duration: "7:45", durationSec: 465, year: "1979", plays: "3.5M", album: "Live in London", genre: ["Ghazal"], mood: ["Heartbreak", "Longing"], tags: ["mehdi", "ahmad-faraz"],
    lyrics: [{ time: 0, line: "اب کے ہم بچھڑے تو شاید کبھی خوابوں میں ملیں" }, { time: 9, line: "Ab ke hum bichde to shayad kabhi khwabon mein milein" }, { time: 18, line: "جیسے سوکھے ہوئے پھول" }, { time: 27, line: "kitabon mein milein" }] },
  { id: "mujhe-tum-nazar", title: "Mujhe Tum Nazar Se Gira To Rahe Ho", artistId: "mehdi-hassan", artist: "Mehdi Hassan", duration: "6:30", durationSec: 390, year: "1975", plays: "1.8M", album: "Sarhadein", genre: ["Ghazal"], mood: ["Melancholic"], tags: ["mehdi", "sarhadein"],
    lyrics: [{ time: 0, line: "مجھے تم نظر سے گرا تو رہے ہو" }, { time: 8, line: "Mujhe tum nazar se gira to rahe ho" }, { time: 16, line: "محبت تو نہیں کرتے مگر" }, { time: 24, line: "nazar se juda to karte nahi" }] },
  { id: "ghalat-fehmi", title: "Ghalat Fehmi Na Ho", artistId: "mehdi-hassan", artist: "Mehdi Hassan", duration: "5:55", durationSec: 355, year: "1974", plays: "1.3M", album: "Ranjish Hi Sahi", genre: ["Ghazal"], mood: ["Philosophical"], tags: ["mehdi"],
    lyrics: [{ time: 0, line: "غلط فہمی نہ ہو" }, { time: 6, line: "Ghalat fehmi na ho" }, { time: 12, line: "یہ ہجر کا موسم" }, { time: 18, line: "yeh hijr ka mausam" }] },

  // ── MORE NUSRAT ───────────────────────────────────────────────
  { id: "tumhe-dillagi", title: "Tumhe Dillagi Bhool Jaani Padegi", artistId: "nusrat-fateh-ali-khan", artist: "Nusrat Fateh Ali Khan", duration: "7:30", durationSec: 450, year: "1994", plays: "4.1M", album: "The Last Prophet", genre: ["Qawwali"], mood: ["Devotional"], tags: ["nusrat", "devotional"],
    lyrics: [{ time: 0, line: "تمہیں دلگی بھول جانی پڑے گی" }, { time: 8, line: "Tumhe dillagi bhool jaani padegi" }, { time: 16, line: "محبت کی راہ میں" }, { time: 24, line: "mohabbat ki raah mein" }] },
  { id: "sanson-ki-mala", title: "Sanson Ki Mala Pe Simron Main", artistId: "nusrat-fateh-ali-khan", artist: "Nusrat Fateh Ali Khan", duration: "8:10", durationSec: 490, year: "1997", plays: "5.9M", album: "Chain of Gold", genre: ["Qawwali", "Sufi"], mood: ["Devotional", "Trance"], tags: ["nusrat", "sufi", "devotional"],
    lyrics: [{ time: 0, line: "سانسوں کی مالا پے سمروں میں" }, { time: 8, line: "Sanson ki mala pe simron main" }, { time: 16, line: "پی کا نام" }, { time: 22, line: "pi ka naam" }] },
  { id: "kinna-sohna", title: "Kinna Sohna Tenu Rab Ne Banaya", artistId: "nusrat-fateh-ali-khan", artist: "Nusrat Fateh Ali Khan", duration: "6:45", durationSec: 405, year: "1992", plays: "6.3M", album: "Night Song", genre: ["Folk", "Sufi"], mood: ["Joyful", "Romantic"], tags: ["nusrat", "punjabi", "folk"],
    lyrics: [{ time: 0, line: "کنا سوہنا تینوں ربّ نے بنایا" }, { time: 8, line: "Kinna sohna tenu Rab ne banaya" }, { time: 16, line: "میرے دل نوں تیری لوڑ اے" }, { time: 24, line: "mere dil nu teri lor ae" }] },

  // ── MORE ABIDA PARVEEN ────────────────────────────────────────
  { id: "main-sufi-hoon", title: "Main Sufi Hoon", artistId: "abida-parveen", artist: "Abida Parveen", duration: "9:30", durationSec: 570, year: "2007", plays: "1.4M", album: "Ishq", genre: ["Sufi", "Kafi"], mood: ["Devotional", "Ecstatic"], tags: ["abida", "sufi"],
    lyrics: [{ time: 0, line: "میں صوفی ہوں" }, { time: 7, line: "Main sufi hoon" }, { time: 14, line: "بے خود ہوں بے نیاز ہوں" }, { time: 21, line: "bekhood hoon beniaz hoon" }] },
  { id: "yaar-ko-humne", title: "Yaar Ko Humne Ja Ba Ja Dekha", artistId: "abida-parveen", artist: "Abida Parveen", duration: "7:55", durationSec: 475, year: "1998", plays: "1.2M", album: "Mast Nazron Se", genre: ["Ghazal", "Sufi"], mood: ["Devotional"], tags: ["abida", "rumi"],
    lyrics: [{ time: 0, line: "یار کو ہم نے جا بجا دیکھا" }, { time: 8, line: "Yaar ko humne ja ba ja dekha" }, { time: 16, line: "کہیں ظاہر کہیں چھپا دیکھا" }, { time: 24, line: "kahin zahir kahin chupa dekha" }] },

  // ── LATA MANGESHKAR ───────────────────────────────────────────
  { id: "ajeeb-dastan", title: "Ajeeb Dastan Hai Yeh", artistId: "lata-mangeshkar", artist: "Lata Mangeshkar", duration: "4:22", durationSec: 262, year: "1960", plays: "7.4M", album: "Dil Apna Aur Preet Parai", genre: ["Film", "Classical"], mood: ["Melancholic", "Romantic"], tags: ["lata", "classic", "film"],
    lyrics: [{ time: 0, line: "अजीब दास्ताँ है यह" }, { time: 6, line: "कहाँ शुरू कहाँ ख़त्म" }, { time: 12, line: "Ajeeb dastan hai yeh" }, { time: 18, line: "kahaan shuru kahaan khatam" }] },
  { id: "tere-bina-zindagi", title: "Tere Bina Zindagi Se Koi", artistId: "lata-mangeshkar", artist: "Lata Mangeshkar", duration: "4:55", durationSec: 295, year: "1977", plays: "5.2M", album: "Aandhi", genre: ["Film"], mood: ["Longing", "Romantic"], tags: ["lata", "gulzar", "aandhi"],
    lyrics: [{ time: 0, line: "तेरे बिना ज़िंदगी से कोई" }, { time: 7, line: "शिकवा तो नहीं" }, { time: 14, line: "Tere bina zindagi se koi" }, { time: 21, line: "shikwa to nahin" }] },
  { id: "naina-barse", title: "Naina Barse Rimjhim Rimjhim", artistId: "lata-mangeshkar", artist: "Lata Mangeshkar", duration: "3:40", durationSec: 220, year: "1964", plays: "4.8M", album: "Woh Kaun Thi", genre: ["Film"], mood: ["Melancholic", "Longing"], tags: ["lata", "classic", "film"],
    lyrics: [{ time: 0, line: "नैना बरसे रिमझिम रिमझिम" }, { time: 6, line: "पिया तोरे आवन की आस" }, { time: 12, line: "Naina barse rimjhim rimjhim" }, { time: 18, line: "piya tore aavan ki aas" }] },

  // ── BHUPINDER SINGH ───────────────────────────────────────────
  { id: "do-diwane-shehar", title: "Do Diwane Shehar Mein", artistId: "bhupinder-singh", artist: "Bhupinder Singh", duration: "5:20", durationSec: 320, year: "1977", plays: "1.8M", album: "Do Diwane Shehar Mein", genre: ["Film", "Ghazal"], mood: ["Romantic"], tags: ["bhupinder", "gulzar"],
    lyrics: [{ time: 0, line: "दो दीवाने शहर में" }, { time: 6, line: "रात में या दोपहर में" }, { time: 12, line: "Do diwane shehar mein" }, { time: 18, line: "raat mein ya dopahar mein" }] },
  { id: "huzoor-is-qadar", title: "Huzoor Is Qadar Bhi Na Itaraiye", artistId: "bhupinder-singh", artist: "Bhupinder Singh", duration: "5:44", durationSec: 344, year: "1978", plays: "1.2M", album: "Ghazals", genre: ["Ghazal"], mood: ["Playful"], tags: ["bhupinder"],
    lyrics: [{ time: 0, line: "हुज़ूर इस क़दर भी न इतराइये" }, { time: 7, line: "Huzoor is qadar bhi na itaraiye" }, { time: 14, line: "कि दिल टूट जाए" }, { time: 20, line: "ki dil toot jaaye" }] },

  // ── IQBAL BANO ────────────────────────────────────────────────
  { id: "hum-dekhenge", title: "Hum Dekhenge", artistId: "iqbal-bano", artist: "Iqbal Bano", duration: "9:15", durationSec: 555, year: "1985", plays: "4.7M", album: "Hum Dekhenge", genre: ["Ghazal", "Resistance"], mood: ["Defiant", "Devotional"], tags: ["iqbal-bano", "faiz", "resistance"],
    lyrics: [{ time: 0, line: "ہم دیکھیں گے" }, { time: 6, line: "لازم ہے کہ ہم بھی دیکھیں گے" }, { time: 12, line: "Hum dekhenge" }, { time: 18, line: "laazim hai ke hum bhi dekhenge" }, { time: 28, line: "وہ دن کہ جس کا وعدہ ہے" }, { time: 36, line: "woh din ke jis ka wada hai" }] },
  { id: "mujhse-pehli-si", title: "Mujhse Pehli Si Mohabbat", artistId: "iqbal-bano", artist: "Iqbal Bano", duration: "7:30", durationSec: 450, year: "1979", plays: "2.1M", album: "Dast-e-Saba", genre: ["Ghazal"], mood: ["Melancholic", "Heartbreak"], tags: ["iqbal-bano", "faiz"],
    lyrics: [{ time: 0, line: "مجھ سے پہلی سی محبت میری محبوب نہ مانگ" }, { time: 9, line: "Mujhse pehli si mohabbat meri mehboob na maang" }, { time: 18, line: "میں نے سمجھا تھا کہ تو ہے تو درخشاں ہے حیات" }, { time: 27, line: "tera gham hai to gham-e-dehr ka jhagda kya hai" }] },

  // ── RAHAT FATEH ALI KHAN ──────────────────────────────────────
  { id: "o-re-piya", title: "O Re Piya", artistId: "rahat-fateh-ali-khan", artist: "Rahat Fateh Ali Khan", duration: "5:28", durationSec: 328, year: "2007", plays: "4.5M", album: "Aaja Nachle", genre: ["Film", "Sufi"], mood: ["Romantic", "Devotional"], tags: ["rahat", "film", "bollywood"],
    lyrics: [{ time: 0, line: "ओ रे पिया" }, { time: 5, line: "O re piya" }, { time: 10, line: "हाय रे पिया" }, { time: 15, line: "haay re piya" }, { time: 22, line: "कोई ले गया जिया" }, { time: 28, line: "koi le gaya jiya" }] },
  { id: "tere-mast-mast", title: "Tere Mast Mast Do Nain", artistId: "rahat-fateh-ali-khan", artist: "Rahat Fateh Ali Khan", duration: "4:50", durationSec: 290, year: "2010", plays: "6.2M", album: "Dabangg", genre: ["Film", "Sufi"], mood: ["Romantic"], tags: ["rahat", "dabangg", "film"],
    lyrics: [{ time: 0, line: "तेरे मस्त मस्त दो नैन" }, { time: 6, line: "मेरी पीते हैं पीनी" }, { time: 12, line: "Tere mast mast do nain" }, { time: 18, line: "meri peete hain peeni" }] },
  { id: "afreen-afreen-rahat", title: "Afreen Afreen", artistId: "rahat-fateh-ali-khan", artist: "Rahat Fateh Ali Khan", duration: "6:10", durationSec: 370, year: "2016", plays: "8.9M", album: "Coke Studio Season 9", genre: ["Sufi", "Folk"], mood: ["Devotional", "Romantic"], tags: ["rahat", "coke-studio", "momina"],
    lyrics: [{ time: 0, line: "آفریں آفریں" }, { time: 6, line: "Afreen afreen" }, { time: 12, line: "رہے نام اللہ کا" }, { time: 18, line: "rahe naam Allah ka" }] },

  // ── BEGUM AKHTAR ──────────────────────────────────────────────
  { id: "ae-mohabbat-tere-anjam", title: "Ae Mohabbat Tere Anjam Pe Rona Aaya", artistId: "begum-akhtar", artist: "Begum Akhtar", duration: "7:20", durationSec: 440, year: "1950", plays: "0.9M", album: "Ae Mohabbat", genre: ["Ghazal", "Thumri"], mood: ["Heartbreak", "Soulful"], tags: ["begum-akhtar", "classic"],
    lyrics: [{ time: 0, line: "اے محبت تیرے انجام پہ رونا آیا" }, { time: 9, line: "Ae mohabbat tere anjam pe rona aaya" }, { time: 18, line: "جانے کیوں آج تیرے نام پہ رونا آیا" }, { time: 27, line: "jaane kyun aaj tere naam pe rona aaya" }] },
  { id: "woh-jo-hum-mein-tum-mein", title: "Woh Jo Hum Mein Tum Mein Qarar Tha", artistId: "begum-akhtar", artist: "Begum Akhtar", duration: "6:45", durationSec: 405, year: "1965", plays: "1.2M", album: "Aye Dil-e-Nadan", genre: ["Ghazal"], mood: ["Longing", "Nostalgic"], tags: ["begum-akhtar", "faiz"],
    lyrics: [{ time: 0, line: "وہ جو ہم میں تم میں قرار تھا" }, { time: 8, line: "Woh jo hum mein tum mein qarar tha" }, { time: 16, line: "تمہیں یاد ہو کہ نہ یاد ہو" }, { time: 24, line: "tumhein yaad ho ke na yaad ho" }] },

  // ── HARIHARAN ─────────────────────────────────────────────────
  { id: "log-kehte-hain", title: "Log Kehte Hain Main Sharabi Hoon", artistId: "hariharan", artist: "Hariharan", duration: "5:40", durationSec: 340, year: "1990", plays: "1.4M", album: "Hariharan", genre: ["Ghazal"], mood: ["Philosophical", "Playful"], tags: ["hariharan", "ghazal"],
    lyrics: [{ time: 0, line: "लोग कहते हैं मैं शराबी हूँ" }, { time: 7, line: "Log kehte hain main sharabi hoon" }, { time: 14, line: "उनको क्या पता इश्क़ का नशा" }, { time: 21, line: "unko kya pata ishq ka nasha" }] },
  { id: "kahin-door-jab", title: "Kahin Door Jab Din Dhal Jaaye", artistId: "hariharan", artist: "Hariharan", duration: "4:50", durationSec: 290, year: "1971", plays: "2.2M", album: "Anand", genre: ["Film"], mood: ["Nostalgic", "Melancholic"], tags: ["hariharan", "anand", "film"],
    lyrics: [{ time: 0, line: "कहीं दूर जब दिन ढल जाये" }, { time: 7, line: "साँझ की दुल्हन बदन चुराये" }, { time: 14, line: "Kahin door jab din dhal jaaye" }, { time: 21, line: "saanjh ki dulhan badan churaaye" }] },

  // ── GHULAM ALI (extra) ────────────────────────────────────────
  { id: "ek-haseen-shaam", title: "Ek Haseen Shaam Ko", artistId: "ghulam-ali", artist: "Ghulam Ali", duration: "5:15", durationSec: 315, year: "1984", plays: "2.6M", album: "Aawaz", genre: ["Ghazal"], mood: ["Romantic", "Nostalgic"], tags: ["ghulam-ali", "classic"],
    lyrics: [{ time: 0, line: "ایک حسین شام کو" }, { time: 6, line: "Ek haseen shaam ko" }, { time: 12, line: "دل میرا کھو گیا" }, { time: 18, line: "dil mera kho gaya" }] },

  // ── PANKAJ UDHAS (extra) ──────────────────────────────────────
  { id: "aur-ahista", title: "Aur Ahista Kijiye Baatein", artistId: "pankaj-udhas", artist: "Pankaj Udhas", duration: "5:25", durationSec: 325, year: "1985", plays: "1.7M", album: "Nayaab", genre: ["Ghazal"], mood: ["Romantic"], tags: ["pankaj", "nayaab"],
    lyrics: [{ time: 0, line: "और आहिस्ता कीजिये बातें" }, { time: 7, line: "Aur ahista kijiye baatein" }, { time: 14, line: "रात भर की है यह रातें" }, { time: 21, line: "raat bhar ki hai yeh raatein" }] },

  // ── FARIDA KHANUM (extra) ─────────────────────────────────────
  { id: "aye-ishq-humein-barbaad", title: "Aye Ishq Humein Barbaad Na Kar", artistId: "farida-khanum", artist: "Farida Khanum", duration: "5:50", durationSec: 350, year: "1980", plays: "0.9M", album: "Mehfil", genre: ["Ghazal"], mood: ["Heartbreak"], tags: ["farida"],
    lyrics: [{ time: 0, line: "اے عشق ہمیں برباد نہ کر" }, { time: 7, line: "Aye ishq humein barbaad na kar" }, { time: 14, line: "ہم پہلے ہی کافی اداس ہیں" }, { time: 21, line: "hum pehle hi kaafi udaas hain" }] },

  // ── MALIKA PUKHRAJ ────────────────────────────────────────────
  { id: "abhi-to-main-jawan", title: "Abhi To Main Jawan Hoon", artistId: "malika-pukhraj", artist: "Malika Pukhraj", duration: "6:30", durationSec: 390, year: "1958", plays: "1.6M", album: "Abhi To Main Jawan Hoon", genre: ["Ghazal", "Thumri"], mood: ["Defiant", "Joyful"], tags: ["malika", "classic"],
    lyrics: [{ time: 0, line: "ابھی تو میں جوان ہوں" }, { time: 7, line: "Abhi to main jawan hoon" }, { time: 14, line: "ابھی تو مجھے جینا ہے" }, { time: 21, line: "abhi to mujhe jeena hai" }] },

  // ── USTAD RASHID KHAN ────────────────────────────────────────
  { id: "piya-bin-nahin", title: "Piya Bin Nahin Aavat Chain", artistId: "ustad-rashid-khan", artist: "Ustad Rashid Khan", duration: "12:30", durationSec: 750, year: "2000", plays: "0.7M", album: "Bandish", genre: ["Classical", "Thumri"], mood: ["Longing", "Devotional"], tags: ["rashid-khan", "classical", "thumri"],
    lyrics: [{ time: 0, line: "پیا بن نہیں آوت چین" }, { time: 9, line: "Piya bin nahin aavat chain" }, { time: 18, line: "نینوں نیند نہ آوے" }, { time: 27, line: "nainon neend na aave" }] },
]
export const ALL_SONGS = [...SONGS, ...EXTRA_SONGS]