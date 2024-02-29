import Stories from "../../components/stories/Stories";
import Share from "../../components/share/Share";
import Posts from "../../components/posts/Posts";
import { useEffect } from "react";
import './home.scss'

export default function Home() {

  useEffect(() => {
    document.title = "Dev Book";
  })
   return (
    <div className="home">
      <Stories/>
      <Share/>
      <Posts/>
    </div>
   )
}
