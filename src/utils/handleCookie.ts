// Define an interface for the arguments
interface CookieOptions {
  duration: number;
  cookieVariable: string;
  cookieValue: string;
  idBasedVariables: string;
  id: string;
  res: {
    cookie: (
      cookieVariable: string,
      cookieValue: string,
      options: {
        httpOnly: boolean;
        sameSite: string;
        secure: boolean;
        expires: Date;
      }
    ) => void;
  };
}

// Define the function using the interface
export const handleCookies = ({
  duration,
  cookieVariable,
  cookieValue,
  idBasedVariables,
  id,
  res,
}: CookieOptions) => {
  // cookie expiration time
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + duration);

  // Set the main cookie
  res.cookie(cookieVariable, cookieValue, {
    httpOnly: false,
    sameSite: 'none',
    secure: true,
    expires,
  });

  // Set the cookie containing the user ID
  res.cookie(idBasedVariables, id, {
    httpOnly: false,
    sameSite: 'none',
    secure: true,
    expires,
  });
};

export const getCookieInfo = (Cookiearray: string[]) => {
  const obj: { [key: string]: string } = {}; // Specify object type hano ni string
  // get saved token from local storage
  for (let i = 0, len = Cookiearray.length; i < len; i += 1) {
    const parts = Cookiearray[i].split('=');
    const key = parts[0].trim(); // Trim the key
    const value = parts[1].trim().replace(/=/g, ':');
    obj[key] = value;
  }

  const cookieObjects = obj;
  return cookieObjects;
};
