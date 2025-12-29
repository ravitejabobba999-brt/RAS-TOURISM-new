/**
 * Airport and City Data
 * Maps city names to airport codes for autocomplete
 */

// Make airportsData globally accessible
window.airportsData = [
  // India
  { city: "Delhi", country: "India", code: "DEL", name: "Indira Gandhi International Airport" },
  { city: "Mumbai", country: "India", code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport" },
  { city: "Bangalore", country: "India", code: "BLR", name: "Kempegowda International Airport" },
  { city: "Chennai", country: "India", code: "MAA", name: "Chennai International Airport" },
  { city: "Kolkata", country: "India", code: "CCU", name: "Netaji Subhas Chandra Bose International Airport" },
  { city: "Hyderabad", country: "India", code: "HYD", name: "Rajiv Gandhi International Airport" },
  { city: "Pune", country: "India", code: "PNQ", name: "Pune Airport" },
  { city: "Goa", country: "India", code: "GOI", name: "Goa International Airport" },
  { city: "Jaipur", country: "India", code: "JAI", name: "Jaipur International Airport" },
  { city: "Ahmedabad", country: "India", code: "AMD", name: "Sardar Vallabhbhai Patel International Airport" },
  { city: "Kochi", country: "India", code: "COK", name: "Cochin International Airport" },
  { city: "Lucknow", country: "India", code: "LKO", name: "Chaudhary Charan Singh International Airport" },
  
  // USA
  { city: "New York", country: "USA", code: "JFK", name: "John F. Kennedy International Airport" },
  { city: "New York", country: "USA", code: "LGA", name: "LaGuardia Airport" },
  { city: "Los Angeles", country: "USA", code: "LAX", name: "Los Angeles International Airport" },
  { city: "Chicago", country: "USA", code: "ORD", name: "O'Hare International Airport" },
  { city: "San Francisco", country: "USA", code: "SFO", name: "San Francisco International Airport" },
  { city: "Miami", country: "USA", code: "MIA", name: "Miami International Airport" },
  { city: "Las Vegas", country: "USA", code: "LAS", name: "McCarran International Airport" },
  { city: "Boston", country: "USA", code: "BOS", name: "Logan International Airport" },
  { city: "Seattle", country: "USA", code: "SEA", name: "Seattle-Tacoma International Airport" },
  { city: "Washington", country: "USA", code: "DCA", name: "Ronald Reagan Washington National Airport" },
  { city: "Dallas", country: "USA", code: "DFW", name: "Dallas/Fort Worth International Airport" },
  { city: "Atlanta", country: "USA", code: "ATL", name: "Hartsfield-Jackson Atlanta International Airport" },
  
  // UK
  { city: "London", country: "UK", code: "LHR", name: "London Heathrow Airport" },
  { city: "London", country: "UK", code: "LGW", name: "London Gatwick Airport" },
  { city: "Manchester", country: "UK", code: "MAN", name: "Manchester Airport" },
  { city: "Edinburgh", country: "UK", code: "EDI", name: "Edinburgh Airport" },
  
  // UAE
  { city: "Dubai", country: "UAE", code: "DXB", name: "Dubai International Airport" },
  { city: "Abu Dhabi", country: "UAE", code: "AUH", name: "Abu Dhabi International Airport" },
  
  // Singapore
  { city: "Singapore", country: "Singapore", code: "SIN", name: "Singapore Changi Airport" },
  
  // Thailand
  { city: "Bangkok", country: "Thailand", code: "BKK", name: "Suvarnabhumi Airport" },
  { city: "Phuket", country: "Thailand", code: "HKT", name: "Phuket International Airport" },
  
  // Malaysia
  { city: "Kuala Lumpur", country: "Malaysia", code: "KUL", name: "Kuala Lumpur International Airport" },
  
  // Indonesia
  { city: "Jakarta", country: "Indonesia", code: "CGK", name: "Soekarno-Hatta International Airport" },
  { city: "Bali", country: "Indonesia", code: "DPS", name: "Ngurah Rai International Airport" },
  
  // Australia
  { city: "Sydney", country: "Australia", code: "SYD", name: "Sydney Kingsford Smith Airport" },
  { city: "Melbourne", country: "Australia", code: "MEL", name: "Melbourne Airport" },
  
  // France
  { city: "Paris", country: "France", code: "CDG", name: "Charles de Gaulle Airport" },
  { city: "Paris", country: "France", code: "ORY", name: "Paris Orly Airport" },
  
  // Germany
  { city: "Frankfurt", country: "Germany", code: "FRA", name: "Frankfurt Airport" },
  { city: "Munich", country: "Germany", code: "MUC", name: "Munich Airport" },
  
  // Japan
  { city: "Tokyo", country: "Japan", code: "NRT", name: "Narita International Airport" },
  { city: "Tokyo", country: "Japan", code: "HND", name: "Haneda Airport" },
  { city: "Osaka", country: "Japan", code: "KIX", name: "Kansai International Airport" },
  
  // China
  { city: "Beijing", country: "China", code: "PEK", name: "Beijing Capital International Airport" },
  { city: "Shanghai", country: "China", code: "PVG", name: "Shanghai Pudong International Airport" },
  { city: "Hong Kong", country: "China", code: "HKG", name: "Hong Kong International Airport" },
  
  // Canada
  { city: "Toronto", country: "Canada", code: "YYZ", name: "Toronto Pearson International Airport" },
  { city: "Vancouver", country: "Canada", code: "YVR", name: "Vancouver International Airport" },
  
  // South Korea
  { city: "Seoul", country: "South Korea", code: "ICN", name: "Incheon International Airport" },
  
  // Turkey
  { city: "Istanbul", country: "Turkey", code: "IST", name: "Istanbul Airport" },
  
  // Spain
  { city: "Madrid", country: "Spain", code: "MAD", name: "Adolfo Suárez Madrid-Barajas Airport" },
  { city: "Barcelona", country: "Spain", code: "BCN", name: "Barcelona-El Prat Airport" },
  
  // Italy
  { city: "Rome", country: "Italy", code: "FCO", name: "Leonardo da Vinci-Fiumicino Airport" },
  { city: "Milan", country: "Italy", code: "MXP", name: "Milan Malpensa Airport" },
  
  // Netherlands
  { city: "Amsterdam", country: "Netherlands", code: "AMS", name: "Amsterdam Airport Schiphol" },
  
  // Switzerland
  { city: "Zurich", country: "Switzerland", code: "ZRH", name: "Zurich Airport" },
  
  // Qatar
  { city: "Doha", country: "Qatar", code: "DOH", name: "Hamad International Airport" },
  
  // Saudi Arabia
  { city: "Riyadh", country: "Saudi Arabia", code: "RUH", name: "King Khalid International Airport" },
  { city: "Jeddah", country: "Saudi Arabia", code: "JED", name: "King Abdulaziz International Airport" },
  
  // Sri Lanka
  { city: "Colombo", country: "Sri Lanka", code: "CMB", name: "Bandaranaike International Airport" },
  
  // Nepal
  { city: "Kathmandu", country: "Nepal", code: "KTM", name: "Tribhuvan International Airport" },
  
  // Bangladesh
  { city: "Dhaka", country: "Bangladesh", code: "DAC", name: "Hazrat Shahjalal International Airport" },
  
  // Maldives
  { city: "Male", country: "Maldives", code: "MLE", name: "Velana International Airport" },
  { city: "Maldives", country: "Maldives", code: "MLE", name: "Velana International Airport" },
  
  // Bhutan
  { city: "Paro", country: "Bhutan", code: "PBH", name: "Paro Airport" },
  { city: "Thimphu", country: "Bhutan", code: "PBH", name: "Paro Airport" },
  
  // Vietnam
  { city: "Ho Chi Minh City", country: "Vietnam", code: "SGN", name: "Tan Son Nhat International Airport" },
  { city: "Hanoi", country: "Vietnam", code: "HAN", name: "Noi Bai International Airport" },
  { city: "Da Nang", country: "Vietnam", code: "DAD", name: "Da Nang International Airport" },
  
  // Azerbaijan
  { city: "Baku", country: "Azerbaijan", code: "GYD", name: "Heydar Aliyev International Airport" },
  
  // Kazakhstan
  { city: "Almaty", country: "Kazakhstan", code: "ALA", name: "Almaty International Airport" },
  { city: "Astana", country: "Kazakhstan", code: "NQZ", name: "Nursultan Nazarbayev International Airport" },
  { city: "Nur-Sultan", country: "Kazakhstan", code: "NQZ", name: "Nursultan Nazarbayev International Airport" },
  
  // Uzbekistan
  { city: "Tashkent", country: "Uzbekistan", code: "TAS", name: "Tashkent International Airport" },
  { city: "Samarkand", country: "Uzbekistan", code: "SKD", name: "Samarkand International Airport" },
  
  // Greece
  { city: "Athens", country: "Greece", code: "ATH", name: "Athens International Airport" },
  { city: "Santorini", country: "Greece", code: "JTR", name: "Santorini (Thira) National Airport" },
  { city: "Mykonos", country: "Greece", code: "JMK", name: "Mykonos Island National Airport" },
  
  // Egypt
  { city: "Cairo", country: "Egypt", code: "CAI", name: "Cairo International Airport" },
  { city: "Luxor", country: "Egypt", code: "LXR", name: "Luxor International Airport" },
  
  // Cambodia
  { city: "Phnom Penh", country: "Cambodia", code: "PNH", name: "Phnom Penh International Airport" },
  { city: "Siem Reap", country: "Cambodia", code: "REP", name: "Siem Reap International Airport" },
  { city: "Kambodia", country: "Cambodia", code: "PNH", name: "Phnom Penh International Airport" },
  
  // Peru
  { city: "Lima", country: "Peru", code: "LIM", name: "Jorge Chávez International Airport" },
  { city: "Cusco", country: "Peru", code: "CUZ", name: "Alejandro Velasco Astete International Airport" },
  
  // Caribbean - Major destinations
  { city: "Barbados", country: "Barbados", code: "BGI", name: "Grantley Adams International Airport" },
  { city: "Jamaica", country: "Jamaica", code: "MBJ", name: "Sangster International Airport" },
  { city: "Aruba", country: "Aruba", code: "AUA", name: "Queen Beatrix International Airport" },
  { city: "Bahamas", country: "Bahamas", code: "NAS", name: "Lynden Pindling International Airport" },
  
  // India - Additional cities from tours
  { city: "Agra", country: "India", code: "AGR", name: "Agra Airport" },
  { city: "Manali", country: "India", code: "KUU", name: "Kullu-Manali Airport" },
  { city: "Kullu", country: "India", code: "KUU", name: "Kullu-Manali Airport" },
  { city: "Srinagar", country: "India", code: "SXR", name: "Srinagar International Airport" },
  { city: "Kashmir", country: "India", code: "SXR", name: "Srinagar International Airport" },
  { city: "Kerala", country: "India", code: "COK", name: "Cochin International Airport" },
  { city: "Kochi", country: "India", code: "COK", name: "Cochin International Airport" },
  { city: "Trivandrum", country: "India", code: "TRV", name: "Trivandrum International Airport" },
  { city: "Port Blair", country: "India", code: "IXZ", name: "Veer Savarkar International Airport" },
  { city: "Andaman", country: "India", code: "IXZ", name: "Veer Savarkar International Airport" },
  
  // Thailand - Additional cities
  { city: "Pattaya", country: "Thailand", code: "UTP", name: "U-Tapao International Airport" },
  { city: "Krabi", country: "Thailand", code: "KBV", name: "Krabi International Airport" },
  { city: "Chiang Mai", country: "Thailand", code: "CNX", name: "Chiang Mai International Airport" },
  
  // Malaysia - Additional cities
  { city: "Langkawi", country: "Malaysia", code: "LGK", name: "Langkawi International Airport" },
  { city: "Penang", country: "Malaysia", code: "PEN", name: "Penang International Airport" },
  
  // Turkey - Additional cities
  { city: "Ankara", country: "Turkey", code: "ESB", name: "Esenboğa International Airport" },
  { city: "Antalya", country: "Turkey", code: "AYT", name: "Antalya Airport" },
  { city: "Cappadocia", country: "Turkey", code: "NAV", name: "Nevşehir Kapadokya Airport" },
  
  // Europe - Additional cities
  { city: "Prague", country: "Czech Republic", code: "PRG", name: "Václav Havel Airport Prague" },
  { city: "Vienna", country: "Austria", code: "VIE", name: "Vienna International Airport" },
  { city: "Brussels", country: "Belgium", code: "BRU", name: "Brussels Airport" },
  { city: "Copenhagen", country: "Denmark", code: "CPH", name: "Copenhagen Airport" },
  { city: "Stockholm", country: "Sweden", code: "ARN", name: "Stockholm Arlanda Airport" },
  { city: "Oslo", country: "Norway", code: "OSL", name: "Oslo Airport" },
  { city: "Dublin", country: "Ireland", code: "DUB", name: "Dublin Airport" },
  { city: "Lisbon", country: "Portugal", code: "LIS", name: "Lisbon Airport" },
  
  // Additional popular destinations
  { city: "Bali", country: "Indonesia", code: "DPS", name: "Ngurah Rai International Airport" },
  { city: "Denpasar", country: "Indonesia", code: "DPS", name: "Ngurah Rai International Airport" }
];

// Function to search airports by city name
function searchAirports(query) {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  return airportsData.filter(airport => 
    airport.city.toLowerCase().includes(lowerQuery) ||
    airport.name.toLowerCase().includes(lowerQuery) ||
    airport.code.toLowerCase().includes(lowerQuery)
  );
}

