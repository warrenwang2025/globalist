import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

// We are "declaring" a module, which allows us to merge our own types
// with the original types from the 'next-auth' and 'next-auth/jwt' libraries.

declare module 'next-auth' {
  /**
   * This is the session object that will be returned by `useSession()` and `getSession()`.
   */
  interface Session {
    user: {
      id: string;
      name?: string; // Optional property for user's name
      email?: string; // Optional property for user's email
      profilePicture?: string; // Optional property for profile picture
      userSubscriptionLevel?: string; // Optional property for user type (e.g., 'admin',
      expires?: string; // Optional property for session expiration time
    } & DefaultSession['user']; // Keep the default properties like name, email, image
  }

  /**
   * This is the user object that will be returned from the `authorize` callback.
   */
  interface User extends DefaultUser {
    // Add your custom properties here.
    id: string;
    name?: string; // Optional property for user's name
    email?: string; // Optional property for user's email
    profilePicture?: string; // Optional property for profile picture
    userSubscriptionLevel?: string; // Optional property for user type (e.g., 'admin',
    rememberMe?: boolean; // Optional property for remember me functionality
  }
}

declare module 'next-auth/jwt' {
  /**
   * This is the token that is received by the `jwt` callback and the `session` callback.
   */
  interface JWT extends DefaultJWT {
    // Add your custom properties here.
    id: string;
    name?: string;
    email?: string;
    profilePicture?: string; // Optional property for profile picture
    userSubscriptionLevel?: string; // Optional property for user type (e.g., 'admin', 'user', etc.)
    rememberMe?: boolean; // Optional property for remember me functionality
    exp: number; // Optional property for token expiration time
  }
}