// Tuodaan Weather-komponentti
import Weather from './components/Weather';

// Pääsivu, joka renderöi Weather-komponentin
export default function Home() {
  return (
    <main>
      <Weather />
    </main>
  );
}
