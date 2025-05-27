import { AuthenticationError } from 'apollo-server-express';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      if (context.user) {
        const userData = await User.findById(context.user._id).select('-__v -password');
        return userData;
      }
      throw new AuthenticationError('Not logged in');
    },
  },

  Mutation: {
    login: async (_parent: any, { email, password }: any) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },

    addUser: async (_parent: any, args: any) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (_parent: any, { book }: any, context: any) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: book } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in');
    },

    removeBook: async (_parent: any, { bookId }: any, context: any) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in');
    },
  },
};

export default resolvers;
