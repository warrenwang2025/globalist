import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/dbConnect'; // Adjust path if needed
import User from '@/lib/models/User'; // Adjust path if needed

const authOptions : AuthOptions =     {
  // 1. CONFIGURE LOGIN PROVIDERS
  providers: [
    CredentialsProvider({
      // This is the "provider" for traditional email & password login.
      name: 'Credentials',
      credentials: {
        email: {},
        password: {},
        rememberMe: {}, // Optional field for remember me functionality
      },

      // This 'authorize' function is WHERE YOUR LOGIN LOGIC GOES.
      // It's the replacement for your old POST /api/login route.
      authorize: async (credentials) => {

        if (!credentials) {
          throw new Error('No credentials provided.');
        }

        await dbConnect();
        console.log('Connected to the database.');

        const user = await User.findOne({
          email: credentials.email,
        }).select('+password');

        if (!user) {
          // NextAuth.js will handle the error and show it on the login form.
          return null;
        }

        const isValid = await user.comparePassword(credentials.password,user.password);

        if (!isValid) {
          return null;
        }

        // If everything is correct, return the user object.
        // NextAuth.js will then automatically handle creating the session, JWT, and cookie.
        // Make sure to NOT return the password.
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          userType: user.userType,
          rememberMe: credentials.rememberMe === 'true', // Convert string to boolean
        };
      },
    }),
    // You can easily add more providers here later!
    // e.g., GoogleProvider({ ... })
  ],

  // 2. CONFIGURE SESSION STRATEGY
  session: {
    // We'll use JSON Web Tokens for our session strategy. This is stateless.
    strategy: 'jwt'
  },

  // 3. ADD YOUR SECRET
  // This is used to sign the JWT. It's like your old JWT_SECRET.
  secret: process.env.NEXTAUTH_SECRET,

  // 4. CONFIGURE CUSTOM PAGES (Optional but recommended)
  pages: {
    signIn: '/signin', // Tell NextAuth.js that your login page is at `/login`
    // You can also specify pages for signOut, error, verifyRequest, etc.
  },

  // 5. CALLBACKS (Advanced customization)
  // Callbacks let you control what happens at different stages.
  callbacks: {
    // This callback adds custom data (like user ID and username) to the JWT.
    async jwt({ token, user }) {
      if (user) {
        // --- This is the core logic for "Remember Me" ---
        const thirtyDays = 30 * 24 * 60 * 60;
        // const oneDay = 24 * 60 * 60;
        const oneDay = 20;
        
        // Check the rememberMe flag we passed from `authorize`
        const sessionIsLongLived = user.rememberMe;
        const expirationTime = Math.floor(Date.now() / 1000) + (sessionIsLongLived ? thirtyDays : oneDay);

        // Set the token's expiration
        // --- End of Remember Me logic ---
        
        // Persist the other user data to the token
        token.id = user.id;
        token.name = user.name;
        token.exp = expirationTime;
        token.email = user.email;
        token.profilePicture = user.profilePicture;
        token.userType = user.userType;
      }
      return token;
    },
    // This callback adds the custom data from the JWT to the session object
    // so you can access it on the client-side.
    async session({ session, token }) {
      if (session.user && token) {
        session.expires = new Date(token.exp * 1000).toISOString();
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.profilePicture = token.profilePicture;
        session.user.userType = token.userType;
      }
      return session;
    },
  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };