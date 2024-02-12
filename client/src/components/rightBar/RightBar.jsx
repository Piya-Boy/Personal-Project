import LatestActivities from '../latestactivities/LatestActivities';
import OnlineFriends from '../onlinefriends/OnlineFriends';
import Suggestions from '../suggestions/Suggestions';
import './rightBar.scss'

export default function RightBar() {
    return (
      <div className="rightBar">
        <div className="container">
          <Suggestions />
          <LatestActivities />
          <OnlineFriends/>
        </div>
      </div>
    );
}
