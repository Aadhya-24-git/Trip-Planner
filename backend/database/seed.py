import os
import sys

# Add parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass


from sqlalchemy.orm import Session
from app.database import engine, SessionLocal, Base
from app.models.destination import Destination
from app.models.attraction import Attraction
from app.models.food import FoodItem
from app.models.user import User
from app.auth import get_password_hash

DESTINATIONS_DATA = [
    # 1. Munnar, Kerala
    {
        "name": "Munnar",
        "state": "Kerala",
        "tagline": "Emerald Tea Estates & Misty Rolling Hills",
        "description": "Nestled in the Western Ghats of Kerala, Munnar is a breathtaking hill retreat blanketed in emerald-green tea plantations, winding mountain roads, cascading waterfalls, and crisp, mist-kissed air.",
        "hero_image": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=800&q=80"
        ],
        "budget_min": 12000,
        "budget_max": 26000,
        "ideal_days_min": 4,
        "ideal_days_max": 5,
        "best_months": ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
        "latitude": 10.0889,
        "longitude": 77.0595,
        "travel_styles": ["Nature", "Relaxed", "Romantic", "Adventure", "Photography"],
        "interests": ["Mountains", "Tea Estates", "Hiking", "Waterfalls", "Wildlife", "Food", "Photography"],
        "average_rating": 4.9,
        "climate": "Cool & Misty (15°C - 23°C)",
        "highlights": ["Eravikulam National Park (Nilgiri Tahr)", "Mattupetty Dam & Lake", "KDHP Tea Museum", "Top Station Viewpoint"],
        "mood_tags": ["Mountain Escape", "Nature Retreat", "Romantic Getaway"],
        "airport_nearest": "Cochin International Airport (COK) - 110 km",
        "railway_nearest": "Aluva Railway Station - 110 km",
        "travel_tips": ["Carry a light jacket even in summer", "Book Eravikulam National Park tickets online in advance", "Hire a local jeep for off-road tea estate viewpoints"],
        "attractions": [
            {"name": "KDHP Tea Museum & Factory", "category": "Museum", "region_cluster": "central", "latitude": 10.0760, "longitude": 77.0600, "duration_minutes": 90, "entry_fee": 150, "description": "Learn 100+ years of tea processing heritage and sample freshly brewed high-altitude orthodox teas.", "best_time_of_day": "morning"},
            {"name": "Eravikulam National Park", "category": "Wildlife & Nature", "region_cluster": "north", "latitude": 10.1500, "longitude": 77.0700, "duration_minutes": 150, "entry_fee": 200, "description": "Home to the endangered Nilgiri Tahr and the majestic blooming Neelakurinji flower across lush hillsides.", "best_time_of_day": "morning"},
            {"name": "Mattupetty Dam & Lake", "category": "Nature", "region_cluster": "east", "latitude": 10.1060, "longitude": 77.1240, "duration_minutes": 90, "entry_fee": 50, "description": "Scenic reservoir nestled amidst hills with calm speedboating and regular wild elephant sightings along banks.", "best_time_of_day": "afternoon"},
            {"name": "Top Station Panorama", "category": "Viewpoint", "region_cluster": "east", "latitude": 10.1240, "longitude": 77.2450, "duration_minutes": 120, "entry_fee": 50, "description": "The highest altitude point on Munnar-Kodaikanal border offering sweeping panoramic views over the Western Ghats into Tamil Nadu.", "best_time_of_day": "evening"},
            {"name": "Attukad Waterfalls", "category": "Nature", "region_cluster": "south", "latitude": 10.0540, "longitude": 77.0420, "duration_minutes": 75, "entry_fee": 0, "description": "A roaring cascade framed by steep hills and tea trails, perfect for tranquil photography.", "best_time_of_day": "morning"}
        ],
        "foods": [
            {"name": "Kerala Appam with Stew", "food_type": "veg", "description": "Fluffy, fermented rice batter hoppers with crispy lace edges served alongside fragrant coconut milk vegetable stew.", "famous_spots": "Rapsy Restaurant, Munnar Town", "price_range": "₹120 - ₹200"},
            {"name": "Malabar Parotta & Beef/Chicken Roast", "food_type": "non-veg", "description": "Flaky, layered handmade parotta served with deeply spiced, slow-cooked roasted curry.", "famous_spots": "Saravana Bhavan & Hotel Hillview", "price_range": "₹180 - ₹300"},
            {"name": "Steamed Puttu & Kadala Curry", "food_type": "veg", "description": "Cylindrical ground rice cakes layered with grated fresh coconut, paired with rich black chickpea curry.", "famous_spots": "SN Restaurant, Munnar", "price_range": "₹90 - ₹150"}
        ]
    },

    # 2. Coorg (Kodagu), Karnataka
    {
        "name": "Coorg",
        "state": "Karnataka",
        "tagline": "Scotland of India & Aromatic Coffee Hills",
        "description": "Known for world-class Arabica coffee, spice plantations, lush rainforests, and proud Kodava martial heritage, Coorg offers serene luxury homestays and roaring forest waterfalls.",
        "hero_image": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
        ],
        "budget_min": 14000,
        "budget_max": 28000,
        "ideal_days_min": 3,
        "ideal_days_max": 5,
        "best_months": ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"],
        "latitude": 12.3375,
        "longitude": 75.8069,
        "travel_styles": ["Nature", "Relaxed", "Adventure", "Romantic", "Food"],
        "interests": ["Mountains", "Coffee Plantations", "Waterfalls", "Trekking", "Wildlife", "Food"],
        "average_rating": 4.8,
        "climate": "Crisp & Pleasant (16°C - 26°C)",
        "highlights": ["Abbey Falls", "Namdroling Golden Temple", "Raja's Seat Sunset", "Coffee Estate Plantation Walk"],
        "mood_tags": ["Nature Retreat", "Mountain Escape", "Romantic Getaway"],
        "airport_nearest": "Kannur Airport (CNN) - 90 km / Mangalore (IXE) - 135 km",
        "railway_nearest": "Mysore Junction - 120 km",
        "travel_tips": ["Buy authentic dark roast Coorg coffee beans and wild forest honey", "Stay at an authentic coffee estate homestay for best hospitality"],
        "attractions": [
            {"name": "Abbey Falls", "category": "Nature", "region_cluster": "north", "latitude": 12.4500, "longitude": 75.7170, "duration_minutes": 75, "entry_fee": 30, "description": "A roaring cascade emerging dramatically out of dense coffee estates and spice groves.", "best_time_of_day": "morning"},
            {"name": "Namdroling Tibetan Golden Temple", "category": "Spiritual", "region_cluster": "east", "latitude": 12.4300, "longitude": 75.9600, "duration_minutes": 100, "entry_fee": 0, "description": "The largest Tibetan settlement in South India with three magnificent 40ft golden statues and meditative chant halls.", "best_time_of_day": "morning"},
            {"name": "Raja's Seat Viewpoint", "category": "Viewpoint", "region_cluster": "central", "latitude": 12.4200, "longitude": 75.7350, "duration_minutes": 60, "entry_fee": 20, "description": "Historic seasonal garden where the kings of Kodagu watched sunsets across undulating green valleys.", "best_time_of_day": "evening"},
            {"name": "Dubare Elephant Camp", "category": "Wildlife", "region_cluster": "south", "latitude": 12.3700, "longitude": 75.9000, "duration_minutes": 120, "entry_fee": 150, "description": "Interact with gentle giants on the banks of river Kaveri, observing daily river bathing and feeding sessions.", "best_time_of_day": "morning"}
        ],
        "foods": [
            {"name": "Pandi Curry (Pork/Mushroom Pepper Curry)", "food_type": "non-veg", "description": "Iconic Kodava spicy curry infused with dark roasted spices and sour Kachampuli vinegar.", "famous_spots": "Coorg Cuisine, Madikeri", "price_range": "₹220 - ₹350"},
            {"name": "Kadambuttu with Chutney", "food_type": "veg", "description": "Steamed round rice dumplings seasoned with coconut, paired with zesty spicy chutney.", "famous_spots": "Raintree Restaurant, Madikeri", "price_range": "₹120 - ₹180"}
        ]
    },

    # 3. Alleppey (Alappuzha), Kerala
    {
        "name": "Alleppey",
        "state": "Kerala",
        "tagline": "Venice of the East & Tranquil Backwaters",
        "description": "Gliding on a traditional Kettuvallam houseboat through mirror-still canals, swaying coconut groves, and paddy fields makes Alleppey the quintessential serene Kerala experience.",
        "hero_image": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80"
        ],
        "budget_min": 15000,
        "budget_max": 32000,
        "ideal_days_min": 2,
        "ideal_days_max": 4,
        "best_months": ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        "latitude": 9.4981,
        "longitude": 76.3388,
        "travel_styles": ["Relaxed", "Romantic", "Culture", "Food"],
        "interests": ["Backwaters", "Boating", "Food", "Beaches", "Photography"],
        "average_rating": 4.8,
        "climate": "Tropical Coastal Warmth (24°C - 31°C)",
        "highlights": ["Private Overnight Houseboat Cruise", "Vembanad Lake Sunset", "Marari Beach Tranquility", "Village Canoe Safari"],
        "mood_tags": ["Nature Retreat", "Romantic Getaway", "Food & Culture"],
        "airport_nearest": "Cochin International Airport (COK) - 85 km",
        "railway_nearest": "Alappuzha Railway Station (in town)",
        "travel_tips": ["Book houseboats verified by Kerala Tourism (DTPC)", "Opt for a small village shikhara boat ride through narrow canals"],
        "attractions": [
            {"name": "Alleppey Backwaters Houseboat Cruise", "category": "Boating", "region_cluster": "central", "latitude": 9.4950, "longitude": 76.3400, "duration_minutes": 240, "entry_fee": 1500, "description": "Cruise through peaceful canals past ancient churches, duck farms, and paddy fields.", "best_time_of_day": "morning"},
            {"name": "Marari Beach", "category": "Beach", "region_cluster": "north", "latitude": 9.6000, "longitude": 76.2980, "duration_minutes": 120, "entry_fee": 0, "description": "An unspoiled white sand beach lined with swaying coconut trees away from tourist crowds.", "best_time_of_day": "evening"},
            {"name": "Alappuzha Lighthouse", "category": "Heritage", "region_cluster": "west", "latitude": 9.4940, "longitude": 76.3190, "duration_minutes": 45, "entry_fee": 30, "description": "Historic striped lighthouse built in 1862 offering aerial coastal views of the Arabian Sea.", "best_time_of_day": "afternoon"}
        ],
        "foods": [
            {"name": "Karimeen Pollichathu (Pearl Spot Fish in Banana Leaf)", "food_type": "non-veg", "description": "Fresh backwater pearl spot fish marinated in spicy shallot-chilli masala and pan-fried in scorched banana leaves.", "famous_spots": "Mullakkal Thaff Restaurant", "price_range": "₹350 - ₹500"},
            {"name": "Traditional Kerala Sadya", "food_type": "veg", "description": "Royal 24-dish vegetarian feast served on a plantain leaf with red rice, sambar, avial, and payasam.", "famous_spots": "Hotel Aryas & Brothers Hotel", "price_range": "₹180 - ₹280"}
        ]
    },

    # 4. Jaipur, Rajasthan
    {
        "name": "Jaipur",
        "state": "Rajasthan",
        "tagline": "The Pink City of Palaces, Forts & Royal Splendor",
        "description": "The capital of Rajasthan is a dazzling pageant of regal grandeur, from the honeycomb facade of Hawa Mahal to the imposing ramparts of Amer Fort, vibrant gemstone bazaars, and rich Rajputana hospitality.",
        "hero_image": "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"
        ],
        "budget_min": 14000,
        "budget_max": 35000,
        "ideal_days_min": 3,
        "ideal_days_max": 5,
        "best_months": ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        "latitude": 26.9124,
        "longitude": 75.7873,
        "travel_styles": ["Cultural", "Heritage", "Luxury", "Photography", "Food"],
        "interests": ["Forts", "Palaces", "Heritage", "Shopping", "Food", "Photography"],
        "average_rating": 4.9,
        "climate": "Sunny & Dry (14°C - 28°C)",
        "highlights": ["Amer Fort & Maota Lake", "Hawa Mahal (Palace of Winds)", "City Palace Museum", "Nahargarh Fort Sunset"],
        "mood_tags": ["Heritage Trail", "Food & Culture", "Romantic Getaway"],
        "airport_nearest": "Jaipur International Airport (JAI)",
        "railway_nearest": "Jaipur Junction (in city)",
        "travel_tips": ["Buy a composite monument ticket for major forts", "Visit Nahargarh Fort at sunset for golden skyline views"],
        "attractions": [
            {"name": "Amer Fort & Palace", "category": "Fort", "region_cluster": "north", "latitude": 26.9855, "longitude": 75.8513, "duration_minutes": 150, "entry_fee": 100, "description": "Majestic hilltop fort with ornate marble courtyards and the dazzling Sheesh Mahal (hall of mirrors).", "best_time_of_day": "morning"},
            {"name": "Hawa Mahal", "category": "Heritage", "region_cluster": "central", "latitude": 26.9239, "longitude": 75.8267, "duration_minutes": 60, "entry_fee": 50, "description": "Iconic pink sandstone palace with 953 intricate honeycomb jharokha windows built for royal women.", "best_time_of_day": "morning"},
            {"name": "City Palace of Jaipur", "category": "Palace", "region_cluster": "central", "latitude": 26.9258, "longitude": 75.8237, "duration_minutes": 120, "entry_fee": 300, "description": "Living royal residence showcasing royal costumes, armory, and the famous Peacock Courtyard.", "best_time_of_day": "afternoon"},
            {"name": "Nahargarh Fort Sunset Viewpoint", "category": "Viewpoint", "region_cluster": "north", "latitude": 26.9372, "longitude": 75.8155, "duration_minutes": 90, "entry_fee": 50, "description": "Perched on the Aravalli hills with unobstructed vistas of Jaipur lit up at twilight.", "best_time_of_day": "evening"}
        ],
        "foods": [
            {"name": "Dal Baati Churma with Pure Ghee", "food_type": "veg", "description": "Baked wheat balls drowned in desi ghee, served with five-lentil spicy dal and sweet crushed churma.", "famous_spots": "Chokhi Dhani & Laxmi Mishthan Bhandar (LMB)", "price_range": "₹250 - ₹450"},
            {"name": "Laal Maas (Fiery Mathania Chili Mutton)", "food_type": "non-veg", "description": "Slow-braised tender mutton cooked in smoky mustard oil and fragrant red Mathania chilies.", "famous_spots": "Handi Restaurant, MI Road", "price_range": "₹450 - ₹650"},
            {"name": "Ghewar & Pyaaz Kachori", "food_type": "sweet", "description": "Crisp flaky onion kachoris followed by honeycombed traditional festive dessert soaked in saffron syrup.", "famous_spots": "Rawat Mishthan Bhandar", "price_range": "₹80 - ₹160"}
        ]
    },

    # 5. Manali, Himachal Pradesh
    {
        "name": "Manali",
        "state": "Himachal Pradesh",
        "tagline": "Valley of the Gods, Snow Peaks & Pine Forests",
        "description": "High in the Pir Panjal and Dhauladhar ranges along the Beas River, Manali is India's prime alpine paradise for snow adventure, river rafting, café culture, and mountain solace.",
        "hero_image": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80"
        ],
        "budget_min": 16000,
        "budget_max": 34000,
        "ideal_days_min": 4,
        "ideal_days_max": 6,
        "best_months": ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        "latitude": 32.2396,
        "longitude": 77.1887,
        "travel_styles": ["Adventure", "Nature", "Romantic", "Backpacking"],
        "interests": ["Mountains", "Snow", "Trekking", "River Rafting", "Photography", "Cafes"],
        "average_rating": 4.8,
        "climate": "Alpine Cold & Crisp (2°C - 18°C)",
        "highlights": ["Solang Valley Adventure Sports", "Atal Tunnel & Sissu Waterfall", "Hadimba Pagoda Temple", "Old Manali Bohemian Cafes"],
        "mood_tags": ["Mountain Escape", "Adventure Trip", "Romantic Getaway"],
        "airport_nearest": "Bhuntar Airport (KUU) - 50 km",
        "railway_nearest": "Chandigarh Railway Station - 310 km",
        "travel_tips": ["Book Atal Tunnel / Rohtang permits early during peak winter or summer", "Stroll through Old Manali for live acoustic music and wood-fired pizza"],
        "attractions": [
            {"name": "Solang Valley", "category": "Adventure", "region_cluster": "north", "latitude": 32.3160, "longitude": 77.1570, "duration_minutes": 180, "entry_fee": 100, "description": "Snow park offering skiing, paragliding, zorbing, and quad-biking against towering snowy peaks.", "best_time_of_day": "morning"},
            {"name": "Hadimba Devi Temple", "category": "Temple", "region_cluster": "central", "latitude": 32.2483, "longitude": 77.1706, "duration_minutes": 60, "entry_fee": 20, "description": "Ancient 1553 AD four-tiered wooden pagoda temple surrounded by cedar forest groves.", "best_time_of_day": "morning"},
            {"name": "Atal Tunnel & Sissu Waterfall", "category": "Nature", "region_cluster": "north", "latitude": 32.4830, "longitude": 77.1260, "duration_minutes": 180, "entry_fee": 0, "description": "Drive through the world's longest highway tunnel above 10,000 feet into the stark, stunning Lahaul Valley.", "best_time_of_day": "afternoon"},
            {"name": "Jogini Waterfalls Trek", "category": "Trek", "region_cluster": "east", "latitude": 32.2600, "longitude": 77.1950, "duration_minutes": 120, "entry_fee": 0, "description": "Picturesque hiking trail starting from Vashisht village ending at cascading mountain tiers.", "best_time_of_day": "morning"}
        ],
        "foods": [
            {"name": "Himachali Siddu with Ghee", "food_type": "veg", "description": "Traditional steamed wheat flour yeast bread stuffed with spiced walnut and poppy seed paste, dipped in warm ghee.", "famous_spots": "Café 1947 & Old Manali Dhabas", "price_range": "₹120 - ₹200"},
            {"name": "Grilled Himalayan Trout", "food_type": "non-veg", "description": "Freshly caught freshwater river trout seasoned with garlic lemon butter and roasted baby potatoes.", "famous_spots": "Johnson's Cafe, Circuit House Road", "price_range": "₹450 - ₹650"}
        ]
    },

    # 6. Goa (North & South)
    {
        "name": "North Goa",
        "state": "Goa",
        "tagline": "Golden Beaches, Ocean Vibes & Sunset Shacks",
        "description": "Sun, sand, and electric energy. North Goa features lively beach shacks, water sports, historic Portuguese forts, vibrant flea markets, and mouthwatering seafood.",
        "hero_image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=800&q=80"
        ],
        "budget_min": 14000,
        "budget_max": 32000,
        "ideal_days_min": 3,
        "ideal_days_max": 6,
        "best_months": ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
        "latitude": 15.5190,
        "longitude": 73.7680,
        "travel_styles": ["Relaxed", "Adventure", "Nightlife", "Food", "Backpacking"],
        "interests": ["Beaches", "Water Sports", "Nightlife", "Food", "Forts", "Photography"],
        "average_rating": 4.8,
        "climate": "Sunny Coastal Breeze (23°C - 32°C)",
        "highlights": ["Aguada Fort & Lighthouse", "Vagator & Anjuna Sunset Cliffs", "Calangute & Baga Water Sports", "Latin Quarter Fontainhas"],
        "mood_tags": ["Beach Holiday", "Adventure Trip", "Food & Culture"],
        "airport_nearest": "Goa Mopa (GOX) or Dabolim (GOI)",
        "railway_nearest": "Thivim / Madgaon Railway Station",
        "travel_tips": ["Rent a scooter for easy beach hopping", "Watch sunsets from Chapora Fort ramparts"],
        "attractions": [
            {"name": "Aguada Fort & Portuguese Lighthouse", "category": "Fort", "region_cluster": "south", "latitude": 15.4920, "longitude": 73.7730, "duration_minutes": 90, "entry_fee": 50, "description": "17th-century Portuguese fortress overlooking Sinquerim beach and the vast Arabian Sea.", "best_time_of_day": "morning"},
            {"name": "Vagator Beach & Chapora Fort", "category": "Beach & Fort", "region_cluster": "north", "latitude": 15.6020, "longitude": 73.7380, "duration_minutes": 120, "entry_fee": 0, "description": "Dramatic red cliffs, bohemian shacks, and the famous 'Dil Chahta Hai' fort ruins.", "best_time_of_day": "evening"},
            {"name": "Fontainhas Latin Quarter", "category": "Heritage", "region_cluster": "east", "latitude": 15.4989, "longitude": 73.8278, "duration_minutes": 90, "entry_fee": 0, "description": "Charming colonial quarter with pastel yellow and terracotta heritage villas, quaint bakeries, and art galleries.", "best_time_of_day": "afternoon"}
        ],
        "foods": [
            {"name": "Goan Fish Curry with Rice", "food_type": "non-veg", "description": "Kingfish cooked in aromatic coconut gravy spiced with red chillies and tangy kokum.", "famous_spots": "Vinayak Family Restaurant, Assagao", "price_range": "₹240 - ₹350"},
            {"name": "Goan Poi with Pork/Mushroom Vindaloo", "food_type": "non-veg", "description": "Traditional leavened crusty Goan bread paired with deeply spiced tangy garlic vinegar curry.", "famous_spots": "Fisherman's Wharf & Ritz Classic", "price_range": "₹280 - ₹420"}
        ]
    },

    # 7. Udaipur, Rajasthan
    {
        "name": "Udaipur",
        "state": "Rajasthan",
        "tagline": "City of Lakes, White Marble Palaces & Royal Romance",
        "description": "Surrounded by the Aravalli hills, Udaipur's shimmering lakes, floating palaces, and ornate marble balconies make it one of the most romantic destinations on earth.",
        "hero_image": "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"
        ],
        "budget_min": 16000,
        "budget_max": 38000,
        "ideal_days_min": 3,
        "ideal_days_max": 5,
        "best_months": ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        "latitude": 24.5854,
        "longitude": 73.7125,
        "travel_styles": ["Romantic", "Luxury", "Heritage", "Photography", "Cultural"],
        "interests": ["Palaces", "Lakes", "Heritage", "Boating", "Food", "Photography"],
        "average_rating": 4.9,
        "climate": "Pleasant Lake Breeze (15°C - 27°C)",
        "highlights": ["City Palace on Lake Pichola", "Lake Pichola Sunset Boat Ride", "Jag Mandir Island", "Saheliyon Ki Bari"],
        "mood_tags": ["Romantic Getaway", "Heritage Trail", "Food & Culture"],
        "airport_nearest": "Maharana Pratap Airport (UDR) - 22 km",
        "railway_nearest": "Udaipur City Railway Station",
        "travel_tips": ["Book an evening boat ride to catch sunset over Jag Mandir", "Dine on a lakeside rooftop overlooking illuminated Lake Palace"],
        "attractions": [
            {"name": "Udaipur City Palace", "category": "Palace", "region_cluster": "central", "latitude": 24.5764, "longitude": 73.6835, "duration_minutes": 150, "entry_fee": 300, "description": "Rajasthan's largest palace complex featuring glass mosaics, peacock courtyards, and lake views.", "best_time_of_day": "morning"},
            {"name": "Lake Pichola Boat Cruise", "category": "Boating", "region_cluster": "central", "latitude": 24.5780, "longitude": 73.6800, "duration_minutes": 75, "entry_fee": 450, "description": "Glide across serene waters viewing the Taj Lake Palace and Ghats reflecting golden light.", "best_time_of_day": "evening"},
            {"name": "Saheliyon-ki-Bari", "category": "Garden", "region_cluster": "north", "latitude": 24.6033, "longitude": 73.6881, "duration_minutes": 60, "entry_fee": 50, "description": "Royal garden of the maids adorned with marble fountains, lotus pools, and sculpted pavilions.", "best_time_of_day": "afternoon"}
        ],
        "foods": [
            {"name": "Kadhi Pakora & Gatta Curry", "food_type": "veg", "description": "Spiced gram flour dumplings simmered in curd gravy, paired with handmade bajra rotis.", "famous_spots": "Traditional Khamma Ghani Restaurant", "price_range": "₹220 - ₹340"},
            {"name": "Mawa Kachori", "food_type": "sweet", "description": "Rich sweet pastry filled with sweetened reduced milk solids and dry fruits, dipped in sugar syrup.", "famous_spots": "Jodhpur Sweets, Udaipur", "price_range": "₹70 - ₹120"}
        ]
    },

    # 8. Varanasi, Uttar Pradesh
    {
        "name": "Varanasi",
        "state": "Uttar Pradesh",
        "tagline": "The Spiritual Heart of India & Eternal Sacred Ghats",
        "description": "Among the oldest continuously inhabited cities in human history, Varanasi offers a transcendent journey along the sacred Ganga, with mesmerizing evening aartis and centuries-old silk weaving.",
        "hero_image": "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=800&q=80"
        ],
        "budget_min": 10000,
        "budget_max": 22000,
        "ideal_days_min": 2,
        "ideal_days_max": 4,
        "best_months": ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        "latitude": 25.3176,
        "longitude": 82.9739,
        "travel_styles": ["Spiritual", "Cultural", "Heritage", "Photography"],
        "interests": ["Temples", "Ghats", "Spiritual", "Food", "Photography", "Local Culture"],
        "average_rating": 4.8,
        "climate": "Crisp in Winter, Warm in Summer (12°C - 26°C)",
        "highlights": ["Dashashwamedh Ghat Ganga Aarti", "Sunrise Boat Ride on River Ganga", "Kashi Vishwanath Corridor", "Sarnath Buddhist Monuments"],
        "mood_tags": ["Spiritual Journey", "Heritage Trail", "Food & Culture"],
        "airport_nearest": "Lal Bahadur Shastri Airport (VNS) - 25 km",
        "railway_nearest": "Varanasi Junction / Banaras",
        "travel_tips": ["Wake up at 5:30 AM for a peaceful wooden rowboat ride along the ghats", "Sip Banarasi lassi from earthen kulhads"],
        "attractions": [
            {"name": "Dashashwamedh Ghat Grand Aarti", "category": "Spiritual", "region_cluster": "central", "latitude": 25.3075, "longitude": 83.0104, "duration_minutes": 90, "entry_fee": 0, "description": "Spellbinding evening ritual of fire, conch shells, incense, and chants performed by young priests.", "best_time_of_day": "evening"},
            {"name": "Kashi Vishwanath Temple Corridor", "category": "Temple", "region_cluster": "central", "latitude": 25.3109, "longitude": 83.0107, "duration_minutes": 100, "entry_fee": 0, "description": "Sacred Jyotirlinga shrine recently expanded into a grand riverfront marble promenade.", "best_time_of_day": "morning"},
            {"name": "Sarnath Deer Park & Stupa", "category": "Heritage", "region_cluster": "north", "latitude": 25.3811, "longitude": 83.0214, "duration_minutes": 120, "entry_fee": 50, "description": "The sacred site where Lord Buddha delivered his first sermon after attaining enlightenment.", "best_time_of_day": "afternoon"}
        ],
        "foods": [
            {"name": "Banarasi Kachori Sabzi & Jalebi", "food_type": "veg", "description": "Crispy urad dal stuffed pooris served with spicy hing-infused potato curry and crispy saffron jalebis.", "famous_spots": "Ram Bhandar, Thatheri Bazaar", "price_range": "₹60 - ₹120"},
            {"name": "Blue Lassi & Malaiyo", "food_type": "sweet", "description": "Thick hand-churned yogurt topped with pomegranate and saffron foam dessert that melts on the tongue.", "famous_spots": "Blue Lassi Shop & Chowk", "price_range": "₹80 - ₹150"}
        ]
    },

    # 9. Rishikesh, Uttarakhand
    {
        "name": "Rishikesh",
        "state": "Uttarakhand",
        "tagline": "Yoga Capital of the World & River Rafting Thrills",
        "description": "Where the emerald Ganga leaves the Himalayas and flows into the plains, Rishikesh brings together serene meditation ashrams, Beatles history, and adrenaline-pumping white water rafting.",
        "hero_image": "https://images.unsplash.com/photo-1596761226071-9f9397621495?auto=format&fit=crop&w=1200&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1596761226071-9f9397621495?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1588096344356-91e847c21111?auto=format&fit=crop&w=800&q=80"
        ],
        "budget_min": 11000,
        "budget_max": 24000,
        "ideal_days_min": 3,
        "ideal_days_max": 5,
        "best_months": ["Sep", "Oct", "Nov", "Dec", "Feb", "Mar", "Apr", "May"],
        "latitude": 30.0869,
        "longitude": 78.2676,
        "travel_styles": ["Adventure", "Spiritual", "Relaxed", "Backpacking"],
        "interests": ["River Rafting", "Yoga", "Mountains", "Temples", "Trekking", "Cafes"],
        "average_rating": 4.8,
        "climate": "Breezy & Clean (12°C - 25°C)",
        "highlights": ["Ganges River White Water Rafting", "Triveni Ghat Evening Maha Aarti", "Beatles Ashram Ruins & Murals", "Laxman Jhula & Riverside Cafes"],
        "mood_tags": ["Adventure Trip", "Spiritual Journey", "Mountain Escape"],
        "airport_nearest": "Dehradun Jolly Grant Airport (DED) - 20 km",
        "railway_nearest": "Yog Nagari Rishikesh Railway Station",
        "travel_tips": ["Book river rafting with certified IRF guides", "Spend mornings doing yoga along the white sand beaches of Shivpuri"],
        "attractions": [
            {"name": "White Water Rafting (Marine Drive to Rishikesh)", "category": "Adventure", "region_cluster": "north", "latitude": 30.1300, "longitude": 78.3300, "duration_minutes": 180, "entry_fee": 1000, "description": "Tackle grade III & IV rapids including 'Roller Coaster' and 'Golf Course' on the Himalayan Ganga.", "best_time_of_day": "morning"},
            {"name": "The Beatles Ashram (Chaurasi Kutia)", "category": "Heritage", "region_cluster": "south", "latitude": 30.1130, "longitude": 78.3120, "duration_minutes": 100, "entry_fee": 150, "description": "Historic 1968 meditation compound where The Beatles wrote the White Album, now covered in vibrant graffiti.", "best_time_of_day": "afternoon"},
            {"name": "Triveni Ghat Evening Aarti", "category": "Spiritual", "region_cluster": "central", "latitude": 30.1030, "longitude": 78.2930, "duration_minutes": 75, "entry_fee": 0, "description": "Peaceful riverbank prayer ceremony accompanied by floating oil lamps and Vedic bhajans.", "best_time_of_day": "evening"}
        ],
        "foods": [
            {"name": "Garhwali Kafuli & Mandua Roti", "food_type": "veg", "description": "Iron-rich spinach and fenugreek green curry cooked in an iron kadhai, paired with finger millet flatbread.", "famous_spots": "Chotiwala Restaurant, Swarg Ashram", "price_range": "₹150 - ₹250"},
            {"name": "Ayurvedic Herbal Bowls & Smoothies", "food_type": "veg", "description": "Fresh dragonfruit chia bowls and detox golden turmeric milk overlooking river cliffs.", "famous_spots": "Little Buddha Cafe & Beatles Cafe", "price_range": "₹180 - ₹300"}
        ]
    },

    # 10. Ooty (Udhagamandalam), Tamil Nadu
    {
        "name": "Ooty",
        "state": "Tamil Nadu",
        "tagline": "Queen of Nilgiris & Heritage Toy Train",
        "description": "Perched at 2,240 meters amidst the Nilgiri blue mountains, Ooty enchants visitors with its UNESCO mountain railway, sprawling botanical gardens, eucalyptus pine groves, and handmade chocolates.",
        "hero_image": "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=800&q=80"
        ],
        "budget_min": 12000,
        "budget_max": 25000,
        "ideal_days_min": 3,
        "ideal_days_max": 5,
        "best_months": ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"],
        "latitude": 11.4102,
        "longitude": 76.6950,
        "travel_styles": ["Nature", "Family", "Relaxed", "Romantic"],
        "interests": ["Mountains", "Tea Estates", "Toy Train", "Gardens", "Photography", "Food"],
        "average_rating": 4.7,
        "climate": "Chilly & Misty (10°C - 20°C)",
        "highlights": ["Nilgiri Mountain Railway (Toy Train)", "Doddabetta Peak Viewpoint", "Ooty Lake & Boat House", "Government Botanical Gardens"],
        "mood_tags": ["Mountain Escape", "Nature Retreat", "Romantic Getaway"],
        "airport_nearest": "Coimbatore International Airport (CJB) - 85 km",
        "railway_nearest": "Udhagamandalam Railway Station (in town)",
        "travel_tips": ["Book the UNESCO Toy Train tickets well in advance", "Sample warm homemade fudge and Nilgiri eucalyptus tea"],
        "attractions": [
            {"name": "Nilgiri Mountain Toy Train", "category": "Heritage", "region_cluster": "central", "latitude": 11.4050, "longitude": 76.7000, "duration_minutes": 150, "entry_fee": 150, "description": "UNESCO World Heritage historic steam engine chugging through 16 tunnels and 250 bridges across misty valleys.", "best_time_of_day": "morning"},
            {"name": "Doddabetta Peak", "category": "Viewpoint", "region_cluster": "east", "latitude": 11.4000, "longitude": 76.7360, "duration_minutes": 90, "entry_fee": 30, "description": "Highest peak in Tamil Nadu (2,637 m) featuring a telescopic observatory overlooking Nilgiri slopes.", "best_time_of_day": "morning"},
            {"name": "Government Botanical Garden", "category": "Nature", "region_cluster": "central", "latitude": 11.4170, "longitude": 76.7110, "duration_minutes": 90, "entry_fee": 50, "description": "55-acre terraced garden established in 1848 boasting 1,000+ exotic floral species and a fossilized tree trunk.", "best_time_of_day": "afternoon"}
        ],
        "foods": [
            {"name": "Homemade Nilgiri Dark Chocolates & Fudge", "food_type": "sweet", "description": "Artisanal chocolates infused with roasted almonds, raisins, and Nilgiri spices.", "famous_spots": "King Star Bakery & Moddy's Chocolates", "price_range": "₹150 - ₹350"},
            {"name": "South Indian Filter Coffee with Hot Vada", "food_type": "veg", "description": "Freshly brewed chicory-blended filter kaapi served frothy in a brass dabarah set.", "famous_spots": "Hotel Nahar & Woodlands", "price_range": "₹60 - ₹120"}
        ]
    },

    # 11. Wayanad, Kerala
    {
        "name": "Wayanad",
        "state": "Kerala",
        "tagline": "Pristine Rainforests, Waterfalls & Ancient Caves",
        "description": "A green paradise wrapped in spice plantations, waterfalls, wildlife sanctuaries, and prehistoric Edakkal rock engravings in northern Kerala.",
        "hero_image": "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=1200&q=80",
        "gallery": ["https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=800&q=80"],
        "budget_min": 11000,
        "budget_max": 24000,
        "ideal_days_min": 3,
        "ideal_days_max": 5,
        "best_months": ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
        "latitude": 11.6854,
        "longitude": 76.1320,
        "travel_styles": ["Nature", "Adventure", "Relaxed", "Photography"],
        "interests": ["Waterfalls", "Caves", "Trekking", "Wildlife", "Tea Estates"],
        "average_rating": 4.7,
        "climate": "Cool & Forest Breezy (17°C - 25°C)",
        "highlights": ["Banasura Sagar Dam", "Edakkal Prehistoric Caves", "Chembra Heart-Shaped Lake Trek", "Soochipara Waterfalls"],
        "mood_tags": ["Nature Retreat", "Adventure Trip", "Mountain Escape"],
        "airport_nearest": "Calicut International Airport (CCJ) - 85 km",
        "railway_nearest": "Kozhikode Railway Station - 80 km",
        "travel_tips": ["Carry good hiking shoes for Edakkal caves", "Spot wild elephants on the forest route from Sultan Bathery"],
        "attractions": [
            {"name": "Banasura Sagar Dam", "category": "Nature", "region_cluster": "west", "latitude": 11.6670, "longitude": 75.9550, "duration_minutes": 100, "entry_fee": 50, "description": "Largest earthen dam in India with islands floating in its reservoir and thrilling speedboating.", "best_time_of_day": "morning"},
            {"name": "Edakkal Caves", "category": "Heritage", "region_cluster": "east", "latitude": 11.6280, "longitude": 76.2360, "duration_minutes": 120, "entry_fee": 50, "description": "Natural rock shelters containing Neolithic petroglyphs dating back to 6,000 BCE.", "best_time_of_day": "morning"}
        ],
        "foods": [
            {"name": "Malabar Chicken Dum Biryani", "food_type": "non-veg", "description": "Khaima rice biryani slow-cooked with ghee, fried onions, cashews, and mild aromatic spices.", "famous_spots": "Wilton Restaurant, Sultan Bathery", "price_range": "₹180 - ₹280"}
        ]
    },

    # 12. Hampi, Karnataka
    {
        "name": "Hampi",
        "state": "Karnataka",
        "tagline": "UNESCO Bouldered Wonder of the Vijayanagara Empire",
        "description": "A surreal landscape of colossal granite boulders intertwined with 14th-century temple ruins, musical pillars, and tranquil coracle boat rides along the Tungabhadra River.",
        "hero_image": "https://images.unsplash.com/photo-1600100397608-f010e42e5b61?auto=format&fit=crop&w=1200&q=80",
        "gallery": ["https://images.unsplash.com/photo-1600100397608-f010e42e5b61?auto=format&fit=crop&w=800&q=80"],
        "budget_min": 10000,
        "budget_max": 23000,
        "ideal_days_min": 3,
        "ideal_days_max": 4,
        "best_months": ["Oct", "Nov", "Dec", "Jan", "Feb"],
        "latitude": 15.3350,
        "longitude": 76.4600,
        "travel_styles": ["Heritage", "Cultural", "Backpacking", "Photography"],
        "interests": ["Temples", "Heritage", "Photography", "Bouldering", "Local Culture"],
        "average_rating": 4.9,
        "climate": "Warm Days, Cool Evenings (18°C - 30°C)",
        "highlights": ["Vijaya Vittala Temple & Stone Chariot", "Virupaksha Temple", "Matanga Hill Sunrise", "Coracle Boat Ride on Tungabhadra"],
        "mood_tags": ["Heritage Trail", "Spiritual Journey", "Adventure Trip"],
        "airport_nearest": "Jindal Vijayanagar Airport (VDY) - 35 km / Hubli - 140 km",
        "railway_nearest": "Hosapete Junction (HPT) - 13 km",
        "travel_tips": ["Rent a bicycle or moped to traverse the sprawling temple complex", "Climb Matanga Hill before dawn for a magical 360-degree sunrise"],
        "attractions": [
            {"name": "Vijaya Vittala Temple & Stone Chariot", "category": "Heritage", "region_cluster": "east", "latitude": 15.3410, "longitude": 76.4760, "duration_minutes": 120, "entry_fee": 40, "description": "Iconic monolithic stone chariot and 56 musical pillars that produce acoustic musical notes when tapped.", "best_time_of_day": "morning"},
            {"name": "Virupaksha Temple & Hampi Bazaar", "category": "Temple", "region_cluster": "central", "latitude": 15.3354, "longitude": 76.4602, "duration_minutes": 90, "entry_fee": 25, "description": "Active 7th-century Shiva shrine with a majestic 160-foot gopuram towering over the historic river bazaar.", "best_time_of_day": "morning"}
        ],
        "foods": [
            {"name": "Karnataka Jolada Roti Oota", "food_type": "veg", "description": "Jowar flatbread served with brinjal yennegai, spicy peanut powder, salad, and buttermilk.", "famous_spots": "Mango Tree Restaurant, Hampi", "price_range": "₹120 - ₹200"}
        ]
    },

    # 13. Srinagar, Jammu & Kashmir
    {
        "name": "Srinagar",
        "state": "Jammu & Kashmir",
        "tagline": "Paradise on Earth, Dal Lake Shikaras & Mughal Gardens",
        "description": "Cradled by snow-crested Himalayan peaks, Srinagar mesmerizes with carved cedar houseboats on Dal Lake, floating vegetable markets, and terraced Mughal fountains.",
        "hero_image": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
        "gallery": ["https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80"],
        "budget_min": 18000,
        "budget_max": 42000,
        "ideal_days_min": 4,
        "ideal_days_max": 6,
        "best_months": ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        "latitude": 34.0837,
        "longitude": 74.7973,
        "travel_styles": ["Romantic", "Nature", "Luxury", "Cultural", "Food"],
        "interests": ["Mountains", "Lakes", "Gardens", "Boating", "Food", "Photography"],
        "average_rating": 4.9,
        "climate": "Chilly Alpine & Sunny (8°C - 22°C)",
        "highlights": ["Dal Lake Shikara Ride at Sunset", "Stay in a Luxury Carved Houseboat", "Nishat & Shalimar Mughal Gardens", "Old City Saffron & Pashmina Bazaars"],
        "mood_tags": ["Mountain Escape", "Romantic Getaway", "Nature Retreat"],
        "airport_nearest": "Sheikh ul-Alam International Airport (SXR)",
        "railway_nearest": "Srinagar / Udhampur",
        "travel_tips": ["Experience a shikara ride at 6:00 AM to see the floating flower and vegetable market", "Sip hot Kahwa with crushed almonds and saffron strands"],
        "attractions": [
            {"name": "Dal Lake Shikara & Floating Market", "category": "Boating", "region_cluster": "central", "latitude": 34.0900, "longitude": 74.8500, "duration_minutes": 120, "entry_fee": 800, "description": "Glide smoothly across lotus gardens on wooden shikaras with kingfishers hovering nearby.", "best_time_of_day": "morning"},
            {"name": "Nishat Bagh (Garden of Bliss)", "category": "Heritage", "region_cluster": "east", "latitude": 34.1250, "longitude": 74.8780, "duration_minutes": 75, "entry_fee": 30, "description": "12-terraced 1633 Mughal garden lined with centuries-old chinar trees stepping down to Dal Lake.", "best_time_of_day": "afternoon"}
        ],
        "foods": [
            {"name": "Kashmiri Rogan Josh with Saffron Rice", "food_type": "non-veg", "description": "Slow-braised tender lamb simmered in Kashmiri red maval flower extract, fennel, and yogurt.", "famous_spots": "Ahdoos & Mughal Darbar, Residency Road", "price_range": "₹380 - ₹550"},
            {"name": "Kashmiri Kahwa with Girda Bread", "food_type": "beverage", "description": "Fragrant green tea brewed with saffron, cinnamon, cloves, cardamom, and sliced almonds.", "famous_spots": "Chai Jaai, The Bund", "price_range": "₹100 - ₹180"}
        ]
    },

    # 14. Shillong, Meghalaya
    {
        "name": "Shillong",
        "state": "Meghalaya",
        "tagline": "Scotland of the East, Rock Music & Living Root Bridges",
        "description": "Surrounded by pine-scented hills, crystal clear rivers, living root bridges, and roaring cascades, the capital of Meghalaya has a vibrant youth culture and breathtaking cloudscapes.",
        "hero_image": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
        "gallery": ["https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"],
        "budget_min": 14000,
        "budget_max": 28000,
        "ideal_days_min": 3,
        "ideal_days_max": 5,
        "best_months": ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
        "latitude": 25.5788,
        "longitude": 91.8933,
        "travel_styles": ["Nature", "Adventure", "Backpacking", "Cultural"],
        "interests": ["Waterfalls", "Living Root Bridges", "Mountains", "Music", "Photography"],
        "average_rating": 4.8,
        "climate": "Crisp, Pleasant & Misty (12°C - 22°C)",
        "highlights": ["Elephant Falls", "Umiam Lake Boating", "Shillong Peak Skyline", "Police Bazar Cafes"],
        "mood_tags": ["Nature Retreat", "Mountain Escape", "Adventure Trip"],
        "airport_nearest": "Umroi Airport (SHL) - 30 km / Guwahati (GAU) - 120 km",
        "railway_nearest": "Guwahati Railway Station - 100 km",
        "travel_tips": ["Combine Shillong with a day trip to Cherrapunji and Dawki's transparent river", "Sample local Khasi pork dishes in Police Bazar"],
        "attractions": [
            {"name": "Elephant Falls", "category": "Nature", "region_cluster": "south", "latitude": 25.5340, "longitude": 91.8250, "duration_minutes": 75, "entry_fee": 30, "description": "Three-tiered mountain waterfall surrounded by fern-draped rocks and walking trails.", "best_time_of_day": "morning"},
            {"name": "Umiam Lake (Barapani)", "category": "Nature", "region_cluster": "north", "latitude": 25.6600, "longitude": 91.9000, "duration_minutes": 90, "entry_fee": 50, "description": "Massive reservoir framed by coniferous forest hills offering kayaking and speedboating.", "best_time_of_day": "afternoon"}
        ],
        "foods": [
            {"name": "Khasi Jadoh with Dohneiiong", "food_type": "non-veg", "description": "Red hill rice cooked in aromatic meat broth, paired with pork curry prepared with black sesame seeds.", "famous_spots": "Trattoria & City Hut Dhaba", "price_range": "₹160 - ₹260"}
        ]
    },

    # 15. Kodaikanal, Tamil Nadu
    {
        "name": "Kodaikanal",
        "state": "Tamil Nadu",
        "tagline": "Princess of Hill Stations, Star-Shaped Lake & Cloud Walks",
        "description": "Set atop the Palani Hills, Kodaikanal features a star-shaped lake, pine forests, Kurinji flowers, and cool mountain weather.",
        "hero_image": "https://images.unsplash.com/photo-1596761226071-9f9397621495?auto=format&fit=crop&w=1200&q=80",
        "gallery": ["https://images.unsplash.com/photo-1596761226071-9f9397621495?auto=format&fit=crop&w=800&q=80"],
        "budget_min": 11000,
        "budget_max": 24000,
        "ideal_days_min": 3,
        "ideal_days_max": 5,
        "best_months": ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"],
        "latitude": 10.2381,
        "longitude": 77.4892,
        "travel_styles": ["Nature", "Relaxed", "Romantic", "Family"],
        "interests": ["Mountains", "Lakes", "Pine Forests", "Waterfalls", "Photography"],
        "average_rating": 4.7,
        "climate": "Pleasantly Chilly (12°C - 21°C)",
        "highlights": ["Kodai Star Lake Boating", "Coaker's Walk Cloud Views", "Pillar Rocks Vistas", "Pine Forest Walks"],
        "mood_tags": ["Mountain Escape", "Romantic Getaway", "Nature Retreat"],
        "airport_nearest": "Madurai Airport (IXM) - 120 km",
        "railway_nearest": "Kodai Road Railway Station - 80 km",
        "travel_tips": ["Cycle along the scenic perimeter of Kodai Lake in the early morning"],
        "attractions": [
            {"name": "Kodaikanal Star Lake & Promenade", "category": "Boating", "region_cluster": "central", "latitude": 10.2340, "longitude": 77.4880, "duration_minutes": 90, "entry_fee": 150, "description": "Manmade star-shaped lake created in 1863, famous for petal boat rides and cycling trails.", "best_time_of_day": "morning"},
            {"name": "Coaker's Walk", "category": "Viewpoint", "region_cluster": "central", "latitude": 10.2310, "longitude": 77.4930, "duration_minutes": 60, "entry_fee": 30, "description": "1 km pedestrian paved pathway winding along steep cliff edges with clouds drifting below.", "best_time_of_day": "evening"}
        ],
        "foods": [
            {"name": "Kodai Homemade Walnut Chocolates & Pastries", "food_type": "sweet", "description": "Creamy mountain chocolates with roasted nuts and hot cinnamon cocoa.", "famous_spots": "Pastry Corner & Cloud Street", "price_range": "₹120 - ₹250"}
        ]
    },

    # 16. Chikmagalur, Karnataka
    {
        "name": "Chikmagalur",
        "state": "Karnataka",
        "tagline": "Birthplace of Indian Coffee & Mullayanagiri Heights",
        "description": "Home to Karnataka's highest peak and the legendary Baba Budan Giri hills where coffee was first planted in India in 1670.",
        "hero_image": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
        "gallery": ["https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80"],
        "budget_min": 12000,
        "budget_max": 26000,
        "ideal_days_min": 3,
        "ideal_days_max": 4,
        "best_months": ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        "latitude": 13.3161,
        "longitude": 75.7720,
        "travel_styles": ["Nature", "Adventure", "Relaxed", "Photography"],
        "interests": ["Mountains", "Coffee Plantations", "Trekking", "Waterfalls"],
        "average_rating": 4.8,
        "climate": "Cool & Aromatic (16°C - 26°C)",
        "highlights": ["Mullayanagiri Peak Trek (highest in Karnataka)", "Baba Budangiri Shrine & Caves", "Hebbe Falls Jeep Safari"],
        "mood_tags": ["Mountain Escape", "Nature Retreat", "Adventure Trip"],
        "airport_nearest": "Mangalore International Airport (IXE) - 150 km",
        "railway_nearest": "Kadur Junction - 40 km",
        "travel_tips": ["Stay at an estate homestay with freshly harvested coffee tastings"],
        "attractions": [
            {"name": "Mullayanagiri Peak Summit", "category": "Trek", "region_cluster": "north", "latitude": 13.3910, "longitude": 75.7210, "duration_minutes": 150, "entry_fee": 0, "description": "Trek or drive up to 1,930m for dramatic views of Western Ghat mist sweeping over valleys.", "best_time_of_day": "morning"}
        ],
        "foods": [
            {"name": "Malnad Akki Roti & Yennegai", "food_type": "veg", "description": "Crispy rice flatbreads kneaded with onions, coriander, and cumin, served with stuffed brinjal gravy.", "famous_spots": "Town Canteen, Chikmagalur", "price_range": "₹90 - ₹150"}
        ]
    },

    # 17. Varkala, Kerala
    {
        "name": "Varkala",
        "state": "Kerala",
        "tagline": "Red Sandstone Cliffs, Arabian Sea Sunsets & Bohemian Vibes",
        "description": "Varkala is famous for its dramatic red cliffs running parallel to the Arabian Sea, natural mineral water springs, yoga schools, and laid-back sunset shacks.",
        "hero_image": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
        "gallery": ["https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"],
        "budget_min": 11000,
        "budget_max": 24000,
        "ideal_days_min": 3,
        "ideal_days_max": 5,
        "best_months": ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        "latitude": 8.7379,
        "longitude": 76.7163,
        "travel_styles": ["Relaxed", "Romantic", "Backpacking", "Nature"],
        "interests": ["Beaches", "Cliffs", "Yoga", "Sunset", "Food"],
        "average_rating": 4.8,
        "climate": "Tropical Coastal Warmth (24°C - 31°C)",
        "highlights": ["Varkala North Cliff Walk", "Papanasam Sacred Beach", "Kappil Lake & Beach Estuary"],
        "mood_tags": ["Beach Holiday", "Romantic Getaway", "Nature Retreat"],
        "airport_nearest": "Trivandrum International Airport (TRV) - 45 km",
        "railway_nearest": "Varkala Sivagiri Railway Station",
        "travel_tips": ["Stroll the North Cliff at sunset for cliffside seafood candlelit dinners"],
        "attractions": [
            {"name": "Varkala North Cliff & Papanasam Beach", "category": "Beach", "region_cluster": "central", "latitude": 8.7350, "longitude": 76.7030, "duration_minutes": 120, "entry_fee": 0, "description": "Unique geological red sandstone cliffs towering over turquoise Arabian Sea waves.", "best_time_of_day": "evening"}
        ],
        "foods": [
            {"name": "Catch-of-the-Day Grilled Tandoori Prawns & Fish", "food_type": "non-veg", "description": "Freshly caught jumbo prawns grilled with lemon garlic butter or fiery masala.", "famous_spots": "Café del Mar & Darjeeling Cafe, North Cliff", "price_range": "₹350 - ₹600"}
        ]
    },

    # 18. Jaisalmer, Rajasthan
    {
        "name": "Jaisalmer",
        "state": "Rajasthan",
        "tagline": "The Golden City & Thar Desert Dune Safaris",
        "description": "Rising out of the Thar Desert like a mirage, Jaisalmer is dominated by a living golden sandstone fort, intricately carved havelis, and desert camel safaris under starlit skies.",
        "hero_image": "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
        "gallery": ["https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"],
        "budget_min": 14000,
        "budget_max": 30000,
        "ideal_days_min": 3,
        "ideal_days_max": 4,
        "best_months": ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        "latitude": 26.9157,
        "longitude": 70.9083,
        "travel_styles": ["Adventure", "Cultural", "Heritage", "Photography"],
        "interests": ["Desert", "Forts", "Camel Safari", "Havelis", "Photography"],
        "average_rating": 4.8,
        "climate": "Desert Warm Days & Cool Nights (10°C - 26°C)",
        "highlights": ["Sonar Qila (Jaisalmer Living Fort)", "Sam Sand Dunes Camel & Jeep Safari", "Patwon Ki Haveli Carvings"],
        "mood_tags": ["Adventure Trip", "Heritage Trail", "Food & Culture"],
        "airport_nearest": "Jaisalmer Airport (JSA)",
        "railway_nearest": "Jaisalmer Railway Station",
        "travel_tips": ["Stay overnight in a luxury desert tent with folk music and Kalbelia dance"],
        "attractions": [
            {"name": "Jaisalmer Golden Fort (Sonar Qila)", "category": "Fort", "region_cluster": "central", "latitude": 26.9124, "longitude": 70.9126, "duration_minutes": 150, "entry_fee": 100, "description": "One of the few living forts in the world, home to 3,000 residents and ornate Jain temples.", "best_time_of_day": "morning"},
            {"name": "Sam Sand Dunes Desert Safari", "category": "Adventure", "region_cluster": "west", "latitude": 26.8320, "longitude": 70.5050, "duration_minutes": 240, "entry_fee": 1200, "description": "Sunset camel trek across wind-swept golden dunes followed by Rajasthani folk music under the stars.", "best_time_of_day": "evening"}
        ],
        "foods": [
            {"name": "Ker Sangri & Bajra Roti", "food_type": "veg", "description": "Authentic desert bean and wild berry dry curry prepared with fiery whole spices and amchur.", "famous_spots": "The Trio & Desert Boy's Dhani", "price_range": "₹200 - ₹350"}
        ]
    },

    # 19. Dharamshala & McLeodGanj, Himachal Pradesh
    {
        "name": "Dharamshala",
        "state": "Himachal Pradesh",
        "tagline": "Little Lhasa, Tibetan Culture & Dhauladhar Treks",
        "description": "Home to His Holiness the Dalai Lama and the Central Tibetan Administration, McLeodGanj combines peaceful monasteries, cedar forests, momo stalls, and the famed Triund trek.",
        "hero_image": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
        "gallery": ["https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80"],
        "budget_min": 12000,
        "budget_max": 26000,
        "ideal_days_min": 3,
        "ideal_days_max": 5,
        "best_months": ["Sep", "Oct", "Nov", "Dec", "Mar", "Apr", "May", "Jun"],
        "latitude": 32.2190,
        "longitude": 76.3234,
        "travel_styles": ["Spiritual", "Nature", "Adventure", "Backpacking"],
        "interests": ["Monasteries", "Mountains", "Trekking", "Tibetan Food", "Yoga"],
        "average_rating": 4.8,
        "climate": "Cool & Mountain Refreshing (10°C - 22°C)",
        "highlights": ["Tsuglagkhang Complex (Dalai Lama Temple)", "Triund Ridge Hike", "Bhagsunag Waterfall & Shiva Cafe", "HPCA Cricket Stadium"],
        "mood_tags": ["Spiritual Journey", "Mountain Escape", "Adventure Trip"],
        "airport_nearest": "Kangra Airport (DHM) - 15 km",
        "railway_nearest": "Pathankot Railway Station - 85 km",
        "travel_tips": ["Spin the prayer wheels clockwise around the Tsuglagkhang temple"],
        "attractions": [
            {"name": "Tsuglagkhang Dalai Lama Temple", "category": "Spiritual", "region_cluster": "central", "latitude": 32.2350, "longitude": 76.3260, "duration_minutes": 90, "entry_fee": 0, "description": "Sacred center of Tibetan Buddhism with chanting monks, golden stupas, and Kalachakra murals.", "best_time_of_day": "morning"},
            {"name": "Triund Ridge Trek", "category": "Trek", "region_cluster": "north", "latitude": 32.2570, "longitude": 76.3530, "duration_minutes": 300, "entry_fee": 0, "description": "Moderate scenic trek reaching an alpine meadow right beneath the sheer snow wall of Dhauladhar.", "best_time_of_day": "morning"}
        ],
        "foods": [
            {"name": "Steamed Tibetan Momos & Thukpa Soup", "food_type": "non-veg", "description": "Handmade dumplings stuffed with chicken/veg served with red chilli dip and hot noodle soup.", "famous_spots": "TibiTente & Jimmy's Italian Kitchen", "price_range": "₹120 - ₹220"}
        ]
    },

    # 20. Gokarna, Karnataka
    {
        "name": "Gokarna",
        "state": "Karnataka",
        "tagline": "Sacred Temples, Secluded Beaches & Coastal Treks",
        "description": "Where rocky Western Ghat cliffs meet pristine Arabian Sea bays, Gokarna offers tranquil alternatives to commercial beaches alongside ancient Mahabaleshwar Shiva traditions.",
        "hero_image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
        "gallery": ["https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"],
        "budget_min": 9000,
        "budget_max": 20000,
        "ideal_days_min": 3,
        "ideal_days_max": 4,
        "best_months": ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        "latitude": 14.5479,
        "longitude": 74.3188,
        "travel_styles": ["Relaxed", "Backpacking", "Nature", "Spiritual"],
        "interests": ["Beaches", "Beach Trekking", "Temples", "Sunset", "Yoga"],
        "average_rating": 4.7,
        "climate": "Warm Coastal Sun (22°C - 31°C)",
        "highlights": ["Om Beach & Half Moon Beach Trek", "Kudle Beach Sunsets", "Mahabaleshwar Temple Atmalingam"],
        "mood_tags": ["Beach Holiday", "Nature Retreat", "Spiritual Journey"],
        "airport_nearest": "Goa Dabolim (GOI) - 140 km",
        "railway_nearest": "Gokarna Road Railway Station - 9 km",
        "travel_tips": ["Do the famous 5-beach cliff trek connecting Kudle, Om, Half Moon, and Paradise Beach"],
        "attractions": [
            {"name": "Om Beach & Coastal Cliff Hike", "category": "Beach", "region_cluster": "central", "latitude": 14.5200, "longitude": 74.3160, "duration_minutes": 150, "entry_fee": 0, "description": "Naturally shaped like the auspicious 'Om' symbol, with golden sands and cliffside cafes.", "best_time_of_day": "morning"}
        ],
        "foods": [
            {"name": "Nutella Banana Pancake & Fresh Seabass", "food_type": "non-veg", "description": "Freshly grilled local catch alongside tropical breakfast bowls right on the sand.", "famous_spots": "Namaste Cafe, Om Beach", "price_range": "₹180 - ₹350"}
        ]
    },

    # Additional 12 Iconic Destinations across India to complete 32 rich seeded destinations:
    # 21. Agra, Uttar Pradesh (Taj Mahal, Agra Fort, Mughlai)
    {
        "name": "Agra",
        "state": "Uttar Pradesh",
        "tagline": "Monument of Eternal Love & Mughal Splendor",
        "description": "Home to the world's greatest monument to love, the Taj Mahal, alongside imposing UNESCO Mughal fortifications.",
        "hero_image": "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
        "gallery": ["https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80"],
        "budget_min": 10000,
        "budget_max": 22000,
        "ideal_days_min": 2,
        "ideal_days_max": 3,
        "best_months": ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        "latitude": 27.1767,
        "longitude": 78.0081,
        "travel_styles": ["Heritage", "Cultural", "Romantic", "Photography"],
        "interests": ["Taj Mahal", "Forts", "Heritage", "Mughal History", "Food"],
        "average_rating": 4.9,
        "climate": "Crisp in Winter (12°C - 25°C)",
        "highlights": ["Taj Mahal Sunrise", "Agra Fort", "Fatehpur Sikri Royal City", "Mehtab Bagh Reflection"],
        "mood_tags": ["Heritage Trail", "Romantic Getaway"],
        "airport_nearest": "Indira Gandhi International Airport (DEL) - 200 km",
        "railway_nearest": "Agra Cantt Railway Station",
        "travel_tips": ["Enter the Taj Mahal at 6:00 AM for soft morning light and minimal crowds"],
        "attractions": [
            {"name": "Taj Mahal", "category": "Heritage", "region_cluster": "central", "latitude": 27.1751, "longitude": 78.0421, "duration_minutes": 150, "entry_fee": 250, "description": "UNESCO World Wonder built in glowing white Makrana marble by Shah Jahan for Mumtaz Mahal.", "best_time_of_day": "morning"}
        ],
        "foods": [
            {"name": "Agra Petha & Bedmi Puri", "food_type": "sweet", "description": "Translucent candied ash gourd sweet flavoured with saffron and rose water, and spicy stuffed puris.", "famous_spots": "Panchi Petha & Deviram Sweets", "price_range": "₹80 - ₹160"}
        ]
    },

    # 22. Darjeeling, West Bengal
    {
        "name": "Darjeeling",
        "state": "West Bengal",
        "tagline": "Champagne of Teas & Kanchenjunga Vistas",
        "description": "Perched at 2,050 meters with golden views of the world's third highest peak Kanchenjunga, British colonial charm, and world-renowned Muscatel black tea estates.",
        "hero_image": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
        "gallery": ["https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"],
        "budget_min": 13000,
        "budget_max": 28000,
        "ideal_days_min": 3,
        "ideal_days_max": 5,
        "best_months": ["Oct", "Nov", "Dec", "Mar", "Apr", "May"],
        "latitude": 27.0410,
        "longitude": 88.2663,
        "travel_styles": ["Nature", "Romantic", "Cultural", "Relaxed"],
        "interests": ["Mountains", "Tea Estates", "Toy Train", "Sunrise", "Photography"],
        "average_rating": 4.8,
        "climate": "Chilly & Mountain Breezy (8°C - 18°C)",
        "highlights": ["Tiger Hill Sunrise on Kanchenjunga", "Darjeeling Himalayan Railway (Toy Train)", "Happy Valley Tea Estate"],
        "mood_tags": ["Mountain Escape", "Romantic Getaway", "Nature Retreat"],
        "airport_nearest": "Bagdogra Airport (IXB) - 70 km",
        "railway_nearest": "New Jalpaiguri (NJP) - 75 km",
        "travel_tips": ["Leave for Tiger Hill at 4:00 AM for the golden first ray illuminating Kanchenjunga"],
        "attractions": [
            {"name": "Tiger Hill Sunrise", "category": "Viewpoint", "region_cluster": "south", "latitude": 27.0000, "longitude": 88.2800, "duration_minutes": 90, "entry_fee": 50, "description": "Witness the Himalayan snow peaks turn from pale mauve to glowing molten gold.", "best_time_of_day": "morning"}
        ],
        "foods": [
            {"name": "Darjeeling First Flush Tea & Momos", "food_type": "veg", "description": "Delicate champagne muscatel tea paired with steaming Tibetan dumplings.", "famous_spots": "Nathmulls Tea Lounge & Glenary's Bakery", "price_range": "₹150 - ₹300"}
        ]
    },

    # 23. Kochi (Cochin), Kerala
    {
        "name": "Kochi",
        "state": "Kerala",
        "tagline": "Queen of the Arabian Sea, Spice Route & Chinese Fishing Nets",
        "description": "A historic trading port where Portuguese, Dutch, British, and Arab influences blend with cantilevered Chinese fishing nets and contemporary art biennales.",
        "hero_image": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80",
        "gallery": ["https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80"],
        "budget_min": 12000,
        "budget_max": 27000,
        "ideal_days_min": 2,
        "ideal_days_max": 4,
        "best_months": ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        "latitude": 9.9312,
        "longitude": 76.2673,
        "travel_styles": ["Cultural", "Heritage", "Food", "Art"],
        "interests": ["Heritage", "Art", "Spice Markets", "Seafood", "History"],
        "average_rating": 4.8,
        "climate": "Tropical Coastal (24°C - 32°C)",
        "highlights": ["Fort Kochi Chinese Fishing Nets", "Mattancherry Jewish Synagogue", "Jew Town Antique & Spice Stalls"],
        "mood_tags": ["Heritage Trail", "Food & Culture", "Beach Holiday"],
        "airport_nearest": "Cochin International Airport (COK) - 30 km",
        "railway_nearest": "Ernakulam Junction (ERS)",
        "travel_tips": ["Rent a cycle around Fort Kochi colonial alleys"],
        "attractions": [
            {"name": "Fort Kochi Chinese Fishing Nets", "category": "Heritage", "region_cluster": "west", "latitude": 9.9670, "longitude": 76.2420, "duration_minutes": 60, "entry_fee": 0, "description": "Iconic fixed cantilevered shore nets introduced by Chinese explorer Zheng He in the 14th century.", "best_time_of_day": "evening"}
        ],
        "foods": [
            {"name": "Kerala Fish Moilee", "food_type": "non-veg", "description": "Seer fish gently simmered in mild coconut milk, green chillies, curry leaves, and ginger.", "famous_spots": "Oceanos Restaurant & Grand Hotel", "price_range": "₹280 - ₹450"}
        ]
    },

    # 24. Shimla, Himachal Pradesh
    {
        "name": "Shimla",
        "state": "Himachal Pradesh",
        "tagline": "Queen of the Hills & Colonial Summer Capital",
        "description": "Lined with neo-gothic architecture, snow-capped vistas, pedestrian-only Mall Road, and historic Kalka-Shimla mountain railway.",
        "hero_image": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
        "gallery": ["https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80"],
        "budget_min": 14000,
        "budget_max": 28000,
        "ideal_days_min": 3,
        "ideal_days_max": 4,
        "best_months": ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"],
        "latitude": 31.1048,
        "longitude": 77.1734,
        "travel_styles": ["Family", "Romantic", "Heritage", "Nature"],
        "interests": ["Mountains", "Colonial Heritage", "Toy Train", "Walks", "Shopping"],
        "average_rating": 4.7,
        "climate": "Crisp Alpine (4°C - 20°C)",
        "highlights": ["The Ridge & Christ Church", "Viceregal Lodge", "Kalka-Shimla Toy Train", "Jakhoo Hill Hanuman Temple"],
        "mood_tags": ["Mountain Escape", "Romantic Getaway", "Heritage Trail"],
        "airport_nearest": "Jubarhati Airport (SLV) - 22 km / Chandigarh - 110 km",
        "railway_nearest": "Shimla Railway Station",
        "travel_tips": ["Stroll Mall Road in the evening when vehicle traffic is strictly barred"],
        "attractions": [
            {"name": "The Ridge & Christ Church", "category": "Heritage", "region_cluster": "central", "latitude": 31.1050, "longitude": 77.1750, "duration_minutes": 90, "entry_fee": 0, "description": "Expansive open pedestrian square with stained-glass neo-gothic church and valley views.", "best_time_of_day": "evening"}
        ],
        "foods": [
            {"name": "Himachali Chana Madra", "food_type": "veg", "description": "Slow-cooked chickpeas in spiced rich yogurt gravy infused with cloves, cardamoms, and dry fruits.", "famous_spots": "Himachali Rasoi, Mall Road", "price_range": "₹160 - ₹240"}
        ]
    },

    # 25. Kasol, Himachal Pradesh
    {
        "name": "Kasol",
        "state": "Himachal Pradesh",
        "tagline": "Mini Israel of Parvati Valley & Bohemian Treks",
        "description": "Set along the gushing Parvati River amidst pine forests, Kasol is famous for café culture, riverside camping, and base for Kheerganga and Tosh treks.",
        "hero_image": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80",
        "gallery": ["https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80"],
        "budget_min": 10000,
        "budget_max": 20000,
        "ideal_days_min": 3,
        "ideal_days_max": 5,
        "best_months": ["Apr", "May", "Jun", "Sep", "Oct", "Nov"],
        "latitude": 32.0100,
        "longitude": 77.3150,
        "travel_styles": ["Backpacking", "Adventure", "Nature", "Relaxed"],
        "interests": ["Trekking", "Mountains", "Rivers", "Cafes", "Music"],
        "average_rating": 4.7,
        "climate": "Chilly Valley (8°C - 20°C)",
        "highlights": ["Parvati River Walks", "Kheerganga Hot Springs Trek", "Tosh Village Day Trip", "Manikaran Sahib Gurudwara"],
        "mood_tags": ["Adventure Trip", "Mountain Escape", "Nature Retreat"],
        "airport_nearest": "Bhuntar Airport (KUU) - 30 km",
        "railway_nearest": "Chandigarh Railway Station - 280 km",
        "travel_tips": ["Pack sturdy hiking boots for the Tosh and Kheerganga trails"],
        "attractions": [
            {"name": "Parvati River Promenade & Chalal Trail", "category": "Nature", "region_cluster": "central", "latitude": 32.0120, "longitude": 77.3180, "duration_minutes": 120, "entry_fee": 0, "description": "Wooden suspension bridge leading into dense coniferous forests beside raging turquoise rapids.", "best_time_of_day": "morning"}
        ],
        "foods": [
            {"name": "Israeli Shakshuka & Fresh Hummus Falafel", "food_type": "veg", "description": "Poached eggs in spiced tomato pepper stew served with warm fluffy pita bread and tahini.", "famous_spots": "Evergreen Cafe & Moon Dance Cafe", "price_range": "₹150 - ₹280"}
        ]
    },

    # 26. Gulmarg, Jammu & Kashmir
    {
        "name": "Gulmarg",
        "state": "Jammu & Kashmir",
        "tagline": "Meadow of Flowers & Asia's Premier Skiing Gondola",
        "description": "Gulmarg boasts the world's second-highest operating cable car (Gondola at 13,780 ft), powdery ski slopes in winter, and wildflower alpine meadows in summer.",
        "hero_image": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
        "gallery": ["https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80"],
        "budget_min": 18000,
        "budget_max": 42000,
        "ideal_days_min": 3,
        "ideal_days_max": 4,
        "best_months": ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        "latitude": 34.0484,
        "longitude": 74.3805,
        "travel_styles": ["Adventure", "Romantic", "Luxury", "Nature"],
        "interests": ["Snow", "Skiing", "Gondola", "Mountains", "Photography"],
        "average_rating": 4.9,
        "climate": "Alpine Snow (-4°C - 15°C)",
        "highlights": ["Gulmarg Gondola Phase 1 & 2 (Kongdoori & Apharwat)", "Powder Skiing & Snowboarding", "St. Mary's Stone Church"],
        "mood_tags": ["Mountain Escape", "Adventure Trip", "Romantic Getaway"],
        "airport_nearest": "Srinagar Airport (SXR) - 55 km",
        "railway_nearest": "Jammu Tawi / Udhampur",
        "travel_tips": ["Book Gondola Phase 2 tickets weeks ahead as they sell out daily online"],
        "attractions": [
            {"name": "Gulmarg Gondola to Apharwat Peak", "category": "Adventure", "region_cluster": "central", "latitude": 34.0500, "longitude": 74.3850, "duration_minutes": 180, "entry_fee": 1800, "description": "Ascend to 13,780 feet overlooking the Line of Control and sweeping Pir Panjal snow ranges.", "best_time_of_day": "morning"}
        ],
        "foods": [
            {"name": "Gushtaba & Kashmiri Pulao", "food_type": "non-veg", "description": "Tender minced mutton meatballs poached in velvety spiced curd gravy served with fruit-garnished rice.", "famous_spots": "Nedous Dining Room & Highlands Park", "price_range": "₹400 - ₹650"}
        ]
    },

    # 27. Mysore (Mysuru), Karnataka
    {
        "name": "Mysore",
        "state": "Karnataka",
        "tagline": "Heritage City of Royal Palaces & Sandalwood",
        "description": "Renowned for the opulent Amba Vilas Palace illuminated by 100,000 lightbulbs, Ashtanga yoga schools, silk sarees, and aromatic sandalwood incense.",
        "hero_image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
        "gallery": ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"],
        "budget_min": 10000,
        "budget_max": 22000,
        "ideal_days_min": 2,
        "ideal_days_max": 3,
        "best_months": ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        "latitude": 12.2958,
        "longitude": 76.6394,
        "travel_styles": ["Heritage", "Cultural", "Family", "Food"],
        "interests": ["Palaces", "Heritage", "Silk", "Food", "Yoga"],
        "average_rating": 4.8,
        "climate": "Pleasant & Sunny (18°C - 29°C)",
        "highlights": ["Mysore Palace Illumination", "Chamundi Hill Temple", "Brindavan Gardens Musical Fountains", "Devaraja Century Market"],
        "mood_tags": ["Heritage Trail", "Food & Culture"],
        "airport_nearest": "Mysore Airport (MYQ) / Bangalore (BLR) - 170 km",
        "railway_nearest": "Mysore Junction (in city center)",
        "travel_tips": ["Witness the Palace illuminated with 100,000 bulbs on Sunday evenings"],
        "attractions": [
            {"name": "Mysore Amba Vilas Palace", "category": "Palace", "region_cluster": "central", "latitude": 12.3051, "longitude": 76.6551, "duration_minutes": 120, "entry_fee": 100, "description": "Indo-Saracenic royal masterpiece with stained-glass domes, solid silver doors, and ornate durbar halls.", "best_time_of_day": "morning"}
        ],
        "foods": [
            {"name": "Mysore Masala Dosa with Ghee", "food_type": "veg", "description": "Crispy golden fermented crepe smeared with fiery red garlic chutney and stuffed with spiced potatoes.", "famous_spots": "Mylari Restaurant, Nazarbad", "price_range": "₹70 - ₹130"},
            {"name": "Original Melt-in-the-Mouth Mysore Pak", "food_type": "sweet", "description": "Warm sweet confectionery made with roasted chickpea flour, sugar syrup, and copious desi ghee.", "famous_spots": "Guru Sweets, Devaraja Market", "price_range": "₹80 - ₹160"}
        ]
    },

    # 28. Madurai, Tamil Nadu
    {
        "name": "Madurai",
        "state": "Tamil Nadu",
        "tagline": "The Athens of the East & Meenakshi Amman Splendor",
        "description": "One of India's oldest continuously inhabited temple cities, built around the stupendous Meenakshi Amman Temple with its 14 towering, rainbow-sculpted gopurams.",
        "hero_image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
        "gallery": ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"],
        "budget_min": 9000,
        "budget_max": 18000,
        "ideal_days_min": 2,
        "ideal_days_max": 3,
        "best_months": ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        "latitude": 9.9252,
        "longitude": 78.1198,
        "travel_styles": ["Spiritual", "Heritage", "Food", "Cultural"],
        "interests": ["Temples", "Architecture", "Street Food", "History"],
        "average_rating": 4.8,
        "climate": "Warm & Tropical (22°C - 33°C)",
        "highlights": ["Meenakshi Amman Temple", "Thirumalai Nayakkar Mahal", "Night Chariot Ceremony", "Midnight Street Food Trail"],
        "mood_tags": ["Spiritual Journey", "Heritage Trail", "Food & Culture"],
        "airport_nearest": "Madurai International Airport (IXM)",
        "railway_nearest": "Madurai Junction (in city center)",
        "travel_tips": ["Wear traditional modest temple attire (shoulders and knees covered)"],
        "attractions": [
            {"name": "Meenakshi Amman Temple", "category": "Temple", "region_cluster": "central", "latitude": 9.9195, "longitude": 78.1193, "duration_minutes": 150, "entry_fee": 0, "description": "A 2,500-year-old architectural marvel featuring 33,000 sculpted figures and the Hall of 1,000 Pillars.", "best_time_of_day": "morning"}
        ],
        "foods": [
            {"name": "Madurai Kari Dosa (Minced Mutton Thick Dosa)", "food_type": "non-veg", "description": "Triple-layered thick pan dosa topped with egg and richly seasoned minced mutton gravy.", "famous_spots": "Konar Mess & Simmakkal", "price_range": "₹160 - ₹260"},
            {"name": "Madurai Famous Jigarthanda", "food_type": "sweet", "description": "Cooling royal drink made of almond gum, chilled condensed milk, nannari syrup, and basundi ice cream.", "famous_spots": "Famous Jigarthanda, East Marret Street", "price_range": "₹60 - ₹120"}
        ]
    },

    # 29. Jodhpur, Rajasthan
    {
        "name": "Jodhpur",
        "state": "Rajasthan",
        "tagline": "The Blue City & Impregnable Mehrangarh Fortress",
        "description": "A sea of indigo-blue cubical houses presided over by Mehrangarh Fort towering on a perpendicular cliff, bustling spice markets, and Marwari delicacies.",
        "hero_image": "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
        "gallery": ["https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"],
        "budget_min": 13000,
        "budget_max": 29000,
        "ideal_days_min": 2,
        "ideal_days_max": 4,
        "best_months": ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        "latitude": 26.2389,
        "longitude": 73.0243,
        "travel_styles": ["Heritage", "Cultural", "Photography", "Food"],
        "interests": ["Forts", "Palaces", "Photography", "Food", "Ziplining"],
        "average_rating": 4.8,
        "climate": "Sunny & Crisp (14°C - 28°C)",
        "highlights": ["Mehrangarh Fort & Museum", "Flying Fox Zipline over Fort Ramparts", "Jaswant Thada White Marble Cenotaph", "Blue City Walking Tour"],
        "mood_tags": ["Heritage Trail", "Food & Culture", "Adventure Trip"],
        "airport_nearest": "Jodhpur Airport (JDH)",
        "railway_nearest": "Jodhpur Junction",
        "travel_tips": ["Try the Flying Fox zipline across the fort moats for an unforgettable thrill"],
        "attractions": [
            {"name": "Mehrangarh Fort", "category": "Fort", "region_cluster": "central", "latitude": 26.2980, "longitude": 73.0188, "duration_minutes": 150, "entry_fee": 100, "description": "Massive 15th-century citadel 400 feet above the city containing palatial courtyards and royal palanquins.", "best_time_of_day": "morning"}
        ],
        "foods": [
            {"name": "Mirchi Bada & Mawa Kachori", "food_type": "veg", "description": "Large green pepper stuffed with spiced potato mash, batter fried crisp in mustard oil.", "famous_spots": "Shahi Samosa & Janta Sweet Home", "price_range": "₹40 - ₹90"}
        ]
    },

    # 30. Cherrapunji (Sohra), Meghalaya
    {
        "name": "Cherrapunji",
        "state": "Meghalaya",
        "tagline": "Land of Living Root Bridges, Clouds & Thundering Waterfalls",
        "description": "One of the wettest places on the planet, featuring emerald gorges, the double decker living root bridge, and Nohkalikai Falls leaping from sandstone plateaus.",
        "hero_image": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
        "gallery": ["https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"],
        "budget_min": 13000,
        "budget_max": 26000,
        "ideal_days_min": 3,
        "ideal_days_max": 4,
        "best_months": ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
        "latitude": 25.2702,
        "longitude": 91.7323,
        "travel_styles": ["Adventure", "Nature", "Backpacking", "Photography"],
        "interests": ["Living Root Bridges", "Waterfalls", "Caves", "Trekking", "Rainforests"],
        "average_rating": 4.9,
        "climate": "Misty, Cool & Crisp (12°C - 20°C)",
        "highlights": ["Double Decker Living Root Bridge (Nongriat)", "Nohkalikai Falls (India's tallest plunge)", "Mawsmai Limestone Caves"],
        "mood_tags": ["Adventure Trip", "Nature Retreat"],
        "airport_nearest": "Guwahati Airport (GAU) - 160 km",
        "railway_nearest": "Guwahati Railway Station",
        "travel_tips": ["Start the 3,500-step Nongriat double root bridge trek early at 7:00 AM"],
        "attractions": [
            {"name": "Double Decker Living Root Bridge Trek", "category": "Adventure", "region_cluster": "south", "latitude": 25.2400, "longitude": 91.6800, "duration_minutes": 240, "entry_fee": 50, "description": "Botanical engineering wonder woven across centuries by Khasi tribes from the aerial roots of rubber trees.", "best_time_of_day": "morning"}
        ],
        "foods": [
            {"name": "Local Sohra Orange Honey & Pukhlein", "food_type": "sweet", "description": "Traditional deep fried rice flour and jaggery bread accompanied by fresh high-altitude forest honey.", "famous_spots": "Cherrapunjee Holiday Resort", "price_range": "₹80 - ₹160"}
        ]
    },

    # 31. Rameswaram, Tamil Nadu
    {
        "name": "Rameswaram",
        "state": "Tamil Nadu",
        "tagline": "Holy Island, Pamban Sea Bridge & Dhanushkodi Ghost Town",
        "description": "Connected to mainland India by the engineering marvel of Pamban Sea Bridge, Rameswaram is sacred for Ramanathaswamy Temple's 22 theerthams and the mystical ghost town of Dhanushkodi.",
        "hero_image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
        "gallery": ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"],
        "budget_min": 10000,
        "budget_max": 21000,
        "ideal_days_min": 2,
        "ideal_days_max": 3,
        "best_months": ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
        "latitude": 9.2876,
        "longitude": 79.3129,
        "travel_styles": ["Spiritual", "Heritage", "Nature", "Photography"],
        "interests": ["Temples", "Sea Bridge", "Ghost Town", "Ocean", "History"],
        "average_rating": 4.7,
        "climate": "Coastal Breeze (24°C - 32°C)",
        "highlights": ["Ramanathaswamy Temple Corridor", "Pamban Cantilever Railway Bridge", "Dhanushkodi Land's End & Ruins"],
        "mood_tags": ["Spiritual Journey", "Heritage Trail"],
        "airport_nearest": "Madurai Airport (IXM) - 170 km",
        "railway_nearest": "Rameswaram Railway Station",
        "travel_tips": ["Take the train across Pamban bridge for views of waves breaking below tracks"],
        "attractions": [
            {"name": "Dhanushkodi Land's End & Submerged Town", "category": "Heritage", "region_cluster": "east", "latitude": 9.1760, "longitude": 79.4180, "duration_minutes": 150, "entry_fee": 0, "description": "Haunting abandoned town where the Bay of Bengal meets the Indian Ocean.", "best_time_of_day": "morning"}
        ],
        "foods": [
            {"name": "Coastal South Indian Seafood & Filter Kaapi", "food_type": "non-veg", "description": "Freshly caught pomfret spiced with Chettinad pepper masala served with steaming rice.", "famous_spots": "Hotel Tamil Nadu & Ram Nivas", "price_range": "₹150 - ₹280"}
        ]
    },

    # 32. Mumbai, Maharashtra
    {
        "name": "Mumbai",
        "state": "Maharashtra",
        "tagline": "City of Dreams, Victorian Gothic & Marine Drive",
        "description": "India's financial and entertainment capital, pulsating with Bollywood glamour, heritage Art Deco promenades, bustling street food stalls, and the Gateway of India.",
        "hero_image": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80",
        "gallery": ["https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80"],
        "budget_min": 16000,
        "budget_max": 40000,
        "ideal_days_min": 3,
        "ideal_days_max": 5,
        "best_months": ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        "latitude": 18.9220,
        "longitude": 72.8347,
        "travel_styles": ["Cultural", "Food", "Nightlife", "Heritage", "Luxury"],
        "interests": ["Heritage", "Street Food", "Beaches", "Architecture", "Shopping"],
        "average_rating": 4.8,
        "climate": "Coastal Warmth & Sea Breeze (20°C - 32°C)",
        "highlights": ["Gateway of India & Taj Mahal Palace Hotel", "Marine Drive Queen's Necklace", "Elephanta Island Rock Caves", "Chhatrapati Shivaji Terminus"],
        "mood_tags": ["Food & Culture", "Heritage Trail", "Beach Holiday"],
        "airport_nearest": "Chhatrapati Shivaji Maharaj International Airport (BOM)",
        "railway_nearest": "CSMT / Mumbai Central",
        "travel_tips": ["Sit along Marine Drive tetrapods during twilight to watch the street lights sparkle"],
        "attractions": [
            {"name": "Gateway of India & Colaba Causeway", "category": "Heritage", "region_cluster": "south", "latitude": 18.9220, "longitude": 72.8347, "duration_minutes": 90, "entry_fee": 0, "description": "Grand basalt archway erected in 1924 overlooking the Arabian Sea, flanked by historic cafes.", "best_time_of_day": "morning"}
        ],
        "foods": [
            {"name": "Mumbai Vada Pav & Pav Bhaji", "food_type": "veg", "description": "Spiced potato fritter in soft pav with dry garlic chutney, and buttery mashed vegetable curry.", "famous_spots": "Sardar Pav Bhaji & Ashok Vada Pav, Dadar", "price_range": "₹30 - ₹120"}
        ]
    }
]

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        print("🌱 Seeding database with destinations, attractions, foods, and demo user...")

        # 1. Create Demo User
        demo_user = db.query(User).filter(User.email == "demo@yatraplan.com").first()
        if not demo_user:
            demo_user = User(
                email="demo@yatraplan.com",
                hashed_password=get_password_hash("yatra12345"),
                full_name="Aarav Sharma",
                home_city="Chennai",
                preferences={
                    "travel_styles": ["Nature", "Adventure"],
                    "interests": ["Mountains", "Food", "Photography"],
                    "budget": "Moderate"
                }
            )
            db.add(demo_user)
            db.commit()
            print("✅ Demo user created: demo@yatraplan.com (password: yatra12345)")

        # 2. Seed Destinations
        for d_data in DESTINATIONS_DATA:
            existing = db.query(Destination).filter(Destination.name == d_data["name"]).first()
            if existing:
                continue

            dest = Destination(
                name=d_data["name"],
                state=d_data["state"],
                tagline=d_data["tagline"],
                description=d_data["description"],
                hero_image=d_data["hero_image"],
                gallery=d_data.get("gallery", []),
                budget_min=d_data["budget_min"],
                budget_max=d_data["budget_max"],
                ideal_days_min=d_data["ideal_days_min"],
                ideal_days_max=d_data["ideal_days_max"],
                best_months=d_data["best_months"],
                latitude=d_data["latitude"],
                longitude=d_data["longitude"],
                travel_styles=d_data["travel_styles"],
                interests=d_data["interests"],
                average_rating=d_data["average_rating"],
                climate=d_data["climate"],
                highlights=d_data["highlights"],
                mood_tags=d_data.get("mood_tags", []),
                airport_nearest=d_data.get("airport_nearest", ""),
                railway_nearest=d_data.get("railway_nearest", ""),
                travel_tips=d_data.get("travel_tips", [])
            )
            db.add(dest)
            db.commit()
            db.refresh(dest)

            # Add Attractions
            for att_data in d_data.get("attractions", []):
                att = Attraction(
                    destination_id=dest.id,
                    name=att_data["name"],
                    category=att_data.get("category", "Sightseeing"),
                    region_cluster=att_data.get("region_cluster", "central"),
                    latitude=att_data.get("latitude", dest.latitude),
                    longitude=att_data.get("longitude", dest.longitude),
                    duration_minutes=att_data.get("duration_minutes", 90),
                    entry_fee=att_data.get("entry_fee", 50),
                    description=att_data.get("description", ""),
                    image_url=att_data.get("image_url", dest.hero_image),
                    best_time_of_day=att_data.get("best_time_of_day", "morning")
                )
                db.add(att)

            # Add Foods
            for f_data in d_data.get("foods", []):
                food = FoodItem(
                    destination_id=dest.id,
                    name=f_data["name"],
                    food_type=f_data.get("food_type", "veg"),
                    description=f_data.get("description", ""),
                    image_url=f_data.get("image_url", dest.hero_image),
                    famous_spots=f_data.get("famous_spots", "Local Eateries"),
                    price_range=f_data.get("price_range", "₹100 - ₹250")
                )
                db.add(food)

            db.commit()

        count = db.query(Destination).count()
        print(f"🎉 Successfully seeded {count} Indian destinations with attractions and food delicacies!")

    except Exception as e:
        try:
            db.rollback()
        except Exception:
            pass
        print(f"⚠️ Notice: Database not reachable or seeding skipped: {e}")
        print("ℹ️ The database will automatically be initialized and seeded once the server starts.")
    finally:
        try:
            db.close()
        except Exception:
            pass

if __name__ == "__main__":
    try:
        seed_database()
    except Exception as e:
        print(f"⚠️ Build-time seed notice: {e}")
    sys.exit(0)
