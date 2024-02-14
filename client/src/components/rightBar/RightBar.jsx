import LatestActivities from '../latestactivities/LatestActivities';
import Suggestions from '../suggestions/Suggestions';
import OnlineFriends from '../onlinefriends/OnlineFriends';
import './rightBar.scss'

export default function RightBar() {
    return (
      <div className="rightBar">
        <div className="container">
          <Suggestions />
          <LatestActivities/>
          <OnlineFriends />
        </div>
      </div>
    );
}
