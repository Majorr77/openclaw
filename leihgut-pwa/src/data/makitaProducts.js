// Makita Produktdatenbank – kuratiert aus dem offiziellen Makita Deutschland Katalog
// Quelle: makita.de – Produktkatalog 2024/2025

export const MAKITA_CATEGORIES = [
  { id: 'akku_lxt18',    label: 'Akku-Werkzeuge LXT 18V',      icon: '🔋' },
  { id: 'akku_xgt40',    label: 'Akku-Werkzeuge XGT 40V max.', icon: '⚡' },
  { id: 'akku_cxt12',    label: 'Akku-Werkzeuge CXT 12V',      icon: '🔌' },
  { id: 'bohren',        label: 'Bohren & Befestigen',          icon: '🔩' },
  { id: 'beton',         label: 'Betonbearbeitung',             icon: '🏗' },
  { id: 'metall',        label: 'Metallbearbeitung',            icon: '⚙️' },
  { id: 'holz',          label: 'Holzbearbeitung',              icon: '🪵' },
  { id: 'garten',        label: 'Gartengeräte',                 icon: '🌿' },
  { id: 'staubsauger',   label: 'Staubsauger',                  icon: '🌀' },
  { id: 'nagler',        label: 'Nagler',                       icon: '🔨' },
  { id: 'sonstiges',     label: 'Sonstiges',                    icon: '📦' },
]

export const MAKITA_PRODUCTS = [
  // ── Akku-Bohrschrauber & Schlagbohrschrauber LXT 18V ──────────────────────
  { code: 'DDF484',  name: 'DDF484 Akku-Bohrschrauber 18V',                    category: 'akku_lxt18', subcategory: 'Bohrschrauber',         voltage: '18V' },
  { code: 'DDF485',  name: 'DDF485 Akku-Bohrschrauber 18V bürstenlos',         category: 'akku_lxt18', subcategory: 'Bohrschrauber',         voltage: '18V' },
  { code: 'DDF487',  name: 'DDF487 Akku-Bohrschrauber 18V bürstenlos',         category: 'akku_lxt18', subcategory: 'Bohrschrauber',         voltage: '18V' },
  { code: 'DHP484',  name: 'DHP484 Akku-Schlagbohrschrauber 18V',              category: 'akku_lxt18', subcategory: 'Schlagbohrschrauber',   voltage: '18V' },
  { code: 'DHP485',  name: 'DHP485 Akku-Schlagbohrschrauber 18V bürstenlos',   category: 'akku_lxt18', subcategory: 'Schlagbohrschrauber',   voltage: '18V' },
  { code: 'DHP487',  name: 'DHP487 Akku-Schlagbohrschrauber 18V bürstenlos',   category: 'akku_lxt18', subcategory: 'Schlagbohrschrauber',   voltage: '18V' },
  { code: 'DHP489',  name: 'DHP489 Akku-Schlagbohrschrauber 18V XPT',          category: 'akku_lxt18', subcategory: 'Schlagbohrschrauber',   voltage: '18V' },

  // ── Akku-Schlagschrauber LXT 18V ──────────────────────────────────────────
  { code: 'DTD153',  name: 'DTD153 Akku-Schlagschrauber 18V',                  category: 'akku_lxt18', subcategory: 'Schlagschrauber',       voltage: '18V' },
  { code: 'DTD155',  name: 'DTD155 Akku-Schlagschrauber 18V bürstenlos',       category: 'akku_lxt18', subcategory: 'Schlagschrauber',       voltage: '18V' },
  { code: 'DTD157',  name: 'DTD157 Akku-Schlagschrauber 18V bürstenlos',       category: 'akku_lxt18', subcategory: 'Schlagschrauber',       voltage: '18V' },
  { code: 'DTD158',  name: 'DTD158 Akku-Schlagschrauber 18V bürstenlos XPT',   category: 'akku_lxt18', subcategory: 'Schlagschrauber',       voltage: '18V' },
  { code: 'DTD171',  name: 'DTD171 Akku-Schlagschrauber 18V bürstenlos',       category: 'akku_lxt18', subcategory: 'Schlagschrauber',       voltage: '18V' },
  { code: 'DTD172',  name: 'DTD172 Akku-Schlagschrauber 18V bürstenlos',       category: 'akku_lxt18', subcategory: 'Schlagschrauber',       voltage: '18V' },
  { code: 'DTD201',  name: 'DTD201 Akku-Schlagschrauber 18V bürstenlos',       category: 'akku_lxt18', subcategory: 'Schlagschrauber',       voltage: '18V' },

  // ── Akku-Bohrhammer & Kombihammer LXT 18V ─────────────────────────────────
  { code: 'DHR171',  name: 'DHR171 Akku-Bohrhammer 18V SDS-Plus',              category: 'akku_lxt18', subcategory: 'Bohrhammer',            voltage: '18V' },
  { code: 'DHR182',  name: 'DHR182 Akku-Kombihammer 18V SDS-Plus bürstenlos',  category: 'akku_lxt18', subcategory: 'Kombihammer',           voltage: '18V' },
  { code: 'DHR183',  name: 'DHR183 Akku-Bohrhammer 18V SDS-Plus bürstenlos',   category: 'akku_lxt18', subcategory: 'Bohrhammer',            voltage: '18V' },
  { code: 'DHR243',  name: 'DHR243 Akku-Kombihammer 18V SDS-Plus bürstenlos',  category: 'akku_lxt18', subcategory: 'Kombihammer',           voltage: '18V' },
  { code: 'DHR280',  name: 'DHR280 Akku-Kombihammer 18V SDS-Max bürstenlos',   category: 'akku_lxt18', subcategory: 'Kombihammer',           voltage: '18V' },
  { code: 'DHR281',  name: 'DHR281 Akku-Kombihammer 18V SDS-Max bürstenlos',   category: 'akku_lxt18', subcategory: 'Kombihammer',           voltage: '18V' },
  { code: 'DHK180',  name: 'DHK180 Akku-Meißelhammer 18V SDS-Plus',            category: 'akku_lxt18', subcategory: 'Meißelhammer',          voltage: '18V' },

  // ── Akku-Winkelschleifer LXT 18V ──────────────────────────────────────────
  { code: 'DGA404',  name: 'DGA404 Akku-Winkelschleifer 18V 115mm',            category: 'akku_lxt18', subcategory: 'Winkelschleifer',       voltage: '18V' },
  { code: 'DGA452',  name: 'DGA452 Akku-Winkelschleifer 18V 125mm',            category: 'akku_lxt18', subcategory: 'Winkelschleifer',       voltage: '18V' },
  { code: 'DGA504',  name: 'DGA504 Akku-Winkelschleifer 18V 125mm bürstenlos', category: 'akku_lxt18', subcategory: 'Winkelschleifer',       voltage: '18V' },
  { code: 'DGA513',  name: 'DGA513 Akku-Winkelschleifer 18V 125mm bürstenlos', category: 'akku_lxt18', subcategory: 'Winkelschleifer',       voltage: '18V' },
  { code: 'DGA519',  name: 'DGA519 Akku-Winkelschleifer 18V 125mm bürstenlos', category: 'akku_lxt18', subcategory: 'Winkelschleifer',       voltage: '18V' },

  // ── Akku-Stichsägen LXT 18V ───────────────────────────────────────────────
  { code: 'DJV180',  name: 'DJV180 Akku-Stichsäge 18V',                        category: 'akku_lxt18', subcategory: 'Stichsäge',             voltage: '18V' },
  { code: 'DJV182',  name: 'DJV182 Akku-Stichsäge 18V bürstenlos',             category: 'akku_lxt18', subcategory: 'Stichsäge',             voltage: '18V' },
  { code: 'DJV184',  name: 'DJV184 Akku-Stichsäge 18V bürstenlos',             category: 'akku_lxt18', subcategory: 'Stichsäge',             voltage: '18V' },
  { code: 'DJV186',  name: 'DJV186 Akku-Stichsäge 18V bürstenlos XPT',         category: 'akku_lxt18', subcategory: 'Stichsäge',             voltage: '18V' },

  // ── Akku-Handkreissägen LXT 18V ───────────────────────────────────────────
  { code: 'DSS610',  name: 'DSS610 Akku-Handkreissäge 18V 165mm',              category: 'akku_lxt18', subcategory: 'Handkreissäge',         voltage: '18V' },
  { code: 'DSS611',  name: 'DSS611 Akku-Handkreissäge 18V 165mm bürstenlos',   category: 'akku_lxt18', subcategory: 'Handkreissäge',         voltage: '18V' },
  { code: 'DSS613',  name: 'DSS613 Akku-Handkreissäge 18V 165mm bürstenlos',   category: 'akku_lxt18', subcategory: 'Handkreissäge',         voltage: '18V' },
  { code: 'DHS680',  name: 'DHS680 Akku-Handkreissäge 18V 185mm bürstenlos',   category: 'akku_lxt18', subcategory: 'Handkreissäge',         voltage: '18V' },

  // ── Akku-Reciprosägen LXT 18V ─────────────────────────────────────────────
  { code: 'DJR183',  name: 'DJR183 Akku-Reciprosäge 18V',                      category: 'akku_lxt18', subcategory: 'Reciprosäge',           voltage: '18V' },
  { code: 'DJR185',  name: 'DJR185 Akku-Reciprosäge 18V bürstenlos',           category: 'akku_lxt18', subcategory: 'Reciprosäge',           voltage: '18V' },
  { code: 'DJR187',  name: 'DJR187 Akku-Reciprosäge 18V bürstenlos XPT',       category: 'akku_lxt18', subcategory: 'Reciprosäge',           voltage: '18V' },

  // ── Akku-Exzenterschleifer LXT 18V ────────────────────────────────────────
  { code: 'DBO180',  name: 'DBO180 Akku-Exzenterschleifer 18V 125mm',          category: 'akku_lxt18', subcategory: 'Exzenterschleifer',     voltage: '18V' },
  { code: 'DBO183',  name: 'DBO183 Akku-Exzenterschleifer 18V 125mm bürstenlos', category: 'akku_lxt18', subcategory: 'Exzenterschleifer',   voltage: '18V' },
  { code: 'DBO185',  name: 'DBO185 Akku-Exzenterschleifer 18V 125mm bürstenlos', category: 'akku_lxt18', subcategory: 'Exzenterschleifer',   voltage: '18V' },

  // ── Akku-Multifunktionswerkzeuge LXT 18V ──────────────────────────────────
  { code: 'DTM50',   name: 'DTM50 Akku-Multifunktionswerkzeug 18V',            category: 'akku_lxt18', subcategory: 'Multifunktion',         voltage: '18V' },
  { code: 'DTM51',   name: 'DTM51 Akku-Multifunktionswerkzeug 18V bürstenlos', category: 'akku_lxt18', subcategory: 'Multifunktion',         voltage: '18V' },
  { code: 'DTM52',   name: 'DTM52 Akku-Multifunktionswerkzeug 18V bürstenlos', category: 'akku_lxt18', subcategory: 'Multifunktion',         voltage: '18V' },
  { code: 'DTM53',   name: 'DTM53 Akku-Multifunktionswerkzeug 18V bürstenlos', category: 'akku_lxt18', subcategory: 'Multifunktion',         voltage: '18V' },

  // ── Akku-Hobel LXT 18V ────────────────────────────────────────────────────
  { code: 'DKP180',  name: 'DKP180 Akku-Hobel 18V 82mm',                       category: 'akku_lxt18', subcategory: 'Hobel',                 voltage: '18V' },
  { code: 'DKP181',  name: 'DKP181 Akku-Hobel 18V 82mm bürstenlos',            category: 'akku_lxt18', subcategory: 'Hobel',                 voltage: '18V' },

  // ── Akku-Fräsen LXT 18V ───────────────────────────────────────────────────
  { code: 'DRT50',   name: 'DRT50 Akku-Fräse 18V 6mm',                         category: 'akku_lxt18', subcategory: 'Fräse',                 voltage: '18V' },
  { code: 'DRT51',   name: 'DRT51 Akku-Fräse 18V 6/8mm bürstenlos',            category: 'akku_lxt18', subcategory: 'Fräse',                 voltage: '18V' },

  // ── Akku-Bandschleifer LXT 18V ────────────────────────────────────────────
  { code: 'DBA180',  name: 'DBA180 Akku-Bandschleifer 18V 76x533mm',           category: 'akku_lxt18', subcategory: 'Bandschleifer',         voltage: '18V' },

  // ── Akku-Staubsauger LXT 18V ──────────────────────────────────────────────
  { code: 'DCL180',  name: 'DCL180 Akku-Staubsauger 18V',                      category: 'akku_lxt18', subcategory: 'Staubsauger',           voltage: '18V' },
  { code: 'DCL182',  name: 'DCL182 Akku-Staubsauger 18V',                      category: 'akku_lxt18', subcategory: 'Staubsauger',           voltage: '18V' },
  { code: 'DCL183',  name: 'DCL183 Akku-Staubsauger 18V',                      category: 'akku_lxt18', subcategory: 'Staubsauger',           voltage: '18V' },
  { code: 'DCL184',  name: 'DCL184 Akku-Staubsauger 18V bürstenlos',           category: 'akku_lxt18', subcategory: 'Staubsauger',           voltage: '18V' },

  // ── Akku-Leuchten LXT 18V ─────────────────────────────────────────────────
  { code: 'DML185',  name: 'DML185 Akku-Leuchte 18V LED',                      category: 'akku_lxt18', subcategory: 'Leuchte',               voltage: '18V' },
  { code: 'DML186',  name: 'DML186 Akku-Leuchte 18V LED',                      category: 'akku_lxt18', subcategory: 'Leuchte',               voltage: '18V' },
  { code: 'DML809',  name: 'DML809 Akku-Baustrahler 18V LED',                  category: 'akku_lxt18', subcategory: 'Leuchte',               voltage: '18V' },
  { code: 'DML819',  name: 'DML819 Akku-Leuchte magnetisch 18V LED',           category: 'akku_lxt18', subcategory: 'Leuchte',               voltage: '18V' },

  // ── Akku-Nagler LXT 18V ───────────────────────────────────────────────────
  { code: 'DFN350',  name: 'DFN350 Akku-Streifennagler 18V 90mm',              category: 'akku_lxt18', subcategory: 'Nagler',                voltage: '18V' },
  { code: 'DBN600',  name: 'DBN600 Akku-Streifennagler 18V 64mm',              category: 'akku_lxt18', subcategory: 'Nagler',                voltage: '18V' },
  { code: 'DBN620',  name: 'DBN620 Akku-Stauchkopfnagler 18V 64mm',            category: 'akku_lxt18', subcategory: 'Nagler',                voltage: '18V' },

  // ── XGT 40V max. Werkzeuge ────────────────────────────────────────────────
  { code: 'DF003G',  name: 'DF003G Akku-Bohrschrauber 40V max.',               category: 'akku_xgt40', subcategory: 'Bohrschrauber',         voltage: '40V' },
  { code: 'HP003G',  name: 'HP003G Akku-Schlagbohrschrauber 40V max.',         category: 'akku_xgt40', subcategory: 'Schlagbohrschrauber',   voltage: '40V' },
  { code: 'TD001G',  name: 'TD001G Akku-Schlagschrauber 40V max.',             category: 'akku_xgt40', subcategory: 'Schlagschrauber',       voltage: '40V' },
  { code: 'TD002G',  name: 'TD002G Akku-Schlagschrauber 40V max. bürstenlos',  category: 'akku_xgt40', subcategory: 'Schlagschrauber',       voltage: '40V' },
  { code: 'HR001G',  name: 'HR001G Akku-Kombihammer 40V max. SDS-Plus',        category: 'akku_xgt40', subcategory: 'Kombihammer',           voltage: '40V' },
  { code: 'HR002G',  name: 'HR002G Akku-Kombihammer 40V max. SDS-Plus',        category: 'akku_xgt40', subcategory: 'Kombihammer',           voltage: '40V' },
  { code: 'HR004G',  name: 'HR004G Akku-Kombihammer 40V max. SDS-Max',         category: 'akku_xgt40', subcategory: 'Kombihammer',           voltage: '40V' },
  { code: 'HR011G',  name: 'HR011G Akku-Kombihammer 40V max. SDS-Max',         category: 'akku_xgt40', subcategory: 'Kombihammer',           voltage: '40V' },
  { code: 'HR012G',  name: 'HR012G Akku-Kombihammer 40V max. SDS-Max',         category: 'akku_xgt40', subcategory: 'Kombihammer',           voltage: '40V' },
  { code: 'GA001G',  name: 'GA001G Akku-Winkelschleifer 40V max. 125mm',       category: 'akku_xgt40', subcategory: 'Winkelschleifer',       voltage: '40V' },
  { code: 'GA002G',  name: 'GA002G Akku-Winkelschleifer 40V max. 125mm',       category: 'akku_xgt40', subcategory: 'Winkelschleifer',       voltage: '40V' },
  { code: 'GA004G',  name: 'GA004G Akku-Winkelschleifer 40V max. 125mm',       category: 'akku_xgt40', subcategory: 'Winkelschleifer',       voltage: '40V' },
  { code: 'JV001G',  name: 'JV001G Akku-Stichsäge 40V max.',                  category: 'akku_xgt40', subcategory: 'Stichsäge',             voltage: '40V' },
  { code: 'JR001G',  name: 'JR001G Akku-Reciprosäge 40V max.',                category: 'akku_xgt40', subcategory: 'Reciprosäge',           voltage: '40V' },
  { code: 'JR003G',  name: 'JR003G Akku-Reciprosäge 40V max.',                category: 'akku_xgt40', subcategory: 'Reciprosäge',           voltage: '40V' },
  { code: 'HS001G',  name: 'HS001G Akku-Handkreissäge 40V max. 165mm',        category: 'akku_xgt40', subcategory: 'Handkreissäge',         voltage: '40V' },
  { code: 'HS002G',  name: 'HS002G Akku-Handkreissäge 40V max. 185mm',        category: 'akku_xgt40', subcategory: 'Handkreissäge',         voltage: '40V' },
  { code: 'BO001G',  name: 'BO001G Akku-Exzenterschleifer 40V max. 125mm',    category: 'akku_xgt40', subcategory: 'Exzenterschleifer',     voltage: '40V' },
  { code: 'TM001G',  name: 'TM001G Akku-Multifunktionswerkzeug 40V max.',     category: 'akku_xgt40', subcategory: 'Multifunktion',         voltage: '40V' },
  { code: 'CL001G',  name: 'CL001G Akku-Staubsauger 40V max.',                category: 'akku_xgt40', subcategory: 'Staubsauger',           voltage: '40V' },
  { code: 'CL002G',  name: 'CL002G Akku-Staubsauger 40V max.',                category: 'akku_xgt40', subcategory: 'Staubsauger',           voltage: '40V' },
  { code: 'ML001G',  name: 'ML001G Akku-Baustrahler 40V max. LED',            category: 'akku_xgt40', subcategory: 'Leuchte',               voltage: '40V' },
  { code: 'ML002G',  name: 'ML002G Akku-Leuchte 40V max. LED',                category: 'akku_xgt40', subcategory: 'Leuchte',               voltage: '40V' },
  { code: 'ML013G',  name: 'ML013G Akku-Leuchte magnetisch 40V max.',         category: 'akku_xgt40', subcategory: 'Leuchte',               voltage: '40V' },
  { code: 'BN001G',  name: 'BN001G Akku-Streifennagler 40V max. 90mm',        category: 'akku_xgt40', subcategory: 'Nagler',                voltage: '40V' },
  { code: 'BN002G',  name: 'BN002G Akku-Streifennagler 40V max. 64mm',        category: 'akku_xgt40', subcategory: 'Nagler',                voltage: '40V' },
  { code: 'BS002G',  name: 'BS002G Akku-Rohrbandschleifer 40V max.',           category: 'akku_xgt40', subcategory: 'Schleifer',             voltage: '40V' },
  { code: 'GP001G',  name: 'GP001G Akku-Fettpresse 40V max.',                  category: 'akku_xgt40', subcategory: 'Sonstiges',             voltage: '40V' },
  { code: 'LH001G',  name: 'LH001G Akku-Tisch-Kapp-Gehrungssäge 40V max.',   category: 'akku_xgt40', subcategory: 'Kappsäge',              voltage: '40V' },

  // ── CXT 12V max. Werkzeuge ────────────────────────────────────────────────
  { code: 'DF333D',  name: 'DF333D Akku-Bohrschrauber 12V max.',               category: 'akku_cxt12', subcategory: 'Bohrschrauber',         voltage: '12V' },
  { code: 'HP333D',  name: 'HP333D Akku-Schlagbohrschrauber 12V max.',         category: 'akku_cxt12', subcategory: 'Schlagbohrschrauber',   voltage: '12V' },
  { code: 'TD111D',  name: 'TD111D Akku-Schlagschrauber 12V max.',             category: 'akku_cxt12', subcategory: 'Schlagschrauber',       voltage: '12V' },
  { code: 'TM30D',   name: 'TM30D Akku-Multifunktionswerkzeug 12V max.',       category: 'akku_cxt12', subcategory: 'Multifunktion',         voltage: '12V' },
  { code: 'JV103D',  name: 'JV103D Akku-Stichsäge 12V max.',                  category: 'akku_cxt12', subcategory: 'Stichsäge',             voltage: '12V' },
  { code: 'CL108FD', name: 'CL108FD Akku-Staubsauger 12V max.',               category: 'akku_cxt12', subcategory: 'Staubsauger',           voltage: '12V' },

  // ── Kabelgebundene Bohrmaschinen & Schlagbohrmaschinen ────────────────────
  { code: 'HP1631',  name: 'HP1631 Schlagbohrmaschine 710W',                   category: 'bohren',     subcategory: 'Schlagbohrmaschine',    voltage: '230V' },
  { code: 'HP1640',  name: 'HP1640 Schlagbohrmaschine 710W',                   category: 'bohren',     subcategory: 'Schlagbohrmaschine',    voltage: '230V' },
  { code: 'HP2050',  name: 'HP2050 Schlagbohrmaschine 1010W',                  category: 'bohren',     subcategory: 'Schlagbohrmaschine',    voltage: '230V' },
  { code: 'DP4001',  name: 'DP4001 Bohrmaschine 710W',                         category: 'bohren',     subcategory: 'Bohrmaschine',          voltage: '230V' },
  { code: 'DP4700',  name: 'DP4700 Bohrmaschine 710W',                         category: 'bohren',     subcategory: 'Bohrmaschine',          voltage: '230V' },

  // ── Kabelgebundene Bohrhammer & Kombihammer ───────────────────────────────
  { code: 'HR1840',  name: 'HR1840 Bohrhammer 470W SDS-Plus',                  category: 'beton',      subcategory: 'Bohrhammer',            voltage: '230V' },
  { code: 'HR1841F', name: 'HR1841F Bohrhammer 470W SDS-Plus',                 category: 'beton',      subcategory: 'Bohrhammer',            voltage: '230V' },
  { code: 'HR2230',  name: 'HR2230 Kombihammer 720W SDS-Plus',                 category: 'beton',      subcategory: 'Kombihammer',           voltage: '230V' },
  { code: 'HR2300',  name: 'HR2300 Kombihammer 720W SDS-Plus',                 category: 'beton',      subcategory: 'Kombihammer',           voltage: '230V' },
  { code: 'HR2470',  name: 'HR2470 Kombihammer 780W SDS-Plus',                 category: 'beton',      subcategory: 'Kombihammer',           voltage: '230V' },
  { code: 'HR2630',  name: 'HR2630 Kombihammer 800W SDS-Plus',                 category: 'beton',      subcategory: 'Kombihammer',           voltage: '230V' },
  { code: 'HR3210C', name: 'HR3210C Kombihammer 1040W SDS-Max',                category: 'beton',      subcategory: 'Kombihammer',           voltage: '230V' },
  { code: 'HR4001C', name: 'HR4001C Kombihammer 1100W SDS-Max',                category: 'beton',      subcategory: 'Kombihammer',           voltage: '230V' },
  { code: 'HR5001C', name: 'HR5001C Kombihammer 1500W SDS-Max',                category: 'beton',      subcategory: 'Kombihammer',           voltage: '230V' },
  { code: 'HM0860C', name: 'HM0860C Stemmhammer 1100W SDS-Max',               category: 'beton',      subcategory: 'Stemmhammer',           voltage: '230V' },
  { code: 'HM1214C', name: 'HM1214C Stemmhammer 1510W SDS-Max',               category: 'beton',      subcategory: 'Stemmhammer',           voltage: '230V' },
  { code: 'HP330D',  name: 'HP330D Akku-Schlagbohrschrauber 12V max.',         category: 'akku_cxt12', subcategory: 'Schlagbohrschrauber',   voltage: '12V' },

  // ── Kabelgebundene Winkelschleifer ────────────────────────────────────────
  { code: 'GA4530',  name: 'GA4530 Winkelschleifer 720W 115mm',                category: 'metall',     subcategory: 'Winkelschleifer',       voltage: '230V' },
  { code: 'GA5030',  name: 'GA5030 Winkelschleifer 720W 125mm',                category: 'metall',     subcategory: 'Winkelschleifer',       voltage: '230V' },
  { code: 'GA6020',  name: 'GA6020 Winkelschleifer 840W 150mm',                category: 'metall',     subcategory: 'Winkelschleifer',       voltage: '230V' },
  { code: 'GA7020',  name: 'GA7020 Winkelschleifer 1400W 180mm',               category: 'metall',     subcategory: 'Winkelschleifer',       voltage: '230V' },
  { code: 'GA9020',  name: 'GA9020 Winkelschleifer 2200W 230mm',               category: 'metall',     subcategory: 'Winkelschleifer',       voltage: '230V' },
  { code: 'GA9040',  name: 'GA9040 Winkelschleifer 2200W 230mm',               category: 'metall',     subcategory: 'Winkelschleifer',       voltage: '230V' },

  // ── Kabelgebundene Stichsägen ─────────────────────────────────────────────
  { code: '4329',    name: '4329 Stichsäge 450W',                              category: 'holz',       subcategory: 'Stichsäge',             voltage: '230V' },
  { code: '4350CT',  name: '4350CT Stichsäge 720W',                            category: 'holz',       subcategory: 'Stichsäge',             voltage: '230V' },
  { code: '4351FCT', name: '4351FCT Stichsäge 720W',                           category: 'holz',       subcategory: 'Stichsäge',             voltage: '230V' },

  // ── Kabelgebundene Handkreissägen ─────────────────────────────────────────
  { code: '5008MGA', name: '5008MGA Handkreissäge 1800W 210mm',                category: 'holz',       subcategory: 'Handkreissäge',         voltage: '230V' },
  { code: '5017RKB', name: '5017RKB Handkreissäge 1710W 190mm',                category: 'holz',       subcategory: 'Handkreissäge',         voltage: '230V' },
  { code: '5704R',   name: '5704R Handkreissäge 1200W 190mm',                  category: 'holz',       subcategory: 'Handkreissäge',         voltage: '230V' },
  { code: '5705R',   name: '5705R Handkreissäge 1300W 190mm',                  category: 'holz',       subcategory: 'Handkreissäge',         voltage: '230V' },

  // ── Kapp- und Gehrungssägen ───────────────────────────────────────────────
  { code: 'LS0714',  name: 'LS0714 Kapp- und Gehrungssäge 1010W 190mm',        category: 'holz',       subcategory: 'Kappsäge',              voltage: '230V' },
  { code: 'LS0815',  name: 'LS0815 Kapp- und Gehrungssäge 1050W 216mm',        category: 'holz',       subcategory: 'Kappsäge',              voltage: '230V' },
  { code: 'LS1016L', name: 'LS1016L Kapp- und Gehrungssäge 1510W 260mm',       category: 'holz',       subcategory: 'Kappsäge',              voltage: '230V' },
  { code: 'LS1019L', name: 'LS1019L Kapp- und Gehrungssäge 1800W 260mm',       category: 'holz',       subcategory: 'Kappsäge',              voltage: '230V' },
  { code: 'LS1040',  name: 'LS1040 Kapp- und Gehrungssäge 1650W 260mm',        category: 'holz',       subcategory: 'Kappsäge',              voltage: '230V' },

  // ── Tischkreissägen ───────────────────────────────────────────────────────
  { code: '2704',    name: '2704 Tischkreissäge 1650W 260mm',                  category: 'holz',       subcategory: 'Tischkreissäge',        voltage: '230V' },
  { code: '2705',    name: '2705 Tischkreissäge 1650W 260mm',                  category: 'holz',       subcategory: 'Tischkreissäge',        voltage: '230V' },
  { code: '2705X1',  name: '2705X1 Tischkreissäge 1650W 260mm',                category: 'holz',       subcategory: 'Tischkreissäge',        voltage: '230V' },

  // ── Exzenterschleifer ─────────────────────────────────────────────────────
  { code: 'BO5041',  name: 'BO5041 Exzenterschleifer 300W 125mm',              category: 'holz',       subcategory: 'Exzenterschleifer',     voltage: '230V' },
  { code: 'BO5031',  name: 'BO5031 Exzenterschleifer 300W 125mm',              category: 'holz',       subcategory: 'Exzenterschleifer',     voltage: '230V' },
  { code: 'BO6030',  name: 'BO6030 Exzenterschleifer 310W 150mm',              category: 'holz',       subcategory: 'Exzenterschleifer',     voltage: '230V' },

  // ── Schwingschleifer ──────────────────────────────────────────────────────
  { code: 'BO3711',  name: 'BO3711 Schwingschleifer 190W',                     category: 'holz',       subcategory: 'Schwingschleifer',      voltage: '230V' },
  { code: 'BO4555',  name: 'BO4555 Schwingschleifer 200W',                     category: 'holz',       subcategory: 'Schwingschleifer',      voltage: '230V' },

  // ── Bandschleifer ─────────────────────────────────────────────────────────
  { code: '9401',    name: '9401 Bandschleifer 1040W 100x610mm',               category: 'holz',       subcategory: 'Bandschleifer',         voltage: '230V' },
  { code: '9403',    name: '9403 Bandschleifer 940W 76x533mm',                 category: 'holz',       subcategory: 'Bandschleifer',         voltage: '230V' },
  { code: '9404',    name: '9404 Bandschleifer 1200W 100x610mm',               category: 'holz',       subcategory: 'Bandschleifer',         voltage: '230V' },

  // ── Hobel ─────────────────────────────────────────────────────────────────
  { code: 'KP0800',  name: 'KP0800 Hobel 620W 82mm',                          category: 'holz',       subcategory: 'Hobel',                 voltage: '230V' },
  { code: 'KP0810',  name: 'KP0810 Hobel 620W 82mm',                          category: 'holz',       subcategory: 'Hobel',                 voltage: '230V' },
  { code: 'KP0900',  name: 'KP0900 Hobel 850W 82mm',                          category: 'holz',       subcategory: 'Hobel',                 voltage: '230V' },

  // ── Fräsen ────────────────────────────────────────────────────────────────
  { code: 'RT0700C', name: 'RT0700C Fräse 710W 6/8mm',                        category: 'holz',       subcategory: 'Fräse',                 voltage: '230V' },
  { code: 'RP0900',  name: 'RP0900 Fräse 900W 6/8mm',                         category: 'holz',       subcategory: 'Fräse',                 voltage: '230V' },
  { code: 'RP1800',  name: 'RP1800 Fräse 1800W 6/8/12mm',                     category: 'holz',       subcategory: 'Fräse',                 voltage: '230V' },
  { code: 'RP2301FC',name: 'RP2301FC Fräse 2300W 6/8/12mm',                   category: 'holz',       subcategory: 'Fräse',                 voltage: '230V' },

  // ── Gartengeräte ──────────────────────────────────────────────────────────
  { code: 'DUC353',  name: 'DUC353 Akku-Kettensäge 18V 350mm',                category: 'garten',     subcategory: 'Kettensäge',            voltage: '18V' },
  { code: 'DUC254',  name: 'DUC254 Akku-Kettensäge 18V 250mm',                category: 'garten',     subcategory: 'Kettensäge',            voltage: '18V' },
  { code: 'DUH523',  name: 'DUH523 Akku-Heckenschere 18V 530mm',              category: 'garten',     subcategory: 'Heckenschere',          voltage: '18V' },
  { code: 'DUH551',  name: 'DUH551 Akku-Heckenschere 18V 550mm',              category: 'garten',     subcategory: 'Heckenschere',          voltage: '18V' },
  { code: 'DUR187L', name: 'DUR187L Akku-Rasentrimmer 18V 260mm',             category: 'garten',     subcategory: 'Rasentrimmer',          voltage: '18V' },
  { code: 'DUR189L', name: 'DUR189L Akku-Rasentrimmer 18V 260mm bürstenlos',  category: 'garten',     subcategory: 'Rasentrimmer',          voltage: '18V' },
  { code: 'DUB182',  name: 'DUB182 Akku-Laubbläser 18V',                      category: 'garten',     subcategory: 'Laubbläser',            voltage: '18V' },
  { code: 'DUB185',  name: 'DUB185 Akku-Laubbläser 18V bürstenlos',           category: 'garten',     subcategory: 'Laubbläser',            voltage: '18V' },
  { code: 'UB003G',  name: 'UB003G Akku-Laubbläser/-sauger 40V max.',         category: 'garten',     subcategory: 'Laubbläser',            voltage: '40V' },
  { code: 'UH023G',  name: 'UH023G Akku-Heckenschere 40V max. 600mm',         category: 'garten',     subcategory: 'Heckenschere',          voltage: '40V' },
  { code: 'UC001G',  name: 'UC001G Akku-Kettensäge 40V max. 350mm',           category: 'garten',     subcategory: 'Kettensäge',            voltage: '40V' },
  { code: 'UR001G',  name: 'UR001G Akku-Rasentrimmer 40V max.',               category: 'garten',     subcategory: 'Rasentrimmer',          voltage: '40V' },

  // ── Staubsauger (kabelgebunden) ───────────────────────────────────────────
  { code: 'VC2512L', name: 'VC2512L Nass-/Trockensauger 1000W 25L',           category: 'staubsauger', subcategory: 'Nass-/Trockensauger',  voltage: '230V' },
  { code: 'VC3211M', name: 'VC3211M Nass-/Trockensauger 1000W 32L',           category: 'staubsauger', subcategory: 'Nass-/Trockensauger',  voltage: '230V' },
  { code: 'VC4210L', name: 'VC4210L Nass-/Trockensauger 1000W 42L',           category: 'staubsauger', subcategory: 'Nass-/Trockensauger',  voltage: '230V' },
  { code: 'CL200FD', name: 'CL200FD Akku-Staubsauger 18V',                    category: 'staubsauger', subcategory: 'Akku-Staubsauger',     voltage: '18V' },

  // ── Nagler (kabelgebunden/Druckluft) ──────────────────────────────────────
  { code: 'AN611',   name: 'AN611 Streifennagler Druckluft 90mm',              category: 'nagler',     subcategory: 'Streifennagler',        voltage: 'Druckluft' },
  { code: 'AN923',   name: 'AN923 Streifennagler Druckluft 90mm',              category: 'nagler',     subcategory: 'Streifennagler',        voltage: 'Druckluft' },
  { code: 'AF505',   name: 'AF505 Klammertacker Druckluft 50mm',               category: 'nagler',     subcategory: 'Klammertacker',         voltage: 'Druckluft' },
  { code: 'AT638A',  name: 'AT638A Klammertacker Druckluft 38mm',              category: 'nagler',     subcategory: 'Klammertacker',         voltage: 'Druckluft' },
]

/**
 * Suche in der Makita-Produktdatenbank
 * @param {string} query - Suchbegriff
 * @param {string} categoryFilter - Kategorie-ID oder '' für alle
 * @returns {Array} - Gefilterte Produkte
 */
export function searchMakitaProducts(query, categoryFilter = '') {
  const q = query.toLowerCase().trim()
  return MAKITA_PRODUCTS.filter(p => {
    const matchesCategory = !categoryFilter || p.category === categoryFilter
    if (!q) return matchesCategory
    const matchesQuery = (
      p.code.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q) ||
      p.voltage.toLowerCase().includes(q)
    )
    return matchesCategory && matchesQuery
  })
}
