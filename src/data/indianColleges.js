// Comprehensive dataset of top Indian Colleges and Universities
export const INDIAN_COLLEGES = [
  // --- Indian Institutes of Technology (IITs) ---
  { name: "Indian Institute of Technology (IIT) Bombay", short: "IIT Bombay", city: "Mumbai", state: "Maharashtra", category: "IIT" },
  { name: "Indian Institute of Technology (IIT) Delhi", short: "IIT Delhi", city: "New Delhi", state: "Delhi", category: "IIT" },
  { name: "Indian Institute of Technology (IIT) Madras", short: "IIT Madras", city: "Chennai", state: "Tamil Nadu", category: "IIT" },
  { name: "Indian Institute of Technology (IIT) Kanpur", short: "IIT Kanpur", city: "Kanpur", state: "Uttar Pradesh", category: "IIT" },
  { name: "Indian Institute of Technology (IIT) Kharagpur", short: "IIT Kharagpur", city: "Kharagpur", state: "West Bengal", category: "IIT" },
  { name: "Indian Institute of Technology (IIT) Roorkee", short: "IIT Roorkee", city: "Roorkee", state: "Uttarakhand", category: "IIT" },
  { name: "Indian Institute of Technology (IIT) Guwahati", short: "IIT Guwahati", city: "Guwahati", state: "Assam", category: "IIT" },
  { name: "Indian Institute of Technology (IIT) BHU Varanasi", short: "IIT BHU", city: "Varanasi", state: "Uttar Pradesh", category: "IIT" },
  { name: "Indian Institute of Technology (IIT) Hyderabad", short: "IIT Hyderabad", city: "Hyderabad", state: "Telangana", category: "IIT" },
  { name: "Indian Institute of Technology (IIT) Indore", short: "IIT Indore", city: "Indore", state: "Madhya Pradesh", category: "IIT" },
  { name: "Indian Institute of Technology (IIT) Gandhinagar", short: "IIT Gandhinagar", city: "Gandhinagar", state: "Gujarat", category: "IIT" },
  { name: "Indian Institute of Technology (IIT) Ropar", short: "IIT Ropar", city: "Rupnagar", state: "Punjab", category: "IIT" },
  { name: "Indian Institute of Technology (IIT) Patna", short: "IIT Patna", city: "Patna", state: "Bihar", category: "IIT" },
  { name: "Indian Institute of Technology (IIT) Bhubaneswar", short: "IIT Bhubaneswar", city: "Bhubaneswar", state: "Odisha", category: "IIT" },
  { name: "Indian Institute of Technology (IIT) Mandi", short: "IIT Mandi", city: "Mandi", state: "Himachal Pradesh", category: "IIT" },
  { name: "Indian Institute of Technology (IIT) Jodhpur", short: "IIT Jodhpur", city: "Jodhpur", state: "Rajasthan", category: "IIT" },
  { name: "Indian Institute of Technology (IIT) Tirupati", short: "IIT Tirupati", city: "Tirupati", state: "Andhra Pradesh", category: "IIT" },
  { name: "Indian Institute of Technology (IIT) Palakkad", short: "IIT Palakkad", city: "Palakkad", state: "Kerala", category: "IIT" },
  { name: "Indian Institute of Technology (IIT) Goa", short: "IIT Goa", city: "Farmagudi", state: "Goa", category: "IIT" },
  { name: "Indian Institute of Technology (IIT) Dharwad", short: "IIT Dharwad", city: "Dharwad", state: "Karnataka", category: "IIT" },
  { name: "Indian Institute of Technology (IIT) Bhilai", short: "IIT Bhilai", city: "Bhilai", state: "Chhattisgarh", category: "IIT" },
  { name: "Indian Institute of Technology (IIT) Jammu", short: "IIT Jammu", city: "Jammu", state: "Jammu and Kashmir", category: "IIT" },
  { name: "Indian Institute of Technology (ISM) Dhanbad", short: "IIT Dhanbad", city: "Dhanbad", state: "Jharkhand", category: "IIT" },

  // --- National Institutes of Technology (NITs) ---
  { name: "National Institute of Technology (NIT) Tiruchirappalli (NIT Trichy)", short: "NIT Trichy", city: "Tiruchirappalli", state: "Tamil Nadu", category: "NIT" },
  { name: "National Institute of Technology Karnataka (NITK) Surathkal", short: "NIT Surathkal", city: "Mangalore", state: "Karnataka", category: "NIT" },
  { name: "National Institute of Technology (NIT) Rourkela", short: "NIT Rourkela", city: "Rourkela", state: "Odisha", category: "NIT" },
  { name: "National Institute of Technology (NIT) Warangal", short: "NIT Warangal", city: "Warangal", state: "Telangana", category: "NIT" },
  { name: "National Institute of Technology (NIT) Calicut", short: "NIT Calicut", city: "Kozhikode", state: "Kerala", category: "NIT" },
  { name: "Visvesvaraya National Institute of Technology (VNIT) Nagpur", short: "VNIT Nagpur", city: "Nagpur", state: "Maharashtra", category: "NIT" },
  { name: "Malaviya National Institute of Technology (MNIT) Jaipur", short: "MNIT Jaipur", city: "Jaipur", state: "Rajasthan", category: "NIT" },
  { name: "Motilal Nehru National Institute of Technology (MNNIT) Allahabad", short: "MNNIT Allahabad", city: "Prayagraj", state: "Uttar Pradesh", category: "NIT" },
  { name: "National Institute of Technology (NIT) Kurukshetra", short: "NIT Kurukshetra", city: "Kurukshetra", state: "Haryana", category: "NIT" },
  { name: "National Institute of Technology (NIT) Durgapur", short: "NIT Durgapur", city: "Durgapur", state: "West Bengal", category: "NIT" },
  { name: "National Institute of Technology (NIT) Silchar", short: "NIT Silchar", city: "Silchar", state: "Assam", category: "NIT" },
  { name: "Maulana Azad National Institute of Technology (MANIT) Bhopal", short: "MANIT Bhopal", city: "Bhopal", state: "Madhya Pradesh", category: "NIT" },
  { name: "Sardar Vallabhbhai National Institute of Technology (SVNIT) Surat", short: "SVNIT Surat", city: "Surat", state: "Gujarat", category: "NIT" },
  { name: "Dr. B. R. Ambedkar National Institute of Technology (NIT) Jalandhar", short: "NIT Jalandhar", city: "Jalandhar", state: "Punjab", category: "NIT" },
  { name: "National Institute of Technology (NIT) Meghalaya", short: "NIT Meghalaya", city: "Shillong", state: "Meghalaya", category: "NIT" },
  { name: "National Institute of Technology (NIT) Raipur", short: "NIT Raipur", city: "Raipur", state: "Chhattisgarh", category: "NIT" },
  { name: "National Institute of Technology (NIT) Patna", short: "NIT Patna", city: "Patna", state: "Bihar", category: "NIT" },
  { name: "National Institute of Technology (NIT) Goa", short: "NIT Goa", city: "Ponda", state: "Goa", category: "NIT" },
  { name: "National Institute of Technology (NIT) Jamshedpur", short: "NIT Jamshedpur", city: "Jamshedpur", state: "Jharkhand", category: "NIT" },
  { name: "National Institute of Technology (NIT) Hamirpur", short: "NIT Hamirpur", city: "Hamirpur", state: "Himachal Pradesh", category: "NIT" },
  { name: "Indian Institute of Engineering Science and Technology (IIEST) Shibpur", short: "IIEST Shibpur", city: "Howrah", state: "West Bengal", category: "NIT" },
  { name: "National Institute of Technology (NIT) Delhi", short: "NIT Delhi", city: "New Delhi", state: "Delhi", category: "NIT" },
  { name: "National Institute of Technology (NIT) Andhra Pradesh", short: "NIT Andhra", city: "Tadepalligudem", state: "Andhra Pradesh", category: "NIT" },
  { name: "National Institute of Technology (NIT) Puducherry", short: "NIT Puducherry", city: "Karaikal", state: "Puducherry", category: "NIT" },
  { name: "National Institute of Technology (NIT) Uttarakhand", short: "NIT Uttarakhand", city: "Srinagar", state: "Uttarakhand", category: "NIT" },

  // --- Indian Institutes of Information Technology (IIITs) ---
  { name: "International Institute of Information Technology (IIIT) Hyderabad", short: "IIIT Hyderabad", city: "Hyderabad", state: "Telangana", category: "IIIT" },
  { name: "International Institute of Information Technology (IIIT) Bangalore", short: "IIIT Bangalore", city: "Bengaluru", state: "Karnataka", category: "IIIT" },
  { name: "Indraprastha Institute of Information Technology (IIIT) Delhi", short: "IIIT Delhi", city: "New Delhi", state: "Delhi", category: "IIIT" },
  { name: "Indian Institute of Information Technology (IIIT) Allahabad", short: "IIIT Allahabad", city: "Prayagraj", state: "Uttar Pradesh", category: "IIIT" },
  { name: "Indian Institute of Information Technology (IIIT) Gwalior (ABV-IIITM)", short: "IIIT Gwalior", city: "Gwalior", state: "Madhya Pradesh", category: "IIIT" },
  { name: "Indian Institute of Information Technology (IIIT) Jabalpur", short: "IIIT Jabalpur", city: "Jabalpur", state: "Madhya Pradesh", category: "IIIT" },
  { name: "Indian Institute of Information Technology (IIIT) Kancheepuram", short: "IIIT Kancheepuram", city: "Chennai", state: "Tamil Nadu", category: "IIIT" },
  { name: "Indian Institute of Information Technology (IIIT) Lucknow", short: "IIIT Lucknow", city: "Lucknow", state: "Uttar Pradesh", category: "IIIT" },
  { name: "Indian Institute of Information Technology (IIIT) Pune", short: "IIIT Pune", city: "Pune", state: "Maharashtra", category: "IIIT" },
  { name: "Indian Institute of Information Technology (IIIT) Kota", short: "IIIT Kota", city: "Kota", state: "Rajasthan", category: "IIIT" },
  { name: "Indian Institute of Information Technology (IIIT) Sri City", short: "IIIT Sri City", city: "Chittoor", state: "Andhra Pradesh", category: "IIIT" },
  { name: "Indian Institute of Information Technology (IIIT) Vadodara", short: "IIIT Vadodara", city: "Gandhinagar", state: "Gujarat", category: "IIIT" },
  { name: "Indian Institute of Information Technology (IIIT) Guwahati", short: "IIIT Guwahati", city: "Guwahati", state: "Assam", category: "IIIT" },
  { name: "Indian Institute of Information Technology (IIIT) Kalyani", short: "IIIT Kalyani", city: "Kalyani", state: "West Bengal", category: "IIIT" },
  { name: "Indian Institute of Information Technology (IIIT) Sonepat", short: "IIIT Sonepat", city: "Sonepat", state: "Haryana", category: "IIIT" },

  // --- BITS Pilani & Premier Institutes ---
  { name: "Birla Institute of Technology and Science (BITS Pilani) - Pilani Campus", short: "BITS Pilani", city: "Pilani", state: "Rajasthan", category: "Premier" },
  { name: "Birla Institute of Technology and Science (BITS Pilani) - K. K. Birla Goa Campus", short: "BITS Goa", city: "Zuarinagar", state: "Goa", category: "Premier" },
  { name: "Birla Institute of Technology and Science (BITS Pilani) - Hyderabad Campus", short: "BITS Hyderabad", city: "Hyderabad", state: "Telangana", category: "Premier" },
  { name: "Indian Institute of Science (IISc) Bangalore", short: "IISc Bangalore", city: "Bengaluru", state: "Karnataka", category: "Premier" },
  { name: "Delhi Technological University (DTU), Delhi", short: "DTU Delhi", city: "New Delhi", state: "Delhi", category: "Premier" },
  { name: "Netaji Subhas University of Technology (NSUT), Delhi", short: "NSUT Delhi", city: "New Delhi", state: "Delhi", category: "Premier" },
  { name: "Indira Gandhi Delhi Technical University for Women (IGDTUW)", short: "IGDTUW Delhi", city: "New Delhi", state: "Delhi", category: "Premier" },

  // --- West Bengal Top Colleges ---
  { name: "Jadavpur University (JU), Faculty of Engineering", short: "Jadavpur University", city: "Kolkata", state: "West Bengal", category: "State Govt" },
  { name: "University of Calcutta (CU), Rajabazar Science College", short: "Calcutta University", city: "Kolkata", state: "West Bengal", category: "State Govt" },
  { name: "St. Xavier's College (Autonomous), Kolkata", short: "St. Xavier's Kolkata", city: "Kolkata", state: "West Bengal", category: "Premier" },
  { name: "Presidency University, Kolkata", short: "Presidency University", city: "Kolkata", state: "West Bengal", category: "State Govt" },
  { name: "Institute of Engineering and Management (IEM), Kolkata", short: "IEM Kolkata", city: "Kolkata", state: "West Bengal", category: "Private" },
  { name: "Heritage Institute of Technology (HIT), Kolkata", short: "Heritage Kolkata", city: "Kolkata", state: "West Bengal", category: "Private" },
  { name: "Techno Main Salt Lake (TMSL), Kolkata", short: "Techno Main", city: "Kolkata", state: "West Bengal", category: "Private" },
  { name: "Kalyani Government Engineering College (KGEC)", short: "KGEC Kalyani", city: "Kalyani", state: "West Bengal", category: "State Govt" },
  { name: "Jalpaiguri Government Engineering College (JGEC)", short: "JGEC Jalpaiguri", city: "Jalpaiguri", state: "West Bengal", category: "State Govt" },
  { name: "Government College of Engineering and Leather Technology (GCELT)", short: "GCELT Kolkata", city: "Kolkata", state: "West Bengal", category: "State Govt" },
  { name: "Government College of Engineering and Ceramic Technology (GCECT)", short: "GCECT Kolkata", city: "Kolkata", state: "West Bengal", category: "State Govt" },
  { name: "RCC Institute of Information Technology (RCCIIT)", short: "RCCIIT Kolkata", city: "Kolkata", state: "West Bengal", category: "State Govt" },
  { name: "Haldia Institute of Technology (HIT)", short: "HIT Haldia", city: "Haldia", state: "West Bengal", category: "Private" },
  { name: "Netaji Subhash Engineering College (NSEC)", short: "NSEC Kolkata", city: "Kolkata", state: "West Bengal", category: "Private" },
  { name: "Meghnad Saha Institute of Technology (MSIT)", short: "MSIT Kolkata", city: "Kolkata", state: "West Bengal", category: "Private" },

  // --- Maharashtra Top Colleges ---
  { name: "College of Engineering Pune (COEP Technological University)", short: "COEP Pune", city: "Pune", state: "Maharashtra", category: "State Govt" },
  { name: "Veermata Jijabai Technological Institute (VJTI), Mumbai", short: "VJTI Mumbai", city: "Mumbai", state: "Maharashtra", category: "State Govt" },
  { name: "Pune Institute of Computer Technology (PICT), Pune", short: "PICT Pune", city: "Pune", state: "Maharashtra", category: "Private" },
  { name: "Sardar Patel Institute of Technology (SPIT), Mumbai", short: "SPIT Mumbai", city: "Mumbai", state: "Maharashtra", category: "Private" },
  { name: "Institute of Chemical Technology (ICT), Mumbai", short: "ICT Mumbai", city: "Mumbai", state: "Maharashtra", category: "State Govt" },
  { name: "Walchand College of Engineering, Sangli", short: "WCE Sangli", city: "Sangli", state: "Maharashtra", category: "Govt-Aided" },
  { name: "Vishwakarma Institute of Technology (VIT), Pune", short: "VIT Pune", city: "Pune", state: "Maharashtra", category: "Private" },
  { name: "Cummins College of Engineering for Women, Pune", short: "Cummins Pune", city: "Pune", state: "Maharashtra", category: "Private" },
  { name: "K. J. Somaiya College of Engineering, Mumbai", short: "Somaiya Mumbai", city: "Mumbai", state: "Maharashtra", category: "Private" },
  { name: "D. J. Sanghvi College of Engineering (DJSCE), Mumbai", short: "DJSCE Mumbai", city: "Mumbai", state: "Maharashtra", category: "Private" },
  { name: "Army Institute of Technology (AIT), Pune", short: "AIT Pune", city: "Pune", state: "Maharashtra", category: "Private" },
  { name: "MIT World Peace University (MIT-WPU), Pune", short: "MIT-WPU Pune", city: "Pune", state: "Maharashtra", category: "Private" },
  { name: "Symbiosis Institute of Technology (SIT), Pune", short: "Symbiosis Pune", city: "Pune", state: "Maharashtra", category: "Private" },

  // --- Karnataka Top Colleges ---
  { name: "RV College of Engineering (RVCE), Bengaluru", short: "RVCE Bangalore", city: "Bengaluru", state: "Karnataka", category: "Private" },
  { name: "BMS College of Engineering (BMSCE), Bengaluru", short: "BMSCE Bangalore", city: "Bengaluru", state: "Karnataka", category: "Govt-Aided" },
  { name: "M. S. Ramaiah Institute of Technology (MSRIT), Bengaluru", short: "Ramaiah Bangalore", city: "Bengaluru", state: "Karnataka", category: "Private" },
  { name: "PES University (Ring Road Campus), Bengaluru", short: "PES University", city: "Bengaluru", state: "Karnataka", category: "Private" },
  { name: "Dayananda Sagar College of Engineering (DSCE), Bengaluru", short: "DSCE Bangalore", city: "Bengaluru", state: "Karnataka", category: "Private" },
  { name: "BMS Institute of Technology and Management (BMSIT), Bengaluru", short: "BMSIT Bangalore", city: "Bengaluru", state: "Karnataka", category: "Private" },
  { name: "Bangalore Institute of Technology (BIT), Bengaluru", short: "BIT Bangalore", city: "Bengaluru", state: "Karnataka", category: "Private" },
  { name: "Sir M. Visvesvaraya Institute of Technology (SMVIT), Bengaluru", short: "SMVIT Bangalore", city: "Bengaluru", state: "Karnataka", category: "Private" },
  { name: "The National Institute of Engineering (NIE), Mysuru", short: "NIE Mysore", city: "Mysuru", state: "Karnataka", category: "Govt-Aided" },
  { name: "Siddaganga Institute of Technology (SIT), Tumkur", short: "SIT Tumkur", city: "Tumkur", state: "Karnataka", category: "Private" },
  { name: "Manipal Institute of Technology (MAHE), Manipal", short: "MIT Manipal", city: "Manipal", state: "Karnataka", category: "Private" },

  // --- Tamil Nadu Top Colleges ---
  { name: "College of Engineering, Guindy (Anna University), Chennai", short: "CEG Anna University", city: "Chennai", state: "Tamil Nadu", category: "State Govt" },
  { name: "Madras Institute of Technology (MIT Campus, Anna University)", short: "MIT Anna Univ", city: "Chennai", state: "Tamil Nadu", category: "State Govt" },
  { name: "PSG College of Technology, Coimbatore", short: "PSG Tech", city: "Coimbatore", state: "Tamil Nadu", category: "Govt-Aided" },
  { name: "Sri Sivasubramaniya Nadar (SSN) College of Engineering, Chennai", short: "SSN Chennai", city: "Chennai", state: "Tamil Nadu", category: "Private" },
  { name: "Vellore Institute of Technology (VIT), Vellore", short: "VIT Vellore", city: "Vellore", state: "Tamil Nadu", category: "Private" },
  { name: "Vellore Institute of Technology (VIT), Chennai", short: "VIT Chennai", city: "Chennai", state: "Tamil Nadu", category: "Private" },
  { name: "SRM Institute of Science and Technology, Kattankulathur", short: "SRM KTR", city: "Chennai", state: "Tamil Nadu", category: "Private" },
  { name: "Coimbatore Institute of Technology (CIT), Coimbatore", short: "CIT Coimbatore", city: "Coimbatore", state: "Tamil Nadu", category: "Govt-Aided" },
  { name: "Thiagarajar College of Engineering (TCE), Madurai", short: "TCE Madurai", city: "Madurai", state: "Tamil Nadu", category: "Govt-Aided" },
  { name: "Government College of Technology (GCT), Coimbatore", short: "GCT Coimbatore", city: "Coimbatore", state: "Tamil Nadu", category: "State Govt" },
  { name: "Kumaraguru College of Technology (KCT), Coimbatore", short: "KCT Coimbatore", city: "Coimbatore", state: "Tamil Nadu", category: "Private" },
  { name: "SASTRA Deemed University, Thanjavur", short: "SASTRA University", city: "Thanjavur", state: "Tamil Nadu", category: "Private" },
  { name: "Amrita Vishwa Vidyapeetham, Coimbatore", short: "Amrita University", city: "Coimbatore", state: "Tamil Nadu", category: "Private" },

  // --- Telangana & Andhra Pradesh Top Colleges ---
  { name: "Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad", short: "CBIT Hyderabad", city: "Hyderabad", state: "Telangana", category: "Private" },
  { name: "Vasavi College of Engineering, Hyderabad", short: "Vasavi Hyderabad", city: "Hyderabad", state: "Telangana", category: "Private" },
  { name: "VNR Vignana Jyothi Institute of Engineering and Technology (VNR VJIET)", short: "VNR VJIET", city: "Hyderabad", state: "Telangana", category: "Private" },
  { name: "University College of Engineering, Osmania University", short: "OU Hyderabad", city: "Hyderabad", state: "Telangana", category: "State Govt" },
  { name: "JNTUH College of Engineering, Hyderabad", short: "JNTU Hyderabad", city: "Hyderabad", state: "Telangana", category: "State Govt" },
  { name: "Gokaraju Rangaraju Institute of Engineering and Technology (GRIET)", short: "GRIET Hyderabad", city: "Hyderabad", state: "Telangana", category: "Private" },
  { name: "Gayatri Vidya Parishad College of Engineering, Visakhapatnam", short: "GVP Visakhapatnam", city: "Visakhapatnam", state: "Andhra Pradesh", category: "Private" },
  { name: "Andhra University College of Engineering (AUCE), Visakhapatnam", short: "Andhra University", city: "Visakhapatnam", state: "Andhra Pradesh", category: "State Govt" },
  { name: "Sri Venkateswara University College of Engineering, Tirupati", short: "SVU Tirupati", city: "Tirupati", state: "Andhra Pradesh", category: "State Govt" },

  // --- North India & Premier Private / Central Universities ---
  { name: "Thapar Institute of Engineering and Technology (TIET), Patiala", short: "Thapar University", city: "Patiala", state: "Punjab", category: "Private" },
  { name: "Punjab Engineering College (PEC), Chandigarh", short: "PEC Chandigarh", city: "Chandigarh", state: "Chandigarh", category: "State Govt" },
  { name: "University Institute of Engineering and Technology (UIET), Panjab University", short: "UIET Chandigarh", city: "Chandigarh", state: "Chandigarh", category: "Central Govt" },
  { name: "Harcourt Butler Technical University (HBTU), Kanpur", short: "HBTU Kanpur", city: "Kanpur", state: "Uttar Pradesh", category: "State Govt" },
  { name: "Institute of Engineering and Technology (IET), Lucknow", short: "IET Lucknow", city: "Lucknow", state: "Uttar Pradesh", category: "State Govt" },
  { name: "Madan Mohan Malaviya University of Technology (MMMUT), Gorakhpur", short: "MMMUT Gorakhpur", city: "Gorakhpur", state: "Uttar Pradesh", category: "State Govt" },
  { name: "Jaypee Institute of Information Technology (JIIT), Noida", short: "Jaypee Noida", city: "Noida", state: "Uttar Pradesh", category: "Private" },
  { name: "Shiv Nadar University (SNU), Greater Noida", short: "Shiv Nadar Univ", city: "Greater Noida", state: "Uttar Pradesh", category: "Private" },
  { name: "Ashoka University, Sonipat", short: "Ashoka University", city: "Sonipat", state: "Haryana", category: "Private" },
  { name: "Plaksha University, Mohali", short: "Plaksha University", city: "Mohali", state: "Punjab", category: "Private" },
  { name: "Bennett University (Times Group), Greater Noida", short: "Bennett University", city: "Greater Noida", state: "Uttar Pradesh", category: "Private" },
  { name: "Birla Institute of Technology (BIT) Mesra, Ranchi", short: "BIT Mesra", city: "Ranchi", state: "Jharkhand", category: "Govt-Aided" },
  { name: "The LNM Institute of Information Technology (LNMIIT), Jaipur", short: "LNMIIT Jaipur", city: "Jaipur", state: "Rajasthan", category: "Private" },
  { name: "Kalinga Institute of Industrial Technology (KIIT), Bhubaneswar", short: "KIIT Bhubaneswar", city: "Bhubaneswar", state: "Odisha", category: "Private" },
  { name: "Amity University, Noida / Gurugram / Kolkata / Mumbai", short: "Amity University", city: "Noida", state: "Uttar Pradesh", category: "Private" },
  { name: "Lovely Professional University (LPU), Phagwara", short: "LPU Punjab", city: "Phagwara", state: "Punjab", category: "Private" },
  { name: "Chandigarh University (CU), Mohali", short: "Chandigarh Univ", city: "Mohali", state: "Punjab", category: "Private" },
  { name: "Chitkara University, Rajpura", short: "Chitkara University", city: "Rajpura", state: "Punjab", category: "Private" },

  // --- Kerala Top Colleges ---
  { name: "College of Engineering Trivandrum (CET), Thiruvananthapuram", short: "CET Trivandrum", city: "Thiruvananthapuram", state: "Kerala", category: "State Govt" },
  { name: "Government Engineering College (GEC) Thrissur", short: "GEC Thrissur", city: "Thrissur", state: "Kerala", category: "State Govt" },
  { name: "Government College of Engineering Barton Hill, Thiruvananthapuram", short: "Barton Hill", city: "Thiruvananthapuram", state: "Kerala", category: "State Govt" },
  { name: "Model Engineering College (MEC), Kochi", short: "MEC Kochi", city: "Kochi", state: "Kerala", category: "State Govt" },
  { name: "Cochin University of Science and Technology (CUSAT), Kochi", short: "CUSAT Kochi", city: "Kochi", state: "Kerala", category: "State Govt" },
  { name: "TKM College of Engineering, Kollam", short: "TKM Kollam", city: "Kollam", state: "Kerala", category: "Govt-Aided" },
  { name: "Rajagiri School of Engineering & Technology (RSET), Kochi", short: "Rajagiri Kochi", city: "Kochi", state: "Kerala", category: "Private" },

  // --- Gujarat Top Colleges ---
  { name: "Dhirubhai Ambani Institute of Information and Communication Technology (DA-IICT)", short: "DA-IICT Gandhinagar", city: "Gandhinagar", state: "Gujarat", category: "Private" },
  { name: "Nirma University, Institute of Technology, Ahmedabad", short: "Nirma University", city: "Ahmedabad", state: "Gujarat", category: "Private" },
  { name: "Pandit Deendayal Energy University (PDEU), Gandhinagar", short: "PDEU Gandhinagar", city: "Gandhinagar", state: "Gujarat", category: "Private" },
  { name: "L.D. College of Engineering (LDCE), Ahmedabad", short: "LDCE Ahmedabad", city: "Ahmedabad", state: "Gujarat", category: "State Govt" },
  { name: "Birla Vishvakarma Mahavidyalaya (BVM), Anand", short: "BVM Anand", city: "Anand", state: "Gujarat", category: "Govt-Aided" }
];

/**
 * Smart Search helper for Indian Colleges
 * Computes closest matches using fuzzy scoring:
 * 1. Exact abbreviation / acronym match (e.g. "iit", "nit", "bits", "vit", "dtu", "ju", "coep")
 * 2. Prefix word match
 * 3. Substring inclusion
 * 4. Location match (city / state)
 */
export function searchIndianColleges(query, limit = 8) {
  if (!query || !query.trim()) {
    // Return top popular institutes by default
    return INDIAN_COLLEGES.slice(0, limit);
  }

  const clean = query.trim().toLowerCase();
  const tokens = clean.split(/\s+/).filter(Boolean);

  const scored = INDIAN_COLLEGES.map(college => {
    let score = 0;
    const nameLow = college.name.toLowerCase();
    const shortLow = college.short.toLowerCase();
    const cityLow = college.city.toLowerCase();
    const stateLow = college.state.toLowerCase();
    const catLow = college.category.toLowerCase();

    // 1. Direct short prefix match (e.g. "iit b" -> IIT Bombay)
    if (shortLow.startsWith(clean)) score += 100;
    else if (nameLow.startsWith(clean)) score += 80;

    // 2. Acronym match (e.g., query "dtu" matching "dtu", "bits" matching "bits")
    if (shortLow.includes(clean)) score += 50;

    // 3. Token-by-token evaluation
    let allTokensFound = true;
    for (const token of tokens) {
      const inName = nameLow.includes(token);
      const inShort = shortLow.includes(token);
      const inCity = cityLow.includes(token);
      const inState = stateLow.includes(token);
      const inCat = catLow.includes(token);

      if (inName || inShort || inCity || inState || inCat) {
        if (inShort) score += 30;
        if (inName) score += 20;
        if (inCity) score += 15;
        if (inState) score += 10;
      } else {
        allTokensFound = false;
      }
    }

    if (allTokensFound) score += 40;

    return { college, score };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.college);
}
