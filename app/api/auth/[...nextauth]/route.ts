import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import dbConnect from '@/lib/dbConnect'; // Adjust path if needed
import User from '@/lib/models/User'; // Adjust path if needed

const authOptions : AuthOptions = {
  // 1. CONFIGURE LOGIN PROVIDERS
  providers: [
    // Add Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    // Add Facebook Provider
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    
    // Your existing Credentials Provider (unchanged)
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {},
        password: {},
        rememberMe: {},
      },
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error('No credentials provided.');
        }

        await dbConnect();

        const user = await User.findOne({
          email: credentials.email,
        }).select('+password');

        if (!user) {
          return null;
        }

        const isValid = await user.comparePassword(credentials.password,user.password);

        if (!isValid) {
          return null;
        }

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          userSubscriptionLevel: user.userSubscriptionLevel,
          rememberMe: credentials.rememberMe === 'true',
        };
      },
    }),
  ],

  // 2. CONFIGURE SESSION STRATEGY
  session: {
    strategy: 'jwt'
  },

  // 3. ADD YOUR SECRET
  secret: process.env.NEXTAUTH_SECRET,

  // 4. CONFIGURE CUSTOM PAGES
  pages: {
    signIn: '/signin',
  },

  // 5. CALLBACKS (Extended to handle OAuth)
  callbacks: {
    // Handle OAuth sign-ins
    async signIn({ user, account, profile }) {
      // Only handle OAuth providers, let credentials flow through unchanged
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        await dbConnect();
        
        // Check if user exists
        let existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          // Create new user for OAuth
          existingUser = await User.create({
            name: user.name,
            email: user.email,
            profilePicture: user.image,
            userSubscriptionLevel: 'free', // Default level
            provider: account.provider,
            providerId: account.providerAccountId,
          });
        }
        
        // Add database info to user object
        user.id = existingUser._id.toString();
        user.userSubscriptionLevel = existingUser.userSubscriptionLevel;
        user.profilePicture = existingUser.profilePicture || user.image;
      }
      
      return true;
    },

    // Your existing JWT callback with OAuth support
    async jwt({ token, user, account }) {
      if (user) {
        const thirtyDays = 30 * 24 * 60 * 60;
        const oneDay = 20;
        
        // For OAuth, default to longer sessions; for credentials, use rememberMe
        const isOAuth = account?.provider === 'google' || account?.provider === 'facebook';
        const sessionIsLongLived = user.rememberMe || isOAuth;
        const expirationTime = Math.floor(Date.now() / 1000) + (sessionIsLongLived ? thirtyDays : oneDay);

        token.id = user.id;
        token.name = user.name;
        token.exp = expirationTime;
        token.email = user.email;
        token.profilePicture = user.profilePicture;
        token.userSubscriptionLevel = user.userSubscriptionLevel;
      }
      return token;
    },

    // Your existing session callback (unchanged)
    async session({ session, token }) {
      if (session.user && token) {
        session.expires = new Date(token.exp * 1000).toISOString();
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.profilePicture = token.profilePicture;
        session.user.userSubscriptionLevel = token.userSubscriptionLevel;
      }
      return session;
    },
  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
