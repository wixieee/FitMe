import React, { useState } from "react";
const MyComponent = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Лічильник:{count}</h1>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
};
export default MyComponent;
