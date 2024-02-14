
export default function Suggestions() {
  
  const suggestions=[
    {
      id: 1,
      name: "Jane Doe",
      img: "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600",
    },
    {
      id: 2,
      name: "Jane Doe",
      img: "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600",
    }
  ]

  return (
    <div className="item">
      <span>Suggestions For You</span>
      {suggestions.map((suggestion) => (
        <div className="user" key={suggestion.id}>
          <div className="userInfo">
            <img
              src={suggestion.img}
              alt=""
            />
            <span>{suggestion.name}</span>
          </div>
          <div className="buttons">
            <button>follow</button>
            <button>dismiss</button>
          </div>
        </div>
      ))}
    </div>
  );
}
