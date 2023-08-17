import React from "react";

const Header = ({ setQuery }) => {
  const cities = [
    {
      id: 1,
      name: "Rawalpindi",
    },
    {
      id: 2,
      name: "Lahore",
    },
    {
      id: 3,
      name: "Karachi",
    },
    {
      id: 4,
      name: "Multan",
    },
  ];

  return (
    <div className="flex items-center justify-around my-6">
      {cities.map((city, key) => {
        return (
          <button
            className="text-white text-lg font-medium"
            key={city.id}
            onClick={() => setQuery({ q: city.name })}
          >
            {city.name}
          </button>
        );
      })}
    </div>
  );
};

export default Header;
