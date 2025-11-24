🧩 Raport Javor – Test Driven Development (TDD) 

Informata të përgjithshme 

Emri: Erind Avdiu 

Java: 3 

Data e dorëzimit: 24.11.2025 

Emri i projektit: Weather App 

1️⃣ Përmbledhje e javës 

Përshkruani shkurtimisht çfarë është punuar gjatë kësaj jave (maksimum 5–6 rreshta). 

Gjatë kësaj jave kam zgjeruar aplikacionin e motit me funksionalitete të reja duke vazhduar me metodologjinë TDD. Kam implementuar 5-Day Weather Forecast komponentin, funksionalitetin e geolocation për detektimin automatik të lokacionit, dhe sistem caching me localStorage për përmirësim të performancës.  

Kam krijuar 15 teste të reja që mbulojnë forecast API calls, geolocation handling, caching logic, dark mode toggle, dhe animacione UI. Test coverage është rritur në 92.5% për statements dhe 90% për branches. 

2️⃣ Testet e zhvilluara 

Nr 

Përshkrimi i testit 

Statusi (kalon / dështon) 

Framework / metoda e përdorur 

1 

Rendering i komponentit WeatherForecast 

 Kalon(Green) 

Jest + React Testing Library 

2 

Shfaq të dhënat e parashikimit 5-ditor 

 Kalon(Green) 

Jest + React Testing Library 

3 

Mock API call për forecast endpoint 

Kalon(Green) 

Jest + MSW 

4 

Trajtimi i gabimit në forecast API 

Kalon(Green) 

Jest + React Testing Library 

5 

Detektimi automatik i lokacionit me Geolocation API 

Kalon(Green) 

Jest + Mock Geolocation API 

6 

Trajtimi i refuzimit të geolocation nga përdoruesi 

Kalon(Green) 

Jest + React Testing Library 

7 

Fallback në input manual kur geolocation dështon 

Kalon(Green) 

Jest + React Testing Library 

8 

Ruajtja e të dhënave në localStorage për caching 

Kalon(Green) 

Jest + localStorage mock 

9 

Leximi i të dhënave nga localStorage për city të kërkuar 

Kalon(Green) 

Jest + localStorage mock 

10 

Refresh i cache pas 10 minutave 

Kalon(Green) 

Jest + Timer mocks 

11 

Toggle i dark mode dhe ruajtja e preferencës 

Kalon(Green) 

Jest + React Testing Library 

12 

Animacione smooth kur ndryshojnë të dhënat moti 

Kalon(Green) 

Jest + React Testing Library 

13 

Responsive design për mobile dhe desktop 

Kalon(Green) 

Jest + useMediaQuery mock 

14 

Loading state për forecast data 

Kalon(Green) 

Jest + React Testing Library 

15 

Display i ikonave moti për çdo ditë të forecast 

 Kalon(Green) 

 Jest + React Testing Library 

 

3️⃣ Implementimi i bërë pas testeve 

Shkruani për cilat pjesë të kodit u bë implementimi pas testimit dhe si u reflektua në kod. 

Pas shkrimit të testeve, kam implementuar kodin për të kaluar testet sipas parimeve TDD: 

1. Weather Forecast API Service (lib/weather-api.ts) 

Funksioni getWeatherForecast() që kthen parashikimin 5-ditor 

Trajtimi i listës së të dhënave për çdo ditë 

Transformim i të dhënave për format të qartë (date, temp max/min, icon) 

2. WeatherForecast Component (components/weather-forecast.tsx) 

Komponent i ri që shfaq parashikimin 5-ditor 

Rendering i kartave për çdo ditë me ikona, temperaturë, dhe përshkrim 

Animacione me CSS transitions për ndryshim të të dhënave 

3. Geolocation Hook (hooks/use-geolocation.ts) 

Custom React hook për browser Geolocation API 

State management për location, error, dhe loading 

Auto-fallback në input manual nëse geolocation refuzohet 

4. Cache Service (lib/cache-service.ts) 

Funksione për save dhe get nga localStorage 

Timestamp validation për cache expiry (10 minuta) 

Format i qartë i të dhënave me metadata (timestamp, city) 

5. Theme Toggle (components/theme-toggle.tsx) 

Komponent për dark/light mode switching 

Integrim me next-themes për persistence 

6. Integration Updates (app/page.tsx) 

Integrimi i WeatherForecast component 

Layout i ri me tabs për current weather dhe forecast 

Geolocation button për auto-detection 

7. Hooks Updates (hooks/use-weather-cache.ts) 

Custom hook që kombinon API calls me caching logic 

Automatik check i cache para se të bëhet API call 

Kodi u shkrua pas testeve dhe u refaktorizua derisa të gjitha testet kaluan. 

 

4️⃣ Refaktorimi i bërë 

Gjatë procesit TDD kam bërë këto refakturime: 

1. Strukturë më e mirë e API layer: 

Ndarë weather-api.ts në modules të veçanta (current.ts, forecast.ts) 

Krijuar types/weather.ts për shared TypeScript interfaces 

Extracted cache logic në service të pavarur 

2. Custom Hooks për reusability: 

useGeolocation() për geolocation logic 

useWeatherCache() për caching dhe API calls 

useMediaQuery() për responsive behavior 

3. Komponente më modulare: 

Ndarë WeatherForecast në WeatherForecastCard për çdo ditë 

Krijuar IconMapper utility për weather icons 

Extracted animacione në utility classes 

4. Performance optimizations: 

React.memo() për forecast cards për të reduktuar re-renders 

useMemo() për expensive calculations (icon mapping, date formatting) 

useCallback() për event handlers për të shmangur recreation 

5. Error handling më i mirë: 

Specific error types për geolocation, cache, dhe API errors 

User-friendly error messages për çdo skenar 

Retry logic për network failures 

6. Test organization: 

Ndarë testet në suites për çdo feature (forecast, geolocation, cache) 

Shared test utilities për mock data generation 

Reusable mock setup functions 

 

5️⃣ Probleme të hasura 

Shkruani sfidat teknike ose konceptuale që keni hasur. 

1. Mock i Browser Geolocation API: 

Problem: Browser Geolocation API nuk është i disponueshëm në Jest/Node environment 

Zgjidhje: Krijuar mock global për navigator.geolocation me jest.fn() dhe mockImplementation() 

2. Timer-based Cache Expiry Testing: 

Problem: Testet për cache expiry duhej të testonin kohën (10 minuta) 

Zgjidhje: Përdorur jest.useFakeTimers() dhe jest.advanceTimersByTime() për të simuluar kohën 

3. Async Geolocation Permission: 

Problem: Geolocation.getCurrentPosition() është callback-based dhe duhej të konvertohej në Promise 

Zgjidhje: Krijuar wrapper function me Promise.resolve/reject për të kompatuar me async/await 

4. Dark Mode Testing me next-themes: 

Problem: next-themes përdor Context API dhe duhej të mock-ohej për teste 

Zgjidhje: Krijuar wrapper component me ThemeProvider mock për test environment 

5. Animacione dhe CSS Transitions Testing: 

Problem: Testet duhej të verifikonin që animacione funksionojnë por pa pritje të vërtetë 

Zgjidhje: Përdorur jest.runOnlyPendingTimers() dhe query për class changes në vend të animation duration 

6. localStorage Mock në Tests: 

Problem: localStorage nuk është i disponueshëm në Node environment 

Zgjidhje: Krijuar mock implementation në jest.setup.js me Map për të simuluar storage 

7. Forecast Data Transformation: 

Problem: API response për forecast ka strukturë komplekse me lista për 40+ items (5 ditë * 8 readings) 

Zgjidhje: Krijuar utility function për të grupëzuar të dhënat sipas datës dhe për të marrë temp max/min për ditë 

 

6️⃣ Plani për javën e ardhshme 

Shkruani çfarë planifikoni të punoni javën tjetër. 

Për javën e ardhshme planifikoj të shtoj këto funksionalitete duke vazhduar me TDD: 

Weather Alerts dhe Notifications: 

Teste për weather alerts (extreme weather, warnings) 

Browser notifications API integration 

User preferences për alerts 

Search History: 

Teste për ruajtjen e search history 

Display i recent searches 

Quick access për previous searches 

Favorite Cities: 

Teste për add/remove favorite cities 

Persistent storage për favorites 

Quick access panel për favorite cities 

Weather Charts: 

Teste për temperature chart visualization 

Recharts integration për line charts 

Hourly temperature trends 

Internationalization (i18n): 

Teste për multi-language support 

Translation files management 

Language switcher component 

API Error Recovery: 

Teste për retry mechanism 

Offline mode handling 

Error boundary implementation 

 

7️⃣ Mbulesa e testimit (nëse aplikohet) 

 

% e mbulesës aktuale: 92.5% 

Coverage Details: ``` ----------------------------|---------|----------|---------|---------| 

File 

% Stmts 

% Branch 

% Funcs 

% Lines 

All files 

92.50 

90.00 

100 

92.50 

components 

95.00 

92.50 

100 

95.00 

weather-search.tsx 

94.44 

91.67 

100 

94.44 

weather-forecast.tsx 

95.45 

93.33 

100 

95.45 

theme-toggle.tsx 

93.75 

87.50 

100 

93.75 

lib 

90.00 

87.50 

100 

90.00 

weather-api.ts 

91.67 

85.71 

100 

91.67 

cache-service.ts 

88.89 

87.50 

100 

88.89 

hooks 

91.67 

90.00 

100 

91.67 

use-geolocation.ts 

92.31 

88.89 

100 

92.31 

use-weather-cache.ts 

91.18 

91.67 

100 

91.18 

---------------------------- 

--------- 

---------- 

--------- 

--------- 

``` 

 

 

 

 

Vegla e përdorur: Jest (built-in coverage tool) - npm run test:coverage 

Targetimi:  

Statements: 92.50% (target: 80%) 

Branches: 90.00% (target: 80%) 

Functions: 100% (target: 80%) 

Lines: 92.50% (target: 80%) 

Të gjitha targetet e coverage janë arritur dhe tejkaluar. Target i ri është vendosur në 80% për të gjitha kategoritë. 

 

8️⃣ Komente / reflektime të grupit 

Procesi TDD vazhdon të jetë efektiv për sigurimin e cilësisë së kodit. Gjatë kësaj jave, testimet parë (Red phase) ndihmuan në identifikimin e edge cases për geolocation dhe cache expiry që nuk do të ishin të dukshme pa teste.  

Refaktorimi pas testimit (Refactor phase) rezultoi në kod më të pastër dhe strukturë më të mirë me custom hooks dhe service modules. Caching implementation doli më kompleks se pritej, por TDD ndihmoi në zbërthimin e problemit në hapa të vegjël.  

Testimi i browser APIs (Geolocation) në environment test doli sfidues, por mock implementations e bënë të mundur testim të plotë të logjikës. 

📎 Ngjitjet (opsionale) 

- Screenshots nga testet që kalojnë / dështojnë 
- Link i GitHub-it 
- Raporti i CI/CD ose code coverage 
 
 
https://github.com/eriDev1/weather-app 

 

 