import Stories from "../../components/stories/Stories";
import Share from "../../components/share/Share";
import Posts from "../../components/posts/Posts";
import './home.scss'

export default function Home() {
   return (
    <div className="home">
      <Stories/>
      <Share/>
      <Posts/>
    </div>
   )
}
