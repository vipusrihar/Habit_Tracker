import { createContext, useState } from "react";


const LoginContext = createContext();


function Provider(props) {
  const [isLoggedIn, setIsLoggedin] = useState(true);

  return (
    <LoginContext.Provider value={[isLoggedIn, setIsLoggedin]}>
      {props.children}
    </LoginContext.Provider>
  );
}

export { Provider };
export default LoginContext;
