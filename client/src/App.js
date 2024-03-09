import AppRouter from "./routes/AppRouter"
import Preloader from "./components/preloader/Preloader"
import {useState, useEffect } from "react"
import "./style.scss"

export default function App() {

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fakeDataFetch = () => {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    };

    fakeDataFetch();
  }, []);

  return (
    <div>
      {loading ? <Preloader /> : <AppRouter />}
    </div>
  )
}
