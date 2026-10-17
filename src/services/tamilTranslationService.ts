/**
 * Tamil Culinary Translation & Transliteration Service for BKR Catering.
 * Provides instant (<1ms) synchronous English <-> Tamil culinary translations,
 * phonetic transliteration, category deduction, and asynchronous Gemini AI enrichment.
 */

import { DEFAULT_GEMINI_API_KEY, getGeminiApiKey } from "@/services/aiLensService";
import { registerVoiceAlias } from "@/services/voiceTypingService";

// Comprehensive South Indian Catering & Culinary Dictionary
export const CULINARY_DICTIONARY: Record<string, string> = {
  // Dishes & Staples
  "idli": "இட்லி",
  "mini idli": "மினி இட்லி",
  "sambar idli": "சாம்பார் இட்லி",
  "podi idli": "பொடி இட்லி",
  "ghee podi idli": "நெய் பொடி இட்லி",
  "thattu idli": "தட்டு இட்லி",
  "rava idli": "ரவா இட்லி",
  "dosa": "தோசை",
  "dosai": "தோசை",
  "masala dosa": "மசாலா தோசை",
  "ghee roast": "நெய் ரோஸ்ட்",
  "paper roast": "பேப்பர் ரோஸ்ட்",
  "kal dosa": "கல் தோசை",
  "set dosa": "செட் தோசை",
  "onion dosa": "வெங்காய தோசை",
  "podi dosa": "பொடி தோசை",
  "rava dosa": "ரவா தோசை",
  "onion rava dosa": "வெங்காய ரவா தோசை",
  "vada": "வடை",
  "vadai": "வடை",
  "medu vada": "மெது வடை",
  "medu vadai": "மெது வடை",
  "sambar vadai": "சாம்பார் வடை",
  "rasa vadai": "ரச வடை",
  "thayir vadai": "தயிர் வடை",
  "curd vadai": "தயிர் வடை",
  "masala vadai": "மசால் வடை",
  "keerai vadai": "கீரை வடை",
  "pongal": "பொங்கல்",
  "ven pongal": "வெண் பொங்கல்",
  "ghee pongal": "நெய் பொங்கல்",
  "sakkarai pongal": "சர்க்கரை பொங்கல்",
  "sweet pongal": "சர்க்கரை பொங்கல்",
  "rava pongal": "ரவா பொங்கல்",
  "poori": "பூரி",
  "puri": "பூரி",
  "chola poori": "சோலா பூரி",
  "channa bhatura": "சென்னா பட்டூரா",
  "chappathi": "சப்பாத்தி",
  "chapati": "சப்பாத்தி",
  "phulka": "புல்கா",
  "parotta": "பரோட்டா",
  "malabar parotta": "மலபார் பரோட்டா",
  "kothu parotta": "கொத்து பரோட்டா",
  "appam": "ஆப்பம்",
  "idiyappam": "இடியாப்பம்",
  "sevai": "சேவை",
  "lemon sevai": "எலுமிச்சை சேவை",
  "coconut sevai": "தேங்காய் சேவை",
  "upma": "உப்புமா",
  "rava upma": "ரவா உப்புமா",
  "semiya upma": "சேமியா உப்புமா",
  "wheat upma": "கோதுமை உப்புமா",
  "kichadi": "கிச்சடி",
  "rava kichadi": "ரவா கிச்சடி",
  "uthappam": "ஊத்தப்பம்",
  "onion uthappam": "வெங்காய ஊத்தப்பம்",
  "tomato uthappam": "தக்காளி ஊத்தப்பம்",
  "podhi uthappam": "பொடி ஊத்தப்பம்",

  // Rice & Meals
  "white rice": "சாதம்",
  "steamed rice": "சுடச்சுட சாதம்",
  "boiled rice": "புழுங்கல் அரிசி சாதம்",
  "raw rice": "பச்சரிசி சாதம்",
  "biryani": "பிரியாணி",
  "briyani": "பிரியாணி",
  "veg biryani": "காய்கறி பிரியாணி",
  "vegetable biryani": "காய்கறி பிரியாணி",
  "dum biryani": "தம் பிரியாணி",
  "mushroom biryani": "காளான் பிரியாணி",
  "paneer biryani": "பன்னீர் பிரியாணி",
  "pulao": "புலாவ்",
  "veg pulao": "காய்கறி புலாவ்",
  "peas pulao": "பட்டாணி புலாவ்",
  "jeera rice": "சீரக சாதம்",
  "ghee rice": "நெய் சாதம்",
  "sambar rice": "சாம்பார் சாதம்",
  "bisibelebath": "பிசிபேளபாத்",
  "curd rice": "தயிர் சாதம்",
  "bagala bath": "பகளாபாத்",
  "lemon rice": "எலுமிச்சை சாதம்",
  "tamarind rice": "புளியோதரை",
  "puliyodharai": "புளியோதரை",
  "tomato rice": "தக்காளி சாதம்",
  "coconut rice": "தேங்காய் சாதம்",
  "mango rice": "மாங்காய் சாதம்",
  "coriander rice": "கொத்தமல்லி சாதம்",
  "mint rice": "புதினா சாதம்",
  "pudhina rice": "புதினா சாதம்",
  "fried rice": "ஃப்ரைட் ரைஸ்",
  "veg fried rice": "காய்கறி ஃப்ரைட் ரைஸ்",

  // Gravies, Sambar, Rasam, Kootu
  "sambar": "சாம்பார்",
  "arachuvitta sambar": "அரைச்சுவிட்ட சாம்பார்",
  "murungakkai sambar": "முருங்கைக்காய் சாம்பார்",
  "drumstick sambar": "முருங்கைக்காய் சாம்பார்",
  "onion sambar": "சின்ன வெங்காய சாம்பார்",
  "chinna vengaya sambar": "சின்ன வெங்காய சாம்பார்",
  "tiffin sambar": "டிபன் சாம்பார்",
  "rasam": "ரசம்",
  "tomato rasam": "தக்காளி ரசம்",
  "pepper rasam": "மிளகு ரசம்",
  "milagu rasam": "மிளகு ரசம்",
  "garlic rasam": "பூண்டு ரசம்",
  "poondu rasam": "பூண்டு ரசம்",
  "jeera rasam": "சீரக ரசம்",
  "pineapple rasam": "அன்னாசிப்பழ ரசம்",
  "mysore rasam": "மைசூர் ரசம்",
  "kuzhambu": "குழம்பு",
  "kulambu": "குழம்பு",
  "vatha kuzhambu": "வத்தக் குழம்பு",
  "vathal kuzhambu": "வத்தக் குழம்பு",
  "kara kuzhambu": "காரக் குழம்பு",
  "mor kuzhambu": "மோர் குழம்பு",
  "poosanikkai mor kuzhambu": "பூசணிக்காய் மோர் குழம்பு",
  "ennai kathirikkai kuzhambu": "எண்ணெய் கத்திரிக்காய் குழம்பு",
  "kootu": "கூட்டு",
  "avial": "அவியல்",
  "poriyal": "பொரியல்",
  "beans poriyal": "பீன்ஸ் பொரியல்",
  "carrot poriyal": "கேரட் பொரியல்",
  "cabbage poriyal": "முட்டைக்கோஸ் பொரியல்",
  "potato poriyal": "உருளைக்கிழங்கு பொரியல்",
  "potato fry": "உருளைக்கிழங்கு வறுவல்",
  "potato roast": "உருளைக்கிழங்கு ரோஸ்ட்",
  "varuval": "வறுவல்",
  "vazhakkai varuval": "வாழைக்காய் வறுவல்",
  "raw banana fry": "வாழைக்காய் வறுவல்",
  "senai kizhangu varuval": "சேனைக்கிழங்கு வறுவல்",
  "yam roast": "சேனைக்கிழங்கு ரோஸ்ட்",
  "pachadi": "பச்சடி",
  "vellarikkai pachadi": "வெள்ளரிக்காய் பச்சடி",
  "cucumber pachadi": "வெள்ளரிக்காய் பச்சடி",
  "thayir pachadi": "தயிர் பச்சடி",
  "onion raita": "வெங்காய தயிர் பச்சடி",
  "sweet pachadi": "இனிப்பு பச்சடி",
  "mango sweet pachadi": "மாங்காய் இனிப்பு பச்சடி",
  "kurma": "குருமா",
  "korma": "குருமா",
  "veg kurma": "காய்கறி குருமா",
  "navarathna kurma": "நவரத்ன குருமா",
  "paneer butter masala": "பன்னீர் பட்டர் மசாலா",
  "kadai paneer": "கடாய் பன்னீர்",
  "channa masala": "சென்னா மசாலா",
  "chole masala": "சோலே மசாலா",
  "dal makhani": "தால் மக்கானி",
  "dal fry": "தால் ஃப்ரை",
  "dal tadka": "தால் தட்கா",
  "paruppu": "பருப்பு",
  "ghee paruppu": "நெய் பருப்பு",

  // Sweets & Desserts
  "kesari": "கேசரி",
  "rava kesari": "ரவா கேசரி",
  "pineapple kesari": "அன்னாசிப்பழ கேசரி",
  "fruit kesari": "பழ கேசரி",
  "mango kesari": "மாம்பழ கேசரி",
  "semiya kesari": "சேமியா கேசரி",
  "halwa": "அல்வா",
  "wheat halwa": "கோதுமை அல்வா",
  "tirunelveli halwa": "திருநெல்வேலி அல்வா",
  "badam halwa": "பாதாம் அல்வா",
  "carrot halwa": "கேரட் அல்வா",
  "gajar halwa": "கேரட் அல்வா",
  "kasi halwa": "காசி அல்வா",
  "ash gourd halwa": "காசி அல்வா",
  "dumroot halwa": "டம்ரூட் அல்வா",
  "beetroot halwa": "பீட்ரூட் அல்வா",
  "payasam": "பாயாசம்",
  "semiya payasam": "சேமியா பாயாசம்",
  "paruppu payasam": "பருப்பு பாயாசம்",
  "paal payasam": "பால் பாயாசம்",
  "milk payasam": "பால் பாயாசம்",
  "ada pradhaman": "அடை பிரதமன்",
  "elaneer payasam": "இளநீர் பாயாசம்",
  "tender coconut payasam": "இளநீர் பாயாசம்",
  "javvarisi payasam": "ஜவ்வரிசி பாயாசம்",
  "sago payasam": "ஜவ்வரிசி பாயாசம்",
  "laddu": "லட்டு",
  "laddoo": "லட்டு",
  "boondi laddu": "பூந்தி லட்டு",
  "mothichoor laddu": "மோதிச்சூர் லட்டு",
  "rava laddu": "ரவா லட்டு",
  "ghee laddu": "நெய் லட்டு",
  "gulab jamun": "குலாப் ஜாமுன்",
  "kala jamun": "காலா ஜாமுன்",
  "dry jamun": "டிரை ஜாமுன்",
  "rasagulla": "ரசகுல்லா",
  "rasgulla": "ரசகுல்லா",
  "rasamalai": "ரசமலாய்",
  "rasmalai": "ரசமலாய்",
  "mysore pak": "மைசூர் பாக்",
  "ghee mysore pak": "நெய் மைசூர் பாக்",
  "jangri": "ஜாங்கிரி",
  "jalebi": "ஜிலேபி",
  "kaju katli": "காஜு கத்லி",
  "badam katli": "பாதாம் கத்லி",
  "poli": "போளி",
  "paruppu poli": "பருப்பு போளி",
  "coconut poli": "தேங்காய் போளி",
  "asoka halwa": "அசோகா அல்வா",
  "thiruvaiyaru asoka halwa": "திருவையாறு அசோகா அல்வா",
  "elaneer halwa": "இளநீர் அல்வா",
  "jackfruit halwa": "பலாப்பழ அல்வா",
  "chakkavaratti": "சக்கவரட்டி",
  "karachi halwa": "கராச்சி அல்வா",
  "bombay halwa": "பாம்பே அல்வா",
  "anjeer halwa": "அத்திப்பழ அல்வா",
  "cham cham": "சாம் சாம்",
  "malai sandwich": "மலாய் சாண்ட்விச்",
  "srivilliputhur palkova": "ஸ்ரீவில்லிபுத்தூர் பால்கோவா",
  "palkova": "பால்கோவா",
  "doodh peda": "பால் பேடா",
  "kesar peda": "கேசர் பேடா",
  "dry fruit laddu": "உலர் பழங்கள் லட்டு",
  "maa laddu": "மா லட்டு",
  "nei appam": "நெய் அப்பம்",
  "unniyappam": "உன்னியப்பம்",
  "suzhiyan": "சுழியன்",
  "seeyam": "சீயம்",
  "basundi": "பாசுந்தி",
  "carrot kheer": "கேரட் கீர்",
  "badam kheer": "பாதாம் கீர்",
  "makhana kheer": "தாமரை விதை கீர்",
  "ice cream": "ஐஸ்கிரீம்",
  "vanilla ice cream": "வெண்ணிலா ஐஸ்கிரீம்",
  "kulfi": "குல்ஃபி",
  "matka kulfi": "மட்கா குல்ஃபி",

  // Kaaram & Traditional Savories (கார வகைகள்)
  "mixture": "மிக்சர்",
  "madras mixture": "மெட்ராஸ் மிக்சர்",
  "special madras mixture": "ஸ்பெஷல் மெட்ராஸ் மிக்சர்",
  "kaju mixture": "முந்திரி மிக்சர்",
  "cashew mixture": "முந்திரி மிக்சர்",
  "poondu mixture": "பூண்டு மிக்சர்",
  "garlic mixture": "பூண்டு மிக்சர்",
  "aval mixture": "அவல் மிக்சர்",
  "cornflakes mixture": "கார்ன்ஃப்ளேக்ஸ் மிக்சர்",
  "kara boondi": "கார பூந்தி",
  "murukku": "முறுக்கு",
  "kai murukku": "கை முறுக்கு",
  "butter murukku": "வெண்ணெய் முறுக்கு",
  "vennai murukku": "வெண்ணெய் முறுக்கு",
  "thenkuzhal": "தேன்குழல் முறுக்கு",
  "thenkuzhal murukku": "தேன்குழல் முறுக்கு",
  "mullu murukku": "முள்ளு முறுக்கு",
  "magizhampoo murukku": "மகிழம்பூ முறுக்கு",
  "ribbon pakoda": "ரிப்பன் பக்கோடா",
  "ola pakoda": "ஓல பக்கோடா",
  "ring murukku": "ரிங் முறுக்கு",
  "ragi murukku": "கேழ்வரகு முறுக்கு",
  "thattai": "தட்டை",
  "crispy thattai": "மொறுமொறு தட்டை",
  "milagu thattai": "மிளகு தட்டை",
  "pepper thattai": "மிளகு தட்டை",
  "thattu vadai": "தட்டு வடை",
  "seedai": "சீடை",
  "kara seedai": "கார சீடை",
  "uppu seedai": "உப்பு சீடை",
  "omapodi": "ஓமப்பொடி",
  "ghee omapodi": "நெய் ஓமப்பொடி",
  "kara sev": "காரா சேவ்",
  "poondu sev": "பூண்டு காரா சேவ்",
  "milagu sev": "மிளகு சேவ்",
  "peanut pakoda": "வேர்க்கடலை பக்கோடா",
  "masala peanut": "மசாலா வேர்க்கடலை பக்கோடா",
  "vazhaipoo vadai": "வாழைப்பூ வடை",
  "thavala vadai": "தவள வடை",
  "paruppu vadai": "பருப்பு வடை",

  // Snacks & Accompaniments
  "bajji": "பஜ்ஜி",
  "vazhakkai bajji": "வாழைக்காய் பஜ்ஜி",
  "onion bajji": "வெங்காய பஜ்ஜி",
  "milagai bajji": "மிளகாய் பஜ்ஜி",
  "pakoda": "பக்கோடா",
  "pakora": "பக்கோடா",
  "onion pakoda": "வெங்காய பக்கோடா",
  "cashew pakoda": "முந்திரி பக்கோடா",
  "mundhiri pakoda": "முந்திரி பக்கோடா",
  "samosa": "சமோசா",
  "mini samosa": "மினி சமோசா",
  "onion samosa": "வெங்காய சமோசா",
  "cutlet": "கட்லெட்",

  "veg cutlet": "காய்கறி கட்லெட்",
  "spring roll": "ஸ்பிரிங் ரோல்",
  "soup": "சூப்",
  "tomato soup": "தக்காளி சூப்",
  "veg soup": "காய்கறி சூப்",
  "hot and sour soup": "ஹாட் & சவர் சூப்",
  "appalam": "அப்பளம்",
  "kootu appalam": "கூட்டு அப்பளம்",
  "mor milagai": "மோர் மிளகாய்",
  "oorugai": "ஊறுகாய்",
  "pickle": "ஊறுகாய்",
  "mango pickle": "மாங்காய் ஊறுகாய்",
  "lemon pickle": "எலுமிச்சை ஊறுகாய்",
  "citron pickle": "நார்த்தங்காய் ஊறுகாய்",
  "thokku": "தொக்கு",
  "tomato thokku": "தக்காளி தொக்கு",
  "chutney": "சட்னி",
  "coconut chutney": "தேங்காய் சட்னி",
  "kara chutney": "காரச் சட்னி",
  "tomato chutney": "தக்காளி சட்னி",
  "pudhina chutney": "புதினா சட்னி",
  "mint chutney": "புதினா சட்னி",
  "coriander chutney": "கொத்தமல்லி சட்னி",
  "kothamalli chutney": "கொத்தமல்லி சட்னி",
  "peanut chutney": "வேர்க்கடலை சட்னி",

  // Beverages
  "coffee": "காபி",
  "filter coffee": "ஃபில்டர் காபி",
  "degree coffee": "டிகிரி காபி",
  "tea": "டீ",
  "masala tea": "மசாலா டீ",
  "badam milk": "பாதாம் பால்",
  "hot badam milk": "சூடான பாதாம் பால்",
  "rose milk": "ரோஸ் மில்க்",
  "tender coconut": "இளநீர்",
  "elaneer": "இளநீர்",
  "fresh lime juice": "எலுமிச்சை சாறு",
  "buttermilk": "மோர்",
  "masala mor": "மசாலா மோர்",
  "water bottle": "குடிநீர் பாட்டில்",

  // Common descriptive words
  "ghee": "நெய்",
  "butter": "வெண்ணெய்",
  "special": "ஸ்பெஷல்",
  "hot": "சூடான",
  "crispy": "மொறுமொறு",
  "spicy": "காரசாரமான",
  "sweet": "இனிப்பு",
  "curd": "தயிர்",
  "milk": "பால்",
  "fruit": "பழம்",
  "mixed": "கலவை",
  "veg": "சைவ",
  "mushroom": "காளான்",
  "paneer": "பன்னீர்",
  "onion": "வெங்காயம்",
  "tomato": "தக்காளி",
  "potato": "உருளைக்கிழங்கு",
  "carrot": "கேரட்",
  "beetroot": "பீட்ரூட்",
  "peas": "பட்டாணி",
  "cashew": "முந்திரி",
  "almond": "பாதாம்",
  "pista": "பிஸ்தா",
  "corn": "மக்காச்சோளம்",
  "baby corn": "பேபி கார்ன்",
  "cauliflower": "காலிஃபிளவர்",
  "gobi": "கோபி",
  "pepper": "மிளகு",
  "fry": "வறுவல்",
  "roast": "ரோஸ்ட்",
  "gravy": "கிரேவி",
  "curry": "கறி",
  "masala": "மசாலா",
  "chilli": "சில்லி",
  "roll": "ரோல்",
  "bonda": "போண்டா",
  "manchurian": "மஞ்சுரியன்",
  "noodles": "நூடுல்ஸ்",
  "naan": "நான்",
  "roti": "ரொட்டி",
  "kulcha": "குல்சா",
  "kozhukattai": "கொழுக்கட்டை",
  "modhakam": "மோதகம்",
  "paniyaram": "பணியாரம்",

  // Modern & Indo-Chinese Catering Specialties
  "gobi manchurian": "கோபி மஞ்சுரியன்",
  "baby corn manchurian": "பேபி கார்ன் மஞ்சுரியன்",
  "mushroom manchurian": "காளான் மஞ்சுரியன்",
  "paneer manchurian": "பன்னீர் மஞ்சுரியன்",
  "veg manchurian": "காய்கறி மஞ்சுரியன்",
  "chilli parotta": "சில்லி பரோட்டா",
  "chilli paneer": "சில்லி பன்னீர்",
  "chilli mushroom": "சில்லி காளான்",
  "chilli baby corn": "சில்லி பேபி கார்ன்",
  "gobi 65": "கோபி 65",
  "paneer 65": "பன்னீர் 65",
  "mushroom 65": "காளான் 65",
  "baby corn 65": "பேபி கார்ன் 65",
  "aloo 65": "உருளை 65",
  "pepper fry": "மிளகு வறுவல்",
  "mushroom pepper fry": "காளான் மிளகு வறுவல்",
  "paneer pepper fry": "பன்னீர் மிளகு வறுவல்",
  "baby corn pepper fry": "பேபி கார்ன் மிளகு வறுவல்",
  "corn cutlet": "கார்ன் கட்லெட்",
  "paneer cutlet": "பன்னீர் கட்லெட்",
  "beetroot cutlet": "பீட்ரூட் கட்லெட்",
  "veg roll": "காய்கறி ரோல்",
  "paneer roll": "பன்னீர் ரோல்",
  "keerai pakoda": "கீரை பக்கோடா",
  "mysore bonda": "மைசூர் போண்டா",
  "aloo bonda": "உருளை போண்டா",
  "vegetable bonda": "காய்கறி போண்டா",
  "potato bajji": "உருளைக்கிழங்கு பஜ்ஜி",
  "paneer bajji": "பன்னீர் பஜ்ஜி",
  "punjabi samosa": "பஞ்சாபி சமோசா",

  // Breads, Rice & Tiffin (Additional catering varieties)
  "butter naan": "பட்டர் நான்",
  "garlic naan": "பூண்டு நான்",
  "plain naan": "நான்",
  "tandoori roti": "தந்தூரி ரொட்டி",
  "romali roti": "ரூமாலி ரொட்டி",
  "paneer kulcha": "பன்னீர் குல்சா",
  "wheat parotta": "கோதுமை பரோட்டா",
  "veg kothu parotta": "சைவ கொத்து பரோட்டா",
  "poori masala": "பூரி மசாலா",
  "kuzhi paniyaram": "குழி பணியாரம்",
  "kara paniyaram": "காரப் பணியாரம்",
  "sweet paniyaram": "இனிப்புப் பணியாரம்",
  "vellai paniyaram": "வெள்ளை பணியாரம்",
  "semiya kichadi": "சேமியா கிச்சடி",
  "chettinad biryani": "செட்டிநாடு பிரியாணி",
  "chettinad veg biryani": "செட்டிநாடு காய்கறி பிரியாணி",
  "kashmiri pulao": "காஷ்மீரி புலாவ்",
  "corn pulao": "கார்ன் புலாவ்",
  "thayir sadham": "தயிர் சாதம்",
  "schezwan fried rice": "செஷ்வான் ஃப்ரைட் ரைஸ்",
  "veg noodles": "காய்கறி நூடுல்ஸ்",
  "hakka noodles": "ஹக்கா நூடுல்ஸ்",

  // Gravies & Curries (Additional catering varieties)
  "palak paneer": "பாலக் பன்னீர்",
  "mutter paneer": "மட்டர் பன்னீர்",
  "shahi paneer": "ஷாஹி பன்னீர்",
  "paneer tikka masala": "பன்னீர் டிக்கா மசாலா",
  "mushroom masala": "காளான் மசாலா",
  "mushroom gravy": "காளான் கிரேவி",
  "kaju masala": "முந்திரி மசாலா",
  "veg makhanwala": "காய்கறி மக்கன்வாலா",
  "chettinad kurma": "செட்டிநாடு குருமா",
  "chettinad veg gravy": "செட்டிநாடு காய்கறி கிரேவி",
  "kalyana sambar": "கல்யாண சாம்பார்",
  "kalyana rasam": "கல்யாண ரசம்",
  "chow chow kootu": "சௌ சௌ கூட்டு",
  "kalyana avial": "கல்யாண அவியல்",
  "urulai roast": "உருளைக்கிழங்கு ரோஸ்ட்",
  "senai kizhangu roast": "சேனைக்கிழங்கு ரோஸ்ட்",

  // Sweets & Desserts (Additional catering varieties)
  "ashoka halwa": "அசோகா அல்வா",
  "mothi laddu": "மோத்திசூர் லட்டு",
  "paal kova": "பால்கோவா",
};


// Create a reverse mapping for Tamil -> English
const REVERSE_DICTIONARY: Record<string, string> = {};
for (const [en, ta] of Object.entries(CULINARY_DICTIONARY)) {
  if (!REVERSE_DICTIONARY[ta]) {
    REVERSE_DICTIONARY[ta] = en
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
}

const CUSTOM_DICT_STORAGE_KEY = "bkr_custom_culinary_dictionary";

/**
 * Initialize and load custom registered dictionary entries from localStorage.
 */
export const initCustomDictionary = (): void => {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    const raw = window.localStorage.getItem(CUSTOM_DICT_STORAGE_KEY);
    if (raw) {
      const stored: Record<string, string> = JSON.parse(raw);
      for (const [en, ta] of Object.entries(stored)) {
        const enLower = en.trim().toLowerCase();
        const taClean = ta.trim();
        if (enLower && taClean) {
          CULINARY_DICTIONARY[enLower] = taClean;
          if (!REVERSE_DICTIONARY[taClean]) {
            REVERSE_DICTIONARY[taClean] = en
              .split(" ")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ");
          }
          registerVoiceAlias(enLower, [enLower, taClean]);
        }
      }
    }
  } catch (err) {
    console.warn("Could not load custom dictionary entries from localStorage:", err);
  }
};

// Auto-initialize on script evaluation
initCustomDictionary();

/**
 * Register a new dish into the active culinary dictionary and persist it to localStorage.
 * Also registers aliases for voice typing in parallel.
 */
export const registerDishToDictionary = (
  nameEn: string,
  nameTa: string,
  category?: string
): void => {
  const enLower = nameEn.trim().toLowerCase();
  const taClean = nameTa.trim();
  if (!enLower || !taClean) return;

  // 1. Update in-memory dictionaries
  CULINARY_DICTIONARY[enLower] = taClean;
  REVERSE_DICTIONARY[taClean] = toTitleCase(nameEn);

  // 2. Persist to localStorage
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const raw = window.localStorage.getItem(CUSTOM_DICT_STORAGE_KEY);
      const stored: Record<string, string> = raw ? JSON.parse(raw) : {};
      stored[enLower] = taClean;
      window.localStorage.setItem(CUSTOM_DICT_STORAGE_KEY, JSON.stringify(stored));
    } catch (err) {
      console.warn("Could not persist custom dictionary entry:", err);
    }
  }

  // 3. Register voice aliases immediately
  registerVoiceAlias(enLower, [enLower, taClean, toTitleCase(nameEn)]);
};

/**
 * Get all custom registered dictionary items.
 */
export const getCustomDictionaryEntries = (): Record<string, string> => {
  if (typeof window === "undefined" || !window.localStorage) return {};
  try {
    const raw = window.localStorage.getItem(CUSTOM_DICT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

/**
 * Direct culinary vocabulary mapping for common Tamil dish words.
 * Used for instant reverse translation into English catering names.
 */
const TAMIL_CULINARY_WORDS: Record<string, string> = {
  "பாயாசம்": "Payasam",
  "வடை": "Vada",
  "சாம்பார்": "Sambar",
  "ரசம்": "Rasam",
  "பிரியாணி": "Biryani",
  "புலாவ்": "Pulao",
  "தோசை": "Dosa",
  "இட்லி": "Idli",
  "பொங்கல்": "Pongal",
  "பூரி": "Poori",
  "அல்வா": "Halwa",
  "கேசரி": "Kesari",
  "லட்டு": "Laddu",
  "குழம்பு": "Kuzhambu",
  "கூட்டு": "Kootu",
  "அவியல்": "Avial",
  "பொரியல்": "Poriyal",
  "வறுவல்": "Varuval",
  "பச்சடி": "Pachadi",
  "சட்னி": "Chutney",
  "பஜ்ஜி": "Bajji",
  "போண்டா": "Bonda",
  "பக்கோடா": "Pakoda",
  "மசாலா": "Masala",
  "குருமா": "Kurma",
  "கிரேவி": "Gravy",
  "காளான்": "Mushroom",
  "பன்னீர்": "Paneer",
  "முந்திரி": "Cashew",
  "வெங்காயம்": "Onion",
  "தக்காளி": "Tomato",
  "மிளகு": "Pepper",
  "சீரகம்": "Jeera",
  "நெய்": "Ghee",
  "பால்": "Milk",
  "இளநீர்": "Elaneer",
  "பலாப்பழம்": "Jackfruit",
  "பலாப்பழ": "Jackfruit",
  "அடை": "Ada",
  "பிரதமன்": "Pradhaman",
  "அவல்": "Aval",
  "ஜவ்வரிசி": "Javvarisi",
  "சேமியா": "Semiya",
  "ரவா": "Rava",
  "கோதுமை": "Wheat",
  "மைசூர்": "Mysore",
  "பாக்": "Pak",
  "ரோஸ்ட்": "Roast",
  "செட்டிநாடு": "Chettinad",
  "கல்யாண": "Kalyana",
  "சுடச்சுட": "Hot",
  "சாதம்": "Rice",
  "சப்பாத்தி": "Chapati",
  "பரோட்டா": "Parotta",
  "நான்": "Naan",
  "ரொட்டி": "Roti",
  "ஊத்தப்பம்": "Uthappam",
  "ஆப்பம்": "Appam",
  "இடியாப்பம்": "Idiyappam",
  "கிச்சடி": "Kichadi",
  "உப்புமா": "Upma",
  "கொழுக்கட்டை": "Kozhukattai",
  "பணியாரம்": "Paniyaram",
};

/**
 * Clean and normalize text for translation matching
 */
const cleanForMatching = (text: string): string => {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
};

/**
 * Capitalize English words
 */
export const toTitleCase = (str: string): string => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Check if a text contains Tamil Unicode characters (\u0B80-\u0BFF)
 */
export const isTamilScript = (text: string): boolean => {
  return /[\u0B80-\u0BFF]/.test(text);
};

/**
 * Phonetic transliteration from Tamil script to Latin alphabet.
 * Ensures English fields never display raw Tamil script when the user speaks or inputs Tamil.
 */
export const romanizeTamilToEnglish = (tamilText: string): string => {
  if (!tamilText) return "";
  const clean = tamilText.trim();

  // 1. Direct culinary word match
  if (TAMIL_CULINARY_WORDS[clean]) {
    return TAMIL_CULINARY_WORDS[clean];
  }
  if (REVERSE_DICTIONARY[clean]) {
    return REVERSE_DICTIONARY[clean];
  }

  // 2. Multi-word replacement
  const words = clean.split(" ").filter(Boolean);
  const romanizedWords: string[] = [];

  for (const word of words) {
    if (TAMIL_CULINARY_WORDS[word]) {
      romanizedWords.push(TAMIL_CULINARY_WORDS[word]);
      continue;
    }
    if (REVERSE_DICTIONARY[word]) {
      romanizedWords.push(REVERSE_DICTIONARY[word]);
      continue;
    }

    // Syllabic Tamil to Latin transliteration
    let roman = "";
    let i = 0;
    while (i < word.length) {
      const char = word[i];
      const nextChar = i + 1 < word.length ? word[i + 1] : "";

      // Check pulli virama (consonant without vowel)
      if (nextChar === "்") {
        const pulliMap: Record<string, string> = {
          "க்": "k", "ங்": "ng", "ச்": "ch", "ஞ்": "nj", "ட்": "t",
          "ண்": "n", "த்": "th", "ந்": "n", "ப்": "p", "ம்": "m",
          "ய்": "y", "ர்": "r", "ல்": "l", "வ்": "v", "ழ்": "zh",
          "ள்": "l", "ற்": "r", "ன்": "n", "ஜ்": "j", "ஷ்": "sh",
          "ஸ்": "s", "ஹ்": "h",
        };
        const compound = char + "்";
        roman += pulliMap[compound] || char;
        i += 2;
        continue;
      }

      // Check consonant with dependent vowel sign
      const vowelSigns: Record<string, string> = {
        "ா": "aa", "ி": "i", "ீ": "ee", "ு": "u", "ூ": "oo",
        "ெ": "e", "ே": "ae", "ை": "ai", "ொ": "o", "ோ": "oe", "ௌ": "au",
      };
      if (nextChar && vowelSigns[nextChar]) {
        const baseConsonants: Record<string, string> = {
          "க": "k", "ங": "ng", "ச": "s", "ஞ": "ny", "ட": "t",
          "ண": "n", "த": "th", "ந": "n", "ப": "p", "ம": "m",
          "ய": "y", "ர": "r", "ல": "l", "வ": "v", "ழ": "zh",
          "ள": "l", "ற": "r", "ன": "n", "ஜ": "j", "ஷ": "sh",
          "ஸ": "s", "ஹ": "h",
        };
        const cBase = baseConsonants[char] || char;
        roman += cBase + vowelSigns[nextChar];
        i += 2;
        continue;
      }

      // Standalone consonants (inherent 'a')
      const inherentConsonants: Record<string, string> = {
        "க": "ka", "ங": "nga", "ச": "sa", "ஞ": "nya", "ட": "ta",
        "ண": "na", "த": "tha", "ந": "na", "ப": "pa", "ம": "ma",
        "ய": "ya", "ர": "ra", "ல": "la", "வ": "va", "ழ": "zha",
        "ள": "la", "ற": "ra", "ன": "na", "ஜ": "ja", "ஷ": "sha",
        "ஸ": "sa", "ஹ": "ha",
      };
      if (inherentConsonants[char]) {
        roman += inherentConsonants[char];
        i++;
        continue;
      }

      // Standalone vowels
      const standaloneVowels: Record<string, string> = {
        "அ": "A", "ஆ": "Aa", "இ": "I", "ஈ": "Ee", "உ": "U", "ஊ": "Oo",
        "எ": "E", "ஏ": "Ae", "ஐ": "Ai", "ஒ": "O", "ஓ": "O", "ஔ": "Au",
      };
      if (standaloneVowels[char]) {
        roman += standaloneVowels[char];
        i++;
        continue;
      }

      // Other characters (digits, spaces, Latin chars)
      roman += char;
      i++;
    }

    if (roman) {
      romanizedWords.push(toTitleCase(roman));
    }
  }

  const result = romanizedWords.join(" ").trim();
  // Strip any lingering Tamil Unicode characters
  return result.replace(/[\u0B80-\u0BFF]/g, "").trim();
};

/**
 * Basic culinary term mapping from English to Tamil script.
 * NEVER does character-by-character pulli transliteration.
 */
export const transliterateEnglishToTamil = (englishWord: string): string => {
  const word = englishWord.toLowerCase().trim();
  if (!word) return "";

  // Direct culinary translation keywords
  const COMMON_TERMS: Record<string, string> = {
    fry: "வறுவல்",
    roast: "ரோஸ்ட்",
    gravy: "கிரேவி",
    curry: "கறி",
    masala: "மசாலா",
    roll: "ரோல்",
    juice: "ஜூஸ்",
    shake: "ஷேக்",
    special: "ஸ்பெஷல்",
    soup: "சூப்",
    cutlet: "கட்லெட்",
    bonda: "போண்டா",
    bajji: "பஜ்ஜி",
    pakoda: "பக்கோடா",
    hot: "சூடான",
    sweet: "இனிப்பு",
    spicy: "கார",
    crispy: "மொறுமொறுப்பான",
  };

  if (COMMON_TERMS[word]) return COMMON_TERMS[word];
  if (CULINARY_DICTIONARY[word]) return CULINARY_DICTIONARY[word];

  // For unknown English words: DO NOT return character-by-character pulli gibberish!
  // Return empty string so the UI doesn't mangle Tamil input fields while user is typing English.
  return "";
};

/**
 * Instant synchronous translation from English to Tamil.
 * Returns authentic Tamil words from dictionary.
 * Does NOT generate character-by-character pulli gibberish on typing!
 */
export const getInstantTamilName = (englishText: string): string => {
  const query = cleanForMatching(englishText);
  if (!query) return "";

  // If already Tamil, return as is
  if (isTamilScript(englishText)) {
    return englishText.trim();
  }

  // 1. Direct dictionary match
  if (CULINARY_DICTIONARY[query]) {
    return CULINARY_DICTIONARY[query];
  }

  // 2. Tokenize by space and match compound words
  const words = query.split(" ").filter(Boolean);
  const translatedWords: string[] = [];
  let recognizedCount = 0;

  let i = 0;
  while (i < words.length) {
    // Try 3-word phrase
    if (i + 2 < words.length) {
      const phrase3 = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
      if (CULINARY_DICTIONARY[phrase3]) {
        translatedWords.push(CULINARY_DICTIONARY[phrase3]);
        recognizedCount += 3;
        i += 3;
        continue;
      }
    }

    // Try 2-word phrase
    if (i + 1 < words.length) {
      const phrase2 = `${words[i]} ${words[i + 1]}`;
      if (CULINARY_DICTIONARY[phrase2]) {
        translatedWords.push(CULINARY_DICTIONARY[phrase2]);
        recognizedCount += 2;
        i += 2;
        continue;
      }
    }

    // Single word match
    const singleWord = words[i];
    if (CULINARY_DICTIONARY[singleWord]) {
      translatedWords.push(CULINARY_DICTIONARY[singleWord]);
      recognizedCount++;
    } else {
      const term = transliterateEnglishToTamil(singleWord);
      if (term) {
        translatedWords.push(term);
        recognizedCount++;
      }
    }
    i++;
  }

  // If none of the words were recognized culinary terms, return empty so as not to mangle fields
  if (recognizedCount === 0) {
    return "";
  }

  return translatedWords.join(" ").trim();
};

/**
 * Instant synchronous translation/lookup from Tamil to English.
 * Guarantees English fields NEVER display raw Tamil script.
 */
export const getInstantEnglishName = (tamilText: string): string => {
  const query = tamilText.trim();
  if (!query) return "";

  // If not Tamil, return cleaned title case
  if (!isTamilScript(tamilText)) {
    return toTitleCase(tamilText);
  }

  // 1. Direct reverse dictionary lookup
  if (REVERSE_DICTIONARY[query]) {
    return REVERSE_DICTIONARY[query];
  }

  // 2. Multi-word search
  const words = query.split(" ").filter(Boolean);
  const translatedWords: string[] = [];

  for (const word of words) {
    if (REVERSE_DICTIONARY[word]) {
      translatedWords.push(REVERSE_DICTIONARY[word]);
    } else if (TAMIL_CULINARY_WORDS[word]) {
      translatedWords.push(TAMIL_CULINARY_WORDS[word]);
    } else {
      // Look for substring matches in reverse dictionary
      let found = false;
      for (const [ta, en] of Object.entries(REVERSE_DICTIONARY)) {
        if (word === ta || word.includes(ta)) {
          translatedWords.push(en);
          found = true;
          break;
        }
      }
      if (!found) {
        // Fallback: Romanize Tamil to English Latin alphabet (NEVER return raw Tamil script)
        const roman = romanizeTamilToEnglish(word);
        if (roman) {
          translatedWords.push(roman);
        }
      }
    }
  }

  if (translatedWords.length > 0) {
    const combined = translatedWords.join(" ").trim();
    // Guarantee NO Tamil characters exist in English field
    return combined.replace(/[\u0B80-\u0BFF]/g, "").trim() || romanizeTamilToEnglish(query);
  }

  return romanizeTamilToEnglish(query);
};

/**
 * Automatically deduce the best catering category based on dish name keywords.
 */
export const guessCategoryForDish = (dishName: string): string => {
  const lower = dishName.toLowerCase();

  // Kaaram & Savories (கார வகைகள்)
  if (
    lower.includes("mixture") ||
    lower.includes("murukku") ||
    lower.includes("thattai") ||
    lower.includes("seedai") ||
    lower.includes("omapodi") ||
    lower.includes("kara boondi") ||
    lower.includes("sev") ||
    lower.includes("kaaram") ||
    lower.includes("karam") ||
    lower.includes("மிக்சர்") ||
    lower.includes("முறுக்கு") ||
    lower.includes("தட்டை") ||
    lower.includes("சீடை") ||
    lower.includes("ஓமப்பொடி") ||
    lower.includes("கார பூந்தி") ||
    lower.includes("காரம்")
  ) {
    return "Kaaram & Savories (கார வகைகள்)";
  }

  // Sweets & Desserts
  if (
    lower.includes("kesari") ||

    lower.includes("halwa") ||
    lower.includes("payasam") ||
    lower.includes("laddu") ||
    lower.includes("jamun") ||
    lower.includes("sweet") ||
    lower.includes("ice cream") ||
    lower.includes("kulfi") ||
    lower.includes("mysore pak") ||
    lower.includes("jalebi") ||
    lower.includes("கேசரி") ||
    lower.includes("அல்வா") ||
    lower.includes("பாயாசம்") ||
    lower.includes("லட்டு") ||
    lower.includes("ஜாமுன்") ||
    lower.includes("இனிப்பு")
  ) {
    return "Sweets";
  }

  // Morning Tiffin
  if (
    lower.includes("idli") ||
    lower.includes("dosa") ||
    lower.includes("pongal") ||
    lower.includes("poori") ||
    lower.includes("vadai") ||
    lower.includes("vada") ||
    lower.includes("upma") ||
    lower.includes("kichadi") ||
    lower.includes("chappathi") ||
    lower.includes("இட்லி") ||
    lower.includes("தோசை") ||
    lower.includes("பொங்கல்") ||
    lower.includes("பூரி") ||
    lower.includes("வடை")
  ) {
    return "Breakfast (Tiffin)";
  }

  // Rice / Biryani / Meals
  if (
    lower.includes("biryani") ||
    lower.includes("briyani") ||
    lower.includes("pulao") ||
    lower.includes("rice") ||
    lower.includes("sadham") ||
    lower.includes("bath") ||
    lower.includes("பிரியாணி") ||
    lower.includes("சாதம்") ||
    lower.includes("புலாவ்")
  ) {
    return "Rice Varieties";
  }

  // Sambar / Rasam / Gravy
  if (
    lower.includes("sambar") ||
    lower.includes("rasam") ||
    lower.includes("kuzhambu") ||
    lower.includes("kulambu") ||
    lower.includes("kurma") ||
    lower.includes("korma") ||
    lower.includes("gravy") ||
    lower.includes("சாம்பார்") ||
    lower.includes("ரசம்") ||
    lower.includes("குழம்பு") ||
    lower.includes("குருமா")
  ) {
    return "Gravies & Curries";
  }

  // Starters / Snacks
  if (
    lower.includes("bajji") ||
    lower.includes("pakoda") ||
    lower.includes("pakora") ||
    lower.includes("samosa") ||
    lower.includes("cutlet") ||
    lower.includes("soup") ||
    lower.includes("பஜ்ஜி") ||
    lower.includes("பக்கோடா") ||
    lower.includes("சமோசா")
  ) {
    return "Evening Snacks";
  }

  // Beverages
  if (
    lower.includes("coffee") ||
    lower.includes("tea") ||
    lower.includes("juice") ||
    lower.includes("milk") ||
    lower.includes("காபி") ||
    lower.includes("டீ") ||
    lower.includes("பால்") ||
    lower.includes("சாறு")
  ) {
    return "Beverages";
  }

  return "Special Dishes";
};

/**
 * List of modern Gemini models to try in order of latency and availability.
 */
export const GEMINI_TRANSLATION_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-2.5-flash",
  "gemini-flash-latest",
];

const AI_TRANSLATION_CACHE = new Map<string, { name_en: string; name_ta: string; category: string }>();

/**
 * Intelligent authentic Tamil culinary translation powered by Google Gemini AI.
 * Translates English culinary dishes into natural, authentic South Indian catering Tamil script.
 * Caches results in-memory and registers them to the local dictionary immediately.
 */
export const fetchAiTamilTranslation = async (
  dishName: string,
): Promise<{ name_en: string; name_ta: string; category: string }> => {
  const cleanKey = dishName.trim().toLowerCase();
  if (!cleanKey) {
    return { name_en: "", name_ta: "", category: "Special Dishes" };
  }

  // 1. Check in-memory cache
  if (AI_TRANSLATION_CACHE.has(cleanKey)) {
    return AI_TRANSLATION_CACHE.get(cleanKey)!;
  }

  const isTa = isTamilScript(dishName);
  const instantEn = isTa ? getInstantEnglishName(dishName) : toTitleCase(dishName);
  const instantTa = isTa ? dishName.trim() : getInstantTamilName(dishName);
  const instantCat = guessCategoryForDish(dishName);

  // 2. Direct authentic dictionary resolution (0ms lookup if already curated)
  if (!isTa && CULINARY_DICTIONARY[cleanKey]) {
    const res = {
      name_en: toTitleCase(dishName),
      name_ta: CULINARY_DICTIONARY[cleanKey],
      category: instantCat,
    };
    AI_TRANSLATION_CACHE.set(cleanKey, res);
    return res;
  }
  if (isTa && REVERSE_DICTIONARY[cleanKey]) {
    const res = {
      name_en: REVERSE_DICTIONARY[cleanKey],
      name_ta: dishName.trim(),
      category: instantCat,
    };
    AI_TRANSLATION_CACHE.set(cleanKey, res);
    return res;
  }

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return { name_en: instantEn, name_ta: instantTa, category: instantCat };
  }

  const prompt = `You are an expert master Tamil catering chef and authentic linguistic translator for BKR Catering Services in Tamil Nadu, India.
Given the dish name: "${dishName}", translate and categorize it for a formal South Indian catering menu.

CRITICAL BILINGUAL RULES:
1. "name_en" MUST BE IN ENGLISH ALPHABET ONLY (Latin characters A-Z). NEVER output Tamil characters in "name_en"!
   - If the input is in Tamil script (e.g. "பலாப்பழ பாயாசம்", "அடை பிரதமன்", "மெது வடை"), translate it to its authentic catering English name (e.g. "Jackfruit Payasam", "Ada Pradhaman", "Medu Vada").
2. "name_ta" MUST BE IN AUTHENTIC TAMIL SCRIPT (தமிழ்). NEVER output English alphabet in "name_ta"!
   - If the input is in English (e.g. "Mushroom Pepper Fry", "Baby Corn Manchurian"), translate it to authentic South Indian catering Tamil (e.g. "காளான் மிளகு வறுவல்", "பேபி கார்ன் மஞ்சுரியன்").
3. DO NOT output letter-by-letter transliteration gibberish with pullis. Use natural South Indian wedding catering vocabulary.
4. "category" MUST be one of:
   ["Breakfast (Tiffin)", "Rice Varieties", "Sweets", "Gravies & Curries", "Evening Snacks", "Beverages", "Special Dishes"]
5. Return strictly parseable JSON:
{
  "name_en": "Authentic English Name in Latin Script",
  "name_ta": "Authentic Tamil Name in Tamil Script",
  "category": "Catering Category"
}`;

  for (const model of GEMINI_TRANSLATION_MODELS.slice(0, 2)) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(3000),
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        },
      );

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawJson) continue;

      const cleaned = rawJson.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      let resolvedEn = parsed.name_en?.trim() || "";
      let resolvedTa = parsed.name_ta?.trim() || "";
      const resolvedCat = parsed.category?.trim() || instantCat;

      // Ensure name_en has NO Tamil characters
      if (!resolvedEn || isTamilScript(resolvedEn)) {
        resolvedEn = isTa ? (getInstantEnglishName(dishName) || romanizeTamilToEnglish(dishName)) : toTitleCase(dishName);
      }
      // Ensure name_ta is Tamil script if input was Tamil
      if (!resolvedTa || (!isTamilScript(resolvedTa) && isTa)) {
        resolvedTa = dishName.trim();
      }

      const result = {
        name_en: resolvedEn,
        name_ta: resolvedTa,
        category: resolvedCat,
      };

      // Cache and register authentic names
      AI_TRANSLATION_CACHE.set(cleanKey, result);
      registerDishToDictionary(result.name_en, result.name_ta, result.category);
      return result;
    } catch {
      continue;
    }
  }

  return {
    name_en: isTa && isTamilScript(instantEn) ? romanizeTamilToEnglish(dishName) : instantEn,
    name_ta: isTa ? dishName.trim() : instantTa,
    category: instantCat,
  };
};
