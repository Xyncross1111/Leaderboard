import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (credentials.username === process.env.ADMIN_USERNAME && 
              credentials.password === process.env.ADMIN_PASSWORD) {
            return { 
              id: 1, 
              name: 'Admin', 
              email: 'admin@example.com', 
              role: 'admin' 
            };
          }
          return null;
        } catch (error) {
          console.error('Error during authorization:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.JWT_SECRET,
});

export { handler as GET, handler as POST };