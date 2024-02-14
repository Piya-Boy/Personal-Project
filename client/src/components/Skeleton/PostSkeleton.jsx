import React from 'react'
import Skeleton from "react-loading-skeleton";

export default function PostSkeleton () {
 return (
   <div className="post">
     <div className="container">
       <div className="user">
         <div className="userInfo">
           {/* Skeleton for user profile picture */}
           <Skeleton circle width={40} height={40} />
           <div className="details">
             {/* Skeleton for user name */}
             <Skeleton width={100} />
             {/* Skeleton for post date */}
             <Skeleton width={60} />
           </div>
         </div>
         {/* Skeleton for more icon */}
         <Skeleton circle width={24} height={24} />
       </div>
       <div className="content">
         {/* Skeleton for post description */}
         <Skeleton count={3} />
         {/* Skeleton for post image */}
         <Skeleton width={200} height={150} />
       </div>
       <div className="info">
         <div className="item">
           {/* Skeleton for like icon */}
           <Skeleton circle width={24} height={24} />
           {/* Skeleton for like count */}
           <Skeleton width={60} />
         </div>
         <div className="item">
           {/* Skeleton for comment icon */}
           <Skeleton circle width={24} height={24} />
           {/* Skeleton for comment count */}
           <Skeleton width={80} />
         </div>
         <div className="item">
           {/* Skeleton for share icon */}
           <Skeleton circle width={24} height={24} />
           {/* Skeleton for share text */}
           <Skeleton width={60} />
         </div>
       </div>
     </div>
   </div>
 );

}
